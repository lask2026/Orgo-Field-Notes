import fs from 'node:fs';import {readJSON} from './cases.mjs';
const rows=[];
for(let id=1;id<=12;id++){
 const dir=`chapter-${String(id).padStart(2,'0')}`,p=`review-packets/${dir}`;if(!fs.existsSync(`${p}/cases.json`))continue;
 const packet=readJSON(`${p}/cases.json`),manifest=fs.existsSync(`${p}/pdf-manifest.json`)?readJSON(`${p}/pdf-manifest.json`):null;
 const current=manifest?.sourceSnapshot.sha256===packet.sourceSnapshot.sha256;
 const pdf=(name,label)=>{const meta=manifest?.files.find(f=>f.file===name);return current&&meta?`[${label}](${dir}/${name}) (${meta.pages} pages, ${Math.round(meta.bytes/1024)} KiB)`:'Not generated/current';};
 rows.push(`| ${String(id).padStart(2,'0')} · ${packet.title} | ${pdf('01-BLIND-EXERCISES.pdf','Blind exercises')} | ${pdf('02-CHAPTER-REVIEW.pdf','Full review')} | [Prompt](${dir}/AI-STUDIO-PROMPT.txt) |`);
}
fs.writeFileSync('review-packets/INDEX.md',`# Chapter upload files\n\nRead [START-HERE.md](START-HERE.md) for the AI Studio and PowerShell Llama workflows. Upload a PDF directly, one chapter at a time. For independent solving, use the blind PDF in a fresh chat before sharing the full packet. Full packets contain keys, lessons, hints, graph data and rendering evidence. No textbook reference passages are embedded.\n\n| Chapter | Independent solving | Content/rendering audit | Instructions |\n|---|---|---|---|\n${rows.join('\n')}\n\nCases and screenshots were generated from a source snapshot. Regenerate after app/content edits. Packet completeness and model completion are not scientific verification.\n`);
console.log('Updated review-packets/INDEX.md');
