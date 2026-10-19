// Authoring helpers. Generated JSON remains the runtime source of truth.
import fs from 'node:fs';
export const molecules=JSON.parse(fs.readFileSync('chapters/molecules.json'));
export function graph(id,name,formula,atoms,bonds,cond=name,extra={}){molecules[id]={name,formula,atoms:atoms.map(([e,x,y,charge,h])=>({e,x,y,...(charge?{charge}:{}),...(h!==undefined?{h}:{})})),bonds,w:Math.max(320,...atoms.map(a=>a[1]+40)),h:Math.max(200,...atoms.map(a=>a[2]+30)),cond,review:'Original teaching graph; author reviewed connectivity and formula; external expert review pending.',...extra};return id;}
export function chain(id,n,name,formula,branches=[],orders={}){
 const atoms=Array.from({length:n},(_,i)=>['C',50+i*58,115-i%2*30]);
 const bonds=Array.from({length:n-1},(_,i)=>[i,i+1,orders[i]||1]);
 for(const b of branches){const [e,to,order=1,x=atoms[to][1],y=35,charge,h]=b;atoms.push([e,x,y,charge,h]);bonds.push([to,atoms.length-1,order]);}
 return graph(id,name,formula,atoms,bonds);
}
export function ring(id,name,formula,branches=[],orders={}){
 const atoms=Array.from({length:6},(_,i)=>['C',170+68*Math.cos((i*60-90)*Math.PI/180),105+68*Math.sin((i*60-90)*Math.PI/180)]),bonds=Array.from({length:6},(_,i)=>[i,(i+1)%6,orders[i]||1]);
 for(const [e,to,order=1,x=170,y=5,charge,h] of branches){atoms.push([e,x,y,charge,h]);bonds.push([to,atoms.length-1,order]);}return graph(id,name,formula,atoms,bonds);
}
export const step=(label,text,molecule,highlights={},extra={})=>({label,text:'<p>'+text+'</p>',molecule,highlights,reveal:false,...extra});
export const cards=(rule,cue,trap,app)=>Object.fromEntries(Object.entries({rule,cue,trap,app}).map(([k,t])=>[k,'<p>'+t+'</p>']));
export const lesson=(id,label,molecule,tag,c,steps)=>({id,label,title:label,molecule,tag,cards:c,steps});
export const atoms=(prompt,answer,explanation,hints,highlights={})=>({type:'atoms',prompt,skill:'Read the structure',answer,explanation,hints,highlights});
export const choice=(prompt,options,answer,explanation,hints,highlights={})=>({type:'choice',prompt,skill:'Apply the rule',options,answer,explanation,hints,highlights});
export const text=(prompt,accepted,explanation,hints,highlights={})=>({type:'text',prompt,skill:'State your conclusion',accepted,explanation,hints,highlights});
export const number=(prompt,answer,unit,explanation,hints,tolerance=0)=>({type:'number',prompt,skill:'Calculate and interpret',answer,unit,tolerance,explanation,hints,highlights:{}});
export const exercise=(id,lesson,molecule,title,stages,summary,extra={})=>({id,lesson,molecule,label:title,title,stages,summary,...extra});
export function writeChapter(id,title,description,objectives,lessons,exercises,extraSources=[]){
 const ch={schemaVersion:1,id,title,description,objectives,sources:[{label:`Supplied Kaplan curriculum: Chapter ${id}; section scope checked against local body and summary`,location:`organic_chemistry_kaplan/OEBPS/chapter${String(id).padStart(2,'0')}b.xhtml`},...extraSources],review:{status:'author-reviewed',note:'Original explanations and exercises; source-backed author review, not independent expert verification.'},lessons,exercises};
 fs.writeFileSync(`chapters/chapter-${String(id).padStart(2,'0')}.json`,JSON.stringify(ch,null,2)+'\n');fs.writeFileSync('chapters/molecules.json',JSON.stringify(molecules,null,2)+'\n');
}
