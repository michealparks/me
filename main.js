function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function s(t){t.forEach(n)}function a(t){return"function"==typeof t}function l(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e){t.appendChild(e)}function o(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function f(t){return document.createElement(t)}function h(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function u(t){return document.createTextNode(t)}function d(){return u(" ")}function p(){return u("")}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t,e,n){e in t?t[e]=n:m(t,e,n)}function v(t,e,n){t.setAttributeNS("http://www.w3.org/1999/xlink",e,n)}function $(t){return Array.from(t.childNodes)}function y(t,e,n,r){for(let r=0;r<t.length;r+=1){const s=t[r];if(s.nodeName===e){let e=0;for(;e<s.attributes.length;){const t=s.attributes[e];n[t.name]?e++:s.removeAttribute(t.name)}return t.splice(r,1)[0]}}return r?h(e):f(e)}function b(t,e){for(let n=0;n<t.length;n+=1){const r=t[n];if(3===r.nodeType)return r.data=""+e,t.splice(n,1)[0]}return u(e)}function w(t){return b(t," ")}function x(t,e){e=""+e,t.data!==e&&(t.data=e)}function E(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}let k;function M(t){k=t}function z(t){(function(){if(!k)throw new Error("Function called outside component initialization");return k})().$$.on_mount.push(t)}const A=[],_=[],T=[],F=[],j=Promise.resolve();let C=!1;function N(t){T.push(t)}let B=!1;const I=new Set;function O(){if(!B){B=!0;do{for(let t=0;t<A.length;t+=1){const e=A[t];M(e),S(e.$$)}for(A.length=0;_.length;)_.pop()();for(let t=0;t<T.length;t+=1){const e=T[t];I.has(e)||(I.add(e),e())}T.length=0}while(A.length);for(;F.length;)F.pop()();C=!1,B=!1,I.clear()}}function S(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(N)}}const P=new Set;let D;function R(t,e){t&&t.i&&(P.delete(t),t.i(e))}function H(t,e,n,r){if(t&&t.o){if(P.has(t))return;P.add(t),D.c.push(()=>{P.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}function L(t,e){t.d(1),e.delete(t.key)}function G(t,e){H(t,1,1,()=>{e.delete(t.key)})}function q(t,e,n,r,s,a,l,c,o,i,f,h){let u=t.length,d=a.length,p=u;const m={};for(;p--;)m[t[p].key]=p;const g=[],v=new Map,$=new Map;for(p=d;p--;){const t=h(s,a,p),c=n(t);let o=l.get(c);o?r&&o.p(t,e):(o=i(c,t),o.c()),v.set(c,g[p]=o),c in m&&$.set(c,Math.abs(p-m[c]))}const y=new Set,b=new Set;function w(t){R(t,1),t.m(c,f),l.set(t.key,t),f=t.first,d--}for(;u&&d;){const e=g[d-1],n=t[u-1],r=e.key,s=n.key;e===n?(f=e.first,u--,d--):v.has(s)?!l.has(r)||y.has(r)?w(e):b.has(s)?u--:$.get(r)>$.get(s)?(b.add(r),w(e)):(y.add(s),u--):(o(n,l),u--)}for(;u--;){const e=t[u];v.has(e.key)||o(e,l)}for(;d;)w(g[d-1]);return g}function U(t){t&&t.c()}function Y(t,e){t&&t.l(e)}function J(t,e,r){const{fragment:l,on_mount:c,on_destroy:o,after_update:i}=t.$$;l&&l.m(e,r),N(()=>{const e=c.map(n).filter(a);o?o.push(...e):s(e),t.$$.on_mount=[]}),i.forEach(N)}function V(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function W(t,e){-1===t.$$.dirty[0]&&(A.push(t),C||(C=!0,j.then(O)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function K(e,n,a,l,c,o,i=[-1]){const f=k;M(e);const h=n.props||{},u=e.$$={fragment:null,ctx:null,props:o,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:r(),dirty:i};let d=!1;u.ctx=a?a(e,h,(t,n,...r)=>{const s=r.length?r[0]:n;return u.ctx&&c(u.ctx[t],u.ctx[t]=s)&&(u.bound[t]&&u.bound[t](s),d&&W(e,t)),n}):[],u.update(),d=!0,s(u.before_update),u.fragment=!!l&&l(u.ctx),n.target&&(n.hydrate?u.fragment&&u.fragment.l($(n.target)):u.fragment&&u.fragment.c(),n.intro&&R(e.$$.fragment),J(e,n.target,n.anchor),O()),M(f)}class Q{$destroy(){V(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}class X extends Q{constructor(t){super(),K(this,t,null,null,l,{})}}const Z={red:"#ef9a9a",pink:"#F48FB1",purple:"#CE93D8",deeppurple:"#B39DDB",indigo:"#9FA8DA",blue:"#90CAF9",lightblue:"#81D4FA",cyan:"#80DEEA",teal:"#80CBC4",green:"#A5D6A7",yellow:"#FFF59D",amber:"#FFE082",orange:"#FFCC80",deeporange:"#FFAB91"},tt=(t,e=1)=>`rgba(${parseInt(t.slice(1,3),16)}, ${parseInt(t.slice(3,5),16)}, ${parseInt(t.slice(5,7),16)}, ${e})`;function et(t,e,n){const r=t.slice();return r[7]=e[n],r}function nt(t,e){let n;return{key:t,first:null,c(){n=f("bg-circle"),this.h()},l(t){n=y(t,"BG-CIRCLE",{style:!0,class:!0}),$(n).forEach(i),this.h()},h(){E(n,"width",lt+"px"),E(n,"height",lt+"px"),E(n,"background-color",e[7].hex),E(n,"box-shadow","20px 20px 40px "+tt(e[7].hex,.7)+", -20px -20px 60px "+tt(e[7].hex,.2)),E(n,"transform","translate3d("+e[7].x+"px, "+e[7].y+"px, "+e[7].z+"px)"),E(n,"opacity",e[0]),E(n,"transition","transform "+st+"ms, opacity 1500ms"),g(n,"class","svelte-bvjtz1"),this.first=n},m(t,e){o(t,n,e)},p(t,e){4&e&&E(n,"background-color",t[7].hex),4&e&&E(n,"box-shadow","20px 20px 40px "+tt(t[7].hex,.7)+", -20px -20px 60px "+tt(t[7].hex,.2)),4&e&&E(n,"transform","translate3d("+t[7].x+"px, "+t[7].y+"px, "+t[7].z+"px)"),1&e&&E(n,"opacity",t[0])},d(t){t&&i(n)}}}function rt(e){let n,r,s,a,l,h,p=[],g=new Map,v=e[2];const x=t=>t[7].hex;for(let t=0;t<v.length;t+=1){let n=et(e,v,t),r=x(n);g.set(r,p[t]=nt(r,n))}return{c(){n=f("header"),r=f("section");for(let t=0;t<p.length;t+=1)p[t].c();s=d(),a=f("h1"),l=u("hi i am micheal 👋"),this.h()},l(t){n=y(t,"HEADER",{class:!0});var e=$(n);r=y(e,"SECTION",{style:!0,class:!0});var c=$(r);for(let t=0;t<p.length;t+=1)p[t].l(c);s=w(c),a=y(c,"H1",{style:!0,class:!0});var o=$(a);l=b(o,"hi i am micheal 👋"),o.forEach(i),c.forEach(i),e.forEach(i),this.h()},h(){E(a,"transition-duration",at+"ms"),m(a,"class",h="font-effect-anaglyph "+e[1]+" svelte-bvjtz1"),E(r,"height",e[3]+lt+"px"),m(r,"class","svelte-bvjtz1"),m(n,"class","svelte-bvjtz1")},m(t,e){o(t,n,e),c(n,r);for(let t=0;t<p.length;t+=1)p[t].m(r,null);c(r,s),c(r,a),c(a,l)},p(t,[e]){if(5&e){const n=t[2];p=q(p,e,x,1,t,n,g,r,L,nt,s,et)}2&e&&h!==(h="font-effect-anaglyph "+t[1]+" svelte-bvjtz1")&&m(a,"class",h)},i:t,o:t,d(t){t&&i(n);for(let t=0;t<p.length;t+=1)p[t].d()}}}const st=4e4,at=1e4,lt=150;function ct(t,e,n){const r=800-lt,s=200-lt;let a=0,l="",c=[];for(const t of Object.values(Z))c.push({hex:t,x:0,y:0,z:0});const o=(t=window.innerWidth-lt)=>{for(const e of c)e.x=Math.random()*Math.min(r,t),e.y=Math.random()*s,e.z=100*Math.random();n(2,c)},i=()=>{n(1,l=""===l?"expanded":"")};return o(r),z(()=>{setTimeout(()=>{n(0,a=.5),o(),i(),setInterval(i,at),setInterval(o,st)},10)}),[a,l,c,s]}class ot extends Q{constructor(t){super(),K(this,t,ct,rt,l,{})}}function it(e){let n,r,s,a,l,h,p,g;return{c(){n=f("a"),r=f("article"),s=f("h3"),a=u(e[2]),l=d(),h=f("p"),p=u(e[3]),this.h()},l(t){n=y(t,"A",{target:!0,href:!0,class:!0});var c=$(n);r=y(c,"ARTICLE",{});var o=$(r);s=y(o,"H3",{});var f=$(s);a=b(f,e[2]),f.forEach(i),l=w(o),h=y(o,"P",{});var u=$(h);p=b(u,e[3]),u.forEach(i),o.forEach(i),c.forEach(i),this.h()},h(){m(n,"target",g=e[0]?"_tab":"_self"),m(n,"href",e[1]),m(n,"class","svelte-163un4s")},m(t,e){o(t,n,e),c(n,r),c(r,s),c(s,a),c(r,l),c(r,h),c(h,p)},p(t,[e]){4&e&&x(a,t[2]),8&e&&x(p,t[3]),1&e&&g!==(g=t[0]?"_tab":"_self")&&m(n,"target",g),2&e&&m(n,"href",t[1])},i:t,o:t,d(t){t&&i(n)}}}function ft(t,e,n){let{newTab:r=!1}=e,{href:s=""}=e,{title:a=""}=e,{summary:l=""}=e;return t.$set=t=>{"newTab"in t&&n(0,r=t.newTab),"href"in t&&n(1,s=t.href),"title"in t&&n(2,a=t.title),"summary"in t&&n(3,l=t.summary)},[r,s,a,l]}class ht extends Q{constructor(t){super(),K(this,t,ft,it,l,{newTab:0,href:1,title:2,summary:3})}}function ut(t,e,n){const r=t.slice();return r[1]=e[n],r[3]=n,r}function dt(t,n){let r,s;const a=[n[1]];let l={};for(let t=0;t<a.length;t+=1)l=e(l,a[t]);const c=new ht({props:l});return{key:t,first:null,c(){r=p(),U(c.$$.fragment),this.h()},l(t){r=p(),Y(c.$$.fragment,t),this.h()},h(){this.first=r},m(t,e){o(t,r,e),J(c,t,e),s=!0},p(t,e){const n=1&e?function(t,e){const n={},r={},s={$$scope:1};let a=t.length;for(;a--;){const l=t[a],c=e[a];if(c){for(const t in l)t in c||(r[t]=1);for(const t in c)s[t]||(n[t]=c[t],s[t]=1);t[a]=c}else for(const t in l)s[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}(a,[(r=t[1],"object"==typeof r&&null!==r?r:{})]):{};var r;c.$set(n)},i(t){s||(R(c.$$.fragment,t),s=!0)},o(t){H(c.$$.fragment,t),s=!1},d(t){t&&i(r),V(c,t)}}}function pt(t){let e,n,r,a,l,h,p=[],v=new Map,x=t[0];const E=t=>t[3];for(let e=0;e<x.length;e+=1){let n=ut(t,x,e),r=E(n);v.set(r,p[e]=dt(r,n))}return{c(){e=f("section"),n=f("h2"),r=u("cabinet of curiosities"),a=d(),l=f("current-projects");for(let t=0;t<p.length;t+=1)p[t].c();this.h()},l(t){e=y(t,"SECTION",{class:!0});var s=$(e);n=y(s,"H2",{class:!0});var c=$(n);r=b(c,"cabinet of curiosities"),c.forEach(i),a=w(s),l=y(s,"CURRENT-PROJECTS",{class:!0});var o=$(l);for(let t=0;t<p.length;t+=1)p[t].l(o);o.forEach(i),s.forEach(i),this.h()},h(){m(n,"class","svelte-60oau2"),g(l,"class","svelte-60oau2"),m(e,"class","svelte-60oau2")},m(t,s){o(t,e,s),c(e,n),c(n,r),c(e,a),c(e,l);for(let t=0;t<p.length;t+=1)p[t].m(l,null);h=!0},p(t,[e]){if(1&e){const n=t[0];D={r:0,c:[],p:D},p=q(p,e,E,1,t,n,v,l,G,dt,null,ut),D.r||s(D.c),D=D.p}},i(t){if(!h){for(let t=0;t<x.length;t+=1)R(p[t]);h=!0}},o(t){for(let t=0;t<p.length;t+=1)H(p[t]);h=!1},d(t){t&&i(e);for(let t=0;t<p.length;t+=1)p[t].d()}}}function mt(t){return[[{title:"Galeri",summary:"Galeri is a chrome extension and desktop app focused on artwork discovery.",href:"https://galeri.io",newTab:!0}]]}class gt extends Q{constructor(t){super(),K(this,t,mt,pt,l,{})}}function vt(t,e,n){const r=t.slice();return r[0]=e[n],r[2]=n,r}function $t(e,n){let r,s,a;return{key:e,first:null,c(){r=f("span"),s=u(n[0]),this.h()},l(t){r=y(t,"SPAN",{style:!0,class:!0});var e=$(r);s=b(e,n[0]),e.forEach(i),this.h()},h(){m(r,"style",a="animation-delay: "+52*n[2]+"ms; "+(" "===n[0]?"margin-left: 10px;":"")),m(r,"class","svelte-1au8iln"),this.first=r},m(t,e){o(t,r,e),c(r,s)},p:t,d(t){t&&i(r)}}}function yt(e){let n,r,s,a,l,p,g,x,k,M,z,A,_,T,F,j,C,N,B,I,O,S,P,D,R,H,L,G,q,U,Y,J,V,W,K,Q,X,Z=[],tt=new Map;const et=t=>t[0];for(let t=0;t<"about this human:".length;t+=1){let n=vt(e,"about this human:",t),r=et(n);tt.set(r,Z[t]=$t(r,n))}return{c(){n=f("footer"),r=f("img"),a=d(),l=f("section"),p=f("h2");for(let t=0;t<Z.length;t+=1)Z[t].c();g=d(),x=f("p"),k=f("strong"),M=u("Micheal Parks"),z=u(" is a software engineer or whatever who lives in a "),A=f("a"),_=u("Large Apple"),T=u("."),F=d(),j=f("p"),C=f("span"),N=u("He has links for you but of course"),B=d(),I=f("a"),O=h("svg"),S=h("use"),P=d(),D=f("a"),R=h("svg"),H=h("use"),L=d(),G=f("a"),q=h("svg"),U=h("use"),Y=d(),J=f("span"),V=u("and the best link!!!!1!!1"),W=d(),K=f("a"),Q=h("svg"),X=h("use"),this.h()},l(t){n=y(t,"FOOTER",{class:!0});var e=$(n);r=y(e,"IMG",{alt:!0,src:!0,class:!0}),a=w(e),l=y(e,"SECTION",{});var s=$(l);p=y(s,"H2",{class:!0});var c=$(p);for(let t=0;t<Z.length;t+=1)Z[t].l(c);c.forEach(i),g=w(s),x=y(s,"P",{});var o=$(x);k=y(o,"STRONG",{});var f=$(k);M=b(f,"Micheal Parks"),f.forEach(i),z=b(o," is a software engineer or whatever who lives in a "),A=y(o,"A",{target:!0,href:!0});var h=$(A);_=b(h,"Large Apple"),h.forEach(i),T=b(o,"."),o.forEach(i),F=w(s),j=y(s,"P",{class:!0});var u=$(j);C=y(u,"SPAN",{class:!0});var d=$(C);N=b(d,"He has links for you but of course"),d.forEach(i),B=w(u),I=y(u,"A",{target:!0,href:!0,class:!0});var m=$(I);O=y(m,"svg",{class:!0},1);var v=$(O);S=y(v,"use",{"xlink:href":!0},1),$(S).forEach(i),v.forEach(i),m.forEach(i),P=w(u),D=y(u,"A",{target:!0,href:!0,class:!0});var E=$(D);R=y(E,"svg",{class:!0},1);var tt=$(R);H=y(tt,"use",{"xlink:href":!0},1),$(H).forEach(i),tt.forEach(i),E.forEach(i),L=w(u),G=y(u,"A",{target:!0,href:!0,class:!0});var et=$(G);q=y(et,"svg",{class:!0},1);var nt=$(q);U=y(nt,"use",{"xlink:href":!0},1),$(U).forEach(i),nt.forEach(i),et.forEach(i),Y=w(u),J=y(u,"SPAN",{style:!0,class:!0});var rt=$(J);V=b(rt,"and the best link!!!!1!!1"),rt.forEach(i),W=w(u),K=y(u,"A",{target:!0,href:!0,class:!0});var st=$(K);Q=y(st,"svg",{class:!0},1);var at=$(Q);X=y(at,"use",{"xlink:href":!0},1),$(X).forEach(i),at.forEach(i),st.forEach(i),u.forEach(i),s.forEach(i),e.forEach(i),this.h()},h(){m(r,"alt","Micheal's detatched head."),r.src!==(s="profile.jpg")&&m(r,"src","profile.jpg"),m(r,"class","svelte-1au8iln"),m(p,"class","svelte-1au8iln"),m(A,"target","_tab"),m(A,"href","https://duckduckgo.com/?q=new+york+city&ia=news&iaxm=about"),m(C,"class","svelte-1au8iln"),v(S,"xlink:href","#icon-spotify"),m(O,"class","icon icon-spotify svelte-1au8iln"),m(I,"target","_tab"),m(I,"href","https://open.spotify.com/user/micheal_parks"),m(I,"class","svelte-1au8iln"),v(H,"xlink:href","#icon-github"),m(R,"class","icon icon-github svelte-1au8iln"),m(D,"target","_tab"),m(D,"href","https://github.com/michealparks"),m(D,"class","svelte-1au8iln"),v(U,"xlink:href","#icon-soundcloud"),m(q,"class","icon icon-soundcloud svelte-1au8iln"),m(G,"target","_tab"),m(G,"href","https://soundcloud.com/dead_culture"),m(G,"class","svelte-1au8iln"),E(J,"margin-left","7px"),m(J,"class","svelte-1au8iln"),v(X,"xlink:href","#icon-linkedin"),m(Q,"class","icon icon-linkedin svelte-1au8iln"),m(K,"target","_tab"),m(K,"href","https://www.linkedin.com/in/michealparks/"),m(K,"class","svelte-1au8iln"),m(j,"class","social-media svelte-1au8iln"),m(n,"class","svelte-1au8iln")},m(t,e){o(t,n,e),c(n,r),c(n,a),c(n,l),c(l,p);for(let t=0;t<Z.length;t+=1)Z[t].m(p,null);c(l,g),c(l,x),c(x,k),c(k,M),c(x,z),c(x,A),c(A,_),c(x,T),c(l,F),c(l,j),c(j,C),c(C,N),c(j,B),c(j,I),c(I,O),c(O,S),c(j,P),c(j,D),c(D,R),c(R,H),c(j,L),c(j,G),c(G,q),c(q,U),c(j,Y),c(j,J),c(J,V),c(j,W),c(j,K),c(K,Q),c(Q,X)},p:t,i:t,o:t,d(t){t&&i(n);for(let t=0;t<Z.length;t+=1)Z[t].d()}}}class bt extends Q{constructor(t){super(),K(this,t,null,yt,l,{})}}function wt(e){let n,r,s;return{c(){n=f("button"),r=u("pump up my jamz"),this.h()},l(t){n=y(t,"BUTTON",{id:!0,class:!0});var e=$(n);r=b(e,"pump up my jamz"),e.forEach(i),this.h()},h(){m(n,"id","jamz-button"),m(n,"class","svelte-1i6fbd5")},m(t,a){var l,i,f,h;o(t,n,a),c(n,r),l=n,i="click",f=e[1],l.addEventListener(i,f,h),s=()=>l.removeEventListener(i,f,h)},p:t,d(t){t&&i(n),s()}}}function xt(e){let n,r,s,a=!1===e[0]&&wt(e);return{c(){a&&a.c(),n=d(),r=f("iframe"),this.h()},l(t){a&&a.l(t),n=w(t),r=y(t,"IFRAME",{id:!0,title:!0,width:!0,height:!0,src:!0,frameborder:!0,allow:!0,allowfullscreen:!0,class:!0}),$(r).forEach(i),this.h()},h(){m(r,"id","jamz"),m(r,"title","Jamz"),m(r,"width","560"),m(r,"height","315"),r.src!==(s="https://www.youtube.com/embed/4T1t5OFOYDU?enablejsapi=1")&&m(r,"src","https://www.youtube.com/embed/4T1t5OFOYDU?enablejsapi=1"),m(r,"frameborder","0"),m(r,"allow","accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"),r.allowFullscreen=!0,m(r,"class","svelte-1i6fbd5")},m(t,e){a&&a.m(t,e),o(t,n,e),o(t,r,e)},p(t,[e]){!1===t[0]?a?a.p(t,e):(a=wt(t),a.c(),a.m(n.parentNode,n)):a&&(a.d(1),a=null)},i:t,o:t,d(t){a&&a.d(t),t&&i(n),t&&i(r)}}}function Et(t,e,n){let r,s=!1;return z(()=>{let t,e=document.createElement("script");e.async=!0,e.src="https://www.youtube.com/iframe_api",document.head.appendChild(e),window.onYouTubeIframeAPIReady=()=>{t=new YT.Player("jamz",{events:{onReady:t=>{console.log("ready",t),r=t.target}}})}}),[s,()=>{r.playVideo(),document.querySelector("main").style.backgroundColor="rgba(0, 0, 0, 0.5)",n(0,s=!0)}]}class kt extends Q{constructor(t){super(),K(this,t,Et,xt,l,{})}}function Mt(e){let n,r,s,a,l,u,p,g,v,b,x,k;return{c(){n=f("div"),r=h("svg"),s=h("path"),a=d(),l=h("svg"),u=h("path"),p=d(),g=h("svg"),v=h("path"),b=d(),x=h("svg"),k=h("path"),this.h()},l(t){n=y(t,"DIV",{style:!0});var e=$(n);r=y(e,"svg",{id:!0,viewBox:!0},1);var c=$(r);s=y(c,"path",{fill:!0,style:!0,d:!0},1),$(s).forEach(i),c.forEach(i),a=w(e),l=y(e,"svg",{id:!0,viewBox:!0},1);var o=$(l);u=y(o,"path",{fill:!0,style:!0,d:!0},1),$(u).forEach(i),o.forEach(i),p=w(e),g=y(e,"svg",{id:!0,viewBox:!0},1);var f=$(g);v=y(f,"path",{fill:!0,d:!0},1),$(v).forEach(i),f.forEach(i),b=w(e),x=y(e,"svg",{id:!0,viewBox:!0},1);var h=$(x);k=y(h,"path",{fill:!0,style:!0,d:!0},1),$(k).forEach(i),h.forEach(i),e.forEach(i),this.h()},h(){m(s,"fill","#1ed760"),E(s,"fill","#1ed760"),m(s,"d","M16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.12-16-16-16zM23.361 23.12c-0.32 0.479-0.88 0.64-1.361 0.32-3.76-2.32-8.48-2.801-14.081-1.521-0.557 0.163-1.039-0.239-1.199-0.719-0.16-0.561 0.24-1.040 0.72-1.2 6.080-1.361 11.36-0.8 15.52 1.76 0.56 0.24 0.639 0.879 0.401 1.36zM25.281 18.72c-0.401 0.56-1.121 0.8-1.683 0.4-4.319-2.64-10.879-3.44-15.919-1.84-0.639 0.16-1.36-0.16-1.52-0.8s0.16-1.361 0.8-1.521c5.84-1.759 13.040-0.877 18 2.161 0.481 0.241 0.72 1.040 0.321 1.6zM25.441 14.24c-5.121-3.040-13.681-3.36-18.561-1.839-0.8 0.239-1.6-0.241-1.84-0.961-0.24-0.801 0.24-1.6 0.96-1.841 5.68-1.68 15.040-1.36 20.961 2.161 0.719 0.4 0.959 1.36 0.559 2.080-0.399 0.561-1.36 0.799-2.079 0.4z"),m(r,"id","icon-spotify"),m(r,"viewBox","0 0 32 32"),m(u,"fill","#f30"),E(u,"fill","#f30"),m(u,"d","M1.567 16.3c-0.068 0-0.125 0.061-0.135 0.133l-0.311 2.872 0.311 2.807c0.009 0.077 0.067 0.131 0.135 0.131 0.067 0 0.12-0.053 0.132-0.131l0.34-2.807-0.36-2.872c0-0.076-0.060-0.133-0.12-0.133zM0.36 17.404c-0.080 0-0.121 0.049-0.139 0.125l-0.221 1.776 0.22 1.744c0 0.073 0.060 0.125 0.12 0.125s0.119-0.060 0.139-0.139l0.28-1.759-0.28-1.779c0-0.081-0.059-0.12-0.12-0.12zM2.799 15.74c-0.081 0-0.16 0.060-0.16 0.139l-0.28 3.417 0.3 3.277c0 0.080 0.060 0.16 0.159 0.16 0.081 0 0.14-0.081 0.161-0.16l0.339-3.299-0.339-3.397c-0.021-0.080-0.081-0.16-0.161-0.16zM4.077 15.599c-0.1 0-0.18 0.080-0.2 0.18l-0.257 3.52 0.28 3.392c0.021 0.103 0.1 0.184 0.199 0.184 0.1 0 0.18-0.081 0.2-0.2l0.32-3.376-0.32-3.497c0-0.1-0.080-0.18-0.18-0.18zM5.617 16.079c-0.007-0.12-0.1-0.199-0.212-0.199-0.12 0-0.211 0.080-0.219 0.199l-0.289 3.24 0.267 3.417c0 0.12 0.1 0.209 0.212 0.209 0.099 0 0.197-0.091 0.197-0.211l0.303-3.417-0.303-3.259zM6.696 13.8c-0.135 0-0.24 0.12-0.24 0.241l-0.28 5.276 0.249 3.417c0 0.12 0.107 0.219 0.24 0.219 0.125 0 0.232-0.12 0.24-0.24l0.279-3.417-0.279-5.296c-0.011-0.139-0.117-0.24-0.24-0.24zM7.944 12.541c-0.14 0-0.26 0.12-0.271 0.259l-0.24 6.496 0.22 3.397c0 0.16 0.12 0.279 0.26 0.279 0.139 0 0.259-0.119 0.28-0.279l0.257-3.397-0.256-6.475c-0.021-0.16-0.14-0.28-0.28-0.28zM9.233 11.943c-0.161 0-0.281 0.119-0.3 0.279l-0.22 7.033 0.22 3.36c0.019 0.159 0.139 0.3 0.3 0.3 0.159 0 0.3-0.14 0.3-0.3l0.26-3.36-0.261-7.033c0-0.16-0.14-0.3-0.3-0.3zM10.892 11.981c0-0.18-0.14-0.32-0.32-0.32-0.159 0-0.32 0.14-0.32 0.32l-0.199 7.255 0.199 3.337c0.021 0.18 0.161 0.32 0.341 0.32s0.32-0.14 0.32-0.32l0.219-3.337-0.219-7.275zM11.891 11.803c-0.18 0-0.34 0.159-0.34 0.339l-0.2 7.096 0.2 3.297c0 0.2 0.16 0.34 0.34 0.34s0.34-0.16 0.34-0.36l0.2-3.299-0.22-7.076c0-0.197-0.16-0.36-0.361-0.36zM13.189 12.001c-0.219 0-0.379 0.18-0.379 0.38l-0.137 6.857 0.18 3.299c0 0.199 0.159 0.369 0.379 0.369 0.199 0 0.361-0.16 0.379-0.38l0.161-3.257-0.18-6.816c-0.016-0.219-0.18-0.38-0.38-0.38zM14.791 10.813c-0.060-0.039-0.14-0.059-0.22-0.059s-0.159 0.020-0.22 0.059c-0.12 0.072-0.199 0.2-0.199 0.34v0.081l-0.139 8.064 0.153 3.265v0.011c0.011 0.080 0.040 0.18 0.099 0.24 0.077 0.081 0.189 0.139 0.312 0.139 0.107 0 0.211-0.059 0.279-0.12 0.077-0.080 0.121-0.18 0.121-0.3l0.020-0.32 0.156-2.937-0.18-8.115c0-0.139-0.081-0.257-0.18-0.319zM16.132 10.084c-0.060-0.060-0.12-0.081-0.2-0.081-0.099 0-0.199 0.021-0.279 0.081-0.1 0.081-0.159 0.2-0.159 0.32v0.039l-0.183 8.812 0.101 1.62 0.081 1.58c0 0.219 0.197 0.419 0.437 0.419 0.241 0 0.44-0.2 0.44-0.439l0.2-3.219-0.2-8.849c0-0.16-0.099-0.295-0.22-0.369zM28.064 15.033c-0.54 0-1.060 0.115-1.519 0.309-0.32-3.539-3.28-6.315-6.917-6.315-0.879 0-1.74 0.18-2.519 0.479-0.3 0.12-0.36 0.24-0.38 0.479v12.491c0.021 0.24 0.2 0.44 0.44 0.46h10.913c2.159 0.021 3.917-1.717 3.917-3.896s-1.759-3.936-3.917-3.936z"),m(l,"id","icon-soundcloud"),m(l,"viewBox","0 0 32 32"),m(v,"fill","#fff"),m(v,"d","M16 0.396c-8.84 0-16 7.164-16 16 0 7.071 4.584 13.067 10.94 15.18 0.8 0.151 1.093-0.344 1.093-0.769 0-0.38-0.013-1.387-0.020-2.72-4.451 0.965-5.389-2.147-5.389-2.147-0.728-1.847-1.78-2.34-1.78-2.34-1.449-0.992 0.112-0.972 0.112-0.972 1.607 0.112 2.451 1.648 2.451 1.648 1.427 2.447 3.745 1.74 4.66 1.331 0.144-1.035 0.556-1.74 1.013-2.14-3.553-0.4-7.288-1.776-7.288-7.907 0-1.747 0.62-3.173 1.647-4.293-0.18-0.404-0.72-2.031 0.14-4.235 0 0 1.34-0.429 4.4 1.64 1.28-0.356 2.64-0.532 4-0.54 1.36 0.008 2.72 0.184 4 0.54 3.040-2.069 4.38-1.64 4.38-1.64 0.86 2.204 0.32 3.831 0.16 4.235 1.020 1.12 1.64 2.547 1.64 4.293 0 6.147-3.74 7.5-7.3 7.893 0.56 0.48 1.080 1.461 1.080 2.96 0 2.141-0.020 3.861-0.020 4.381 0 0.42 0.28 0.92 1.1 0.76 6.401-2.099 10.981-8.099 10.981-15.159 0-8.836-7.164-16-16-16z"),m(g,"id","icon-github"),m(g,"viewBox","0 0 32 32"),m(k,"fill","#0077b5"),E(k,"fill","var(--color1, #0077b5)"),m(k,"d","M27.263 27.269h-4.739v-7.425c0-1.771-0.036-4.049-2.469-4.049-2.471 0-2.848 1.927-2.848 3.919v7.556h-4.739v-15.269h4.552v2.081h0.061c0.636-1.2 2.183-2.467 4.493-2.467 4.801 0 5.689 3.16 5.689 7.273zM7.116 9.911c-1.525 0-2.751-1.235-2.751-2.753 0-1.517 1.227-2.751 2.751-2.751 1.52 0 2.752 1.233 2.752 2.751 0 1.519-1.233 2.753-2.752 2.753zM9.492 27.269h-4.752v-15.269h4.752zM29.633 0h-27.272c-1.305 0-2.361 1.032-2.361 2.305v27.389c0 1.275 1.056 2.305 2.361 2.305h27.268c1.304 0 2.371-1.031 2.371-2.305v-27.389c0-1.273-1.067-2.305-2.371-2.305z"),m(x,"id","icon-linkedin"),m(x,"viewBox","0 0 32 32"),E(n,"display","none")},m(t,e){o(t,n,e),c(n,r),c(r,s),c(n,a),c(n,l),c(l,u),c(n,p),c(n,g),c(g,v),c(n,b),c(n,x),c(x,k)},p:t,i:t,o:t,d(t){t&&i(n)}}}class zt extends Q{constructor(t){super(),K(this,t,null,Mt,l,{})}}function At(e){let n,r,s,a,l,h,u;const p=new X({}),g=new ot({}),v=new gt({}),b=new bt({}),x=new kt({}),E=new zt({});return{c(){n=f("main"),U(p.$$.fragment),r=d(),U(g.$$.fragment),s=d(),U(v.$$.fragment),a=d(),U(b.$$.fragment),l=d(),U(x.$$.fragment),h=d(),U(E.$$.fragment),this.h()},l(t){n=y(t,"MAIN",{class:!0});var e=$(n);Y(p.$$.fragment,e),r=w(e),Y(g.$$.fragment,e),s=w(e),Y(v.$$.fragment,e),a=w(e),Y(b.$$.fragment,e),l=w(e),Y(x.$$.fragment,e),h=w(e),Y(E.$$.fragment,e),e.forEach(i),this.h()},h(){m(n,"class","svelte-6rwaq7")},m(t,e){o(t,n,e),J(p,n,null),c(n,r),J(g,n,null),c(n,s),J(v,n,null),c(n,a),J(b,n,null),c(n,l),J(x,n,null),c(n,h),J(E,n,null),u=!0},p:t,i(t){u||(R(p.$$.fragment,t),R(g.$$.fragment,t),R(v.$$.fragment,t),R(b.$$.fragment,t),R(x.$$.fragment,t),R(E.$$.fragment,t),u=!0)},o(t){H(p.$$.fragment,t),H(g.$$.fragment,t),H(v.$$.fragment,t),H(b.$$.fragment,t),H(x.$$.fragment,t),H(E.$$.fragment,t),u=!1},d(t){t&&i(n),V(p),V(g),V(v),V(b),V(x),V(E)}}}export default class extends Q{constructor(t){super(),K(this,t,null,At,l,{})}}
