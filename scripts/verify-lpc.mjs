import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=path.resolve('public/lpc');const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));const credits=JSON.parse(fs.readFileSync(path.join(root,'credits.json')));const catalog=JSON.parse(fs.readFileSync('src/lpc-catalog.json'));
const names=new Set();
for(const asset of Object.values(manifest)){
 const data=fs.readFileSync(path.join(root,asset.file));assert.equal(data.readUInt32BE(16),576,asset.file);assert.equal(data.readUInt32BE(20),256,asset.file);assert.equal(createHash('sha256').update(data).digest('hex'),asset.sha256,asset.file);assert.ok(credits.assets.some(c=>c.filename===asset.credit),asset.file);names.add(asset.file);
}
assert.equal(new Set(catalog.map(i=>i.id)).size,catalog.length);
for(const item of catalog)for(const layers of Object.values(item.layers))for(const layer of layers){assert.ok(names.has(layer.file),layer.file);if(layer.palette){assert.equal(layer.palette.from.length,6);assert.equal(layer.palette.to.length,6);}}
for(const license of ['CC-BY-SA-3.0.txt','CC-BY-3.0.txt','CC0-1.0.txt'])assert.ok(fs.statSync(path.join(root,license)).size>1000);
console.log(`${names.size} PNGs íntegros; ${catalog.length} cosméticos; créditos e licenças presentes. Commit LPC: ${credits.commit}`);
