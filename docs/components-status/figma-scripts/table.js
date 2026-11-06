const SB='https://dahnmills.github.io/ClaudeXAZ/storybook/?path=/';
const STB={ready:'Success','in-review':'Info',draft:'Neutral',deprecated:'Error'};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
async function mkHeader(table,cols){const hr=C.hrow.createInstance();hr.name='Table Header Row';hr.setProperties({'Header Flyout#1514:25':false,'Header Selection#1514:26':false});table.appendChild(hr);hr.layoutSizingHorizontal='FILL';
const slot=hr.findOne(n=>n.type==='SLOT');for(const c of[...slot.children])c.remove();
for(const c of cols){const cell=C.cell.children.find(v=>v.name==='Type=Header').createInstance();slot.appendChild(cell);cell.layoutSizingHorizontal='FIXED';cell.resize(c.w,cell.height);cell.name='Header / '+c.h;const h=cell.findOne(n=>n.type==='TEXT'&&n.name==='Heading');h.characters=c.h;const sub=cell.findOne(n=>n.type==='TEXT'&&n.name==='Sub Title');if(sub)sub.visible=false;const so=cell.findOne(n=>n.name==='Sorting');if(so)so.visible=false;}
return hr}
async function mkRow(table,cols,r,PSETS,fails){
const[name,sel,lvl,desc,bits,fUrl,sb,zh,ver,st,last,com,ki]=r;
const row=C.row.defaultVariant.createInstance();row.name='Row / '+name;row.setProperties({'Selection#1514:16':false,'Action#1512:10':false});table.appendChild(row);row.layoutSizingHorizontal='FILL';
const slot=row.findOne(n=>n.type==='SLOT');for(const c of[...slot.children])c.remove();slot.layoutSizingVertical='HUG';
for(const c of cols){const cell=C.cell.children.find(v=>v.name==='Type=Data').createInstance();slot.appendChild(cell);cell.layoutSizingHorizontal='FIXED';cell.resize(c.w,cell.height);cell.layoutSizingVertical='FILL';cell.name='Cell / '+c.h;
cell.findOne(n=>n.name==='.Content Type').setProperties({Type:'Slot','Secondary Tag#38:0':false,'Second Line#38:6':false});const cs=cell.findOne(n=>n.type==='SLOT');for(const x of[...cs.children])x.remove();
const iw=c.w-28;let ct;
if(c.k==='preview'){ct=af('Preview','HORIZONTAL');const ps=figma.createFrame();ps.name='Preview slot';ps.resize(96,64);ps.clipsContent=true;fl(ps,'bgAlt');for(const k of['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])ps.setBoundVariable(k,V.rS);ct.appendChild(ps);
 let ok=false;if(ki>=0&&PSETS[ki]){try{const set=PSETS[ki];const inst=(set.defaultVariant||set).createInstance();ps.appendChild(inst);const s=Math.min(1,88/inst.width,56/inst.height);if(s<1)inst.rescale(s);inst.x=(96-inst.width)/2;inst.y=(64-inst.height)/2;inst.name='Preview / '+name;ok=true}catch(e){fails.push(name+': '+String(e.message).slice(0,50))}}
 if(!ok){const ic=C.icon.defaultVariant.createInstance();ps.appendChild(ic);const g=ic.findOne(n=>n.type==='INSTANCE');if(g)g.swapComponent(C.glyph);ic.x=36;ic.y=20;ic.name='Empty state icon'}}
else if(c.k==='name'){ct=af('Name','VERTICAL',{g:'xxs'});ct.appendChild(await tx(name,'mS','tPri',{name:'Name'}));ct.appendChild(await tx(sel,'sR','tSec',{name:'Selector'}))}
else if(c.k==='level'){ct=af('Level','VERTICAL');ct.appendChild(await tx(cap(lvl),'mR','tPri',{w:iw}))}
else if(c.k==='desc'){ct=af('Description','VERTICAL');ct.appendChild(await tx(desc,'mR','tPri',{w:iw}))}
else if(c.k==='avail'){ct=af('Availability','HORIZONTAL',{g:'xs'});const lab=['Design','Vibecoded','Dev'];for(let i=0;i<3;i++)ct.appendChild(await badge(bits[i]==='1'?'Success':'Neutral',lab[i]))}
else if(c.k==='figma'){ct=af('Figma','VERTICAL');ct.appendChild(fUrl?await link('Open',fUrl):await dash('Empty'))}
else if(c.k==='sbv'){ct=af('Storybook vibecoded','VERTICAL');ct.appendChild(sb?await link('Open',SB+sb):await dash('Empty'))}
else if(c.k==='sbd'){ct=af('Storybook dev','HORIZONTAL');ct.appendChild(await badge('Neutral','Planned'))}
else if(c.k==='zh'){ct=af('ZeroHeight','VERTICAL');ct.appendChild(zh?await link('Open',zh):await dash('Empty'))}
else if(c.k==='ver'){ct=af('Version','VERTICAL');ct.appendChild(await tx(ver,'mR','tPri',{w:iw}))}
else if(c.k==='state'){ct=af('State','HORIZONTAL');ct.appendChild(await badge(STB[st],st))}
else if(c.k==='last'){ct=af('Last change','VERTICAL');ct.appendChild(await tx(last||'—','mR','tPri',{w:iw}))}
else if(c.k==='com'){ct=af('Comment','VERTICAL');ct.appendChild(await tx(com||'','mR','tSec',{w:iw}))}
cs.appendChild(ct);const cp=cell.findOne(n=>n.name==='Content'&&n.type==='FRAME'&&n.parent.name==='.Cell Properties');cp.layoutSizingVertical='HUG';if(c.k!=='preview'&&c.k!=='avail'&&c.k!=='state'&&c.k!=='sbd'){ct.layoutSizingHorizontal='FILL'}}
{const cts=[...slot.children].map(c=>c.findOne(n=>n.type==='SLOT').children[0]);const m=Math.max(...cts.map(x=>x.height));cts.forEach(x=>x.minHeight=m);}slot.layoutSizingVertical='HUG';return row}
async function mkGroup(table,g){const f=af('Group / '+g,'HORIZONTAL',{px:'m',py:'s',fill:'bgTer'});table.appendChild(f);f.layoutSizingHorizontal='FILL';f.appendChild(await tx(g,'mS','tPri',{name:'Group label'}));return f}
