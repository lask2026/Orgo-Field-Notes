// One-time, reproducible migration from the supplied approved reference.
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync('Orgo-Field-Notes-v5.html','utf8');
const script=html.split('<script>')[1];
const start=script.indexOf('const C=');
const end=script.indexOf("const KEY=");
const old=vm.runInNewContext(script.slice(start,end)+';({M,LEARN,GUIDED})');
const alt=fs.readFileSync('ai_studio_code (10).html','utf8');
const tries=vm.runInNewContext(alt.slice(alt.indexOf('const TRIES='),alt.indexOf('const LEARN='))+';TRIES');
fs.writeFileSync('src/styles.css',[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n'));
const clean=s=>s.replaceAll('Kaplan Mnemonic:','Memory cue:').replaceAll(' (Kaplan Q7 &amp; Q13)','').replaceAll('3-ethyl-4-methylhexane','3-ethyl-4-methylhexane');
const cards=l=>Object.fromEntries(['rule','cue','trap','app'].map(k=>[k,clean(l[k])]));
const lessons=old.LEARN.map(l=>({id:l.id,label:l.lbl,title:l.title,tag:l.tag,molecule:l.mol,cards:cards(l),steps:l.steps.map(s=>({label:s.b,text:clean(s.e),molecule:s.mol||l.mol,highlights:s.o,reveal:!!s.showName,anatomy:s.anat||l.anat,challenge:tries[s.mol||l.mol]?{prompt:tries[s.mol||l.mol].p,answer:tries[s.mol||l.mol].a,explanation:tries[s.mol||l.mol].ok}:undefined}))}));
lessons[0].cards.rule='<p>For the simple saturated acyclic structures here, choose the longest continuous carbon chain; tied lengths favor more substituents. For functionalized structures, first include the principal suffix group and required unsaturation. Compare locant sets at their first difference, not by their sum.</p>';
lessons[1].cards.trap='<p>Give the principal alcohol the lowest locant before the C=C or C≡C. If multiple-bond locant sets tie in an enyne, the double bond receives the lower locant.</p>';
lessons[2].tag='Principal suffix → Multiple bonds → Substituents';
lessons[2].cards.rule='<p>A senior suffix such as –ol determines the starting locant first. In a simple cycloalkene with no senior suffix, the double bond occupies C1 and C2. Then minimize substituent locants at the first difference; use alphabetization only for a remaining appropriate tie.</p>';
lessons[2].cards.app='<p>Ring recognition helps interpret cyclic biomolecules. Retinal is an aldehyde related to vitamin A. Steroids use established fused-ring parent numbering; do not extend simple cyclohexene numbering mechanically to steroid skeletons.</p>';
lessons[3].cards.trap='<p>Carbonyl hydration is reversible. Electron-withdrawing substituents and less crowding generally favor the hydrate. Formaldehyde is strongly hydrated in water; acetone predominantly remains a carbonyl. The equilibrium depends on conditions.</p>';
lessons[3].cards.app='<p>In aqueous aldehyde oxidation, the hydrated form can participate in oxidation to the carboxylic acid. Hydration and oxidation are distinct steps.</p>';
lessons[5].cards.rule='<p>For these examples, naming seniority is acid > anhydride > ester > amide > aldehyde > ketone > alcohol. Naming seniority is a convention, not an oxidation-state calculation. Unsaturation is retained in the parent name. This is a chapter subset, not the complete IUPAC hierarchy.</p>';
const exercises=old.GUIDED.map(g=>({id:g.id,lesson:lessons[g.cIdx].id,label:g.subLbl,title:g.title,molecule:g.mol,summary:g.final,anatomy:g.anat,stages:g.stages.map(s=>({type:s.t==='choice'?'choice':s.t==='text'?'text':'atoms',prompt:s.p,skill:s.sk,...(s.opts?{options:s.opts.map(o=>o[0]),answer:s.opts.findIndex(o=>o[1]),feedback:s.opts.map(o=>o[2])}:s.acc?{accepted:s.acc}:{answer:s.ans}),explanation:s.ok||s.opts?.find(o=>o[1])[2]||'',hints:(s.hints||['Use the molecular connectivity, then apply the rule.','Identify the principal group or the longest required parent before numbering.']).filter(h=>!h.startsWith('Worked Solution:')),highlights:s.after||{}}))}));
const chapter={schemaVersion:1,id:1,title:'Nomenclature',description:'Read a structure, identify the principal group, and assemble an unambiguous name.',objectives:['Choose parents and locants','Distinguish common functional groups','Name multifunctional compounds'],sources:[{label:'Supplied Kaplan curriculum: Chapter 1, sections 1.1–1.5',location:'organic_chemistry_kaplan/OEBPS/chapter01b.html'},{label:'IUPAC Blue Book: nomenclature conventions',location:'https://iupac.qmul.ac.uk/BlueBook/contents.html'}],review:{status:'author-reviewed',note:'Source-backed author review; not independently expert-verified.'},lessons,exercises};
fs.writeFileSync('chapters/chapter-01.json',JSON.stringify(chapter,null,2)+'\n');
const subs='₀₁₂₃₄₅₆₇₈₉';
for(const [id,m] of Object.entries(old.M)){
 if(id.startsWith('s_')){delete old.M[id];continue;}
 m.formula=m.form.replace(/[₀-₉]/g,x=>subs.indexOf(x));delete m.form;
 m.review='Migrated graph; valence/formula checked separately from chemical naming author review.';
}
fs.writeFileSync('chapters/molecules.json',JSON.stringify(old.M,null,2)+'\n');
// Keep the established rendering primitives, with accessibility/charge upgrades in src/molecules.js.
const draw=script.slice(script.indexOf('function drawMol('),script.indexOf('function renderAnatomy('));
fs.writeFileSync('src/molecules-legacy.txt',draw);
