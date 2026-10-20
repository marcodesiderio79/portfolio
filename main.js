/* Marco Desiderio portfolio v9: our own motion code (GSAP + ScrollTrigger + Lenis, self-hosted). */
(()=>{window.__md=1;
const d=document,h=d.documentElement,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,desk=matchMedia('(min-width: 768px)');
const G=window.gsap,ST=window.ScrollTrigger;if(G&&ST)G.registerPlugin(ST);
const anim=h.classList.contains('anim');
if(location.hash)h.classList.remove('loader-on');
// stagger: --d per line inside each reveal group
d.querySelectorAll('[data-rise],[data-split],.worklist,.explist,.ch1__stats').forEach(g=>{g.querySelectorAll('.ln>span').forEach((s,i)=>s.style.setProperty('--d',i*90));g.querySelectorAll('.rule:not(.rule--hover)').forEach((r,i)=>r.style.setProperty('--d',i*90))});
d.querySelectorAll('.ch1__stats li').forEach((li,i)=>li.querySelector('.ln>span')?.style.setProperty('--d',i*110));
// smooth scroll
let lenis=null;
if(!rm&&window.Lenis){lenis=new Lenis({lerp:.1,autoRaf:!G});if(G){lenis.on('scroll',()=>ST&&ST.update());G.ticker.add(t=>lenis.raf(t*1000));G.ticker.lagSmoothing(0)}}
const scrollToY=y=>lenis?lenis.scrollTo(y,{duration:1.4}):scrollTo({top:y,behavior:rm?'auto':'smooth'});
// reveals
const targets=[...d.querySelectorAll('[data-rise],[data-split],.wipe,.worklist,.explist')].filter(e=>!e.closest('.hero'));
if(!anim||!('IntersectionObserver'in window))targets.forEach(e=>e.classList.add('in'));
else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px -8% -10% 0px',threshold:0});targets.forEach(e=>io.observe(e))}
// hero intro (year strip 2010 to 2026, then name rises)
const hero=d.querySelector('.hero');
const heroIn=()=>hero&&hero.querySelectorAll('[data-split],[data-rise]').forEach(e=>e.classList.add('in'));
if(hero){const base=hero.querySelector('.hero__base');
  if(h.classList.contains('loader-on')&&G){lenis&&lenis.stop();
    const strip=hero.querySelector('.hero__strip'),yr=hero.querySelector('.hero__yr'),n=strip.children.length;
    G.set(base,{scaleX:0,height:6});
    const tl=G.timeline({onComplete:()=>{h.classList.remove('loader-on');try{sessionStorage.setItem('md-intro','1')}catch(e){}lenis&&lenis.start()}});
    tl.from(yr,{yPercent:100,duration:.8,ease:'power3.out'})
      .to(strip,{yPercent:-100*(n-1)/n,duration:2.6,ease:'power4.inOut'})
      .to(base,{scaleX:1,duration:2.6,ease:'power4.inOut'},'<')
      .to(yr,{yPercent:-110,duration:.8,ease:'power3.in'})
      .call(heroIn,null,'-=0.2')
      .to(base,{height:'100%',duration:1.1,ease:'power2.inOut'},'<')
      .from('.rail',{opacity:0,duration:1.6,ease:'power3.out'},'<');
  }else{h.classList.remove('loader-on');setTimeout(heroIn,anim?120:0)}}
// horizontal story
const story=d.getElementById('story'),track=d.getElementById('track');let hst=null,hA=0,hP=0;
if(story&&G&&ST){const mm=G.matchMedia();
  const tw=d.getElementById('thework'),col=tw.querySelector('.thework__collage'),grid=tw.querySelector('.thework__grid'),the=tw.querySelector('.thework__the'),wk=tw.querySelector('.thework__work');
  mm.add('(min-width: 768px)',()=>{h.classList.add('hs');track.classList.add('is-h');let tl;
    const build=()=>{let p=null;if(hst){p=hst.progress;hst.kill(true);tl.kill();G.set([track,col,the,wk,grid],{clearProps:'transform,clipPath'})}
      const A=tw.offsetLeft,M=track.scrollWidth-innerWidth,P=rm?0:Math.round(innerHeight*1.3);hA=A;hP=P;
      tl=G.timeline({defaults:{ease:'none'}});tl.to(track,{x:-A,duration:A});
      if(P)tl.fromTo(col,{clipPath:'inset(42% 41.4% 42% 41.4%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:P})
        .fromTo(the,{x:0},{x:-innerWidth*.5,duration:P},'<').fromTo(wk,{x:0},{x:innerWidth*.5,duration:P},'<').fromTo(grid,{xPercent:0},{xPercent:-7,duration:P},'<');
      tl.to(track,{x:-M,duration:M-A});
      hst=ST.create({trigger:story,start:'top top',end:'+='+(M+P),pin:true,scrub:true,animation:tl,anticipatePin:1,invalidateOnRefresh:false,onUpdate:tick});
      if(p!=null)scrollTo(0,hst.start+(hst.end-hst.start)*p)};
    build();let to;const rs=()=>{clearTimeout(to);to=setTimeout(build,200)};addEventListener('resize',rs);d.fonts&&d.fonts.ready.then(build);
    return()=>{removeEventListener('resize',rs);hst&&hst.kill(true);hst=null;tl&&tl.kill();G.set([track,col,the,wk,grid],{clearProps:'all'});h.classList.remove('hs');track.classList.remove('is-h')}});
  mm.add('(max-width: 767px)',()=>{if(rm)return;const t=G.timeline({scrollTrigger:{trigger:tw,start:'top 75%',end:'bottom 25%',scrub:true}});
    t.fromTo(col,{clipPath:'inset(38% 28% 38% 28%)'},{clipPath:'inset(0% 0% 0% 0%)',ease:'none'}).fromTo(the,{y:0},{y:-innerHeight*.45,ease:'none'},'<').fromTo(wk,{y:0},{y:innerHeight*.45,ease:'none'},'<');
    return()=>{t.scrollTrigger&&t.scrollTrigger.kill();t.kill();G.set([col,the,wk],{clearProps:'all'})}});
}
// go to a section (maps horizontal position to scroll when pinned)
const goTo=el=>{if(!el)return;if(hst&&story.contains(el)){const p=el.closest('.panel')||el;const L=p.offsetLeft;scrollToY(hst.start+(L<=hA?L:L+hP))}else scrollToY(el.getBoundingClientRect().top+scrollY)};
d.querySelectorAll('a[href^="#"],a[href^="/portfolio/#"]').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href');if(href.startsWith('/portfolio/#')&&location.pathname!=='/portfolio/')return;const t=d.getElementById(href.split('#')[1]);if(t&&!a.closest('.menu')){e.preventDefault();goTo(t)}}));
if(location.hash){const t=d.getElementById(location.hash.slice(1));if(t)setTimeout(()=>{hst?scrollTo(0,hst.start+((t.closest('.panel')||t).offsetLeft<=hA?(t.closest('.panel')||t).offsetLeft:(t.closest('.panel')||t).offsetLeft+hP)):t.scrollIntoView()},300)}
// rail: colour follows the panel under it, progress bar
const rail=d.querySelector('.rail'),bar=d.querySelector('.rail__bar');let raf=0;
function tick(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const x=desk.matches?22:innerWidth/2,y=desk.matches?innerHeight/2:28;
  const p=d.elementsFromPoint(x,y).find(e=>!rail.contains(e)&&!e.closest('.menu')&&e.closest('[data-tone]'));const pn=p&&p.closest('[data-tone]');
  if(pn&&pn!==d.body){d.body.dataset.tone=pn.dataset.tone;const src=pn.classList.contains('hero')?pn.querySelector('.hero__base'):pn;rail.style.setProperty('--rb',getComputedStyle(src).backgroundColor)}
  const m=h.scrollHeight-innerHeight,pr=m>0?Math.min(1,scrollY/m):0;bar.style.transform=desk.matches?`scaleY(${pr})`:`scaleX(${pr})`})}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);tick();setTimeout(tick,400);
// menu
const mb=d.getElementById('menuBtn'),dl=d.getElementById('menu'),mc=d.getElementById('menuClose');
if(mb&&dl){dl.querySelectorAll('.ln>span').forEach((s,i)=>s.style.setProperty('--d',250+i*55));
  const open=()=>{dl.showModal();lenis&&lenis.stop();mb.setAttribute('aria-expanded','true');requestAnimationFrame(()=>requestAnimationFrame(()=>dl.classList.add('is-open')))};
  const close=cb=>{dl.classList.remove('is-open');mb.setAttribute('aria-expanded','false');setTimeout(()=>{dl.close();lenis&&lenis.start();typeof cb=='function'&&cb()},rm?0:700)};
  mb.addEventListener('click',open);mc.addEventListener('click',()=>close());dl.addEventListener('cancel',e=>{e.preventDefault();close()});
  dl.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{const href=a.getAttribute('href');const id=href.includes('#')?href.split('#')[1]:null;
    if(href==='/portfolio/'&&location.pathname==='/portfolio/'){e.preventDefault();close(()=>scrollToY(0));return}
    if(id&&(href.startsWith('#')||location.pathname==='/portfolio/')){const t=d.getElementById(id);if(t){e.preventDefault();close(()=>goTo(t))}}}))}
// selected work: dim others, arrow, hover rule, preview scales in
const wl=d.querySelector('.worklist');
if(wl){const imgs=[...d.querySelectorAll('.ch2__img')],idle=d.querySelector('.ch2__idle'),lis=[...wl.querySelectorAll('li')];let z=1,cur=-1;
  const on=li=>{if(!desk.matches)return;wl.classList.add('has-hover');lis.forEach(x=>x.classList.toggle('is-hover',x===li));const i=+li.dataset.i;if(i===cur)return;cur=i;const im=imgs[i];im.style.zIndex=++z;im.style.transition='none';im.classList.remove('is-on');void im.offsetWidth;im.style.transition='';im.classList.add('is-on');if(idle)idle.style.opacity=0};
  const off=()=>{wl.classList.remove('has-hover');lis.forEach(x=>x.classList.remove('is-hover'));imgs.forEach(i=>i.classList.remove('is-on'));cur=-1;if(idle)idle.style.opacity=''};
  lis.forEach(li=>{li.addEventListener('pointerenter',()=>on(li));li.querySelector('a').addEventListener('focus',()=>on(li))});
  wl.addEventListener('pointerleave',off);wl.addEventListener('focusout',e=>{if(!wl.contains(e.relatedTarget))off()})}
// experience list: dim others, reveal role card
const el=d.querySelector('.explist');
if(el){const lis=[...el.querySelectorAll('li')];const on=li=>{if(!desk.matches)return;el.classList.add('has-hover');lis.forEach(x=>x.classList.toggle('is-hover',x===li))};const off=()=>{el.classList.remove('has-hover');lis.forEach(x=>x.classList.remove('is-hover'))};
  lis.forEach(li=>{li.addEventListener('pointerenter',()=>on(li));li.addEventListener('focus',()=>on(li))});el.addEventListener('pointerleave',off);el.addEventListener('focusout',e=>{if(!el.contains(e.relatedTarget))off()})}
// services: clip wipe in from below, out to the top
d.querySelectorAll('.svc').forEach(s=>{const bg=s.querySelector('.svc__bg');let t;
  const en=()=>{clearTimeout(t);s.classList.remove('off');s.classList.add('on')};
  const lv=()=>{if(!s.classList.contains('on'))return;s.classList.remove('on');s.classList.add('off');t=setTimeout(()=>{bg.style.transition='none';s.classList.remove('off');void bg.offsetWidth;bg.style.transition=''},rm?0:820)};
  s.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')en()});s.addEventListener('pointerleave',lv);s.addEventListener('focus',en);s.addEventListener('blur',lv)});
// London clock
const ck=d.getElementById('clock'),tz=d.getElementById('tz');
if(ck){const f=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',hour12:false});let o=null;try{o=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',timeZoneName:'shortOffset'})}catch(e){}
  const u=()=>{const n=new Date();ck.textContent=f.format(n);if(o&&tz){const p=o.formatToParts(n).find(x=>x.type==='timeZoneName');if(p)tz.textContent=p.value==='GMT'?'GMT':p.value}};u();setInterval(u,15000)}
// copy email
const cpb=d.getElementById('copy');if(cpb){const st=d.getElementById('copyLbl');let t;if(!navigator.clipboard)cpb.hidden=true;cpb.addEventListener('click',()=>navigator.clipboard.writeText(cpb.dataset.email).then(()=>{st.textContent='Copied';clearTimeout(t);t=setTimeout(()=>st.textContent='',2000)}).catch(()=>{}))}
})();
