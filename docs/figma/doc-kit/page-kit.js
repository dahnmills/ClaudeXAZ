// Qirin page kit v1 : normalized component page (Versionning | 01 Component | 02 Documentation | 03 Do and Don't).
// Paste at the top of a use_figma call, then: const K = await pageKit(); ...  (reference page: Action > Button, section "Button")
async function pageKit(){
const lib=await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
const sem=lib.find(c=>c.name==='Semantic'&&c.libraryName==='Tokens');
const L=await figma.teamLibrary.getVariablesInLibraryCollectionAsync(sem.key);
const C={},miss=[];
const V=async n=>{if(C[n]!==undefined)return C[n];const e=L.find(v=>v.name===n);if(!e){miss.push(n);return C[n]=null}return C[n]=await figma.variables.importVariableByKeyAsync(e.key)};
const paint=async n=>{const v=await V('Color/'+n);return v?[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',v)]:[]};
const B=async(n,f,name)=>{const v=await V(name);if(v)n.setBoundVariable(f,v)};
const pad=async(n,v,h)=>{await B(n,'paddingTop',v);await B(n,'paddingBottom',v);await B(n,'paddingLeft',h);await B(n,'paddingRight',h)};
const rad=async(n,name)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])await B(n,k,name)};
const sp=x=>'Measurement/Spacing/'+x;
for(const s of ['Regular','Medium','Semi Bold','Bold'])await figma.loadFontAsync({family:'Inter',style:s});
const PR='Static/Text/Main/Primary',WH='Static/Text/Subtle/Primary';
const AL=(dir,name,par)=>{const f=figma.createAutoLayout(dir,{name});f.fills=[];if(par)par.appendChild(f);return f};
async function T(par,str,style,size,lh,o={}){const t=figma.createText();t.fontName={family:'Inter',style};t.characters=str;t.fontSize=size;
 t.lineHeight=lh?{unit:'PIXELS',value:lh}:{unit:'AUTO'};t.fills=await paint(o.color||PR);par.appendChild(t);
 if(o.w){t.textAutoResize='HEIGHT';t.layoutSizingHorizontal='FILL'}if(o.u)t.textDecoration='UNDERLINE';if(o.url)t.hyperlink={type:'URL',value:o.url};if(o.ls)t.letterSpacing={unit:'PERCENT',value:o.ls};return t}
async function card(n){n.fills=await paint('Static/Background/Main/Primary');n.strokes=await paint('Static/Border/Subtle/Tertiary');n.strokeAlign='INSIDE';await B(n,'strokeWeight','Border/Size/S')}
async function chip(par,num,label){const c=AL('HORIZONTAL','Step');par.insertChild(0,c);c.fills=await paint('Static/Background/Brand');await pad(c,sp('XXS'),sp('S'));await rad(c,'Border/Radius/Round');await B(c,'itemSpacing',sp('S'));
 const a=await T(c,num,'Bold',14,0,{color:WH});a.opacity=0.7;await T(c,label.toUpperCase(),'Semi Bold',14,0,{color:WH,ls:8});return c}
async function hero(h,padL){h.fills=await paint('Static/Background/Functional/Subtle/Informative');await B(h,'paddingTop',sp('3XL'));await B(h,'paddingBottom',sp('3XL'));h.paddingLeft=padL;h.paddingRight=padL;await B(h,'itemSpacing',sp('3XL'));
 h.strokes=await paint('Static/Border/Brand');h.strokeAlign='INSIDE';h.strokeTopWeight=0;h.strokeLeftWeight=0;h.strokeRightWeight=0;await B(h,'strokeBottomWeight','Border/Size/L')}
async function pill(v){await card(v);await pad(v,sp('XXS'),sp('M'));await rad(v,'Border/Radius/Round');v.counterAxisAlignItems='CENTER'}

// 1. Restyle the user's "_Design system header" in place (Content > [top row, title row, Line, sections...]).
async function styleHeader(id,num,label){const root=await figma.getNodeByIdAsync(id);if(root.findChild(c=>c.name==='Hero'))return{id,skipped:'already styled'};
 const content=root.findChild(c=>c.name==='Content');const [top,title,line]=content.children;
 const strip=root.findChild(c=>c.name==='Gradient strip');if(strip)root.appendChild(strip);
 const h=AL('VERTICAL','Hero');root.insertChild(0,h);h.layoutSizingHorizontal='FILL';await hero(h,content.paddingLeft);
 h.appendChild(top);top.layoutSizingHorizontal='FILL';h.appendChild(title);title.layoutSizingHorizontal='FILL';title.counterAxisAlignItems='CENTER';
 if(line&&line.type==='LINE')line.remove();
 for(const t of root.findAll(n=>n.type==='TEXT'))for(const s of t.getStyledTextSegments(['fontName']))await figma.loadFontAsync(s.fontName);
 await chip(title.children[0],num,label);
 const lt=top.children[0],ver=top.children[1];if(ver){ver.visible=true;lt.layoutSizingHorizontal='FILL';top.primaryAxisAlignItems='SPACE_BETWEEN';await pill(ver);for(const t of ver.findAll(n=>n.type==='TEXT'))t.fontSize=16}
 const info=title.children[1];if(info){await card(info);await pad(info,sp('L'),sp('XL'));await rad(info,'Border/Radius/L');const it=info.children[0];if(it&&it.type==='TEXT')it.fontSize=20}
 if(root.layoutMode!=='NONE')root.primaryAxisSizingMode='AUTO'; // fixed-height headers would let the Hero push content past the fill (grey band at the bottom)
 return{id,hero:h.id}}

// 2. Build a new frame (Documentation or Do and Don't) with the same look. S = {name,num,label,crumb:['Qirin Components','Button','Documentation'],version,title,desc,
//    resources:[['Code :','src/...'],['ZeroHeight :','Button page (hidden)',url],['Storybook :','Design System / Action / Button',url]], logoId}
async function shell(par,S){const root=AL('VERTICAL',S.name,par);root.fills=await paint('Static/Background/Main/Primary');root.resize(1800,100);root.primaryAxisSizingMode='AUTO';root.counterAxisSizingMode='FIXED';root.clipsContent=true;
 const h=AL('VERTICAL','Hero',root);h.layoutSizingHorizontal='FILL';await hero(h,80);
 const top=AL('HORIZONTAL','Header',h);top.layoutSizingHorizontal='FILL';top.primaryAxisAlignItems='SPACE_BETWEEN';top.counterAxisAlignItems='CENTER';
 const lt=AL('HORIZONTAL','Logo and page title',top);lt.itemSpacing=16;lt.counterAxisAlignItems='CENTER';
 if(S.logoId){const lg=await figma.getNodeByIdAsync(S.logoId);if(lg){const c=lg.clone();lt.appendChild(c)}}
 const bc=AL('HORIZONTAL','Breadcrumb',lt);bc.itemSpacing=8;
 for(let i=0;i<S.crumb.length;i++){if(i)await T(bc,'→','Medium',24,32);await T(bc,S.crumb[i],i===S.crumb.length-1||i===1?'Semi Bold':'Medium',24,32)}
 if(S.version){const v=AL('HORIZONTAL','Version',top);v.itemSpacing=16;await pill(v);await T(v,'Version :','Semi Bold',16,32);await T(v,S.version,'Semi Bold',16,32)}
 const tr=AL('HORIZONTAL','Header',h);tr.layoutSizingHorizontal='FILL';tr.itemSpacing=64;tr.counterAxisAlignItems='CENTER';
 const tt=AL('VERTICAL','Title',tr);tt.layoutSizingHorizontal='FILL';tt.itemSpacing=20;
 await T(tt,S.title,'Semi Bold',60,72);await T(tt,S.desc,'Regular',20,30,{w:1});await chip(tt,S.num,S.label);
 if(S.resources&&S.resources.length){const rc=AL('VERTICAL','Resources',tr);rc.itemSpacing=8;await card(rc);await pad(rc,sp('L'),sp('XL'));await rad(rc,'Border/Radius/L');
  await T(rc,'Resources','Semi Bold',20,40);
  for(const [a,b,url] of S.resources){const r=AL('HORIZONTAL','Row',rc);r.itemSpacing=16;const la=await T(r,a,'Semi Bold',16,24);la.textAutoResize='HEIGHT';la.resize(120,24);await T(r,b,'Regular',16,24,{u:true,url})}}
 const content=AL('VERTICAL','Content',root);content.layoutSizingHorizontal='FILL';content.paddingTop=64;content.paddingBottom=96;content.paddingLeft=80;content.paddingRight=80;content.itemSpacing=64;
 const st=figma.createRectangle();st.name='Gradient strip';root.appendChild(st);st.layoutSizingHorizontal='FILL';st.resize(1800,12);st.layoutSizingHorizontal='FILL';st.fills=await paint('Static/Background/Brand');
 return{root,content}}

// 3. A template-style section: title 40 + description 20 + grey rounded box. Returns the box.
async function section(content,title,desc){const s=AL('VERTICAL','Section - '+title,content);s.layoutSizingHorizontal='FILL';s.itemSpacing=16;
 const hd=AL('VERTICAL','Heading',s);hd.layoutSizingHorizontal='FILL';hd.itemSpacing=16;await T(hd,title,'Semi Bold',40,40);if(desc)await T(hd,desc,'Regular',20,30,{w:1});
 const box=AL('VERTICAL','Content box',s);box.layoutSizingHorizontal='FILL';box.fills=await paint('Static/Background/Main/Secondary');await pad(box,sp('XL'),sp('XL'));await B(box,'itemSpacing',sp('L'));
 for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])box[k]=16;return box}
function put(box,it){const f=it.layoutSizingHorizontal==='FILL';box.appendChild(it);if(f)it.layoutSizingHorizontal='FILL'}

// 4. Move the content of a doc-kit frame "Documentation · X" (its Body sections) into template sections. Content is moved, never recreated.
async function moveDoc(kitId,content){const kit=await figma.getNodeByIdAsync(kitId);const body=kit.findChild(c=>c.name==='Body');const done=[];
 for(const ks of [...body.children]){let title,desc,items;const hdr=ks.findChild&&ks.findChild(c=>c.name==='Section header');
  if(hdr){const tt=hdr.findOne(n=>n.name==='Title');const tx=tt.findAll(n=>n.type==='TEXT');title=tx[0].characters;desc=tx[1]?tx[1].characters:null;items=ks.children.filter(c=>c!==hdr)}
  else if(ks.name==='Notes'){title='Notes';desc='Known gaps between Figma and code, to settle before the next release.';items=ks.children.filter(c=>c.name!=='Notes header')}
  else{title=ks.name.replace(/^Section \d+ - /,'');desc=null;items=[ks]}
  // Absolute markers (anatomy pins, leaders) do not follow when a centred canvas widens: remember the first flow child, shift them by its offset.
  const anch=[];for(const it of items)for(const f of [it,...('findAll' in it?it.findAll(n=>n.type==='FRAME'&&n.layoutMode!=='NONE'):[])]){if(!('children' in f))continue;const abs=f.children.filter(c=>c.layoutPositioning==='ABSOLUTE'),fl=f.children.find(c=>c.layoutPositioning!=='ABSOLUTE');if(abs.length&&fl)anch.push([fl,fl.x,fl.y,abs])}
  const box=await section(content,title,desc);for(const it of items)put(box,it);
  for(const [fl,x0,y0,abs] of anch){const dx=fl.x-x0,dy=fl.y-y0;if(dx||dy)for(const a of abs){a.x+=dx;a.y+=dy}}done.push(title)}
 return done}

// 5. Move a board-kit frame "Do and Don't board" into template sections (one per rule). do/dont frames keep their id, name and size.
async function moveBoard(boardId,content){const bd=await figma.getNodeByIdAsync(boardId);const done=[],rows=[];
 for(const grp of [...bd.children]){if(grp.name==='Header')continue;
  const subs=grp.name==='Pairs'?[...grp.children]:[grp];
  for(const p of subs){const tx=p.children.filter(c=>c.type==='TEXT');const title=tx[0]?tx[0].characters:p.name.replace(/^Pair - /,'');const desc=grp.name==='Pairs'?null:(tx[1]?tx[1].characters:null);
   const box=await section(content,title,desc);for(const r of p.children.filter(c=>c.type!=='TEXT')){box.appendChild(r);r.layoutSizingHorizontal='FILL';rows.push(r)}done.push(title)}}
 // One stacked row stacks every Do/Don't pair of the board, so all rules read the same way (Do above Don't). Fixed card heights become hug.
 const wide=r=>{const half=(r.width-r.itemSpacing)/2;return Math.max(0,...r.findAll(n=>n.type==='FRAME'&&/^(do|dont) ·|^anatomy/i.test(n.name)).map(n=>n.width))>half-32};
 const stack=rows.some(r=>r.layoutMode==='HORIZONTAL'&&wide(r));
 for(const r of rows){if(r.layoutMode!=='HORIZONTAL'){for(const c of r.children)if(c.layoutSizingHorizontal!=='FILL'&&c.type==='FRAME')c.layoutSizingHorizontal='FILL';continue}
  const half=(r.width-r.itemSpacing)/2;
  if(stack&&(wide(r)||r.children.some(c=>/^Don't card/.test(c.name)))){r.layoutMode='VERTICAL';r.layoutSizingVertical='HUG';for(const c of r.children){c.layoutSizingHorizontal='FILL';if(c.layoutMode!=='NONE')c.layoutSizingVertical='HUG'}}else for(const c of r.children)if(c.layoutSizingHorizontal!=='FILL')c.resize(half,c.height)}
 return done}

// 6. Lay nodes out in one row inside a section: 160 padding, 160 gap, top aligned.
function row(sec,nodes,PAD=160,GAP=160){let x=PAD,h=0;for(const n of nodes){sec.appendChild(n);n.x=x;n.y=PAD;x+=n.width+GAP;h=Math.max(h,n.height)}sec.resizeWithoutConstraints(x-GAP+PAD,h+2*PAD);return{w:x-GAP+PAD,h:h+2*PAD}}
async function newSection(name,x,y,bg){const s=figma.createSection();s.name=name;figma.currentPage.appendChild(s);s.x=x;s.y=y;s.fills=await paint(bg||'Static/Background/Main/Secondary');return s}
// 7. Read version, title, description and links from a doc-kit Banner.
async function readKit(kitId){const kit=await figma.getNodeByIdAsync(kitId);const ban=kit.findChild(c=>c.name==='Banner');const tx=ban.findAll(n=>n.type==='TEXT');
 const f=(par,i)=>{const t=tx.filter(t=>t.parent.name===par);return t[i]};const res=[];
 for(const [k,lab] of [['Link Code','Code :'],['Link ZeroHeight','ZeroHeight :'],['Link Storybook','Storybook :']]){const v=f(k,1);if(v)res.push([lab,v.characters,v.hyperlink&&v.hyperlink.value||null])}
 const ti=tx.filter(t=>t.parent.name==='Title');return{version:(f('Version',1)||{}).characters,name:ti[0]&&ti[0].characters,desc:ti[1]&&ti[1].characters,resources:res}}

// 8. Whole page in one call. O = {name, headerId, versionningId?, kitDocId, boardId, review:[ids], x?, y?}
async function normalize(O){const g=id=>id?figma.getNodeByIdAsync(id):null;
 const hdr=await g(O.headerId),ver=await g(O.versionningId),bd=await g(O.boardId),kit=await g(O.kitDocId);
 const ids=bd?bd.findAll(n=>n.type==='FRAME'&&/^(do|dont) ·|^anatomy/i.test(n.name)).map(n=>n.id):[];
 const info=kit?await readKit(O.kitDocId):{resources:[]};const nm=O.name||info.name;
 let lg=hdr&&hdr.findOne(n=>n.type==='INSTANCE'&&/Logo/.test(n.name)),tmpLg=null;
 // No header (page without template): pass O.logoId = a "Header Q/First slot/Logo" instance from any page of the file
 // (importComponentByKeyAsync fails on this library logo), an instance of its main component is used then removed.
 if(!lg&&O.logoId){try{const src=await figma.getNodeByIdAsync(O.logoId);const mc=src&&await src.getMainComponentAsync();if(mc)lg=tmpLg=mc.createInstance()}catch(e){lg=null}}
 const x0=O.x!==undefined?O.x:Math.min(...figma.currentPage.children.map(n=>n.x)),y0=O.y!==undefined?O.y:Math.min(...figma.currentPage.children.map(n=>n.y));
 if(hdr)await styleHeader(O.headerId,'01','Component');
 const out={doc:null,board:null};const nodes=[ver,hdr].filter(Boolean);
 const sec=await newSection(nm,x0,y0);
 if(kit){const d=await shell(sec,{name:'Documentation · '+nm,num:'02',label:'Documentation',crumb:['Qirin Components',nm,'Documentation'],version:info.version,title:'Documentation',
   desc:O.docDesc||('Anatomy, properties, states, tokens and usage of the '+nm+' component, aligned with the code.'),resources:info.resources,logoId:lg&&lg.id});
  out.docSections=await moveDoc(O.kitDocId,d.content);kit.remove();nodes.push(d.root);out.doc=d.root.id}
 if(bd){const b=await shell(sec,{name:"Do/Don't",num:'03',label:"Do/Don't",crumb:['Qirin Components',nm,"Do/Don't"],version:info.version,title:"Do/Don't",
   desc:O.boardDesc||('Usage rules of the '+nm+', as shown on ZeroHeight: what to do on the left, what to avoid on the right.'),resources:info.resources,logoId:lg&&lg.id});
  out.boardSections=await moveBoard(O.boardId,b.content);
  if(!O.boardDesc&&b.content.findAll(n=>n.name==='Row'&&n.layoutMode==='VERTICAL'&&n.children.some(c=>/^Don't card/.test(c.name))).length){const dt=b.root.findOne(n=>n.type==='TEXT'&&n.characters.startsWith('Usage rules of the'));if(dt)dt.characters='Usage rules of the '+nm+', as shown on ZeroHeight: what to do first, what to avoid just below.'}
  const zs=bd.parent;bd.remove();if(zs&&zs.type==='SECTION'&&zs.children.length===0)zs.remove();nodes.push(b.root);out.board=b.root.id}
 if(tmpLg)tmpLg.remove();
 // Hero descriptions must stay on one line (a long Code path widens Resources): shorter wordings, same meaning.
 if(!O.docDesc&&!O.boardDesc)for(const t of sec.findAll(n=>n.type==='TEXT'&&n.fontSize===20&&/^(Usage rules of the|Anatomy, properties)/.test(n.characters))){if(t.height<=30)continue;
  const lb=/just below/.test(t.characters)?'what to do first, what to avoid just below.':'what to do on the left, what to avoid on the right.';
  const alts=/^Anatomy/.test(t.characters)?['Anatomy, properties, states, tokens and usage of the '+nm+', aligned with the code.','Anatomy, properties, states, tokens and usage, aligned with the code.']:['Usage rules of the '+nm+' on ZeroHeight: '+lb,'Usage rules from ZeroHeight: '+lb];
  for(const a of alts){t.characters=a;if(t.height<=30)break}}
 out.size=row(sec,nodes);out.section=sec.id;
 if(O.review&&O.review.length){const rv=await newSection(nm+' - To review',sec.x,sec.y+sec.height+400,'Static/Background/Functional/Subtle/Warning');
  let x=160,h=0;for(const id of O.review){const n=await g(id);if(!n)continue;rv.appendChild(n);n.x=x;n.y=160;x+=n.width+160;h=Math.max(h,n.height)}rv.resizeWithoutConstraints(x,h+320);out.review=rv.id}
 const lost=[];for(const id of ids)if(!(await g(id)))lost.push(id);out.dodont=ids.length;out.lost=lost;out.miss=miss;
 const bx=figma.currentPage.children.map(n=>[n.name,n.x,n.y,n.x+n.width,n.y+n.height]);out.overlaps=[];
 for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){const a=bx[i],b=bx[j];if(a[1]<b[3]&&b[1]<a[3]&&a[2]<b[4]&&b[2]<a[4])out.overlaps.push(a[0]+' x '+b[0])}
 return out}
return{styleHeader,shell,section,moveDoc,moveBoard,row,newSection,readKit,normalize,paint,miss}}
