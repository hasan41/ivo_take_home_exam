const ivm = require("isolated-vm");
const fs = require("fs");
const path = require("path");

async function register(context, { cwd } = {}) {
    // Register http fetch
    context.global.setSync(
        "_httpFetch",
        new ivm.Reference(async (url) => {
            const response = await fetch(url);
            const text = await response.text();
            return text;
        })
    );

    const injectedCode = fs.readFileSync(
        path.join(__dirname, "http_injected.js"),
        "utf-8"
    );
    await context.eval(injectedCode);
}

module.exports = { register };
