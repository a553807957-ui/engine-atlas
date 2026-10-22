/* engine3d.js — 程序化多缸发动机 3D 解剖模型（Three.js）
   坐标约定：曲轴沿 X 轴；气缸沿 +Y 方向；+Z 是观察者方向（剖开的正面）。
   所有几何由代码生成，没有任何外部模型文件。 */
import * as THREE from '../vendor/three.module.js';
import { OrbitControls } from './OrbitControls.js';

/* 缸列定义：angle = 缸列相对竖直方向的夹角（度，+ 向右）
   n = 该列缸数；lat = 该列沿 Z 方向偏移（W/VR 交错用）；head = 是否独立缸盖 */
const SPEC = {
  'inline-5': {banks:[{a:0,n:5,lat:0}], L:5.0},
  'inline-6': {banks:[{a:0,n:6,lat:0}], L:5.8},
  'vr6':      {banks:[{a:7.5,n:3,lat:.30},{a:-7.5,n:3,lat:-.30}], L:2.8, singleHead:true, small:true},
  'v-6':      {banks:[{a:30,n:3,lat:0},{a:-30,n:3,lat:0}], L:3.0, small:true},
  'v-8':      {banks:[{a:45,n:4,lat:0},{a:-45,n:4,lat:0}], L:4.0},
  'v-10':     {banks:[{a:45,n:5,lat:0},{a:-45,n:5,lat:0}], L:5.0},
  'v-12':     {banks:[{a:30,n:6,lat:0},{a:-30,n:6,lat:0}], L:6.2},
  'v-16':     {banks:[{a:22.5,n:8,lat:0},{a:-22.5,n:8,lat:0}], L:8.2, thin:true},
  'w-12':     {banks:[{a:43,n:3,lat:.28},{a:29,n:3,lat:-.28},
                      {a:-29,n:3,lat:.28},{a:-43,n:3,lat:-.28}], L:3.0, small:true},
  'x-16':     {banks:[{a:45,n:4,lat:0},{a:-45,n:4,lat:0},
                      {a:135,n:4,lat:0},{a:-135,n:4,lat:0}], L:4.2, w:true},
  'w-16':     {banks:[{a:46,n:4,lat:.30},{a:26,n:4,lat:-.30},
                      {a:-26,n:4,lat:.30},{a:-46,n:4,lat:-.30}], L:4.4, w:true}
};

/* 各机型的点火顺序（按缸号 1..N，缸号按“从前到后、逐列”编号） */
const FIRING = {
  'v-12':[1,7,5,11,3,9,6,12,2,8,4,10],
  'v-8':[1,5,4,8,6,3,7,2],
  'v-10':[1,6,5,10,2,7,3,8,4,9],
  'v-6':[1,4,2,5,3,6],
  'inline-6':[1,5,3,6,2,4],
  'inline-5':[1,2,4,5,3],
  'vr6':[1,5,3,6,2,4],
  'w-16':[1,14,9,4,13,16,11,6,15,10,3,8,12,7,2,5],
  'w-12':[1,12,5,8,3,10,6,7,2,11,4,9],
  'x-16':[1,8,3,10,5,12,7,14,2,9,4,11,6,13,8,15]
};

function smoothMat(color, o){
  return new THREE.MeshStandardMaterial(Object.assign(
    {color, metalness:.45, roughness:.42}, o||{}));
}

export function createEngine(container, opts){
  // 容器若尚未布局（宽高为 0），先回到父节点，等有尺寸再初始化，避免拿到 0×0 画布
  if(!container || container.clientWidth === 0 || container.clientHeight === 0){
    const retry = (tries) => {
      if(!container || !container.parentNode) return;
      if(container.clientWidth > 0 && container.clientHeight > 0){
        const fresh = document.createElement('div');
        fresh.className = container.className;
        fresh.id = container.id;
        container.parentNode.replaceChild(fresh, container);
        createEngine(fresh, opts);
        return;
      }
      if(tries < 40) setTimeout(()=>retry(tries+1), 120);
    };
    setTimeout(()=>retry(0), 60);
    const nullApi = {__debug:()=>({}), __debugCamera:()=>({}), setCut(){}, setExplode(){}, setRunning(){}, setRpm(){}, setView(){}, orbit(){}, resize(){}, dispose(){}};
    return nullApi;
  }
  const spec = SPEC[opts.layout] || SPEC['v-8'];
  const d = opts.data || {};
  const N = d.cyl || spec.banks.reduce((s,b)=>s+b.n,0);

  /* ---------------- 渲染器 / 场景 ---------------- */
  let renderer;
  try{
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, preserveDrawingBuffer:true});
  }catch(e){
    container.innerHTML = '<div style="padding:28px;color:#8b95a7;font:13px/1.8 -apple-system,sans-serif">'+
      '当前浏览器没有启用 WebGL，3D 视图无法渲染。下面的缸型解剖示意图仍然可以看。</div>';
    return {__debug:()=>({}), setCut(){}, setExplode(){}, setRunning(){}, setRpm(){}, setView(){}, orbit(){}, resize(){}, dispose(){}};
  }
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.95;
  const isCanvasHost = false;
  if(isCanvasHost){
    // 直接用页面里的 canvas 作为渲染目标：在 iOS WebKit 上绘图层更稳定
    renderer.domElement.remove();
    const ctx = container.getContext('webgl', {antialias:true, alpha:false, preserveDrawingBuffer:true});
    renderer = new THREE.WebGLRenderer({canvas: container, context: ctx, antialias:true, alpha:false, preserveDrawingBuffer:true});
    renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.95;
    renderer.localClippingEnabled = true;
  }else{
    container.appendChild(renderer.domElement);
  }
  const glEl = renderer.domElement;
  glEl.style.touchAction = 'none';
  glEl.style.display = 'block';
  glEl.style.width = '100%';
  glEl.style.height = '100%';

  const W = container.clientWidth || container.getBoundingClientRect().width || 360;
  const H = container.clientHeight || container.getBoundingClientRect().height || 420;
  renderer.setSize(W, H, true);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  const scene = new THREE.Scene();
  const bgCanvas = document.createElement('canvas'); bgCanvas.width = 4; bgCanvas.height = 256;
  const bgCtx = bgCanvas.getContext('2d');
  const grd = bgCtx.createLinearGradient(0,0,0,256);
  grd.addColorStop(0, '#141b28'); grd.addColorStop(.55, '#0b0f16'); grd.addColorStop(1, '#06080c');
  bgCtx.fillStyle = grd; bgCtx.fillRect(0,0,4,256);
  const bgTex = new THREE.CanvasTexture(bgCanvas);
  bgTex.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTex;
  scene.fog = new THREE.Fog(0x0a0c11, 30, 60);

  const camera = new THREE.PerspectiveCamera(36, W/H, .1, 200);

  const controls = new OrbitControls(camera, glEl);
  controls.enableDamping = true;
  controls.dampingFactor = .09;
  controls.autoRotateSpeed = .55;
  controls.enablePan = true;
  controls.rotateSpeed = .9;

  /* ---------------- 灯光 ---------------- */
  scene.add(new THREE.HemisphereLight(0xa9beff, 0x1a1210, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(9, 14, 12); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff6a3a, 2.0); rim.position.set(-11, 6, -9); scene.add(rim);
  const fill = new THREE.DirectionalLight(0x66c8ff, 1.4); fill.position.set(6, 2, 14); scene.add(fill);

  // 从剖切面正前方偏上方补光，照亮切开的内部
  const innerLight = new THREE.DirectionalLight(0xfff2e0, 3.4); innerLight.position.set(1.5, 3, 9); scene.add(innerLight);
  scene.add(new THREE.AmbientLight(0x9aa8c8, .95));

  /* ---------------- 材质 ---------------- */
  const M = {
    block:  smoothMat(0x6b7688, {roughness:.5}),
    bowl:   smoothMat(0x3a4453, {roughness:.7, metalness:.35}),
    head:   smoothMat(0x9aa5b6, {roughness:.3, metalness:.85}),
    cover:  smoothMat(0x8792a5, {roughness:.45, metalness:.6}),
    piston: smoothMat(0xe9eef6, {roughness:.2, metalness:.9}),
    ring:   smoothMat(0x1e2531, {roughness:.45}),
    rod:    smoothMat(0xc9d3e0, {roughness:.28, metalness:.9}),
    crank:  smoothMat(0xff5a30, {roughness:.32, metalness:.7}),
    cam:    smoothMat(0xffb02e, {roughness:.35, metalness:.85}),
    valve:  smoothMat(0xb8c4d4, {roughness:.2, metalness:1}),
    intake: smoothMat(0x5fc8e8, {roughness:.35, metalness:.35}),
    exhaust:smoothMat(0x7d8798, {roughness:.62, metalness:.7}),
    plug:   smoothMat(0xf0ead6, {roughness:.3, metalness:.8}),
    turbo:  smoothMat(0xa78bfa, {roughness:.32, metalness:.85}),
    belt:   smoothMat(0x191e27, {roughness:.8, metalness:.1}),
    flame:  new THREE.MeshBasicMaterial({color:0xff8a3c, transparent:true, opacity:0})
  };

  /* ---------------- 主体 ---------------- */
  const root = new THREE.Group();
  scene.add(root);

  const L = spec.L;                       // 曲轴方向长度
  const CRANK_Y = 0;                      // 曲轴中心高度
  const BANK_X = -L/2 + .55;              // 第一缸 X 位置
  const SPACING = spec.banks[0].n>1 ? (L-1.1)/(spec.banks[0].n-1) : 0;
  const BORE = spec.thin? .28 : (spec.small? .30 : .33);
  const DECK = 1.18;                      // 活塞上止点时顶面高度（相对曲轴中心）
  const BANK_Y = .40;                     // 缸体起始高度
  const BANK_H = DECK - BANK_Y + .2;      // 缸筒长度

  const clipPlane = new THREE.Plane(new THREE.Vector3(0,0,-1), 0);  // 剖掉靠近镜头的一半
  const clipTargets = [];   // 切到“前半”才隐藏的零件

  function add(mesh, parent){ (parent||root).add(mesh); return mesh; }

  /* ---------- 曲轴 ---------- */
  const crank = new THREE.Group();
  crank.position.y = CRANK_Y;
  root.add(crank);

  const mainR = .075, pinR = .09, THROW = .21;
  const mainShaft = new THREE.Mesh(new THREE.CylinderGeometry(mainR, mainR, L, 10), M.crank);
  mainShaft.rotation.z = Math.PI/2; mainShaft.position.set(0, 0, 0);
  crank.add(mainShaft);
  // 主轴颈（更粗，带轴承座）
  for(let i=0;i<=spec.banks[0].n;i++){
    const x = BANK_X - SPACING*.5 + i*SPACING;
    const j = new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.22,10), M.bowl);
    j.rotation.z = Math.PI/2; j.position.set(x, 0, 0); crank.add(j);
  }
  // 曲拐（每个缸一个，位置与该缸 X 对齐；相位按点火顺序错开）
  const crankPins = [];      // 每个缸的曲拐销（局部坐标，随 crank 旋转）
  for(let b=0;b<spec.banks.length;b++){
    const bank = spec.banks[b];
    for(let i=0;i<bank.n;i++){
      const idx = b*bank.n + i;
      const x = BANK_X + i*SPACING;
      const order = FIRING[opts.layout] || null;
      const half = Math.max(2, Math.ceil(N/2));
      // 该缸在点火顺序里的名次 → 曲拐相位
      let rank = idx;
      if(order && order.length===N){
        const cylNo = idx + 1;
        const pos = order.indexOf(cylNo);
        rank = pos>=0? pos : idx;
      }
      const phase = (rank % half) * (Math.PI*2 / half);
      const wrap = new THREE.Group();
      wrap.position.set(x, 0, 0);
      wrap.rotation.x = phase;              // 曲拐相对主轴颈的相位
      // 两片曲柄臂
      const webGeo = new THREE.CylinderGeometry(THROW*.95, THROW*.95, .09, 20, 1, false, Math.PI*0.15, Math.PI*0.7);
      const webFront = new THREE.Mesh(webGeo, M.crank);
      webFront.rotation.set(0, 0, -Math.PI/2 + Math.PI*0.15);
      webFront.position.set(-.13, THROW*.48, 0);
      webFront.scale.set(1, 1, 1);
      const webBack = webFront.clone();
      webBack.position.set(.13, THROW*.48, 0);
      // 曲拐销
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(pinR, pinR, .26, 10), M.rod);
      pin.rotation.z = Math.PI/2; pin.position.set(0, THROW, 0);
      wrap.add(webFront, webBack, pin);
      // 销的端面（深色，像连杆大头）
      const bigEnd = new THREE.Mesh(new THREE.CylinderGeometry(pinR*1.55, pinR*1.55, .2, 10), M.rod);
      bigEnd.rotation.z = Math.PI/2; bigEnd.position.set(0, THROW, 0);
      wrap.add(bigEnd);
      crank.add(wrap);
      crankPins.push({g:wrap, x, phase, bank:b, i});
    }
  }

  // 飞轮 + 皮带轮
  const fly = new THREE.Mesh(new THREE.CylinderGeometry(.66,.66,.16,24), M.head);
  fly.rotation.z = Math.PI/2; fly.position.set(L/2+.12, 0, 0); root.add(fly);
  const flyHoles = 6;
  for(let i=0;i<flyHoles;i++){
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.2,10), M.bowl);
    hole.rotation.z = Math.PI/2;
    const a = i*Math.PI*2/flyHoles;
    hole.position.set(L/2+.12, Math.cos(a)*.42, Math.sin(a)*.42); root.add(hole);
  }
  const pulley = new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.22,24), M.cover);
  pulley.rotation.z = Math.PI/2; pulley.position.set(-L/2-.1, 0, 0); root.add(pulley);

  /* ---------- 每个缸列：缸体 / 缸盖 / 活塞 / 连杆 / 气门 ---------- */
  const banks = [], heads = [], pistons = [], flames = [], cams = [];
  spec.banks.forEach((bank, bi)=>{
    const ang = bank.a * Math.PI/180;
    const g = new THREE.Group();
    g.rotation.z = -ang;          // 负号：正角度 = 向 +X 侧倾斜
    g.position.set(0, CRANK_Y, bank.lat||0);
    root.add(g);
    banks.push({g, bank, ang});

    const n = bank.n;
    const bh = BANK_H;             // 缸体高度
    const bw = BORE*2.5;           // 缸体厚度（Z）

    // --- 缸体：实心箱体（剖切后截面完整），内部有缸筒与活塞 ---
    const bw2 = BORE*2.35;
    // 缸体：整块实心，随剖切平面切掉靠近观察者的一半
    const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(L, bh, bw2), M.block);
    blockMesh.position.set(0, BANK_Y + bh/2, 0);
    g.add(blockMesh);

    // 缸体轮廓线（剖切后仍保留，让截面边界清晰可读）
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(L, bh, bw2)),
      new THREE.LineBasicMaterial({color:0x9fb0c8, transparent:true, opacity:.45})
    );
    edges.position.y = BANK_Y + bh/2;
    g.add(edges);

    // 底板与缸盖结合面（比缸体略宽，做出台阶感）
    const base = new THREE.Mesh(new THREE.BoxGeometry(L+.08, .16, bw2+.18), M.bowl);
    base.position.y = BANK_Y - .04; g.add(base);
    const deckPlate = new THREE.Mesh(new THREE.BoxGeometry(L+.06, .1, bw2+.06), M.head);
    deckPlate.position.y = BANK_Y + bh + .03; g.add(deckPlate);

    // 缸孔：深色内壁（剖开后看见真正的“孔”，活塞就在里面）
    for(let i=0;i<n;i++){
      const x = BANK_X + i*SPACING;
      const bore = new THREE.Mesh(new THREE.CylinderGeometry(BORE*1.06, BORE*1.06, bh*.9, 20, 1, true, Math.PI*.5, Math.PI*2),
        new THREE.MeshStandardMaterial({color:0x0b1119, metalness:.25, roughness:.95, side:THREE.DoubleSide}));
      bore.position.set(x, BANK_Y + bh/2, -bw2*.05);
      g.add(bore);
    }
    // 缸间加强筋（外部可见的横向环）
    for(let k=0;k<3;k++){
      const hoop = new THREE.Mesh(new THREE.BoxGeometry(L+.05, .07, bw2+.07), M.bowl);
      hoop.position.y = BANK_Y + bh*(.22 + k*.28);
      g.add(hoop);
    }

    // --- 缸盖（可整体抬起） ---
    const head = new THREE.Group();
    head.position.y = BANK_Y + bh;
    g.add(head); heads.push(head);

    const headH = .40;
    // 缸盖本体分成“后半（常驻）”和“前半（剖切后消失）”
    const headBack = new THREE.Mesh(new THREE.BoxGeometry(L+.04, headH, BORE*1.25), M.head);
    headBack.position.set(0, headH/2 + .02, -BORE*.48); head.add(headBack);
    const headFront = new THREE.Mesh(new THREE.BoxGeometry(L+.04, headH, BORE*1.05), M.head);
    headFront.position.set(0, headH/2 + .02, BORE*.40); head.add(headFront);
    // 气门室盖
    const coverBack = new THREE.Mesh(new THREE.BoxGeometry(L-.7, .22, BORE*1.0), M.cover);
    coverBack.position.set(0, headH + .19, -BORE*.40); head.add(coverBack);
    const coverFront = new THREE.Mesh(new THREE.BoxGeometry(L-.7, .22, BORE*.78), M.cover);
    coverFront.position.set(0, headH + .19, BORE*.30); head.add(coverFront);
    const camBack = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,L-.8,10), M.cam);
    camBack.rotation.z = Math.PI/2; camBack.position.set(0, headH + .07, -BORE*.4); head.add(camBack);
    cams.push(camBack);
    // 点火线圈
    for(let i=0;i<n;i++){
      const coil = new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.24,8), M.bowl);
      coil.position.set(BANK_X + i*SPACING, headH + .05 + .22 + .1, 0); head.add(coil);
    }
    // 凸轮轴（在气门室盖里，旋转）
    const cam = new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,L-.7,10), M.cam);
    cam.rotation.z = Math.PI/2; cam.position.set(0, headH + .07, 0);
    head.add(cam); cams.push(cam);

    // 进气管 / 喇叭口（+Z 侧）
    for(let i=0;i<n;i++){
      const x = BANK_X + i*SPACING;
      const stub = new THREE.Mesh(new THREE.CylinderGeometry(.075,.095,.42,10), M.intake);
      stub.position.set(x, headH*.55, BORE*1.05 + .05);
      stub.rotation.x = Math.PI/2 - .35; head.add(stub);
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(.155,.085,.26,10,1,true), M.intake);
      bell.position.set(x, headH*.62, BORE*1.05 + .22);
      bell.rotation.x = Math.PI/2 - .35; head.add(bell);
      // 排气（-Z 侧）
      const ex = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.32,8), M.exhaust);
      ex.position.set(x, headH*.40, -BORE*1.10 - .06);
      ex.rotation.x = Math.PI/2 + 1.1; head.add(ex);
    }

    // --- 活塞 + 连杆：杆的下端跟随曲拐销（世界坐标），上端跟随活塞销 ---
    for(let i=0;i<n;i++){
      const x = BANK_X + i*SPACING;
      const pinObj = crankPins.find(p=>p.bank===bi && p.i===i);

      // 活塞组：在缸列局部坐标系里只做竖直平移
      const pis = new THREE.Group();
      pis.position.set(x, 0, -bw2*.05);
      pis.rotation.z = -g.rotation.z;   // 补偿缸列倾斜，让活塞始终沿世界 Y 上下
      g.add(pis);

      const bodyH = .42;
      const pistonBody = new THREE.Mesh(new THREE.CylinderGeometry(BORE, BORE, bodyH, 14), M.piston);
      pistonBody.position.y = 0; pis.add(pistonBody);
      const pistonTop = new THREE.Mesh(new THREE.CylinderGeometry(BORE, BORE*.96, .05, 14), M.ring);
      pistonTop.position.y = bodyH/2; pis.add(pistonTop);
      for(let r=0;r<2;r++){
        const ring = new THREE.Mesh(new THREE.TorusGeometry(BORE*.86, .026, 4, 12), M.ring);
        ring.rotation.x = Math.PI/2; ring.position.y = bodyH*.32 - r*.09; pis.add(ring);
      }
      const wrist = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,BORE*.9,10), M.rod);
      wrist.rotation.x = Math.PI/2; wrist.position.y = -bodyH*.35; pis.add(wrist);

      // 火花塞（缸盖上，跟着缸盖动，不跟活塞）
      const plug = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.26,8), M.plug);
      plug.position.set(x, BANK_Y+BANK_H+.26, -bw2*.22);
      plug.userData.clipSafe = true;
      g.add(plug);

      // 连杆：用 lookAt 把两端连起来
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(.045,.075,1,6), M.rod);
      rod.position.set(x, 0, -BORE*.42);
      g.add(rod);

      // 火焰
      const flame = new THREE.Mesh(new THREE.SphereGeometry(.17, 12, 10), M.flame.clone());
      flame.position.set(0, bodyH/2 + .03, 0);
      flame.material.opacity = 0;
      pis.add(flame);

      const cIdx = bi*bank.n + i;
      pistons.push({pis, rod, pinObj, phase: (pinObj? pinObj.phase : 0), x, bodyH});
      flames.push({mesh:flame, phase: (pinObj? pinObj.phase : 0), idx: flames.length, cyl: bi*n + i + 1});
    }
  });

  /* ---------- 涡轮（增压机型） ---------- */
  const turbos = [];
  if(/涡轮|turbo/i.test(d.asp||'')){
    const count = spec.w? 2 : 1;
    for(let i=0;i<count;i++){
      const tg = new THREE.Group();
      const x = (i-(count-1)/2)*L*.62;
      tg.position.set(x, CRANK_Y-.55, -1.65);
      const housing = new THREE.Mesh(new THREE.TorusGeometry(.38,.17,10,22), M.turbo); tg.add(housing);
      const comp = new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.12,18), M.piston);
      comp.rotation.x = Math.PI/2; tg.add(comp);
      for(let b=0;b<8;b++){
        const blade = new THREE.Mesh(new THREE.BoxGeometry(.26,.02,.09), M.rod);
        blade.rotation.y = b*Math.PI/4; blade.rotation.x = .4; blade.position.z = .08; tg.add(blade);
      }
      const inlet = new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.9,10), M.intake);
      inlet.rotation.x = Math.PI/2; inlet.position.z = -.7; tg.add(inlet);
      root.add(tg); turbos.push({g:tg, comp});
    }
  }

  /* ---------------- 自动取景 ---------------- */
  const fitBox = new THREE.Box3();
  root.traverse(o=>{ if(o.isMesh){ o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox.clone(); b.applyMatrix4(o.matrixWorld); fitBox.union(b); } });
  const size = fitBox.getSize(new THREE.Vector3());
  const center = fitBox.getCenter(new THREE.Vector3());
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2*Math.atan(Math.tan(vFov/2)*camera.aspect);
  const distV = (size.y*.62) / Math.tan(vFov/2);
  const distH = (size.x*.55) / Math.tan(hFov/2);
  const dist = Math.max(distV, distH) * 1.55;
  const maxDim = Math.max(size.x, size.y);
  const HOME = new THREE.Vector3(dist*.20, dist*.30, dist*.94);
  // 把模型整体平移到原点，视图中心才和画面中心一致
  root.position.set(-center.x, -center.y, -center.z);
  controls.target.set(0, 0, 0);
  camera.position.set(dist*.14, dist*.22, dist*.96);
  // 模型通常在画面偏下：把投影中心上移，使其视觉居中
  camera.setViewOffset(W, H, 0, -H*0.02, W, H);
  controls.minDistance = maxDim*.5;
  controls.maxDistance = dist*2.4;
  controls.update();

  clipPlane.constant = 1e3;

  /* ---------------- 状态 ---------------- */
  const state = {cut:false, explode:false, running:false, rpm:d.rpmLimit||7000, angle:0, expT:0};
  renderer.localClippingEnabled = true;
  // 默认：完整外观（剖切由用户手动开启）
  function renderNow(){ try{ step(0); }catch(e){ try{ renderer.render(scene,camera); }catch(_){} } }
  function setCut(on){
    state.cut = !!on;
    renderer.localClippingEnabled = true;
    // 缸体/缸盖等外壳：一直参与剖切（默认就在“剖开”状态），由 constant 控制
    root.traverse(o=>{
      if(!o.isMesh) return;
      const cuttable = [M.block, M.bowl].indexOf(o.material) >= 0;   // 只剖切缸体与底板
      o.material.clippingPlanes = (on && cuttable) ? [clipPlane] : null;
      o.material.clipShadows = false;
      o.material.needsUpdate = true;
    });
    clipTargets.forEach(m=>{ m.visible = !on; });
    clipPlane.constant = on? 0.02 : 1e3;
    renderNow();
  }

  /* ---------------- 主循环 ---------------- */
  const clock = new THREE.Clock();
  let raf = 0, frames = 0, lastT = 0;

  function step(dt){
    if(renderer.domElement.width < 2 || renderer.domElement.height < 2) return;
    const angVel = state.running ? (state.rpm/7000)*8.5 : 0;
    state.angle += dt*angVel;
    if(state.angle > Math.PI*4) state.angle -= Math.PI*4;

    crank.rotation.x = state.angle;
    cams.forEach(c=>{ c.rotation.x = state.angle*.5; });
    turbos.forEach(t=>{ t.comp.rotation.z += dt*angVel*5; });

    // 活塞 & 连杆（正确的曲柄连杆几何）
    const CONROD = 1.02;                 // 连杆长度
    for(let k=0;k<pistons.length;k++){
      const p = pistons[k];
      if(!p.pinObj) continue;
      const phi = p.pinObj.phase + state.angle;
      const along = Math.cos(phi) * THROW;               // 曲拐销在缸轴方向的位移
      const side  = Math.sin(phi) * THROW;               // 垂直于缸轴的分量
      // 连杆长度约束 → 活塞销沿缸轴的位置
      const pistonAlong = along + Math.sqrt(Math.max(.25, CONROD*CONROD - side*side));
      p.pis.position.y = pistonAlong;                    // 缸列局部坐标：缸轴 = +Y
      const dy = pistonAlong - along;
      p.rod.position.set(p.x, (pistonAlong + along)/2, 0);
      p.rod.scale.y = Math.sqrt(dy*dy + side*side);
      p.rod.rotation.x = Math.atan2(side, dy);
    }
    window.__ENGINE_FIRE = window.__ENGINE_FIRE || [];
    flames.forEach(f=>{
      // 曲轴转过“该缸上止点”之后的 0~60° 视为燃烧
      let a = (state.angle - f.phase) % (Math.PI*2);
      if(a < 0) a += Math.PI*2;
      const k = a < .9 ? Math.pow(1-a/.9, 2) : 0;
      if(f.idx==null) f.idx = flames.indexOf(f);
      window.__ENGINE_FIRE[f.idx] = state.running? k : 0;
      f.mesh.material.opacity = state.running? k*.9 : 0;
      f.mesh.scale.setScalar(1 + k*1.2);
    });

    // 拆解
    const target = state.explode?1:0;
    state.expT += (target - state.expT)*Math.min(1, dt*5);
    heads.forEach(h=>{ h.position.y = BANK_Y + BANK_H - .1 + state.expT*1.15; });
    turbos.forEach(t=>{ t.g.position.z = -1.65 - state.expT*1.1; });

    controls.update();
    renderer.render(scene, camera);
    if(window.__V3DLAST){ window.__V3DLAST.frames = frames; }
  }

  function loop(t){
    const dt = Math.min((t-lastT)/1000, .08);
    // 限帧：约 20fps，降低 WebKit 合成压力
    if(t - lastT < 45){ raf = requestAnimationFrame(loop); return; }
    lastT = t; frames++;
    step(dt);
    raf = requestAnimationFrame(loop);
  }

  let visible = true, timer = 0;
  function stopLoop(){ if(raf){ cancelAnimationFrame(raf); raf = 0; } }
  function startLoop(){
    if(raf || !visible || !state.running) return;
    lastT = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function tickOnce(){ try{ step(0); }catch(e){} }
  function ensureLoop(){ if(state.running) startLoop(); else stopLoop(); }

  const io = new IntersectionObserver(es=>{
    es.forEach(en=>{
      visible = en.isIntersecting;
      if(visible){ ensureLoop(); tickOnce(); } else { stopLoop(); }
    });
  }, {threshold:.02});
  io.observe(container);

  // 兜底：某些 webview 冻结 rAF 时，用定时器推进动画（仅在“运行”状态下）
  timer = setInterval(function(){
    if(visible && state.running && !raf){ try{ step(.08); frames++; }catch(e){} }
  }, 120);

  // 先画一帧静态画面，保证打开就能看到模型
  tickOnce();
  const ro = new ResizeObserver(()=>{
    const w = container.clientWidth, h = container.clientHeight;
    if(!w||!h) return;
    renderer.setSize(w,h);
    camera.aspect = w/h;
    camera.setViewOffset(w, h, 0, -h*0.02, w, h);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  });
  ro.observe(container);

  /* ---------------- 对外 API ---------------- */
  return {
    __debugCamera(){ return {pos:[camera.position.x,camera.position.y,camera.position.z], target:[controls.target.x,controls.target.y,controls.target.z], near:camera.near, far:camera.far, aspect:+camera.aspect.toFixed(2), hw:container.clientWidth, hh:container.clientHeight}; },
    __debug(){ return {order: FIRING[opts.layout]||null, cyl:N, meshCount:root.children.length, frames, cam:camera.position.toArray().map(v=>+v.toFixed(1)), dist:+dist.toFixed(1), visible, timerOn:!!timer}; },
    setCut,
    state,
    setExplode(v){ state.explode = !!v; state.expT = v?1:0; renderNow(); },
    setRunning(v){ state.running = !!v; ensureLoop(); tickOnce(); },
    setRpm(v){ state.rpm = Math.max(600, +v||0); },
    setView(name){
      const dd = dist;
      const pos = {
        front:[0, 0, dd],
        side:[dd, dd*.08, dd*.02],
        top:[.001, dd, .001],
        iso:[dd*.14, dd*.22, dd*.96],
        cut:[dd*.10, dd*.16, dd*.98],
        home:HOME.toArray()
      }[name] || HOME.toArray();
      camera.position.set(pos[0],pos[1],pos[2]);
      controls.target.set(0,0,0);
      controls.update();
      renderNow();
    },
    orbit(on){ controls.autoRotate = !!on; },
    resize(){ const w=container.clientWidth,h=container.clientHeight; if(w&&h){ renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); } },
    dispose(){
      if(raf) cancelAnimationFrame(raf);
      if(timer) clearInterval(timer);
      io.disconnect(); ro.disconnect(); controls.dispose();
      scene.traverse(o=>{
        if(o.isMesh){ o.geometry.dispose(); const ms = Array.isArray(o.material)? o.material:[o.material]; ms.forEach(m=>{ if(!m.__shared){ m.__shared=true; m.dispose(); } }); }
      });
      renderer.dispose();
      if(!isCanvasHost && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}
