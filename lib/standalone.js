/* standalone.js — 3D 解剖台页面逻辑（viz.html 专用） */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var LAYOUTS = ['w-16','w-12','x-16','v-16','v-12','v-10','v-8','v-6','vr6','inline-6','inline-5'];
  var ALL = (window.ENGINES||[]).filter(function(e){ return LAYOUTS.indexOf(e.layoutKey) >= 0; });

  var ORDER = {
    'l539':'1-12-4-9-2-11-6-7-3-10-5-8',
    'hur-5.2':'1-6-5-10-2-7-3-8-4-9',
    's85':'1-6-5-10-2-7-3-8-4-9',
    'carrera-gt':'1-6-5-10-2-7-3-8-4-9',
    'w16':'1-14-9-4-13-16-11-6-15-10-3-8-12-7-2-5',
    'w12':'1-12-5-8-3-10-6-7-2-11-4-9',
    'm70':'1-7-5-11-3-9-6-12-2-8-4-10',
    's70-2':'1-7-5-11-3-9-6-12-2-8-4-10',
    'colombo':'1-7-5-11-3-9-6-12-2-8-4-10',
    'f1-v12-f1':'1-7-5-11-3-9-6-12-2-8-4-10',
    'i6-2jz':'1-5-3-6-2-4','i6-s54':'1-5-3-6-2-4','i6-om606':'1-5-3-6-2-4',
    'vg30dett':'1-2-3-4-5-6',
    's65':'1-5-4-8-6-3-7-2','s65-gts':'1-5-4-8-6-3-7-2','4.2-v8':'1-5-4-8-6-3-7-2',
    'dfv':'1-5-4-8-6-3-7-2','vee8-16v':'1-5-4-8-6-3-7-2',
    'i5-07k':'1-2-4-5-3','i5-penta':'1-2-4-5-3','i5-vw-ea855':'1-2-4-5-3',
    'cadillac-v16':'1-16-3-14-5-12-7-10-9-8-11-6-13-4-15-2',
    'autounion-v16':'1-8-3-10-5-12-7-14-2-9-4-11-6-13-8-15',
    'bmw-goldfish':'1-11-5-15-3-9-7-13-2-12-6-16-4-10-8-14'
  };

  var api = null, cur = null, dialTimer = 0;

  /* ---------- 机型下拉 ---------- */
  function fillSelect(){
    var sel = $('sel'), out = '', last = null;
    ALL.slice().sort(function(a,b){ return b.cyl - a.cyl; }).forEach(function(e){
      if(e.cyl !== last){ out += (last!==null ? '</optgroup>' : '') + '<optgroup label="' + e.cyl + ' 缸">'; last = e.cyl; }
      out += '<option value="' + e.id + '">' + e.name + '</option>';
    });
    sel.innerHTML = out + '</optgroup>';
  }

  function pick(id){
    var e = ALL.filter(function(x){ return x.id === id; })[0] || ALL[0];
    return e;
  }

  /* ---------- 挂载 ---------- */
  function mount(id){
    var d = pick(id || (location.hash || '').replace('#','') || 'w16');
    cur = d;
    var host = $('viz3d');
    if(api){ try{ api.dispose(); }catch(e){} api = null; }
    host.innerHTML = '';
    if(!window.Engine3D){ host.innerHTML = '<p style="color:#8b95a7;padding:20px">3D 引擎加载失败。</p>'; return; }
    api = window.Engine3D.createEngine(host, {layout:d.layoutKey, data:d});
    window.__api = api;

    $('nm').textContent = d.name;
    $('sub').textContent = d.zh + ' · ' + d.cyl + ' 缸 ' + d.layout + ' · ' + d.disp;
    $('pw').textContent = d.power + ' PS';
    $('pwsub').textContent = '@ ' + (d.powerAt||0).toLocaleString() + ' rpm';
    $('sel').value = d.id;

    var rpm = $('rpm');
    rpm.max = Math.max(9000, Math.round((d.rpmLimit||7000) * 1.25));
    rpm.value = d.rpmLimit || 7000;
    $('rpmv').textContent = (d.rpmLimit||7000).toLocaleString() + ' rpm';
    api.setRpm(d.rpmLimit || 7000);

    api.setRunning($('run').checked);
    api.setCut($('cut').checked);
    api.setExplode($('exp').checked);
    api.orbit($('orbit').checked);
    api.setView('iso');

    buildDials(d);
    fillSeq(d);
    try{ history.replaceState(null, '', '#' + d.id); }catch(err){}
  }

  /* ---------- 点火时序 ---------- */
  function buildDials(d){
    var box = $('dials');
    box.style.gridTemplateColumns = 'repeat(' + Math.min(16, Math.max(8, d.cyl)) + ',1fr)';
    var order = ORDER[d.id];
    var html = '';
    for(var i=1;i<=d.cyl;i++){
      var pos = order ? order.split('-').indexOf(String(i)) + 1 : i;
      html += '<div class="dial" data-c="' + i + '" title="缸 ' + i + (pos>0 ? ' · 第 ' + pos + ' 个点火' : '') + '">' + i + '</div>';
    }
    box.innerHTML = html;
    if(dialTimer) clearInterval(dialTimer);
    dialTimer = setInterval(function(){
      var fire = window.__ENGINE_FIRE || [];
      var kids = box.children;
      for(var k=0;k<kids.length;k++){
        var v = fire[(+kids[k].getAttribute('data-c')) - 1] || 0;
        kids[k].className = 'dial' + (v > .1 ? ' lit' : '');
      }
    }, 100);
  }

  function fillSeq(d){
    var order = ORDER[d.id];
    if(!order){
      var a = []; for(var i=1;i<=d.cyl;i++) a.push(i);
      order = a.join('-');
    }
    var interval = (720 / d.cyl).toFixed(1).replace('.0','');
    $('seq').innerHTML = '点火顺序 <span class="mono">' + order + '</span><br>' +
      '间隔 <span class="mono">' + interval + '°</span> 曲轴转角 · 全循环 <span class="mono">720°</span>' +
      (cur ? '<br>' + (cur.extra||'').replace(/^3D：/,'') : '');
  }

  /* ---------- 控件 ---------- */
  $('sel').addEventListener('change', function(e){ mount(e.target.value); });
  $('run').addEventListener('change', function(e){ if(api) api.setRunning(e.target.checked); });
  $('cut').addEventListener('change', function(e){ if(api){ api.setCut(e.target.checked); api.setView(e.target.checked ? 'front' : 'iso'); } });
  $('exp').addEventListener('change', function(e){ if(api) api.setExplode(e.target.checked); });
  $('orbit').addEventListener('change', function(e){ if(api) api.orbit(e.target.checked); });
  $('vfront').addEventListener('click', function(){ if(api) api.setView('front'); });
  $('rpm').addEventListener('input', function(e){
    var v = +e.target.value;
    $('rpmv').textContent = v.toLocaleString() + ' rpm';
    if(api) api.setRpm(v);
  });
  window.addEventListener('hashchange', function(){
    var id = (location.hash||'').replace('#','');
    if(id && (!cur || cur.id !== id)) mount(id);
  });

  fillSelect();
  mount((location.hash||'').replace('#',''));
})();
