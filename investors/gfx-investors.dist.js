/*! Grey Fox · Investors v2 (Flow 3) · core 1.0.27 + investors 1.0.11 · minified bundle of core/gfx-core.js + investors/gfx-investors.js (read those for the notes) */
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
const VERSION='1.0.27';
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
const plainHamburger=()=>safe('hamburger selectors',()=>{
D.querySelectorAll('style').forEach(st=>{
const t=st.textContent;if(t.indexOf('hamburger_')<0||t.indexOf('[class')<0)return;
const nt=t.replace(/\[class\^="(hamburger_[\w-]+)"\]|\[class\*=" (hamburger_[\w-]+)"\]/g,(m,a,b)=>'.'+(a||b));
if(nt!==t)st.textContent=nt;
});
});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',plainHamburger,{once:true});else plainHamburger();
const failsafe=()=>{
if(H.classList.contains('gfx-ready'))return;
H.classList.add('gfx-failsafe');H.classList.remove('gfx-intro');ix3Late();
safe('failsafe',()=>{const p=D.querySelector('.page-wrapper');p&&p.removeAttribute('inert');});
};
setTimeout(failsafe,6000);
const LENIS_OPTS={lerp:0.12,wheelMultiplier:0.95,smoothWheel:true};
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
const postFrame=(()=>{
const q=[];let mc=null,armed=false;
const flush=()=>{armed=false;const fs=q.splice(0);for(const f of fs){try{f();}catch(e){}}};
return f=>{q.push(f);if(armed)return;armed=true;
if(!mc&&W.MessageChannel){mc=new MessageChannel();mc.port1.onmessage=flush;}
requestAnimationFrame(()=>{if(mc)mc.port2.postMessage(0);else setTimeout(flush,0);});};
})();
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
var kept=null;
var rng=typeof o.range==='function'?o.range:function(){
if(fixed&&fixed.startContainer&&fixed.startContainer.isConnected)return fixed;
if(!o.el)return fixed;
if(kept&&kept.startContainer.isConnected&&kept.endContainer.isConnected)return kept;
return(kept=rangeOf(o.el,o.key));
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
var near=true,owed=false;
var rq0=0,re=function(){if(!near){owed=true;return;}if(!rq0){rq0=1;postFrame(function(){rq0=0;place();});}};
if('IntersectionObserver'in W)new IntersectionObserver(function(es){es.forEach(function(e){near=e.isIntersecting;if(near&&owed){owed=false;re();}if(near)zoneSoon();});},{rootMargin:'50% 0px'}).observe(host);
addEventListener('resize',function(){zoneZ=0;re();});D.addEventListener('gfx:resplit',function(){kept=null;re();});
if(W.ScrollTrigger)ScrollTrigger.addEventListener('refresh',re);
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(re);
if(o.el&&'MutationObserver'in W)new MutationObserver(function(){kept=null;re();}).observe(o.el,{childList:true,subtree:true,characterData:true});
if(o.el){o.el.addEventListener('transitionend',re);o.el.addEventListener('animationend',re);}
var zoneZ=0,zq=0,zoneOut=false,zone=function(){zq=0;if(!near)return;var r0=rng();if(!r0)return;var rs=r0.getClientRects();if(!rs.length)return;
var z=zoneZ||(zoneZ=parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--gf-zone'))||74),top=rs[rs.length-1].top;
var out=top<z-2;if(out!==zoneOut){zoneOut=out;svg.style.opacity=out?'0':'';}};
var zoneSoon=function(){if(!zq){zq=1;postFrame(zone);}};
addEventListener('scroll',function(){if(near)zoneSoon();},{passive:true});
if(W.lenis&&W.lenis.on)W.lenis.on('scroll',function(){if(near)zoneSoon();});
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
const inkKeep=()=>{
const m={};
if(!el.hasAttribute('data-gfx-ink')){const k=el.querySelector('.gfx-line[data-gfx-ink]');if(k)el.setAttribute('data-gfx-ink',k.getAttribute('data-gfx-ink'));}
el.querySelectorAll('[data-gfx-ink]:not(.gfx-line)').forEach(n=>{const key=n.tagName+'.'+n.className;if(!(key in m))m[key]=n.getAttribute('data-gfx-ink');});
return m;
};
const inkPut=m=>el.querySelectorAll('*').forEach(n=>{const v=m[n.tagName+'.'+n.className];if(v&&!n.hasAttribute('data-gfx-ink'))n.setAttribute('data-gfx-ink',v);});
let lastW=W.innerWidth,rt=0;
W.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>safe('resplit',()=>{
if(W.innerWidth===lastW)return;lastW=W.innerWidth;
const m=inkKeep();
if(!o.reverted)o.split.revert();
breakBalanced(el);
if(!o.reverted){o.split=W.SplitText.create(el,opts);if(o.played)gsap.set(o.lines,{yPercent:0});}
inkPut(m);
requestAnimationFrame(()=>D.dispatchEvent(new Event('gfx:resplit')));
}),160);});
o.revert=()=>{if(o.reverted)return;o.reverted=true;const m=inkKeep();o.split.revert();inkPut(m);};
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
if(fieldDef.phoneRhythm)H.classList.add('gfx-ph-rhythm');if(fieldDef.phoneRhythm===true)H.classList.add('gfx-tab-rhythm');
fieldRooms=(fieldDef.rooms||[]).map(o=>Object.assign({},o,{el:typeof o.el==='string'?$(o.el):o.el})).filter(o=>o.el);
fieldRooms.forEach((o,i)=>{
const r=o.el;r.classList.add('gfx-fr');r.setAttribute('data-gfx-native',o.native);
if(o.tier)r.setAttribute('data-gfx-tier',o.tier);
if(o.opaque)r.setAttribute('data-gfx-opaque','');
if(o.foot)r.setAttribute('data-gfx-foot','');if(i===fieldRooms.length-1)r.setAttribute('data-gfx-last','');
if(i&&o.tone!==fieldRooms[i-1].tone&&fieldRooms[i-1].native!=='M')r.setAttribute('data-gfx-turn','');
});
if('IntersectionObserver'in W){const tv=new IntersectionObserver(es=>es.forEach(e=>e.target.toggleAttribute('data-gfx-tv',e.isIntersecting)),{rootMargin:'25% 0px'});fieldRooms.forEach(o=>tv.observe(o.el));}
else fieldRooms.forEach(o=>o.el.setAttribute('data-gfx-tv',''));
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
const DECOR='[data-o~="ow-close-fox"], [data-o~="gfc-fox"], .gfc-fox, .gfx-ow-close-fox, .footer-logo-subtle, .gfx-dim';
const spans=()=>{
const all=fieldRooms.map(o=>[o.el].concat($$('*:not(svg *)',o.el)));
const st=[],clip=new Set();
all.forEach(list=>list.forEach(e=>{const cs=getComputedStyle(e);if(cs.position==='sticky')st.push(e);if(cs.overflowY!=='visible')clip.add(e);}));
const keep=st.map(e=>['position','top','bottom'].map(p=>[p,e.style.getPropertyValue(p),e.style.getPropertyPriority(p)]));
st.forEach(e=>{e.style.setProperty('position','relative','important');e.style.setProperty('top','auto','important');e.style.setProperty('bottom','auto','important');});STICKY=new Set(st);
const memo=new Map(),top0=el=>{if(!el)return 0;let v=memo.get(el);if(v==null){v=el.offsetTop+top0(el.offsetParent);memo.set(el,v);}return v;};
const drawn=!!(fieldDef&&fieldDef.drawnCovers)&&W.innerWidth<=991;
try{
return fieldRooms.map((o,k)=>{
const rm=o.el;let top=Infinity,bot=-Infinity;
all[k].forEach(e=>{
if(e===rm)return;
if(drawn&&e.tagName==='svg'&&!e.closest(SKIPSPAN)&&!e.closest(DECOR)){const r=e.getBoundingClientRect();if(r.width>=48&&r.height>=48){const t=r.top+(W.scrollY||0);top=Math.min(top,t);bot=Math.max(bot,t+r.height);}return;}
if(!(e.tagName==='IMG'||e.tagName==='VIDEO'||hasOwnText(e)))return;
if(!e.offsetParent||e.offsetWidth<3||e.offsetHeight<3||e.closest(SKIPSPAN))return;
let t=top0(e),b=t+e.offsetHeight;
for(let n=e.parentElement;n&&n!==rm;n=n.parentElement)if(clip.has(n)){const nt=top0(n);t=Math.max(t,nt);b=Math.min(b,nt+n.offsetHeight);break;}
if(b-t<2)return;
top=Math.min(top,t);bot=Math.max(bot,b+stickyShift(e,rm));
});
const rt=top0(rm),pad=parseFloat(getComputedStyle(rm).paddingTop)||0;
return{pad,inner:Number.isFinite(top)?top-(rt+pad):0,trail:Number.isFinite(bot)?Math.max(0,rt+rm.offsetHeight-bot):0,top,bot,rtop:rt,rbot:rt+rm.offsetHeight};
});
}finally{STICKY=new Set();st.forEach((e,i)=>keep[i].forEach(([p,v,pr])=>{if(v)e.style.setProperty(p,v,pr);else e.style.removeProperty(p);}));}
};
const spansLite=()=>{
const memo=new Map(),top0=el=>{if(!el)return 0;let v=memo.get(el);if(v==null){v=el.offsetTop+top0(el.offsetParent);memo.set(el,v);}return v;};
const seen=e=>!e.checkVisibility||e.checkVisibility({visibilityProperty:true});
const Y=W.scrollY||0,r0=e=>{const r=e.getBoundingClientRect();return{t:r.top+Y,b:r.bottom+Y,w:r.width,h:r.height};};
return fieldRooms.map(o=>{
const rm=o.el,c=$$('*',rm).filter(e=>!(e.ownerSVGElement)&&e.tagName!=='svg'&&hasOwnText(e)&&e.offsetParent&&e.offsetHeight>2&&e.offsetWidth>2&&!e.closest(SKIPSPAN)&&!e.closest(DECOR)&&seen(e));
const media=$$('svg, canvas, video, img, .gfx-mk-portal',rm).filter(e=>!(e.ownerSVGElement)&&!e.closest(SKIPSPAN)&&!e.closest(DECOR)&&seen(e)).map(e=>Object.assign(r0(e),{inLink:!!e.closest('a, button')})).filter(r=>r.w>8&&r.h>8&&!(r.inLink&&r.w<48&&r.h<48));
const rt=top0(rm),pad=parseFloat(getComputedStyle(rm).paddingTop)||0;
if(!c.length&&!media.length)return{pad,inner:0,trail:0,rtop:rt,rbot:rt+rm.offsetHeight};
const top=Math.min(...c.map(top0),...media.map(r=>r.t)),bot=Math.max(...c.map(e=>top0(e)+e.offsetHeight),...media.map(r=>r.b));
return{pad,inner:top-(rt+pad),trail:Math.max(0,rt+rm.offsetHeight-bot),top,bot,rtop:rt,rbot:rt+rm.offsetHeight};
});
};
const rhythm=()=>{
const T=TIERS(),S=lastSpans=W.innerWidth<=767?spansLite():spans();
let changed=false;
const ph=W.innerWidth<=767;
const auto=(o,i)=>fieldDef&&fieldDef.phoneRhythm&&i&&fieldRooms[i-1].native!=='M'?(o.tone!==fieldRooms[i-1].tone?'turn':'standard'):null;
const rh=ph||(!!fieldDef&&fieldDef.phoneRhythm===true&&W.innerWidth<=991);
const writes=fieldRooms.map((o,i)=>{
const turnHere=fieldDef&&fieldDef.phoneRhythm&&i&&fieldRooms[i-1].native!=='M'&&o.tone!==fieldRooms[i-1].tone;
const tier=rh?(o.tierPhone||(turnHere?'turn':o.tier||auto(o,i))):o.tier;
if(!tier){if(o._phPad){o.el.style.removeProperty('padding-top');o._phPad=false;S[i].pad=parseFloat(getComputedStyle(o.el).paddingTop)||0;}return null;}
if(tier!==o.tier)o._phPad=true;
const prevTrail=i&&fieldRooms[i-1].native!=='M'?S[i-1].trail+(rh?Math.max(0,(S[i].rtop||0)-(S[i-1].rbot||0)):0):0;
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
addEventListener('resize',e=>{if(e.target!==W)return;if(W.innerWidth===rw&&Math.abs(W.innerHeight-rh)<120&&TOUCH)return;holdPlace();rw=W.innerWidth;rh=W.innerHeight;clearTimeout(rt);rt=setTimeout(()=>{rhythm();ST.refresh();},220);},true);
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
let ran=0,tmo=0,poked=0;
const run=()=>{raf=0;ran=performance.now();const c=pick();if(c!==last){m.setAttribute('content',c);last=c;}};
const soon=()=>{if(raf||tmo)return;const wait=200-(performance.now()-ran);if(wait>0)tmo=setTimeout(()=>{tmo=0;raf=1;postFrame(run);},wait);else{raf=1;postFrame(run);}};
const poke=()=>{poked=performance.now();soon();};
addEventListener('scroll',poke,{passive:true});addEventListener('resize',poke);D.addEventListener('click',()=>{poked=performance.now();setTimeout(soon,350);},true);
setInterval(()=>{if(!D.hidden&&performance.now()-poked<2000)soon();},500);run();
}
function navInit(){
safe('menu foot',menuFoot);
safe('nav name',navName);
safe('top tint',topTint);
const bar=$('.gfx-nav');if(!bar)return;
if(!$('#gfx-bar-btn')){const st=D.createElement('style');st.id='gfx-bar-btn';st.textContent='html.gfx-f3 .gfx-nav:not(.gfx-top) .button_wrapper.show{display:block!important}'+
'html body :is(.gfx-cta-sec .footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox){height:min(64vh,744px)!important}'+
'html body :is(.gfx-cta-sec,[data-o~="ow-close"],.gfc-on):has(:is(.footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox)){overflow-y:clip!important}'+
'@media (max-width:767px){html.gfx-f3 .gfx-fi-rule{display:none!important}}'+
'html.gfx-f3 .gfx-nav:not(.gfx-top) :is(.navigation_items,.w-nav-menu,.button){-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'+
'@media (max-width:991px){html.gfx-f3 :is(h1,h2,h3,h4,[data-o~="gi-tile-t"],[data-o~="gi-sec-h"]){text-wrap:balance}}'+
'html.gfx-f3 :is([data-o~="gi-tile-t"],[data-o~="gi-card-t"],[data-o~="ow-acc-h"]){text-wrap:balance}'+
'@media (max-width:767px){html.gfx-f3 :is(.gfx-pg-tp-u,sup>a){position:relative}html.gfx-f3 :is(.gfx-pg-tp-u,sup>a)::after{content:"";position:absolute;inset:-9px -8px}}';(D.head||H).appendChild(st);}
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
const barHome=()=>{if(scrollNow()<W.innerHeight*0.5){navLook(true);upFrom=null;prevY=null;if(!showing)setShown(true);else{gsap.set(bar,{'--gfx-away':0});bar.classList.remove('gfx-away');H.classList.remove('gfx-bar-away');}}};
W.addEventListener('pageshow',()=>setTimeout(barHome,60));W.addEventListener('load',()=>setTimeout(barHome,300));setTimeout(barHome,1200);
}
function foxWatch(M){
M=M||[28,36,true];
const bar=$('.gfx-nav'),link=bar&&$('.logo-link',bar);if(!link)return;
const CHROME='.navigation_wrapper, .gfx-skip, .preloader, .gfx-ftg-fly, .gfx-fly';
let away=false,since=0,rq=0,last=-1,lastY=W.scrollY;
const shownEl=el=>{for(let n=el;n&&n!==D.body;n=n.parentElement){const cs=getComputedStyle(n);if(cs.visibility==='hidden'||+cs.opacity<0.05)return false;}return true;};
const hit=(q,z)=>q.right>z.left&&q.left<z.right&&q.bottom>z.top&&q.top<z.bottom;
const MEDIA= /^(IMG|VIDEO|CANVAS|svg)$/;
const ownText=el=>{for(let n=el.firstChild;n;n=n.nextSibling)if(n.nodeType===3&& /\S/.test(n.data))return true;return false;};
const outerSvg=e=>{while(e&&e.ownerSVGElement)e=e.ownerSVGElement;return e;};
const wants=el=>MEDIA.test(el.tagName)?!(el.tagName==='svg'&&el.ownerSVGElement):ownText(el);
const CAND=new Set(),ALL=[],seenEl=new WeakSet();let io=null,ioZ=0;
const watchEl=el=>{if(seenEl.has(el)||!wants(el))return;seenEl.add(el);ALL.push(el);if(io)io.observe(el);};
const pend=[];let pendT=0;
const drain=dl=>{const t0=performance.now();while(pend.length&&(dl&&dl.timeRemaining?dl.timeRemaining()>2:performance.now()-t0<6)){const n=pend.pop();if(!n||n.nodeType!==1||!n.isConnected||n.matches(CHROME)|| /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|IFRAME)$/.test(n.tagName))continue;watchEl(n);if(n.tagName!=='svg')for(let c=n.lastElementChild;c;c=c.previousElementSibling)pend.push(c);}pendT=pend.length?later(drain):0;};
const later=f=>W.requestIdleCallback?W.requestIdleCallback(f,{timeout:400}):setTimeout(f,60);
const queue=n=>{if(!n||n.nodeType!==1||(n!==D.body&&n.closest(CHROME)))return;pend.push(n);if(!pendT)pendT=later(drain);};
const zoneIO=()=>{
if(!('IntersectionObserver'in W))return;
const im=$$('img',link).filter(i=>i.offsetWidth)[0]||link,r=im.getBoundingClientRect(),vw=W.innerWidth,vh=W.innerHeight;
const Z=Math.max(M[1],M[0]+(M[2]?180:48))+2,t=Math.max(0,r.top-Z),l=Math.max(0,r.left-Z),b=Math.min(vh,r.bottom+Z),rt=Math.min(vw,r.right+Z);
const key=[t,l,b,rt].map(Math.round).join();if(io&&key===ioZ)return;ioZ=key;
if(io)io.disconnect();CAND.clear();
io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)CAND.add(e.target);else CAND.delete(e.target);});ask();},
{rootMargin:`${-Math.round(t)}px ${-Math.round(vw-rt)}px ${-Math.round(vh-b)}px ${-Math.round(l)}px`});
for(let i=ALL.length-1;i>=0;i--){if(ALL[i].isConnected)io.observe(ALL[i]);else ALL.splice(i,1);}
};
const onTop=(e,q,z)=>{
const x=clamp((Math.max(q.left,z.left)+Math.min(q.right,z.right)) / 2,0,W.innerWidth-1),y=clamp((Math.max(q.top,z.top)+Math.min(q.bottom,z.bottom)) / 2,0,W.innerHeight-1);
let top=D.elementsFromPoint(x,y).filter(el=>!el.closest(CHROME))[0];if(top instanceof SVGElement)top=outerSvg(top)||top;
return!!top&&(top===e||e.contains(top));
};
const nearIO=(r,m)=>{
if(!CAND.size)return false;
const z={left:r.left-m,top:r.top-m,right:r.right+m,bottom:r.bottom+m};
for(const e of CAND){
if(!e.isConnected){CAND.delete(e);continue;}
if(MEDIA.test(e.tagName)){const qi=e.getBoundingClientRect();if(qi.width<W.innerWidth*0.6&&hit(qi,z)&&shownEl(e)&&onTop(e,qi,z))return true;continue;}
for(let nd=e.firstChild;nd;nd=nd.nextSibling){if(nd.nodeType!==3||!/\S/.test(nd.data))continue;const rg=D.createRange();rg.selectNodeContents(nd);const qs=rg.getClientRects();for(let q=0;q<qs.length;q++)if(hit(qs[q],z)&&shownEl(e)&&onTop(e,qs[q],z))return true;}
}
return false;
};
const nearGrid=(r,m)=>{
const z={left:r.left-m,top:r.top-m,right:r.right+m,bottom:r.bottom+m},seen=[];
const nj=Math.max(3,Math.min(9,Math.ceil((z.bottom-z.top) / 24)));
for(let i=0;i<=2;i++)for(let j=0;j<=nj;j++){
const x=clamp(z.left+(z.right-z.left)*i / 2,0,W.innerWidth-1),y=clamp(z.top+(z.bottom-z.top)*j / nj,0,W.innerHeight-1);
let e=D.elementsFromPoint(x,y).filter(el=>!el.closest(CHROME))[0];
if(e&&e instanceof SVGElement&&e.ownerSVGElement)e=e.closest('svg')?(function f(s){return s.ownerSVGElement?f(s.ownerSVGElement):s;})(e.closest('svg')):e;
if(!e||seen.indexOf(e)>=0)continue;seen.push(e);
if(/^(IMG|VIDEO|CANVAS|svg)$/.test(e.tagName)){const qi=e.getBoundingClientRect();if(qi.width<W.innerWidth*0.6&&hit(qi,z)&&shownEl(e))return true;continue;}
for(let k=0;k<e.childNodes.length;k++){const nd=e.childNodes[k];if(nd.nodeType!==3||!nd.textContent.trim())continue;const rg=D.createRange();rg.selectNodeContents(nd);const qs=rg.getClientRects();for(let q=0;q<qs.length;q++)if(hit(qs[q],z)&&shownEl(e))return true;}
}
return false;
};
const near=(r,m)=>(io?nearIO(r,m):nearGrid(r,m));
const GAP=50;let ran=0,tmo=0;
const tick=()=>{
rq=0;const now=performance.now();ran=now;
const dy=Math.abs(W.scrollY-lastY);lastY=W.scrollY;const ahead=M[0]+(M[2]?Math.min(180,dy*1.5):Math.min(48,dy));
const empty=!!io&&!CAND.size;let r=null;
const isNear=m=>{if(empty)return false;if(!r){const im=$$('img',link).filter(i=>i.offsetWidth)[0]||link;r=im.getBoundingClientRect();}return near(r,m);};
if(!away){if(isNear(ahead)){away=true;bar.classList.add('gfx-fox-away');}}
else if(isNear(M[1]))since=0;
else if(!since){since=now;ask();}
else if(now-since>350){away=false;since=0;bar.classList.remove('gfx-fox-away');}
else ask();
};
const ask=()=>{if(rq||tmo)return;const wait=GAP-(performance.now()-ran);if(wait>0)tmo=setTimeout(()=>{tmo=0;rq=1;postFrame(tick);},wait);else{rq=1;postFrame(tick);}};
addEventListener('scroll',ask,{passive:true});
let rzT=0;addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>{zoneIO();ask();},150);});
setInterval(()=>{const y=W.scrollY;if(y!==last){last=y;ask();}},250);
if('IntersectionObserver'in W){
zoneIO();queue(D.body);
if('MutationObserver'in W)new MutationObserver(ms=>ms.forEach(mu=>{if(mu.type!=='childList')return;mu.addedNodes.forEach(n=>queue(n.nodeType===1?n:mu.target));})).observe(D.body,{childList:true,subtree:true});
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(()=>{zoneIO();ask();});
}
ask();
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
data.legal=data.legal.filter(([t])=>!/^terms/i.test(t));
if(!data.legal.length)data.legal=[['Privacy Policy','#']];
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
cut(Math.max(0,Math.round(H0*(1-p)-CH)));
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
const live=()=>Math.min(1,Math.max(0,(W.innerHeight-host.getBoundingClientRect().top) / (H0||1)));
let first=true;
st=ST.create({start:0,end:'max',onRefresh:()=>{measureF();step(live(),true);first=false;},onUpdate:()=>{step(live(),first);first=false;}});
ro=new ResizeObserver(()=>{if(foot.offsetHeight!==H0){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>ST.refresh());}});
ro.observe(foot);
ST.refresh();
};
foot.addEventListener('focusin',onFocus);
const re=()=>setup();
if(wide.addEventListener)wide.addEventListener('change',re);else wide.addListener(re);
let rz=0;W.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(re,180);});
setup();
const settle=()=>{if(mode==='reveal'&&H0){const r=host.getBoundingClientRect().top;step(Math.min(1,Math.max(0,(W.innerHeight-r) / H0)),true);}};
W.addEventListener('load',()=>setTimeout(settle,60));W.addEventListener('pageshow',()=>setTimeout(settle,60));setTimeout(settle,1200);
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
let nearC=true;
const ask=force=>{if((nearC||force===true)&&!rq){rq=1;postFrame(tick);}};
const fox0=$(sel);if(fox0&&fox0.parentElement&&'IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{nearC=e.isIntersecting;ask(true);}),{rootMargin:'150% 0px'}).observe(fox0.parentElement);
addEventListener('scroll',ask,{passive:true});addEventListener('resize',()=>ask(true));if(shared&&shared.on)shared.on('scroll',ask);
setTimeout(()=>ask(true),600);addEventListener('load',()=>ask(true));
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
const idleFilms=()=>safe('idle films',()=>D.querySelectorAll('video').forEach(v=>{
if(v.closest('[data-o], .gfx-mc-still'))return;
const cs=getComputedStyle(v),r=v.getBoundingClientRect();
let hidden=cs.display==='none'||cs.visibility==='hidden'||r.width<2||r.height<2;
for(let n=v.parentElement;!hidden&&n&&n!==D.body;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')hidden=true;}
if(hidden){if(!v.paused)v.pause();v.removeAttribute('autoplay');v.autoplay=false;v.preload='none';v.dataset.gfxIdle='1';}
else if(v.dataset.gfxIdle){delete v.dataset.gfxIdle;v.autoplay=true;const p=v.play();if(p&&p.catch)p.catch(()=>{});}
}));
onReady(idleFilms);W.addEventListener('load',()=>setTimeout(idleFilms,200));{let vt=0;W.addEventListener('resize',()=>{clearTimeout(vt);vt=setTimeout(idleFilms,400);});}
const STAGING= /(^|\/)[a-z0-9-]*-v2(-[a-z0-9-]+)?\/?$/.test(location.pathname)|| /\.webflow\.io$/.test(location.hostname);
const toV2=a=>{
const h=a.getAttribute('href')||'',t=(a.textContent||'').trim();
if(/^(https?:\/\/[^/]*greyfox[^/]*)?\/contact\/?([?#].*)?$/.test(h))a.setAttribute('href',h.replace(/\/contact\/?/,'/contact-v2'));
else if(/^(https?:\/\/[^/]*greyfox[^/]*)?\/insights\/?([?#].*)?$/.test(h))a.setAttribute('href','/insights-v2'+(h.match(/[?#].*$/)||[''])[0]);
else if(t==='Team'&& /^(\/team\/?|(\/[a-z0-9-]*)?#team)$/.test(h))a.setAttribute('href','/team-v2');
else if(/^privacy( policy)?$/i.test(t)&&(h==='#'|| /^\/privacy(-policy)?\/?$/.test(h)))a.setAttribute('href','/privacy-v2');
else if(h==='/'||h==='/#')a.setAttribute('href','/home-v2');
};
const ART='/articles/',PLAUSIBLE='ai-deal-origination-structural-risk-plausible-list-problem';
const toArticle=a=>{
const h=a.getAttribute('href')||'',m=h.match(/^(?:https?:\/\/(?:www\.)?greyfoxpartners\.com)?\/insights\/([a-z0-9-]+)\/?([?#].*)?$/);
if(m&&m[1]!=='category'&&m[1]!=='tag')a.setAttribute('href',ART+m[1]+(m[2]||''));
else if(/^\/insights-v2-article\/?([?#].*)?$/.test(h))a.setAttribute('href',ART+PLAUSIBLE);
else if(!STAGING&& /^\/insights-v2\/?([?#].*)?$/.test(h))a.setAttribute('href',h.replace(/^\/insights-v2\/?/,'/insights'));
};
{const sweepA=()=>D.querySelectorAll('a[href*="insights"]').forEach(toArticle);
onReady(sweepA);W.addEventListener('load',()=>{sweepA();setTimeout(sweepA,1500);});
D.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a)toArticle(a);},true);}
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
room,lineSplit,fitFilm,rooms,scrollToY,refresh,esc,postFrame,
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
safe('height watch',()=>{
const lim=()=>{if(shared&&!shared.__gfxStub)try{if(Math.abs(shared.limit-ST.maxScroll(W))>1)shared.resize();}catch(e){}};
let lastH=D.documentElement.scrollHeight;
ST.addEventListener('refresh',()=>{lastH=D.documentElement.scrollHeight;lim();});
const check=()=>{lim();const h=D.documentElement.scrollHeight;if(Math.abs(h-lastH)>2)ST.refresh();};
const later=()=>{setTimeout(check,300);setTimeout(check,1800);};
if(D.readyState==='complete')later();else W.addEventListener('load',later);
});
},60);
},200);
});
}
})();
(function(){
'use strict';
var W=window,D=document,gfx=W.gfx;
if(!gfx||!gfx.page||W.__gfxInvestors)return;
W.__gfxInvestors='1.0.11';
const H=D.documentElement,G=gfx.G,$=gfx.$,$$=gfx.$$,safe=gfx.safe,mq=gfx.mq,clamp=gfx.clamp;
const NS=gfx.NS,TAN=gfx.TAN,REDUCE=gfx.REDUCE;
const O=c=>'[data-o~="'+c+'"]';
const oHas=(el,c)=>!!el&&(' '+(el.getAttribute('data-o')||'')+' ').indexOf(' '+c+' ')>-1;
const oSet=(el,c,on)=>{if(!el)return;const t=(el.getAttribute('data-o')||'').split(/\s+/).filter(x=>x&&x!==c);if(on)t.push(c);el.setAttribute('data-o',t.join(' '));};
const SETTLE=G.SETTLE,GLIDE=G.DRAW,GROUP=G.group;
const lerp=(a,b,t)=>a+(b-a)*t,seg=(p,a,b)=>clamp((p-a) / (b-a),0,1);
const ss=t=>t*t*(3-2*t),eo=t=>1-Math.pow(1-t,3),eio=t=>(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3) / 2);
const txt=el=>(el?el.textContent.replace(/\s+/g,' ').trim():'');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
let gsap=null,ST=null;
const refresh=()=>gfx.refresh();
const sy=()=>gfx.scrollNow();
let live=false;
const decideLive=()=>{live=!REDUCE&&mq('(min-width: 992px)');H.classList.toggle('iv2-live',live);};
safe('head',()=>{H.classList.remove('gfx-intro');H.classList.add('gfx-iv3','iv-f2','gf-flow3','ow-js');if(REDUCE)H.classList.add('ow-reduce');decideLive();});
const R={};
const findRooms=()=>{const k=c=>$(O(c));R.hero=k('ow-hero');R.res=k('iv-fun');R.del=k('iv-client');R.mc=k('iv-mc');R.cases=k('iv-cases');R.care=k('iv-std');R.close=k('iv-close');};
findRooms();
const prevRoom=room=>{let p=room.previousElementSibling;while(p&&!(p.matches('section, .ow-room, [class*="section"], [data-o~=ow-room]')&&p.querySelector('h1, h2, h3, p, img')))p=p.previousElementSibling;return p;};
const closeAt=(room,c)=>{
const y=sy(),vh=W.innerHeight,top=room.getBoundingClientRect().top+y,max=D.documentElement.scrollHeight-vh;
let at=top-vh*0.6;const pv=prevRoom(room);
if(pv&&W.gfTurn&&W.gfTurn.lastBottom){const lb=W.gfTurn.lastBottom(pv);if(Number.isFinite(lb))at=Math.max(at,lb-vh*0.12);}
const hd=room.querySelector('h2, .heading-2');if(hd)at=Math.min(at,hd.getBoundingClientRect().top+y-vh*0.72);
return Math.min(at,max-vh*0.04);
};
const field={
phoneRhythm:true,
rooms:[
{el:O('ow-hero'),native:'L',tone:'L',noInk:true},
{el:O('iv-fun'),native:'L',tone:'L',noInk:true,tier:'standard'},
{el:O('iv-client'),native:'L',tone:'L',noInk:true,tier:'standard'},
{el:O('iv-mc'),native:'D',tone:'D',noInk:true,tier:'turn',turnAt:(ym,c)=>closeAt(c.room.el,c)},
{el:O('iv-cases'),native:'D',tone:'D',noInk:true,tier:'standard'},
{el:O('iv-std'),native:'D',tone:'D',noInk:true,tier:'standard'},
{el:O('iv-close'),native:'D',tone:'D',noInk:true,opaque:true,foot:true,tier:'standard'}
]
};
const inks=()=>{let dk=null;const f=()=>{const d=H.classList.contains('gfx-tone-dark');if(d===dk)return;dk=d;H.classList.toggle('iv2-dt',d);if(R.res)R.res.classList.toggle('ow-char',d);};
f();new MutationObserver(f).observe(H,{attributes:true,attributeFilter:['class']});};
const S1={},S2={},CL={};
function dom(){
findRooms();
$$('.gfx-nav a.navigation-item').forEach(a=>{if((a.textContent||'').trim().toLowerCase()==='investors'){a.classList.add('gfx-current');a.setAttribute('aria-current','page');}});
$$('[data-o~="is-on"], [data-o~="ow-char"]').forEach(e=>{if(oHas(e,'is-on'))e.classList.add('is-on');if(oHas(e,'ow-char'))e.classList.add('ow-char');});
[R.del,R.care].forEach(r=>r&&r.classList.add('ow-char'));
$$(O('iv2-h')+', '+O('iv2-verdict')).forEach(p=>{const k=[...p.children].filter(c=>c.tagName==='SPAN');k.slice(1).forEach(s=>{const pv=s.previousSibling;if(!(pv&&pv.nodeType===3&& /\s/.test(pv.textContent)))s.before(D.createTextNode(' '));});});
if(R.res){
Object.assign(S1,{room:R.res,track:$(O('iv2-track'),R.res),stage:$(O('iv2-stage'),R.res),hls:$$(O('iv2-hl')+' > span',R.res),lede:$(O('iv2-lede'),R.res),
tl:$(O('iv2-tl'),R.res),stops:$$(O('iv2-stop'),R.res),vs:$$(O('iv2-verdict')+' > span',R.res),vrule:$(O('iv2-vrule'),R.res)});
if(S1.tl&&!$('svg.iv2-line',S1.tl)){
S1.tl.insertAdjacentHTML('afterbegin','<svg class="iv2-line" aria-hidden="true" focusable="false"><defs><mask id="iv2-lm" maskUnits="userSpaceOnUse"><path class="iv2-lm-p" pathLength="1"/></mask></defs><path class="iv2-ln" mask="url(#iv2-lm)"/></svg>');
}
S1.svg=$('svg.iv2-line',R.res);S1.ln=$('.iv2-ln',R.res);S1.mp=$('.iv2-lm-p',R.res);
S1.stops.forEach(li=>{li._num=$(O('iv2-num'),li);li._k=$(O('iv2-k'),li);});
}
if(R.mc){
const track=$(O('iv2-mtrack'),R.mc),stage=track&&$(O('iv2-mstage'),track),win=track&&$(O('iv2-mwin'),track);
if(win&&!$('.iv2-chrome',win))win.insertAdjacentHTML('afterbegin',`<div class="iv2-chrome" aria-hidden="true"><div class="iv2-tabs"><div class="iv2-tab"><img src="${esc(gfx.BASE+'assets/favicon-gold.svg')}" alt=""><span>Grey Fox Partners</span></div><div class="iv2-wc"><i></i><i></i><i></i></div></div><div class="iv2-bar"><div class="iv2-nav"><i></i><i></i></div><div class="iv2-url"><span>Mission Control</span></div></div></div>`);
if(track&&!live){
const inner=track.parentElement,open=$(O('ow-open'),stage),rule=$(':scope > '+O('ow-rule'),stage),cell=$(O('iv2-mcell'),stage);
if(open)inner.insertBefore(open,track);if(rule)inner.insertBefore(rule,track);
if(cell&&win){cell.before(win);cell.remove();}
oSet(track,'iv2-mheld',false);
}
Object.assign(S2,{room:R.mc,track,stage,win,winIn:track&&$(O('iv2-mwin-in'),track),vids:track?$$('video',track):[],
bs:track?$$(O('iv2-mb'),track):[],bbs:track?$$(O('iv2-mbb'),track):[],play:track&&$(O('iv2-mplay'),track),foot:track&&$(O('iv2-mfoot'),track)});
}
if(R.close){
const h=$('h2',R.close);
if(h&&!$('.iv2-cw',h)){const t=h.textContent,i=t.trimEnd().lastIndexOf(' ');if(i>0)h.innerHTML=`${esc(t.slice(0,i))} <span class="iv2-cw">${esc(t.slice(i+1).trim())}</span>`;}
R.close.classList.add('gfc-on');
const fox=$(O('ow-close-fox'),R.close);if(fox)fox.classList.add('gfc-fox');
Object.assign(CL,{room:R.close,top:$(O('gfc-top'),R.close),h});
}
H.classList.add('iv2-prepped');
}
const show=(el,k,dy)=>{if(!el)return;dy=dy==null?14:dy;const o=k.toFixed(3),t=`translate3d(0, ${((1-k)*dy).toFixed(2)}px, 0)`;if(el._o!==o){el.style.opacity=o;el._o=o;}if(el._tr!==t){el.style.transform=t;el._tr=t;}};
const setVar=(el,k,v)=>{const s=v.toFixed(3);if(el['_'+k]!==s){el.style.setProperty(k,s);el['_'+k]=s;}};
const shownNow=els=>gsap.set(els,{clearProps:'pointerEvents'});
const hideNow=els=>{els=[].concat(els).filter(Boolean);els.forEach(e=>e.setAttribute('data-ow-reveal',''));if(els.length)gsap.set(els,{opacity:0,y:G.body.y,pointerEvents:'none'});};
const settleIn=(tl,els,at,o)=>{o=o||{};els=[].concat(els).filter(Boolean);if(!els.length)return;tl.fromTo(els,{opacity:0,y:o.y!=null?o.y:G.body.y},{opacity:1,y:0,duration:o.d!=null?o.d:G.body.duration,ease:SETTLE,stagger:o.st!=null?o.st:GROUP,immediateRender:false,onStart:()=>shownNow(els)},at);};
const once=(trigger,start,play,finish)=>{let done=false;
ST.create({trigger,start,onEnter:s=>{if(done)return;done=true;play(false);s.kill();},onLeave:s=>{if(done)return;done=true;(finish||play)(true);s.kill();}});};
const odo=b=>{
const val=b.dataset.final||(b.dataset.final=b.textContent.trim());
b.textContent='';
const sr=D.createElement('span');sr.className='ow-sr';sr.textContent=val;b.append(sr);
const vis=D.createElement('span');vis.setAttribute('aria-hidden','true');b.append(vis);
const reels=[];let k=0;
for(const ch of val){
if(!/[0-9]/.test(ch)){vis.append(ch);continue;}
const d=+ch,n=4+k,sq=[];for(let j=n;j>=1;j--)sq.push((d-j+100)%10);
const mask=D.createElement('ow-odo'),reel=D.createElement('ow-reel');
reel.textContent=ch;reel.setAttribute('data-seq',sq.join('\n'));mask.append(reel);vis.append(mask);reels.push([reel,n,k]);k++;
}
reels.forEach(([reel,n])=>gsap.set(reel,{yPercent:n*100}));
gsap.set(b,{opacity:0});
const settle=gsap.parseEase(SETTLE),setY=reels.map(([reel])=>gsap.quickSetter(reel,'yPercent'));
return(tl,at)=>{
tl.set(b,{opacity:1},at);
if(!reels.length)return;
const last=reels.length-1,T=G.figure.duration,total=last*0.07+T+last*0.1,clock={t:0};
tl.fromTo(clock,{t:0},{t:total,duration:total,ease:'none',immediateRender:false,
onUpdate:()=>reels.forEach(([,n,i],j)=>{const s=Math.min(1,Math.max(0,(clock.t-i*0.07) / (T+i*0.1)));setY[j](n*100*(1-settle(s)));})},at);
};
};
const rolls=new Map();
const roll=el=>{if(!el)return null;if(!rolls.has(el)){const t=el.textContent.trim(),f= /^([0-9]+)(\s(?:of|in|to)\s.+)$/.exec(t);
if(f){el.textContent='';const nEl=D.createElement('span');nEl.className='iv-odo-n';nEl.textContent=f[1];el.append(nEl,f[2]);const play=odo(nEl);gsap.set(el,{opacity:0});rolls.set(el,(tl,at)=>{tl.set(el,{opacity:1},at);play(tl,at);});}
else rolls.set(el,odo(el));}return rolls.get(el);};
const FILM_MAX=1.4;
const fitFilm=(tl,max)=>{max=max||FILM_MAX;const d=tl.duration();if(d>max)tl.timeScale(d / max);return tl;};
const filmAt=(room,el,build)=>{
let tl=null,limit=0,rows=null;
const make=()=>{if(!tl){tl=gsap.timeline({paused:true});build(tl);fitFilm(tl);}return tl;};
const measure=()=>{const t=make(),top=el.getBoundingClientRect().top;let off=0;
return t.getChildren(false,true,true).sort((a,b)=>a.startTime()-b.startTime()).map(k=>{
const g=k.targets?k.targets().find(x=>x&&x.nodeType===1):null;
if(g){const r=g.getBoundingClientRect();if(r.width||r.height)off=Math.max(0,r.top-top);}
return{off,end:k.endTime()};});};
const advance=off=>{
const t=make();if(!rows)rows=measure();
if(!t.owLimit){t.owLimit=1;t.owBase=t.timeScale();t.eventCallback('onUpdate',()=>{if(!t.paused()&&t.time()>=limit-1e-4){t.pause();t.time(Math.min(limit,t.duration()),true);t.timeScale(t.owBase);}});}
let L=limit;if(off===Infinity)L=t.duration();else rows.forEach(r=>{if(r.off<=off)L=Math.max(L,r.end);});
if(L>limit){limit=L;if(t.progress()<1&&t.time()<limit){t.timeScale(Math.max(t.owBase,(limit-t.time()) / 0.7));t.play();}}
};
ST.create({trigger:el,start:'top 88%',end:'bottom 88%',invalidateOnRefresh:true,
onEnter:s=>advance(s.progress*el.offsetHeight+1),onUpdate:s=>{if(s.isActive)advance(s.progress*el.offsetHeight+1);},onLeave:()=>advance(Infinity)});
};
const splitRise=(h,onSplitShown)=>{
let shown=false,first=true;
W.SplitText.create(h,{type:'lines',mask:'lines',linesClass:'ow-line',autoSplit:true,aria:'none',
onSplit:self=>{gsap.set(self.lines,{yPercent:shown?0:G.headline.yPercent});if(!first)requestAnimationFrame(()=>D.dispatchEvent(new Event('ow:resplit')));first=false;}});
return{lines:()=>$$('.ow-line',h),shown:()=>{shown=true;}};
};
const offIn=(el,room)=>Math.max(0,Math.round(el.getBoundingClientRect().top-room.getBoundingClientRect().top));
const headAt=(room,el,play)=>{let done=false;
ST.create({trigger:room,start:()=>'top+='+offIn(el,room)+' 82%',end:'+=1',invalidateOnRefresh:true,
onEnter:s=>{if(done)return;done=true;play(false);s.kill();},onLeave:s=>{if(done)return;done=true;play(true);s.kill();}});};
const roomHead=room=>{
const open=room&&$(O('ow-open'),room),h=open&&$('h2',open);if(!h)return;
const words=$$('[data-ow-appear]',open),rule=$$('[data-ow-draw]',room)[0]||null;
const sp=splitRise(h);
words.forEach(e=>{e.removeAttribute('data-ow-appear');e.setAttribute('data-ow-reveal','');});
if(words.length)gsap.set(words,{opacity:0,y:G.body.y,pointerEvents:'none'});
if(rule){rule.removeAttribute('data-ow-draw');gsap.set(rule,{scaleX:0});}
headAt(room,h,skip=>{
sp.shown();const tl=gsap.timeline();
tl.to(sp.lines(),{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:SETTLE},0);
if(words.length)tl.to(words,{opacity:1,y:0,duration:G.body.duration,stagger:GROUP,ease:SETTLE,onStart:()=>shownNow(words)},G.body.at);
if(rule)tl.to(rule,{scaleX:1,duration:G.hairline.duration,ease:GLIDE},G.hairline.at);
fitFilm(tl,1.6);if(skip){shownNow(words);tl.progress(1);}
});
};
const rise=el=>{if(!el)return;const sp=splitRise(el);
once(el,'top 84%',skip=>{sp.shown();const ls=sp.lines();if(skip)gsap.set(ls,{yPercent:0});else gsap.to(ls,{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:SETTLE});});};
function heroInit(){
const room=R.hero;if(!room)return;
const h1=$(O('ow-h1'),room);if(!h1)return;
let heroTl=null,prevLines=null,first=true;
W.SplitText.create(h1,{type:'lines',mask:'lines',linesClass:'ow-line',autoSplit:true,aria:'none',
onSplit:self=>{
const was=prevLines;prevLines=[...self.lines];
if(h1.dataset.risen||!heroTl)gsap.set(self.lines,{yPercent:h1.dataset.risen?0:G.headline.yPercent});
else self.lines.forEach((l,i)=>{const o=was&&was[Math.min(i,was.length-1)],from=o?+gsap.getProperty(o,'yPercent')||0:G.headline.yPercent;
gsap.fromTo(l,{yPercent:from},{yPercent:0,duration:from>0?G.headline.duration*(from / G.headline.yPercent)+0.2:0.01,delay:from>0?i*G.headline.stagger:0,ease:SETTLE,overwrite:true});});
if(!first)requestAnimationFrame(()=>D.dispatchEvent(new Event('ow:resplit')));first=false;}});
const words=[$(O('ow-hero-lede'),room),$(O('ow-actions'),room)].filter(Boolean),rule=$(O('ow-hero-foot')+' > '+O('ow-rule'),room)||$(O('ow-rule'),room),stats=$$(O('iv-stat'),room);
const pic=$(O('ow-hero-pic'),room),img=pic&&($('img[data-o~="iv-hero-tug"]',pic)||$('img',pic)),fx=pic?(getComputedStyle(pic).getPropertyValue('--fx').trim()||'96px'):'96px';
const lede=$(O('ow-hero-lede'),room),wordsHid=words.filter(w=>w!==lede);
if(wordsHid.length)gsap.set(wordsHid,{opacity:0,y:G.body.y});if(lede)gsap.set(lede,{y:G.body.y});if(rule)gsap.set(rule,{scaleX:0});
const statK=stats.map(st=>$(O('iv-stat-k'),st)),statPlay=stats.map(st=>{const f=$('[data-ow-odo]',st);if(!f)return null;const m= /^([0-9]+)(\s.+)$/.exec(f.textContent.trim());
if(!m)return odo(f);f.textContent='';const n=D.createElement('span');n.className='iv-odo-n';n.textContent=m[1];f.append(n,m[2]);const p=odo(n);gsap.set(f,{opacity:0});return(tl,at)=>{tl.set(f,{opacity:1},at);p(tl,at);};});
gsap.set(statK,{opacity:0,y:G.detail.y});
const tug=img&&oHas(img,'iv-hero-tug'),tugRest=tug&&gfx.store.get('gfx-still')==='1';
if(img){gsap.set(img,{clipPath:G.picture.clipFrom,scale:tug?(tugRest?1:1.04):G.picture.scaleFrom});gsap.set(pic,{'--fx':'0px'});}
H.classList.add('ow-hero-on','gfx-ready');
const tl=heroTl=gsap.timeline({paused:true});
tl.to($$('.ow-line',h1),{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:SETTLE,onComplete:()=>{h1.dataset.risen=1;}},0)
.to(words,{opacity:1,y:0,duration:G.body.duration,stagger:GROUP,ease:SETTLE},G.body.at)
.to(rule,{scaleX:1,duration:G.hairline.duration,ease:GLIDE},G.hairline.at);
const PIC_AT=0.15;
if(img&&tug){
tl.to(img,{clipPath:'inset(0% 0% 0% 0%)',duration:G.picture.duration,ease:GLIDE},PIC_AT);
if(!tugRest)tl.add(()=>{const go=()=>gsap.fromTo(img,{scale:1.04},{scale:1,duration:7,ease:SETTLE});
if(img.complete&&img.naturalWidth)go();else{img.addEventListener('load',go,{once:true});img.addEventListener('error',()=>gsap.set(img,{scale:1}),{once:true});}},PIC_AT);
}else if(img)tl.to(img,{clipPath:'inset(0% 0% 0% 0%)',duration:G.picture.duration,ease:GLIDE},PIC_AT).to(img,{scale:1,duration:G.picture.duration+0.5,ease:SETTLE},PIC_AT+0.34);
stats.forEach((st,i)=>{const at=G.detail.at+i*0.3;statPlay[i]&&statPlay[i](tl,at);tl.to(statK[i],{opacity:1,y:0,duration:G.detail.duration,ease:SETTLE},at+0.15);});
if(img)tl.to(pic,{'--fx':fx,duration:G.hairline.duration,ease:GLIDE},G.detail.at+G.detail.stagger);
const go=()=>{if(tl.paused()&&!tl.progress())tl.play();};
W.ivHeroGo=go;setTimeout(go,1200);
W.addEventListener('resize',()=>{if(tl.progress()<1&&tl.isActive())tl.progress(1);});
}
function breathInit(){
if(/[?&]motif=1(&|$)/.test(location.search)||!G.breath){H.classList.add('ow-motif');return;}
H.classList.add('ow-motif','ow-breath');
const B=G.breath;
const breathe=(pic,frame,range)=>{let last=-1,q=0.0005;
const set=u=>{const raw=B.scaleFrom+(B.scaleTo-B.scaleFrom)*u,v=u>=1?B.scaleTo:u<=0?B.scaleFrom:+(Math.round(raw / q)*q).toFixed(4);if(v!==last){last=v;pic.style.scale=v;}};
set(0);
ST.create({trigger:frame,start:()=>range()[0],end:()=>range()[1],invalidateOnRefresh:true,
onToggle:st=>{pic.style.willChange=st.isActive?'transform':'';},onUpdate:st=>set(st.progress),onRefresh:st=>{q=1 / Math.max(400,frame.offsetWidth||400);set(st.progress);}});};
$$(O('iv-case-bg')).forEach(bg=>{const img=$('img',bg),rm=R.cases;if(img&&rm)breathe(img,bg,()=>{const t=rm.getBoundingClientRect().top+sy();return[Math.max(0,t-W.innerHeight),t+rm.offsetHeight];});});
}
function deliveryInit(){
const room=R.del,figsBox=room&&$(O('iv-dfigs'),room);if(!figsBox)return;
const dfs=$$(O('iv-df'),room),note=$(O('iv-df-note'),room),dRoll=dfs.map(d=>roll($('[data-ow-odo]',d))),dText=dfs.map(d=>$(O('iv-df-k'),d));
gsap.set(dfs,{'--ow-rl':0});hideNow([...dText,note]);
filmAt(room,figsBox,tl=>{
dfs.forEach((d,i)=>{const a=0.1+i*0.3;tl.to(d,{'--ow-rl':1,duration:G.hairline.duration,ease:GLIDE},a);dRoll[i]&&dRoll[i](tl,a+0.15);settleIn(tl,dText[i],a+0.3,{y:G.detail.y,d:G.detail.duration});});
settleIn(tl,note,0.1+dfs.length*0.3+0.3,{y:G.detail.y,d:G.detail.duration});
});
}
function casesInit(){
const room=R.cases,list=room&&$(O('iv-case-list'),room);if(!list)return;
const cases=$$(O('iv-case'),room),bgs=cases.map(c=>$(O('iv-case-bg'),c)),kRoll=cases.map(c=>roll($('[data-ow-odo]',c)));
const kText=cases.map(c=>[...$(O('iv-case-in'),c).children].filter(e=>!oHas(e,'iv-case-fig')));
const qTop=$(O('iv-cq')+O('is-top'),room);
gsap.set(bgs,{clipPath:G.picture.clipFrom});hideNow(kText.flat());
if(qTop){hideNow(qTop);headAt(room,$('h2',room),skip=>{const tl=gsap.timeline();settleIn(tl,qTop,G.body.at,{d:G.body.duration});if(skip)tl.progress(1);});}
filmAt(room,list,tl=>{
cases.forEach((c,i)=>{const a=i*0.35;tl.to(bgs[i],{clipPath:'inset(0% 0% 0% 0%)',duration:G.picture.duration,ease:GLIDE},a);settleIn(tl,kText[i][0],a+0.35,{y:G.detail.y,d:G.detail.duration});kRoll[i]&&kRoll[i](tl,a+0.5);settleIn(tl,kText[i].slice(1),a+0.65,{st:0.1,y:G.detail.y,d:G.detail.duration});});
});
}
function careInit(){
const room=R.care,body=room&&$(O('iv-std-r'),room);if(!body)return;
const line=$(O('iv-std-line'),body),rules=$$(O('iv-std-rules')+' > *',body),ps=$$(O('iv-std-p'),body),h=$('h2',room);
gsap.set(rules,{'--ow-rl':0});hideNow([line,...ps]);
rise(h);
headAt(room,h,skip=>{const tl=gsap.timeline();
settleIn(tl,line,G.body.at,{d:G.body.duration});
tl.to(rules,{'--ow-rl':1,duration:G.hairline.duration,ease:GLIDE,stagger:GROUP},G.hairline.at);
fitFilm(tl,FILM_MAX);if(skip)tl.progress(1);});
if(ps.length)once(ps[0],'top 88%',skip=>{const t2=gsap.timeline();settleIn(t2,ps,0,{y:G.detail.y,d:G.detail.duration,st:GROUP});if(skip)t2.progress(1);});
}
function pairs(){
const items=$$(O('iv-stat')+', '+O('iv-df'));if(!items.length)return;
let rq=0;const tick=()=>{rq=0;const gone=items.map(el=>{const r=el.getBoundingClientRect();return r.top<96&&r.bottom>0;});items.forEach((el,i)=>el.classList.toggle('gf-pair-gone',gone[i]));};
W.addEventListener('scroll',()=>{if(!rq)rq=requestAnimationFrame(tick);},{passive:true});tick();
}
let L=null,E1=0,P1=0;
const s1Layout=()=>{
if(!S1.svg||!S1.stops.length)return;
const tl=S1.tl,Wd=tl.clientWidth,y=11.5;
const xs=S1.stops.map(li=>li.offsetLeft);
const x0=xs[0],xEnd=Wd,rs=22,run=rs / TAN,xt=xEnd-run,y2=y-rs;
const Lh=xt-x0,Ld=Math.hypot(run,rs),len=Lh+Ld;
const N=Math.max(40,Math.round(len / 9)),pts=[];
for(let i=0;i<=N;i++){
const s=(i / N)*len;let px,py;
if(s<=Lh){px=x0+s;py=y+Math.sin(s / 97)*0.35+Math.sin(s / 31+1.3)*0.12;}
else{const u=(s-Lh) / Ld;px=xt+run*u;py=y-rs*u;}
const wd=(1.25+1.45*Math.exp(-s / 10))*(0.55+0.45*clamp((len-s) / 46,0,1));
pts.push([px,py,wd]);
}
const nrm=i=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(N,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[-dy / l,dx / l];};
const Lp=[],Rp=[];pts.forEach((p,i)=>{const[nx,ny]=nrm(i);Lp.push(`${(p[0]+nx*p[2] / 2).toFixed(2)} ${(p[1]+ny*p[2] / 2).toFixed(2)}`);Rp.push(`${(p[0]-nx*p[2] / 2).toFixed(2)} ${(p[1]-ny*p[2] / 2).toFixed(2)}`);});
S1.ln.setAttribute('d','M'+Lp.join(' L')+' L'+Rp.reverse().join(' L')+' Z');
S1.mp.setAttribute('d',`M${(x0-6).toFixed(1)} ${y} H${xt.toFixed(1)} L${(xEnd+2).toFixed(1)} ${(y2-2*TAN).toFixed(1)}`);
const a=Math.atan2(y2-y,xEnd-xt);
if(S1.hd)S1.hd.remove();S1.hd=W.gfArrow?W.gfArrow.head(S1.svg,xEnd,y2,Math.cos(a),Math.sin(a),{len:12,w:W.gfArrow.CHART,at:S1.hk||0}):null;
S1.svg.setAttribute('width',Math.ceil(Wd+4));S1.svg.setAttribute('height',40);S1.svg.style.top='0px';
const m=len+6;
L={len:m,stops:xs.map(x=>(x-x0+6) / m),endH:(Lh+6) / m};
};
const figTo=(li,on)=>{
if(!li._num)return;if(li._tl)li._tl.kill();
if(on)li._tl=gsap.timeline().fromTo(li._num,{opacity:0,y:14},{opacity:1,y:0,duration:0.7,ease:'expo.out'},0).fromTo(li._k,{opacity:0,y:10},{opacity:1,y:0,duration:0.8,ease:'expo.out'},0.25);
else li._tl=gsap.timeline().to([li._num,li._k],{opacity:0,y:8,duration:0.3,ease:'power2.in'});
};
const STEP=0.23,BEAT=0.13;
const s1Render=()=>{
if(!L)return;
const E=E1,P=P1;
S1.hls.forEach((h,i)=>{const k=eo(clamp(E*1.7-0.35-i*0.18,0,1));const t=`translate3d(0, ${((1-k)*105).toFixed(2)}%, 0)`;if(h._t!==t){h.style.transform=t;h._t=t;}});
show(S1.lede,eo(clamp(E*1.7-0.75,0,1)),12);
let f=lerp(0,L.stops[0]+0.004,eo(clamp(E*1.6-0.8,0,1)));
for(let i=0;i<4;i++){const a=i*STEP,k=eio(seg(P,a+0.01,a+BEAT)),from=L.stops[i],to=i<3?L.stops[i+1]:1;if(P>a)f=lerp(from,to,k);}
const off=(1-f).toFixed(4);if(S1.mp._off!==off){S1.mp.style.strokeDashoffset=off;S1.mp._off=off;}
const hk=ss(seg(P,3*STEP+BEAT-0.01,3*STEP+BEAT+0.03));
if(S1.hk!==hk){S1.hk=hk;if(S1.hd)S1.hd.set(hk);}
S1.stops.forEach((li,i)=>{
const a=i*STEP,arrive=eo(clamp(E*1.8-0.9-i*0.08,0,1));
show($(O('iv2-sn'),li),arrive,10);
const dot=$(O('iv2-dot'),li);const dk=arrive.toFixed(3);if(dot&&dot._o!==dk){dot.style.opacity=dk;dot._o=dk;}
const hit=i===0?clamp(E*1.6-0.8,0,1):ss(seg(f,L.stops[i]-0.01,L.stops[i]+0.002));
const start=i===0?1:ss(seg(P,a-0.02,a+0.01)),end=i===3?0:ss(seg(P,a+STEP-0.02,a+STEP+0.01));
setVar(li,'--hit',Math.max(hit,i===0?hit:0));
setVar(li,'--on',Math.min(i===0?clamp(E*1.6-0.8,0,1):start,1-end));
if(li._num){const on=P>a+0.003;if(on!==!!li._on){li._on=on;figTo(li,on);}}
});
if(S1.vrule){const t=`scaleX(${eo(clamp(E*1.8-0.95,0,1)).toFixed(4)})`;if(S1.vrule._t!==t){S1.vrule.style.transform=t;S1.vrule._t=t;}}
S1.vs.forEach((v,i)=>show(v,eo(seg(P,3*STEP+BEAT+0.005+i*0.02,3*STEP+BEAT+0.06+i*0.02)),16));
};
const s1Still=()=>{
if(!S1.svg)return;
if(L){S1.mp.style.strokeDashoffset='0';S1.hk=1;if(S1.hd)S1.hd.set(1);}
S1.stops.forEach((li,i)=>{li.style.setProperty('--hit','1');li.style.setProperty('--on',i===3?'1':'0');});
};
function s1Phone(still){
const list=S1.stops&&S1.stops.length===4?S1.stops[0].parentElement:null;if(!list)return;
let rail=null,fg=null,ys=[],on=false;
const easeOut=t=>1-Math.pow(1-t,3);
const count=li=>{
const el=li._num;if(!el||li._counted)return;li._counted=true;
const tw=D.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n=null,m=null;
while((n=tw.nextNode())){m=n.data.match(/\d+(?:\.\d+)?/);if(m)break;}
if(!n||!m||still||REDUCE)return;
const full=n.data,to=parseFloat(m[0]),dec=(m[0].split('.')[1]||'').length,t0=performance.now(),dur=900;
const step=now=>{const k=Math.min(1,(now-t0) / dur),v=(to*easeOut(k)).toFixed(dec);n.data=full.slice(0,m.index)+v+full.slice(m.index+m[0].length);if(k<1)requestAnimationFrame(step);else n.data=full;};
requestAnimationFrame(step);
};
const paint=()=>{
if(!on||!rail||!fg)return;
const r=list.getBoundingClientRect(),Hh=r.height||1,p=still?1:clamp((W.innerHeight*0.72-r.top) / Hh,0,1),at=p*Hh;
fg.style.strokeDashoffset=(1-p).toFixed(4);
rail.querySelectorAll('[data-at]').forEach(e=>e.classList.toggle('is-on',at>=+e.dataset.at-4));
S1.stops.forEach((li,i)=>{const reached=at>=ys[i]-4;if(reached!==li.classList.contains('gfx-s1-on')){li.classList.toggle('gfx-s1-on',reached);if(reached)count(li);}});
};
const build=()=>{
on=mq('(max-width: 767px)');
H.classList.toggle('gfx-s1-phone',on);
if(!on){if(rail)rail.style.display='none';S1.stops.forEach(li=>li.classList.remove('gfx-s1-on'));return;}
if(!rail){rail=D.createElementNS(NS,'svg');rail.setAttribute('class','gfx-s1-rail');rail.setAttribute('aria-hidden','true');rail.setAttribute('focusable','false');list.appendChild(rail);}
rail.style.display='';
const lr=list.getBoundingClientRect(),Hh=list.offsetHeight,X=11,tip=40,rise=20;
ys=S1.stops.map(li=>{const t=$(O('iv2-sn'),li),r=(t||li).getBoundingClientRect();return r.top-lr.top+r.height / 2;});
const y0=Math.max(0,ys[0]-40),yE=ys[3],f=v=>v.toFixed(1);
const d=`M${X} ${f(y0)}V${f(yE-14)}Q${X} ${f(yE)} ${X+14} ${f(yE)}H${tip-8}L${tip} ${f(yE-rise)}`;
const ticks=[0,1,2,3].map(i=>{const y=y0+6+i*7;return`<circle class="gfx-s1-n gfx-s1-n-tick" data-at="${f(y)}" cx="${X}" cy="${f(y)}" r="1.9"/>`;}).join('');
rail.setAttribute('width',48);rail.setAttribute('height',f(Hh));rail.setAttribute('viewBox',`0 0 48 ${f(Hh)}`);
rail.innerHTML=`<path class="gfx-s1-r-bg" d="${d}"/><path class="gfx-s1-r-fg" d="${d}" pathLength="1"/>`+ticks+
`<circle class="gfx-s1-n gfx-s1-n-ring" data-at="${f(ys[0])}" cx="${X}" cy="${f(ys[0])}" r="7"/><circle class="gfx-s1-n gfx-s1-n-dot" data-at="${f(ys[0])}" cx="${X}" cy="${f(ys[0])}" r="2.6"/>`+
`<path class="gfx-s1-n gfx-s1-n-x" data-at="${f(ys[1])}" d="M${X-6} ${f(ys[1]+7)}V${f(ys[1]-7)}M${X+6} ${f(ys[1]-7)}V${f(ys[1]+7)}"/>`+
`<circle class="gfx-s1-n gfx-s1-n-ring" data-at="${f(ys[2])}" cx="${X}" cy="${f(ys[2])}" r="7"/><circle class="gfx-s1-n gfx-s1-n-dot" data-at="${f(ys[2])}" cx="${X}" cy="${f(ys[2])}" r="3.6"/>`+
`<path class="gfx-s1-n gfx-s1-n-hd" data-at="${f(yE)}" d="M${tip-9} ${f(yE-rise+2)}L${tip} ${f(yE-rise)}L${tip+1} ${f(yE-rise+10)}"/>`;
fg=$('.gfx-s1-r-fg',rail);paint();
};
build();
let prq=0,pNear=true;const paintSoon=()=>{if(pNear&&!prq)prq=requestAnimationFrame(()=>{prq=0;paint();});};
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{pNear=e.isIntersecting;paint();}),{rootMargin:'100% 0px'}).observe(list);
W.addEventListener('scroll',paintSoon,{passive:true});
let rz=0;W.addEventListener('resize',()=>{cancelAnimationFrame(rz);rz=requestAnimationFrame(build);});
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(build);
}
let portalP=null;
const loadPortal=()=>{
if(portalP)return portalP;
portalP=new Promise(res=>{
if(W.GFSearchScene){res(true);return;}
const base=(W.GFX_PORTAL_BASE||gfx.BASE+'portal/');
const l=D.createElement('link');l.rel='stylesheet';l.href=base+'desktop-portal.css';D.head.appendChild(l);
const s=D.createElement('script');s.src=base+'desktop-portal.js';s.async=true;s.onload=()=>res(!!W.GFSearchScene);s.onerror=()=>res(false);D.head.appendChild(s);
});
return portalP;
};
function pipe(){
const box=$(O('iv2-pipe-in'));if(!box)return;
let started=false;
const tall=()=>{
const fit=()=>{
const view=$('.dp-view',box),frame=$('.dp-frame',box),d=frame&&frame.contentDocument,strip=d&&d.querySelector('.summary-strip');if(!view||!strip)return;
box.style.height='';box.style.aspectRatio='';
const Z=view.clientWidth / Math.max(1,frame.offsetWidth),want=(strip.getBoundingClientRect().bottom+(d.scrollingElement||d.documentElement).scrollTop+28)*Z,dh=Math.ceil(want-view.clientHeight);
if(dh>0){const h0=box.clientHeight;box.style.aspectRatio='auto';box.style.height=(h0+dh)+'px';}
if(ST)ST.refresh();
};
fit();let t=0;W.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(fit,260);});
};
const go=()=>{if(started)return;started=true;loadPortal().then(ok=>{if(!ok)return;const sc=W.GFSearchScene.mount(box,{theme:'dark',autoplay:!REDUCE,loop:false,reducedMotion:REDUCE,frame:true,fit:'fill',
label:'A client’s pipeline in the Grey Fox portal, a commercial HVAC search: the handoff stage, with one company’s note open. Illustrative companies and notes.'});if(sc&&sc.ready)sc.ready.then(tall);});};
if('IntersectionObserver'in W){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();go();}},{rootMargin:'150% 0px'});io.observe(box);}else go();
if(live&&ST){
let lc='';
ST.create({trigger:box,start:'top 96%',end:'top 50%',onUpdate:s=>{const k=eo(s.progress),c=`inset(0 0 ${((1-k)*14).toFixed(2)}% 0 round 10px)`;if(c!==lc){box.style.clipPath=c;lc=c;}},
onRefresh:s=>{const k=eo(s.progress);box.style.clipPath=`inset(0 0 ${((1-k)*14).toFixed(2)}% 0 round 10px)`;}});
}
}
const posterOf=(v,kind)=>v.getAttribute(`data-${kind}-${(W.devicePixelRatio||1)*(S2.winIn?S2.winIn.clientWidth:1200)>1300?2560:1280}`)||v.getAttribute('poster');
const vLoad=(v,eager)=>{if(!v||v._src)return;v._src=true;v.preload=eager?'auto':'metadata';v.src=v.getAttribute('data-src');try{v.load();}catch(e){}};
const vPlay=v=>{if(!v)return;vLoad(v,true);if(v.ended){try{v.currentTime=0;}catch(e){}}const p=v.play();if(p&&p.catch)p.catch(()=>{});};
const vPause=v=>{if(v&&!v.paused)v.pause();};
const STILL=()=>gfx.store.get('gfx-still')==='1';
let E2=0,P2=0,s2Act=-1,s2In=false,s2User=null;
const s2Weights=P=>{const X=0.035,b1=1 / 3,b2=2 / 3;const a=ss(seg(P,b1-X,b1+X)),c=ss(seg(P,b2-X,b2+X));return[1-a,a*(1-c),c];};
const s2Render=()=>{
const E=E2,P=P2;
const k=eo(seg(E,0.3,1)),ix=((1-k)*7).toFixed(2),iy=((1-k)*10).toFixed(2),rr=(16+(1-k)*10).toFixed(1);
const cp=`inset(${iy}% ${ix}% ${iy}% ${ix}% round ${rr}px)`;if(S2.win._cp!==cp){S2.win.style.clipPath=cp;S2.win._cp=cp;}
const sc=`scale(${(1.06-0.06*k).toFixed(4)})`;if(S2.winIn._sc!==sc){S2.winIn.style.transform=sc;S2.winIn._sc=sc;}
show(S2.foot,eo(seg(E,0.62,1)),14);
const w=s2Weights(P),actNow=P<1 / 3?0:P<2 / 3?1:2;
S2.vids.forEach((v,i)=>{const o=i===actNow?'1':'0';if(v._o!==o){v.style.opacity=o;v._o=o;clearTimeout(v._pt);if(o==='0')v._pt=setTimeout(()=>vPause(v),760);}});
S2.bs.forEach((b,i)=>{setVar(b,'--on',w[i]);const f=clamp((P-i / 3)*3,0,1),bar=$('b',b),t=`scaleX(${f.toFixed(4)})`;if(bar&&bar._t!==t){bar.style.transform=t;bar._t=t;}});
if(E>0)vLoad(S2.vids[0],true);
if(P>0.12)vLoad(S2.vids[1],true);
if(P>0.45)vLoad(S2.vids[2],true);
const shown=E>0.92;
if(actNow!==s2Act){s2Act=actNow;s2User=null;S2.bbs.forEach((b,i)=>b.setAttribute('aria-pressed',i===actNow?'true':'false'));S2.vids.forEach((v,i)=>v.toggleAttribute('aria-hidden',i!==actNow));}
const run=s2User==='pause'?false:s2User==='play'?shown&&s2In:shown&&s2In&&!STILL();
if(run)vPlay(S2.vids[actNow]);else vPause(S2.vids[actNow]);
};
const s2Button=()=>{
if(!S2.play||!S2.vids||!S2.vids.length)return;
const cur=()=>S2.vids[s2Act<0?0:s2Act];
const lab=()=>{const v=cur(),on=!!v&&!v.paused&&!v.ended,t=on?'Pause':'Play',s=S2.play.querySelector('span');
if(s&&s.textContent!==t)s.textContent=t;S2.play.dataset.state=on?'pause':'play';S2.play.setAttribute('aria-label',t);};
S2.vids.forEach(v=>['play','pause','ended'].forEach(ev=>v.addEventListener(ev,lab)));
S2.play.hidden=false;
S2.play.addEventListener('click',()=>{const v=cur();if(v&&!v.paused&&!v.ended){s2User='pause';v.pause();}else{s2User='play';vPlay(v);}});
lab();
};
const s2Static=()=>{
if(!S2.vids||!S2.vids.length||!S2.play)return;
let cur=0;
const lab=(t,l)=>{S2.play.querySelector('span').textContent=t;S2.play.setAttribute('aria-label',l);};
const toggle=()=>{
const v=S2.vids[cur];
if(v.paused||v.ended){vPlay(v);S2.play.dataset.state='pause';lab('Pause','Pause');}
else{v.pause();S2.play.dataset.state='play';lab('Play','Play: '+S2.bbs[cur].querySelector(O('iv2-mw')).textContent);}
};
const pick=k=>{
cur=k;
S2.vids.forEach((v,i)=>{v.classList.toggle('is-on',i===k);v.toggleAttribute('aria-hidden',i!==k);if(i!==k)vPause(v);});
S2.bbs.forEach((b,i)=>b.setAttribute('aria-pressed',i===k?'true':'false'));
S2.bs.forEach((b,i)=>{b.style.setProperty('--on',i===k?'1':'0');const bar=$('b',b);if(bar)bar.style.transform=i===k?'scaleX(1)':'scaleX(0)';});
S2.play.dataset.state='play';lab('Play','Play: '+S2.bbs[k].querySelector(O('iv2-mw')).textContent);
};
const phone=mq('(max-width: 767px)');
S2.vids.forEach(v=>{if(!phone)v.poster=posterOf(v,'last');v.addEventListener('ended',()=>{v.poster=posterOf(v,'last');S2.play.dataset.state='play';S2.play.querySelector('span').textContent='Play';});});
S2.play.hidden=false;S2.play.addEventListener('click',toggle);
S2.bbs.forEach((b,i)=>b.addEventListener('click',()=>pick(i)));
pick(0);
};
const MC_ALT=[
'Mission Control: the profile of Ambercote Elevator Co., an illustrative company, with this week’s calls and their notes.',
'Mission Control: the research on Ambercote Elevator Co., an illustrative company: founded 1988, Overland Park, Kansas, one branch, 60 to 75 employees.',
'Mission Control: the firm dashboard, with illustrative figures: 398 engaged, 137 qualified, 101 at handoff and 8 beyond handoff, and the effort across 14 sectors.'];
const MC_KEY=['refined','efficient','transparent'];
function mcPhone(){
if(!S2.winIn||!S2.vids||S2.vids.length!==3||$('.gfx-mc-still',S2.winIn))return;
const src=(i,k)=>gfx.BASE+'investors/mc/mc-'+MC_KEY[i]+'-'+k+'.webp';
let lb=null,opener=null;
const close=()=>{
if(!lb)return;lb.hidden=true;H.classList.remove('gfx-mc-open');
if(gfx.lenis&&gfx.lenis.start)gfx.lenis.start();
if(opener)opener.focus({preventScroll:true});
};
const open=(i,btn)=>{
if(!lb){
lb=D.createElement('div');lb.className='gfx-mc-lb';lb.hidden=true;
lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Mission Control, full size');
lb.innerHTML='<div class="gfx-mc-lb-sc"><img alt="" decoding="async"></div><button type="button" class="gfx-mc-lb-x" aria-label="Close">×</button><p class="gfx-mc-lb-cap">Slide sideways to read across</p>';
D.body.appendChild(lb);
$('.gfx-mc-lb-x',lb).addEventListener('click',close);
lb.addEventListener('click',e=>{if(e.target===lb)close();});
D.addEventListener('keydown',e=>{if(e.key==='Escape'&&lb&&!lb.hidden)close();});
}
opener=btn;const img=$('img',lb);img.src=src(i,'full');img.alt=MC_ALT[i];
lb.hidden=false;$('.gfx-mc-lb-sc',lb).scrollLeft=0;H.classList.add('gfx-mc-open');
if(gfx.lenis&&gfx.lenis.stop)gfx.lenis.stop();
$('.gfx-mc-lb-x',lb).focus({preventScroll:true});
};
S2.vids.forEach((v,i)=>{
const name=S2.bbs[i]?(S2.bbs[i].querySelector(O('iv2-mw'))||S2.bbs[i]).textContent.trim():MC_KEY[i];
v.insertAdjacentHTML('afterend',`<button type="button" class="gfx-mc-still" aria-label="${esc('Open Mission Control full size: '+name)}"><img src="${esc(src(i,'phone'))}" alt="${esc(MC_ALT[i])}" width="1170" height="658" loading="lazy" decoding="async"></button>`);
v.nextElementSibling.addEventListener('click',e=>open(i,e.currentTarget));
});
}
function stagesLive(){
if(S1.track){
ST.create({trigger:S1.track,start:'top bottom',end:'top top',onUpdate:s=>{E1=s.progress;s1Render();},onRefresh:s=>{E1=s.progress;s1Render();}});
ST.create({trigger:S1.track,start:'top top',end:'bottom bottom',onUpdate:s=>{P1=s.progress;s1Render();},onRefresh:s=>{P1=s.progress;s1Render();}});
}
if(S2.track&&S2.win&&S2.winIn){
S2.vids.forEach(v=>{v.poster=posterOf(v,'first');});
s2Button();
ST.create({trigger:S2.track,start:'top bottom',end:'top top',onUpdate:s=>{E2=s.progress;s2Render();},onRefresh:s=>{E2=s.progress;s2Render();}});
ST.create({trigger:S2.track,start:'top top',end:'bottom bottom',onUpdate:s=>{P2=s.progress;s2Render();},onRefresh:s=>{P2=s.progress;s2Render();}});
ST.create({trigger:S2.track,start:'top bottom',end:'bottom top',onToggle:s=>{s2In=s.isActive;s2Render();if(!s2In)S2.vids.forEach(vPause);}});
S2.bbs.forEach((b,i)=>b.addEventListener('click',()=>{
const top=S2.track.getBoundingClientRect().top+sy(),span=S2.track.offsetHeight-W.innerHeight;
gfx.scrollToY(top+span*(i / 3+1 / 6),1.4);
}));
const tall=on=>{const s=S2.stage.style;if(on){s.setProperty('height','auto','important');s.setProperty('min-height','100svh','important');s.setProperty('grid-template-rows','auto auto auto','important');s.top=Math.min(0,W.innerHeight-S2.stage.offsetHeight)+'px';}else{['height','min-height','grid-template-rows','top'].forEach(p=>s.removeProperty(p));}};
const fit=()=>{
S2.stage.style.setProperty('--iv2-mw',S2.win.offsetWidth+'px');
const was=S2.stage.hasAttribute('data-gfx-tall');tall(false);
const rows=getComputedStyle(S2.stage).gridTemplateRows.split(' ').map(parseFloat);
const on=!!S2.foot&&rows.length===3&&rows[1]-(S2.foot.offsetHeight-rows[2])<16;
S2.stage.toggleAttribute('data-gfx-tall',on);if(on)tall(true);
return on!==was;
};
if(fit())ST.refresh();W.addEventListener('resize',fit);ST.addEventListener('refreshInit',fit);
}
ST.addEventListener('refresh',()=>{s1Layout();s1Render();});
W.addEventListener('resize',()=>{s1Layout();s1Render();});
}
let closeMark=null;
function closeInit(){
const room=R.close;if(!room)return;
rise(CL.h);
if('IntersectionObserver'in W&&!REDUCE&&CL.top){const aio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){room.classList.add('gfc-in');aio.disconnect();}}),{rootMargin:'0px 0px -28% 0px'});aio.observe(CL.top);}
else room.classList.add('gfc-in');
}
function closeMarkInit(still){
const room=R.close;if(!room||!W.gfArrow||!CL.h||!CL.top||closeMark)return;
const mark=W.gfArrow.word({el:CL.h,host:CL.top,cls:'gfc-mark',auto:!still});
if(!mark)return;closeMark=mark;
if(still){if(mark.still)mark.still();room.classList.add('gfc-in');return;}
let near=false,rq=0;
const seenFa=fa=>{const b=fa.getBoundingClientRect();if(!(b.width>0&&b.top<W.innerHeight&&b.bottom>0))return false;const x=Math.min(W.innerWidth-1,Math.max(0,b.left+b.width / 2)),y=Math.min(W.innerHeight-1,Math.max(0,b.top+b.height / 2)),e=D.elementFromPoint(x,y);return!!(e&&e.closest('.footer_section_wrapper'));};
const check=()=>{rq=0;const fa=$('.gfx-fi-act');if(!fa)return;const cr=room.getBoundingClientRect(),k=Math.max(0,Math.min(cr.bottom,W.innerHeight)-Math.max(cr.top,0)) / (cr.height||1);room.classList.toggle('gfc-rest',near&&k<=0.4&&seenFa(fa));};
const ask=()=>{if(near&&!rq){rq=1;((W.gfx&&W.gfx.postFrame)||requestAnimationFrame)(check);}};
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{near=e.isIntersecting;ask();})).observe(room);
W.addEventListener('scroll',ask,{passive:true});W.addEventListener('resize',ask);
}
function still(){
gsap=W.gsap||null;ST=W.ScrollTrigger||null;
H.classList.remove('iv2-live');live=false;
H.classList.add('ow-hero-on','ow-ready','gfx-ready');
safe('stage 1 still',()=>{s1Layout();s1Still();W.addEventListener('resize',()=>{s1Layout();s1Still();});});
safe('stage 2 still',s2Static);
safe('mc phone',mcPhone);
safe('stage 1 phone',()=>s1Phone(true));
safe('pipe',pipe);
safe('pairs',pairs);
if(R.close)R.close.classList.add('gfc-in');
if(W.gfArrow)safe('close mark',()=>closeMarkInit(true));
safe('inks',inks);
}
gfx.page({
field,
foot:{close:O('iv-close')},
fox:O('iv-close')+' '+O('ow-close-fox'),
dom:()=>{safe('dom',dom);},
start:()=>{
gsap=gfx.gsap;ST=gfx.ST;
safe('inks',inks);
safe('hero',heroInit);
},
rooms:()=>{
safe('breath',breathInit);
safe('delivery',()=>{$$(O('iv-client')+' '+O('ow-open')).length&&roomHead(R.del);deliveryInit();});
safe('mc head',()=>roomHead(R.mc));
safe('cases head',()=>roomHead(R.cases));
safe('cases',casesInit);
safe('care',careInit);
safe('close',closeInit);
safe('pairs',pairs);
safe('stage 1 layout',s1Layout);
safe('pipe',pipe);
if(live)safe('stages',stagesLive);
else{safe('stage 1 still',()=>{s1Still();W.addEventListener('resize',()=>{s1Layout();s1Still();});});safe('stage 2 still',s2Static);safe('mc phone',mcPhone);safe('stage 1 phone',()=>s1Phone(false));}
H.classList.add('ow-ready');
if(W.ivHeroGo)requestAnimationFrame(()=>requestAnimationFrame(W.ivHeroGo));
refresh();
},
late:()=>{safe('close mark',()=>closeMarkInit(false));},
still
});
})();
