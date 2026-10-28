/*! Grey Fox · Insights v2 (Flow 3) · core 1.0.51 + pages 1.0.3 + insights 1.3.1 · minified bundle of core/gfx-core.js + pages/gfx-pages.js + insights/gfx-insights.js (read those for the notes) */
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
const VERSION='1.0.51';
const DEBUG= /[?&]gfxdebug(&|$)/.test(location.search);
const log=(where,e)=>{if(DEBUG){try{console.warn('[gfx] '+where,e);}catch(x){}}};
const safe=(where,fn)=>{try{return fn();}catch(e){log(where,e);return undefined;}};
const mq=q=>{try{return W.matchMedia(q).matches;}catch(e){return false;}};
const REDUCE=!!G.reduced(),TOUCH=mq('(pointer: coarse)');
const RESTORING=!REDUCE&&(()=>{try{const t=(performance.getEntriesByType('navigation')[0]||{}).type;if(t!=='reload'&&t!=='back_forward')return false;const sv=JSON.parse(W.sessionStorage.getItem('gfxFlowAt:'+location.pathname)||'null');return!!(sv&&(sv.i>0||sv.f>0.15));}catch(e){return false;}})();
const unhide=()=>{if(!H.classList.contains('gfx-restoring'))return;H.classList.add('gfx-restore-in');H.classList.remove('gfx-restoring');setTimeout(()=>H.classList.remove('gfx-restore-in'),450);};
try{clearTimeout(W.__gfxRestoreT);}catch(e){}
if(!RESTORING)H.classList.remove('gfx-restoring');
if(RESTORING){H.classList.add('gfx-restoring');const st=D.createElement('style');st.id='gfx-restore';st.textContent='html.gfx-restoring .page-wrapper{opacity:0!important}html.gfx-restore-in .page-wrapper{transition:opacity .3s cubic-bezier(.16,1,.3,1)!important}';(D.head||H).appendChild(st);setTimeout(unhide,2200);}
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
return{shape:ribbon(pts),centre:'M'+pts.map(function(p){return f2(p[0])+' '+f2(p[1]);}).join(' L'),ux:ux,uy:uy,A:A,B:B,C:C,bow:bow,x0:x0,y0:y0};
};
var sizes=function(fs){var rise=clamp(fs*0.26,7,14);return{rise:rise,run:rise / TAN,len:clamp(fs*0.22,7,12),w:1.9};};
var EARS=1.2;
var strokePath=function(g,withHead,x2,y2){
var runL=g.A[0]-g.x0,d='M'+f2(g.x0)+' '+f2(g.y0)+' Q'+f2(g.x0+runL / 2)+' '+f2(g.y0-2*g.bow)+' '+f2(g.A[0])+' '+f2(g.A[1]);
if(withHead)d+=' Q'+f2(g.C[0])+' '+f2(g.C[1])+' '+f2(g.B[0])+' '+f2(g.B[1])+' L'+f2(x2)+' '+f2(y2);
return d;
};
var earPaths=function(x,y,ux,uy,len){var ang=Math.atan2(uy,ux)+Math.PI;return[1,-1].map(function(sg){var a=ang+sg*SPREAD,bend=sg*0.12;return'M'+f2(x)+' '+f2(y)+' Q'+f2(x+Math.cos(a+bend)*len*0.5)+' '+f2(y+Math.sin(a+bend)*len*0.5)+' '+f2(x+Math.cos(a)*len)+' '+f2(y+Math.sin(a)*len);});};
var DASH='pathLength="1" fill="none" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:1;stroke-dashoffset:';
var headStroke=function(svg,x,y,ux,uy,len,at){
var g=D.createElementNS(NS,'g');g.setAttribute('class','gfa-head');g.setAttribute('data-gfa-head','');
g.innerHTML=earPaths(x,y,ux,uy,len).map(function(d){return'<path class="gfa-se" d="'+d+'" '+DASH+'1"/>';}).join('');
svg.appendChild(g);var es=g.querySelectorAll('path');
var set=function(k){var v=f2(1-clamp(k,0,1));for(var i=0;i<es.length;i++)es[i].style.strokeDashoffset=v;};
set(at==null?0:at);
return{g:g,set:set,remove:function(){g.remove();}};
};
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
var p=D.createElementNS(NS,'path');p.setAttribute('class','gfa-m gfa-s');p.setAttribute('d',strokePath(g,withHead,x2,y2));p.setAttribute('pathLength','1');
p.setAttribute('fill','none');p.setAttribute('stroke-linecap','round');p.setAttribute('stroke-linejoin','round');p.setAttribute('style','stroke-dasharray:1;stroke-dashoffset:1');svg.appendChild(p);
var hd=withHead?headStroke(svg,x2,y2,g.ux,g.uy,sz.len*EARS,0):null;
var set=function(l,h){p.style.strokeDashoffset=f2(clamp(l,0,1));if(hd)hd.set(h);};
var at=function(t){var k=timing(t);set(k.l,k.h);};
at(o.at==null?0:o.at);
return{at:at,set:set,DUR:1.6,tip:[x2,y2],remove:function(){p.remove();if(hd)hd.remove();}};
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
svg.innerHTML='<path class="gfa-m gfa-s" d="'+strokePath(g,withHead,x2,y2)+'" '+DASH+f2(lAt)+'"/>';
hd=withHead?headStroke(svg,x2,y2,g.ux,g.uy,s.len*EARS,hAt):null;
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
var out=top<z-2&&!H.classList.contains('gfx-bar-away');if(out!==zoneOut){zoneOut=out;svg.style.opacity=out?'0':'';}};
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
var inkAt=mid*dur+INK_LAG,t0=performance.now(),hb=0,ht0=0,hd=0;
var step=function(now){
raf=0;if(dead)return;
var el=now-t0,t=hd?Math.min(1,hb+(1-hb)*(now-ht0) / hd):Math.min(1,el / dur),c=mixL(from,to,ease(t,toDark));
o.onFrame&&o.onFrame(c);
if(!inkDone&&(hd?t>=mid:el>=inkAt)){inkDone=true;o.onInk&&o.onInk();}
if(t<1||!inkDone)raf=requestAnimationFrame(step);else resolve();
};
raf=requestAnimationFrame(step);
return{cancel:function(){dead=true;if(raf)cancelAnimationFrame(raf);resolve();},done:done,toDark:toDark,
hurry:function(ms){if(dead||hd)return;var now=performance.now();hb=Math.min(1,(now-t0) / dur);ht0=now;hd=Math.max(16,ms);}};
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
let footTone=null;
let calmUntil=(()=>{try{const t=(performance.getEntriesByType("navigation")[0]||{}).type;return t==="reload"||t==="back_forward"?performance.now()+1600:0;}catch(e){return 0;}})();
let footOpen=null;
const hurryTurn=()=>{if(fade&&fade.h&&fade.h.hurry)fade.h.hurry(160);};
let navs=null;
const navTone=s=>{
if(!navs||!navs.length){navs=$$('.gfx-nav');if(navs.length&&!$('#gfx-nav-field')){const st=D.createElement('style');st.id='gfx-nav-field';st.textContent='html.gfx-f3 .gfx-nav[data-gfx-fc]::before{background-color:var(--gfx-fc)!important;transition:box-shadow .1s linear!important}';D.head.appendChild(st);}}
for(const n of navs){n.style.setProperty('--gfx-fc',s);if(!n.hasAttribute('data-gfx-fc'))n.setAttribute('data-gfx-fc','');}
};
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
for(const e of opaque)e.style.setProperty('background-color','transparent','important');
};
let lastC='',lastTone='',shown=null,fade=null,fadeRaf=0,toningT=0;
const ease3=t=>(t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3) / 2);
const apply=(c,tone)=>{
const s=css(c);
if(s!==lastC){lastC=s;D.body.style.backgroundColor=s;if(footTone)footTone(s);navTone(s);fieldListeners.forEach(f=>safe('field listener',()=>f(s,c)));}
if(tone!==lastTone){
if(lastTone){H.classList.add('gfx-toning');clearTimeout(toningT);toningT=setTimeout(()=>H.classList.remove('gfx-toning'),220);}
lastTone=tone;
H.classList.toggle('gfx-tone-dark',tone==='D');H.classList.toggle('gfx-tone-light',tone!=='D');
if(footTone)footTone(null);
}
};
const fadeStep=()=>{
fadeRaf=0;if(!fade||fade.h)return;
const f=fade;f.ink=f.tf;
f.h=W.gfTurn.run({from:f.from,to:f.to,reduce:REDUCE,
onFrame:c=>{if(fade!==f)return;shown=c;apply(c,f.ink);},
onInk:()=>{if(fade!==f)return;f.ink=f.tt;apply(shown,f.tt);}});
f.h.done.then(()=>{if(fade===f){shown=f.to.slice();apply(shown,f.tt);fade=null;}});
if(footOpen&&footOpen())hurryTurn();
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
if(!shown||REDUCE||performance.now()<calmUntil){if(fade&&fade.h)fade.h.cancel();fade=null;shown=c;apply(c,tone);return;}
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
const turn=Math.max(224*cl(0.6,vh / 900,1),vh*0.35);
if(W.innerWidth<=767){const g=parseFloat(getComputedStyle(D.documentElement).getPropertyValue('--_phone---section-gap'))||80;return{tight:g,standard:g,breath:Math.round(g*1.6),turn:Math.max(192,vh*0.3)};}
if(phone)return{tight:80,standard:96,breath:128,turn:Math.max(192,vh*0.3)};
const k=cl(0.6,vh / 900,1);
return{tight:cl(64*k,vh*0.0711,93)*2,standard:cl(96*k,vh*0.1067,139)+cl(64*k,vh*0.0711,93),breath:cl(192*k,vh*0.2133,278)+cl(96*k,vh*0.1067,139),turn};
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
calmUntil=performance.now()+450;
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
const holdPlace=()=>{if(!pending)pending=lastPlace||placeNow(true);clearTimeout(pendT);pendT=setTimeout(()=>{if(pending)goPlace(pending);pending=null;requestAnimationFrame(()=>requestAnimationFrame(unhide));},1700);};
rhythm();
let rw=W.innerWidth,rh=W.innerHeight,rt=0;
addEventListener('resize',e=>{if(e.target!==W)return;if(W.innerWidth===rw&&Math.abs(W.innerHeight-rh)<120&&TOUCH)return;holdPlace();rw=W.innerWidth;rh=W.innerHeight;clearTimeout(rt);rt=setTimeout(()=>{rhythm();ST.refresh();},220);},true);
const nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]||{}).type;
let saved=null;try{saved=JSON.parse(W.sessionStorage.getItem(KEYP)||'null');}catch(e){}
if(saved&&(nav==='reload'||nav==='back_forward')){
pending=saved;clearTimeout(pendT);const t0=performance.now();let lastH=-1,calm=0;
const check=()=>{const h=D.documentElement.scrollHeight;calm=Math.abs(h-lastH)<2?calm+1:0;lastH=h;
if((calm>=4&&(!D.fonts||D.fonts.status==='loaded'))||performance.now()-t0>1400){if(pending)goPlace(pending);pending=null;requestAnimationFrame(()=>requestAnimationFrame(unhide));}else pendT=setTimeout(check,100);};
pendT=setTimeout(check,100);
}
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
if('ResizeObserver'in W){let lastH=D.documentElement.scrollHeight,rt2=0;new ResizeObserver(()=>{const h=D.documentElement.scrollHeight;if(Math.abs(h-lastH)<2)return;lastH=h;clearTimeout(rt2);rt2=setTimeout(()=>{if(ST)ST.refresh();measure();paint();},150);}).observe(D.body);}
W.gfxField={turns:()=>turns,spans:()=>lastSpans,paint,measure,rhythm,place:{now:placeNow,go:goPlace}};
}
const early=()=>safe('early field',()=>{if(!fieldDef)return;if(performance.now()<calmUntil&&W.scrollY>W.innerHeight*0.5)return;if(!fieldRooms.length)setupRooms();measure();paint();});
const barEase=t=>{const c=[0.16,1,0.3,1];let x=t;for(let i=0;i<6;i++){const bx=3*c[0]*x*(1-x)*(1-x)+3*c[2]*x*x*(1-x)+x*x*x-t,d=3*c[0]*(1-x)*(1-x)+6*(c[2]-c[0])*x*(1-x)+3*(1-c[2])*x*x;if(Math.abs(bx)<1e-5||!d)break;x-=bx / d;}return 3*c[1]*x*(1-x)*(1-x)+3*c[3]*x*x*(1-x)+x*x*x;};
const navLook=top=>safe('nav look',()=>{
const bar=$('.gfx-nav');if(!bar)return;
navTop=top;
$$('.'+NAV_VAR+', [data-gfx-var]',bar).forEach(e=>{e.setAttribute('data-gfx-var','');e.classList.toggle(NAV_VAR,!top);});
bar.classList.toggle('gfx-top',top);H.classList.toggle('gfx-bar-top',top);
});
function phoneMenu(){
const bar=$('.w-nav'),btn=$('.w-nav-button',bar),menu=$('.w-nav-menu',bar);if(!bar||!btn||!menu)return;
let open=false,liveT=0;
const set=on=>{open=on;clearTimeout(liveT);if(on)H.classList.add('gfx-menu-live');else liveT=setTimeout(()=>H.classList.remove('gfx-menu-live'),420);H.classList.toggle('gfx-menu-open',on);btn.classList.toggle('w--open',on);btn.setAttribute('aria-expanded',on?'true':'false');menu.setAttribute('aria-hidden',on?'false':'true');
if(W.lenis&&W.lenis.stop&&W.lenis.start){try{on?W.lenis.stop():W.lenis.start();}catch(e){}}};
const swallow=e=>{if(e.target===btn||btn.contains(e.target))e.stopPropagation();};
D.addEventListener('touchstart',swallow,true);D.addEventListener('touchend',swallow,true);D.addEventListener('mousedown',swallow,true);
D.addEventListener('click',e=>{if(e.target===btn||btn.contains(e.target)){e.stopPropagation();e.preventDefault();set(!open);}},true);
$$('a',menu).forEach(a=>a.addEventListener('click',()=>{if(open)set(false);}));
D.addEventListener('keydown',e=>{if((e.key==='Escape'||e.key==='Esc')&&open){set(false);btn.focus();}},true);
addEventListener('resize',()=>{if(open&&W.innerWidth>=992)set(false);});
menu.setAttribute('aria-hidden','true');btn.setAttribute('aria-expanded','false');
}
function navReserve(){$('.nav_desktop > a.navigation-item').forEach(a=>{if(!a.hasAttribute('data-gfx-t'))a.setAttribute('data-gfx-t',a.textContent.trim());});}
function layoutReport(){
const fs=function(){try{if(typeof W.FS==='function')W.FS.apply(null,arguments);}catch(e){}};
if(navigator.webdriver){fs('shutdown');return;}
const page=location.pathname;
const base=()=>({w:W.innerWidth,h:W.innerHeight,dpr:+(W.devicePixelRatio||1).toFixed(2),touch:TOUCH,page:page,core:VERSION});
setTimeout(()=>fs('trackEvent',{name:'gfx_viewport',properties:base()}),2500);
let sent=false,n=0,t=0;
const scan=()=>{
const vw=W.innerWidth,vh=W.innerHeight,cols=24,rows=24,grid=new Uint8Array(cols*rows);
const mark=r=>{const x0=Math.max(0,Math.floor(r.left / vw*cols)),x1=Math.min(cols-1,Math.floor((r.right-1) / vw*cols)),y0=Math.max(0,Math.floor(r.top / vh*rows)),y1=Math.min(rows-1,Math.floor((r.bottom-1) / vh*rows));for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)grid[y*cols+x]=1;};
const spans=new Map();
for(const e of D.body.querySelectorAll('*')){
if(e.closest('.gfx-nav, .w-nav, .gfx-skip'))continue;
const r=e.getBoundingClientRect();if(r.bottom<=0||r.top>=vh||r.right<=0||r.left>=vw||r.width<6||r.height<6)continue;
const cs=getComputedStyle(e);if(cs.visibility==='hidden'||+cs.opacity<0.08)continue;
const tag=e.tagName;let content= /^(IMG|CANVAS|VIDEO|SVG|PICTURE|IFRAME)$/.test(tag);
let text=false;if(!content){for(const c of e.childNodes){if(c.nodeType===3&&c.textContent.trim()){text=true;try{const rg=D.createRange();rg.selectNodeContents(c);for(const lr of rg.getClientRects())if(lr.width>1&&lr.height>1)mark(lr);}catch(x){mark(r);}}}}
if(!content&&!text){if(cs.borderTopStyle!=='none'&&cs.borderTopWidth!=='0px')mark({left:r.left,right:r.right,top:r.top,bottom:r.top+2});if(cs.borderBottomStyle!=='none'&&cs.borderBottomWidth!=='0px')mark({left:r.left,right:r.right,top:r.bottom-2,bottom:r.bottom});if(cs.backgroundImage!=='none'&&r.width<vw*0.98)content=true;}
if(!content&&!text)continue;
if(content)mark(r);const s=e.closest('section, footer, .gfx-fr');if(s){const o=spans.get(s)||{l:1e9,r:0};o.l=Math.min(o.l,r.left);o.r=Math.max(o.r,r.right);spans.set(s,o);}
}
let run=0,band=0;for(let y=0;y<rows;y++){let empty=true;for(let x=0;x<cols;x++)if(grid[y*cols+x]){empty=false;break;}run=empty?run+1:0;if(run>band)band=run;}
run=0;let col=0;for(let x=0;x<cols;x++){let empty=true;for(let y=2;y<rows;y++)if(grid[y*cols+x]){empty=false;break;}run=empty?run+1:0;if(run>col)col=run;}
let found=null;
if(band / rows>=0.45)found={kind:'band',share:+(band / rows).toFixed(2)};
else if(col / cols>=0.4)found={kind:'column',share:+(col / cols).toFixed(2)};
else spans.forEach((o,s)=>{if(found)return;const sr=s.getBoundingClientRect();if(sr.top>vh*0.1||sr.bottom<vh*0.9)return;const share=(o.r-o.l) / vw;if(share<0.6)found={kind:'narrow',share:+share.toFixed(2),sec:(s.className||'').toString().slice(0,40)};});
return found;
};
const measure=()=>{
if(sent||n++>40||W.innerWidth<992||D.hidden)return;
const f=scan();if(!f)return;const y=W.scrollY;
setTimeout(()=>{if(sent||Math.abs(W.scrollY-y)>5)return;const g=scan();if(!g)return;sent=true;fs('trackEvent',{name:'gfx_layout_hole',properties:Object.assign(base(),{y:Math.round(y)},g)});if(DEBUG)log('layout hole',JSON.stringify(g));},1200);
};
const arm=()=>{if(!t)t=setTimeout(()=>{t=0;measure();},600);};
addEventListener('scroll',arm,{passive:true});addEventListener('resize',arm);
setTimeout(measure,3000);
W.gfxLayoutReport=measure;
}
function menuFoot(){
const menu=$('.w-nav-menu');if(!menu||$('.gfx-menu-foot',menu))return;
const cta=$$('.gfx-nav a, .w-nav a').find(a=> /^start a conversation$/i.test(a.textContent.trim()));
const href=(cta&&cta.getAttribute('href'))||'/contact';
menu.insertAdjacentHTML('beforeend',`<div class="gfx-menu-foot"><a class="gfx-menu-cta" href="${href}">Start a conversation</a><ul class="gfx-menu-lines"><li><a href="mailto:inquiries@greyfoxpartners.com"><span>Write to us</span>inquiries@greyfoxpartners.com</a></li><li><a href="tel:+16469466641"><span>Telephone</span>(646) 946-6641</a></li></ul></div>`);
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
safe('nav name',navName);
safe('top tint',topTint);
const bar=$('.gfx-nav');if(!bar)return;
if(!$('#gfx-fox-phone')){const st=D.createElement('style');st.id='gfx-fox-phone';st.textContent='@media (max-width:767px){html.gfx-f3 .gfx-nav.gfx-fox-away .logo-link{opacity:1!important;pointer-events:auto;transition-duration:.35s}}';(D.head||H).appendChild(st);}
if(!$('#gfx-bar-btn')){const st=D.createElement('style');st.id='gfx-bar-btn';st.textContent='html.gfx-f3 .gfx-nav:not(.gfx-top) .button_wrapper.show{display:block!important}'+
'html body .w-nav-button.w--open [class*="hamburger_line"]:not(#gfx-mo){background-color:transparent!important}html body .w-nav .w-nav-brand{position:relative;z-index:3}'+
'html.gfx-f3:has(.gfx-hero-sec) .gfx-nav.gfx-top :focus-visible{outline-color:#fff!important}'+
'html.gfx-f3 .gfx-nav:has(:focus-visible){--gfx-away:0!important}@media (max-width:767px){html.gfx-f3 .gfx-nav:has(:focus-visible){transform:none!important}}@media (min-width:992px){html.gfx-f3 .gfx-nav:has(:focus-visible) .navigation-wrap>*{opacity:1!important;transform:none!important}}html.gfx-f3 .gfx-nav:has(:focus-visible) .logo-link{opacity:1!important;visibility:visible!important;pointer-events:auto!important}'+
'html.gfx-f3 .gfx-fi-lockup{transition:opacity .25s}html.gfx-f3 .gfx-fi-lockup:hover{opacity:.8}'+
'html.gfx-f3 .gfx-fi-legal{align-items:center}html.gfx-f3 .gfx-fi-linkedin{text-decoration:none!important;color:var(--gfx-ft-ink)!important;transition:color .25s}html.gfx-f3 .gfx-fi-linkedin svg{display:block;width:18px;height:18px}@media (hover:hover){html.gfx-f3 .gfx-fi-linkedin:hover{color:#2f9a6c!important}}html.gfx-f3 .gfx-fi-linkedin:focus-visible{outline:2px solid #2f9a6c;outline-offset:3px;border-radius:2px}@media (max-width:767px){html.gfx-f3 .gfx-fi-linkedin svg{width:20px;height:20px}}'+
'html body :is(.gfx-cta-sec .footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox){height:min(64vh,744px)!important}'+
'html body :is(.gfx-cta-sec,[data-o~="ow-close"],.gfc-on):has(:is(.footer-logo-subtle,[data-o~="ow-close-fox"],[data-o~="gfc-fox"],.gfc-fox)){overflow-y:clip!important}'+
'@media (max-width:767px){html.gfx-f3 .gfx-fi-rule{display:none!important}}'+
'html.gfx-f3 .gfx-nav:not(.gfx-top) :is(.navigation_items,.w-nav-menu,.button){-webkit-backdrop-filter:none!important;backdrop-filter:none!important}'+
'@media (max-width:991px){html.gfx-f3 :is(h1,h2,h3,h4,[data-o~="gi-tile-t"],[data-o~="gi-sec-h"]){text-wrap:balance}}'+
'html.gfx-f3 :is([data-o~="gi-tile-t"],[data-o~="gi-card-t"],[data-o~="ow-acc-h"]){text-wrap:balance}'+
'@media (max-width:767px){html.gfx-f3 :is(.gfx-pg-tp-u,sup>a){position:relative}html.gfx-f3 :is(.gfx-pg-tp-u,sup>a)::after{content:"";position:absolute;inset:-9px -8px}}'+
'@media print{@page{margin:14mm 14mm 16mm}html.gfx-f3,html.gfx-f3 body{background:#fff!important;color:#111!important;height:auto!important;overflow:visible!important}'+
'html.gfx-f3 body *{color:#111!important;-webkit-text-fill-color:#111!important;text-shadow:none!important;box-shadow:none!important;border-color:#c8c8c8!important}'+
'html.gfx-f3 body *:not(img,svg,svg *,video,canvas),html.gfx-f3 body *::before,html.gfx-f3 body *::after{background-color:transparent!important}html.gfx-f3 body .gfx-pg-t2-p-w{background-image:none!important}'+
'html.gfx-f3:not(#gfx-pa):not(#gfx-pb):not(#gfx-pc) body :is(a,button):is([data-o~="gfc-btn"],.button,.w-button,[class*="-btn"]){background:transparent!important;color:#111!important;-webkit-text-fill-color:#111!important;border:1px solid #111!important}'+
'html.gfx-f3 body .gfx-pg-t3-card{display:block!important;height:auto!important;min-height:0!important}html.gfx-f3 body .gfx-pg-t2-p-pic{position:relative!important;inset:auto!important;height:auto!important;aspect-ratio:5/8}html.gfx-f3 body .gfx-pg-t2-p-w{position:static!important;padding-top:10px!important}'+
'html.gfx-f3 body :is(.gfx-skip,.gfx-nav,.navigation_wrapper,.preloader,.gfx-intro-mark,.gfx-fly,.gfx-ftg-host>.footer_section_wrapper.gfx-foot,.footer_section_wrapper,video,.gfx-pull-mark,.gfx-pg-gfc-fox,[data-o~="gi-toc-m"],[data-o~="gi-aside"]){display:none!important}'+
'html.gfx-f3 .gfx-ftg-host{min-height:0!important;padding-bottom:0!important;margin-bottom:0!important}html.gfx-f3 :is(.gfx-pg-tp-facts,.gfx-pg-gi-aside-in,.gfx-pg-pv-toc){position:static!important}'+
'html.gfx-f3 body :is(p,h1,h2,h3,h4,h5,h6,blockquote,figcaption,figure,li,ul,ol,dl,dt,dd,img,picture,[data-o],[data-gfx-reveal],.team_member_description,.hero_buttons,.button_wrapper,.gfx-ink-card,.gfx-ink-r,.gfx-marq,.gfx-mk-steps):not(.gfx-mk-cap,.gfx-mk-cap *,.gfx-mk-sr,.gfx-fly *){opacity:1!important}'+
'html.gfx-f3 body :is(p,h1,h2,h3,h4,h5,h6,blockquote,figcaption,li,dt,dd,[data-gfx-reveal]):not([data-o~="gi-plate-in"] *,.gfx-mk-cap,.gfx-mk-cap *){transform:none!important;translate:none!important;scale:none!important}'+
'html.gfx-f3 body :is(img,picture,[data-o~="iv-case-bg"]){clip-path:none!important}html.gfx-f3:not(#gfx-pa) body [data-o~="gi-plate-hero"]{height:auto!important;aspect-ratio:16/10!important}'+
'html.gfx-f3:not(#gfx-pa) body [data-o~="ow-hero-pic"]{position:relative!important;inset:auto!important;grid-row:auto!important;grid-column:1/-1!important;margin-inline:0!important;clip-path:none!important;width:100%!important;height:auto!important;aspect-ratio:3/2;margin-top:8mm!important}'+
'html.gfx-f3 :is(h1,h2,h3,h4){break-after:avoid}html.gfx-f3 :is(img,figure,blockquote,li,dt,dd){break-inside:avoid}'+
'html.gfx-f3 p :is(.tp-sl-mask,.tp-sl){display:inline!important}html.gfx-f3 a:is([href^="mailto:"],[aria-label],:has(svg,img))::after{content:none!important}'+
'html.gfx-f3 body::after{content:"Grey Fox Partners  \\00B7  greyfoxpartners.com  \\00B7  inquiries@greyfoxpartners.com\\AGrey Fox Partners represents buyers. Nothing on this site is an offer or advice.";white-space:pre-line;display:block;margin-top:12mm;padding-top:4mm;border-top:1px solid #c8c8c8;font:11px/1.4 "DM Sans",sans-serif;color:#555!important;-webkit-text-fill-color:#555!important}}';(D.head||H).appendChild(st);}
let showing=true,upFrom=null,prevY=null;
gsap.set(bar,{'--gfx-away':0});
const setShown=want=>{
if(want===showing)return;showing=want;
gsap.to(bar,{'--gfx-away':want?0:1,duration:0.45,ease:barEase,overwrite:true});
bar.classList.toggle('gfx-away',!want);H.classList.toggle('gfx-bar-away',!want);
};
const kbFocus=()=>{const a=D.activeElement;if(!a||!bar.contains(a))return false;try{return a.matches(':focus-visible');}catch(e){return true;}};
bar.addEventListener('focusin',()=>{if(kbFocus())setShown(true);});
const past=ST.create({start:()=>W.innerHeight*0.5,end:'max',
onUpdate:s=>{
const y=s.scroll(),py=prevY==null?y:prevY;prevY=y;
if(s.direction>0)upFrom=null;else if(upFrom==null)upFrom=py;
const up=s.direction<0&&upFrom!=null&&upFrom-y>=6;
setShown(up||(showing&&s.direction<0)||s.progress<0.002||kbFocus());
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
if(!data.mail.length)data.mail=['inquiries@greyfoxpartners.com'];
data.copy=data.copy.split(/\b20\d\d\b/).join(String(new Date().getFullYear()));
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
`<ul class="gfx-fi-list gfx-fi-legal">${data.legal.map(([t,h])=>`<li><a class="gfx-fi-link" href="${esc(h)}">${esc(t)}</a></li>`).join('')}`+
`<li class="gfx-fi-li-linkedin"><a class="gfx-fi-link gfx-fi-linkedin" href="https://www.linkedin.com/company/greyfoxpartners/" target="_blank" rel="noopener" aria-label="Grey Fox Partners on LinkedIn (opens in a new tab)"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a></li></ul></div></div></div>`;
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
const fiEl=$('.gfx-fi',foot);
const flowTone=()=>{if(!fiEl)return;const on=mode==='flow';fiEl.style.transition=on?'opacity .35s cubic-bezier(.16, 1, .3, 1)':'';fiEl.style.opacity=on&&H.classList.contains('gfx-tone-light')?'0':'';};
footOpen=()=>(mode==='reveal'?prog>0.001:foot.getBoundingClientRect().top<W.innerHeight);
const openNow=()=>H.classList.toggle('gfx-ftg-open',prog>=0.34&&!H.classList.contains('gfx-tone-light'));
if(fieldRooms.some(o=>o.foot)){foot.style.setProperty('background-color','transparent','important');host.style.setProperty('background-color','transparent','important');footTone=()=>{if(mode==='reveal')openNow();else flowTone();};}
const inner=()=>q(':scope > .gfx-fi-wrap, :scope > .gfx-fi-layer');
const cut=k=>{if(k===K)return;K=k;foot.style.transform=k?`translate3d(0,${k}px,0)`:'';inner().forEach(e=>{e.style.transform=k?`translate3d(0,${-k}px,0)`:'';});};
const measureF=()=>{CH=0;cut(0);H0=foot.offsetHeight;host.style.setProperty('--gfx-ftg-h',H0+'px');const r=lockup.getBoundingClientRect(),f=foot.getBoundingClientRect();lockR={localBottom:r.bottom-f.top};hostTop=host.getBoundingClientRect().top+W.scrollY;};
const step=(p,instant)=>{
prog=p;
if(p>0.001)hurryTurn();
const covered=p<=0.001;
H.classList.toggle('gfx-ftg-covered',covered);
openNow();
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
if(fiEl){fiEl.style.opacity='';fiEl.style.transition='';}
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
flowTone();
tl=film(false);
st=ST.create({trigger:foot,start:'top 92%',end:'max',onEnter:()=>{hurryTurn();if(tl.progress()<1&&!tl.isActive())tl.play();}});
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
a.addEventListener('click',e=>{
e.preventDefault();const t=$('h1')||first;t.setAttribute('tabindex','-1');t.setAttribute('data-gfx-skipto','');let n=0;
const go=()=>{t.focus({preventScroll:true});if(D.activeElement!==t&&n++<40){setTimeout(go,100);return;}const r=t.getBoundingClientRect();if(r.bottom<0||r.top>W.innerHeight)W.scrollTo(0,W.scrollY+r.top-120);};
go();
});
if(!$('#gfx-skipto')){const st=D.createElement('style');st.id='gfx-skipto';st.textContent='[data-gfx-skipto]:focus{outline:none}';(D.head||H).appendChild(st);}
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
const ART='/articles/',PLAUSIBLE='ai-deal-origination-structural-risk-plausible-list-problem';
const toArticle=a=>{
const h=a.getAttribute('href')||'',m=h.match(/^(?:https?:\/\/(?:www\.)?greyfoxpartners\.com)?\/insights\/([a-z0-9-]+)\/?([?#].*)?$/);
if(m&&m[1]!=='category'&&m[1]!=='tag')a.setAttribute('href',ART+m[1]+(m[2]||''));
else if(/^\/insights(-v2)?-article\/?([?#].*)?$/.test(h))a.setAttribute('href',ART+PLAUSIBLE);
else if(/^\/insights-v2\/?([?#].*)?$/.test(h))a.setAttribute('href',h.replace(/^\/insights-v2\/?/,'/insights'));
else if(/^\/(home|contact|team|privacy|business-owners|investors)-v2\/?([?#].*)?$/.test(h))a.setAttribute('href',h.replace(/^\/home-v2/,'/').replace(/-v2(\/|$)/,'$1'));
};
{const sweepA=()=>D.querySelectorAll('a[href*="insights"]').forEach(toArticle);
onReady(sweepA);W.addEventListener('load',()=>{sweepA();setTimeout(sweepA,1500);});
D.addEventListener('click',e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a)toArticle(a);},true);}
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
safe('nav reserve',navReserve);
safe('menu foot',menuFoot);
safe('phone menu',phoneMenu);
safe('page dom',()=>PAGE.dom&&PAGE.dom(api));
safe('footer I',footBuild);
safe('pic links',()=>{const named=new Set($$('a[href*="/articles/"]').filter(x=>!x.querySelector('svg, img, picture')&&x.textContent.trim()).map(x=>x.getAttribute('href')));$$('a[href*="/articles/"]').forEach(x=>{if(x.querySelector('svg, img, picture')&&named.has(x.getAttribute('href'))){x.setAttribute('aria-hidden','true');x.tabIndex=-1;}});});
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
safe('layout report',layoutReport);
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
if(!gfx||!gfx.page||W.__gfxPages)return;
W.__gfxPages='1.0.3';
const H=D.documentElement,G=gfx.G,$=gfx.$,$$=gfx.$$,safe=gfx.safe,REDUCE=gfx.REDUCE;
const O=c=>'[data-o~="'+c+'"]';
const GROUP=G.group,TIGHT=G.tight||0.08;
H.classList.add('gf-flow','gf-flow2','gf-flow3','gf-dark-black','ow-js','gfx-pg-js');
if(REDUCE)H.classList.add('ow-reduce');
let gsap=null,ST=null;
const R={};
const findRooms=()=>{R.main=$('#main')||$(O('ow-main'));R.rooms=$$(O('ow-room'));R.hero=$(O('ow-hero'));R.qs=$(O('ow-qs'));R.close=$(O('ow-close'));};
findRooms();
const mk=(tag,cls,text)=>{const n=D.createElement(tag);if(cls){n.className=cls;n.setAttribute('data-o',cls);}if(text!=null)n.textContent=text;return n;};
const fieldDef=()=>({
phoneRhythm:true,
rooms:R.rooms.map(r=>r===R.close
?{el:r,native:'D',tone:'D',opaque:true,foot:true,noInk:true,turnAt:(ym,c)=>{
const room=c.room.el,top=c.docTop(room);let at=top-c.vh*0.6;
const lb=c.lastBottom(c.prev.el);if(Number.isFinite(lb))at=Math.max(at,lb-c.vh*0.12);
const hd=$('h2',room);if(hd)at=Math.min(at,c.docTop(hd)-c.vh*0.72);
return Math.min(at,c.max-c.vh*0.04);}}
:{el:r,native:'L',tone:'L',noInk:true})
});
function dom(def){
findRooms();
const cur=(def.current||'').toLowerCase();
if(cur)$$('.gfx-nav a.navigation-item').forEach(a=>{if((a.textContent||'').trim().toLowerCase()===cur){a.classList.add('gfx-current');a.setAttribute('aria-current','page');}});
if(R.qs){H.classList.add('ow-acc-js');$$(O('ow-acc-item'),R.qs).forEach(it=>it.classList.remove('is-open'));$$(O('ow-acc-b'),R.qs).forEach(b=>b.setAttribute('aria-expanded','false'));}
if(R.close){R.close.classList.add('gfc-on');let before=R.close.previousElementSibling;while(before&&!before.matches(O('ow-room')))before=before.previousElementSibling;if(before)before.classList.add('pf-leave');}
}
let heroTl=null;
function heroInit(def){
const room=R.hero;if(!room)return;
const h1=$('h1',room),lede=$(O('ow-hero-lede'),room),act=$(O('ow-actions'),room),rule=$(O('ow-rule'),room);
const pic=$(O('ow-hero-pic'),room),imgs=pic?$$('img',pic):[];
const words=[act].concat(def.heroWords?def.heroWords(room):[]).filter(Boolean);
const head=h1?gfx.lineSplit(h1):null;if(head)head.played=true;
if(words.length)gsap.set(words,{opacity:0,y:G.body.y});if(lede)gsap.set(lede,{y:G.body.y});
if(rule)gsap.set(rule,{scaleX:0,transformOrigin:'0% 50%'});
const fx=pic?(getComputedStyle(pic).getPropertyValue('--fx').trim()||'96px'):'96px';
if(imgs.length){gsap.set(imgs,{clipPath:G.picture.clipFrom,scale:G.picture.scaleFrom});gsap.set(pic,{'--fx':'0px'});}
H.classList.add('ow-hero-on');
const tl=heroTl=gsap.timeline({delay:0.1,onComplete:()=>{if(head&&!head.reverted)head.revert();}});
if(head)tl.to(head.lines,{yPercent:0,duration:G.headline.duration,stagger:G.headline.stagger,ease:G.SETTLE},0);
if(lede)tl.to(lede,{y:0,duration:G.body.duration,ease:G.SETTLE,clearProps:'transform'},G.body.at);
if(words.length)tl.to(words,{opacity:1,y:0,duration:G.body.duration,stagger:GROUP,ease:G.SETTLE,clearProps:'transform'},G.body.at);
if(rule)tl.to(rule,{scaleX:1,duration:G.hairline.duration,ease:G.DRAW},G.hairline.at);
if(imgs.length)tl.to(imgs,{clipPath:'inset(0% 0% 0% 0%)',duration:G.picture.duration,ease:G.DRAW},0)
.to(imgs,{scale:1,duration:G.picture.duration+0.5,ease:G.SETTLE,clearProps:'clipPath'},0.2)
.to(pic,{'--fx':fx,duration:G.hairline.duration,ease:G.DRAW,clearProps:'--fx'},G.detail.at+G.detail.stagger);
if(def.heroDetail)safe('hero detail',()=>def.heroDetail(tl,room));
W.addEventListener('resize',()=>{if(tl.progress()<1)tl.progress(1);});
if(imgs.length&&G.breath){
const B=G.breath;let last=-1;
const set=u=>{const v=u>=1?B.scaleTo:+(B.scaleFrom+(B.scaleTo-B.scaleFrom)*Math.max(0,u)).toFixed(4);if(v!==last){last=v;imgs.forEach(i=>{i.style.scale=v;});}};
set(0);
ST.create({trigger:pic,start:0,end:()=>Math.max(W.innerHeight,room.offsetHeight),invalidateOnRefresh:true,onUpdate:s=>set(s.progress),onRefresh:s=>set(s.progress)});
}
}
function headsInit(){
R.rooms.filter(r=>r!==R.hero&&r!==R.close).forEach(r=>{
const h2=$(O('ow-open')+' h2',r)||$('h2',r);if(!h2)return;
const words=$$('[data-ow-appear]',r);
gfx.room({trigger:h2,headline:h2,body:words,start:'top 84%'});
});
}
function questionsWire(){
const room=R.qs;if(!room)return;
let hold=0;
$$(O('ow-acc-item'),room).forEach(it=>{
const b=$(O('ow-acc-b'),it);if(!b)return;
const toggle=()=>{
const open=!it.classList.contains('is-open'),list=it.parentElement;
if(open){
const others=$$(O('ow-acc-item'),list).filter(x=>x!==it&&x.classList.contains('is-open'));
const top0=b.getBoundingClientRect().top;
const above=others.filter(x=>x.getBoundingClientRect().top<top0);
const panels=above.map(x=>{const pn=$(O('ow-acc-p'),x);if(!pn)return null;const h0=pn.getBoundingClientRect().height;pn.style.setProperty('transition','none','important');pn.style.overflow='hidden';pn.style.height=h0+'px';pn.style.gridTemplateRows='1fr';return{pn,h0,h:h0};}).filter(Boolean);
others.forEach(x=>{x.classList.remove('is-open');const ob=$(O('ow-acc-b'),x);if(ob)ob.setAttribute('aria-expanded','false');});
if(panels.length){
const setY=to=>{const L=gfx.lenis;if(L&&L.scrollTo){try{L.scrollTo(to,{immediate:true,force:true});return;}catch(e){}}W.scrollTo(0,to);};
cancelAnimationFrame(hold);const t0=performance.now(),Dn=REDUCE?1:450;
const step=now=>{
const t=Math.min(1,(now-t0) / Dn),k=t>=1?1:1-Math.pow(2,-10*t);let shift=0;
panels.forEach(o=>{const hh=o.h0*(1-k);shift+=o.h-hh;o.h=hh;o.pn.style.height=hh.toFixed(2)+'px';});
if(shift>0.01)setY((W.scrollY||0)-shift);
if(t<1)hold=requestAnimationFrame(step);
else{
panels.forEach(o=>{o.pn.style.setProperty('transition','none','important');o.pn.style.gridTemplateRows='';o.pn.style.height='';o.pn.style.overflow='';o.pn.offsetHeight;});
requestAnimationFrame(()=>requestAnimationFrame(()=>panels.forEach(o=>o.pn.style.removeProperty('transition'))));
}
};
hold=requestAnimationFrame(step);
}
}
it.classList.toggle('is-open',open);b.setAttribute('aria-expanded',String(open));
setTimeout(gfx.refresh,700);
};
b.addEventListener('click',toggle);
if(b.tagName!=='BUTTON'){b.setAttribute('role','button');b.tabIndex=0;b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});}
});
}
const played=new Set();let qsInView=false;
const heads=g=>$$(O('ow-acc-item'),g).map(r=>$(O('ow-acc-h'),r)).filter(Boolean);
function playList(g){
if(!gsap||REDUCE||played.has(g)||g.hidden)return;played.add(g);
const rows=$$(O('ow-acc-item'),g);
gsap.to(rows,{'--ow-rl':1,duration:G.hairline.duration,ease:G.DRAW,stagger:TIGHT});
gsap.to(heads(g),{opacity:1,y:0,duration:G.body.duration,ease:G.SETTLE,stagger:TIGHT,delay:G.arrow.at-G.hairline.at,clearProps:'transform'});
}
const lists=()=>{const acc=R.qs&&$(O('ow-acc'),R.qs);if(!acc)return[];const g=$$(O('r4-qgroup'),acc);return g.length?g:[acc];};
function questionsInit(){
const acc=R.qs&&$(O('ow-acc'),R.qs);if(!acc)return;
lists().forEach(g=>{gsap.set($$(O('ow-acc-item'),g),{'--ow-rl':0});gsap.set(heads(g),{opacity:0,y:G.body.y});heads(g).forEach(h=>h.setAttribute('data-gfx-reveal',''));});
ST.create({trigger:acc,start:'top 88%',once:true,onEnter:()=>{qsInView=true;lists().forEach(playList);}});
}
let closeMark=null;
function closeMarkInit(still){
const room=R.close;if(!room||!W.gfArrow)return;
const h2=$('h2',room),top=$(O('gfc-top'),room);if(!h2||!top)return;
closeMark=W.gfArrow.word({el:h2,host:top,cls:'gfc-mark',auto:!still});
if(still&&closeMark)closeMark.still();
}
function closeInit(){
const room=R.close;if(!room)return;
const h2=$('h2',room),top=$(O('gfc-top'),room);
if(h2)gfx.room({trigger:h2,headline:h2,start:'top 84%'});
if(top&&'IntersectionObserver'in W){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){room.classList.add('gfc-in');io.disconnect();}}),{rootMargin:'0px 0px -28% 0px'});io.observe(top);}
else room.classList.add('gfc-in');
room.addEventListener('focusin',()=>room.classList.add('gfc-in'));
let near=false,rq=0;
const seen=fa=>{const b=fa.getBoundingClientRect();if(!(b.width>0&&b.top<W.innerHeight&&b.bottom>0))return false;const e=D.elementFromPoint(Math.min(W.innerWidth-1,Math.max(0,b.left+b.width / 2)),Math.min(W.innerHeight-1,Math.max(0,b.top+b.height / 2)));return!!(e&&e.closest('.footer_section_wrapper'));};
const check=()=>{rq=0;const fa=$('.gfx-fi-act');if(!fa)return;const cr=room.getBoundingClientRect(),k=Math.max(0,Math.min(cr.bottom,W.innerHeight)-Math.max(cr.top,0)) / (cr.height||1);room.classList.toggle('gfc-rest',near&&k<=0.4&&seen(fa));};
const ask=()=>{if(near&&!rq){rq=1;((W.gfx&&W.gfx.postFrame)||requestAnimationFrame)(check);}};
if('IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>{near=e.isIntersecting;ask();})).observe(room);
W.addEventListener('scroll',ask,{passive:true});W.addEventListener('resize',ask);
}
function run(def){
def=def||{};
const field={phoneRhythm:true,rooms:[]};
gfx.page({
field,
foot:{close:O('ow-close')},
fox:O('ow-close')+' '+O('gfc-fox'),
dom:()=>{safe('pages dom',()=>dom(def));field.rooms=fieldDef().rooms;safe('questions',questionsWire);if(def.dom)safe('page dom',()=>def.dom(api));},
start:()=>{
gsap=gfx.gsap;ST=gfx.ST;
safe('hero',()=>heroInit(def));
if(def.start)safe('page start',()=>def.start(api));
},
rooms:()=>{
safe('heads',headsInit);
safe('questions motion',questionsInit);
safe('close',closeInit);
if(def.rooms)safe('page rooms',()=>def.rooms(api));
},
late:()=>{safe('close mark',()=>closeMarkInit(false));if(def.late)safe('page late',()=>def.late(api));},
still:()=>{
gsap=W.gsap||null;ST=W.ScrollTrigger||null;
H.classList.add('ow-hero-on');
if(R.close)R.close.classList.add('gfc-in');
safe('close mark',()=>closeMarkInit(true));
if(def.still)safe('page still',()=>def.still(api));
}
});
}
const api={
O,R,mk,run,playList,lists,
get heroTl(){return heroTl;},get qsInView(){return qsInView;},
get gsap(){return gsap||W.gsap;},get ST(){return ST||W.ScrollTrigger;}
};
gfx.pages=api;
})();
(function(){
'use strict';
var W=window,D=document,gfx=W.gfx;
if(!gfx||!gfx.pages||W.__gfxInsights)return;
W.__gfxInsights='1.3.1';
const SRC=(D.currentScript&&D.currentScript.src)||'';
const P=gfx.pages,O=P.O,H=D.documentElement,$=gfx.$,$$=gfx.$$,safe=gfx.safe,REDUCE=gfx.REDUCE;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const eo=t=>1-Math.pow(1-t,3);
const EXPO='expo.out';
if(!D.getElementById('gfx-gi-tap')){const st=D.createElement('style');st.id='gfx-gi-tap';
st.textContent='[data-o~="gi-ref"] a{position:relative}[data-o~="gi-ref"] a::after{content:"";position:absolute;left:50%;top:50%;width:44px;height:44px;transform:translate(-50%,-50%)}'+
'@media (max-width:767px){[data-o~="gi-row-r"]>span+span::before{content:none!important}[data-o~="gi-row-r"]>span:not(:last-child)::after{content:"";display:inline-block;width:3px;height:3px;margin:0 0 0 10px;border-radius:50%;background:currentColor;opacity:.7;transform:translateY(-3px)}}'+
'[data-o~="gi-sources"] li{scroll-margin-top:96px}';
D.head.appendChild(st);}
H.classList.add('gi-html');
let gsap=null,anim=false;
let FIELD=null;
const turnAt=(ym,c)=>{const t=$(O('gi-turn'));return t?c.docTop(t)+t.offsetHeight-c.vh*0.9:ym;};
const rooms=()=>{
const L=el=>el&&{el,native:'L',tone:'L',noInk:true},Dk=(el,x)=>el&&Object.assign({el,native:'D',tone:'D',noInk:true},x||{});
const close=$(O('gi-close')),last=close&&{opaque:true,foot:true};
if($(O('gi-index')))return[L($(O('gi-open'))),L($(O('gi-collage'))),L($(O('gi-arch'))),Dk(close,Object.assign({turnAt},last))].filter(Boolean);
return[L($(O('gi-story'))),Dk($(O('gi-next')),{turnAt}),Dk($(O('gi-more'))),Dk(close,last)].filter(Boolean);
};
const syncDark=()=>{const on=H.classList.contains('gfx-tone-dark');if(H.classList.contains('gi-dark')!==on)H.classList.toggle('gi-dark',on);};
if('MutationObserver'in W)new MutationObserver(syncDark).observe(H,{attributes:true,attributeFilter:['class']});
const splitLines=el=>{
const orig=el.innerHTML,words=[];
const walk=node=>[...node.childNodes].forEach(n=>{
if(n.nodeType===3){
const frag=D.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;if(/^\s+$/.test(p))frag.append(D.createTextNode(p));else{const s=D.createElement('span');s.className='gi-w';s.textContent=p;words.push(s);frag.append(s);}});
n.replaceWith(frag);
}else if(n.nodeType===1&&(n.matches(O('gi-nb'))||n.classList.contains('gi-nb')))words.push(n);
else if(n.nodeType===1)walk(n);
});
walk(el);
const rws=[];
words.forEach(w=>{const t=w.offsetTop;const r=rws.find(r=>Math.abs(r.t-t)<4);if(r)r.w.push(w);else rws.push({t,w:[w]});});
el.innerHTML=rws.map(r=>`<span class="gi-ln"><span>${r.w.map(w=>w.outerHTML).join(' ')}</span></span>`).join(' ');
return{lines:$$('.gi-ln > span',el),restore:()=>{el.innerHTML=orig;}};
};
const rise=(el,delay)=>{
if(!anim)return;
const{lines,restore}=splitLines(el);
gsap.fromTo(lines,{yPercent:108},{yPercent:0,duration:1.6,ease:EXPO,stagger:0.12,delay:delay||0,onComplete:restore});
};
const fonts=()=>(D.fonts&&D.fonts.ready)||Promise.resolve();
function opening(){
const after=$$('[data-gi-after]'),draws=$$('[data-gi-draw]');
after.forEach(e=>e.classList.add('gi-pre'));gsap.set(draws,{scaleX:0});
fonts().then(()=>{
const title=$('[data-gi-lines]');if(title)rise(title,0.1);
after.forEach(e=>e.classList.remove('gi-pre'));
gsap.fromTo(after,{opacity:0,y:14},{opacity:1,y:0,duration:1.4,ease:EXPO,stagger:0.12,delay:0.55,clearProps:'transform'});
gsap.to(draws,{scaleX:1,duration:1.6,ease:'power3.inOut',delay:0.7});
});
}
function risers(){
const rs=$$('[data-gi-rise]');if(!rs.length||!('IntersectionObserver'in W))return;
rs.forEach(r=>gsap.set(r,{opacity:0}));
const io=new IntersectionObserver(es=>es.forEach(e=>{
if(!e.isIntersecting&&e.boundingClientRect.top>0)return;
io.unobserve(e.target);gsap.set(e.target,{opacity:1});
if(e.boundingClientRect.top<0)return;
rise(e.target,0);
}),{rootMargin:'0px 0px -12% 0px'});
fonts().then(()=>rs.forEach(r=>io.observe(r)));
}
function quotes(){
const pqs=$$('[data-gi-pq] '+O('gi-pq-rule'));if(!pqs.length||!('IntersectionObserver'in W))return;
gsap.set(pqs,{scaleX:0});
const io=new IntersectionObserver(es=>es.forEach(e=>{
if(!e.isIntersecting&&e.boundingClientRect.top>0)return;
io.unobserve(e.target);
gsap.to(e.target,{scaleX:1,duration:e.boundingClientRect.top<0?0:1.6,ease:'power3.inOut'});
}),{rootMargin:'0px 0px -15% 0px'});
pqs.forEach(p=>io.observe(p));
}
let req=()=>{},rescan=()=>{};
function scroll(){
let plates=[],frames=[];
rescan=()=>{plates=$$(O('gi-plate-in'));frames=plates.map(p=>p.closest(O('gi-plate'))||p.parentElement);req();};
plates=$$(O('gi-plate-in'));frames=plates.map(p=>p.closest(O('gi-plate'))||p.parentElement);
const tiles=$$('[data-gi-tile]');
const progs=$$(O('gi-progress')+' > i, '+O('gi-aprog')+' > i'),body=D.getElementById('gi-body');
const lists=$$(O('gi-toc-l')).map(l=>$$('a[href^="#"]',l));
const secs=(lists[0]||[]).map(a=>D.getElementById(decodeURIComponent(a.hash.slice(1))));
let curSec=-1;
const frame=()=>{
const vh=W.innerHeight;
const pr=frames.map(f=>f.getBoundingClientRect());
const tr0=tiles.map(t=>t.getBoundingClientRect().top-(parseFloat(t.dataset.giY)||0));
const br=progs.length&&body?body.getBoundingClientRect():null;
const st=secs.length&&secs.every(Boolean)?secs.map(s=>s.getBoundingClientRect().top):null;
if(anim)tiles.forEach((t,i)=>{const top=tr0[i];if(top>vh+80)return;const k=eo(clamp((vh*0.98-top) / (vh*0.62)-i*0.06));const y=((1-k)*(36+i*8)).toFixed(1);t.dataset.giY=y;t.style.transform=+y?`translate3d(0, ${y}px, 0)`:'';});
if(anim)plates.forEach((p,i)=>{const r=pr[i];if(r.bottom<-40||r.top>vh+40)return;const k=eo(clamp((vh-r.top) / (vh*0.8)));p.style.transform=`scale(${(1.04-0.04*k).toFixed(4)})`;});
if(br){const t=`scaleX(${clamp((vh*0.35-br.top) / Math.max(1,br.height-vh*0.3)).toFixed(4)})`;progs.forEach(p=>{p.style.transform=t;});}
if(st){
let i=-1;st.forEach((t,k)=>{if(t<=vh*0.33)i=k;});
if(i!==curSec){curSec=i;lists.forEach(l=>l.forEach((a,k)=>k===i?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current')));}
}
};
let raf=0;req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;frame();});};
W.addEventListener('scroll',req,{passive:true});W.addEventListener('resize',req);W.addEventListener('load',req);
if(gfx.lenis&&gfx.lenis.on)gfx.lenis.on('scroll',req);
frame();fonts().then(req);
}
const navZone=()=>72+32;
const glideTo=(el,focusEl)=>{
const y=Math.max(0,Math.round(el.getBoundingClientRect().top+W.scrollY-navZone()));
const L=gfx.lenis;
const done=()=>{if(focusEl){if(!focusEl.hasAttribute('tabindex'))focusEl.setAttribute('tabindex','-1');focusEl.focus({preventScroll:true});}req();};
if(L&&!REDUCE)L.scrollTo(y,{duration:1.2,force:true,onComplete:done});
else{if(L)L.scrollTo(y,{immediate:true,force:true});else W.scrollTo(0,y);done();}
};
function contents(){
$$(O('gi-toc-l')).forEach(l=>$$('a[href^="#"]',l).forEach(a=>a.addEventListener('click',e=>{
const s=D.getElementById(decodeURIComponent(a.hash.slice(1)));if(!s)return;
e.preventDefault();e.stopPropagation();glideTo(s,$('h2',s));
try{history.replaceState(null,'',a.hash);}catch(err){}
})));
}
const G=d=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
const GB=d=>`<svg viewBox="0 0 24 24" class="gi-brand" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
const GLYPH={
in:GB('M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'),
x:GB('M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z'),
fb:GB('M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'),
copy:G('M10 14l4-4M9 11.5l-2 2a3 3 0 0 0 4.2 4.3l2-2M15 12.5l2-2a3 3 0 0 0-4.2-4.3l-2 2')
};
if(!D.getElementById('gfx-gi-designer')){const st=D.createElement('style');st.id='gfx-gi-designer';
st.textContent='[data-o~="gi-sh"] svg.gi-brand{width:18px;height:18px}[data-o~="gi-sh"] svg.gi-brand path{fill:currentColor!important;stroke:none!important}'+
'@media (hover:hover){html [data-o~="gi-tlink"]:hover,html [data-o~="gi-tile"]:hover [data-o~="gi-tlink"],html [data-o~="gi-next-grid"]:hover [data-o~="gi-tlink"],html [data-o~="gi-list"] > [data-o~="gi-row"]:hover [data-o~="gi-row-t"]{background-size:0% 1px}}'+
'[data-o~="gi-pq"]{margin-left:0!important}[data-o~="gi-pq-rule"]{width:96px!important}';
(D.head||D.documentElement).appendChild(st);}
function share(){
$$('[data-gi-ico]').forEach(a=>{const g=GLYPH[a.getAttribute('data-gi-ico')];if(g&&!$('svg',a))a.insertAdjacentHTML('afterbegin',g);});
$$('[data-gi-copy]').forEach(b=>{
if(b.tagName!=='BUTTON'){b.setAttribute('role','button');b.tabIndex=0;b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click();}});}
b.addEventListener('click',e=>{
e.preventDefault();
const box=b.closest(O('gi-share')),note=box&&$(O('gi-share-note'),box);
const done=ok=>{if(note){note.textContent=ok?'Link copied.':b.getAttribute('data-gi-copy');clearTimeout(b._t);b._t=setTimeout(()=>{note.textContent='';},2600);}};
try{navigator.clipboard.writeText(b.getAttribute('data-gi-copy')).then(()=>done(true),()=>done(false));}catch(err){done(false);}
});
});
}
function sidebarArrow(still){
const A=W.gfArrow;if(!A)return;
$$(O('gi-scta-a')).forEach(a=>{const w=$(O('gi-scta-w'),a);if(!w)return;const m=A.word({el:w,key:true,host:a,cls:'gi-line-svg',color:'var(--gi-green)',auto:!still});if(still&&m&&m.still)m.still();});
const scta=$('[data-gi-scta]'),closeSec=$(O('gi-close'));
if(scta&&closeSec&&'IntersectionObserver'in W)new IntersectionObserver(es=>es.forEach(e=>scta.classList.toggle('is-away',e.isIntersecting))).observe(closeSec);
}
const topicOf=r=>r.getAttribute('data-topic')||'';
const DRAFTED=['what-drives-hoa-management-exit-value','hoa-community-manager-retention-challenge',
'leadership-infrastructure-enterprise-value','service-complexity-enterprise-value','sales-infrastructure-before-talent',
'exit-preparation-timeline-value','buyers-quantify-founder-dependency','operational-metrics-scalable-growth',
'buyability-gap-transferable-value','value-leaks-in-service-businesses','repeatability-diagnostic-valuation-multiples',
'how-buyers-analyze-financials','field-margin-erosion','fire-20-percent-revenue','growtheright20'];
const slugOfRow=r=>{const a=$('a[href*="/insights/"], a[href*="/articles/"]',r);const m=a&&(a.getAttribute('href')||'').match(/\/(?:insights|articles)\/([a-z0-9-]+)/);return m?m[1]:'';};
function prune(){
const list=$(O('gi-list'));if(!list)return;
$$(O('gi-row'),list).forEach(r=>{if(DRAFTED.indexOf(slugOfRow(r))>=0)r.remove();});
$$(O('gi-tile')).forEach(t=>{if(DRAFTED.indexOf(slugOfRow(t))>=0)t.remove();});
const rws=$$(O('gi-row'),list),by={};
rws.forEach(r=>{const t=topicOf(r);by[t]=(by[t]||0)+1;});
$$(O('gi-topic')).forEach(b=>{const t=b.getAttribute('data-topic')||'',n=t?(by[t]||0):rws.length,c=$(O('gi-topic-c'),b);if(c)c.textContent=String(n);if(t&&!n)b.remove();});
const note=$('[data-gi-note]');if(note)note.textContent=`Showing all ${rws.length} articles.`;
if(Object.keys(by).filter(Boolean).length<=1){const g=$(O('gi-topics'));if(g){g.hidden=true;g.style.setProperty('display','none','important');}}
const cnt=$(O('gi-open-count'));
if(cnt){
const k=Object.keys(by).filter(Boolean).length,first=$('.gfx-pg-t',cnt),mis=$$(O('gi-mi'),cnt);
const dates=rws.map(r=>($('time[datetime]',r)||{getAttribute:()=>''}).getAttribute('datetime')).filter(Boolean).sort();
if(first)first.textContent=`${rws.length} ${rws.length===1?'article':'articles'}`;
const set=(el,s)=>{if(!el)return;const sep=$(O('gi-sep'),el);el.textContent=s;if(sep)el.insertBefore(sep,el.firstChild);};
mis.forEach(el=>{
if(/topic/i.test(el.textContent)){if(k<=1){el.hidden=true;el.style.setProperty('display','none','important');}else set(el,`${k} topics`);}
else if(/^\s*since\b/i.test(el.textContent)&&dates[0]){const d=new Date(dates[0]+'T12:00:00');set(el,'Since '+d.toLocaleString('en-US',{month:'long',year:'numeric'}));}
});
}
}
function topics(){
const list=$(O('gi-list'));if(!list)return;
const btns=$$(O('gi-topic')),rws=$$(O('gi-row'),list),arch=D.getElementById('all'),note=$('[data-gi-note]');
const nameOf=t=>{const b=btns.find(x=>(x.getAttribute('data-topic')||'')===t);const n=b&&$(O('gi-topic-n'),b);return n?n.textContent:'';};
let busy=null;
const apply=(topic,animate)=>{
const want=r=>!topic||topicOf(r)===topic;
btns.forEach(b=>b.setAttribute('aria-pressed',String((b.getAttribute('data-topic')||'')===topic)));
const n=rws.filter(want).length;
if(note)note.textContent=topic?`Showing ${n} ${n===1?'article':'articles'} on ${nameOf(topic)}.`:`Showing all ${n} articles.`;
const g=gsap||W.gsap;
if(!animate||REDUCE||!g){rws.forEach(r=>{r.hidden=!want(r);if(g)g.set(r,{clearProps:'opacity,transform'});});req();gfx.refresh&&gfx.refresh();return;}
if(busy)busy.progress(1);
const leaving=rws.filter(r=>!r.hidden&&!want(r)),staying=rws.filter(r=>!r.hidden&&want(r)),arriving=rws.filter(r=>r.hidden&&want(r));
const first=new Map(staying.map(r=>[r,r.getBoundingClientRect().top]));
busy=g.timeline({onComplete:()=>{busy=null;req();gfx.refresh&&gfx.refresh();}});
busy.to(leaving,{opacity:0,duration:0.16,ease:'power1.out'})
.add(()=>{
leaving.forEach(r=>{r.hidden=true;g.set(r,{clearProps:'opacity'});});
arriving.forEach(r=>{r.hidden=false;});
staying.forEach(r=>{const d=first.get(r)-r.getBoundingClientRect().top;if(d)g.fromTo(r,{y:d},{y:0,duration:0.42,ease:'power3.out',clearProps:'transform'});});
g.fromTo(arriving,{opacity:0,y:12},{opacity:1,y:0,duration:0.42,ease:'power3.out',stagger:0.02,clearProps:'opacity,transform'});
if(arch&&arch.getBoundingClientRect().top<-40)glideTo(arch);
});
};
btns.forEach(b=>b.addEventListener('click',()=>{
const t=b.getAttribute('data-topic')||'';
if(b.getAttribute('aria-pressed')==='true')return;
apply(t,true);
try{const u=new URL(location.href);if(t)u.searchParams.set('topic',t);else u.searchParams.delete('topic');history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(err){}
}));
const q=new URLSearchParams(location.search).get('topic');
if(q&&btns.some(b=>b.getAttribute('data-topic')===q))apply(q,false);
if(location.hash==='#all'&&arch){
const land=()=>{const y=Math.max(0,Math.round(arch.getBoundingClientRect().top+W.scrollY-navZone()));if(gfx.lenis)gfx.lenis.scrollTo(y,{immediate:true,force:true});else W.scrollTo(0,y);req();};
fonts().then(()=>setTimeout(land,60));W.addEventListener('load',()=>setTimeout(land,120),{once:true});
}
}
const BASE=(SRC||(($('script[src*="/insights/gfx-insights"]')||{}).src)||'').replace(/insights\/[^/]*$/,'');
const COVER_SRI={
'buyability-gap':'sha384-HVSVbVFZ6GKiVmSpPQ+o6U1LSeiZ8jpAu3+UPCOjQMHFRYs9aegbH/daaFn+epFL',
'buyer-financials':'sha384-UGXC22PJYJjHkh5iL4B/JGRD/WlkWrl+3HN+T2zKK0mq77q1n0eq0hOaHz4gKRTk',
'cold-call':'sha384-K6ixKY/zEtbf6WyCHEWWhyMw6uXQ65OQZJDYyZsHUFHwEdYa20tjNT7/0xAxwJWY',
'company-problem':'sha384-kk/NKIJvUOB8I1evJoaPdWjZsNz5o5szPVWx008ofs/xd4Q32tPTZvWGvcXlph6V',
'exit-timeline':'sha384-33YuPYaEbtWq0ex7nNk+FZplz6sxv6zxnOJi2ReB/PYNkTiBWaGh03leSc/qfOn0',
'field-margin':'sha384-HJKzCuVq3394L8uokafJZV1nrFFqoR7s0QxoFG9zMTu9rZhsgR5DuZCRdNdoSiRo',
'fifty-email':'sha384-3ntOLDx7YzSLeqtWH9n65uEZa+hHAip/VYrgM7Ku0O+kS4gobMBqnqOWnRhIUYZJ',
'fire-twenty':'sha384-oCsqhyHIACfKxr5K73OrRA7DvvyLcctIMR/SIoUZax/B7m9uKg4xoKfbiQftl2DR',
'first-five-minutes':'sha384-/OQug0DzaaJvpUCrHI/Fap7WGhy6VtOokNwXKaytFPmzIRzQp6Gc1eURu2E5s7Bc',
'five-metrics':'sha384-gQ2RBQNSXyIJ4S0bEPQfS2zQ/D4A8F7gZuOWcezvJPy1Rnb0CtTAUblU/0N4ZX3e',
'founder-dependency':'sha384-gzcbLXTH8ECdU3E9JiPQtvuRwAFj5J1mdzl57uVHaI16uIn0LbJdq/46bWfiQRwa',
'hidden-forty':'sha384-VDofMCeeokXxgehzPZMGE0sTUQSfdNflgsxd0iz7US3Nkvwqbzs4tDquO7WzeV0a',
'hoa-exit-value':'sha384-0nZxdzWtwi/0nL/dZW07X0Z9/SOMx+pqCdIvzgHOYYNly4UAwHjYcKNkNiaIof+m',
'judge-partner':'sha384-q0xPNsWSD0WN4S/Rw1MgJmXyUoWzC59w+o3zo8pt8n5X6HoGW6GqvBjP+tbd6k9i',
'leadership-infra':'sha384-w07uMMqi3bNIT4qVOlNlKVn3WZI2HQODo9Uk2YzdtyvEyuxYFtjGy8K2wo9tNaGq',
'manager-retention':'sha384-C756Hzkc8c4+bRz6dzTAh3Ht16KLu1j8ZckBwRjcctpegpsjS/maRBFg7AxHl03Y',
'plausible-list':'sha384-gpP82BllNxgz3CpDQkU5bCh9BsC1voM/tBzs4aKJgLvyAo6UMw2qHA3z6Bn65mGh',
'repeatability':'sha384-GvstzaG/aW9YKY9Q5+6m7Nen/SpFmSEJyKmcktlAGGuJ7R1w1eMDCISG8tYgd25A',
'right-twenty':'sha384-DawDoElTiUKcio0ltuAubq4RdG9Yi+TR8sELqGcogbCNAIvjpvjvG1OT4qJYDU8k',
'sales-before-hire':'sha384-54bSmTQ2s5RlkkqpZjx6pVsnVTMyv/Z7Da8N69tBHJbUvTPY78UFpuxKoR9IrEia',
'service-complexity':'sha384-34WsVX/HPc6S+uMTuRT8AQX589bVsTdj0LjDChA4HvGjOBp+fp3AiR0WZUlJIRo3',
'value-leaks':'sha384-e7cfHyADER+q7wU6rddlToAxGwhH9e/+1tlgd0NZyDLqmiU3Bu7h/nmb090YbVCB',
'what-inning':'sha384-/SUk/cdWwPXOCeZrgj9Z1yQjL4PIYWjM+Wn6yqZqZBVvzk+0eXNxK8VBHKjTzaaA'
};
const SITE='https://www.greyfoxpartners.com';
const LOGO='https://cdn.prod.website-files.com/67c0e116387e8248a0d7e10a/6ad9b63e75f1cad7b6871bde_gfx-logo-mark-256.png';
const PEOPLE={'Shivam Shirolawala':'/shivam-shirolawala','Tony Giudice':'/tony-giudice','Burke Widhelm':'/burke-widhelm'};
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const escH=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const nb=t=>escH(t).replace(/(\S+-\S+)/g,'<span class="gfx-pg-gi-nb" data-o="gi-nb">$1</span>');
const titleHtml=t=>t.includes(': ')?nb(t.split(': ')[0])+':<span class="gfx-pg-gi-sub" data-o="gi-sub"> '+nb(t.split(': ').slice(1).join(': '))+'</span>':nb(t);
const slugify=s=>s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const sentenceHead=t=>{
let cap=true;
return t.split(' ').map(w=>{
const out=w.split('-').map((p,i)=>((cap&&!i)|| /[A-Z].*[A-Z]/.test(p)|| /^I(['’]\w+)?$/.test(p)?p:p.toLowerCase())).join('-');
cap= /[.?!]$/.test(w);return out;
}).join(' ').replace(/\bgrey fox\b/gi,'Grey Fox');
};
const pad=n=>(n<10?'0':'')+n;
const parseDate=s=>{
s=(s||'').trim();if(!s)return null;
let y,m,d;const iso= /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
if(iso){y=+iso[1];m=+iso[2];d=+iso[3];}else{const t=Date.parse(s);if(isNaN(t))return null;const x=new Date(t);y=x.getFullYear();m=x.getMonth()+1;d=x.getDate();}
return{iso:`${y}-${pad(m)}-${pad(d)}`,label:`${MONTHS[m-1]} ${d}, ${y}`};
};
const mkEl=(tag,o,attrs)=>{const n=D.createElement(tag);if(o){n.className='gfx-pg-'+o.split(' ').pop();n.setAttribute('data-o',o);}Object.entries(attrs||{}).forEach(([k,v])=>n.setAttribute(k,v));return n;};
const SEP='<span class="gfx-pg-gi-sep" aria-hidden="true" data-o="gi-sep"></span>';
const mi=h=>`<span class="gfx-pg-gi-mi" data-o="gi-mi">${h}</span>`;
const timeH=a=>a.date?`<time datetime="${a.date.iso}">${a.date.label}</time>`:'';
const metaH=(a,topic)=>{const parts=[timeH(a),topic&&a.topicName?escH(a.topicName):'',a.mins?escH(a.mins)+' min read':''].filter(Boolean);return`<p class="gfx-pg-gi-meta" data-o="gi-meta">${parts.map((p,i)=>mi((i?SEP:'')+p)).join('')}</p>`;};
const hrefOf=a=>'/articles/'+encodeURIComponent(a.slug);
const figH=(cls,o,a)=>`<figure class="${cls}" data-gi-settle="" data-o="${o}" data-gi-cover="${escH(a.cover)}" data-gi-title="${escH(a.name)}"></figure>`;
const coverReq={};let plateN=0;
const coverText=key=>coverReq[key]||(coverReq[key]=fetch(BASE+'insights/covers/'+key+'.svg',{integrity:COVER_SRI[key],mode:'cors'}).then(r=>(r.ok?r.text():Promise.reject(new Error('cover '+r.status)))));
const uniq=svg=>{const n='c'+(++plateN);return svg.replace(/id="([^"]+)"/g,(m,id)=>`id="${id}-${n}"`).replace(/url\(#([^)]+)\)/g,(m,id)=>`url(#${id}-${n})`).replace(/href="#([^"]+)"/g,(m,id)=>`href="#${id}-${n}"`);};
const typeIn=title=>`<span class="gi-plate-in" data-o="gi-plate-in"><svg viewBox="0 0 1200 750" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M84 78V64H98M1102 64H1116V78M1116 672V686H1102M98 686H84V672" fill="none" stroke="#a9a8a4" stroke-width="1" vector-effect="non-scaling-stroke"></path></svg><span class="gi-type-t" data-o="gi-type-t">${nb(title)}</span></span>`;
const putIn=(fig,inner)=>{const e=D.createElement('div');e.className='w-embed';e.innerHTML=inner;fig.textContent='';fig.appendChild(e);rescan();};
const asType=(fig,title)=>{const o=(fig.getAttribute('data-o')||'').split(/\s+/).filter(Boolean);if(!o.includes('gi-plate-type'))o.push('gi-plate-type');fig.setAttribute('data-o',o.join(' '));fig.classList.add('gfx-pg-gi-plate-type');putIn(fig,typeIn(title));};
const plate=(fig,key,title)=>{
if(!fig||fig.__gi)return;fig.__gi=1;
key=(key||'').trim();
if(!key||!COVER_SRI[key]||!BASE||!W.fetch){asType(fig,title);return;}
coverText(key).then(svg=>putIn(fig,`<span class="gi-plate-in" data-o="gi-plate-in">${uniq(svg)}</span>`),()=>asType(fig,title));
};
function body(rt){
const out=D.createDocumentFragment(),secs=[];let into=null,sources=null;
const blank=n=>n.nodeType===3?!n.textContent.trim():n.nodeType!==1;
const empty=n=>n.tagName==='P'&&!n.querySelector('img, svg, iframe, video')&&!n.textContent.replace(/[\s​-‍﻿]/g,'');
const free=id=>{let k=id||'section',i=2;while(D.getElementById(k))k=id+'-'+i++;return k;};
const pq=bq=>{
const f=mkEl('figure','gi-pq',{'data-gi-pq':''}),r=mkEl('div','gi-pq-rule',{'aria-hidden':'true'});
if(!$(':scope > p',bq)){const p=D.createElement('p');while(bq.firstChild)p.appendChild(bq.firstChild);bq.appendChild(p);}
f.append(r,bq);return f;
};
const kids=[...rt.childNodes];
kids.forEach((n,i)=>{
if(blank(n)||empty(n))return;
if(n.tagName==='H2'){
const text=n.textContent.replace(/\s+/g,' ').trim(),next=kids.slice(i+1).find(k=>k.nodeType===1);
const own=n.id;n.removeAttribute('id');
if(/^sources$/i.test(text)&&next&& /^(OL|UL)$/.test(next.tagName)){
const id=free(own||'sources');
sources=into=mkEl('section','gi-sources',{id,'aria-labelledby':id+'-h'});
n.className='gfx-pg-gi-src-h';n.setAttribute('data-o','gi-src-h');n.id=id+'-h';
into.appendChild(n);out.appendChild(into);return;
}
const id=free(own||slugify(text));
into=mkEl('section','gi-sec',{id,'aria-labelledby':id+'-h'});
n.className='gfx-pg-gi-sec-h';n.setAttribute('data-o','gi-sec-h');n.id=id+'-h';
into.appendChild(n);out.appendChild(into);secs.push({id,text});return;
}
if(!into){into=mkEl('div','gi-intro');out.appendChild(into);}
into.appendChild(n.tagName==='BLOCKQUOTE'?pq(n):n);
});
$$('sup',out).forEach(s=>{const a=$('a[href^="#src-"]',s);if(!a)return;s.className='gfx-pg-gi-ref';s.setAttribute('data-o','gi-ref');if(!a.hasAttribute('aria-label'))a.setAttribute('aria-label','Source '+a.textContent.trim());
a.addEventListener('click',e=>{const t=D.getElementById(decodeURIComponent(a.hash.slice(1)));if(!t)return;e.preventDefault();e.stopPropagation();glideTo(t,t);try{history.replaceState(null,'',a.hash);}catch(err){}});});
rt.replaceWith(out);
return{secs,sources};
}
function tocFill(entries){
[[O('gi-toc'),'nav'],[O('gi-toc-m'),'details']].forEach(([sel])=>$$(sel).forEach(box=>{
let ol=$(O('gi-toc-l'),box);
if(!ol){ol=mkEl('ol','gi-toc-l');box.appendChild(ol);}
ol.innerHTML=entries.map(e=>`<li><a href="#${e.id}">${escH(e.text)}</a></li>`).join('');
if(!entries.length)box.hidden=true;
}));
}
function feedIndex(){
if($(O('gi-rt')))return false;
const items=$$(O('gi-feed-i'));if(!items.length)return false;
const grid=$(O('gi-collage-grid')),col=$(O('gi-collage'));if(!grid||!col)return false;
const feed=items.map(e=>({
slug:(e.getAttribute('data-slug')||'').trim(),name:(e.getAttribute('data-name')||'').trim(),summary:(e.getAttribute('data-summary')||'').trim(),
date:parseDate(e.getAttribute('data-date')),mins:(e.getAttribute('data-mins')||'').trim(),topic:(e.getAttribute('data-topic')||'').trim(),
cover:(e.getAttribute('data-cover')||'').trim(),author:(e.getAttribute('data-author')||'').trim()
})).filter(a=>a.slug&&a.name);
if(!feed.length)return false;
feed.sort((a,b)=>(b.date?b.date.iso:'').localeCompare(a.date?a.date.iso:''));
$$(O('gi-feed')).forEach(e=>e.remove());
H.classList.add('gi-b');
const url=a=>'/articles/'+a.slug;
const k=a=>`<p class="gfx-pg-gi-tile-k" data-o="gi-tile-k"><span class="gfx-pg-gi-mi" data-o="gi-mi">${a.date?`<time datetime="${a.date.iso}">${escH(a.date.label)}</time>`:''}</span>${a.mins?SEP+`<span class="gfx-pg-gi-mi" data-o="gi-mi">${escH(a.mins)} min read</span>`:''}</p>`;
const pic=(a,lead)=>`<a class="gfx-pg-gi-tile-pic" data-o="gi-tile-pic" href="${url(a)}" aria-hidden="true" tabindex="-1"><figure class="${lead?'gfx-pg-gi-plate-lead':'gfx-pg-gi-plate'}" data-o="gi-plate${lead?' gi-plate-lead':''}" data-gi-settle="" data-gi-cover="${escH(a.cover)}" data-gi-title="${escH(a.name)}"></figure></a>`;
const words=(a,tag)=>`<div class="gfx-pg-gi-tile-txt" data-o="gi-tile-txt">${k(a)}<${tag} class="gfx-pg-gi-tile-t" data-o="gi-tile-t"><a class="gfx-pg-gi-tlink" data-o="gi-tlink" href="${url(a)}">${titleHtml(escH(a.name))}</a></${tag}>${a.summary?`<p class="gfx-pg-gi-dek" data-o="gi-dek">${escH(a.summary)}</p>`:''}</div>`;
const author=$(O('gi-author-lead'));
$$('[data-gi-tile]',grid).forEach(t=>t.remove());grid.textContent='';
const list=$(O('gi-list'));if(list){const sec=list.closest('section')||list.parentElement;if(sec&&sec!==col)sec.remove();else list.remove();}
const topicsBox=$(O('gi-topics'));if(topicsBox)topicsBox.remove();
const f=feed[0];
const feat=mkEl('article','gi-tile gi-b-feat',{'data-gi-tile':'0'});
feat.innerHTML=pic(f,true)+words(f,'h2');
if(author){$(O('gi-tile-txt'),feat).appendChild(author);}
const all=mkEl('h2','gi-h2 gi-b-all',{id:'all'});all.textContent='All articles';
const g=mkEl('div','gi-b-grid');
feed.slice(1).forEach((a,i)=>{const c=mkEl('article','gi-tile gi-b-card',{'data-gi-tile':String(i+1)});c.innerHTML=pic(a,false)+words(a,'h3');g.appendChild(c);});
grid.append(feat,all,g);
$$('figure[data-gi-cover]',grid).forEach(fig=>plate(fig,fig.getAttribute('data-gi-cover'),fig.getAttribute('data-gi-title')||''));
const cnt=$(O('gi-open-count'));
if(cnt){
const first=$('.gfx-pg-t',cnt)||cnt.firstElementChild,mis=$$(O('gi-mi'),cnt),dates=feed.map(a=>(a.date?a.date.iso:'')).filter(Boolean).sort();
if(first)first.textContent=`${feed.length} ${feed.length===1?'article':'articles'}`;
const topicsN=new Set(feed.map(a=>a.topic).filter(Boolean)).size;
mis.forEach(el=>{const sep=$(O('gi-sep'),el);
if(/topic/i.test(el.textContent)){if(topicsN<=1){el.hidden=true;el.style.setProperty('display','none','important');}else{el.textContent=`${topicsN} topics`;if(sep)el.insertBefore(sep,el.firstChild);}}
else if(/^\s*since\b/i.test(el.textContent)&&dates[0]){const d=new Date(dates[0]+'T12:00:00');el.textContent='Since '+d.toLocaleString('en-US',{month:'long',year:'numeric'});if(sep)el.insertBefore(sep,el.firstChild);}});
}
return true;
}
function template(){
const rt=$(O('gi-rt'));if(!rt)return false;
H.classList.add('gi-cms');
const feed=$$(O('gi-feed-i')).map(e=>({
slug:(e.getAttribute('data-slug')||'').trim(),name:(e.getAttribute('data-name')||'').trim(),summary:(e.getAttribute('data-summary')||'').trim(),
date:parseDate(e.getAttribute('data-date')),mins:(e.getAttribute('data-mins')||'').trim(),topic:(e.getAttribute('data-topic')||'').trim(),
topicName:(e.getAttribute('data-topic-name')||'').trim(),cover:(e.getAttribute('data-cover')||'').trim()
})).filter(a=>a.slug&&a.name);
feed.sort((a,b)=>(b.date?b.date.iso:'').localeCompare(a.date?a.date.iso:''));
$$(O('gi-feed')).forEach(e=>e.remove());
const story=$(O('gi-story'));
const slug=((story&&story.getAttribute('data-gi-slug'))||location.pathname.replace(/\/+$/,'').split('/').pop()||'').trim();
const me=feed.find(a=>a.slug===slug)||null;
const h1=$('#gi-h1')||$(O('gi-atitle')),title=h1?h1.textContent.replace(/\s+/g,' ').trim():(me?me.name:'');
if(h1&&title)h1.innerHTML=titleHtml(title);
const ameta=$(O('gi-ameta'));
if(ameta){
const t=$('time',ameta),d=(t&&parseDate(t.textContent))||(me&&me.date);
if(t&&d){t.setAttribute('datetime',d.iso);t.textContent=d.label;}
const m=$('[data-gi-mins]',ameta),mm=m&&m.closest(O('gi-mi'));
if(mm){const n=m.textContent.trim()||(me?me.mins:'');mm.innerHTML=SEP+escH(n)+' min read';}
const cat=$(O('gi-acat'),ameta);
if(cat){const ts=(cat.getAttribute('data-gi-topic')||'').trim()||(me&&me.topic)||slugify(cat.textContent);cat.setAttribute('href','/insights'+(ts?'?topic='+encodeURIComponent(ts):'')+'#all');cat.removeAttribute('data-gi-topic');}
}
const b=body(rt);
tocFill(b.secs.map(s=>({id:s.id,text:sentenceHead(s.text)})).concat(b.sources?[{id:b.sources.id,text:'Sources'}]:[]));
const url=SITE+'/articles/'+slug;
const SH={in:'https://www.linkedin.com/sharing/share-offsite/?url=',x:'https://x.com/intent/post?url=',fb:'https://www.facebook.com/sharer/sharer.php?u='};
$$('a[data-gi-ico]').forEach(a=>{const k=a.getAttribute('data-gi-ico');if(SH[k])a.setAttribute('href',SH[k]+encodeURIComponent(url));});
$$('[data-gi-copy]').forEach(c=>c.setAttribute('data-gi-copy',url));
safe('article ld',()=>{
if(D.querySelector('script[data-gi-ld]'))return;
const meta=n=>{const m=D.querySelector('meta[property="'+n+'"],meta[name="'+n+'"]');return m?m.content:'';};
const t=ameta&&$('time',ameta),iso=(t&&t.getAttribute('datetime'))||(me&&me.date?me.date.iso:'');
const org={'@type':'Organization',name:'Grey Fox Partners',url:SITE,logo:{'@type':'ImageObject',url:LOGO}};
const byEl=$(O('gi-author-n'))||$(O('gi-ea-n')),byName=byEl?byEl.textContent.replace(/\s+/g,' ').trim():'';
const liEl=$(O('gi-endauthor')+' a[href*="linkedin.com/in/"]')||$(O('gi-author')+' a[href*="linkedin.com/in/"]');
const author=byName?{'@type':'Person',name:byName}:org;
if(byName&&PEOPLE[byName])author.url=SITE+PEOPLE[byName];
if(byName&&liEl)author.sameAs=[liEl.getAttribute('href')];
if(byName)author.worksFor={'@type':'Organization',name:'Grey Fox Partners',url:SITE};
const ld={'@context':'https://schema.org','@type':'Article',headline:title.slice(0,110),mainEntityOfPage:url,author,publisher:org};
const desc=meta('description'),img=meta('og:image');
if(desc)ld.description=desc;if(img)ld.image=img;if(iso)ld.datePublished=iso;
const sc=D.createElement('script');sc.type='application/ld+json';sc.setAttribute('data-gi-ld','');sc.textContent=JSON.stringify(ld);D.head.appendChild(sc);
});
const hero=$(O('gi-plate-hero'));
if(hero)plate(hero,hero.getAttribute('data-gi-cover')||(me?me.cover:''),title);
const at=me?feed.indexOf(me):-1,others=feed.filter(a=>a!==me);
const next=others.length?(at>=0&&feed[at+1])||others[0]:null;
const topic=(me&&me.topic)||'';
const rest=others.filter(a=>a!==next),more=rest.filter(a=>topic&&a.topic===topic).slice(0,3);
rest.forEach(a=>{if(more.length<3&&!more.includes(a))more.push(a);});
const nextSec=$(O('gi-next'));
if(nextSec&&next){
let grid=$(O('gi-next-grid'),nextSec);if(!grid){grid=mkEl('div','gi-wrap gi-next-grid');grid.className='gfx-pg-gi-next-grid';nextSec.appendChild(grid);}
grid.innerHTML=`<div class="gfx-pg-gi-next-txt" data-o="gi-next-txt"><p class="gfx-pg-gi-next-k" data-o="gi-next-k">Next article</p><h2 id="gi-next-h" class="gfx-pg-gi-next-t" data-gi-rise="" data-o="gi-next-t"><a class="gfx-pg-gi-tlink" href="${hrefOf(next)}" data-o="gi-tlink">${nb(next.name)}</a></h2>${next.summary?`<p class="gfx-pg-gi-dek" data-o="gi-dek">${escH(next.summary)}</p>`:''}${metaH(next,true)}</div><a class="gfx-pg-gi-next-pic" href="${hrefOf(next)}" tabindex="-1" aria-hidden="true" data-o="gi-next-pic">${figH('gfx-pg-gi-plate-next','gi-plate gi-plate-next',next)}</a>`;
}
const moreSec=$(O('gi-more')),mgrid=moreSec&&$(O('gi-more-grid'),moreSec);
if(mgrid&&more.length){
const card=(a,l)=>`<article class="gfx-pg-gi-mcard-${l?'l':'s'}" data-o="gi-mcard gi-mcard-${l?'l':'s'}"><a class="gfx-pg-gi-card-pic" href="${hrefOf(a)}" tabindex="-1" aria-hidden="true" data-o="gi-card-pic">${figH('gfx-pg-gi-plate','gi-plate',a)}</a><div class="gfx-pg-gi-mcard-txt" data-o="gi-mcard-txt">${metaH(a,l)}<h3 class="gfx-pg-gi-card-t" data-o="gi-card-t"><a class="gfx-pg-gi-tlink" href="${hrefOf(a)}" data-o="gi-tlink">${nb(a.name)}</a></h3>${l&&a.summary?`<p class="gfx-pg-gi-dek-s" data-o="gi-dek gi-dek-s">${escH(a.summary)}</p>`:''}</div></article>`;
mgrid.innerHTML=card(more[0],true)+(more.length>1?`<div class="gfx-pg-gi-more-side" data-o="gi-more-side">${more.slice(1).map(a=>card(a,false)).join('')}</div>`:'');
}
$$('figure[data-gi-cover]').forEach(f=>{if(f!==hero)plate(f,f.getAttribute('data-gi-cover'),f.getAttribute('data-gi-title')||'');});
return true;
}
const orig=gfx.page;
gfx.page=def=>{FIELD=def.field;orig(def);};
P.run({
current:'Insights',
dom:()=>{
safe('cms template',template);
safe('feed',feedIndex);
safe('prune',prune);
if(FIELD){FIELD.rooms=rooms();FIELD.drawnCovers=true;}
safe('share',share);safe('contents',contents);safe('topics',topics);
},
start:api=>{gsap=api.gsap;anim=!!gsap&&!REDUCE;if(anim)H.classList.add('gi-anim');safe('opening',opening);safe('scroll',scroll);},
rooms:()=>{safe('risers',risers);safe('quotes',quotes);},
late:()=>safe('sidebar arrow',()=>sidebarArrow(false)),
still:()=>{gsap=W.gsap||null;anim=false;safe('scroll',scroll);syncDark();safe('sidebar arrow',()=>sidebarArrow(true));}
});
gfx.page=orig;
})();
