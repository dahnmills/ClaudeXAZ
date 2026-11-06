// Step 1 of the refresh (see ../README.md). Run from the repo root.
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root='src/app/shared/ui';
const out=[];
for(const dir of fs.readdirSync(root)){
  const d=path.join(root,dir); if(!fs.statSync(d).isDirectory())continue;
  const files=fs.readdirSync(d);
  const stories=files.filter(f=>f.endsWith('.stories.ts')).map(f=>{
    const s=fs.readFileSync(path.join(d,f),'utf8');
    const t=(s.match(/title:\s*'((?:Design System|UI|Local Components|Pages)[^']*)'/)||[])[1];
    const ex=[...s.matchAll(/export const (\w+)/g)].map(m=>m[1]);
    return {file:f,title:t,autodocs:/autodocs/.test(s),exports:ex};
  });
  const comps=[];
  for(const f of files.filter(f=>f.endsWith('.ts')&&!f.includes('.stories')&&!f.includes('.spec'))){
    const s=fs.readFileSync(path.join(d,f),'utf8');
    const m=s.match(/selector:\s*'([^']+)'/);
    if(!m)continue;
    const cls=(s.match(/export class (\w+)/)||[])[1];
    const inputs=[...s.matchAll(/^\s+(?:readonly\s+)?(\w+)\s*=\s*(?:input|model)(?:\.required)?(?:<[^\n]*?>)?\(/gm)].map(m=>m[1]);
    comps.push({file:f,selector:m[1],cls,inputs});
  }
  const last=cp.execSync(`git log -1 --format=%cs -- ${d}`).toString().trim();
  const first=cp.execSync(`git log --diff-filter=A --format=%cs -- ${d}`).toString().trim().split('\n').pop();
  const commits=cp.execSync(`git rev-list --count HEAD -- ${d}`).toString().trim();
  out.push({dir,comps,stories,last,first,commits:+commits});
}
const pages=[];
(function walk(p){for(const f of fs.readdirSync(p)){const q=path.join(p,f);if(fs.statSync(q).isDirectory())walk(q);else if(/\.(html|ts)$/.test(f)&&!f.includes('.spec'))pages.push(q)}})('src/app/pages');
const txt=pages.map(p=>[p,fs.readFileSync(p,'utf8')]);
const EXCL=['design-system-components','design-system-audit','grade-story'];
for(const o of out)for(const c of o.comps){
  const sel=c.selector;
  let re;
  if(sel.startsWith('[')){ re=new RegExp(sel.slice(1,-1)+'(?![A-Za-z0-9-])','g'); }
  else re=new RegExp('<'+sel+'(?![A-Za-z0-9-])','g');
  const set=new Set();let n=0;
  for(const [p,t] of txt){const k=(t.match(re)||[]).length; const pg=p.split(path.sep)[3]; if(k&&!EXCL.includes(pg)){set.add(pg);n+=k}}
  c.usedByPages=[...set];c.usedByCount=set.size;c.usages=n;
}
fs.mkdirSync(path.join(__dirname,'.cache'),{recursive:true});
fs.writeFileSync(path.join(__dirname,'.cache','code.json'),JSON.stringify(out,null,1));
console.log(out.length,out.reduce((a,o)=>a+o.comps.length,0));
