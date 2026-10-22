/* 高性能发动机科普站 · 数据层
   数据口径：工厂公布的曲轴功率/扭矩为主，PS≈HP≈0.9863bhp；
   F1 历史机型为赛事/文献记载值，各来源存在差异，已标注"约"。
   全部数据为参数事实，未转录任何受版权保护的原文。 */
window.ENGINES = [
/* ============ 6 缸 ============ */
{
 id:"vg30dett", short:"VG30DETT", cyl:6, name:"Nissan VG30DETT", zh:"日产 VG30DETT", layout:"V6", layoutKey:"v-6",
 angle:"60°", valvetrain:"DOHC 24v", disp:"2960 cc", bore:"87 × 83 mm", cr:"8.5:1",
 years:"1989–2000", era:"JDM 黄金年代",
 power:300, powerAt:6400, torque:388, torqueAt:3600, rpmLimit:7500,
 weight:null, asp:"双涡轮（Twin Garrett T22/TB02）", cars:"300ZX (Z32)",
 note:"日本第一款量产 V6 家族 VG 的最强形态。双涡轮、双中冷、每缸独立喷油与点火，是 1990 年代日本跑车“300 匹自律上限”的标杆之一。",
 extra:"3D：看 V6 的曲轴。V6 用 3 个曲拐、互隔 120°，在 60° 夹角下正好实现 120° 均匀点火。",
 detail:"曲轴 3 个曲拐，两列共用；每个曲拐带动同侧对置的两个连杆。F1 用得最多的不是 V6，而是它的兄弟 V8。"
},
{
 id:"vr6-3.6", short:"VR6 3.6", cyl:6, name:"VW VR6 3.6 FSI", zh:"大众 VR6 3.6 FSI", layout:"VR6", layoutKey:"vr6",
 angle:"10.6°", valvetrain:"DOHC 24v", disp:"3598 cc", bore:"89 × 96.4 mm", cr:"11.0:1",
 years:"2005–2018", era:"现代",
 power:280, powerAt:6200, torque:360, torqueAt:2750, rpmLimit:6800,
 weight:null, asp:"自然吸气", cars:"Passat B6 / R36、Porsche Cayenne 3.6",
 note:"“VR”= V（V-Motor）+ 直列（Reihenmotor）。两列气缸以 10.6°–15° 的小夹角交错排列，共用一个缸盖，长度接近 4 缸机、宽度接近直列机，因此能塞进原本为 4 缸设计的机舱。",
 extra:"3D：VR6 的缸线只倾斜了 10.6°，两列活塞几乎肩并肩。所以它用的是“倾斜的活塞顶面”，而不是两套缸盖。",
 detail:"同一个缸盖下面同时坐着两列气门；因此凸轮轴只能用摇臂去够远端那一列，这是 VR 结构最难看也最聪明的地方。"
},
{
 id:"i6-2jz", short:"2JZ-GTE", cyl:6, name:"Toyota 2JZ-GTE", zh:"丰田 2JZ-GTE", layout:"直列6", layoutKey:"inline-6",
 angle:"—", valvetrain:"DOHC 24v", disp:"2997 cc", bore:"86 × 86 mm", cr:"8.5:1",
 years:"1991–2002", era:"JDM 黄金年代",
 power:280, powerAt:5600, torque:435, torqueAt:3600, rpmLimit:7200,
 weight:null, asp:"双涡轮（序列式）", cars:"Supra JZA80、Aristo",
 note:"铸铁缸体 + 方形缸径行程（86×86）让它天生抗压。日本市场标称 280 PS，实际输出普遍高于此值；改装圈仍是“千匹俱乐部”的常客。日规双涡轮为顺序工作，低转只有一个涡轮介入。",
 extra:"3D：直六的曲轴曲拐间隔 120°，1-6、2-5、3-4 两两相隔 360°。",
 detail:"这种配对让活塞的惯性力两两抵消——所有直六天生平衡，铸铁缸体只是让它更抗增压。"
},
{
 id:"i6-s54", short:"S54B32", cyl:6, name:"BMW S54B32", zh:"宝马 S54B32", layout:"直列6", layoutKey:"inline-6",
 angle:"—", valvetrain:"DOHC 24v + 双 VANOS", disp:"3246 cc", bore:"87 × 91 mm", cr:"11.5:1",
 years:"2000–2008", era:"现代",
 power:343, powerAt:7900, torque:365, torqueAt:4900, rpmLimit:8000,
 weight:null, asp:"自然吸气", cars:"E46 M3、Z4 M、M3 CSL",
 note:"自然吸气直六的教科书：个体节气门、机械式干式油底壳（CSL）、8000 rpm 红线，升功率约 105.7 PS/L。直六天生的完美一阶与二阶平衡让它敢往高转堆。",
 extra:"3D：直六 + 个体节气门，六根进气喇叭口排开，这是 M 部门最标志性的画面。",
 detail:"缸盖里是连续可变双 VANOS，红线 8000 rpm；它没有涡轮，全靠高转堆功率，所以低转很“闷”。"
},
{
 id:"i6-om606", short:"OM606 柴油", cyl:6, name:"Mercedes OM606 3.0 Turbodiesel", zh:"奔驰 OM606 柴油", layout:"直列6", layoutKey:"inline-6",
 angle:"—", valvetrain:"DOHC 24v", disp:"2996 cc", bore:"87 × 84 mm", cr:"22:1",
 years:"1993–2001", era:"现代",
 power:177, powerAt:4400, torque:330, torqueAt:1800, rpmLimit:5000,
 weight:null, asp:"涡轮增压（部分带中冷）", cars:"E300 TD (W210)",
 note:"直列六缸柴油机。铸铁缸体 + 高压喷射给了它夸张的缸压承受力，是欧洲柴油改装圈的“铁疙瘩”。",
 extra:"3D：柴油机不需要火花塞——压缩比 22:1，靠压缩自燃点火。",
 detail:"铸铁缸体 + 直喷让它天生能吃大增压；欧洲改装圈把它推到 500+ 匹的案例并不罕见。"
},
/* ============ 5 缸 ============ */
{
 id:"i5-07k", short:"EA855 2.5T", cyl:5, name:"Audi 2.5 TFSI (EA855)", zh:"奥迪 2.5 TFSI 直五", layout:"直列5", layoutKey:"inline-5",
 angle:"—", valvetrain:"DOHC 20v", disp:"2480 cc", bore:"82.5 × 92.8 mm", cr:"10.0:1",
 years:"2011–至今", era:"现代",
 power:400, powerAt:6000, torque:480, torqueAt:2250, rpmLimit:7000,
 weight:null, asp:"单涡轮", cars:"RS3、TT RS",
 note:"五缸的点火间隔是 144°/216°：既有直四没有的高转平顺性，又比直六短一截。涡轮五缸声浪独特，正是 1980 年代 Audi Quattro 拉力血统的延续。",
 extra:"3D：五缸曲轴只有 5 个曲拐、点火间隔 144°。它的“不平衡”正是声浪特殊的来源。",
 detail:"奥迪用一根反向平衡轴来抵消一阶不平衡；RS3 的 2.5 TFSI 是当代最成功的五缸。"
},
{
 id:"i5-penta", short:"B5254T 2.5T", cyl:5, name:"Volvo 2.5T 直五（B5254T）", zh:"沃尔沃 2.5T 直五", layout:"直列5", layoutKey:"inline-5",
 angle:"—", valvetrain:"DOHC 20v", disp:"2435 cc", bore:"83 × 90 mm", cr:"9.0:1",
 years:"1998–2016", era:"现代",
 power:230, powerAt:5000, torque:320, torqueAt:1500, rpmLimit:6500,
 weight:null, asp:"单涡轮（部分双涡管）", cars:"S60/V70 R、C30 T5、Focus ST",
 note:"沃尔沃把五缸做成了品牌符号：144°/216° 的不等间隔点火带来独特声线，配合低惯量涡轮，1500 转就能给足扭矩。",
 extra:"3D：五缸曲轴在一条线上，看起来不难，难的是配平。",
 detail:"沃尔沃在曲轴自由端加配重块，并用平衡轴抵消一阶力矩。"
},
{
 id:"i5-vw-ea855", short:"AAN 2.2 20V", cyl:5, name:"VW/Audi 2.2 20V Turbo (AAN/ABY)", zh:"大众 2.2 20V 涡轮直五", layout:"直列5", layoutKey:"inline-5",
 angle:"—", valvetrain:"DOHC 20v", disp:"2226 cc", bore:"81 × 86.4 mm", cr:"10.4:1",
 years:"1990–1997", era:"涡轮革命",
 power:315, powerAt:7000, torque:350, torqueAt:4200, rpmLimit:7800,
 weight:null, asp:"单涡轮 + 中冷", cars:"RS2 Avant、S2、Ur-S4",
 note:"Audi 五缸的巅峰之一：20 气门、双顶置凸轮轴、博世 Motronic。RS2 由 Porsche 参与调校，0–100 km/h 约 4.8 s，是 1994 年最快的旅行车之一。",
 extra:"3D：20 气门、每缸 4 气门，五缸合计 5 个活塞，比六缸短 1 缸的长度。",
 detail:"Audi Quattro 拉力赛用它赢下了 1980 年代的 Group B；RS2 是它上路的版本。"
},
/* ============ 8 缸 ============ */
{
 id:"dfv", short:"DFV V8", cyl:8, name:"Ford-Cosworth DFV", zh:"福特-考斯沃斯 DFV", layout:"90° V8", layoutKey:"v-8",
 angle:"90°", valvetrain:"DOHC 32v", disp:"2993 cc", bore:"85.67 × 64.90 mm", cr:"11.5:1",
 years:"1967–1983（F1）", era:"自然吸气 F1",
 power:408, powerAt:9000, torque:370, torqueAt:7000, rpmLimit:11000,
 weight:null, asp:"自然吸气", cars:"Lotus 49、McLaren M23、Williams FW07…",
 note:"被称作“最成功的赛车发动机”：1967–1985 年 F1 262 场中胜出 155 场。名字 DFV = Double Four Valve（双四气门），源自四缸 FVA。它是私人车队的制胜法宝——七十年代初整机售价约 7,500 英镑，1973、1969 两个赛季每站冠军都搭载它。",
 source:"1967 年首版约 400 bhp @ 9000 rpm；生涯末期经改装达到 510 bhp @ 11200 rpm",
 extra:"3D：60°? 不，90° V8。4 个曲拐、点火间隔 90°。",
 detail:"V8 的 90° 夹角让曲轴配重可以平衡一阶惯性力；这也是现代所有十字曲轴 V8 的祖师爷。"
},
{
 id:"s65", short:"S65B40", cyl:8, name:"BMW S65B40", zh:"宝马 S65B40", layout:"90° V8", layoutKey:"v-8",
 angle:"90°", valvetrain:"DOHC 32v + 双 VANOS", disp:"3999 cc", bore:"92 × 75.2 mm", cr:"12.0:1",
 years:"2007–2013", era:"现代",
 power:420, powerAt:8300, torque:400, torqueAt:3900, rpmLimit:8400,
 weight:206, asp:"自然吸气", cars:"E92 M3、M3 GTS",
 note:"由 V10 S85 砍掉两缸而来。8 根独立节气门、8400 rpm 红线，短行程大缸径（92×75.2）为高转而生。整机（含附件）约 206 kg。",
 extra:"3D：V8 + 个体节气门 + 十字曲轴，8 个缸在 8400 rpm 时每分钟点火 560 次。",
 detail:"S65 的缸体来自 S85 砍两缸，所以它也有 V10 那种“一字排开的进气喇叭口”。"
},
{
 id:"s65-gts", short:"S65 GTS", cyl:8, name:"BMW S65 (GTS)", zh:"宝马 S65 GTS 特调", layout:"90° V8", layoutKey:"v-8",
 angle:"90°", valvetrain:"DOHC 32v", disp:"4361 cc", bore:"92 × 82 mm", cr:"12.0:1",
 years:"2010", era:"现代",
 power:450, powerAt:8300, torque:440, torqueAt:3750, rpmLimit:8300,
 weight:null, asp:"自然吸气", cars:"M3 GTS（全球 150 台）",
 note:"缸径不动、行程加长到 82 mm，排量 4.4 L。自然吸气 M 部门的绝唱之一。",
 extra:"3D：和 S65B40 同构，行程加长 6.8 mm。",
 detail:"M3 GTS 只造了 150 台，是整个自然吸气 M 时代的告别之作。"
},
{
 id:"4.2-v8", short:"4.2 FSI", cyl:8, name:"Audi 4.2 FSI (B8 RS4/R8)", zh:"奥迪 4.2 FSI V8", layout:"90° V8", layoutKey:"v-8",
 angle:"90°", valvetrain:"DOHC 32v", disp:"4163 cc", bore:"84.5 × 92.8 mm", cr:"12.5:1",
 years:"2006–2015", era:"现代",
 power:450, powerAt:8250, torque:430, torqueAt:4000, rpmLimit:8500,
 weight:null, asp:"自然吸气 + 缸内直喷", cars:"RS4 B8、R8 V8",
 note:"RS4 B8 上的高转 V8：8250 转才能榨出全部 450 匹，压缩比 12.5:1，缸内直喷与可变进气歧管配合。",
 extra:"3D：90° V8、4 个曲拐、缸内直喷。",
 detail:"奥迪的 FSI 让压缩比做到 12.5:1，这是自然吸气 V8 里非常激进的数字。"
},
{
 id:"vee8-16v", short:"6¾ L V8 TT", cyl:8, name:"Bentley 6.75 L V8 TT", zh:"宾利 6¾ L V8 双涡轮", layout:"90° V8", layoutKey:"v-8",
 angle:"90°", valvetrain:"OHV 16v", disp:"6749 cc", bore:"104.1 × 99.1 mm", cr:"8.0:1",
 years:"1959–2020", era:"古董",
 power:530, powerAt:4000, torque:1100, torqueAt:1750, rpmLimit:5000,
 weight:null, asp:"双涡轮（后期）", cars:"Mulsanne Speed",
 note:"一台连续生产 61 年的 OHV 推杆 V8，后期版本靠双涡轮做到 1100 N·m。低转扭矩哲学的代表：红线才 5000 出头，却能在 1750 转给出全部扭矩。",
 extra:"3D：推杆 OHV、每列只有一根凸轮轴，结构简陋却极耐用。",
 detail:"6¾ L 这台机器从 1959 年一直造到 2020 年，是汽车史上寿命最长的 V8 之一。"
},
/* ============ 10 缸 ============ */
{
 id:"s85", short:"S85B50", cyl:10, name:"BMW S85B50", zh:"宝马 S85B50", layout:"90° V10", layoutKey:"v-10",
 angle:"90°", valvetrain:"DOHC 40v + 双 VANOS", disp:"4999 cc", bore:"92 × 75.2 mm", cr:"12.0:1",
 years:"2005–2010", era:"现代",
 power:508, powerAt:7750, torque:520, torqueAt:6100, rpmLimit:8250,
 weight:240, asp:"自然吸气", cars:"E60 M5、E63 M6",
 note:"BMW 唯一的量产 V10，灵感来自 2000 年代初 F1 的 V10。升功率约 101.6 PS/L，是当时量产自吸的顶级水平。",
 extra:"3D：V10 = 5 个曲拐，点火间隔 72°，90° 夹角下用偏置曲拐修正。",
 detail:"它和 F1 的 V10 同代，每缸一个节气门、双 VANOS，8250 rpm 断油。"
},
{
 id:"hur-5.2", short:"5.2 V10", cyl:10, name:"Lamborghini 5.2 V10 (CEVA)", zh:"兰博基尼 5.2 V10", layout:"90° V10", layoutKey:"v-10",
 angle:"90°", valvetrain:"DOHC 40v", disp:"5204 cc", bore:"84.5 × 92.8 mm", cr:"12.7:1",
 years:"2003–至今", era:"现代",
 power:640, powerAt:8000, torque:600, torqueAt:6500, rpmLimit:8500,
 weight:null, asp:"自然吸气 + 双喷射", cars:"Huracán LP640-4",
 note:"由 Audi 4.2 V8 家族放大两缸而来，和 R8 共享血统。8250→8500 rpm 的红线，配上 12.7:1 高压缩比，是最后的量产高转自吸之一。",
 extra:"3D：V10、10 个独立节气门，进气喇叭口几乎顶到发动机罩。",
 detail:"这台机器是奥迪 4.2 V8 扩两缸的产物，和 R8 共用缸体设计。"
},
{
 id:"carrera-gt", short:"Carrera GT", cyl:10, name:"Porsche Carrera GT 5.7 V10", zh:"保时捷 Carrera GT V10", layout:"68° V10", layoutKey:"v-10",
 angle:"68°", valvetrain:"DOHC 40v", disp:"5733 cc", bore:"98 × 76 mm", cr:"12.5:1",
 years:"2004–2007", era:"现代",
 power:612, powerAt:8000, torque:590, torqueAt:5750, rpmLimit:8400,
 weight:214, asp:"自然吸气", cars:"Carrera GT",
 note:"源自流产的 LMP2000 赛车项目。68° 夹角、214 kg、8400 rpm，6 速手动，被公认为声音最好的量产车之一。",
 extra:"3D：68° V10 是为了让重心更低、更紧凑，而不是为了平顺。",
 detail:"它最初是为 LMP2000 赛车准备的，项目取消后才被塞进公路车。"
},
{
 id:"f1-v10-bmw", short:"F1 P84/5", cyl:10, name:"BMW P84/5 F1 V10", zh:"宝马 F1 P84/5 V10", layout:"90° V10", layoutKey:"v-10",
 angle:"90°", valvetrain:"气动气门", disp:"3000 cc", bore:"98 × 39.7 mm", cr:"13.0:1",
 years:"2001–2005", era:"自然吸气 F1",
 power:900, powerAt:19000, torque:null, torqueAt:null, rpmLimit:20000,
 weight:95, asp:"自然吸气", cars:"Williams FW26/FW27、BMW Sauber",
 note:"2000 年代 F1 的 V10 时代：3.0 L、气动气门、19000+ rpm，约 900 bhp。2006 年起 F1 改回 2.4 L V8，V10 成为绝响。",
 extra:"3D：3.0 L、10 缸、气动气门——没有凸轮轴，油门由气动弹簧控制。",
 detail:"19000 rpm 时每个活塞每秒要上下 630 次，靠的是极短的 39.7 mm 行程。"
},
/* ============ 12 缸 ============ */
{
 id:"m70", short:"M70B50", cyl:12, name:"BMW M70B50", zh:"宝马 M70B50", layout:"60° V12", layoutKey:"v-12",
 angle:"60°", valvetrain:"SOHC 24v", disp:"4988 cc", bore:"84 × 75 mm", cr:"8.8:1",
 years:"1987–1996", era:"古董",
 power:300, powerAt:5200, torque:450, torqueAt:4100, rpmLimit:6000,
 weight:null, asp:"自然吸气", cars:"E32 750i/750iL、E31 850i",
 note:"战后德国第一台量产 V12（比奔驰 M120 早 4 年）。设计上就是两台 M20 直六以 60° 拼在一起；为冗余，两列气缸各有一套 ECU、油泵、油轨、节气门、空气流量计。",
 extra:"3D：60° V12 = 6 个曲拐，每 60° 点火一次。",
 detail:"两列各有一整套 ECU、油泵、节气门，甚至两套发电机——冗余设计到了奢侈的程度。"
},
{
 id:"s70-2", short:"S70/2", cyl:12, name:"BMW S70/2", zh:"宝马 S70/2（McLaren F1）", layout:"60° V12", layoutKey:"v-12",
 angle:"60°", valvetrain:"DOHC 48v + VANOS", disp:"6064 cc", bore:"86 × 87 mm", cr:"11.0:1",
 years:"1993–1998", era:"现代",
 power:627, powerAt:7400, torque:651, torqueAt:6700, rpmLimit:7500,
 weight:266, asp:"自然吸气", cars:"McLaren F1",
 note:"McLaren F1 的心脏：6064 cc、48 气门、干式油底壳、镀金隔热。整车 1998 年创下 386 km/h 的非官方量产车极速纪录。含附件与排气约 266 kg。",
 extra:"3D：V12、48 气门、VANOS、干式油底壳、镀金隔热层。",
 detail:"McLaren F1 的发动机舱被金箔包住，是为了反射热量，不是为了炫富（虽然效果一样）。"
},
{
 id:"l539", short:"L539", cyl:12, name:"Lamborghini L539", zh:"兰博基尼 L539", layout:"60° V12", layoutKey:"v-12",
 angle:"60°", valvetrain:"DOHC 48v", disp:"6498 cc", bore:"95 × 76.4 mm", cr:"11.8:1",
 years:"2011–2022", era:"现代",
 power:700, powerAt:8250, torque:690, torqueAt:5500, rpmLimit:8500,
 weight:235, asp:"自然吸气", cars:"Aventador LP700-4 / SVJ 770",
 note:"13 年以来兰博基尼第一款全新 V12。95 mm 缸径对 76.4 mm 行程极端超方形；点火顺序 1-12-4-9-2-11-6-7-3-10-5-8。SVJ 版本 770 PS。",
 extra:"3D：60° V12、95 mm 大缸径，短行程让它能冲到 8500 rpm。",
 detail:"点火顺序 1-12-4-9-2-11-6-7-3-10-5-8，原版 L539 是全新设计，和 Murciélago 的老 V12 没有零件共用。"
},
{
 id:"colombo", short:"Colombo 3.0", cyl:12, name:"Ferrari Colombo 3.0 V12", zh:"法拉利 Colombo V12", layout:"60° V12", layoutKey:"v-12",
 angle:"60°", valvetrain:"SOHC 24v", disp:"2953 cc", bore:"73 × 58.8 mm", cr:"9.0:1",
 years:"1959–1964", era:"古董",
 power:300, powerAt:7000, torque:null, torqueAt:null, rpmLimit:8000,
 weight:null, asp:"自然吸气（6 化油器）", cars:"250 GTO、250 Testa Rossa",
 note:"由 Gioacchino Colombo 设计，单缸仅 246 cc，却能做到 300 PS @ 7000 rpm。短行程 + 6 个韦伯化油器，是 1960 年代 GT 赛车的灵魂。",
 extra:"3D：60° V12、每列一根凸轮轴（SOHC），6 个韦伯化油器。",
 detail:"250 GTO 靠这台机器在 1962–64 年拿下车队冠军，如今是拍卖市场上最贵的车之一。"
},
{
 id:"w12", short:"6.0 W12 TT", cyl:12, name:"VW Group 6.0 W12 (Bentley Speed)", zh:"大众 6.0 W12 双涡轮", layout:"72° W12", layoutKey:"w-12",
 angle:"72°", valvetrain:"DOHC 48v", disp:"5998 cc", bore:"84 × 90.2 mm", cr:"9.0:1",
 years:"2001–2024", era:"现代",
 power:659, powerAt:6000, torque:900, torqueAt:1700, rpmLimit:6400,
 weight:239, asp:"双涡轮", cars:"Continental GT Speed、Bentayga、Audi A8 W12",
 note:"把两台 15° VR6 以 72° 夹角拼在一根曲轴上，每个 VR 对只用一个缸盖，所以 12 缸只用 4 根凸轮轴（与 V12 相同）。整机 239 kg，外形比当年大众 4.2 V8 还紧凑。宾利 Speed 版本 659 PS / 900 N·m。",
 extra:"3D：W 形 = 两组 VR6，每组 15°，两组之间 72°。四个“汽缸列”共用 4 根凸轮轴。",
 detail:"宾利 Speed 版的双涡轮让 1700 rpm 就能给出 900 N·m，这就是“豪华车扭矩”的数学定义。"
},
{
 id:"f1-v12-f1", short:"312 Flat-12", cyl:12, name:"Ferrari 312 系列 Flat-12", zh:"法拉利 312 Flat-12", layout:"180° 水平对置12", layoutKey:"v-12",
 angle:"180°", valvetrain:"DOHC 48v", disp:"2992 cc", bore:"80 × 49.6 mm", cr:"11.5:1",
 years:"1970–1980", era:"自然吸气 F1",
 power:515, powerAt:12300, torque:null, torqueAt:null, rpmLimit:13000,
 weight:null, asp:"自然吸气", cars:"312B、312T、312T4",
 note:"80×49.6 mm 的极短行程，到 12300 rpm 仍有 515 hp。水平对置让重心极低，但宽得离谱——它在 1979 年后被地面效应车身“嫌弃”，也正是 Cosworth DFV 那类紧凑 V8 赢下 1978–1981 车手冠军的背景。",
 extra:"3D：180° 水平对置 12 缸，曲轴在中间，两排活塞左右对拍。",
 detail:"它宽得让地面效应车身无处安放，这也是 1980 年代 F1 转向 V8 的技术原因之一。"
},
/* ============ 16 缸 ============ */
{
 id:"w16", short:"W16", cyl:16, name:"Bugatti W16 (Chiron Super Sport)", zh:"布加迪 W16 quad-turbo", layout:"W16", layoutKey:"w-16",
 angle:"90°", valvetrain:"DOHC 64v", disp:"7993 cc", bore:"86 × 86 mm", cr:"9.3:1",
 years:"2005–2024", era:"现代",
 power:1600, powerAt:6700, torque:1600, torqueAt:2000, rpmLimit:6900,
 weight:400, asp:"四涡轮", cars:"Veyron、Chiron、Chiron Super Sport 300+、Bolide",
 note:"本质是两台窄角 VR8 以 90° 相交，共用一根曲轴、四颗涡轮。86×86 的方形缸径行程让它在 6900 转内输出 1600 N·m。整机 400 kg。Bolide 版本 1600 PS 以上。2019 年 Chiron Super Sport 300+ 跑到 490.484 km/h（单向）。",
 extra:"3D：四排气缸 W 形，16 个活塞夹在一条曲轴上，4 颗涡轮两两串联。",
 detail:"整机 400 kg，却能输出 1600 PS——升功率 200 PS/L，对 8.0 L 的机器来说这是涡轮的胜利。"
},
{
 id:"cadillac-v16", short:"Cadillac V16", cyl:16, name:"Cadillac V16 (Series 452)", zh:"凯迪拉克 V16", layout:"45° V16", layoutKey:"v-16",
 angle:"45°", valvetrain:"OHV 32v", disp:"7412 cc", bore:"76.2 × 101.6 mm", cr:"5.5:1",
 years:"1930–1940", era:"古董",
 power:165, powerAt:3400, torque:null, torqueAt:null, rpmLimit:4000,
 weight:null, asp:"自然吸气", cars:"Cadillac Series 452 / 90",
 note:"1930 年发布的量产 V16：7.4 L、45° 夹角、推杆 OHV，能安静到用一枚硬币立在怠速的发动机上。它证明多缸不只是为了快，也是为了“平顺”这件奢侈品。",
 extra:"3D：45° V16、7 个曲拐、推杆 OHV，怠速平稳到能立硬币。",
 detail:"它只造了约 4000 台，每台售价相当于今天的 10 万美元以上，是大萧条时期最奢侈的工业品。"
},
{
 id:"autounion-v16", short:"Auto Union C", cyl:16, name:"Auto Union Type A/C V16 (Reinhart)", zh:"汽车联盟 C 型 V16", layout:"45° V16 增压", layoutKey:"x-16",
 angle:"45°", valvetrain:"DOHC 32v", disp:"6005 cc", bore:"75 × 85 mm", cr:"7.0:1",
 years:"1934–1939", era:"古董",
 power:520, powerAt:5000, torque:null, torqueAt:null, rpmLimit:5500,
 weight:null, asp:"机械增压（双 Roots）", cars:"Auto Union Type C",
 note:"1930 年代 GP 赛车的怪兽：V16、双机械增压，约 520 PS，后置发动机 + 独立悬架。当时没有涡轮，增压全靠曲轴硬拖，油门响应才那么直接。",
 extra:"3D：45° V16 + 双机械增压，排气量 6.0 L 却做出 520 PS。",
 detail:"1930 年代的 GP 赛车没有空气动力学，全靠马力与轮胎；后置 16 缸让 Type C 的重心非常特殊。"
},
{
 id:"bmw-goldfish", short:"Goldfish V16", cyl:16, name:"BMW Goldfish V16", zh:"宝马 Goldfish V16 原型", layout:"60° V16", layoutKey:"x-16",
 angle:"60°", valvetrain:"DOHC 64v", disp:"6650 cc", bore:"88 × 68.4 mm", cr:"11.5:1",
 years:"1987–1988（原型）", era:"古董",
 power:408, powerAt:5500, torque:626, torqueAt:3500, rpmLimit:6500,
 weight:null, asp:"自然吸气", cars:"BMW 750iL 试验车（代号 Goldfish）",
 note:"为验证 7 系能否装下 16 缸而造的两台原型之一。由基础 M70 扩缸而来，最终因成本和布置问题没有量产，成了宝马的都市传说。",
 extra:"3D：两台 Goldfish 原型在 1987 年被造出来，一台是 6.6 L V16，一台是 7.0 L V16。",
 detail:"它们的存在只为回答一个问题：7 系的车头能不能塞下 16 缸。答案是不能——发动机罩得抬高 12 cm。"
}
];
