#!/bin/sh
set -e
node -e "
const fs=require('fs');
let three=fs.readFileSync('vendor/three.module.js','utf8');
const m=three.match(/export\s*\{([\s\S]*?)\};?\s*$/);
let list=[];
if(m){ list=m[1].split(',').map(s=>s.trim()).filter(Boolean).map(s=>{const p=s.split(/\s+as\s+/);return [p[0],p[1]||p[0]];}); three=three.replace(m[0],''); }
let oc=fs.readFileSync('lib/OrbitControls.js','utf8');
oc=oc.replace(/import\s*\{[^}]*\}\s*from\s*'[^']*';/,'').replace(/export\s*\{\s*OrbitControls\s*\};?/,'');
let eng=fs.readFileSync('lib/engine3d.js','utf8');
eng=eng.replace(/^import[^;]*;/gm,'').replace('export function createEngine','function createEngine');
let out='/* bundled: three.js r160 + OrbitControls + engine3d — 由 build.sh 生成，勿手改 */\n';
out+='var THREE=(function(){\n'+three+'\nreturn {'+list.map(([a,b])=>b+':'+a).join(',')+'};\n})();\n';
out+='var OrbitControls=(function(){\nconst THREE_NS=THREE;\nconst {'+['EventDispatcher','MOUSE','Quaternion','Spherical','TOUCH','Vector2','Vector3','Plane','Ray','MathUtils'].join(',')+'}=THREE;\n';
out+=oc.replace(/\bOrbitControls\b/g,'ORBIT_CTRL')+'\nreturn ORBIT_CTRL;\n})();\n';
out+='THREE.OrbitControls=OrbitControls;\n';
out+='var Engine3D=(function(){\nconst THREE=window.THREE;const OrbitControls=window.THREE.OrbitControls;\n'+eng+'\nreturn {createEngine:createEngine};\n})();\n';
out+='window.Engine3D=Engine3D;\n';
fs.writeFileSync('vendor/engine3d.bundle.js', out);
console.log('bundle bytes', out.length);
"
