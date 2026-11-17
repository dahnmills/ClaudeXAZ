// Qirin doc kit v1. Paste above the spec, then: return await buildDoc(SPEC,{x,y,parentId})
async function buildDoc(S,O={}){
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
async function PIN(par,n,bg){const r=bg==='ring',f=await SQ(par,'Pin '+n,'L','L','Round',r?W1:bg||BG);if(r){await P(f,'strokes',BG);await B(f,'strokeWeight',bs('S'))}await TX(f,n,'mb',r?BR:WH,{n:'n'});return f}
const K={pos:'Positive',warn:'Warning',neg:'Negative'};
async function PILL(par,txt){const k=/ready|in code|done|live|published/i.test(txt)?'pos':/wip|progress|hidden|draft|planned|todo/i.test(txt)?'warn':/deprec|missing|none|blocked/i.test(txt)?'neg':'neu';
const bgc=k==='neu'?W3:'Static/Background/Functional/Subtle/'+K[k],ic=k==='neu'?'Static/Icon/Main/Secondary':'Static/Icon/Main/Functional/'+K[k];
const f=await FR(par,'Status '+txt,'HORIZONTAL',{g:'XS',p:['XXS','S'],bg:bgc,r:'Round',ax:'CENTER'});
const d=figma.createEllipse();f.appendChild(d);d.name='Dot';await B(d,'width',sz('S'));await B(d,'height',sz('S'));await P(d,'fills',ic);
await TX(f,txt,'sb',PR);return f}
async function SEC(par,n,title,desc){const s=await FR(par,'Section '+n+' - '+title,'VERTICAL',{g:'M',w:'F'});
const h=await FR(s,'Section header','HORIZONTAL',{g:'M',p:['S','None'],ax:'CENTER',w:'F',bd:LN,bb:1});
const num=await SQ(h,'Number','XL','XL','S',BG);await TX(num,n,'lb',WH,{n:'n'});
const c=await FR(h,'Title','VERTICAL',{w:'F'});await TX(c,title,'t3',PR);if(desc)await TX(c,desc,'m',SE,{F:1});
return s}
async function TBL(par,W,heads,rows,name){const t=await FR(par,name||'Table','VERTICAL',{w:'F',r:'M',bd:LN,clip:1});
const row=async(cells,i,head,last)=>{const r=await FR(t,head?'Header row':'Row '+i,'HORIZONTAL',{g:'M',p:['S','M'],w:'F',bg:head?W3:(i%2?W2:W1),ax:'MIN',bd:last?0:LN,bb:last?0:1});
for(let j=0;j<W.length;j++){const c=await FR(r,head?'Head '+j:'Cell '+j,'VERTICAL',{g:'XS',w:W[j]||'F'});
if(head)await TX(c,cells[j],'sb',PR);else await cells[j](c)}};
await row(heads,0,1);for(let i=0;i<rows.length;i++)await row(rows[i],i,0,i===rows.length-1);return t}
const T=(s,r,c,o)=>p=>TX(p,s,r||'m',c,Object.assign({F:1},o||{}));
async function CHIPS(p,vals,def){const w=await FR(p,'Values','HORIZONTAL',{g:'XS',wrap:1,w:'F'});
for(const v of vals){const d=v===def;const c=await FR(w,'Value '+v,'HORIZONTAL',{p:['XXS','S'],bg:d?BG:W2,r:'S',bd:d?0:LN,ax:'CENTER'});await TX(c,v,'sb',d?WH:PR)}}
async function LINKROW(par,link,label,col){const a=link&&typeof link==='object'?link:{text:link,url:link};if(!a.text)return;
const c=await FR(par,'Link '+label,'VERTICAL',{g:'XXS',w:'F',p:'M',bg:col||W1,bd:LN,r:'M'});
await TX(c,label,'sb',SE);await TX(c,a.text,'m',BR,{F:1,url:a.url})}
const root=figma.createAutoLayout('VERTICAL');root.name='Documentation · '+S.name;root.fills=[];root.clipsContent=true;
const pg=O.parentId?await figma.getNodeByIdAsync(O.parentId):figma.currentPage;pg.appendChild(root);
root.resize(1280,100);root.layoutSizingHorizontal='FIXED';root.layoutSizingVertical='HUG';
await P(root,'fills',W1);await P(root,'strokes',LN);await B(root,'strokeWeight',bs('S'));await B(root,'cornerRadius',rd('M'));
root.x=O.x||0;root.y=O.y||0;
const strip=figma.createRectangle();root.appendChild(strip);strip.name='Brand strip';await P(strip,'fills',BG);strip.layoutSizingHorizontal='FILL';await B(strip,'height',sz('XS'));
const bn=await FR(root,'Banner','VERTICAL',{g:'L',p:['XL','XL'],w:'F',bg:'Static/Background/Subtle/Fuctional/Informative'});
const r1=await FR(bn,'Breadcrumb row','HORIZONTAL',{w:'F',ax:'CENTER',pa:'SPACE_BETWEEN'});
const bc=await FR(r1,'Breadcrumb','HORIZONTAL',{g:'S',ax:'CENTER'});
if(O.logoNodeId){const lg=(await figma.getNodeByIdAsync(O.logoNodeId)).clone();bc.appendChild(lg)}
await TX(bc,'Qirin Components','m',SE);await TX(bc,'→','m',SE);await TX(bc,S.name,'mb',PR);
const vp=await FR(r1,'Version','HORIZONTAL',{g:'XS',p:['XXS','S'],bg:W1,bd:LN,r:'Round',ax:'CENTER'});await TX(vp,'Version','m',SE);await TX(vp,S.version,'mb',PR);
const r2=await FR(bn,'Title row','HORIZONTAL',{g:'2XL',w:'F',ax:'MIN'});
const tc=await FR(r2,'Title','VERTICAL',{g:'S',w:'F'});await TX(tc,S.name,'d',PR);await TX(tc,S.description,'l',SE,{F:1});
const sc=await FR(r2,'Status card','VERTICAL',{g:'S',p:'M',bg:W1,bd:LN,r:'M',w:300});await TX(sc,'Status','mb',PR);
for(const [k,v] of [['Design',S.status.design],['Tech',S.status.tech],['ZeroHeight',S.status.zeroheight]]){if(!v)continue;const r=await FR(sc,'Status '+k,'HORIZONTAL',{g:'S',ax:'CENTER',w:'F',pa:'SPACE_BETWEEN'});await TX(r,k,'m',SE);await PILL(r,v)}
const r3=await FR(bn,'Links row','HORIZONTAL',{g:'M',w:'F'});
await LINKROW(r3,S.links.code,'Code');await LINKROW(r3,S.links.storybook,'Storybook');await LINKROW(r3,S.links.zeroheight,'ZeroHeight');
const body=await FR(root,'Body','VERTICAL',{g:'2XL',p:'XL',w:'F'});let n=0;const num=()=>String(++n).padStart(2,'0');
if(S.anatomy){const a=S.anatomy,s=await SEC(body,num(),'Anatomy','Numbered markers point to each part of the component.');
const wd=!!a.wide,pn=await FR(s,'Anatomy panel',wd?'VERTICAL':'HORIZONTAL',{g:'XL',w:'F'});
const cv=await FR(pn,'Canvas','HORIZONTAL',Object.assign({p:'3XL',bg:a.bg||W2,r:'L',bd:LN,ax:'CENTER',pa:'CENTER',w:'F'},wd?{}:{h:'F'}));
const inst=await MK(a.instanceNodeId);cv.appendChild(inst);if(a.props)SP(inst,a.props);inst.rescale(a.scale||3);
const lg=wd?await FR(pn,'Legend','HORIZONTAL',{g:'M',wrap:1,w:'F'}):await FR(pn,'Legend','VERTICAL',{g:'M',w:420});
const lw=wd?Math.floor((1215-2*(await N(sp('M'))))/3):'F';
for(const m of a.markers){const r=await FR(lg,'Legend '+m.n,'HORIZONTAL',{g:'S',w:lw,ax:'MIN'});await PIN(r,m.n,m.x===undefined?'ring':BG);
const c=await FR(r,'Text','VERTICAL',{w:'F'});await TX(c,m.label,'mb',PR,{F:1});if(m.desc)await TX(c,m.desc,'m',SE,{F:1})}
const U=await N(sz('L')),Ld=Math.round(U*1.5),iw=inst.width,ih=inst.height;
for(const m of a.markers){if(m.x===undefined)continue;const px=inst.x+m.x*iw+(m.dx||0),py=inst.y+m.y*ih,b=m.side==='b';
const ln=figma.createRectangle();cv.appendChild(ln);ln.name='Leader '+m.n;ln.layoutPositioning='ABSOLUTE';await P(ln,'fills',BG);await B(ln,'width',bs('S'));ln.resize(ln.width,Ld);ln.x=px;ln.y=b?py:py-Ld;
const dt=figma.createEllipse();cv.appendChild(dt);dt.name='Target '+m.n;dt.layoutPositioning='ABSOLUTE';await P(dt,'fills',BG);await P(dt,'strokes',W1);await B(dt,'strokeWeight',bs('S'));await B(dt,'width',sz('S'));await B(dt,'height',sz('S'));const d=dt.width;dt.x=px-d/2;dt.y=py-d/2;
const pi=await PIN(cv,m.n);pi.layoutPositioning='ABSOLUTE';pi.x=px-U/2;pi.y=b?py+Ld:py-Ld-U}}
if(S.properties){const s=await SEC(body,num(),'Properties','Figma properties and their Angular inputs. A filled value is the default.');
await TBL(s,[150,330,0,0],['Figma property','Values','Angular input','Notes'],S.properties.map(p=>[T(p.figma||'—','mb'),async c=>{if(p.values&&p.values.length)await CHIPS(c,p.values,p.default);else await TX(c,'—','m',SE)},T(p.angular||'—','m'),T(p.notes||'—','m',SE)]),'Properties table')}
if(S.states){const s=await SEC(body,num(),'States and variants','Real instances of the component, on neutral or dark backgrounds.');const gap=await N(sp('M')),G=[];let cur,grid,tw,pv;
for(const st of S.states){if(st.group!==cur||!grid){cur=st.group;if(cur)await TX(s,cur,'mb',PR);grid=await FR(s,'Grid '+(cur||''),'HORIZONTAL',{g:'M',wrap:1,w:'F'});pv=[];G.push(pv);tw=Math.floor((1215-((st.cols||6)-1)*gap)/(st.cols||6))}
const t=await FR(grid,'Tile '+st.label,'VERTICAL',{w:tw,r:'M',bd:LN,clip:1,bg:W1});
const z=await FR(t,'Preview','VERTICAL',{p:'L',bg:st.rev?'Static/Background/Accent/Primary':W2,ax:'CENTER',pa:'CENTER',w:'F'});pv.push(z);
const sl=await FR(z,'Slot','HORIZONTAL',{});const sn=await figma.getNodeByIdAsync(st.nodeId),i2=st.clone?sn.clone():sn.createInstance();sl.appendChild(i2);if(st.props)SP(i2,st.props);if(st.scale)i2.rescale(st.scale);
if(st.ring){const o=await N(sp('XS')),rg=figma.createRectangle();sl.appendChild(rg);rg.name='Focus ring';rg.layoutPositioning='ABSOLUTE';rg.fills=[];await P(rg,'strokes','Interactive/Border/Focus');await B(rg,'strokeWeight',bs('M'));await B(rg,'cornerRadius',rd('S'));rg.resize(i2.width+2*o,i2.height+2*o);rg.x=-o;rg.y=-o}
const cp=await FR(t,'Caption','VERTICAL',{p:['S','M'],w:'F',g:'XXS'});await TX(cp,st.label,'mb',PR,{F:1});await TX(cp,st.sub||' ','s',SE,{F:1})}for(const a of G){const m=Math.max(...a.map(p=>p.height));a.forEach(p=>p.minHeight=m)}}
if(S.tokens){const s=await SEC(body,num(),'Tokens','Semantic variables from the Tokens library and their CSS custom properties.');
await TBL(s,[250,390,0],['Element','Figma variable','CSS custom property'],S.tokens.map(k=>[async c=>{const r=await FR(c,'Element','HORIZONTAL',{g:'S',ax:'CENTER',w:'F'});
if(k.colorVar){const sw=await SQ(r,'Swatch','L','L','S',null);await P(sw,'fills',k.colorVar);await P(sw,'strokes',LN);await B(sw,'strokeWeight',bs('S'))}
else{const sw=await SQ(r,'Value','L','L','S',W3);await TX(sw,k.val||'','sb',PR)}
await TX(r,k.element,'mb',PR,{F:1})},T(k.figmaVar),T(k.css)]),'Tokens table')}
if(S.notes&&S.notes.length){const s=await FR(body,'Notes','VERTICAL',{g:'S',p:'L',w:'F',bg:'Static/Background/Functional/Subtle/Warning',bd:'Static/Border/Main/Functional/Warning',r:'M'});
const h=await FR(s,'Notes header','HORIZONTAL',{g:'S',ax:'CENTER'});const ic=await SQ(h,'Warning icon','L','L','Round','Static/Icon/Main/Functional/Warning');await TX(ic,'!','lb',PR,{n:'!'});await TX(h,'Notes: known gaps between Figma and code','lb',PR);
for(let i=0;i<S.notes.length;i++){const r=await FR(s,'Note '+(i+1),'HORIZONTAL',{g:'S',w:'F'});const nb=await FR(r,'N','VERTICAL',{w:16});await TX(nb,i+1,'mb',PR);await TX(r,S.notes[i],'m',PR,{F:1})}}
if(S.usage){const s=await SEC(body,num(),'Usage and accessibility','Short rules to apply before shipping a screen.');const row=await FR(s,'Usage cards','HORIZONTAL',{g:'M',w:'F'});
for(const u of S.usage){const c=await FR(row,'Card '+u.t,'VERTICAL',{g:'XS',p:'M',bg:W2,bd:BG,bt:'M',r:'M',w:'F',h:'F'});await TX(c,u.t,'lb',PR,{F:1});await TX(c,u.x,'m',SE,{F:1})}}
const ft=await FR(root,'Footer','HORIZONTAL',{g:'L',p:['L','XL'],w:'F',bg:BG,ax:'CENTER',pa:'SPACE_BETWEEN'});
await TX(ft,'Qirin Design System - '+S.name+' - v'+S.version,'mb',WH);
const fl2=await FR(ft,'Footer links','HORIZONTAL',{g:'L',ax:'CENTER'});
for(const [k,v] of [['Code',S.links.code],['Storybook',S.links.storybook],['ZeroHeight',S.links.zeroheight]]){if(!v)continue;const a=typeof v==='object'?v:{text:v,url:v};await TX(fl2,k+' →','sb',WH,{url:a.url})}
return {id:root.id,w:root.width,h:root.height,miss}}
