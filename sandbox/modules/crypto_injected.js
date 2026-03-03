global.modules.crypto = {
    createHash: (algorithm, data, encoding) => {
        return _cryptoCreateHash.applySync(undefined, [algorithm, data, encoding], {
            arguments: { copy: true },
            result: { copy: true }
        });
    },
    decryptAesGcm: (cipherBuf, keyBuf) => {
        return _cryptoDecryptAesGcm.applySync(undefined, [cipherBuf, keyBuf], {
            arguments: { copy: true },
            result: { copy: true }
        });
    },
};
