const ivm = require("isolated-vm");
const fs = require("fs");
const path = require("path");

async function register(context, { cwd } = {}) {
    // Register sqlite query function
    context.global.setSync(
        "_sqliteQuery",
        new ivm.Reference((dbPath, query) => {
            try {
                // Resolve path relative to cwd
                const resolvedPath = path.resolve(cwd || process.cwd(), dbPath);
                const Database = require("better-sqlite3");
                const db = new Database(resolvedPath, { readonly: true });
                const stmt = db.prepare(query);
                const rows = stmt.all();
                db.close();
                return JSON.stringify(rows);
            } catch (e) {
                return JSON.stringify({ error: e.message });
            }
        })
    );

    const injectedCode = fs.readFileSync(
        path.join(__dirname, "sqlite_injected.js"),
        "utf-8"
    );
    await context.eval(injectedCode);
}

module.exports = { register };
