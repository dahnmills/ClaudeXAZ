// Qirin board kit v1.1 (S.stack: Do above Dont for very wide frames). Paste above the spec, then: return await buildBoard(SPEC,{sectionId,x,y})
async function buildBoard(S,O={}){
const BN="Do and Don't board";
const F='Allianz Neo',lib=await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const sem=lib.find(c=>c.name==='Semantic'&&c.libraryName==='Tokens');
const L=await figma.teamLibrary.getVariablesInLibraryCollectionAsync(sem.key);
const C={},miss=[],fl={};
const V=async n=>{if(C[n]!==undefined)return C[n];const e=L.find(v=>v.name===n);if(!e){miss.push(n);return C[n]=null}return C[n]=await figma.variables.importVariableByKeyAsync(e.key)};
const N=async n=>{let v=await V(n),x;for(let i=0;v&&i<5;i++){x=v.valuesByMode[Object.keys(v.valuesByMode)[0]];if(x&&x.type==='VARIABLE_ALIAS')v=await figma.variables.getVariableByIdAsync(x.id);else break}return x};
const LF=s=>fl[s]||(fl[s]=figma.loadFontAsync({family:F,style:s}));
const B=async(n,f,name)=>{const v=await V(name);if(v)n.setBoundVariable(f,v)};
const P=async(n,prop,name)=>{const v=await V('Color/'+name);if(v)n[prop]=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v)]};
const SP=(i,pr)=>{const ks=Object.keys(i.componentProperties),o={};for(const k in pr){const kk=ks.find(x=>x===k||x.split('#')[0]===k);if(kk)o[kk]=pr[k]}i.setProperties(o)};
const MK=async id=>{const s=await figma.getNodeByIdAsync(id);return s.type==='INSTANCE'?s.clone():s.createInstance()};
const sp=x=>'Measurement/Spacing/'+x,sz=x=>'Measurement/Sizing/'+x,rd=x=>'Border/Radius/'+x,bs=x=>'Border/Size/'+x;
const PR='Static/Text/Main/Primary',SE='Static/Text/Main/Secondary',WH='Static/Text/Subtle/Primary',BR='Static/Text/Brand',BG='Static/Background/Brand';
const LN='Static/Border/Subtle/Tertiary',W1='Static/Background/Main/Primary',W2='Static/Background/Main/Secondary',W3='Static/Background/Main/Tertiary';
async function FR(par,name,dir,o={}){
const f=figma.createAutoLayout(dir||'VERTICAL');f.name=name;f.fills=[];par.appendChild(f);f.clipsContent=!!o.clip;
if(o.g!==undefined)await B(f,'itemSpacing',sp(o.g));
if(o.p){const [v,h]=Array.isArray(o.p)?o.p:[o.p,o.p];await B(f,'paddingTop',sp(v));await B(f,'paddingBottom',sp(v));await B(f,'paddingLeft',sp(h));await B(f,'paddingRight',sp(h))}
if(o.bg)await P(f,'fills',o.bg);
if(o.r)await B(f,'cornerRadius',rd(o.r));
if(o.bd){await P(f,'strokes',o.bd);f.strokeAlign='INSIDE';
if(o.bb){f.strokeTopWeight=0;f.strokeLeftWeight=0;f.strokeRightWeight=0;await B(f,'strokeBottomWeight',bs('S'))}
else if(o.bt){f.strokeBottomWeight=0;f.strokeLeftWeight=0;f.strokeRightWeight=0;await B(f,'strokeTopWeight',bs(o.bt))}
else await B(f,'strokeWeight',bs(o.bw||'S'))}
if(o.ax)f.counterAxisAlignItems=o.ax;if(o.pa)f.primaryAxisAlignItems=o.pa;if(o.wrap){f.layoutWrap='WRAP';await B(f,'counterAxisSpacing',sp(o.g))}
if(typeof o.w==='number'){f.resize(o.w,10);f.layoutSizingHorizontal='FIXED';f.layoutSizingVertical='HUG'}else if(o.w==='F')f.layoutSizingHorizontal='FILL';
if(o.h==='F')f.layoutSizingVertical='FILL';
return f}
async function TX(par,s,role,col,o={}){
const t=figma.createText();par.appendChild(t);let k='Text Style',x=(role[0]||'m').toUpperCase(),w=role.endsWith('b')?'SemiBold':'Regular',wv=w;
if(role==='d'){k='Display';x='S';w='SemiBold';wv='M'}else if(role==='t3'||role==='t2'){k='Title';x=role==='t3'?'S':'M';w='SemiBold';wv='M'}
await LF(w);t.fontName={family:F,style:w};t.characters=String(s);
await B(t,'fontFamily','Font/Family');await B(t,'fontSize','Font/'+k+'/Size/'+x);await B(t,'lineHeight','Font/'+k+'/Line Height/'+x);await B(t,'fontWeight','Font/'+k+'/Font Weight/'+wv);await B(t,'letterSpacing','Font/'+k+'/Letter Spacing/None');
await P(t,'fills',col||PR);t.name=o.n||String(s).slice(0,30);
if(o.F){t.textAutoResize='HEIGHT';t.layoutSizingHorizontal='FILL'}
if(o.url&&/^http/.test(o.url)){t.hyperlink={type:'URL',value:o.url};t.textDecoration='UNDERLINE'}
return t}
async function SQ(par,name,wn,hn,rn,bg){const f=await FR(par,name,'HORIZONTAL',{bg,ax:'CENTER',pa:'CENTER'});f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='FIXED';await B(f,'width',sz(wn));await B(f,'height',sz(hn));await B(f,'cornerRadius',rd(rn));return f}
const POS={do:{lab:'Do',bg:'Static/Background/Functional/Subtle/Positive',bd:'Static/Border/Main/Functional/Positive',ic:'Static/Background/Functional/Positive',d:'M1 5.5 L4 8.5 L9 1.5'},
dont:{lab:"Don't",bg:'Static/Background/Functional/Subtle/Negative',bd:'Static/Border/Main/Functional/Negative',ic:'Static/Background/Functional/Negative',d:'M1.5 1.5 L8.5 8.5 M8.5 1.5 L1.5 8.5'},
ref:{lab:'Illustration',bg:W3,bd:'Static/Border/Main/Tertiary'}};
async function ICON(par,t){const c=await SQ(par,'Icon '+t,'M','M','Round',POS[t].ic),v=figma.createVector();c.appendChild(v);v.name='Glyph';
v.vectorPaths=[{windingRule:'NONE',data:POS[t].d}];v.fills=[];await P(v,'strokes',WH);await B(v,'strokeWeight',bs('M'));v.strokeCap='ROUND';v.strokeJoin='ROUND';
const k=c.width*0.5/Math.max(v.width,v.height);v.resize(v.width*k,v.height*k);return c}
// CARD: coloured bandeau (type, label, optional tag), stage (the existing frame), caption (rule text)
let CW=0;const ST=!!(O.stack||S.stack);
async function CARD(par,t,txt,node,o={}){const c=await FR(par,(o.n||POS[t].lab)+' card','VERTICAL',{w:CW,bg:o.txt?W2:W1,bd:LN,r:'M',clip:1});
const b=await FR(c,'Bandeau','HORIZONTAL',{w:'F',p:['XS','M'],pa:'SPACE_BETWEEN',ax:'CENTER',bg:POS[t].bg,bd:POS[t].bd,bt:'L'});
const l=await FR(b,'Label','HORIZONTAL',{g:'S',ax:'CENTER'});if(POS[t].ic)await ICON(l,t);await TX(l,o.lab||POS[t].lab,'mb',PR,{n:'Label'});
if(o.tag)await TX(b,o.tag,'s',SE,{n:'Tag'});
if(node){const st=await FR(c,'Illustration','HORIZONTAL',{w:'F',p:'L',ax:'CENTER',pa:'CENTER',bg:W1});st.appendChild(node)}
else if(o.txt){const st=await FR(c,'No illustration','HORIZONTAL',{w:'F',p:'M',ax:'CENTER',pa:'CENTER'});await TX(st,'No illustration: rule written in ZeroHeight only.','s',SE,{n:'Note',F:1})}
const cp=await FR(c,'Caption','VERTICAL',{w:'F',p:'M',bd:LN,bt:'S',bg:o.txt?W2:W1});await TX(cp,txt,'l',PR,{n:'Rule text',F:1});if(!ST)c.layoutSizingVertical='FILL';return c}
async function HOLE(par,t){const c=await FR(par,'Missing '+t,'VERTICAL',{w:CW,p:'L',r:'M',ax:'CENTER',pa:'CENTER',bd:LN});c.dashPattern=[4,4];
(await TX(c,'No '+POS[t].lab+' illustrated for this rule.','s',SE,{n:'Note',F:1})).textAlignHorizontal='CENTER';if(!ST)c.layoutSizingVertical='FILL';return c}
const sec=await figma.getNodeByIdAsync(O.sectionId),ex=S.extras||[];
const ids=[...S.pairs.flatMap(p=>[p.doNodeId,p.dontNodeId]),...ex.map(e=>e.nodeId)].filter(Boolean),fr={};
for(const id of ids){fr[id]=await figma.getNodeByIdAsync(id);if(!fr[id]||fr[id].removed)throw new Error('missing '+id);if(fr[id].parent!==sec)sec.appendChild(fr[id])}
for(const c of sec.children.filter(c=>c.name===BN))c.remove();
const mw=Math.max(0,...ids.map(i=>fr[i].width)),pL=await N(sp('L')),p3=await N(sp('2XL'));
const cw=Math.max(480,mw+2*pL+2),W=Math.max(O.w||1280,(ST?cw:2*cw+pL)+2*p3);
CW=ST?W-2*p3:(W-2*p3-pL)/2;
const R=await FR(sec,BN,'VERTICAL',{w:W,p:'2XL',g:'2XL',bg:W1});
const H=await FR(R,'Header','VERTICAL',{w:'F',g:'XS',p:'None'});
await TX(H,S.name,'lb',BR,{n:'Component'});await TX(H,"Do and Don't",'d',PR,{n:'Title'});
await TX(H,S.intro||'Rules from the Usage tab on ZeroHeight. On the left what to do, on the right what to avoid.','l',SE,{n:'Intro',F:1});
const PS=await FR(R,'Pairs','VERTICAL',{w:'F',g:'XL'});
let g,pk;for(const p of S.pairs){if(p.key!==pk){g=await FR(PS,'Pair - '+p.key,'VERTICAL',{w:'F',g:'M'});await TX(g,p.key,'lb',PR,{n:'Rule topic'});pk=p.key}
const r=await FR(g,'Row',ST?'VERTICAL':'HORIZONTAL',{w:'F',g:'L'});
if(p.doNodeId)await CARD(r,'do',p.doDesc,fr[p.doNodeId]);else await HOLE(r,'do');
if(p.dontNodeId)await CARD(r,'dont',p.dontDesc,fr[p.dontNodeId]);else await HOLE(r,'dont')}
const T=S.textOnly||[];
if(T.length){const g=await FR(R,'Text only rules','VERTICAL',{w:'F',g:'S'});await TX(g,'Rules without illustration','lb',PR,{n:'Group title'});
for(let i=0;i<T.length;i+=2){const r=await FR(g,'Row','HORIZONTAL',{w:'F',g:'L'});
for(const e of T.slice(i,i+2))await CARD(r,e.type,e.text,null,{txt:1,tag:'Text only'});
if(T.slice(i,i+2).length<2){const z=await FR(r,'Spacer','VERTICAL',{w:'F'});z.layoutSizingVertical='FILL'}}}
if(ex.length){const g=await FR(R,'Other illustrations','VERTICAL',{w:'F',g:'S'});await TX(g,'Other illustrations','lb',PR,{n:'Group title'});
await TX(g,'Not Do or Don\'t rules. ZeroHeight reads these frames from this section, so they stay here.','m',SE,{n:'Note',F:1});
const r=await FR(g,'Row','HORIZONTAL',{w:'F',g:'L'});
for(const e of ex)await CARD(r,'ref',e.text,fr[e.nodeId],{n:e.label,lab:e.label});
if(ex.length%2){const z=await FR(r,'Spacer','VERTICAL',{w:'F'});z.layoutSizingVertical='FILL'}}
const M=O.pad||0;R.x=M;R.y=M;sec.resizeWithoutConstraints(R.width+2*M,R.height+2*M);
if(O.x!==undefined)sec.x=O.x;if(O.y!==undefined)sec.y=O.y;
return {id:sec.id,boardId:R.id,w:sec.width,h:sec.height,miss}
}
