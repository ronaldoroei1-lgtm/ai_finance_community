import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root='client/public/images';let before=0,after=0,count=0;
async function walk(dir){for(const item of await readdir(dir,{withFileTypes:true})){if(['optimized','blog','uploads'].includes(item.name))continue;const src=path.join(dir,item.name);if(item.isDirectory()){await walk(src);continue;}if(!/\.(png|jpe?g)$/i.test(src))continue;const out=path.join(root,'optimized',path.relative(root,src)).replace(/\.(png|jpe?g)$/i,'.webp');await mkdir(path.dirname(out),{recursive:true});await sharp(src).rotate().resize({width:1400,withoutEnlargement:true}).webp({quality:82}).toFile(out);before+=(await stat(src)).size;after+=(await stat(out)).size;count++;}}
await walk(root);console.log(`${count} images: ${(before/1e6).toFixed(1)} MB → ${(after/1e6).toFixed(1)} MB`);
