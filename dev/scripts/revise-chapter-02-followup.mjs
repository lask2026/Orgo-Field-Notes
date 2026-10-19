// Recorded, idempotent corrections from the second candidate review.
import fs from 'node:fs';
const file='dev/chapters/chapter-02.json',ch=JSON.parse(fs.readFileSync(file));
const configuration=ch.lessons.find(l=>l.id==='configuration');
configuration.steps[0].text='<p>OH ranks first. Ethyl beats methyl at the next sphere: [C,H,H] beats [H,H,H]. The terminal CH₃ carbon of the ethyl group supplies the C that breaks the tie; both carbons of ethyl are highlighted. H ranks fourth.</p>';
configuration.steps[1].text='<p>Use the same Fischer projection with C1 at the top. Priorities are OH (right) > ethyl (bottom) > methyl (top) > H (left). The apparent 1→2→3 order is clockwise; H is horizontal and toward you, so reverse it: S.</p>';
const rotation=ch.exercises.find(e=>e.id==='butane-rotation');
rotation.stages[2].molecule='cyclohexane';
rotation.stages[2].prompt='For cyclohexane (connectivity shown), a chair flip changes…';
const f=ch.exercises.find(e=>e.id==='fischer-cip').stages[2],z=ch.exercises.find(e=>e.id==='ez-chirality').stages[1];
f.accepted=[...new Set([...f.accepted,'(2S)-2-butanol'])];
z.accepted=[...new Set([...z.accepted,'(2Z)-2-butene'])];
ch.exercises.find(e=>e.id==='ez-chirality').stages[2].prompt='Why does a pure sample of this alkene isomer show no ordinary optical rotation?';
fs.writeFileSync(file,JSON.stringify(ch,null,2)+'\n');
const schemaFile='dev/schema/chapter.schema.json',schema=JSON.parse(fs.readFileSync(schemaFile));
schema.$defs.stage.properties.molecule={type:'string',minLength:1,description:'Optional molecule ID for a transfer stage; replaces the exercise molecule and hides its exercise-wide diagram.'};
fs.writeFileSync(schemaFile,JSON.stringify(schema,null,2)+'\n');
