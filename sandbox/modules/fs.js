const ivm = require("isolated-vm");
const fs = require("fs");
const path = require("path");

function validatePath(cwd, targetPath) {
  const resolvedPath = path.resolve(cwd, targetPath);
  if (!resolvedPath.startsWith(path.resolve(cwd))) {
    throw new Error(
      "Access denied: Cannot access paths outside of current directory."
    );
  }
  return resolvedPath;
}

function createReadFileCallback(cwd) {
  return function (fileName, encoding) {
    try {
      const resolvedPath = validatePath(cwd, fileName);
      if (encoding !== undefined) {
        return fs.readFileSync(resolvedPath, encoding);
      }
      return fs.readFileSync(resolvedPath);
    } catch (e) {
      throw new Error(`Error reading file: ${e.message}`);
    }
  };
}

function createReaddirCallback(cwd) {
  return function (dirPath) {
    try {
      const resolvedPath = validatePath(cwd, dirPath);
      return fs.readdirSync(resolvedPath);
    } catch (e) {
      throw new Error(`Error reading directory: ${e.message}`);
    }
  };
}


async function register(context, { cwd }) {
  context.global.setSync("_readFileSync", new ivm.Reference(createReadFileCallback(cwd)));
  context.global.setSync("_readdirSync", new ivm.Reference(createReaddirCallback(cwd)));


  const injectedCode = fs.readFileSync(
    path.join(__dirname, 'fs_injected.js'),
    'utf-8'
  );
  await context.eval(injectedCode);
}

module.exports = { register };

