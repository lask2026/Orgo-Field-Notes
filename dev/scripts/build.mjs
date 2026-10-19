import {projectRoot} from '../../project-layout.mjs';
process.chdir(projectRoot);
import fs from 'node:fs';
const chapters=fs.readdirSync('dev/chapters').filter(f=>/^chapter-\d\d.json$/.test(f)).sort().map(f=>JSON.parse(fs.readFileSync('dev/chapters/'+f)));
const data={chapters,molecules:JSON.parse(fs.readFileSync('dev/chapters/molecules.json'))};
const files=['validation','progress','animations','molecules','diagrams','cardchemistry','visuals','viewer3d','learn','practice','app'];
// Namespaces avoid collisions while retaining separately testable ES modules.
let code='';
for(const name of files){
 let source=fs.readFileSync(`dev/src/${name}.js`,'utf8');const exports=[...source.matchAll(/export (?:function|const) (\w+)/g)].map(x=>x[1]);
 source=source.replace(/^import \{([^}]+)\} from '\.\/(\w+)\.js';$/gm,(_,bindings,mod)=>`const {${bindings.replace(/(\w+) as (\w+)/g,'$1:$2')}}=${mod};`).replace(/\bexport /g,'');
 code+=`const ${name}=(()=>{\n${source}\nreturn {${exports.join(',')}};})();\n`;
}
code+="app.startApp(JSON.parse(document.getElementById('appData').textContent));";
const css=fs.readFileSync('dev/src/styles.css','utf8')+'\n'+fs.readFileSync('dev/src/additions.css','utf8');
const shell=fs.readFileSync('dev/src/shell.html','utf8'),embedded=`<script id="appData" type="application/json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`;
const offline=shell.replace('<!--STYLE-->',`<style>${css}</style>`).replace('<!--DATA-->',embedded).replace('<!--SCRIPT-->',`<script>${code.replace(/<\/script/gi,'<\\/script')}</script>`);
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/app.js',code);fs.writeFileSync('dist/styles.css',css);fs.writeFileSync('dist/index.html',shell.replace('<!--STYLE-->','<link rel="stylesheet" href="styles.css">').replace('<!--DATA-->',embedded).replace('<!--SCRIPT-->','<script src="app.js"></script>'));fs.writeFileSync('dist/Orgo-Field-Notes-offline.html',offline);fs.writeFileSync('Orgo-Field-Notes-offline.html',offline);fs.writeFileSync('dist/.nojekyll','');
console.log(`Built ${chapters.length} chapters; ${Object.keys(data.molecules).length} molecules; offline ${(offline.length/1024).toFixed(0)} KiB.`);
