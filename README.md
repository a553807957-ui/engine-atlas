# 多缸发动机图谱 · Multi-Cylinder Engine Atlas

一个纯前端的发动机科普站点：**27 台 5–16 缸高性能机型**的参数图谱，外加一个可交互的 **3D 解剖台**（21 台机型，实时旋转 / 剖切 / 拆解 / 调转速 / 点火时序）。

无需构建、无需服务器，双击 `index.html` 即可离线浏览。没有第三方 CDN、字体、追踪或 cookie。

## 在线页面

| 文件 | 内容 |
|---|---|
| `index.html` | 型号图谱、3D 入口、缸型解剖、数据对比、总表（可排序）、原理冷知识、百年简史、版权说明 |
| `viz.html` | **3D 解剖台**：拖动旋转 / 双指缩放 / 剖切 / 拆解 / 800–19000 rpm 转速 / 逐缸点火顺序表盘 |

## 3D 解剖台

- **几何全部由代码生成**：气缸、活塞、连杆、曲轴、缸盖、凸轮轴、进气喇叭口、涡轮、飞轮……没有任何 `.glb`/`.obj` 模型文件。
- **曲柄连杆运动学**：活塞位置由连杆长度约束计算，不是简单正弦摆动。
- **剖切**：用 `THREE.Plane` 裁剪缸体前半，露出缸筒、活塞、连杆与曲轴。
- **拆解**：缸盖整体抬起，观察缸体 / 缸盖 / 曲轴的分层关系。
- **点火顺序**：按各机型真实点火顺序（W16 `1-14-9-4-…`、L539 `1-12-4-9-…`、直六 `1-5-3-6-2-4` 等）逐缸闪烁。

覆盖布局：W16、W12、X16、V16、V12、V10、V8、V6、15° VR6、直列 5 / 6。

## 关于版权：这个站是怎么避免踩线的

这是本仓库最在意的部分。

1. **没有使用任何厂商图片。**
   缸型示意图全部由 `gen_layouts.py` 生成原创 SVG（每个圆代表一个气缸，看的是排布方式）。3D 模型是代码生成的几何体。首页的 3D 入口图是本站在解剖台里自行渲染并截取的画面（`assets/shots/`），不是厂商宣传素材。

2. **没有搬运厂商文案或第三方文章。**
   所有介绍文字均为原创撰写。引用到的历史事件（例如 "DFV 在 1967–1985 年 F1 的 262 场中胜出 155 场"）属于事实性信息，不受著作权保护。

3. **参数事实的边界。**
   排量、缸径 × 行程、功率、扭矩、红线、整机重量等属于事实性数据。不同来源常有 ±5% 差异，尤其是 F1 历史机型与不同年款 —— 页面中对这类数据一律标注「约」或版本说明。

4. **商标的指名性使用。**
   BMW、Mercedes-Benz、Volkswagen、Audi、Porsche、Nissan、Toyota、Volvo、Lamborghini、Ferrari、Bugatti、Bentley、Cadillac、Cosworth、Ford、McLaren 等名称仅用于指代被描述的产品（nominative use），不表示任何关联、赞助或背书。仓库中不含任何厂商 logo。

5. **第三方代码。**
   `vendor/three.module.js` 与 `lib/OrbitControls.js` 来自 Three.js r160，遵循 **MIT** 许可证（Copyright © three.js authors），许可证全文见 [three.js/LICENSE](https://github.com/mrdoob/three.js/blob/dev/LICENSE)。

## 许可

- **代码**（HTML / CSS / JS / Python）：**MIT**，见 `LICENSE`。
- **内容**（文字、SVG 示意图、3D 模型设计、截图）：**CC BY-NC 4.0** —— 署名、非商业使用。商用请自行重绘 / 重写或联系授权。

## 目录结构

```
index.html                 主站
viz.html                   3D 解剖台
style.css                  全站样式
data.js                    发动机数据库（改这里＝改全站）
app.js                     主站渲染 / 筛选 / 详情 / 图表 / 时间线
lib/engine3d.js            3D 建模引擎源码（Three.js，程序化生成几何）
lib/standalone.js          3D 解剖台交互
lib/OrbitControls.js       轨道控制器（Three.js examples，MIT）
vendor/three.module.js     Three.js r160
vendor/engine3d.bundle.js  打包产物（浏览器实际加载，经典脚本）
build.sh                   把 three + OrbitControls + engine3d 打包成 bundle
assets/layouts/*.svg       缸型示意（原创，gen_layouts.py 生成）
assets/shots/*.jpg         本站在 3D 解剖台内自行渲染的截图
gen_layouts.py             SVG 生成脚本
```

## 本地修改

```bash
# 改了 3D 相关源码后重新打包
sh build.sh

# 重新生成缸型示意图
python3 gen_layouts.py
```

> `minis://` 等 file-like 协议下 ES module 的相对导入不可靠，因此 3D 部分被刻意打包为经典脚本（IIFE）。用 `python3 -m http.server` 之类的本地服务器打开也一样能跑。

## 数据说明

功率为曲轴输出（DIN 口径），PS ≈ HP ≈ 0.9863 bhp。F1 历史机型为赛事 / 文献记载值，各来源存在差异，页面中已用「约」标注。本仓库数据仅供参考，不作为工程或采购依据。

---

内容勘误欢迎提 Issue：如果某处参数与厂商公开规格不符，那多半是本仓库写错了，以官方公布为准。
