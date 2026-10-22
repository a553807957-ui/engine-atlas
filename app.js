(function(){
"use strict";
const E = window.ENGINES;
const $ = s=>document.querySelector(s);
const CYLS=[5,6,8,10,12,16];
const HUE = {5:"#a78bfa",6:"#4cc9f0",8:"#22d3a5",10:"#ffb02e",12:"#ff7a3d",16:"#ff4d2e"};
function dispNum(s){ const m=String(s).match(/(\d[\d,]*)\s*cc/); return m?+m[1].replace(/,/g,''):null; }
E.forEach(e=>{
  e.dispNum = dispNum(e.disp);
  e.powerDensity = e.dispNum? +(e.power/(e.dispNum/1000)).toFixed(1) : null;
  e.hue = HUE[e.cyl]||"#8b95a7";
  if(!e.short) e.short = e.name.slice(0,13);
});
const byId = id=>E.find(e=>e.id===id);

/* ---------- 火花线 ---------- */
function unusedSpark(el){
  const e=byId(el); if(!e||!e.torque) return;
  const pk=e.torque, at=e.torqueAt||4000, w=100,h=26;
  const pts=[];
  for(let i=0;i<=40;i++){
    const r=600+i*(e.rpmLimit-600)/40;
    const t=pk*Math.exp(-Math.pow((r-at)/(at*0.9),2));
    pts.push([i*w/40, h-2-(t/pk)*(h-6)]);
  }
  el.innerHTML='<svg class="spark" viewBox="0 0 100 26" preserveAspectRatio="none"><path d="M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'" fill="none" stroke="'+e.hue+'" stroke-width="1.6"/></svg>';
}

/* ---------- 卡片 ---------- */
const grid=$('#grid'), detail=$('#detail');
function cardHTML(e){
  return `<article class="card" data-id="${e.id}" style="--hue:${e.hue}" tabindex="0" role="button" aria-label="${e.name}">
    <div class="top"><span class="pill cyl">${e.cyl} 缸</span><span class="pill">${e.layout}</span></div>
    <h3>${e.name}</h3>
    <div class="zh">${e.zh} · ${e.era}</div>
    <div class="sketch"><img src="assets/layouts/${e.layoutKey}.svg" alt="${e.layout} 布局示意" loading="lazy"></div>
    <div class="nums">
      <div><b>${e.power}<small style="font-size:11px;color:var(--dim2)"> PS</small></b><span>@ ${e.powerAt.toLocaleString()} rpm</span></div>
      <div><b>${e.torque? e.torque : '—'}<small style="font-size:11px;color:var(--dim2)"> N·m</small></b><span>${e.torqueAt? '@ '+e.torqueAt.toLocaleString()+' rpm':'—'}</span></div>
    </div>
    <div class="sparkholder"></div>
    <div class="cardfoot"><span>${e.powerDensity? e.powerDensity+' PS/L':''}</span><span class="go">详情 ›</span></div>
  </article>`;
}
function renderGrid(list){
  grid.innerHTML=list.map(cardHTML).join('');
  [...grid.children].forEach(c=>{ spark(null); const s=c.querySelector('.sparkholder'); const e=byId(c.dataset.id); if(e&&e.torque) sparkEl(s,e); });
}
function sparkEl(el,e){
  const pk=e.torque, at=e.torqueAt||4000, w=100,h=26,pts=[];
  for(let i=0;i<=40;i++){
    const r=600+i*(e.rpmLimit-600)/40;
    const t=pk*Math.exp(-Math.pow((r-at)/(at*0.95),2));
    pts.push([i*w/40, h-2-(t/pk)*(h-6)]);
  }
  el.innerHTML='<svg class="spark" viewBox="0 0 100 26" preserveAspectRatio="none"><path d="M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'" fill="none" stroke="'+e.hue+'" stroke-width="1.6"/></svg>';
}

/* ---------- 筛选 ---------- */
const filters=$('#filters');
let curCyl='all', curQ='';
filters.innerHTML=['all',...CYLS].map(c=>`<button class="chip ${c==='all'?'on':''}" data-cyl="${c}">${c==='all'?'全部缸数':c+' 缸'}</button>`).join('');
filters.addEventListener('click',ev=>{
  const b=ev.target.closest('.chip'); if(!b) return;
  curCyl=b.dataset.cyl;
  [...filters.children].forEach(x=>x.classList.toggle('on',x===b));
  apply();
});
$('#q').addEventListener('input',ev=>{curQ=ev.target.value.trim().toLowerCase();apply();});
function apply(){
  let list=E.filter(e=>(curCyl==='all'||e.cyl==+curCyl)&&(!curQ||[e.name,e.zh,e.cars,e.layout,e.asp].join(' ').toLowerCase().includes(curQ)));
  list.sort((a,b)=>a.cyl-b.cyl||b.power-a.power);
  renderGrid(list);
  $('#count').textContent=`显示 ${list.length} / ${E.length} 台`;
  detail.classList.remove('open');
}
grid.addEventListener('click',ev=>{const c=ev.target.closest('.card'); if(c) openDetail(c.dataset.id);});
grid.addEventListener('keydown',ev=>{if(ev.key==='Enter'){const c=ev.target.closest('.card'); if(c) openDetail(c.dataset.id);}});

function openDetail(id){
  const e=byId(id); if(!e) return;
  detail.innerHTML=`
   <div class="dh">
     <div>
       <span class="pill cyl" style="background:${e.hue};color:#0a0c11;font-weight:800">${e.cyl} 缸</span>
       <span class="pill">${e.layout}</span> <span class="pill">${e.years}</span>
       <h3 style="margin-top:10px">${e.name}</h3>
       <div class="dim">${e.zh} · ${e.cars}</div>
     </div>
     <button class="closebtn" id="closeDetail">收起 ✕</button>
   </div>
   <div class="specgrid">
     <div class="spec"><span>排量</span><b>${e.disp}</b></div>
     <div class="spec"><span>缸径 × 行程</span><b>${e.bore}</b></div>
     <div class="spec"><span>最大功率</span><b>${e.power} PS @ ${e.powerAt} rpm</b></div>
     <div class="spec"><span>峰值扭矩</span><b>${e.torque?e.torque+' N·m @ '+e.torqueAt+' rpm':'—'}</b></div>
     <div class="spec"><span>红线</span><b>${e.rpmLimit} rpm</b></div>
     <div class="spec"><span>升功率</span><b>${e.powerDensity} PS/L</b></div>
     <div class="spec"><span>气门结构</span><b>${e.valvetrain}</b></div>
     <div class="spec"><span>进气形式</span><b>${e.asp}</b></div>
     <div class="spec"><span>缸列夹角</span><b>${e.angle}</b></div>
     <div class="spec"><span>压缩比</span><b>${e.cr}</b></div>
     <div class="spec"><span>整机重量</span><b>${e.weight?e.weight+' kg':'—'}</b></div>
     <div class="spec"><span>年份</span><b>${e.years}</b></div>
   </div>
   <p style="font-size:14px;margin:6px 0 0;max-width:78ch">${e.note}</p>
   ${e.detail?`<p style="font-size:13.5px;margin:10px 0 0;color:var(--dim);max-width:78ch"><b style="color:var(--acc2)">工程细节　</b>${e.detail}</p>`:''}
   ${e.source?`<p class="dim" style="font-size:12.5px;margin:10px 0 0">版本说明：${e.source}</p>`:''}
   <div class="dstats">${dstats(e)}</div>
   <div class="dcompare">${dcompare(e)}</div>
   <div id="dSpark"></div>`;
  const jump=detail.querySelectorAll('[data-jump]');
  jump.forEach(b=>b.addEventListener('click',ev=>{ ev.stopPropagation(); openDetail(b.getAttribute('data-jump')); }));
  const ds=detail.querySelector('#dSpark');
  if(e.torque) sparkEl(ds,e);
  detail.classList.add('open');
  detail.scrollIntoView({behavior:'smooth',block:'nearest'});
  detail.querySelector('#closeDetail').onclick=()=>{detail.classList.remove('open');};
}


/* ---------- 详情里的“关键数字”与“同级对比” ---------- */
function dstats(e){
  const items=[
    ['升功率', e.powerDensity? e.powerDensity+' PS/L' : '—'],
    ['每缸排量', e.dispNum? Math.round(e.dispNum/e.cyl)+' cc' : '—'],
    ['缸径行程比', boreStroke(e)],
    ['功率转速', e.powerAt.toLocaleString()+' rpm'],
    ['扭矩转速', e.torqueAt? e.torqueAt.toLocaleString()+' rpm':'—'],
    ['整机重量', e.weight? e.weight+' kg':'—']
  ];
  return items.map(x=>`<div class="dstat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
}
function boreStroke(e){
  const m=String(e.bore||'').match(/([\d.]+)\s*[×x]\s*([\d.]+)/);
  if(!m) return '—';
  const r=(+m[1]/+m[2]);
  return r.toFixed(2)+(r>1.15?' 超方形':r<0.9?' 长行程':' 近方形');
}
function dcompare(e){
  const peers=E.filter(x=>x.cyl===e.cyl && x.id!==e.id).sort((a,b)=>b.power-a.power).slice(0,5);
  const all=[e,...peers].sort((a,b)=>b.power-a.power);
  const max=Math.max(...all.map(x=>x.power));
  const rows=all.map(x=>`<div class="bar ${x.id===e.id?'cur':''}"><span class="lbl">${x.id===e.id?'▶ ':''}${x.short||x.name}</span>
    <div class="track"><div class="fill" style="width:${Math.max(4,x.power/max*100)}%;background:${x.id===e.id?'#ff5a30':'#3a475f'}"></div></div>
    <span class="val">${x.power} PS</span></div>`).join('');
  return `<div class="cmphead">同为 ${e.cyl} 缸的功率对比</div>${rows}
    <div class="cmpfoot">想看结构差异？<button class="jumpbtn" data-jump="${e.id}">在 3D 里拆开它 →</button></div>`;
}

/* ---------- 缸型解剖 ---------- */
const LAYOUTS=[
  {k:'inline-5',t:'直列 5',d:'一列五缸。比直四平顺（每 144°/216° 一次点火），比直六短，横置也能塞。'},
  {k:'inline-6',t:'直列 6',d:'两个三缸首尾相接。一阶、二阶惯性力都能自平衡，是天生的平顺王，也最容易被推向高转。'},
  {k:'v-6',t:'60° V6',d:'两列各三缸。紧凑但会产生一阶纵摇力矩，需要平衡轴/副平衡配重。'},
  {k:'vr6',t:'15° VR6',d:'两列交错、夹角极小，共用一个缸盖。长度≈四缸机，却有一个直六的点火节奏。'},
  {k:'v-8',t:'90° V8',d:'两列各四缸。90° 刚好让曲轴配重平衡掉一阶，是天生的「有力且紧凑」。'},
  {k:'v-10',t:'90° V10',d:'可看作 V8 加两缸，点火间隔 72°。介于 V8 的粗粝与 V12 的顺滑之间，又比 V12 短。'},
  {k:'v-12',t:'60° V12',d:'两台直六共曲轴：点火间隔 60°，曲轴每 60° 就有一次作功，平顺度接近完美。'},
  {k:'w-12',t:'72° W12 / W8',d:'两台 15° VR6 以 72° 相交共用曲轴。12 缸只用 4 根凸轮轴，体积比自家 V8 还小。'},
  {k:'v-16',t:'45° V16',d:'两列各八缸、以 45° 夹角拼合：凯迪拉克 1930 年的豪华旗舰、Auto Union 的战前 GP 怪兽都用它。平顺度接近两列直列八缸。'},
  {k:'w-16',t:'W16',d:'四排气缸、一根曲轴、四颗涡轮。为布加迪而生：8.0 L 的极致紧凑与平顺。'}
];
$('#layoutCards').innerHTML=LAYOUTS.map(l=>`<div class="box"><img src="assets/layouts/${l.k}.svg" alt="${l.t} 布局示意" loading="lazy"><b>${l.t}</b><span>${l.d}</span></div>`).join('');
const SHAPE=[
  ['直列 6','长度',92,'#4cc9f0'],['60° V6','长度',58,'#4cc9f0'],
  ['90° V8','长度',54,'#22d3a5'],['72° W12','长度',48,'#ffb02e'],['W16','长度',52,'#ff4d2e']
];
$('#shapeBars').innerHTML=SHAPE.map(s=>`<div class="bar"><span class="lbl">${s[0]}</span><div class="track"><div class="fill" style="width:${s[2]}%;background:${s[3]}"></div></div><span class="val">${s[1]} ${s[2]}</span></div>`).join('')
 + `<p class="dim" style="font-size:12px;margin:10px 0 0">V8 之后长度基本封顶，真正的差别转移到「宽度与高度」上——这也是 W12 存在的全部理由。</p>`;

/* ---------- 对比图 ---------- */
function rpmColor(r){ // 6000→红, 20000→绿
  const t=Math.min(1,Math.max(0,(r-6000)/14000));
  return `hsl(${18+t*130} 85% 60%)`;
}
function bars(host, items, valFmt){
  let max=Math.max(...items.map(i=>i.v));
  host.innerHTML=items.map(i=>`<div class="bar"><span class="lbl" title="${i.n}">${i.short}</span><div class="track"><div class="fill" style="width:${Math.max(3,i.v/max*100)}%;background:${i.c}"></div></div><span class="val">${valFmt(i.v)}</span></div>`).join('');
}
bars($('#chartBars'), E.filter(e=>e.powerDensity).sort((a,b)=>b.powerDensity-a.powerDensity).map(e=>({n:e.name,short:e.short||e.name.slice(0,14),v:e.powerDensity,c:rpmColor(e.rpmLimit)})), v=>v.toFixed(0));
bars($('#chartRpm'), [...E].sort((a,b)=>b.rpmLimit-a.rpmLimit).map(e=>({n:e.name,short:e.short||e.name.slice(0,14),v:e.rpmLimit,c:rpmColor(e.rpmLimit)})), v=>v.toLocaleString());

/* ---------- 总表 ---------- */
const tbody=$('#specTable tbody');
function fillTable(list){
  tbody.innerHTML=list.map(e=>`<tr>
    <td><b>${e.name}</b><div class="dim" style="font-size:11.5px">${e.zh}</div></td>
    <td class="mono" style="color:${e.hue}">${e.cyl}</td><td>${e.layout}</td>
    <td class="mono">${e.dispNum? e.dispNum.toLocaleString()+' cc':'—'}</td>
    <td class="mono">${e.power} @ ${e.powerAt.toLocaleString()}</td>
    <td class="mono">${e.torque? e.torque+' @ '+e.torqueAt.toLocaleString():'—'}</td>
    <td class="mono">${e.rpmLimit.toLocaleString()}</td>
    <td class="mono">${e.powerDensity??'—'}</td>
    <td class="mono">${e.weight??'—'}</td><td>${e.asp}</td><td class="mono">${e.years}</td></tr>`).join('');
}
let sortK='cyl', sortDir=1;
fillTable([...E].sort((a,b)=>a.cyl-b.cyl||b.power-a.power));
[...document.querySelectorAll('#specTable th')].forEach(th=>{
  th.onclick=()=>{
    const k=th.dataset.k;
    sortDir = (k===sortK)? -sortDir : -1;
    sortK=k;
    const v=e=>{const x=e[k]; return typeof x==='number'?x:(x==null?-Infinity:0)};
    fillTable([...E].sort((a,b)=>{
      const A=e=>{const x=e[k]; if(typeof x==='number')return x; if(k==='name')return 0; return x==null||x===''?-1e9:0;};
      return (A(a)-A(b)||0)*sortDir || a.cyl-b.cyl;
    }));
  };
});

/* ---------- 冷知识 ---------- */
const TECH=[
  ['⏱','一秒点亮多少次？','6000 rpm 的四冲程发动机，曲轴每秒转 100 圈，每缸每秒点火 50 次；12 缸合计每秒 600 次。V12 曲轴每 60° 就有一次作功，所以听起来是连续的气流声，而不是「哒哒哒」。'],
  ['⚖️','为什么直六最顺','直六的活塞运动可以按前后三缸两两成对抵消，一阶和二阶惯性力都为零，连点火间隔都正好 60°。它是「不用平衡轴也顺」的唯一常见结构。'],
  ['🌀','V12 的秘密：两台直六','V12 = 两台直六共用曲轴，夹角取多少都天然平衡。60° 夹角是历史习惯 + 包装折中，不是物理要求。'],
  ['🔁','奇数缸与点火间隔','720° 曲轴角除以缸数：5 缸 = 144°，6 缸 = 120°，8 缸 = 90°，10 缸 = 72°，12 缸 = 60°。间隔越不均匀，扭振越明显——这就是五缸声浪「怪」的根源。'],
  ['📏','缸径 × 行程','短行程大缸径 → 活塞平均速度低 → 能拉高转速（F1 的 80×49.6 mm、98×39.7 mm）。长行程 → 低转扭矩好（宾利 6¾ 的 104.1×99.1 mm）。'],
  ['🔥','升功率的极限在哪','自然吸气量产机约 100–110 PS/L（S54、S85、S65）；F1 自吸 V10 约 300 PS/L。涡轮机轻松破 150–200 PS/L，代价是热管理和响应。'],
  ['🌡','为什么压缩比不能乱加','压缩比越高，热效率越好，但爆震和高转速下的湍流、扫气、缸温都会限制它。F1 用 12–13:1 + 高辛烷燃料 + 气动气门。'],
  ['🎯','W16 为什么存在','它不是效率工具，而是「如何在车宽不超过 1.0 m 的机舱里放下 16 缸」的答案：四排、72–90° 布置、四涡轮、整机约 400 kg。'],
  ['🏁','缸数与规则','1970 年代 F1 允许 3.0 L 自然吸气：V12 顺但宽而重，水平对置 12 缸重心低但更宽，V8 DFV 反而靠「轻、窄、便宜」统治了十年。规则塑造了缸数。']
];
$('#techGrid').innerHTML=TECH.map(t=>`<div class="tech"><div class="ic">${t[0]}</div><h4>${t[1]}</h4><p>${t[2]}</p></div>`).join('');


/* ---------- 简史时间线 ---------- */
const TIMELINE=[
  ['1904','第一台 V12','用于赛艇的 V12 出现，随后 V8/V12 逐渐成为飞机与豪华车的「平顺」方案。', 'V12'],
  ['1930','凯迪拉克 V16 量产','7.4 L、45° 夹角、推杆 OHV，怠速平稳到能立硬币。多缸第一次成为「豪华」的物证。', 'V16'],
  ['1934','汽车联盟 C 型','V16 + 双机械增压，约 520 PS。战前 GP 赛车没有涡轮，增压全靠曲轴硬拖。', 'V16'],
  ['1959','宾利 6¼ L V8','推杆 OHV、每列一根凸轮轴。这台「简陋」的 V8 一直生产到 2020 年。', 'V8'],
  ['1967','Cosworth DFV 出道','3.0 L、90° V8、408 bhp @ 9000 rpm。便宜、轻、窄——靠这三点统治 F1 十余年。', 'V8'],
  ['1970','法拉利 312 水平对置 12 缸','80×49.6 mm 的极短行程，12300 rpm 仍有 515 hp。低重心，但宽得放不进气效车身。', 'Flat-12'],
  ['1991','大众 VR6','10.6°–15° 小夹角、共用一个缸盖，把 6 缸塞进 4 缸机舱。W 系列由此发端。', 'VR6'],
  ['2001','W12 量产','两台 VR6 以 72° 拼在一根曲轴上：12 缸、4 根凸轮轴，体积比自家 4.2 V8 还小。', 'W12'],
  ['2005','布加迪 W16','8.0 L、四涡轮、64 气门、400 kg。为「极速」而生的引擎，也是 W 布局的终点。', 'W16'],
  ['2005–2013','自然吸气的高光','S85 V10、S65 V8、Carrera GT V10 相继出现：升功率破 100 PS/L，红线 8000+ 转。', 'V10 / V8'],
  ['2011','L539 全新 V12','95 mm 大缸径、短行程，8500 rpm。同期 F1 却已从 V10 退回 V8，再进入涡轮混动时代。', 'V12'],
  ['2024','W12 停产','宾利在克鲁工厂造完最后一台 6.0 W12，四涡轮的 W16 也随 Chiron 一同谢幕。', 'W12 / W16']
];
(function(){
  const box=document.getElementById('timelineBox');
  if(!box) return;
  box.innerHTML=TIMELINE.map(t=>`<div class="tl-item">
    <h4 style="display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;margin:0 0 6px;font-size:15px">
      <span style="font-family:var(--mono);font-size:12px;color:#ffb02e;border:1px solid rgba(255,176,46,.35);background:rgba(255,176,46,.09);padding:2px 8px;border-radius:6px">${t[0]}</span>
      <b style="font-weight:700">${t[1]}</b>
      <i class="pill" style="font-style:normal">${t[3]}</i>
    </h4><p style="margin:0;font-size:13px;color:#8b95a7;line-height:1.8">${t[2]}</p>
  </div>`).join('');
})();

/* ---------- 版权 ---------- */
$('#rightsBox').innerHTML=`
<b style="color:var(--txt)">1. 图片：全部为本站原创绘制</b><br>
页面里的所有缸型示意图（<span class="mono">/assets/layouts/*.svg</span>）都是脚本生成的几何图形，没有使用任何厂商宣传图、专利图纸、摄影作品或第三方插图。<b>本站不对任何第三方图片主张权利，也不引用任何第三方图片</b> —— 所以「图片来源」这一栏干脆是空的。<br><br>
<b style="color:var(--txt)">2. 文字：全部为本站原创撰写</b><br>
介绍文字是基于公开规格与通用工程常识的原创写作，没有从任何网站（含维基百科、汽车媒体）复制段落。引用到的历史事实（如「DFV 在 262 场 F1 中胜出 155 场」）属于事实性信息，不受著作权保护。<br><br>
<b style="color:var(--txt)">3. 数据：来自公开规格资料</b><br>
排量、缸径×行程、功率、扭矩、红线、整机重量等均为厂商公开规格或赛事文献记载的参数事实。不同来源常有 ±5% 差异（尤其是 F1 历史机型与不同年款），本页已注明口径；<b>这些数字不构成任何性能承诺</b>。<br><br>
<b style="color:var(--txt)">4. 商标</b><br>
BMW、Mercedes-Benz、Volkswagen、Audi、Porsche、Nissan、Toyota、Volvo、Lamborghini、Ferrari、Bugatti、Bentley、Rolls-Royce、Cadillac、Auto Union、Cosworth、Ford、McLaren 等名称仅用于<b>指代被描述的产品</b>（指名性使用），不表示任何关联、赞助或背书。本站未使用任何厂商 logo 或字体。<br><br>
<b style="color:var(--txt)">5. 字体与技术栈</b><br>
使用系统字体，不加载第三方字体与 CDN；页面无追踪、无广告、无 cookie。你可以把整个文件夹拷走离线使用。<br><br>
<b style="color:var(--txt)">6. 再使用</b><br>
本站原创的示意图与文字：<b>署名—非商业性使用 4.0（CC BY-NC 4.0）</b> 即可再使用；如需商用请自行重绘/重写。参数表本身可由任何人自由引用。<br><br>
<span class="dim">如果你发现某处数据与官方公开规格不符，那多半是本页写错了 —— 以厂商公布为准。</span>`;

/* ---------- 键位 ---------- */
document.addEventListener('keydown',e=>{ if(e.key==='Escape') detail.classList.remove('open'); });

/* ---------- 入场 ---------- */
apply();
})();
