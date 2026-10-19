import fs from 'node:fs';
import path from 'node:path';
import {projectRoot,projectLayout} from '../../project-layout.mjs';

export function scaffoldSubject(args,{defaultParent=path.dirname(projectRoot)}={}){
  const options={parent:defaultParent,create:false};
  for(let i=0;i<args.length;i++){
    const flag=args[i];if(flag==='--create'){options.create=true;continue;}
    if(!['--name','--subject','--parent'].includes(flag)||!args[i+1])throw Error('Use --name, --subject, --parent and optional --create');
    options[flag.slice(2)]=args[++i];
  }
  if(!/^[a-zA-Z][a-zA-Z0-9_-]{1,63}$/.test(options.name||'')||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(options.name))throw Error('Choose a safe new project folder name');
  if(!/^[a-zA-Z][a-zA-Z0-9 -]{1,63}$/.test(options.subject||''))throw Error('Specify a subject such as Biology or Physics');
  const parent=fs.realpathSync(path.resolve(options.parent)),destination=path.resolve(parent,options.name);
  if(path.dirname(destination)!==parent||fs.existsSync(destination))throw Error('Destination must be a new direct child folder; existing book/project folders are never overwritten');
  const layout={...projectLayout,subject:{id:options.name.toLowerCase(),title:options.subject+' Field Notes',targetLevel:'MCAT',adapter:'not-implemented'},privateReferenceDirectories:[],status:'scaffold-only'};
  const templates=['KEYED-SUBJECT-REVIEW-PROMPT.txt','BLIND-SUBJECT-REVIEW-PROMPT.txt','SUBJECT-RUBRICS.md'];
  const files=new Map([
    ['project-layout.json',JSON.stringify(layout,null,2)+'\n'],
    ['project-layout.mjs',fs.readFileSync(path.join(projectRoot,'project-layout.mjs'))],
    ['README.md',fs.readFileSync(path.join(projectRoot,'dev/templates/subject-project/README.md'),'utf8').replaceAll('{{TITLE}}',layout.subject.title).replaceAll('{{SUBJECT}}',options.subject)],
    ['package.json',JSON.stringify({name:options.name.toLowerCase(),version:'0.0.0',private:true,type:'module',description:'Subject scaffold; application and tests not implemented'},null,2)+'\n'],
    ['.gitignore','node_modules/\ntesting/artifacts/screenshots/\ntesting/artifacts/*.log\nreview/results/\nreview/config/*.local.json\n__pycache__/\n']
  ]);
  for(const file of templates)files.set(layout.paths.reviewTemplates+'/'+file,fs.readFileSync(path.join(projectRoot,projectLayout.paths.reviewTemplates,file)));
  const plan={dryRun:!options.create,destination,subject:options.subject,status:'scaffold-only',folders:Object.values(layout.paths),files:[...files.keys()],bookFilesCopied:false,orgoCurriculumCopied:false};
  if(!options.create)return plan;
  fs.mkdirSync(destination); // Atomic refusal if another process created the destination.
  for(const folder of Object.values(layout.paths)){
    const target=path.resolve(destination,folder);if(!target.startsWith(destination+path.sep))throw Error('Invalid scaffold folder');fs.mkdirSync(target,{recursive:true});
  }
  for(const [name,data]of files){const target=path.resolve(destination,name);if(!target.startsWith(destination+path.sep))throw Error('Invalid scaffold filename');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,data,{flag:'wx'});}
  return plan;
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.filename))try{console.log(JSON.stringify(scaffoldSubject(process.argv.slice(2)),null,2));}catch(error){console.error(error.message);process.exitCode=1;}
