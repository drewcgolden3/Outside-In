// year (footer, every page)
(function(){ var y = document.getElementById('yr'); if(y) y.textContent = new Date().getFullYear(); })();

// nav scroll state: transparent over a full-screen hero, solid otherwise.
// Sub-pages have no .hero, so the nav stays solid from the top.
(function(){
  var hdr = document.getElementById('hdr');
  if(!hdr) return;
  var hasHero = document.querySelector('.hero');
  if(!hasHero){ hdr.classList.add('scrolled'); return; }
  function navState(){
    hdr.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.7);
    var cue = document.querySelector('[data-cue]');
    if(cue) cue.style.opacity = window.scrollY > 60 ? '0' : '0.85';
  }
  window.addEventListener('scroll', navState, {passive:true});
  window.addEventListener('resize', navState);
  navState();
})();

// mobile menu
(function(){
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if(!burger || !nav) return;
  burger.addEventListener('click', function(){ nav.classList.toggle('open'); });
  nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();

// reveal on scroll
(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();

// live open/closed status (only where the visit block exists)
(function(){
  var box = document.getElementById('status');
  var txt = document.getElementById('statusText');
  if(!box || !txt) return;
  var hours = {0:[11,15],1:[10,17],2:[10,17],3:[10,17],4:[10,17],5:[10,17],6:[10,17]};
  var now = new Date(), day = now.getDay();
  var h = now.getHours() + now.getMinutes()/60;
  var o = hours[day][0], c = hours[day][1];
  if(h >= o && h < c){
    box.classList.add('open');
    txt.textContent = 'Open now · until ' + (c > 12 ? (c-12)+'pm' : c+'am');
  } else {
    box.classList.add('closed');
    txt.textContent = 'Closed right now';
  }
  var li = document.querySelector('.hours-list li[data-day="'+(day===0?0:1)+'"]');
  if(li) li.classList.add('today');
})();
