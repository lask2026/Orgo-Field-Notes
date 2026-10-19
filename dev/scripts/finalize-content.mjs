import fs from 'node:fs';import vm from 'node:vm';
const read=id=>JSON.parse(fs.readFileSync(`dev/chapters/chapter-${String(id).padStart(2,'0')}.json`));
const write=c=>fs.writeFileSync(`dev/chapters/chapter-${String(c.id).padStart(2,'0')}.json`,JSON.stringify(c,null,2)+'\n');
const reference=fs.readFileSync('dev/references/Orgo-Field-Notes-v5.html','utf8').split('<script>')[1];
const old=vm.runInNewContext(reference.slice(reference.indexOf('const C='),reference.indexOf('const KEY='))+';LEARN');
const c1=read(1);c1.lessons.forEach((l,i)=>l.steps.forEach((s,j)=>s.focus=old[i].steps[j].f));
// Keep nomenclature caveats precise without extending the MCAT scope.
c1.lessons.find(l=>l.id==='carbonyls').cards.rule='<p>Aldehydes have a carbonyl carbon bonded to at least one H; ketones have two carbon substituents. The simple acyclic examples here use –al and –one. A formyl group attached to a ring may instead require a –carbaldehyde name. Subordinate carbonyl naming depends on whether its carbon belongs to the selected parent; oxo– and formyl– are not universally interchangeable.</p>';
write(c1);
const c6=read(6);const n=c6.lessons.find(l=>l.id==='nitrogen-addition');
n.cards.rule='<p>A primary amine condenses with an aldehyde or ketone to form an imine after addition, proton transfers, and water loss. A secondary amine can form an enamine when an alpha H is available. Related nitrogen reagents form oximes (hydroxylamine), hydrazones (hydrazine derivatives), and semicarbazones (semicarbazide). Cyanide addition followed by protonation forms a cyanohydrin and creates a C–C bond.</p>';
write(c6);
const c10=read(10);const a=c10.lessons.find(l=>l.id==='amino-acids');
a.cards.app='<p>Aliphatic side chains such as Ala, Val, Leu, and Ile are nonpolar; Ser and Thr have polar OH groups; Asn and Gln have polar amides. Asp/Glu are usually negatively charged near neutral pH; Lys/Arg usually positive. Histidine protonation is strongly pH- and environment-dependent. Aromatic does not always mean purely nonpolar: Tyr has a phenolic OH. At pH below pI a protein tends positive; above pI it tends negative.</p>';
const p=c10.lessons.find(l=>l.id==='phosphorus');p.cards.cue='<p>DNA/RNA backbone: phosphodiester. Between ATP phosphate groups: phosphoanhydride. Approximate aqueous phosphoric-acid pKa values are 2.1, 7.2, and 12.3, so the H2PO4−/HPO4²− pair can buffer near neutral pH; temperature and ionic conditions shift these values.</p>';
write(c10);
console.log('Final content refinements: Chapter 1 focused teaching cards; Chapters 6 and 10 scope details.');
