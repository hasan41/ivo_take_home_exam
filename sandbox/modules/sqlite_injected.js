global.modules.sqlite = {
    query: (dbPath, query) => {
        const result = _sqliteQuery.applySync(undefined, [dbPath, query], {
            arguments: { copy: true },
            result: { copy: true }
        });
        return JSON.parse(result);
    },
};
