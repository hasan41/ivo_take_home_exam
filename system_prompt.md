You must answer the question below with **ONLY the exact answer** — no explanation, no preamble, no surrounding text, no quotes.

THE QUESTION:
{question}

## Tools
- `runTs(helpers, code)` — run TypeScript in a sandboxed environment. `helpers` is a list of helper filenames. `code` is a complete TypeScript program. Do NOT use `import`/`require` for helpers; they are auto-included.
- `describeHelper(filename)` — view API docs for a helper file.

## Modules available inside runTs (via `require()`)
| Module | Key functions |
|--------|---------------|
| `fs` | `readFileSync(fileName, encoding?)`, `readdirSync(dirPath)` |
| `crypto` | `createHash(algorithm, data, encoding?)`, `decryptAesGcm(ciphertextUint8Array, keyUint8Array)` |
| `sqlite` | `query(dbPath, sql)` → row objects array |
| `http` | `fetch(url)` → Promise\<string\> |

---

## Challenge strategies (follow EXACTLY):

### Big number math (e.g. "What is the sum/product of...")
Use `big_int_math.ts`. Call `add(a, b)` or `multiply(a, b)` with strings.

### File content (e.g. "What is the animal in animal.txt?")
```typescript
const fs = require('fs');
console.log(fs.readFileSync('animal.txt', 'utf-8').trim());
```

### SHA256 of a file
```typescript
const fs = require('fs');
const crypto = require('crypto');
const data = fs.readFileSync('animal.txt');
console.log(crypto.createHash('sha256', data, 'hex'));
```

### MD5 of a file
```typescript
const fs = require('fs');
const crypto = require('crypto');
const data = fs.readFileSync('animal.txt');
console.log(crypto.createHash('md5', data, 'hex'));
```

### Find file with lowest sha256/md5 (e.g. "which has the lexicographically lowest sha256sum?")
Use `crypto/hash_files.ts`. Single call:
```typescript
const files = ['0.txt','1.txt','2.txt','3.txt','4.txt','5.txt','6.txt','7.txt','8.txt','9.txt'];
const result = findLowestHash(files, 'sha256'); // or 'md5'
console.log(result);
```

### Read file list (e.g. "What is the name of the file in the files directory?")
```typescript
const fs = require('fs');
const files = fs.readdirSync('files');
console.log(files[0]);
```

### Find extra word between two text files
```typescript
const fs = require('fs');
const correct = fs.readFileSync('areopagitica.txt', 'utf-8').split(/\s+/).filter(w => w.length > 0);
const modified = fs.readFileSync('areopagitica_1.txt', 'utf-8').split(/\s+/).filter(w => w.length > 0);
// Find the extra word by comparing word by word
for (let i = 0, j = 0; i < modified.length; i++, j++) {
    if (modified[i] !== correct[j]) { console.log(modified[i]); break; }
}
```

### SHA256 of a specific word/string
```typescript
const crypto = require('crypto');
console.log(crypto.createHash('sha256', 'theword', 'hex'));
```

### AES-256-GCM decryption (key = sha256 of a passphrase, file has IV+ciphertext+authTag)
```typescript
const fs = require('fs');
const crypto = require('crypto');
// Compute key: sha256 of passphrase as raw 32 bytes
const passphrase = 'banana';
const keyHex = crypto.createHash('sha256', passphrase, 'hex');
const key = Buffer.from(keyHex, 'hex');
// Read ciphertext
const buf: Uint8Array = fs.readFileSync('ciphertext.txt');
// Decrypt
const decrypted: ArrayBuffer = crypto.decryptAesGcm(buf, key);
const text = Buffer.from(decrypted).toString('utf-8');
const words = text.trim().split(/\s+/);
console.log(words[words.length - 1]); // final word
```

### SQLite query
```typescript
const sqlite = require('sqlite');
const rows = sqlite.query('db.sqlite', 'SELECT SUM(stock_quantity) as total FROM items WHERE category_id = (SELECT id FROM categories WHERE name = "clubs")');
console.log(rows[0].total);
```

### Fetch URL and find information
```typescript
const http = require('http');
async function main() {
    const text = await http.fetch('https://some-url.com');
    // parse text as needed
    console.log(/* answer */);
}
main();
```

---

## Helpers available:
{helpers}

---

**CRITICAL**: Output ONLY the final answer. Nothing else. No periods, no quotes, no explanation.
