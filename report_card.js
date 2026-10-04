/* Monthly Report Card — reads lifeos_save_v1 and renders a graded month report overlay */
(function(){
  'use strict';
  function grade(pct){
    if (pct >= 85) return {g:'A', msg:'Excellent month. This is who you are becoming.'};
    if (pct >= 70) return {g:'B', msg:'Strong month. One more push and it is an A.'};
    if (pct >= 50) return {g:'C', msg:'Solid base. Pick the weakest section and lift it.'};
    if (pct > 0)   return {g:'D', msg:'Hard month. The comeback is one 25-minute session.'};
    return {g:'-', msg:'No data for this month yet.'};
  }
  window.openMonthlyReport = function(){
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem('lifeos_save_v1') || 'null'); } catch(e){}
    if (!raw || !raw.days) { alert('No LIFE OS data found yet.'); return; }
    var now = new Date();
    var pre = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
    var days = Object.keys(raw.days).filter(function(k){ return k.indexOf(pre) === 0; });
    var study = 0, move = 0, sleep = 0, good = 0, moods = [], waters = 0;
    days.forEach(function(k){
      var d = raw.days[k];
      if (d.s) study++;
      if (d.m) move++;
      if (d.l) sleep++;
      if (d.minsMet === 3) good++;
      if (typeof d.mood === 'number') moods.push(d.mood);
      if (typeof d.water === 'number') waters += d.water;
    });
    var n = days.length || 1;
    var sections = [
      {name:'Study', pct: Math.round(100*study/n)},
      {name:'Movement', pct: Math.round(100*move/n)},
      {name:'Sleep discipline', pct: Math.round(100*sleep/n)},
      {name:'Mood', avg: moods.length ? (moods.reduce(function(a,b){return a+b;},0)/moods.length) : 0, pct: Math.round(moods.length ? 20*(moods.reduce(function(a,b){return a+b;},0)/moods.length) : 0)}
    ];
    var overall = Math.round(sections.reduce(function(a,s){ return a + s.pct; }, 0)/sections.length);
    var g = grade(overall);
    var rows = sections.map(function(s){
      var sg = s.pct >= 85 ? 'A' : s.pct >= 70 ? 'B' : s.pct >= 50 ? 'C' : s.pct > 0 ? 'D' : '-';
      return '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);padding:8px 2px">' +
        '<span style="font-size:.85rem">' + s.name + '</span>' +
        '<span style="display:flex;align-items:center;gap:10px"><span class="rc-bar" style="width:120px"><i style="display:block;height:8px;width:' + Math.min(100, s.pct) + '%;background:#5EEAD4;border-radius:99px"></i></span>' +
        '<b style="width:36px;text-align:right;font-size:1.05rem;color:#5EEAD4">' + sg + '</b></span></div>';
    }).join('');
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px';
    overlay.innerHTML = '<div style="background:#0B1220;border:1px solid rgba(255,255,255,.12);border-radius:18px;max-width:420px;width:100%;max-height:86vh;overflow-y:auto;padding:22px;color:#E6EDF7;font-family:-apple-system,sans-serif">' +
      '<div style="text-align:center;margin-bottom:14px"><div style="font-size:.72rem;letter-spacing:.12em;color:#8B9BB4">MONTHLY REPORT CARD</div>' +
      '<div style="font-size:2.4rem;font-weight:800;color:#5EEAD4;margin:.2rem 0">' + g.g + '</div>' +
      '<div style="font-size:.8rem;color:#8B9BB4">' + g.msg + '</div>' +
      '<div style="font-size:.72rem;color:#8B9BB4;margin-top:.3rem">' + pre + ' \u00b7 ' + days.length + ' days logged · overall ' + overall + '%</div></div>' +
      rows +
      '<div style="margin-top:12px;font-size:.72rem;color:#8B9BB4">Study/movement/sleep = % of logged days meeting the minimum. Mood graded from your daily 1-5 entries.</div>' +
      '<button onclick="this.closest(\'[data-rc-overlay]\').remove()" style="width:100%;margin-top:14px;padding:11px;border-radius:12px;border:0;background:#5EEAD4;color:#0B1220;font-weight:700;cursor:pointer">Close</button>';
    overlay.setAttribute('data-rc-overlay','1');
    overlay.addEventListener('click', function(e){ if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  };
})();
