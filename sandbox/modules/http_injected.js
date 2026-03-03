global.modules.http = {
    fetch: (url) => {
        return new Promise((resolve, reject) => {
            _httpFetch.apply(undefined, [url], {
                arguments: { copy: true },
                result: { promise: true, copy: true }
            }).then(resolve).catch(reject);
        });
    },
};
