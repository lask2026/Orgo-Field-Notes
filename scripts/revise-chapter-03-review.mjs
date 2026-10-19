// Reproducible, idempotent Chapter 3 candidate-review content corrections.
import fs from 'node:fs';
const file='chapters/chapter-03.json',ch=JSON.parse(fs.readFileSync(file));
const orbitals=ch.lessons.find(l=>l.id==='orbitals'),bonds=ch.lessons.find(l=>l.id==='sigma-pi');
orbitals.cards.rule='<p>n = 1,2,… sets the shell. l = 0,…,n−1 sets the subshell (s,p,d,f). mₗ = −l,…,+l labels orbitals; mₛ = ±1/2 labels electron spin. Each orbital holds at most two electrons with opposite spins.</p><p>In the usual multielectron-atom model, subshell energies within one shell increase s &lt; p &lt; d &lt; f (for subshells allowed in that shell). In the nonrelativistic hydrogen-like model, orbitals with the same n have equal energy; do not apply the multielectron splitting to that model.</p>';
orbitals.cards.cue='<p>One s orbital; three p orbitals; five d orbitals; seven f orbitals. A p subshell can hold six electrons. For hydrogen-like atomic orbitals: total nodes = n−1; angular nodes = l; radial nodes = n−l−1. A 3p orbital has one angular node and one radial node.</p>';
orbitals.cards.trap='<p>Orbital phase signs are wavefunction signs, not positive and negative electric charges. Electrons do not orbit like planets. s orbitals have spherical angular symmetry; a p orbital has two lobes separated by a nodal plane. Higher-n orbitals may also have radial nodes. A node is a zero of the wavefunction, not a place where an electron waits.</p>';
const filling={type:'orbitals',caption:'Isolated neutral carbon, ground-state filling: 1s² 2s² 2p². This atomic model is distinct from the ethene bonding example.',subshells:[{label:'1s',electrons:[2]},{label:'2s',electrons:[2]},{label:'2p',electrons:[1,1,0]}]};
orbitals.steps[0].text='<p>The molecular drawing is ethene, H₂C=CH₂, shown as a later bonding example. The separate box diagram describes an isolated neutral carbon atom: 1s²2s²2p², with four valence electrons in the n=2 shell. Do not interpret the C=C lines as orbital boxes or apply the isolated-atom occupancy directly to a bonded carbon.</p>';
orbitals.steps[1].text='<p>In the isolated-carbon box diagram, the two 2p electrons occupy separate degenerate orbitals with parallel spins (Hund’s rule). Electrons paired in a single orbital have opposite spins (Pauli exclusion). Ethene is the molecular example above; its bonding orbitals are a different model, developed in the next lesson.</p>';
for(const step of orbitals.steps){step.reveal=true;step.diagram=structuredClone(filling);}
if(!bonds.cards.rule.includes('For comparable carbon'))bonds.cards.rule+='<p>For comparable carbon–carbon bonds, an individual pi contribution is generally weaker than the sigma contribution because side-on overlap is less effective. Nevertheless, a double bond and a triple bond are generally stronger and shorter overall than a single bond. Their strength increments are unequal; do not add universal, context-free sigma and pi energies.</p>';
bonds.steps[0].text='<p>Ethene has one C–C sigma bond, one C–C pi bond, and four C–H sigma bonds: five sigma and one pi overall. The H₂C and CH₂ labels show the hydrogens; the four C–H bonds are not drawn as separate lines.</p>';
bonds.steps[1].text='<p>Ethyne has one C–C sigma plus two perpendicular pi bonds. Each CH label includes one hydrogen whose C–H bond is not drawn separately. Add those two C–H sigma bonds: three sigma and two pi overall.</p>';
const quantum=ch.exercises.find(e=>e.id==='quantum');
quantum.context='The ethene drawing is a companion bonding example only. These questions concern atomic orbitals and subshells, not the total electrons or molecular orbitals of C2H4. No atomic filling diagram is supplied during this workshop.';
quantum.stages[1].explanation='mₗ takes −1, 0, and +1: three orbitals.';
if(quantum.stages.length===3)quantum.stages.push(
 {type:'number',prompt:'For a hydrogen-like 3p orbital, how many radial nodes are present?',skill:'Apply the node-count model',answer:1,unit:'radial nodes',tolerance:0,explanation:'For 3p, n=3 and l=1. Radial nodes = n−l−1 = 1.',hints:['Identify n and l from 3p.','Subtract l and one from n.'],highlights:{}},
 {type:'number',prompt:'How many angular nodes does that 3p orbital have?',skill:'Distinguish angular and radial nodes',answer:1,unit:'angular nodes',tolerance:0,explanation:'Angular nodes = l. A p orbital has l=1, giving one angular node (a plane).',hints:['Use the subshell letter rather than n.','The angular-node count equals l.'],highlights:{}},
 {type:'choice',prompt:'In the usual multielectron-atom model, which listed n=3 subshell is lowest in energy?',skill:'Keep model assumptions explicit',options:['3s','3p','3d'],answer:0,explanation:'Within one shell in the usual multielectron model, s < p < d. In the nonrelativistic hydrogen-like model these same-n orbitals are degenerate.',hints:['Electron–electron interactions distinguish subshell energies.','Use the within-shell order s < p < d.'],highlights:{}}
);
quantum.summary='Atomic models: allowed quantum numbers, p-subshell capacity, hydrogen-like node counts, and multielectron subshell energy order. The molecular example is ethene.';
ch.exercises.find(e=>e.id==='amide-resonance').stages[2].prompt='For acetamide, resonance contributors differ in…';
const sources=[
 ['OpenStax: quantum numbers, shapes and nodes','https://openstax.org/books/chemistry-atoms-first-2e/pages/3-3-development-of-quantum-theory'],
 ['OpenStax: electronic structure, subshell energies and filling','https://openstax.org/books/chemistry-atoms-first-2e/pages/3-4-electronic-structure-of-atoms-electron-configurations'],
 ['OpenStax: valence-bond overlap and relative bond strengths','https://openstax.org/books/chemistry/pages/8-1-valence-bond-theory']
];for(const[label,location]of sources)if(!ch.sources.some(s=>s.location===location))ch.sources.push({label,location});
fs.writeFileSync(file,JSON.stringify(ch,null,2)+'\n');
const schemaFile='schema/chapter.schema.json',schema=JSON.parse(fs.readFileSync(schemaFile)),d=schema.$defs.diagram;
if(!d.properties.type.enum.includes('orbitals'))d.properties.type.enum.push('orbitals');
d.properties.subshells={type:'array',minItems:1,maxItems:3,items:{type:'object',properties:{label:{type:'string',minLength:1,maxLength:12},electrons:{type:'array',minItems:1,maxItems:7,items:{type:'integer',minimum:0,maximum:2}}},required:['label','electrons'],additionalProperties:false}};
if(!d.allOf.some(c=>c.if.properties.type.const==='orbitals'))d.allOf.push({if:{properties:{type:{const:'orbitals'}}},then:{required:['subshells']}});
fs.writeFileSync(schemaFile,JSON.stringify(schema,null,2)+'\n');
