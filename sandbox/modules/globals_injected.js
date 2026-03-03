global.modules = {};
global.exports = {};
global.module = { exports: global.exports };

global.require = (moduleName) => {
    if (global.modules[moduleName]) {
        return global.modules[moduleName];
    }
    throw new Error(`Cannot require module ${moduleName}`);
};

// Proper Buffer polyfill for sandbox
global.Buffer = (function () {
    function hexToBytes(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
        }
        return bytes;
    }
    function bytesToHex(bytes) {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    function strToBytes(str) {
        const arr = new Uint8Array(str.length * 3);
        let len = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c < 0x80) { arr[len++] = c; }
            else if (c < 0x800) { arr[len++] = 0xc0 | (c >> 6); arr[len++] = 0x80 | (c & 0x3f); }
            else { arr[len++] = 0xe0 | (c >> 12); arr[len++] = 0x80 | ((c >> 6) & 0x3f); arr[len++] = 0x80 | (c & 0x3f); }
        }
        return arr.slice(0, len);
    }
    function bytesToStr(bytes) {
        let str = '';
        for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            if (b < 0x80) { str += String.fromCharCode(b); }
            else if ((b & 0xe0) === 0xc0) { str += String.fromCharCode(((b & 0x1f) << 6) | (bytes[++i] & 0x3f)); }
            else { str += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f)); }
        }
        return str;
    }

    class BufClass extends Uint8Array {
        toString(encoding) {
            if (!encoding || encoding === 'utf-8' || encoding === 'utf8') return bytesToStr(this);
            if (encoding === 'hex') return bytesToHex(this);
            if (encoding === 'base64') return btoa(String.fromCharCode(...this));
            return bytesToStr(this);
        }
        static isBuffer(obj) { return obj instanceof BufClass || obj instanceof Uint8Array; }
        static from(input, encoding) {
            if (input instanceof Uint8Array) return new BufClass(input);
            if (input instanceof ArrayBuffer) return new BufClass(input);
            if (typeof input === 'string') {
                if (encoding === 'hex') return new BufClass(hexToBytes(input).buffer);
                return new BufClass(strToBytes(input).buffer);
            }
            if (Array.isArray(input)) return new BufClass(new Uint8Array(input).buffer);
            return new BufClass(input);
        }
        static concat(bufs) {
            const total = bufs.reduce((s, b) => s + b.length, 0);
            const result = new BufClass(total);
            let offset = 0;
            for (const b of bufs) { result.set(b, offset); offset += b.length; }
            return result;
        }
        static alloc(size) { return new BufClass(size); }
    }
    return BufClass;
})();

global.TextEncoder = class TextEncoder {
    encode(str) {
        return Buffer.from(str);
    }
};

global.atob = (b64) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let bytes = [];
    let i = 0;
    while (i < b64.length) {
        const c1 = chars.indexOf(b64[i++]);
        const c2 = chars.indexOf(b64[i++]);
        const c3 = chars.indexOf(b64[i++]);
        const c4 = chars.indexOf(b64[i++]);
        bytes.push((c1 << 2) | (c2 >> 4));
        if (c3 !== 64) bytes.push(((c2 & 0xf) << 4) | (c3 >> 2));
        if (c4 !== 64) bytes.push(((c3 & 0x3) << 6) | c4);
    }
    return String.fromCharCode(...bytes);
};
global.btoa = (str) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '', i = 0;
    const b = str.split('').map(c => c.charCodeAt(0));
    while (i < b.length) {
        const b0 = b[i++], b1 = b[i++], b2 = b[i++];
        result += chars[b0 >> 2] + chars[((b0 & 3) << 4) | (b1 >> 4)];
        result += b1 !== undefined ? chars[((b1 & 0xf) << 2) | (b2 >> 6)] : '=';
        result += b2 !== undefined ? chars[b2 & 0x3f] : '=';
    }
    return result;
};


