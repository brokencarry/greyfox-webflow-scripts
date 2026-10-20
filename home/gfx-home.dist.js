/*! Grey Fox · Home v2 (Flow 3) · core 1.0.12 + home 1.1.6 · minified bundle of core/gfx-core.js + home/gfx-home.js (read those for the notes) */
(function(){
'use strict';
var W=window,D=document;
if(W.gfx&&W.gfx.core)return;
if(/[?&]gfm=0(&|$)/.test(location.search)){W.gfx={core:'off',page:function(){}};return;}
(function(w){
function bezier(x1,y1,x2,y2){
const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx;
const cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
const sx=t=>((ax*t+bx)*t+cx)*t,sy=t=>((ay*t+by)*t+cy)*t;
const dx=t=>(3*ax*t+2*bx)*t+cx;
return x=>{
if(x<=0)return 0;if(x>=1)return 1;
let t=x;
for(let i=0;i<8;i++){const e=sx(t)-x,d=dx(t);if(Math.abs(e)<1e-6)break;if(Math.abs(d)<1e-6)break;t-=e / d;}
if(t<0||t>1){let lo=0,hi=1;t=x;for(let i=0;i<30;i++){const v=sx(t);if(Math.abs(v-x)<1e-6)break;if(v<x)lo=t;else hi=t;t=(lo+hi) / 2;}}
return sy(t);
};
}
w.GF_GRAMMAR={
SETTLE:'expo.out',
DRAW:bezier(0.807,0.014,0.392,0.985),
headline:{yPercent:108,duration:1.2,stagger:0.09,start:'top 82%'},
body:{y:16,duration:1.1,at:0.2},
hairline:{duration:1.5,at:0.45},
arrow:{duration:0.45,at:0.85},
picture:{clipFrom:'inset(100% 0% 0% 0%)',scaleFrom:1.06,duration:1.5,settle:1.6,at:0.95},
figure:{duration:1.6,at:1.0},
detail:{y:16,duration:0.9,at:1.2,stagger:0.06},
seam:{dimDark:0.5,dimLight:0.3,lightTo:'#ffffff',hairline:1.5},
leave:{ease:'power2.in',duration:0.45},
group:0.12,tight:0.08,
hold:{short:0.5,standard:0.7},
fastForward:0.3,
breath:{scaleFrom:1.06,scaleTo:1},
reduced:()=>w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches
};
})(W);
const H=D.documentElement,G=W.GF_GRAMMAR;
const VERSION='1.0.12';
const DEBUG= /[?&]gfxdebug(&|$)/.test(location.search);
const log=(where,e)=>{if(DEBUG){try{console.warn('[gfx] '+where,e);}catch(x){}}};
const safe=(where,fn)=>{try{return fn();}catch(e){log(where,e);return undefined;}};
const mq=q=>{try{return W.matchMedia(q).matches;}catch(e){return false;}};
const REDUCE=!!G.reduced(),TOUCH=mq('(pointer: coarse)');
const store={get:k=>{try{return W.sessionStorage.getItem(k);}catch(e){return null;}},set:(k,v)=>{try{W.sessionStorage.setItem(k,v);}catch(e){}}};
const GROUP=G.group,LEAVE=G.leave;
const READ=W.GF_READ={v:600,rest:0.6,approach:0.35,min:0.5,film:1.6};
W.GF_LEAVE=LEAVE;W.GF_GROUP=GROUP;
safe('head',()=>{
H.classList.add('gfx-js','gfx-f3');
if(!REDUCE)H.classList.add('gfx-m');
const qs=location.search;
const intro=!REDUCE&&!/[?&]intro=0(&|$)/.test(qs)&&(/[?&]intro(&|=1|$)/.test(qs)||(!location.hash&&!store.get('gfx-intro-seen')));
if(intro)H.classList.add('gfx-intro');
});
const failsafe=()=>{
if(H.classList.contains('gfx-ready'))return;
H.classList.add('gfx-failsafe');H.classList.remove('gfx-intro');ix3Late();
safe('failsafe',()=>{const p=D.querySelector('.page-wrapper');p&&p.removeAttribute('inert');});
};
setTimeout(failsafe,6000);
const LENIS_OPTS={lerp:0.085,wheelMultiplier:0.95,smoothWheel:true};
let RealLenis=null,shared=null,sharedRaf=null,tempLoop=0,tickerOn=false;
const lenisStub=()=>({
__gfxStub:true,raf(){},on(){},off(){},start(){},stop(){},destroy(){},resize(){},
get scroll(){return W.scrollY;},
scrollTo(t,o){
try{
const off=(o&&o.offset)||0;
if(typeof t==='number')W.scrollTo(0,t+off);
else{const el=typeof t==='string'?D.querySelector(t):t;if(el&&el.getBoundingClientRect)W.scrollTo(0,el.getBoundingClientRect().top+W.scrollY+off);}
}catch(e){}
}
});
const makeShared=()=>{
if(shared)return shared;
if(REDUCE||TOUCH||!RealLenis)return null;
try{
const inst=new RealLenis(LENIS_OPTS);
sharedRaf=inst.raf.bind(inst);
inst.raf=function(){};
shared=W.lenis=inst;
const loop=()=>{if(tickerOn)return;sharedRaf(performance.now());tempLoop=requestAnimationFrame(loop);};
tempLoop=requestAnimationFrame(loop);
if('ResizeObserver'in W){
let lastH=0,rz=0;
const watch=()=>new ResizeObserver(()=>{const h=D.body.scrollHeight;if(Math.abs(h-lastH)<1)return;lastH=h;cancelAnimationFrame(rz);rz=requestAnimationFrame(()=>{try{inst.resize();}catch(e){}});}).observe(D.body);
if(D.body)watch();else D.addEventListener('DOMContentLoaded',watch,{once:true});
}
}catch(e){log('lenis',e);}
return shared;
};
function GfxLenis(){return makeShared()||lenisStub();}
GfxLenis.__gfx=true;
safe('lenis trap',()=>{
const cur=W.Lenis;
if(cur&&!cur.__gfx)RealLenis=cur;
Object.defineProperty(W,'Lenis',{configurable:true,enumerable:true,get:()=>(RealLenis?GfxLenis:undefined),set:v=>{if(v&&!v.__gfx)RealLenis=v;}});
});
let NAV_VAR='w-variant-6001bf23-3a7c-ba13-070d-00867ad512f5';
const KEEP='.navigation_wrapper, .button, [data-wf-component-id]';
let navTop=true;
const strip=el=>{
if(!el||el.nodeType!==1)return;
const one=x=>{
if(x.hasAttribute('data-wf--gfx-navigation-home-v2--variant')){const c=Array.prototype.find.call(x.classList,k=>k.indexOf('w-variant-')===0);if(c)NAV_VAR=c;}
if(x.hasAttribute('data-w-id')&&!x.closest(KEEP)){x.setAttribute('data-gfx-wid',x.getAttribute('data-w-id'));x.removeAttribute('data-w-id');}
if(navTop&&x.classList.contains(NAV_VAR)&&x.closest('.gfx-nav')){x.classList.remove(NAV_VAR);x.setAttribute('data-gfx-var','');}
};
one(el);
if(el.firstElementChild)Array.prototype.forEach.call(el.querySelectorAll('[data-w-id], [data-wf--gfx-navigation-home-v2--variant], .'+NAV_VAR),one);
};
let ixObs=null;
safe('ix2 strip',()=>{ixObs=new MutationObserver(ms=>ms.forEach(m=>Array.prototype.forEach.call(m.addedNodes,strip)));ixObs.observe(H,{childList:true,subtree:true});if(D.body)strip(D.body);});
const patchIx3=m=>safe('ix3 patch',()=>{
if(!m||m.__gfx||typeof m.getInstance!=='function')return;
m.__gfx=true;
const gi=m.getInstance;
m.getInstance=function(){
const inst=gi.apply(this,arguments);
if(inst&&!inst.__gfx&&typeof inst.register==='function'){
inst.__gfx=true;
const reg=inst.register;
inst.register=function(ints){
const args=Array.prototype.slice.call(arguments);
const onPage=x=>{const sc=x&&x.scope;if(!sc||sc.type!=='component')return false;try{return Array.prototype.some.call(D.querySelectorAll('[data-wf-component-id="'+sc.componentId+'"]'),e=>e.getClientRects().length>0);}catch(e){return true;}};
if(Array.isArray(ints))args[0]=ints.filter(onPage);
return reg.apply(this,args);
};
}
return inst;
};
});
const wrapWebflow=wf=>safe('webflow wrap',()=>{
if(!wf||Array.isArray(wf)||wf.__gfxWrapped||typeof wf.require!=='function')return;
wf.__gfxWrapped=true;
const req=wf.require;
wf.require=function(name){const m=req.apply(this,arguments);if(name==='ix3')patchIx3(m);return m;};
});
safe('webflow trap',()=>{
let cur=W.Webflow;
Object.defineProperty(W,'Webflow',{configurable:true,enumerable:true,get:()=>cur,set:v=>{cur=v;wrapWebflow(v);}});
wrapWebflow(cur);
});
const ix3Late=()=>{if(!H.classList.contains('w-mod-ix3'))H.classList.add('w-mod-ix3');};
const stopIX2=()=>safe('ix2',()=>{const wf=W.Webflow;if(!wf||typeof wf.require!=='function')return;const ix=wf.require('ix2');if(ix&&typeof ix.destroy==='function')ix.destroy();});
safe('ix2 queue',()=>{W.Webflow=W.Webflow||[];W.Webflow.push(stopIX2);});
const $=(s,r)=>(r||D).querySelector(s);
const $$=(s,r)=>Array.prototype.slice.call((r||D).querySelectorAll(s));
const NS='http://www.w3.org/2000/svg',TAN=Math.tan(38.2*Math.PI / 180);
const arr=x=>(x?[].concat(x):[]).reduce((a,e)=>a.concat(typeof e==='string'?$$(e):[e]),[]).filter(Boolean);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const docTop=el=>{let y=0;for(let n=el;n;n=n.offsetParent)y+=n.offsetTop;return y;};
const scrollNow=()=>(shared?shared.scroll:W.scrollY);
let ST=null,gsap=null;
const scrollToY=(y,dur)=>{y=Math.max(0,Math.round(y));if(shared)shared.scrollTo(y,{duration:dur||1.4,easing:k=>1-Math.pow(1-k,4)});else W.scrollTo({top:y,behavior:REDUCE?'auto':'smooth'});};
const refresh=(()=>{let t=0;return()=>{clearTimeout(t);t=setTimeout(()=>{if(ST)ST.refresh();},90);};})();
const BASE=(()=>{const s=D.currentScript&&D.currentScript.src;return s?s.replace(/\/[^/]*\/[^/]*$/,'/'):'';})();
(function(){
if(W.gfArrow)return;
var SPREAD=0.52,uid=0;
var reduce=REDUCE;
var expo=function(t){return t>=1?1:1-Math.pow(2,-10*t);},cubic=function(t){return 1-Math.pow(1-t,3);};
var f2=function(v){return v.toFixed(2);};
var ribbon=function(P){
var M=P.length-1,L=[],R=[];
P.forEach(function(p,i){var a=P[Math.max(0,i-1)],b=P[Math.min(M,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy / l,ny=dx / l;
L.push(f2(p[0]+nx*p[2] / 2)+' '+f2(p[1]+ny*p[2] / 2));R.push(f2(p[0]-nx*p[2] / 2)+' '+f2(p[1]-ny*p[2] / 2));});
return'M'+L.join(' L')+' L'+R.reverse().join(' L')+' Z';
};
var headPaths=function(x,y,ux,uy,len,w){
return[1,-1].map(function(sg){var ang=Math.atan2(uy,ux)+Math.PI+sg*SPREAD,P=[],k,bend;
for(var j=0;j<=12;j++){k=j / 12;bend=sg*0.12*Math.sin(Math.PI*k);P.push([x+Math.cos(ang+bend)*len*k,y+Math.sin(ang+bend)*len*k,w*(1-k*0.8)]);}
return ribbon(P);});
};
var ink=function(x0,y0,xr,x2,y2,fs,withHead){
var run=xr-x0,bow=Math.min(1.6,fs*0.03),dirx=x2-xr,diry=y2-y0,dl=withHead?(Math.hypot(dirx,diry)||1):0;
var ux=withHead?dirx / dl:1,uy=withHead?diry / dl:0,r=withHead?Math.min(run*0.08,dl*0.45,8):0;
var A=[xr-r,y0],B=[xr+ux*r,y0+uy*r],C=[xr,y0],L1=run-r,L2=withHead?r*1.6:0,L3=withHead?dl-r:0,total=L1+L2+L3;
var centre=function(t){var s=t*total,k,a;
if(s<=L1||!withHead){k=s / L1;return[x0+s,y0-Math.sin(Math.PI*k)*bow];}
if(s<=L1+L2){k=(s-L1) / L2;a=1-k;return[a*a*A[0]+2*a*k*C[0]+k*k*B[0],a*a*A[1]+2*a*k*C[1]+k*k*B[1]];}
k=(s-L1-L2) / L3;return[B[0]+(x2-B[0])*k,B[1]+(y2-B[1])*k];};
var pts=[],N=72;
for(var i=0;i<=N;i++){var t=i / N,s=t*total,c=centre(t);pts.push([c[0],c[1],(1.1+1.4*Math.exp(-s / 8))*(1+0.08*Math.sin(Math.PI*t))*(0.55+0.45*clamp((total-s) / (fs*0.9),0,1))]);}
return{shape:ribbon(pts),centre:'M'+pts.map(function(p){return f2(p[0])+' '+f2(p[1]);}).join(' L'),ux:ux,uy:uy};
};
var sizes=function(fs){var rise=clamp(fs*0.26,7,14);return{rise:rise,run:rise / TAN,len:clamp(fs*0.22,7,12),w:1.9};};
var head=function(svg,x,y,ux,uy,o){
o=o||{};var len=o.len||10,w=o.w||1.7,id='gfa-h'+(++uid),reach=len+3;
var defs=svg.querySelector('defs')||svg.insertBefore(D.createElementNS(NS,'defs'),svg.firstChild);
var m=D.createElementNS(NS,'mask');m.setAttribute('id',id);m.setAttribute('maskUnits','userSpaceOnUse');
m.setAttribute('x',f2(x-reach-4));m.setAttribute('y',f2(y-reach-4));m.setAttribute('width',f2(2*reach+8));m.setAttribute('height',f2(2*reach+8));
var c=D.createElementNS(NS,'circle');c.setAttribute('cx',f2(x));c.setAttribute('cy',f2(y));c.setAttribute('r','0');c.setAttribute('fill','#fff');m.appendChild(c);defs.appendChild(m);
var g=D.createElementNS(NS,'g');g.setAttribute('class','gfa-head'+(o.cls?' '+o.cls:''));g.setAttribute('data-gfa-head','');g.setAttribute('mask','url(#'+id+')');
g.innerHTML=headPaths(x,y,ux,uy,len,w).map(function(d){return'<path class="gfa-b" d="'+d+'"/>';}).join('');
svg.appendChild(g);
var set=function(k){c.setAttribute('r',f2(reach*clamp(k,0,1)));};
set(o.at==null?0:o.at);
return{g:g,set:set,remove:function(){g.remove();m.remove();}};
};
var icon=function(cls,vb){
vb=vb||16;var s=vb / 16,a=38.2*Math.PI / 180,ux=Math.cos(a),uy=-Math.sin(a);
var tx=13.8*s,ty=3.4*s,L=14*s,sx=tx-ux*L,sy=ty-uy*L,P=[],N=18;
for(var i=0;i<=N;i++){var k=i / N,bow=Math.sin(Math.PI*k)*0.3*s;
P.push([sx+ux*L*k+uy*bow,sy+uy*L*k-ux*bow,1.5*s*(1+0.5*Math.exp(-k*5))*(0.62+0.38*(1-k))]);}
var d='<path class="gfa-if gfa-is" d="'+ribbon(P)+'"/>'+headPaths(tx,ty,ux,uy,8.4*s,2.4*s).map(function(h){return'<path class="gfa-if gfa-ib" d="'+h+'"/>';}).join('');
return'<svg class="gfa-icon'+(cls?' '+cls:'')+'" viewBox="0 0 '+vb+' '+vb+'" aria-hidden="true" focusable="false" data-gfa-head>'+d+'</svg>';
};
var timing=function(t){return{l:1-expo(clamp(t / 1.6,0,1)),h:cubic(clamp((t-0.95) / 0.5,0,1))};};
var line=function(svg,x0,y,xr,fs,o){
o=o||{};var withHead=o.head!==false,sz=sizes(fs),x2=withHead?xr+sz.run:xr,y2=withHead?y-sz.rise:y,id='gfa-n'+(++uid);
var g=ink(x0,y,xr,x2,y2,fs,withHead);
var defs=svg.querySelector('defs')||svg.insertBefore(D.createElementNS(NS,'defs'),svg.firstChild);
var m=D.createElementNS(NS,'mask');m.setAttribute('id',id);m.setAttribute('maskUnits','userSpaceOnUse');
m.setAttribute('x','-4000');m.setAttribute('y','-4000');m.setAttribute('width','12000');m.setAttribute('height','12000');
var mp=D.createElementNS(NS,'path');mp.setAttribute('class','gfa-m');mp.setAttribute('d',g.centre);mp.setAttribute('pathLength','1');
mp.setAttribute('style','fill:none;stroke:#fff;stroke-width:9px;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1');
m.appendChild(mp);defs.appendChild(m);
var p=D.createElementNS(NS,'path');p.setAttribute('class','gfa-ink');p.setAttribute('d',g.shape);p.setAttribute('mask','url(#'+id+')');svg.appendChild(p);
var hd=withHead?head(svg,x2,y2,g.ux,g.uy,{len:sz.len,w:sz.w,at:0}):null;
var set=function(l,h){mp.style.strokeDashoffset=f2(clamp(l,0,1));if(hd)hd.set(h);};
var at=function(t){var k=timing(t);set(k.l,k.h);};
at(o.at==null?0:o.at);
return{at:at,set:set,DUR:1.6,tip:[x2,y2],remove:function(){p.remove();m.remove();if(hd)hd.remove();}};
};
var restBox=function(range,host){
var rs=[].slice.call(range.getClientRects()).filter(function(q){return q.width>0.5;});if(!rs.length)return null;
var bot=Math.max.apply(null,rs.map(function(q){return q.bottom;})),hh=rs[rs.length-1].height;
rs=rs.filter(function(q){return q.bottom>bot-hh*0.5;});
var hb=host.getBoundingClientRect(),dx=0,dy=0,n=range.startContainer.nodeType===3?range.startContainer.parentElement:range.startContainer;
for(;n&&n!==host;n=n.parentElement){var tf=getComputedStyle(n).transform;if(tf&&tf!=='none'){var m=new DOMMatrixReadOnly(tf);dx+=m.m41;dy+=m.m42;}}
var el=range.startContainer.nodeType===3?range.startContainer.parentElement:range.startContainer;
return{left:Math.min.apply(null,rs.map(function(q){return q.left;}))-hb.left-dx,right:Math.max.apply(null,rs.map(function(q){return q.right;}))-hb.left-dx,
bottom:bot-hb.top-dy,fs:parseFloat(getComputedStyle(el).fontSize)||16,w:hb.width,h:hb.height};
};
var rangeOf=function(el,key){
var w=D.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[],n;while((n=w.nextNode()))if(n.textContent.trim())nodes.push(n);
if(!nodes.length)return null;var r=D.createRange();
var punct=function(i,e){var s2=nodes[i].textContent;while(e<s2.length&& /[.,;:!?’”]/.test(s2[e]))e++;
if(e>=s2.length&&nodes[i+1]){var t=nodes[i+1].textContent,k=0;while(k<t.length&& /[.,;:!?’”]/.test(t[k]))k++;if(k){r.setEnd(nodes[i+1],k);return;}}
r.setEnd(nodes[i],e);};
if(key===true){r.setStart(nodes[0],nodes[0].textContent.search(/\S/));var L=nodes.length-1,tl=nodes[L].textContent.replace(/\s+$/,'').length;punct(L,tl);return r;}
if(key){for(var i=0;i<nodes.length;i++){var at=nodes[i].textContent.indexOf(key);if(at>=0){r.setStart(nodes[i],at);punct(i,at+key.length);return r;}}}
var tn=nodes[nodes.length-1],mm= /(\S+)\s*$/.exec(tn.textContent);if(!mm)return null;
r.setStart(tn,mm.index);r.setEnd(tn,mm.index+mm[1].length);return r;
};
var word=function(o){
var fixed=o.range&&typeof o.range!=='function'?o.range:null;
var rng=typeof o.range==='function'?o.range:function(){
if(fixed&&fixed.startContainer&&fixed.startContainer.isConnected)return fixed;
return o.el?rangeOf(o.el,o.key):fixed;
};
var host=o.host;if(!host||!rng())return null;
var withHead=o.head!==false,id='gfa-l'+(++uid),lAt=1,hAt=0,hd=null,drawn=false,raf=0;
if(getComputedStyle(host).position==='static')host.style.position='relative';
var svg=D.createElementNS(NS,'svg');svg.setAttribute('class','gfa'+(o.cls?' '+o.cls:''));svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
if(o.color)svg.style.setProperty('--gfa-c',o.color);
host.appendChild(svg);
var set=function(){var p=svg.querySelector('.gfa-m');if(p)p.style.strokeDashoffset=f2(lAt);if(hd)hd.set(hAt);};
var place=function(){
var r0=rng();if(!r0)return;var b=restBox(r0,host);if(!b)return;
var s=sizes(b.fs),y=b.bottom+2,x0=b.left,xr=b.right+3,x2=xr+s.run,y2=y-s.rise;
var g=ink(x0,y,xr,withHead?x2:xr,withHead?y2:y,b.fs,withHead);
svg.setAttribute('width',Math.ceil(Math.max(b.w,x2+16)));svg.setAttribute('height',Math.ceil(Math.max(b.h,y+16)));
svg.innerHTML='<defs><mask id="'+id+'" maskUnits="userSpaceOnUse" x="-4000" y="-4000" width="12000" height="12000"><path class="gfa-m" d="'+g.centre+'" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1;stroke-dashoffset:'+f2(lAt)+'"/></mask></defs>'+
'<path class="gfa-ink" d="'+g.shape+'" mask="url(#'+id+')"/>';
hd=withHead?head(svg,x2,y2,g.ux,g.uy,{len:s.len,w:s.w,at:hAt}):null;
};
var draw=function(delay){
if(drawn)return;drawn=true;place();
if(reduce){lAt=0;hAt=1;set();return;}
var t0=performance.now()+(delay||0)*1000;
var step=function(now){var t=(now-t0) / 1000;if(t<0){raf=requestAnimationFrame(step);return;}
lAt=1-expo(clamp(t / 1.6,0,1));hAt=cubic(clamp((t-0.95) / 0.5,0,1));set();
if(t<1.6)raf=requestAnimationFrame(step);};
[0.7,1.7,2.8].forEach(function(s){setTimeout(re,s*1000+(delay||0)*1000);});
raf=requestAnimationFrame(step);
};
var still=function(){drawn=true;lAt=0;hAt=1;place();};
place();
var rq0=0,re=function(){if(!rq0)rq0=requestAnimationFrame(function(){rq0=0;place();});};
addEventListener('resize',re);D.addEventListener('gfx:resplit',re);
if(W.ScrollTrigger)ScrollTrigger.addEventListener('refresh',re);
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(re);
if(o.el&&'MutationObserver'in W)new MutationObserver(re).observe(o.el,{childList:true,subtree:true,characterData:true});
if(o.el){o.el.addEventListener('transitionend',re);o.el.addEventListener('animationend',re);}
var zq=0,zoneOut=false,zone=function(){zq=0;var r0=rng();if(!r0)return;var rs=r0.getClientRects();if(!rs.length)return;
var z=parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--gf-zone'))||74,top=rs[rs.length-1].top;
var out=top<z-2;if(out!==zoneOut){zoneOut=out;svg.style.opacity=out?'0':'';}};
addEventListener('scroll',function(){if(!zq)zq=requestAnimationFrame(zone);},{passive:true});
if(W.lenis&&W.lenis.on)W.lenis.on('scroll',function(){if(!zq)zq=requestAnimationFrame(zone);});
if(o.auto!==false){
if('IntersectionObserver'in W){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.disconnect();draw(o.delay==null?0.35:o.delay);}});},{rootMargin:'0px 0px -28% 0px'});io.observe(host);}
else still();
}
return{svg:svg,place:place,draw:draw,still:still};
};
W.gfArrow={TAN:TAN,SPREAD:SPREAD,CHART:1.8,ribbon:ribbon,headPaths:headPaths,head:head,ink:ink,icon:icon,word:word,rangeOf:rangeOf,sizes:sizes,line:line,timing:timing};
})();
(function(){
if(W.gfTurn)return;
var DUR={dark:800,light:900},INK_LAG=80;
var lin=function(c){c /=255;return c<=0.04045?c / 12.92:Math.pow((c+0.055) / 1.055,2.4);};
var unlin=function(v){v=v<=0.0031308?v*12.92:1.055*Math.pow(v,1 / 2.4)-0.055;return Math.max(0,Math.min(255,v*255));};
var Y=function(rgb){return 0.2126*lin(rgb[0])+0.7152*lin(rgb[1])+0.0722*lin(rgb[2]);};
var Lstar=function(y){return y>216 / 24389?116*Math.cbrt(y)-16:y*24389 / 27;};
var lightness=function(rgb){return Lstar(Y(rgb));};
var ss=function(t){return t*t*(3-2*t);};
var ease=function(t,toDark){t=Math.max(0,Math.min(1,t));return toDark?ss(t):Math.pow(ss(t),1.35);};
var mixL=function(a,b,k){
var la=a.map(lin),lb=b.map(lin),La=lightness(a),Lb=lightness(b);
if(Math.abs(Lb-La)<0.5)return a.map(function(v,i){return Math.round(v+(b[i]-v)*k);});
var L=La+(Lb-La)*k,y=L>8?Math.pow((L+16) / 116,3):L*27 / 24389,ya=Y(a),yb=Y(b);
var f=(y-ya) / ((yb-ya)||1);
return la.map(function(v,i){return Math.round(unlin(v+(lb[i]-v)*f));});
};
var run=function(o){
var from=o.from.slice(),to=o.to.slice(),toDark=lightness(to)<lightness(from);
var dur=toDark?DUR.dark:DUR.light,inkDone=false,raf=0,dead=false,resolve;
var done=new Promise(function(r){resolve=r;});
if(o.reduce||REDUCE){o.onFrame&&o.onFrame(to);o.onInk&&o.onInk();resolve();return{cancel:function(){},done:done};}
var mid=0.5,lo=0,hi=1;for(var i=0;i<18;i++){mid=(lo+hi) / 2;if(ease(mid,toDark)<0.5)lo=mid;else hi=mid;}
var inkAt=mid*dur+INK_LAG,t0=performance.now();
var step=function(now){
raf=0;if(dead)return;
var el=now-t0,t=Math.min(1,el / dur),c=mixL(from,to,ease(t,toDark));
o.onFrame&&o.onFrame(c);
if(!inkDone&&el>=inkAt){inkDone=true;o.onInk&&o.onInk();}
if(t<1||!inkDone)raf=requestAnimationFrame(step);else resolve();
};
raf=requestAnimationFrame(step);
return{cancel:function(){dead=true;if(raf)cancelAnimationFrame(raf);resolve();},done:done,toDark:toDark};
};
var docY=function(){return W.scrollY||D.documentElement.scrollTop||0;};
var lastBottom=function(room){
var lo=-Infinity,y=docY(),all=room.querySelectorAll('h1, h2, h3, h4, p, li, dd, dt, img, picture, video, figure, button, a, blockquote, table');
for(var i=0;i<all.length;i++){var e=all[i],r=e.getBoundingClientRect();if(r.height<2||r.width<2)continue;var cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<0.05||e.closest('[aria-hidden="true"]'))continue;lo=Math.max(lo,r.bottom+y);}
return lo;
};
W.gfTurn={run:run,ease:ease,lightness:lightness,mix:mixL,DUR:DUR,INK_LAG:INK_LAG,lastBottom:lastBottom};
})();
const unbreak=el=>{$$('br.gfx-br',el).forEach(b=>b.remove());el.normalize();};
const breakBalanced=el=>{
unbreak(el);
const words=[],tw=D.createTreeWalker(el,NodeFilter.SHOW_TEXT);
for(let n;(n=tw.nextNode());){const re= /\S+/g;let m;while((m=re.exec(n.textContent)))words.push([n,m.index]);}
const breaks=[];let prev=null;
words.forEach(([n,i])=>{
const r=D.createRange();r.setStart(n,i);r.setEnd(n,i+1);
const q=r.getClientRects()[0];if(!q)return;
if(prev!=null&&q.top>prev+q.height*0.5)breaks.push([n,i]);
prev=q.top;
});
const afterBreak=(n,i)=>{
if(n.textContent.slice(0,i).trim())return false;
for(let x=n;x&&x!==el;){
const s=x.previousSibling;
if(!s){x=x.parentNode;continue;}
if(s.nodeType===3&&!s.textContent.trim()){x=s;continue;}
return s.nodeName==='BR';
}
return false;
};
breaks.reverse().forEach(([n,i])=>{
if(afterBreak(n,i))return;
const br=D.createElement('br');br.className='gfx-br';
if(!n.textContent.slice(0,i).trim())i=0;
if(i===0){let host=n;while(host.parentNode!==el&&host.parentNode.firstChild===host)host=host.parentNode;host.parentNode.insertBefore(br,host);}
else{const rest=n.splitText(i);rest.parentNode.insertBefore(br,rest);}
});
};
const lineSplit=el=>{
const o={lines:[],played:false,split:null,reverted:false,revert(){}};
if(!el||!W.SplitText)return o;
const opts={type:'lines',mask:'lines',linesClass:'gfx-line',aria:'none',onSplit:self=>{o.lines=self.lines;if(!o.played)gsap.set(self.lines,{yPercent:G.headline.yPercent});}};
breakBalanced(el);
o.split=W.SplitText.create(el,opts);
let lastW=W.innerWidth,rt=0;
W.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>safe('resplit',()=>{
if(W.innerWidth===lastW)return;lastW=W.innerWidth;
if(!o.reverted)o.split.revert();
breakBalanced(el);
if(!o.reverted){o.split=W.SplitText.create(el,opts);if(o.played)gsap.set(o.lines,{yPercent:0});}
requestAnimationFrame(()=>D.dispatchEvent(new Event('gfx:resplit')));
}),160);});
o.revert=()=>{if(o.reverted)return;o.reverted=true;o.split.revert();};
return o;
};
const fitFilm=(tl,max)=>{max=max||READ.film;const d=tl.duration();if(d>max+0.01)tl.timeScale(d / max);return Math.min(d,max);};
const LINES=['clamp(top 88%)','clamp(bottom bottom)','clamp(top bottom-=8px)'];
const rooms=[];
function room(o){
const trig=typeof o.trigger==='string'?$(o.trigger):o.trigger;if(!trig)return null;
const hEl=o.headline?(typeof o.headline==='string'?$(o.headline):o.headline):null;
const head=hEl?lineSplit(hEl):null;
const body=arr(o.body),hair=arr(o.hairline),pics=arr(o.pictures),det=arr(o.detail),draws=arr(o.draws);
const slots={headline:head?0:null,body:body.length?G.body.at:null,hairline:hair.length||draws.length?G.hairline.at:null,
picture:pics.length||o.extraPicture?G.picture.at:null,detail:det.length||o.extraDetail?G.detail.at:null};
const base=Math.min.apply(null,Object.keys(slots).map(k=>slots[k]).filter(v=>v!=null).concat(o.base!=null?[o.base]:[Infinity]));
const at=k=>(k in slots&&slots[k]!=null?slots[k]:(G[k]&&G[k].at)||0)-(isFinite(base)?base:0);
body.forEach(e=>e.setAttribute('data-gfx-reveal',''));det.forEach(e=>e.setAttribute('data-gfx-reveal',''));
const set=(els,v)=>{if(els.length)gsap.set(els,v);};
set(body,{opacity:0,y:G.body.y});set(hair,{scaleX:0,transformOrigin:'0% 50%'});set(det,{opacity:0,y:G.detail.y});
set(pics,{clipPath:G.picture.clipFrom,scale:G.picture.scaleFrom});set(draws,{clipPath:'inset(0% 100% 0% 0%)'});
const host=o.arriving&&(typeof o.arriving==='string'?$(o.arriving):o.arriving);
const tl=gsap.timeline({paused:true,onStart:()=>host&&host.classList.add('gfx-arriving'),onComplete:()=>{host&&host.classList.remove('gfx-arriving');}});
const done=new WeakSet();
const batch=(els,from,to0,dur,ease,stg,clear)=>{
const to=clear?Object.assign({},to0,{clearProps:clear}):to0;
if(!els.length)return;
LINES.forEach(start=>ST.batch(els,{start,end:'bottom top',
onEnter:b=>{b=b.filter(e=>!done.has(e));if(!b.length)return;b.forEach(e=>done.add(e));gsap.fromTo(b,from,Object.assign({},to,{duration:dur,ease,stagger:b.length>2?Math.min(stg,0.24 / (b.length-1)):stg,immediateRender:false}));},
onLeave:b=>{b=b.filter(e=>!done.has(e));b.forEach(e=>done.add(e));if(b.length)gsap.to(b,Object.assign({},to,{duration:G.fastForward}));},
onEnterBack:b=>{b=b.filter(e=>!done.has(e));b.forEach(e=>done.add(e));if(b.length)gsap.to(b,Object.assign({},to,{duration:G.fastForward}));}}));
};
batch(body,{opacity:0,y:G.body.y},{opacity:1,y:0},G.body.duration,G.SETTLE,GROUP,'transform');
batch(hair,{scaleX:0},{scaleX:1},G.hairline.duration,G.DRAW,GROUP);
batch(draws,{clipPath:'inset(0% 100% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)'},G.hairline.duration,G.DRAW,GROUP,'clipPath');
batch(pics,{clipPath:G.picture.clipFrom,scale:G.picture.scaleFrom},{clipPath:'inset(0% 0% 0% 0%)',scale:1},G.picture.duration,G.DRAW,GROUP,'clipPath');
batch(det,{opacity:0,y:G.detail.y},{opacity:1,y:0},G.detail.duration,G.SETTLE,o.group?GROUP:Math.min(0.3,o.stagger!=null?o.stagger:G.detail.stagger),'transform');
if(head){
let hp=false;
const rise=d=>{if(hp)return;hp=true;head.played=true;gsap.to(head.lines,{yPercent:0,duration:d,stagger:d>0.5?G.headline.stagger:0,ease:G.SETTLE,onComplete:()=>{head.revert();requestAnimationFrame(()=>D.dispatchEvent(new Event('gfx:resplit')));}});};
LINES.forEach(start=>ST.create({trigger:hEl,start,end:'bottom top',onEnter:()=>rise(G.headline.duration),onLeave:()=>rise(G.fastForward),onEnterBack:()=>rise(G.fastForward)}));
}
if(o.extra)safe('room extra',()=>o.extra(tl,at));
fitFilm(tl);
let entered=false;
const play=()=>{if(entered)return;entered=true;tl.play();};
const ff=()=>{entered=true;if(tl.progress()<1){tl.pause();gsap.to(tl,{progress:1,duration:G.fastForward,ease:'power1.out'});}};
ST.create({trigger:trig,start:'clamp('+(o.start||'top 88%')+')',end:self=>Math.max(self.start+1,Math.min(self.start+W.innerHeight*1.4,ST.maxScroll(W)-2)),onEnter:play,onLeave:ff});
ST.create({trigger:trig,start:'top bottom',onLeaveBack:()=>{if(entered)ff();}});
const r={tl,head,trig};rooms.push(r);return r;
}
const FIELD={DARK:[17,17,18],LIGHT:[246,245,242],FOOT:[17,17,18]};
let fieldRooms=[],fieldDef=null,turns=[],opaque=[],lastSpans=[],spanOf=null;
const toneRGB=t=>(t==='D'?FIELD.DARK:FIELD.LIGHT);
const css=c=>`rgb(${c[0]}, ${c[1]}, ${c[2]})`;
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const fieldListeners=[];
const setupRooms=()=>{
fieldRooms=(fieldDef.rooms||[]).map(o=>Object.assign({},o,{el:typeof o.el==='string'?$(o.el):o.el})).filter(o=>o.el);
fieldRooms.forEach((o,i)=>{
const r=o.el;r.classList.add('gfx-fr');r.setAttribute('data-gfx-native',o.native);
if(o.tier)r.setAttribute('data-gfx-tier',o.tier);
if(o.opaque)r.setAttribute('data-gfx-opaque','');
if(o.foot)r.setAttribute('data-gfx-foot','');if(i===fieldRooms.length-1)r.setAttribute('data-gfx-last','');
if(i&&o.tone!==fieldRooms[i-1].tone&&fieldRooms[i-1].native!=='M')r.setAttribute('data-gfx-turn','');
});
};
const measure=()=>{
const vh=W.innerHeight,max=D.documentElement.scrollHeight-vh;
turns=[];
fieldRooms.forEach((o,i)=>{
if(i&&o.tone!==fieldRooms[i-1].tone){
const pad=parseFloat(getComputedStyle(o.el).paddingTop)||0,sp=spanOf&&spanOf(o.el);
const T=sp&&Number.isFinite(sp.top)?sp.top:docTop(o.el)+pad;
const y1=Math.min(T-vh*0.85,max-vh*0.05),band=W.innerWidth<=991?0.3:0.4;
let ym=y1-vh*band / 2;
if(o.turnAt){const v=safe('turnAt',()=>o.turnAt(ym,{vh,max,prev:fieldRooms[i-1],room:o,docTop,lastBottom:W.gfTurn.lastBottom}));if(Number.isFinite(v))ym=v;}
turns.push({y0:ym-vh*band / 2,y1:ym+vh*band / 2,ym,timed:true,from:toneRGB(fieldRooms[i-1].tone),to:toneRGB(o.tone),tf:fieldRooms[i-1].tone,tt:o.tone});
}
if(o.foot){
const end=Math.min(docTop(o.el)+o.el.offsetHeight-vh,max),last=turns.length?turns[turns.length-1].to:toneRGB(o.tone);
turns.push({y0:end-vh*0.3,y1:end,from:last,to:FIELD.FOOT,tf:o.tone,tt:o.tone});
}
});
opaque=fieldRooms.filter(o=>o.opaque).map(o=>o.el);
};
let lastC='',lastTone='',shown=null,fade=null,fadeRaf=0,toningT=0;
const ease3=t=>(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3) / 2);
const apply=(c,tone)=>{
const s=css(c);
if(s!==lastC){lastC=s;D.body.style.backgroundColor=s;for(const e of opaque)e.style.setProperty('background-color',s,'important');fieldListeners.forEach(f=>safe('field listener',()=>f(s,c)));}
if(tone!==lastTone){
if(lastTone){H.classList.add('gfx-toning');clearTimeout(toningT);toningT=setTimeout(()=>H.classList.remove('gfx-toning'),220);}
lastTone=tone;
H.classList.toggle('gfx-tone-dark',tone==='D');H.classList.toggle('gfx-tone-light',tone!=='D');
}
};
const fadeStep=()=>{
fadeRaf=0;if(!fade||fade.h)return;
const f=fade;f.ink=f.tf;
f.h=W.gfTurn.run({from:f.from,to:f.to,reduce:REDUCE,
onFrame:c=>{if(fade!==f)return;shown=c;apply(c,f.ink);},
onInk:()=>{if(fade!==f)return;f.ink=f.tt;apply(shown,f.tt);}});
f.h.done.then(()=>{if(fade===f){shown=f.to.slice();apply(shown,f.tt);fade=null;}});
};
const paint=sy=>{
if(!fieldRooms.length)return;
const y=typeof sy==='number'?sy:scrollNow();
let tone=fieldRooms[0].tone,c=toneRGB(tone);
for(const u of turns){
if(u.timed){if(y>=u.ym){tone=u.tt;c=u.to;continue;}break;}
if(y>=u.y1){tone=u.tt;c=u.to;continue;}
if(y>u.y0){const t=(y-u.y0) / (u.y1-u.y0);tone=t<0.5?u.tf:u.tt;c=REDUCE?(t<0.5?u.from:u.to):mix(u.from,u.to,ease3(t));}
break;
}
if(!shown||REDUCE){shown=c;apply(c,tone);return;}
if(tone!==(fade?fade.tt:lastTone)){
if(fade&&fade.h)fade.h.cancel();
fade={from:shown.slice(),to:c,tf:lastTone,tt:tone};
if(!fadeRaf)fadeRaf=requestAnimationFrame(fadeStep);
}else if(fade)fade.to=c;
else{shown=c;apply(c,tone);}
};
const rgba=s=>{const m= /rgba?\(([^)]+)\)/.exec(s);if(!m)return null;const v=m[1].split(/[\s,/]+/).filter(Boolean).map(Number);return{r:v[0],g:v[1],b:v[2],a:v.length>3?v[3]:1};};
const lum=c=>(0.2126*c.r+0.7152*c.g+0.0722*c.b) / 255;
const green=c=>c.g>c.r+40&&c.g>c.b+20;
const sameAsRoom=(c,native)=>native==='L'?lum(c)>0.96:lum(c)<0.1;
const inkOf=(c,native)=>{
if(green(c))return'g';
if(native==='L')return lum(c)<0.2?'h':'b';
if(c.a>=0.9&&lum(c)>0.8)return'h';
return c.a>=0.66?'b':'q';
};
const SKIP= /^(IMG|VIDEO|PICTURE|CANVAS|SOURCE|SCRIPT|STYLE|IFRAME|svg|BR)$/;
const inkQ=[];
const classify=o=>{
if(o.native==='M'||o.noInk)return;
const rc=getComputedStyle(o.el).color,k=rgba(rc);if(k)o.el.setAttribute('data-gfx-ink',inkOf(k,o.native));
inkQ.push([o.el,rc,o]);
};
const hasOwnText=e=>{for(let n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3&& /\S/.test(n.data))return true;return false;};
const inkSlice=()=>{
const t0=performance.now(),Wr=[];
while(inkQ.length&&performance.now()-t0<8){
const[el,parentColor,o]=inkQ.pop();
for(const c of el.children){
if(SKIP.test(c.tagName)||c.hasAttribute('data-gfx-skip'))continue;
const cs=getComputedStyle(c);
if(cs.display==='none')continue;
const bg=rgba(cs.backgroundColor),thin=c.offsetHeight<=2&&c.offsetWidth>24;
if(bg&&bg.a>0.5){if(sameAsRoom(bg,o.native))Wr.push([c,'data-gfx-clear','']);else if(!thin)continue;}
if(bg&&bg.a>0.05&&thin)Wr.push([c,'data-gfx-line','']);
const bt=parseFloat(cs.borderTopWidth)||0,bb=parseFloat(cs.borderBottomWidth)||0;
if((bt>0&&bt<3&&(rgba(cs.borderTopColor)||{}).a>0.05)||(bb>0&&bb<3&&(rgba(cs.borderBottomColor)||{}).a>0.05))Wr.push([c,'data-gfx-bline','']);
const col=cs.color,kk=rgba(col);
if(kk&&(col!==parentColor||hasOwnText(c)))Wr.push([c,'data-gfx-ink',inkOf(kk,o.native)]);
inkQ.push([c,col,o]);
}
}
Wr.forEach(([e,a,v])=>e.setAttribute(a,v));
return inkQ.length>0;
};
const TIERS=()=>{
const vh=W.innerHeight,phone=W.innerWidth<=991,cl=(a,v,b)=>Math.min(b,Math.max(a,v));
const turn=Math.max(224,vh*0.35);
if(W.innerWidth<=767){const g=parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--_phone---section-gap'))||80;return{tight:g,standard:g,breath:Math.round(g*1.6),turn:Math.max(192,vh*0.3)};}
if(phone)return{tight:80,standard:96,breath:128,turn:Math.max(192,vh*0.3)};
return{tight:cl(64,vh*0.0711,93)*2,standard:cl(96,vh*0.1067,139)+cl(64,vh*0.0711,93),breath:cl(192,vh*0.2133,278)+cl(96,vh*0.1067,139),turn};
};
let STICKY=new Set();
const stickyShift=(el,rm)=>{
let s=0;
for(let n=el.parentElement;n&&n!==rm;n=n.parentElement){
if(!STICKY.has(n))continue;
const p=n.parentElement;s+=Math.max(0,(docTop(p)+p.offsetHeight-(parseFloat(getComputedStyle(p).paddingBottom)||0))-(docTop(n)+n.offsetHeight));
}
return s;
};
const SKIPSPAN='.gfx-cap, .gfx-seam, .gfx-mark, .gfa, [data-gfx-skip], .gfx-sr, .gfx-mk-sr';
const spans=()=>{
const all=fieldRooms.map(o=>[o.el].concat($$('*:not(svg *)',o.el)));
const st=[],clip=new Set();
all.forEach(list=>list.forEach(e=>{const cs=getComputedStyle(e);if(cs.position==='sticky')st.push(e);if(cs.overflowY!=='visible')clip.add(e);}));
const keep=st.map(e=>['position','top','bottom'].map(p=>[p,e.style.getPropertyValue(p),e.style.getPropertyPriority(p)]));
st.forEach(e=>{e.style.setProperty('position','relative','important');e.style.setProperty('top','auto','important');e.style.setProperty('bottom','auto','important');});STICKY=new Set(st);
const memo=new Map(),top0=el=>{if(!el)return 0;let v=memo.get(el);if(v==null){v=el.offsetTop+top0(el.offsetParent);memo.set(el,v);}return v;};
try{
return fieldRooms.map((o,k)=>{
const rm=o.el;let top=Infinity,bot=-Infinity;
all[k].forEach(e=>{
if(e===rm)return;
if(!(e.tagName==='IMG'||e.tagName==='VIDEO'||hasOwnText(e)))return;
if(!e.offsetParent||e.offsetWidth<3||e.offsetHeight<3||e.closest(SKIPSPAN))return;
let t=top0(e),b=t+e.offsetHeight;
for(let n=e.parentElement;n&&n!==rm;n=n.parentElement)if(clip.has(n)){const nt=top0(n);t=Math.max(t,nt);b=Math.min(b,nt+n.offsetHeight);break;}
if(b-t<2)return;
top=Math.min(top,t);bot=Math.max(bot,b+stickyShift(e,rm));
});
const rt=top0(rm),pad=parseFloat(getComputedStyle(rm).paddingTop)||0;
return{pad,inner:Number.isFinite(top)?top-(rt+pad):0,trail:Number.isFinite(bot)?Math.max(0,rt+rm.offsetHeight-bot):0,top,bot};
});
}finally{STICKY=new Set();st.forEach((e,i)=>keep[i].forEach(([p,v,pr])=>{if(v)e.style.setProperty(p,v,pr);else e.style.removeProperty(p);}));}
};
const spansLite=()=>{
const memo=new Map(),top0=el=>{if(!el)return 0;let v=memo.get(el);if(v==null){v=el.offsetTop+top0(el.offsetParent);memo.set(el,v);}return v;};
const Y=W.scrollY||0,r0=e=>{const r=e.getBoundingClientRect();return{t:r.top+Y,b:r.bottom+Y,w:r.width,h:r.height};};
return fieldRooms.map(o=>{
const rm=o.el,c=$$('h1,h2,h3,h4,h5,p,a,li,img,blockquote,figcaption,.heading-2,.heading-4,.paragraph',rm).filter(e=>e.offsetParent&&e.offsetHeight>2&&e.offsetWidth>2&&!e.closest(SKIPSPAN));
const media=$$('svg, canvas, video, .gfx-mk-portal',rm).filter(e=>!(e.ownerSVGElement)&&!e.closest('a, button')&&!e.closest(SKIPSPAN)).map(r0).filter(r=>r.w>8&&r.h>8);
const rt=top0(rm),pad=parseFloat(getComputedStyle(rm).paddingTop)||0;
if(!c.length&&!media.length)return{pad,inner:0,trail:0};
const top=Math.min(...c.map(top0),...media.map(r=>r.t)),bot=Math.max(...c.map(e=>top0(e)+e.offsetHeight),...media.map(r=>r.b));
return{pad,inner:top-(rt+pad),trail:Math.max(0,rt+rm.offsetHeight-bot),top,bot};
});
};
const rhythm=()=>{
const T=TIERS(),S=lastSpans=W.innerWidth<=767?spansLite():spans();
let changed=false;
const ph=W.innerWidth<=767;
const auto=(o,i)=>i&&fieldRooms[i-1].native!=='M'?(o.tone!==fieldRooms[i-1].tone?'turn':'standard'):null;
const writes=fieldRooms.map((o,i)=>{
const tier=ph?(o.tierPhone||o.tier||auto(o,i)):o.tier;
if(!tier){if(o._phPad){o.el.style.removeProperty('padding-top');o._phPad=false;S[i].pad=parseFloat(getComputedStyle(o.el).paddingTop)||0;}return null;}
if(tier!==o.tier)o._phPad=true;
const prevTrail=i&&fieldRooms[i-1].native!=='M'?S[i-1].trail:0;
const want=Math.max(0,Math.round(T[tier]-S[i].inner-prevTrail));
return Math.abs(want-S[i].pad)>1?want:null;
});
writes.forEach((w,i)=>{if(w!=null){fieldRooms[i].el.style.setProperty('padding-top',w+'px','important');lastSpans[i].pad=w;changed=true;}});
return changed;
};
spanOf=el=>{const i=fieldRooms.findIndex(o=>o.el===el),s=lastSpans[i];return s?{top:docTop(el)+(parseFloat(el.style.paddingTop)||s.pad)+s.inner}:null;};
const inSticky=el=>{for(let n=el;n&&n!==D.body;n=n.parentElement)if(getComputedStyle(n).position==='sticky')return true;return false;};
const placeNow=live=>{
const y=scrollNow();let at=null;
fieldRooms.forEach((o,i)=>{const t=docTop(o.el);if(t<=y+1)at={i,f:(y-t) / Math.max(1,o.el.offsetHeight)};});
at=at||{i:0,f:0};
if(live)for(const fy of[0.3,0.45,0.6]){
const e=D.elementFromPoint(W.innerWidth*0.3,W.innerHeight*fy);
const t=e&&e.closest('h1,h2,h3,h4,p,.heading-2,.heading-4,.paragraph,img');
if(t&&!inSticky(t)){at.el=t;at.off=t.getBoundingClientRect().top;break;}
}
return at;
};
let lastPlace=null;
const goPlace=at=>{
const o=fieldRooms[at.i];if(!o)return;
let y=Math.max(0,Math.round(docTop(o.el)+at.f*o.el.offsetHeight));
if(at.el&&at.el.isConnected&&at.el.getBoundingClientRect().height>0&&!inSticky(at.el))y=Math.max(0,Math.round(at.el.getBoundingClientRect().top+scrollNow()-at.off));
if(Math.abs(y-scrollNow())>=2){if(shared)shared.scrollTo(y,{immediate:true,force:true});else W.scrollTo(0,y);if(ST)ST.update();}
if(at.el)lastPlace=at;
};
function fieldStill(){
setupRooms();rhythm();measure();paint();
addEventListener('scroll',()=>paint(),{passive:true});
addEventListener('resize',()=>{measure();paint();});
addEventListener('load',()=>{rhythm();measure();paint();});
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(()=>{rhythm();measure();paint();});
fieldRooms.forEach(classify);const idle=W.requestIdleCallback||(f=>setTimeout(f,60));const next=()=>{if(inkSlice())idle(next,{timeout:1500});};idle(next,{timeout:1500});
}
function fieldInit(){
setupRooms();
try{history.scrollRestoration='manual';}catch(e){}
const KEYP='gfxFlowAt:'+location.pathname;
addEventListener('pagehide',()=>{try{W.sessionStorage.setItem(KEYP,JSON.stringify(placeNow()));}catch(e){}});
let pending=null,pendT=0,lpT=0;
addEventListener('scroll',()=>{clearTimeout(lpT);lpT=setTimeout(()=>{if(!pending)lastPlace=placeNow(true);},150);},{passive:true});
const holdPlace=()=>{if(!pending)pending=lastPlace||placeNow(true);clearTimeout(pendT);pendT=setTimeout(()=>{if(pending)goPlace(pending);pending=null;},1700);};
rhythm();
let rw=W.innerWidth,rh=W.innerHeight,rt=0;
addEventListener('resize',()=>{if(W.innerWidth===rw&&Math.abs(W.innerHeight-rh)<120&&TOUCH)return;holdPlace();rw=W.innerWidth;rh=W.innerHeight;clearTimeout(rt);rt=setTimeout(()=>{rhythm();ST.refresh();},220);},true);
const nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]||{}).type;
let saved=null;try{saved=JSON.parse(W.sessionStorage.getItem(KEYP)||'null');}catch(e){}
if(saved&&(nav==='reload'||nav==='back_forward')){pending=saved;clearTimeout(pendT);pendT=setTimeout(()=>{if(pending)goPlace(pending);pending=null;},1400);}
addEventListener('pageshow',e=>{if(e.persisted&&saved)setTimeout(()=>goPlace(saved),300);});
const idle=W.requestIdleCallback||(f=>setTimeout(f,60));
fieldRooms.forEach(classify);
const next=()=>{if(inkSlice())idle(next,{timeout:1500});};
idle(next,{timeout:1500});
let settles=0,settleUntil=performance.now()+4000;
ST.addEventListener('refresh',()=>{if(settles<3&&performance.now()<settleUntil&&rhythm()){settles++;ST.refresh();return;}measure();if(pending)goPlace(pending);paint();});
addEventListener('resize',()=>{settles=0;settleUntil=performance.now()+2500;});
ST.create({start:0,end:'max',onUpdate:s=>paint(s.scroll()),onRefresh:s=>paint(s.scroll())});
ST.refresh();measure();paint();
const settle=()=>{ST.refresh();measure();paint();};
const decoded=Array.prototype.filter.call(D.images,i=>!i.complete&&i.loading!=='lazy').map(i=>(i.decode?i.decode():Promise.resolve()).catch(()=>{}));
Promise.all([D.fonts?D.fonts.ready:Promise.resolve()].concat(decoded)).then(()=>requestAnimationFrame(settle));
if(D.readyState==='complete')requestAnimationFrame(settle);else addEventListener('load',()=>requestAnimationFrame(settle),{once:true});
if('ResizeObserver'in W){let lastH=D.documentElement.scrollHeight,rt2=0;new ResizeObserver(()=>{const h=D.documentElement.scrollHeight;if(Math.abs(h-lastH)<2)return;lastH=h;clearTimeout(rt2);rt2=setTimeout(()=>{measure();paint();},150);}).observe(D.body);}
W.gfxField={turns:()=>turns,spans:()=>lastSpans,paint,measure,rhythm,place:{now:placeNow,go:goPlace}};
}
const early=()=>safe('early field',()=>{if(!fieldDef)return;if(!fieldRooms.length)setupRooms();measure();paint();});
const barEase=t=>{const c=[0.16,1,0.3,1];let x=t;for(let i=0;i<6;i++){const bx=3*c[0]*x*(1-x)*(1-x)+3*c[2]*x*x*(1-x)+x*x*x-t,d=3*c[0]*(1-x)*(1-x)+6*(c[2]-c[0])*x*(1-x)+3*(1-c[2])*x*x;if(Math.abs(bx)<1e-5||!d)break;x-=bx / d;}return 3*c[1]*x*(1-x)*(1-x)+3*c[3]*x*x*(1-x)+x*x*x;};
const navLook=top=>safe('nav look',()=>{
const bar=$('.gfx-nav');if(!bar)return;
navTop=top;
$$('.'+NAV_VAR+', [data-gfx-var]',bar).forEach(e=>{e.setAttribute('data-gfx-var','');e.classList.toggle(NAV_VAR,!top);});
bar.classList.toggle('gfx-top',top);H.classList.toggle('gfx-bar-top',top);
});
function menuFoot(){
const menu=$('.w-nav-menu');if(!menu||$('.gfx-menu-foot',menu))return;
const cta=$$('.gfx-nav a, .w-nav a').find(a=> /^start a conversation$/i.test(a.textContent.trim()));
const href=(cta&&cta.getAttribute('href'))||'/contact';
menu.insertAdjacentHTML('beforeend',`<div class="gfx-menu-foot"><a class="gfx-menu-cta" href="${href}">Start a conversation</a><ul class="gfx-menu-lines"><li><a href="mailto:owners@greyfoxpartners.com"><span>Business owners</span>owners@greyfoxpartners.com</a></li><li><a href="mailto:info@greyfoxpartners.com"><span>Investors</span>info@greyfoxpartners.com</a></li><li><a href="tel:+16469466641"><span>Telephone</span>(646) 946-6641</a></li></ul></div>`);
}
function navName(){
$$('a.w-nav-brand, a.logo-link').forEach(a=>{
const named=(a.getAttribute('aria-label')||a.textContent||$$('img',a).map(i=>i.alt).join('')).trim();
if(!named)a.setAttribute('aria-label','Grey Fox Partners, home');
});
}
function topTint(){
let m=$('meta[name="theme-color"]');if(!m){m=D.createElement('meta');m.name='theme-color';D.head.appendChild(m);}
let last='',raf=0;
const solid=c=>{const v=(c||'').match(/[\d.]+/g);return v&&(v.length<4||+v[3]>0.5)?`rgb(${v[0]}, ${v[1]}, ${v[2]})`:null;};
const pick=()=>{
const els=D.elementsFromPoint?D.elementsFromPoint(W.innerWidth / 2,1):[];
for(const e of els){
if(e.tagName==='IMG'||e.tagName==='VIDEO'||e.tagName==='CANVAS')return'rgb(20, 20, 21)';
const s=getComputedStyle(e);if(+s.opacity===0||s.visibility==='hidden')continue;
if(s.backgroundImage!=='none'&&!/gradient/.test(s.backgroundImage))return'rgb(20, 20, 21)';
const c=solid(s.backgroundColor);if(c)return c;
}
return solid(getComputedStyle(D.body).backgroundColor)||'rgb(246, 245, 242)';
};
const run=()=>{raf=0;const c=pick();if(c!==last){m.setAttribute('content',c);last=c;}};
const soon=()=>{if(!raf)raf=requestAnimationFrame(run);};
addEventListener('scroll',soon,{passive:true});addEventListener('resize',soon);D.addEventListener('click',()=>setTimeout(soon,350),true);
setInterval(()=>{if(!D.hidden)soon();},600);run();
}
function navInit(){
safe('menu foot',menuFoot);
safe('nav name',navName);
safe('top tint',topTint);
const bar=$('.gfx-nav');if(!bar)return;
let showing=true,upFrom=null,prevY=null;
gsap.set(bar,{'--gfx-away':0});
const setShown=want=>{
if(want===showing)return;showing=want;
gsap.to(bar,{'--gfx-away':want?0:1,duration:0.45,ease:barEase,overwrite:true});
bar.classList.toggle('gfx-away',!want);H.classList.toggle('gfx-bar-away',!want);
};
bar.addEventListener('focusin',()=>setShown(true));
const past=ST.create({start:()=>W.innerHeight*0.5,end:'max',
onUpdate:s=>{
const y=s.scroll(),py=prevY==null?y:prevY;prevY=y;
if(s.direction>0)upFrom=null;else if(upFrom==null)upFrom=py;
const up=s.direction<0&&upFrom!=null&&upFrom-y>=6;
setShown(up||(showing&&s.direction<0)||s.progress<0.002||bar.contains(D.activeElement));
},
onEnter:()=>navLook(false),
onLeaveBack:()=>{navLook(true);setShown(true);}});
navLook(!past.isActive&&W.scrollY<W.innerHeight*0.5);
if(past.isActive)setShown(true);
}
function foxWatch(M){
M=M||[28,36,true];
const bar=$('.gfx-nav'),link=bar&&$('.logo-link',bar);if(!link)return;
const CHROME='.navigation_wrapper, .gfx-skip, .preloader, .gfx-ftg-fly, .gfx-fly';
let away=false,since=0,rq=0,last=-1,lastY=W.scrollY;
const shownEl=el=>{for(let n=el;n&&n!==D.body;n=n.parentElement){const cs=getComputedStyle(n);if(cs.visibility==='hidden'||+cs.opacity<0.05)return false;}return true;};
const hit=(q,z)=>q.right>z.left&&q.left<z.right&&q.bottom>z.top&&q.top<z.bottom;
const near=(r,m)=>{
const z={left:r.left-m,top:r.top-m,right:r.right+m,bottom:r.bottom+m},seen=[];
for(let i=0;i<=4;i++)for(let j=0;j<=5;j++){
const x=clamp(z.left+(z.right-z.left)*i / 4,0,W.innerWidth-1),y=clamp(z.top+(z.bottom-z.top)*j / 5,0,W.innerHeight-1);
let e=D.elementsFromPoint(x,y).filter(el=>!el.closest(CHROME))[0];
if(e&&e instanceof SVGElement&&e.ownerSVGElement)e=e.closest('svg')?(function f(s){return s.ownerSVGElement?f(s.ownerSVGElement):s;})(e.closest('svg')):e;
if(!e||seen.indexOf(e)>=0)continue;seen.push(e);
if(/^(IMG|VIDEO|CANVAS|svg)$/.test(e.tagName)){const qi=e.getBoundingClientRect();if(qi.width<W.innerWidth*0.6&&hit(qi,z)&&shownEl(e))return true;continue;}
for(let k=0;k<e.childNodes.length;k++){const nd=e.childNodes[k];if(nd.nodeType!==3||!nd.textContent.trim())continue;const rg=D.createRange();rg.selectNodeContents(nd);const qs=rg.getClientRects();for(let q=0;q<qs.length;q++)if(hit(qs[q],z)&&shownEl(e))return true;}
}
return false;
};
const tick=()=>{
rq=0;const im=$$('img',link).filter(i=>i.offsetWidth)[0]||link;const r=im.getBoundingClientRect(),now=performance.now();
const dy=Math.abs(W.scrollY-lastY);lastY=W.scrollY;const ahead=M[0]+(M[2]?Math.min(180,dy*4):0);
if(!away){if(near(r,ahead)){away=true;bar.classList.add('gfx-fox-away');}}
else if(near(r,M[1]))since=0;
else if(!since){since=now;rq=requestAnimationFrame(tick);}
else if(now-since>350){away=false;since=0;bar.classList.remove('gfx-fox-away');}
else rq=requestAnimationFrame(tick);
};
const ask=()=>{if(!rq)rq=requestAnimationFrame(tick);};
addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);
setInterval(()=>{const y=W.scrollY;if(y!==last){last=y;ask();}},250);ask();
}
const FOX='https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6ace72f97fb1cddac2a0305c_gfx-logo-fox-gold.svg';
const LOGO='https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6aac4f63ec128fc57da36e73_logo-full.png';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let footApi=null;
function footBuild(){
const foot=$('.footer_section_wrapper.gfx-foot')||$('.footer_section_wrapper');if(!foot||foot.__gfxFi)return null;
foot.__gfxFi=true;
const txt=e=>(e?e.textContent.replace(/\s+/g,' ').trim():'');
const cols=$$('.footer_item_wrapper',foot);
const navA=cols[0]?$$('a[href]',cols[0]):[];
const data={
nav:navA.length?navA.map(a=>[txt(a),a.getAttribute('href')]):[['Business Owners','/business-owners'],['Investors','/investors'],['Team','#team'],['Insights','https://www.greyfoxpartners.com/insights'],['Contact','/contact']],
mail:$$('a[href^="mailto:"]',foot).map(a=>a.getAttribute('href').slice(7)),
tel:(()=>{const t=$('a[href^="tel:"]',foot);return t?[txt(t),t.getAttribute('href')]:['(646) 946-6641','tel:+16469466641'];})(),
offices:[{full:'New York, NY',tz:'America/New_York'},{full:'Austin, TX',tz:'America/Chicago'}],
legal:$$('.tos_pp_wrapper a, .gfx-ft-legal a',foot).map(a=>[txt(a),a.getAttribute('href')||'#']),
copy:txt($('.gfx-foot-cap, .footer_caption_grid > :first-child',foot))||('© '+new Date().getFullYear()+' Grey Fox Partners'),
notice:txt($('.gfx-notice',foot))||'Grey Fox Partners represents buyers. Nothing on this site is an offer or advice.'
};
if(!data.mail.length)data.mail=['owners@greyfoxpartners.com','info@greyfoxpartners.com'];
if(!data.legal.length)data.legal=[['Terms of Service','#'],['Privacy Policy','#']];
const contact=(data.nav.find(([t])=> /contact/i.test(t))||[0,'/contact'])[1];
const clock=tz=>`<span class="gfx-fi-time" data-gfx-clock="${tz}" aria-hidden="true"><span class="gfx-fi-h"></span><span class="gfx-fi-colon">:</span><span class="gfx-fi-m"></span><span class="gfx-fi-ap"></span></span>`;
const col=(key,inner)=>`<div class="gfx-fi-col gfx-fi-${key}"><i class="gfx-fi-rule" aria-hidden="true"></i><div class="gfx-fi-in">${inner}</div></div>`;
const lockup=`<a class="gfx-fi-lockup" href="/" aria-label="Grey Fox Partners, home"><img class="gfx-fi-head" src="${FOX}" alt="" width="41" height="40" decoding="async"><img class="gfx-fi-logo gfx-fi-word" src="${LOGO}" alt="" width="600" height="198" decoding="async"></a>`;
const nav=`<h2 class="gfx-fi-label" id="gfx-fi-l-nav">Navigate</h2><nav aria-labelledby="gfx-fi-l-nav"><ul class="gfx-fi-list gfx-fi-rows">${data.nav.map(([t,h])=>`<li><a class="gfx-fi-link" href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></nav>`;
const offices=`<h2 class="gfx-fi-label">Offices</h2><ul class="gfx-fi-list gfx-fi-rows gfx-fi-offices">${data.offices.map(o=>`<li><span class="gfx-fi-city">${o.full}</span>${clock(o.tz)}</li>`).join('')}</ul>`;
const write=`<h2 class="gfx-fi-label">Write us</h2><address class="gfx-fi-contact"><ul class="gfx-fi-list gfx-fi-rows">${data.mail.map(m=>`<li><a class="gfx-fi-link" href="mailto:${esc(m)}">${esc(m)}</a></li>`).join('')}<li><a class="gfx-fi-link" href="${esc(data.tel[1])}">${esc(data.tel[0])}</a></li></ul></address>`+
`<p class="gfx-fi-actrow"><a class="gfx-fi-act" href="${esc(contact)}"><span class="gfx-fi-act-t">Start a <span class="gfx-fi-nw">conversation</span></span></a></p>`;
foot.classList.add('gfx-fi-on');foot.setAttribute('role','contentinfo');
foot.innerHTML=`<div class="gfx-fi-layer" aria-hidden="true"><i class="gfx-fi-lip"></i><div class="gfx-fi-lights"><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i><i class="gfx-fi-bay"></i></div></div>`+
`<div class="gfx-fi-wrap"><div class="gfx-fi"><div class="gfx-fi-grid">${col('brand',lockup)}${col('navc',nav)}${col('offices',offices)}${col('write',write)}</div>`+
`<i class="gfx-fi-base" aria-hidden="true"></i><div class="gfx-fi-bar"><p class="gfx-fi-small gfx-fi-copy">${esc(data.copy)}</p><p class="gfx-fi-small gfx-fi-notice">${esc(data.notice)}</p>`+
`<ul class="gfx-fi-list gfx-fi-legal">${data.legal.map(([t,h])=>`<li><a class="gfx-fi-link" href="${esc(h)}">${esc(t)}</a></li>`).join('')}</ul></div></div></div>`;
const fmts={};
const now=tz=>{const f=fmts[tz]||(fmts[tz]=new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'2-digit',hour12:true}));const p=f.formatToParts(new Date()),g=t=>(p.find(x=>x.type===t)||{}).value||'';return{h:g('hour'),m:g('minute'),ap:' '+g('dayPeriod').toUpperCase()};};
const tick=()=>$$('[data-gfx-clock]',foot).forEach(el=>{const t=now(el.getAttribute('data-gfx-clock'));[['.gfx-fi-h',t.h],['.gfx-fi-m',t.m],['.gfx-fi-ap',t.ap]].forEach(([s,v])=>{const n=$(s,el);if(n&&n.textContent!==v)n.textContent=v;});});
const aim=()=>{tick();setTimeout(aim,60000-(Date.now()%60000)+30);};
aim();D.addEventListener('visibilitychange',()=>{if(!D.hidden)tick();});
H.style.setProperty('--gfx-sec',-(Date.now()%1000)+'ms');
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)H.style.setProperty('--gfx-sec',-(Date.now()%1000)+'ms');foot.classList.toggle('gfx-fi-live',e.isIntersecting);})).observe(foot);
else foot.classList.add('gfx-fi-live');
foot.parentElement.classList.add('gfx-ftg-host');
return(footApi={foot});
}
function footInit(o){
const F=footApi;if(!F)return;
const foot=F.foot,host=foot.parentElement,q=s=>$$(s,foot);
const head=$('.gfx-fi-head',foot),word=$('.gfx-fi-word',foot),lockup=$('.gfx-fi-lockup',foot),lip=$('.gfx-fi-lip',foot);
const close=o&&o.close?$(o.close):null;if(close)close.classList.add('gfx-ftg-close');
const still=()=>{H.classList.remove('gfx-ftg-reveal');H.setAttribute('data-gfx-foot','still');};
if(REDUCE||!gsap){still();return;}
const S=G.SETTLE;
const wide=W.matchMedia('(min-width: 992px) and (min-height: 680px)');
const maxY=()=>ST.maxScroll(W);
const film=reveal=>{const tl=gsap.timeline({paused:true});const all=q(reveal?'.gfx-fi-navc .gfx-fi-in, .gfx-fi-offices .gfx-fi-in, .gfx-fi-write .gfx-fi-in':'.gfx-fi-in');
tl.fromTo(q('.gfx-fi-bay'),{opacity:0},{opacity:1,duration:0.9,ease:'power2.out'},0)
.fromTo(q('.gfx-fi-rule'),{scaleY:0},{scaleY:1,duration:0.9,ease:S},0)
.fromTo(all,{opacity:0,y:10},{opacity:1,y:0,duration:0.9,ease:S},0)
.fromTo(q('.gfx-fi-base'),{scaleX:0},{scaleX:1,duration:0.9,ease:S},0)
.fromTo(q('.gfx-fi-bar > *'),{opacity:0,y:10},{opacity:1,y:0,duration:0.9,ease:S},0);
return tl;};
let mode=null,tl=null,st=null,st2=null,fly=null,state='bar',flight=null,wordTw=null,H0=0,lockR=null,lastNav=null,prog=0,ro=null,raf=0,hostTop=0,lockIO=null;
const navRect=()=>{
const el=$$('.gfx-nav .logo__navbar').find(i=>{const r=i.getBoundingClientRect();if(!r.width)return false;const wr=i.closest('.navigation_wrapper');if(!wr)return true;const cs=getComputedStyle(wr);return cs.visibility!=='hidden'&&+cs.opacity>0.5;});
if(el){const r=el.getBoundingClientRect();lastNav={left:r.left,top:r.top,width:r.width,height:r.height};}
return lastNav||{left:50,top:17,width:40,height:40};
};
const makeFly=()=>{if(fly)return;fly=D.createElement('div');fly.className='gfx-ftg-fly';fly.setAttribute('aria-hidden','true');const i=new Image();i.alt='';i.src=FOX;fly.appendChild(i);D.body.appendChild(fly);};
const flyAt=(r,scale)=>{const n=navRect();Object.assign(fly.style,{width:n.width+'px',height:n.height+'px',visibility:'visible'});gsap.set(fly,{x:r.left,y:r.top,scale});};
const stopFlight=()=>{if(flight)flight.kill();flight=null;};
const navShown=()=>{const wr=$('.gfx-nav');if(!wr)return false;const cs=getComputedStyle(wr);if(cs.visibility==='hidden'||+cs.opacity<=0.5||wr.getBoundingClientRect().bottom<=0)return false;if(wr.classList.contains('gfx-away')||wr.classList.contains('gfx-fox-away'))return false;return wr.getBoundingClientRect().top>-20;};
const showWord=on=>{if(wordTw)wordTw.kill();wordTw=on?gsap.fromTo(word,{autoAlpha:0,x:-8},{autoAlpha:1,x:0,duration:G.body.duration,ease:S}):gsap.to(word,{autoAlpha:0,x:-8,duration:LEAVE.duration,ease:LEAVE.ease});};
const setHome=()=>{stopFlight();if(wordTw)wordTw.kill();state='home';H.classList.remove('gfx-ftg-flying');H.classList.add('gfx-ftg-home');if(fly)fly.style.visibility='hidden';gsap.set(word,{autoAlpha:1,x:0});if(tl)tl.timeScale(1).reversed(false).progress(1).pause();};
const setBar=()=>{stopFlight();if(wordTw)wordTw.kill();state='bar';H.classList.remove('gfx-ftg-flying','gfx-ftg-home');if(fly)fly.style.visibility='hidden';gsap.set(word,{autoAlpha:0,x:-8});if(tl)tl.timeScale(1).reversed(false).pause(0);};
const goHome=()=>{
makeFly();state='out';
const n=navRect(),b=head.getBoundingClientRect();
const fresh=!flight;if(!flight)flyAt(n,1);else stopFlight();
H.classList.add('gfx-ftg-flying');
if(fresh){gsap.killTweensOf(fly,'opacity');if(navShown())gsap.set(fly,{opacity:1});else gsap.fromTo(fly,{opacity:0},{opacity:1,duration:0.4,ease:'power2.out'});}
flight=gsap.timeline({onComplete:()=>{flight=null;state='home';H.classList.add('gfx-ftg-home');H.classList.remove('gfx-ftg-flying');fly.style.visibility='hidden';showWord(true);if(tl){tl.timeScale(1);if(tl.progress()<1)tl.play();}}})
.to(fly,{x:b.left,y:b.top,duration:1.3,ease:G.DRAW},0)
.to(fly,{scale:b.width / n.width,duration:1.3,ease:G.DRAW},0);
};
const goBar=()=>{
makeFly();state='back';
const n=navRect();
if(H.classList.contains('gfx-ftg-home')){const b=head.getBoundingClientRect();flyAt(b,b.width / n.width);H.classList.add('gfx-ftg-flying');H.classList.remove('gfx-ftg-home');}
stopFlight();showWord(false);gsap.killTweensOf(fly,'opacity');gsap.set(fly,{opacity:1});
if(tl&&tl.progress()>0)tl.timeScale(2.2).reverse();
flight=gsap.timeline({onUpdate:function(){if(this.progress()<=0.72)return;const sh=navShown();
if(!sh&&!fly._out){fly._out=true;gsap.to(fly,{opacity:0,duration:0.3,ease:'power2.in',overwrite:'auto'});}
else if(sh&&fly._out){fly._out=false;gsap.to(fly,{opacity:1,duration:0.18,ease:'power2.out',overwrite:'auto'});}},onComplete:()=>{
fly._out=false;flight=null;state='bar';H.classList.remove('gfx-ftg-flying');fly.style.visibility='hidden';gsap.set(fly,{opacity:1});
if(tl){tl.timeScale(1);if(prog<=0.001)tl.pause(0);}}}).to(fly,{x:n.left,y:n.top,scale:1,duration:1.2,ease:G.DRAW},0.1);
};
let CH=0,K=-1;
const inner=()=>q(':scope > .gfx-fi-wrap, :scope > .gfx-fi-layer');
const cut=k=>{if(k===K)return;K=k;foot.style.transform=k?`translate3d(0,${k}px,0)`:'';inner().forEach(e=>{e.style.transform=k?`translate3d(0,${-k}px,0)`:'';});};
const measureF=()=>{CH=close?close.offsetHeight:0;cut(0);H0=foot.offsetHeight;host.style.setProperty('--gfx-ftg-h',H0+'px');const r=lockup.getBoundingClientRect(),f=foot.getBoundingClientRect();lockR={localBottom:r.bottom-f.top};hostTop=host.getBoundingClientRect().top+W.scrollY;};
const step=(p,instant)=>{
prog=p;
const covered=p<=0.001;
H.classList.toggle('gfx-ftg-covered',covered);H.classList.toggle('gfx-ftg-open',p>=0.97);
const local=H0*(1-p);
cut(close?Math.max(0,Math.round(H0*(1-p)-CH)):0);
const home=local<=lockR.localBottom+2,away=local>lockR.localBottom+72;
if(instant){if(state==='out'||state==='home'?!away:home)setHome();else setBar();}
else if(home&&(state==='bar'||state==='back'))goHome();
else if(away&&(state==='home'||state==='out'))goBar();
if(covered&&state==='bar'&&tl&&tl.progress()>0)tl.pause(0);
if(lip){const op=clamp(p / 0.12,0,1)*(1-clamp((p-0.8) / 0.2,0,1));lip.style.transform=`translate3d(0,${Math.round(local)}px,0)`;lip.style.opacity=op.toFixed(3);}
};
const onFocus=()=>{
if(mode==='reveal'&&prog<0.99){const y=maxY();if(shared)shared.scrollTo(y,{immediate:true,force:true});else W.scrollTo(0,y);ST.update();if(prog<0.99)step(1,true);setHome();}
if(tl&&tl.progress()<1)tl.progress(1);
};
const teardown=()=>{
if(st)st.kill();st=null;if(st2)st2.kill();st2=null;if(tl)tl.kill();tl=null;stopFlight();if(wordTw)wordTw.kill();if(ro)ro.disconnect();ro=null;if(lockIO)lockIO.disconnect();lockIO=null;
H.classList.remove('gfx-ftg-reveal','gfx-ftg-covered','gfx-ftg-home','gfx-ftg-flying','gfx-ftg-lock-in','gfx-ftg-open');
cut(0);host.style.removeProperty('--gfx-ftg-h');if(fly)fly.style.visibility='hidden';state='bar';
if(lip){lip.style.transform='';lip.style.opacity='';}
gsap.set([word].concat(q('.gfx-fi-rule, .gfx-fi-in, .gfx-fi-base, .gfx-fi-bar > *, .gfx-fi-bay, .gfx-fi-lip')),{clearProps:'all'});
};
const setup=()=>{
const fits=()=>foot.offsetHeight<=W.innerHeight*0.8;
const next=wide.matches&&fits()?'reveal':'flow';
if(next===mode)return;const was=mode;if(was)teardown();mode=next;
H.setAttribute('data-gfx-foot',mode);
if(mode==='flow'){
tl=film(false);
st=ST.create({trigger:foot,start:'top 92%',end:'max',onEnter:()=>{if(tl.progress()<1&&!tl.isActive())tl.play();}});
st2=ST.create({trigger:foot,start:'top 125%',onLeaveBack:()=>tl.pause(0)});
if(was)tl.progress(foot.getBoundingClientRect().top<W.innerHeight?1:0);
if('IntersectionObserver'in W){lockIO=new IntersectionObserver(es=>es.forEach(e=>H.classList.toggle('gfx-ftg-lock-in',e.isIntersecting)));lockIO.observe(lockup);}
ST.refresh();return;
}
H.classList.add('gfx-ftg-reveal');
measureF();tl=film(true);
const live=y=>Math.min(1,Math.max(0,(W.innerHeight-(hostTop-y)) / (H0||1)));
let first=true;
st=ST.create({start:0,end:'max',onRefresh:s=>{measureF();step(live(s.scroll()),true);first=false;},onUpdate:s=>{step(live(s.scroll()),first);first=false;}});
ro=new ResizeObserver(()=>{if(foot.offsetHeight!==H0){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>ST.refresh());}});
ro.observe(foot);
ST.refresh();
};
foot.addEventListener('focusin',onFocus);
const re=()=>setup();
if(wide.addEventListener)wide.addEventListener('change',re);else wide.addListener(re);
let rz=0;W.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(re,180);});
setup();
W.gfxFoot={get state(){return state;},get mode(){return mode;},get p(){return prog;},get film(){return tl;}};
}
function foxStep(sel){
let rq=0,last='';
const tick=()=>{
rq=0;const fox=$(sel);if(!fox)return;const sec=fox.parentElement;
const y=scrollNow(),vh=W.innerHeight,r=sec.getBoundingClientRect(),top=r.top+y,bot=r.bottom+y;
const max=D.documentElement.scrollHeight-vh,ft=$('.footer_section_wrapper'),fh=ft?ft.offsetHeight:vh*0.6;
let y0=Math.max(bot-vh,top-vh*0.15),span=Math.max(vh*0.45,fh*0.6);
if(y0+span>max){y0=Math.max(top-vh*0.15,max-span);span=Math.max(vh*0.2,max-y0);}
const fp=(W.gfxFoot&&W.gfxFoot.mode==='reveal')?+W.gfxFoot.p||0:0;
const t=Math.max(fp,Math.min(1,Math.max(0,(y-y0) / span))),k=t*t*t*(t*(t*6-15)+10),o=(0.62*(1-k)).toFixed(3);
if(o!==last){fox.style.opacity=o;last=o;}
};
const ask=()=>{if(!rq)rq=requestAnimationFrame(tick);};
addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);if(shared&&shared.on)shared.on('scroll',ask);
setTimeout(ask,600);addEventListener('load',ask);
}
function keyboardInit(){
W.addEventListener('focusin',e=>safe('focus reveal',()=>{
for(let el=e.target;el&&el!==D.body;el=el.parentElement){
if(el.hasAttribute&&el.hasAttribute('data-gfx-reveal')&&+getComputedStyle(el).opacity<0.99)gsap.set(el,{opacity:1,y:0});
gsap.getTweensOf(el).forEach(t=>{let root=t;while(root.parent&&root.parent!==gsap.globalTimeline)root=root.parent;const st=root.scrollTrigger;if(st&&st.vars.scrub)return;if(root.progress()<1&&!root.reversed())root.progress(1);});
}
}),true);
}
const skipLink=()=>safe('skip',()=>{
if($('.gfx-skip')||!D.body)return;
const first=$('main, .page-wrapper section');if(!first)return;
const a=D.createElement('a');a.className='gfx-skip';a.href='#';a.textContent='Skip to content';
a.addEventListener('click',e=>{e.preventDefault();first.setAttribute('tabindex','-1');first.focus({preventScroll:true});});
D.body.insertBefore(a,D.body.firstChild);
});
const cleanIX=()=>safe('clean ix',()=>{
const clr=(el,props)=>props.forEach(p=>el.style.removeProperty(p));
$$('[data-gfx-wid]').forEach(el=>{if(el.closest('.w-nav, .button, .nav-button'))return;const s=el.style;if(s.opacity==='0'||s.visibility==='hidden')clr(el,['opacity','visibility','transform','-webkit-transform','filter']);});
$$('.preloader, .preloader .logo-full').forEach(el=>clr(el,['display','opacity','visibility','transform','-webkit-transform']));
$$('.reveal_block').forEach(el=>clr(el,['display','opacity','transform','-webkit-transform','width','height']));
$$('.divider').forEach(el=>clr(el,['width','transform','-webkit-transform']));
});
const onReady=fn=>(D.readyState==='loading'?D.addEventListener('DOMContentLoaded',fn,{once:true}):fn());
onReady(()=>{if(!W.__gfxHome)H.classList.remove('gfx-intro');});
const STAGING= /(^|\/)[a-z0-9-]*-v2(-[a-z0-9-]+)?\/?$/.test(location.pathname);
const toV2=a=>{
const h=a.getAttribute('href')||'',t=(a.textContent||'').trim();
if(/^(https?:\/\/[^/]*greyfox[^/]*)?\/contact\/?([?#].*)?$/.test(h))a.setAttribute('href',h.replace(/\/contact\/?/,'/contact-v2'));
else if(/^(https?:\/\/[^/]*greyfox[^/]*)?\/insights\/?$/.test(h))a.setAttribute('href','/insights-v2');
else if(t==='Team'&& /^(\/team\/?|(\/[a-z0-9-]*)?#team)$/.test(h))a.setAttribute('href','/team-v2');
else if(/^privacy( policy)?$/i.test(t)&&(h==='#'|| /^\/privacy(-policy)?\/?$/.test(h)))a.setAttribute('href','/privacy-v2');
else if(h==='/'||h==='/#')a.setAttribute('href','/home-v2');
};
if(STAGING){
const sweep=()=>D.querySelectorAll('a[href]').forEach(toV2);
onReady(sweep);W.addEventListener('load',()=>{sweep();setTimeout(sweep,1500);});
D.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a)toV2(a);},true);
}
const loadScript=src=>new Promise((res,rej)=>{const s=D.createElement('script');s.src=src;s.async=false;s.onload=res;s.onerror=rej;(D.head||H).appendChild(s);});
const haveGsap=()=>!!(W.gsap&&W.ScrollTrigger&&W.SplitText);
const ensureGsap=()=>new Promise(res=>{
if(haveGsap()){res(true);return;}
let done=false;
const fallback=()=>{
if(done)return;done=true;
if(haveGsap()){res(true);return;}
const v=(W.gsap&&W.gsap.version)||'3.13.0',base='https://cdn.jsdelivr.net/npm/gsap@'+v+'/dist/';
(W.gsap?Promise.resolve():loadScript(base+'gsap.min.js'))
.then(()=>(W.ScrollTrigger?0:loadScript(base+'ScrollTrigger.min.js')))
.then(()=>(W.SplitText?0:loadScript(base+'SplitText.min.js')))
.then(()=>res(haveGsap()),()=>res(haveGsap()));
};
if(D.readyState==='complete')fallback();else{W.addEventListener('load',fallback,{once:true});setTimeout(fallback,2500);}
});
const ensureLenis=()=>new Promise(res=>{
if(REDUCE||TOUCH||shared){res();return;}
if(RealLenis){makeShared();res();return;}
if(H.classList.contains('lenis')){res();return;}
loadScript('https://unpkg.com/lenis@1.1.18/dist/lenis.min.js').then(()=>{makeShared();res();},()=>res());
});
const fontsReady=()=>{
let capped=false;
const cap=new Promise(r=>setTimeout(()=>{capped=true;r();},1500));
const fr=D.fonts&&D.fonts.ready?D.fonts.ready:Promise.resolve();
fr.then(()=>{if(capped)setTimeout(()=>W.dispatchEvent(new Event('resize')),60);});
return Promise.race([fr,cap]);
};
let PAGE=null;
const api={
core:VERSION,G,$,$$,safe,mq,store,clamp,docTop,NS,TAN,BASE,REDUCE,TOUCH,READ,
room,lineSplit,fitFilm,rooms,scrollToY,refresh,esc,
get gsap(){return gsap;},get ST(){return ST;},get lenis(){return shared;},scrollNow,
arrow:()=>W.gfArrow,turn:()=>W.gfTurn,
onField:f=>fieldListeners.push(f),
page:def=>{PAGE=def;fieldDef=def.field||null;}
};
W.gfx=api;
onReady(()=>{
safe('ix2 sweep',()=>{strip(D.body);if(ixObs)ixObs.disconnect();});
skipLink();stopIX2();cleanIX();
W.addEventListener('load',()=>{stopIX2();setTimeout(ix3Late,3000);},{once:true});
if(!PAGE){H.classList.add('gfx-ready');return;}
safe('page dom',()=>PAGE.dom&&PAGE.dom(api));
safe('footer I',footBuild);
if(fieldDef){addEventListener('scroll',early,{passive:true});early();}
if(REDUCE){stillInit();return;}
Promise.all([ensureGsap(),ensureLenis()]).then(([ok])=>{if(!ok){staticInit();return;}safe('start',start);});
});
function stillInit(){
safe('reduced',()=>{
H.classList.add('gfx-still-page');
if(fieldDef){removeEventListener('scroll',early);fieldStill();}
safe('page still',()=>PAGE.still&&PAGE.still(api));
H.classList.add('gfx-ready');
if(W.gsap){gsap=W.gsap;}footInit(PAGE.foot);
if(PAGE.fox)foxStep(PAGE.fox);
});
}
function staticInit(){
safe('static',()=>{
H.classList.remove('gfx-m','gfx-intro');H.classList.add('gfx-static');
const p=$('.page-wrapper');p&&p.removeAttribute('inert');
if(fieldDef){removeEventListener('scroll',early);fieldStill();}
safe('page still',()=>PAGE.still&&PAGE.still(api));
H.classList.add('gfx-ready');
});
}
function start(){
gsap=W.gsap;ST=W.ScrollTrigger;
gsap.registerPlugin(ST,W.SplitText);
ST.defaults({toggleActions:'play complete none none'});
if(TOUCH)ST.config({ignoreMobileResize:true});
if(shared&&sharedRaf){tickerOn=true;cancelAnimationFrame(tempLoop);gsap.ticker.add(()=>sharedRaf(performance.now()));gsap.ticker.lagSmoothing(0);shared.on('scroll',ST.update);}
safe('page start',()=>PAGE.start&&PAGE.start(api));
safe('nav',navInit);
fontsReady().then(()=>{
safe('page rooms',()=>PAGE.rooms&&PAGE.rooms(api));
safe('keyboard',keyboardInit);
setTimeout(()=>{
if(fieldDef){removeEventListener('scroll',early);safe('field',fieldInit);}
setTimeout(()=>{
safe('page late',()=>PAGE.late&&PAGE.late(api));
safe('footer I motion',()=>footInit(PAGE.foot));
if(PAGE.fox)safe('fox step',()=>foxStep(PAGE.fox));
safe('fox watch',()=>foxWatch(PAGE.foxZone));
H.classList.add('gfx-rooms');
ST.refresh();
},60);
},200);
});
}
})();
(function(){
'use strict';
var W=window,D=document,gfx=W.gfx;
if(!gfx||!gfx.page||W.__gfxHome)return;
W.__gfxHome='1.1.6';
const H=D.documentElement,G=gfx.G,$=gfx.$,$$=gfx.$$,safe=gfx.safe,mq=gfx.mq,clamp=gfx.clamp;
const NS=gfx.NS,TAN=gfx.TAN,REDUCE=gfx.REDUCE,GROUP=G.group,LEAVE=G.leave;
const PIN='(min-width: 992px) and (min-height: 681.01px)',UNPIN='(max-width: 991px), (max-height: 680.99px)';
const ss=t=>t*t*(3-2*t),eo=t=>1-Math.pow(1-t,3),eio=t=>(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3) / 2);
const seg=(p,a,b)=>clamp((p-a) / (b-a),0,1),lerp=(a,b,t)=>a+(b-a)*t;
const arrowReady=cb=>(W.gfArrow?cb(W.gfArrow):null);
let gsap=null,ST=null;
const flowY=el=>el.getBoundingClientRect().top+W.scrollY;
const field={
rooms:[
{el:'.gfx-hero-sec',native:'M',tone:'L'},
{el:'.gfx-std-sec',native:'L',tone:'L',tier:'standard'},
{el:'.gfx-case-sec',native:'L',tone:'L',tier:'breath'},
{el:'.gfx-mk',native:'D',tone:'D',turnAt:(ym,c)=>{const pv=c.prev.el,out=c.docTop(pv)+pv.offsetHeight-c.vh*0.2;return out>ym?Math.min(out,c.max-c.vh*0.05):ym;}},
{el:'.gfx-team-sec',native:'L',tone:'L',tier:'standard',turnAt:(ym,c)=>{
const pv=c.prev.el,out=c.docTop(pv)+pv.offsetHeight-c.vh*0.7;if(out>ym)ym=Math.min(out,c.max-c.vh*0.05);
const stg=$('.gfx-mk-stage',pv);
if(stg){const st=stg.getBoundingClientRect().top;let lo=0;$$('p, h2, h3, .gfx-mk-cap, .gfx-mk-ill, .gfx-mk-fig, .gfx-mk-steps, li',stg).forEach(e=>{if(e.closest('.gfx-mk-sr'))return;const r=e.getBoundingClientRect();if(r.height>1&&r.width>1)lo=Math.max(lo,r.bottom-st);});
const gone=c.docTop(pv)+pv.offsetHeight-stg.offsetHeight+lo;if(lo&&gone>ym)ym=Math.min(gone,c.max-c.vh*0.05);}
return ym;}},
{el:'.gfx-ins-sec',native:'L',tone:'L',tier:'standard'},
{el:'.gfx-cta-sec',native:'D',tone:'D',tier:'turn',opaque:true,foot:true,turnAt:(ym,c)=>{
const lb=c.lastBottom(c.prev.el);if(Number.isFinite(lb)&&lb-c.vh*0.12>ym)ym=Math.min(lb-c.vh*0.12,c.max-c.vh*0.04);
const hd=$('.heading-2',c.room.el);if(hd)ym=Math.min(ym,c.docTop(hd)-c.vh*0.86);
return ym;}}
]
};
const MK={};
const reel=n=>'<span class="gfx-mk-reels">'+[...n.toLocaleString('en-US')].map(c=>c===','?'<span class="gfx-mk-c">,</span>':
'<span class="gfx-mk-d"><span class="gfx-mk-r">'+'0123456789'.split('').map(d=>`<i>${d}</i>`).join('')+'<i>0</i></span></span>').join('')+'</span>';
function marketDom(){
const sec=$('.gfx-mk');if(!sec)return;
const stage=$('.gfx-mk-stage',sec);
MK.sec=sec;MK.stage=stage;
if(!$('.gfx-mk-threads',stage))stage.insertAdjacentHTML('afterbegin','<canvas class="gfx-mk-threads" aria-hidden="true"></canvas><div class="gfx-mk-gates" aria-hidden="true"><span class="gfx-mk-gate">Web research</span><span class="gfx-mk-gate">On-site evidence</span><span class="gfx-mk-gate">Satellite imagery</span></div>');
$$('.gfx-mk-odo',sec).forEach(o=>{const v=$('.gfx-mk-val',o),n=+(o.getAttribute('data-n')||(v?v.textContent.replace(/\D/g,''):0));if(v&&!$('.gfx-mk-reels',o)){v.insertAdjacentHTML('afterend',reel(n));v.classList.add('gfx-mk-val-off');}});
}
function introInit(){
if(!H.classList.contains('gfx-intro'))return null;
const pre=$('.preloader'),logo=pre&&$('.logo-full',pre);
if(!pre||!logo){H.classList.remove('gfx-intro');return null;}
gfx.store.set('gfx-intro-seen','1');
const page=$('.page-wrapper');if(page)page.setAttribute('inert','');
const lenis=gfx.lenis;if(lenis&&lenis.stop)lenis.stop();
const tl=gsap.timeline();
const svg=D.createElementNS(NS,'svg');svg.setAttribute('class','gfx-intro-mark gfx-intro-line');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
svg.style.cssText='position:fixed;left:0;top:0;overflow:visible;pointer-events:none;z-index:2;--gfa-c:#3aa678';
pre.appendChild(svg);
let mk=null;const lk={t:0};
const place=()=>safe('intro mark',()=>{
const A=W.gfArrow,b=logo.getBoundingClientRect();if(!b.width||!A||!A.line)return;
const inset=b.width*27 / 600,w=b.width-2*inset,fs=Math.max(30,Math.min(60,b.height*0.46)),S=A.sizes(fs),top=S.rise+6;
svg.style.left=(b.left+inset)+'px';svg.style.top=(b.bottom+Math.max(18,b.height*0.14)-4)+'px';
svg.setAttribute('width',Math.ceil(w+S.run+12));svg.setAttribute('height',Math.ceil(top+8));
if(mk)mk.remove();mk=A.line(svg,0,top,w,fs,{at:lk.t});
});
const navFox=$$('.gfx-nav .logo__navbar').filter(i=>i.offsetWidth||i.getClientRects().length)[0];
const FLY=!!navFox;
let fly=null;
if(FLY){
fly=D.createElement('div');fly.className='gfx-fly';fly.setAttribute('aria-hidden','true');
const png=new Image(),sv=new Image();png.alt=sv.alt='';png.className='gfx-fly-png';sv.className='gfx-fly-svg';
png.src=logo.currentSrc||logo.src;sv.src=navFox.currentSrc||navFox.src;fly.appendChild(png);fly.appendChild(sv);D.body.appendChild(fly);
}
const flyOff=()=>safe('fly',()=>{
const b=logo.getBoundingClientRect(),t=navFox.getBoundingClientRect(),sx=b.width / 600,sy=b.height / 189;
const w=176*sx,pad=(w-172*sy) / 2,left=b.left+27*sx,top=b.top+8*sy-pad;
Object.assign(fly.style,{width:w+'px',height:w+'px',visibility:'visible'});gsap.set(fly,{x:left,y:top});
Object.assign(fly.firstChild.style,{left:-27*sx+'px',top:pad-8*sy+'px',width:b.width+'px',height:b.height+'px'});
logo.style.clipPath='inset(0 0 0 36.2%)';
gsap.to(fly,{x:t.left,y:t.top,scale:t.width / w,duration:G.seam.hairline,ease:G.DRAW});
gsap.to(fly.lastChild,{opacity:1,duration:0.45,ease:'none',delay:0.6});
gsap.to(fly.firstChild,{opacity:0,duration:0.45,ease:'none',delay:0.6});
});
tl.fromTo(logo,{autoAlpha:0,scale:0.96},{autoAlpha:1,scale:1,duration:G.detail.duration,ease:G.SETTLE},0);
let t=0.5;
tl.add(place,t).fromTo(lk,{t:0},{t:1.6,duration:1.6,ease:'none',immediateRender:false,onUpdate:()=>{if(mk)mk.at(lk.t);}},t);
t+=1.45;
tl.addLabel('out',t+0.25);
if(FLY)tl.add(flyOff,'out');
const CUR=G.seam.hairline;
tl.to([logo,svg],{autoAlpha:0,y:-12,duration:LEAVE.duration,ease:LEAVE.ease},'out')
.to(pre,{yPercent:-100,duration:CUR,ease:G.DRAW,
onComplete:()=>{H.classList.remove('gfx-intro');if(fly)fly.remove();gsap.set(pre,{clearProps:'transform'});logo.style.clipPath='';gsap.set([logo,svg],{clearProps:'opacity,visibility,transform'});svg.remove();}},'out+=0.15')
.addLabel('heroIn','out+='+(0.15+CUR*0.6))
.add(()=>{if(page)page.removeAttribute('inert');const l=gfx.lenis;if(l&&l.start)l.start();},'heroIn');
return tl;
}
let birth=null;
const birthBuild=()=>{const host=$('.gfx-hero-sec .hero_title'),el=host&&$('.gfx-hero-h',host);if(!host||!el||!W.gfArrow)return null;return W.gfArrow.word({el,host,cls:'gfx-birth',auto:false});};
function heroInit(introTl){
const title=$('.gfx-hero-h');
const para=$('.gfx-hero-p'),btns=$$('.gfx-hero-content .hero_buttons');
const late=!introTl&&performance.now()>3300;
let lines=[],started=late,tw=null;
const rise=()=>gsap.fromTo(lines,{yPercent:G.headline.yPercent},{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:G.SETTLE,paused:!started});
if(title)W.SplitText.create(title,{type:'lines',mask:'lines',linesClass:'gfx-line',autoSplit:true,aria:'none',
onSplit:self=>{lines=self.lines;requestAnimationFrame(()=>{D.dispatchEvent(new Event('gfx:resplit'));if(birth)birth.place();});if(late)return undefined;tw=rise();return tw;}});
if(!late){if(para)gsap.set(para,{opacity:0.32});if(btns.length)gsap.set(btns,{opacity:0,y:G.detail.y});}
H.classList.add('gfx-ready');
const still=$('.gfx-hero-still img');
const born=()=>{
H.classList.add('gfx-born');
birth=birth||birthBuild();if(birth){if(REDUCE)birth.still();else birth.draw(0.15);}
const fox=$('.gfx-nav .logo-link');if(fox)setTimeout(()=>fox.classList.add('gfx-breath1'),300);
};
setTimeout(born,introTl?2600:900);
if(late){
if(still)gsap.set(still,{scale:1});
[para].concat(btns).filter(Boolean).forEach(e=>{const o=+getComputedStyle(e).opacity;if(o<1)gsap.fromTo(e,{opacity:o},{opacity:1,duration:0.6,ease:G.SETTLE,clearProps:'opacity'});});
return;
}
const tl=introTl||gsap.timeline();
if(!introTl)tl.addLabel('heroIn',0.15);
tl.add(()=>{started=true;if(tw)tw.play();},'heroIn');
if(para)tl.to(para,{opacity:1,y:0,duration:G.body.duration,ease:G.SETTLE,clearProps:'opacity,transform'},'heroIn+='+G.body.at);
if(btns.length)tl.to(btns,{opacity:1,y:0,duration:G.detail.duration,stagger:G.detail.stagger,ease:G.SETTLE,clearProps:'opacity,transform'},'heroIn+='+G.detail.at);
if(still&&H.classList.contains('gfx-still'))gsap.set(still,{scale:1});
else if(still)tl.add(()=>{
const go=()=>gsap.fromTo(still,{scale:1.04},{scale:1,duration:7,ease:G.SETTLE});
if(still.complete&&still.naturalWidth)go();else{still.addEventListener('load',go,{once:true});still.addEventListener('error',()=>gsap.set(still,{scale:1}),{once:true});}
},'heroIn');
}
function slide(out,inn,dimMax){
if(!out||!inn||W.matchMedia('(max-width: 767px)').matches)return;
out.classList.add('gfx-out');inn.classList.add('gfx-in');
const dim=D.createElement('i');dim.className='gfx-dim';dim.setAttribute('aria-hidden','true');out.appendChild(dim);
let last='';
ST.create({trigger:inn,start:'top bottom',end:'top top',invalidateOnRefresh:true,
onUpdate:s=>{const p=s.progress,dist=s.end-s.start,t=`translate3d(0, ${(p*dist*0.4).toFixed(1)}px, 0)`;if(t!==last){out.style.transform=p>0?t:'';last=t;dim.style.opacity=(dimMax*eo(p)).toFixed(3);}},
onLeave:()=>{out.style.transform='';dim.style.opacity='0';last='';out.style.visibility='hidden';},
onEnterBack:()=>{out.style.visibility='';}});
}
function marqueeInit(){
const lw=$('.gfx-logos'),track=lw&&$('.gfx-marq-track',lw);if(!track)return;
const logos=$$('img',track);if(!logos.length||track.querySelector('.gfx-marq-copy'))return;
logos.forEach(l=>{l.loading='eager';l.decoding='async';});
for(let k=1;k<4;k++)logos.forEach(l=>{const c=l.cloneNode(true);c.setAttribute('aria-hidden','true');c.alt='';c.classList.add('gfx-marq-copy');c.removeAttribute('id');track.appendChild(c);});
lw.classList.add('gfx-marq');
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>lw.classList.toggle('gfx-off',!e.isIntersecting))).observe(lw);
}
const pauseControl=()=>safe('pause',()=>{
const label=$('.gfx-logos-label');if(!label||$('.gfx-motion'))return;
const btn=D.createElement('button');btn.type='button';btn.className='gfx-motion';
const apply=still=>{
H.classList.toggle('gfx-still',still);btn.dataset.still=still?'true':'false';
btn.innerHTML='<i aria-hidden="true"></i><span>'+(still?'Play motion':'Pause motion')+'</span>';
gfx.store.set('gfx-still',still?'1':'');
};
btn.addEventListener('click',()=>apply(!H.classList.contains('gfx-still')));
const slot=D.createElement('span');slot.className='gfx-motion-slot';slot.appendChild(btn);label.classList.add('gfx-firms-head');label.appendChild(slot);
btn.addEventListener('focus',()=>{const row=[label,$('.gfx-logos')].filter(e=>e&&+getComputedStyle(e).opacity<1);if(row.length)gsap.to(row,{opacity:1,y:0,duration:0.6,ease:'expo.out',overwrite:'auto'});});
apply(gfx.store.get('gfx-still')==='1');
});
function standardInit(){
const sec=$('.gfx-std-sec');if(!sec)return;
const head=$('.gfx-std-title .heading-2');
gfx.room({trigger:head||sec,headline:head,body:$$('.gfx-std-grid > .gfx-lead').slice(0,1),hairline:'.gfx-std-rule'});
const pull=$('.gfx-pull'),q=pull&&$('.gfx-pull-q',pull),markImg=pull&&$('.gfx-pull-mark',pull),attr=pull&&$('.gfx-attr',pull),pic=pull&&$('.gfx-attr-pic',pull);
const logos=[$('.gfx-logos-label'),$('.gfx-logos')].filter(Boolean);
const played=[false,false];
let pullLines=[],pullSplit=null;
if(q)pullSplit=W.SplitText.create(q,{type:'lines',mask:'lines',aria:'none',autoSplit:true,onSplit:self=>{pullLines=self.lines;if(!played[0])gsap.set(self.lines,{yPercent:G.headline.yPercent});}});
if(markImg)gsap.set(markImg,{opacity:0,y:10});
if(pic)gsap.set(pic,{clipPath:G.picture.clipFrom,scale:G.picture.scaleFrom});
if(attr){attr.setAttribute('data-gfx-reveal','');gsap.set(attr,{opacity:0,y:G.detail.y});}
if(logos.length){logos.forEach(l=>l.setAttribute('data-gfx-reveal',''));gsap.set(logos,{opacity:0,y:G.detail.y});}
const beats=[
()=>pull&&gfx.fitFilm(gsap.timeline({onComplete:()=>{if(pullSplit)pullSplit.revert();D.dispatchEvent(new Event('gfx:resplit'));}})
.to(pullLines,{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:G.SETTLE},0)
.to(markImg||{},{opacity:1,y:0,duration:G.detail.duration,ease:G.SETTLE},0)
.to(pic||{},{clipPath:'inset(0% 0% 0% 0%)',duration:G.picture.duration,ease:G.DRAW},G.picture.at)
.to(pic||{},{scale:1,duration:G.picture.duration,ease:G.SETTLE},G.picture.at)
.to(attr||{},{opacity:1,y:0,duration:G.detail.duration,ease:G.SETTLE},G.detail.at)),
()=>logos.length&&gsap.to(logos,{opacity:1,y:0,duration:G.detail.duration,stagger:G.detail.stagger,ease:G.SETTLE})
];
const beat=i=>{if(played[i])return;played[i]=true;safe('std beat',beats[i]);};
[[pull,0],[$('.testimonials_wrapper',sec)||logos[0],1]].forEach(([el,i])=>{if(el)ST.create({trigger:el,start:'clamp(top 88%)',onEnter:()=>beat(i),onLeave:()=>beat(i)});});
}
function casesInit(){
const sec=$('.gfx-case-sec');if(!sec)return;
const content=$('.gfx-case-content',sec),tlBox=$('.gfx-case-tl',sec),rail=$('.gfx-case-rail',sec);
const head=$('.gfx-case-head .heading-2',sec);
gfx.room({trigger:head||sec,headline:head,body:$('.gfx-case-head .paragraph',sec),draws:rail&&rail.offsetWidth?[rail]:[]});
const chs=$$('.gfx-case-ch',sec);if(!chs.length)return;
chs.forEach(c=>c.classList.remove('gfx-on'));
const parts=chs.map(ch=>{
const p={ch,lines:[],meta:$$('.gfx-case-meta > *',ch),figs:$$('.gfx-case-fig-lead, .gfx-case-fig',ch),nums:$$('.gfx-case-num-lead, .gfx-case-num',ch),caps:$$('.gfx-case-cap',ch)};
const when=$('.gfx-case-when',ch);
if(when)W.SplitText.create(when,{type:'lines',mask:'lines',linesClass:'gfx-line',aria:'none',autoSplit:true,onSplit:self=>{p.lines=self.lines;gsap.set(self.lines,{yPercent:ch.classList.contains('gfx-on')?0:G.headline.yPercent});}});
return p;
});
const enter=(i,dir)=>{
dir=dir||1;
const p=parts[i],t=gsap.timeline();
p.ch.classList.add('gfx-on');
if(p.lines.length)t.fromTo(p.lines,{yPercent:G.headline.yPercent*dir},{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:G.SETTLE},0);
if(p.meta.length)t.fromTo(p.meta,{opacity:0,y:G.body.y*dir},{opacity:1,y:0,duration:G.body.duration,stagger:G.detail.stagger,ease:G.SETTLE},G.body.at);
if(p.figs.length)t.fromTo(p.figs,{'--r':0},{'--r':1,duration:G.hairline.duration,stagger:GROUP,ease:G.DRAW},G.hairline.at);
if(p.caps.length)t.fromTo(p.caps,{opacity:0,y:G.detail.y},{opacity:1,y:0,duration:G.detail.duration,stagger:G.detail.stagger,ease:G.SETTLE},G.detail.at);
p.nums.forEach((b,k)=>t.fromTo(b,{opacity:0,y:12},{opacity:1,y:0,duration:0.6,ease:'expo.out'},G.figure.at+k*GROUP));
if(p.figs.length)t.set(p.figs,{opacity:1,y:0},0);
return t;
};
const leave=(i,dir)=>{
dir=dir||1;
const p=parts[i],t=gsap.timeline({onComplete:()=>p.ch.classList.remove('gfx-on')});
if(p.lines.length)t.to(p.lines,{yPercent:-G.headline.yPercent*dir,duration:LEAVE.duration,stagger:G.detail.stagger,ease:LEAVE.ease},0);
const rest=p.meta.concat(p.figs);if(rest.length)t.to(rest,{opacity:0,y:-G.body.y*dir,duration:LEAVE.duration,stagger:0.02,ease:LEAVE.ease},0);
return t;
};
parts.forEach(p=>{if(p.lines.length)gsap.set(p.lines,{yPercent:105});gsap.set(p.meta.concat(p.nums),{opacity:0});gsap.set(p.figs,{'--r':0});gsap.set(p.caps,{opacity:0});});
const mm=gsap.matchMedia();
mm.add(PIN,()=>{
const arrow=$('.gfx-rail-arrow',rail),stops=['a','b','c'].map(k=>$('.gfx-case-stop-'+k,rail)).filter(Boolean);
const svg=$('.gfx-climb-svg',rail),cTrack=$('.gfx-climb-track',rail),cRect=$('#gfxc-rect',rail)||$('clipPath rect',rail);
if(!content||!tlBox||!rail||!svg||!cTrack||!cRect||stops.length<3){enter(0).progress(1);return undefined;}
H.classList.add('gfx-pinned');
if(arrow&&W.gfArrow&&!arrow.hasAttribute('data-gfa-sum')){arrow.setAttribute('data-gfa-sum','');arrow.innerHTML='';const a=38.2*Math.PI / 180;W.gfArrow.head(arrow,14,6,Math.cos(a),-Math.sin(a),{len:12,w:W.gfArrow.CHART,at:1});}
let cur=-1,run=null;
const go=i=>{
if(i===cur)return;
const dir=i>cur?1:-1;
if(run)run.progress(1);
const t=gsap.timeline();
if(cur>=0)t.add(leave(cur,dir),0);
t.add(enter(i,dir),cur>=0?LEAVE.duration*0.6:0);
gfx.fitFilm(t,1.2);
run=t;cur=i;
stops.forEach((s,k)=>{s.classList.toggle('gfx-passed',k<=i);if(k===i)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');});
};
const CLIMB=1.7,PICK=0.92,FILM=0.874;
const HC=()=>{
let low=0;const t0=tlBox.getBoundingClientRect().top;
$$('.gfx-case-cap, .gfx-case-meta > *',chs[2]||tlBox).forEach(s=>{const q=s.getBoundingClientRect();if(q.height)low=Math.max(low,q.bottom-t0);});
const run=Math.max(0,Math.min(low||W.innerHeight*0.85,W.innerHeight)-74),before=(1-PICK)*CLIMB*W.innerHeight;
return Math.min(2.0,CLIMB+Math.max(0.3,(gfx.READ.v*(FILM+gfx.READ.rest)*1.3-run-before) / W.innerHeight));
};
let hc=HC(),HOLD=CLIMB / hc;
const setHold=()=>{hc=HC();HOLD=CLIMB / hc;H.style.setProperty('--gfx-hold-cases',hc.toFixed(4));};
setHold();ST.addEventListener('refreshInit',setHold);
const camps=[0,0.5,1];
let cF=0,midX=0;
const ridge=()=>{
const Wr=rail.offsetWidth,Hr=rail.offsetHeight,top=14,bot=Hr-10,span=bot-top;
const lastV=0.86,x1=Wr-span*(1-lastV) / TAN;
const pts=[[0,0],[0.15,0.12],[0.23,0.145],[0.42,0.37],[0.5,0.40],[0.72,0.66],[0.8,0.69],[1,lastV]].map(([u,v])=>[u*x1,bot-v*span]).concat([[Wr,top]]);
const d='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
svg.setAttribute('viewBox',`0 0 ${Wr} ${Hr}`);
$$('.gfx-climb-track, .gfx-climb-fill',rail).forEach(p=>p.setAttribute('d',d));
$$('.gfx-climb-massif, .gfx-climb-climbed',rail).forEach(p=>p.setAttribute('d',`${d} L${Wr} ${Hr} L0 ${Hr} Z`));
const mr=$('mask rect',svg);if(mr){mr.setAttribute('width',Wr);mr.setAttribute('height',Hr);}
cRect.setAttribute('height',Hr+40);
midX=pts[4][0];
};
const cPt=t=>{const p=cTrack.getPointAtLength(t*cTrack.getTotalLength());return{x:p.x,y:p.y};};
const snapMid=()=>{const L=cTrack.getTotalLength();let dd=Infinity;for(let i=0;i<=800;i++){const t=i / 800,e=Math.abs(cTrack.getPointAtLength(t*L).x-midX);if(e<dd){dd=e;camps[1]=t;}}};
const leaders=stops.map(s=>$(':scope > [class*="gfx-case-leader"]',s)),labels=stops.map(s=>$(':scope > [class*="gfx-case-lbl-"]',s));
gsap.set(leaders.filter(Boolean),{transformOrigin:'50% 100%'});
const campReveal=(k,f)=>{
const s=camps[k],win=k===0?0.07:0.16;
const a=k===0?Math.min(1,f / win):clamp((f-(s-win)) / win,0,1);
const grow=gsap.parseEase('power2.out')(clamp(a / 0.7,0,1)),text=gsap.parseEase('power3.out')(clamp((a-0.3) / 0.7,0,1));
if(leaders[k])gsap.set(leaders[k],{scaleY:grow,autoAlpha:grow>0?1:0});
if(labels[k])gsap.set(labels[k],{y:(1-grow)*60+(1-text)*10,autoAlpha:text});
};
const drawClimb=f=>{
cF=f;const p=cPt(f);
if(arrow){arrow.style.left=p.x+'px';arrow.style.top=p.y+'px';arrow.classList.toggle('gfx-summit',f>=0.97);}
cRect.setAttribute('width',f>=1?rail.offsetWidth+30:p.x+10);
camps.forEach((_,k)=>campReveal(k,f));
stops.forEach((s,k)=>s.classList.toggle('gfx-dot-on',f>=camps[k]-0.015));
};
const placeClimb=()=>safe('climb',()=>{ridge();snapMid();camps.forEach((t,k)=>{const p=cPt(t);stops[k].style.left=p.x+'px';stops[k].style.top=p.y+'px';});drawClimb(cF);});
placeClimb();ST.addEventListener('refresh',placeClimb);
const flowF={f:0};
const st=ST.create({trigger:content,start:'top top',end:()=>'+='+W.innerHeight*hc,invalidateOnRefresh:true,
onUpdate:self=>{const f=Math.min(1,self.progress / HOLD);gsap.to(flowF,{f,duration:0.6,ease:'power3.out',overwrite:true,onUpdate:()=>drawClimb(flowF.f)});go(f>=PICK?2:f>=camps[1]?1:0);}});
ST.create({trigger:content,start:'top '+gfx.READ.approach*100+'%',end:'top top',onEnter:()=>{if(cur<0)go(0);}});
tlBox.setAttribute('data-gfx-held','');
const offs=stops.map((s,k)=>{
const lt=$('.gfx-case-lbl-t',s);s.setAttribute('role','button');s.tabIndex=-1;if(lt)s.setAttribute('aria-label',lt.textContent.trim());
const click=()=>gfx.scrollToY(st.start+(k===0?0.004:k===1?camps[1]+0.02:1)*HOLD*(st.end-st.start),1.6);
s.addEventListener('click',click);return()=>s.removeEventListener('click',click);
});
return()=>{
if(run)run.kill();chs.forEach(c=>c.classList.remove('gfx-on'));st.kill();offs.forEach(f=>f());
ST.removeEventListener('refresh',placeClimb);ST.removeEventListener('refreshInit',setHold);tlBox.removeAttribute('data-gfx-held');H.classList.remove('gfx-pinned');
stops.forEach(s=>{s.style.left='';s.style.top='';s.classList.remove('gfx-passed','gfx-dot-on');});
if(arrow){arrow.style.left='';arrow.style.top='';}
gsap.set(leaders.concat(labels).filter(Boolean),{clearProps:'all'});
};
});
mm.add(UNPIN,()=>{parts.forEach((p,i)=>ST.create({trigger:p.ch,start:'top 88%',onEnter:()=>enter(i),onLeave:()=>enter(i).progress(1)}));return undefined;});
}
function marketInit(){
const sec=MK.sec;if(!sec)return;
const stage=MK.stage,cv=$('.gfx-mk-threads',stage),ctx=cv.getContext('2d'),portal=$('.gfx-mk-portal',sec),portalIn=$('.gfx-mk-portal-in',sec);
let isPhone=W.innerWidth<=767;W.addEventListener('resize',()=>{isPhone=W.innerWidth<=767;});
const phone=()=>isPhone;
const ink=a=>`rgba(244, 243, 240, ${a})`,GREEN='#3aa678';
let seed=92631;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1) / 2147483646;};
const mk=n=>Array.from({length:n},(_,i)=>{const pri=rnd()<100 / 226;return{y0:(i+rnd()*0.9) / n,amp:0.008+rnd()*0.022,f:0.5+rnd()*1.3,ph:rnd()*Math.PI*2,pri,lane:pri?4+Math.floor(rnd()*4):(rnd()<0.5?Math.floor(rnd()*4):8+Math.floor(rnd()*4))};});
let TH=[];const build=()=>{seed=92631;TH=mk(phone()?30:110);};build();
let Wd=0,Hd=0,DPR=1,P=0,E=0,gInk=null,gGreen=null,dirty=true;
const size=()=>{
Wd=stage.clientWidth;Hd=stage.clientHeight;DPR=Math.min(phone()?1.25:2,W.devicePixelRatio||1);
cv.width=Math.round(Wd*DPR);cv.height=Math.round(Hd*DPR);cv.style.width=Wd+'px';cv.style.height=Hd+'px';
ctx.setTransform(DPR,0,0,DPR,0,0);
const x0=Wd*0.28,x1=Wd*0.5;
const g=c=>{const gr=ctx.createLinearGradient(x0,0,x1+1,0);gr.addColorStop(0,c.replace('A','0'));gr.addColorStop(1,c.replace('A','1'));return gr;};
gInk=phone()?ink(1):g('rgba(244, 243, 240, A)');gGreen=phone()?GREEN:g('rgba(58, 166, 120, A)');
dirty=true;
};
const fieldR=()=>phone()?{x0:-8,x1:Wd+8,top:Hd*0.36,bot:Hd*0.6}:{x0:-Wd*0.04,x1:Wd*1.02,top:Hd*0.14,bot:Hd*0.9};
const PORTAL_U=()=>(phone()?1.02:0.575);
const GATES=[0.6,0.71,0.82];
const gateIn=()=>ss(seg(P,0.2,0.28)),gateReach=i=>ss(seg(P,0.25+i*0.045,0.31+i*0.045));
let X=0;
const drawStage=()=>{
dirty=false;ctx.clearRect(0,0,Wd,Hd);
const F=fieldR(),fh=F.bot-F.top,yc=phone()?F.top+fh*0.5:Hd*0.5;
const a=ss(seg(P,0.0,0.16)),b=ss(seg(P,0.22,0.36)),c=ss(seg(P,0.42,0.57)),d=ss(seg(P,0.6,0.78));
const birthK=eo(clamp(E*1.25,0,1));
const uEnd=lerp(lerp(1,PORTAL_U(),d),1,ss(X))*birthK,SEG=phone()?14:28;
const laneY=k=>yc+(k-5.5)*fh*0.052*(1-d*0.85);
if(!phone()){
const gIn=gateIn(),gA=gIn*(1-c*0.85);
if(gA>0.01)GATES.forEach((g,i)=>{const r=gateReach(i),x=F.x0+(F.x1-F.x0)*g,y1=F.top+fh*gIn;ctx.lineWidth=1;
if(r<0.99){ctx.globalAlpha=gA*0.45*(1-r);ctx.strokeStyle=ink(0.4);ctx.beginPath();ctx.moveTo(x,F.top);ctx.lineTo(x,y1);ctx.stroke();}
if(r>0.01){ctx.globalAlpha=gA*0.8*r;ctx.strokeStyle='#2f9a6c';ctx.beginPath();ctx.moveTo(x,F.top);ctx.lineTo(x,y1);ctx.stroke();}});
}
const y=(t,u)=>{
let amp=t.amp*fh*(1-c*0.7)*(1-d);
if(b>0)for(const g of GATES)if(u>g)amp*=1-0.28*b;
const wave=Math.sin(t.ph+u*t.f*6.283)*amp,spread=F.top+t.y0*fh,funnel=ss(clamp((u-0.25) / 0.75,0,1));
const sorted=laneY(t.lane)+(t.y0-0.5)*fh*0.04;
let tgt=lerp(lerp(spread,yc+(t.y0-0.5)*fh*0.62,a*0.35),sorted,c);
if(t.pri)tgt=lerp(tgt,yc,d);
return lerp(spread,tgt,funnel*Math.max(a*0.35,c,d))+wave;
};
const group=(list,style,alpha,width)=>{
if(alpha<0.005||!list.length)return;
ctx.globalAlpha=alpha;ctx.strokeStyle=style;ctx.lineWidth=width;ctx.beginPath();
for(const t of list){const u1=t.pri?uEnd:uEnd*(1-d*0.25);for(let s=0;s<=SEG;s++){const u=(s / SEG)*u1,x=F.x0+(F.x1-F.x0)*u;if(s)ctx.lineTo(x,y(t,u));else ctx.moveTo(x,y(t,u));}}
ctx.stroke();
};
const np=TH.filter(t=>!t.pri),pr=TH.filter(t=>t.pri);
group(np,gInk,0.2*birthK*(1-c*0.62)*(1-d*0.9),1);
group(pr,gInk,0.2*birthK*(1-c),1);
group(pr,gGreen,birthK*lerp(0,0.6,c)*(1-d*0.35),lerp(1,1.25,c));
if(d>0.01){ctx.globalAlpha=d;ctx.strokeStyle=gGreen;ctx.lineWidth=1.75;ctx.beginPath();ctx.moveTo(F.x0+(F.x1-F.x0)*0.3,yc);ctx.lineTo(F.x0+(F.x1-F.x0)*uEnd,yc);ctx.stroke();}
ctx.globalAlpha=1;
};
const odoSet=(el,v)=>{
if(!el)return;
if(!el._reels){el._reels=$$('.gfx-mk-r',el);el._kids=[...el.querySelectorAll('.gfx-mk-reels > *')];el._about=$('.gfx-mk-about',el);}
const ds=el._reels,n=ds.length;
for(let i=0;i<n;i++){const k=n-1-i,p=Math.pow(10,k),base=Math.floor(v / p)%10,frac=(v%p) / p;const r=base+(k===0?(v%1):ss(clamp((frac-0.9) / 0.1,0,1)));const tr=`translate3d(0, ${(-r / 11)*100}%, 0)`;if(ds[i]._t!==tr){ds[i].style.transform=tr;ds[i]._t=tr;}}
let di=n;
for(const c of el._kids){const isC=c.classList.contains('gfx-mk-c');if(!isC)di--;const place=Math.pow(10,di),op=di===0?'1':ss(clamp((v-place*0.6) / (place*0.4),0,1)).toFixed(3);if(c._o!==op){c.style.opacity=op;c._o=op;}}
if(el._about){const op=el._kids[0]._o;if(el._about._o!==op){el._about.style.opacity=op;el._about._o=op;}}
};
const nA=$('.gfx-mk-num-a',sec),nC=$('.gfx-mk-num-c',sec),oA=$('.gfx-mk-num-a .gfx-mk-odo',sec),oC=$('.gfx-mk-num-c .gfx-mk-odo',sec);
const capList=['.gfx-mk-cap-a','.gfx-mk-cap-b','.gfx-mk-cap-c','.gfx-mk-cap-d'].map(s=>$(s,sec));
const ixs=$$('.gfx-mk-ix',sec);ixs.forEach(li=>{li._bar=$('.gfx-mk-ix-fill',li);});
const hls=$$('.gfx-mk-hlt',sec),lede=$('.gfx-mk-lede',sec),gatesBox=$('.gfx-mk-gates',sec),gates=$$('.gfx-mk-gate',sec),steps=$('.gfx-mk-steps',sec);
let demo=null,demoWant=null;
const ensureDemo=()=>{if(demo||!portalIn)return;demo='loading';loadPortal().then(ok=>{if(!ok)return;demo=W.GFPortalDemo.mount(portalIn,{theme:'dark',autoplay:false,loop:false,reducedMotion:REDUCE,frame:true,fit:'fill',label:'A client’s pipeline in the Grey Fox portal: the handoff stage, with one company’s note open. Illustrative companies and notes.'});if(demoWant)demo[demoWant]();});};
const demoDo=k=>{demoWant=k;if(demo&&demo!=='loading')demo[k]();};
const STEP_AT=[0.22,0.42,0.6],WIN=[[0,0.22],[0.22,0.42],[0.42,0.6],[0.6,1]];
const stepOf=p=>(p<STEP_AT[0]?0:p<STEP_AT[1]?1:p<STEP_AT[2]?2:3);
let arrived=false,step=-1,led=false;const cntA={v:0},portalK={k:0};
const setPortal=k=>{if(!portal)return;portal.style.clipPath=`inset(0% ${((1-k)*100).toFixed(2)}% 0% 0%)`;portal.firstElementChild.style.transform=`scale(${(1.04-0.04*k).toFixed(4)})`;portal.style.visibility=k>0.001?'visible':'hidden';};
const tw=(target,vars)=>gsap.to(target,Object.assign({overwrite:true},vars));
const fadeTo=(el,o,dur,delay,dy)=>{if(!el)return;dy=dy==null?12:dy;gsap.to(el,{opacity:o,y:o?0:-dy*0.5,duration:dur,delay:delay||0,ease:o?'expo.out':'power2.in',overwrite:true});};
const enterStep=(s,from)=>{
capList.forEach((c,i)=>{if(i===s)fadeTo(c,1,0.5,from>=0?0.18:0.35);else if(i===from||(c&&c.style.opacity!=='0'))fadeTo(c,0,0.3);});
ixs.forEach((li,i)=>li.classList.toggle('gfx-on',i===s));
if(gatesBox)gatesBox.classList.toggle('gfx-on',s===1);
if(s>=2&&from<2){odoSet(oC,100);fadeTo(nA,0,0.3);fadeTo(nC,1,0.6,0.15);}
if(s<2&&from>=2){fadeTo(nC,0,0.35);fadeTo(nA,1,0.6,0.2);odoSet(oA,92631);}
if(phone()&&nC){if(s===3)fadeTo(nC,0,0.4);else if(s===2&&from===3)fadeTo(nC,1,0.5);}
if(s===3&&from<3){ensureDemo();if(phone()){tw(portalK,{k:1,duration:1.0,ease:'power3.inOut',onUpdate:()=>setPortal(portalK.k)});demoDo('play');}}
if(s<3&&from===3&&phone())tw(portalK,{k:0,duration:0.5,ease:'power2.in',onUpdate:()=>setPortal(portalK.k)});
};
const lead=on=>{
led=on;
if(on){gsap.fromTo(hls,{yPercent:105,y:0},{yPercent:0,duration:1.2,ease:'expo.out',stagger:0.12,overwrite:true});fadeTo(lede,1,0.9,0.3);}
else{gsap.to(hls,{yPercent:105,duration:0.4,ease:'power2.in',overwrite:true});fadeTo(lede,0,0.3);}
};
const arrive=on=>{
arrived=on;
if(on){
if(step<2){fadeTo(nA,1,0.7,0.2);cntA.v=50000;tw(cntA,{v:92631,duration:0.7,delay:0.1,ease:'expo.out',onUpdate:()=>odoSet(oA,Math.round(cntA.v))});}
if(steps)steps.classList.add('gfx-in');ensureDemo();
}else{
fadeTo(nA,0,0.3);fadeTo(nC,0,0.3);capList.forEach(c=>fadeTo(c,0,0.3));
if(steps)steps.classList.remove('gfx-in');if(gatesBox)gatesBox.classList.remove('gfx-on');
ixs.forEach(li=>li.classList.remove('gfx-on'));step=-1;
}
};
const words=()=>{
if(!led&&E>0.35)lead(true);else if(led&&E<0.25)lead(false);
if(!arrived&&E>0.84)arrive(true);else if(arrived&&E<0.74)arrive(false);
if(arrived){const s=stepOf(P);if(s!==step){const from=step;step=s;enterStep(s,from);}}
ixs.forEach((li,i)=>{const f=`scaleX(${clamp(seg(P,WIN[i][0],WIN[i][1]-0.01),0,1).toFixed(4)})`;if(li._f!==f&&li._bar){li._bar.style.transform=f;li._f=f;}});
gates.forEach((g,i)=>{const r=gateReach(i).toFixed(3);if(g._g!==r){g.style.setProperty('--g',r);g._g=r;}});
if(!phone()&&portal){
const k=arrived?ss(seg(P,0.6,0.76)):0,o=(1-eo(X)).toFixed(3);
if(portalK.k!==k){portalK.k=k;setPortal(k);}if(portal._o!==o){portal.style.opacity=o;portal._o=o;}
if(k>0.5&&!portalK.played){portalK.played=true;demoDo('play');}else if(k===0)portalK.played=false;
}
};
hls.forEach(h=>{h.style.transform='translate3d(0, 105%, 0)';});
[lede,nA,nC].concat(capList).forEach(e=>{if(e)e.style.opacity='0';});
setPortal(0);odoSet(oC,100);
let raf=0,stageOn=false;
const tick=()=>{raf=0;if(dirty&&stageOn)drawStage();};
const wake=()=>{if(!raf)raf=requestAnimationFrame(tick);};
size();
ST.create({trigger:sec,start:'top bottom',end:'top top',onUpdate:s=>{E=s.progress;dirty=true;words();wake();},onRefresh:s=>{E=s.progress;}});
ST.create({trigger:sec,start:'top top',end:'bottom bottom',onUpdate:s=>{P=s.progress;dirty=true;words();wake();},onRefresh:s=>{P=s.progress;}});
ST.create({trigger:sec,start:'top bottom',end:'bottom top',onToggle:s=>{stageOn=s.isActive;if(stageOn){dirty=true;wake();}}});
ST.addEventListener('refresh',()=>{size();words();dirty=true;wake();});
W.addEventListener('resize',build);
const rd=()=>{dirty=true;wake();};
if(!phone())ST.create({trigger:sec,start:'bottom bottom',end:'bottom 55%',onUpdate:s=>{X=s.progress;dirty=true;words();wake();},onRefresh:s=>{X=s.progress;}});
else ST.create({trigger:sec,start:'bottom 95%',onEnter:()=>gsap.to(portal,{opacity:0,duration:0.45,ease:'power2.in',overwrite:'auto',onUpdate:rd,onComplete:rd}),
onLeaveBack:()=>gsap.to(portal,{opacity:1,duration:0.6,ease:'expo.out',overwrite:'auto',onUpdate:rd,onComplete:rd})});
words();wake();
if(phone()&&portal&&'IntersectionObserver'in W)safe('mk phone',()=>{
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){ensureDemo();demoDo('play');io.disconnect();}}),{threshold:0.35});
io.observe(portal);
});
W.gfxMarket={state:()=>({P,E,step}),redraw:rd};
}
function marketStill(){
const sec=MK.sec;if(!sec)return;
H.classList.add('gfx-mk-still');
$$('.gfx-mk-ix',sec).forEach(li=>li.classList.add('gfx-on'));$$('.gfx-mk-gate',sec).forEach(g=>g.style.setProperty('--g','1'));
const portalIn=$('.gfx-mk-portal-in',sec);
if(portalIn)loadPortal().then(ok=>{if(ok){const d=W.GFPortalDemo.mount(portalIn,{theme:'dark',autoplay:false,loop:false,reducedMotion:true,label:'A client’s pipeline in the Grey Fox portal. Illustrative companies and notes.'});d.settle();}});
}
let portalP=null;
function loadPortal(){
if(portalP)return portalP;
portalP=new Promise(res=>{
if(W.GFPortalDemo)return res(true);
const base=(W.GFX_PORTAL_BASE||gfx.BASE+'portal/');
const l=D.createElement('link');l.rel='stylesheet';l.href=base+'desktop-portal.css';D.head.appendChild(l);
const s=D.createElement('script');s.src=base+'desktop-portal.js';s.async=true;s.onload=()=>res(!!W.GFPortalDemo);s.onerror=()=>res(false);D.head.appendChild(s);
});
return portalP;
}
function teamInit(){
const sec=$('.gfx-team-sec');if(!sec)return;
const head=$('.gfx-team-head .heading-2',sec);
gfx.room({trigger:head||sec,headline:head,body:$('.gfx-team-head .gfx-lead, .gfx-team-head .paragraph',sec),hairline:$('.gfx-team-hr',sec)});
const imgs=$$('.gfx-team-img',sec),members=$$('.gfx-team-m',sec),stacked=W.innerWidth<768;
const byRow=ms=>{const rows=[];ms.forEach(m=>{const t=m.getBoundingClientRect().top+W.scrollY,r=rows.find(x=>Math.abs(x.t-t)<8);if(r)r.ms.push(m);else rows.push({t,ms:[m]});});return rows.map(x=>x.ms);};
(stacked?byRow(members):[members]).forEach(group=>{
if(!group.length)return;
const pick=sel=>group.reduce((a,m)=>a.concat($$(sel,m)),[]);
const bl=pick('.gfx-team-pic .reveal_block');
gfx.room({trigger:stacked?group[0]:($('.gfx-team-grid',sec)||group[0]),start:stacked?'top 88%':'top 85%',detail:pick('.team_member_description'),group:true,extraPicture:true,arriving:sec,
extra:(tl,at)=>{if(bl.length)tl.to(bl,{scaleY:0,transformOrigin:'50% 0%',duration:G.picture.duration,stagger:GROUP,ease:G.DRAW},at('picture'));}});
});
imgs.forEach(img=>{
if(img.srcset)img.sizes='(max-width: 767px) 86vw, 31vw';
let last='';img.style.scale='1.06';
ST.create({trigger:img.closest('.gfx-team-pic')||img,start:'top bottom',end:'top 35%',onUpdate:s=>{const v=(1.06-0.06*eo(s.progress)).toFixed(4);if(v!==last){img.style.scale=v;last=v;}}});
});
}
let grownMark=null;
function grownInit(){
const g=$('.gfx-grown');if(!g)return;
const rule=$('.gfx-grown-rule',g),t=$('.gfx-grown-t',g),p=$('.gfx-grown-p',g),em=$('.gfx-grown-em',g);
arrowReady(A=>{if(em&&!grownMark)grownMark=A.word({el:em,key:true,host:t||em,head:false,cls:'gfx-grown-mark',auto:false});});
let lr='',lt='';
const show=(el,k,dy)=>{if(!el)return;const o=k.toFixed(3),tr=`translate3d(0, ${((1-k)*dy).toFixed(2)}px, 0)`;if(el._o!==o){el.style.opacity=o;el._o=o;}if(el._tr!==tr){el.style.transform=tr;el._tr=tr;}};
const set=k=>{
const r=`scaleX(${eo(clamp(k*1.5,0,1)).toFixed(4)})`;if(r!==lr&&rule){rule.style.transform=r;lr=r;}
const y=`translate3d(0, ${((1-eo(clamp(k*1.6-0.15,0,1)))*105).toFixed(2)}%, 0)`;if(y!==lt&&t){t.style.transform=y;lt=y;}
if(p)show(p,eo(clamp(k*1.6-0.4,0,1)),14);
if(grownMark&&k*1.6-0.75>0)grownMark.draw(0);
};
set(0);
ST.create({trigger:g,start:'top 92%',end:'top 40%',onUpdate:s=>set(s.progress),onRefresh:s=>set(s.progress)});
}
const ARW=()=>(W.gfArrow?W.gfArrow.icon('gfx-arw'):'');
function insightsInit(){
const sec=$('.gfx-ins-sec');if(!sec)return;
let n=0;
$$('.gfx-ink-lead, .gfx-ink-card').forEach(a=>{const t=$('h3',a),d=$('.gfx-ink-p, .gfx-ink-sum',a);if(!t)return;t.id=t.id||'gfx-ink-t-'+(++n);a.setAttribute('aria-labelledby',t.id);if(d){d.id=d.id||'gfx-ink-d-'+n;a.setAttribute('aria-describedby',d.id);}});
$$('.gfx-ink-all').forEach(g=>{if(!g.querySelector('svg'))g.insertAdjacentHTML('beforeend',ARW());});
$$('svg[viewBox="0 0 1200 800"] path',sec).forEach(p=>{const d=(p.getAttribute('d')||'').trim();if(/^M[\d.]+ [\d.]+H[\d.]+V[\d.]+$/.test(d)|| /^M708 390L718 400L708 410$/.test(d))p.remove();});
const box=$('.gfx-ink',sec),head=$('.gfx-ins-title .heading-2',sec);
gfx.room({trigger:head||sec,headline:head,body:$('.gfx-ink-r',sec),hairline:$('.gfx-ins-rule',sec)});
if(!box)return;
const cover=$$('.gfx-ins-pic-lead .gfx-ins-cvsvg',box),leadWords=$$('.gfx-ink-lead > *',box);
const top=$('.gfx-ink-top',box);
if(top)gfx.room({trigger:top,start:'top 80%',pictures:cover,detail:leadWords,arriving:box});
const three=$('.gfx-ink-three',box);
if(three)gfx.room({trigger:three,start:'top 88%',hairline:$('.gfx-ink-rule',box),detail:$$('.gfx-ink-card',box),group:true});
}
let closeMark=null;
function closeInit(){
const sec=$('.gfx-cta-sec');if(!sec)return;
const head=$('.gfx-cta-title .heading-2',sec);
gfx.room({trigger:head||sec,headline:head,body:$('.gfx-cta-title .button_wrapper',sec),hairline:$('.gfx-cta-rule',sec),detail:$$('.gfx-door',sec),group:true});
$$('.divider',sec).forEach(d=>{
const t=gsap.fromTo(d,{scaleX:0,transformOrigin:'0% 50%'},{scaleX:1,duration:G.hairline.duration,ease:G.DRAW,paused:true});
ST.create({trigger:d,start:'clamp(top bottom)',end:'max',onEnter:()=>t.play()});
ST.create({trigger:d,start:'top bottom+=50%',onLeaveBack:()=>t.pause(0)});
});
}
function closeMarkInit(still){
const cta=$('.gfx-cta-sec'),head=cta&&$('.gfx-cta-title .heading-2',cta),box=cta&&$('.gfx-cta-title',cta);
if(!cta||!head||!box||!W.gfArrow)return;
const mark=W.gfArrow.word({el:head,key: /human/.test(head.textContent)?'human':null,host:box,cls:'gfx-close-mark',auto:false});
if(!mark)return;
closeMark=mark;
if(still){mark.still();return;}
ST.create({trigger:box,start:'top 72%',once:true,onEnter:()=>mark.draw(0.35)});
let near=false,rq=0;
const seenFa=fa=>{const b=fa.getBoundingClientRect();if(!(b.width>0&&b.top<W.innerHeight&&b.bottom>0))return false;const x=Math.min(W.innerWidth-1,Math.max(0,b.left+b.width / 2)),y=Math.min(W.innerHeight-1,Math.max(0,b.top+b.height / 2)),e=D.elementFromPoint(x,y);return!!(e&&e.closest('.footer_section_wrapper'));};
const check=()=>{rq=0;const fa=$('.gfx-fi-act');if(!fa)return;const cr=cta.getBoundingClientRect(),shownK=Math.max(0,Math.min(cr.bottom,W.innerHeight)-Math.max(cr.top,0)) / (cr.height||1);const on=near&&shownK<=0.4&&seenFa(fa);mark.svg.classList.toggle('gfx-cm-off',on);cta.classList.toggle('gfx-cta-rest',on);};
const ask=()=>{if(near&&!rq)rq=requestAnimationFrame(check);};
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{near=e.isIntersecting;ask();})).observe(cta);
W.addEventListener('scroll',ask,{passive:true});W.addEventListener('resize',ask);
}
let covers=null,rootT=0;
const mirror=s=>{
(covers||(covers=$$('.gfx-team-sec .reveal_block'))).forEach(e=>e.style.setProperty('--gfx-field',s));
clearTimeout(rootT);rootT=setTimeout(()=>H.style.setProperty('--gfx-field',s),160);
$$('.footer_section_wrapper').forEach(f=>f.style.setProperty('background-color',s,'important'));
};
gfx.page({
field,
foot:{close:'.gfx-cta-sec'},
fox:'.gfx-cta-sec .footer-logo-subtle',
foxZone:[2,6,false],
dom:()=>{marketDom();safe('mirror',()=>gfx.onField(mirror));},
start:()=>{
gsap=gfx.gsap;ST=gfx.ST;
let intro=null;
safe('intro',()=>{intro=introInit();});
pauseControl();
safe('hero',()=>heroInit(intro));
safe('marquee',marqueeInit);
safe('slide',()=>slide($('.gfx-hero-sec'),$('.gfx-std-sec'),0.32));
},
rooms:()=>{[standardInit,casesInit,teamInit,insightsInit,closeInit].forEach(f=>safe(f.name,f));},
late:()=>{[marketInit,grownInit,()=>closeMarkInit(false)].forEach(f=>safe(f.name||'late',f));},
still:()=>{
gsap=W.gsap||null;ST=W.ScrollTrigger||null;
$$('.gfx-case-ch').forEach(c=>c.classList.add('gfx-on'));
safe('market still',marketStill);
if(W.gfArrow){
birth=birthBuild();if(birth)birth.still();
const em=$('.gfx-grown-em');if(em){const w=W.gfArrow.word({el:em,key:true,host:$('.gfx-grown-t')||em,head:false,cls:'gfx-grown-mark',auto:false});if(w)w.still();}
closeMarkInit(true);
$$('.gfx-ink-all').forEach(g=>{if(!g.querySelector('svg'))g.insertAdjacentHTML('beforeend',ARW());});
}
}
});
})();
