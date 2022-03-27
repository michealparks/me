import{V as le,P as It,B as Ee,u as h,r as c,j as y,F as O,a as n,M as te,b as ae,s as Se,E as be,c as De,N as xe,d as Te,C as Me,e as Oe,f as Ie,g as Re,A as Le,h as ve,i as ze,k as Ne}from"./vendor.b140d3e7.js";const Pe=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=i(o);fetch(o.href,s)}};Pe();new le(0,1,0);const He=40,Fe=1/60,Qe=-9.8,ke=100,$=0,I=1,ce=2,M=0,Ye=1,Ve=2,_e=1,qe=2,Y=4,de=4,Je=1,Ue=2,Ge=65535,Ke=65533,Ae=new Set,P=new Map,F=new Map,Q=new Map,q=new Map,Z=new Map,U=new Map,ne=new Map;let T,G,d,K=0,ie=0,se=0,B=0,b=0,V,H,l,f,A,j,ee,k;const Xe=async()=>{l=await globalThis.Ammo(),f=new l.btTransform,A=new l.btVector3,j=new l.btVector3,ee=new l.btVector3,k=new l.btQuaternion;const e=new l.btDefaultCollisionConfiguration,t=new l.btCollisionDispatcher(e),i=new l.btDbvtBroadphase,a=new l.btSequentialImpulseConstraintSolver;T=new l.btDiscreteDynamicsWorld(t,i,a,e),T.setGravity(new l.btVector3(0,Qe,0))},We=e=>{var i;K=performance.now(),se=(K-ie)/1e3,ie=K,T.stepSimulation(se,He,Fe),B=0;for(d of Ae)d.isActive()!==!1&&(G=d.getMotionState(),G.getWorldTransform(f),V=f.getOrigin(),H=f.getRotation(),b=7*B,e[b+0]=V.x(),e[b+1]=V.y(),e[b+2]=V.z(),e[b+3]=H.x(),e[b+4]=H.y(),e[b+5]=H.z(),e[b+6]=H.w(),d.linkedRigidbodyId!==void 0&&((i=P.get(d.linkedRigidbodyId))==null||i.setMotionState(G)),B+=1);const t=[];$e(t),Ze(t)},_=(e,t)=>{const{id:i}=e;let a=!1;F.has(i)===!1&&F.set(i,{body:e,others:new Map});const o=F.get(i);return o.others.has(t.id)===!1&&(o.others.set(t.id,t),a=!0),Q.has(i)===!1&&Q.set(i,{body:e,others:new Map}),Q.get(i).others.set(t.id,t),a},z=(e,t,i)=>{e.has(t)===!1&&e.set(t,[]),e.get(t).push(i)},$e=e=>{U.clear(),q.clear(),Q.clear();const t=T.getDispatcher(),i=t.getNumManifolds();for(B=0;B<i;B++){const a=t.getManifoldByIndexInternal(B);if(a.getNumContacts()===0)continue;const s=l.castObject(a.getBody0(),l.btRigidBody),r=l.castObject(a.getBody1(),l.btRigidBody),u=s.getCollisionFlags(),m=r.getCollisionFlags();let p=!1;const w=(u&Y)===Y,C=(m&Y)===Y;w||C?(p=_(s,r),p&&C===!1&&(z(U,s.id,r.id),s.enter&&(r.name===s.entity||s.entity==="any")&&e.push([s.enter,s.id,r.id])),p=_(r,s),p&&w===!1&&(z(U,r.id,s.id),r.enter&&(s.name===r.entity||r.entity==="any")&&e.push([r.enter,r.id,s.id]))):(p=_(s,r),p&&z(q,s.id,r.id),p=_(r,s),p&&z(q,r.id,s.id))}},Ze=e=>{ne.clear(),Z.clear();for(const[t,i]of F){const a=Q.get(t),{body:o,others:s}=i;for(const[r,u]of s)(a===void 0||a.others.has(r)===!1)&&(s.delete(r),o.trigger===!0?(z(ne,o.id,u.id),o.leave&&(u.name===o.entity||o.entity==="any")&&e.push([o.leave,o.id,u.id])):u.trigger===!1&&z(Z,o.id,u.id));s.size===0&&F.delete(t)}},je=(e,t,i,a)=>{switch(t){case M:return A.setValue(i[7],i[8],i[9]),new l.btBoxShape(A);case Ve:if(a===void 0)throw new Error(`${e}: vertices is undefined`);{const o=new l.btTriangleMesh,s=!0;for(let r=0,u=a.length;r<u;r+=9)A.setValue(a[r+0],a[r+1],a[r+2]),j.setValue(a[r+3],a[r+4],a[r+5]),ee.setValue(a[r+6],a[r+7],a[r+8]),o.addTriangle(A,j,ee,!0);return new l.btBvhTriangleMeshShape(o,s)}case Ye:return new l.btSphereShape(i[7]);default:throw new Error("Shape not specified.")}},X=(e,t,i)=>{var p,w,C,R,L,v;const{transform:a}=e;let o;const s=je(e.name,e.shape,a,e.triangles);s.setMargin(0),t===!0&&(o=new l.btVector3(0,0,0),s.calculateLocalInertia((p=e.mass)!=null?p:0,o)),A.setValue(a[0],a[1],a[2]),k.setValue(a[3],a[4],a[5],a[6]),f.setOrigin(A),f.setRotation(k);const r=new l.btDefaultMotionState(f),u=new l.btRigidBodyConstructionInfo((w=e.mass)!=null?w:0,r,s,o),m=new l.btRigidBody(u);return m.type=e.type,m.trigger=!1,m.id=e.id,m.name=e.name,m.linkedRigidbodyId=e.linkedRigidbodyId,m.setRestitution((C=e.restitution)!=null?C:0),m.setFriction((R=e.friction)!=null?R:0),m.setDamping((L=e.linearDamping)!=null?L:0,(v=e.angularDamping)!=null?v:0),m.setActivationState(de),i!==void 0&&m.setCollisionFlags(m.getCollisionFlags()|i),l.destroy(u),t===!0&&l.destroy(o),P.set(m.id,m),m},et=e=>{let t,i,a;for(const o of e)switch(o.type){case $:a=!1,t=_e,i=X(o,a,t),T.addRigidBody(i,Ue,Ke);break;case I:a=(o.mass||0)!==0,t=void 0,i=X(o,a,t),Ae.add(i),T.addRigidBody(i,Je,Ge);break;case ce:a=!1,t=qe,i=X(o,a,t),i.setActivationState(de),T.addRigidBody(i)}},tt=(e,t)=>{d=P.get(e),A.setValue(t.x,t.y,t.z),d.applyCentralImpulse(A),d.activate()},at=(e,t)=>{d=P.get(e),A.setValue(t.x,t.y,t.z),d.applyCentralForce(A),d.activate()},ot=(e,t)=>{d=P.get(e),A.setValue(t.x,t.y,t.z),d.applyTorqueImpulse(A),d.activate()},me=(e,t,i=!1,a=0)=>{var o;d=P.get(e),d.activate(),i===!0&&(A.setValue(0,0,0),d.setLinearVelocity(A),A.setValue(0,0,0),d.setAngularVelocity(A)),A.setValue(t[a+0],t[a+1],t[a+2]),k.setValue(t[a+3],t[a+4],t[a+5],t[a+6]),f.setOrigin(A),f.setRotation(k),d.setWorldTransform(f),d.type===ce&&((o=d.getMotionState())==null||o.setWorldTransform(f))},nt=(e,t,i=!1)=>{B=0;for(const a of e)me(a,t,i,B),B+=7},it=(e,t,i)=>{A.setValue(e,t,i),T.setGravity(A)},E={collisionStart:q,collisionEnd:Z,init:Xe,update:We,applyCentralImpulse:tt,applyTorqueImpulse:ot,applyCentralForce:at,teleport:me,teleportMany:nt,createRigidbodies:et,setGravity:it},ue=new Map,oe=new Set;let D=new Float32Array(ke*7),W=0,x=0;const st=()=>{E.update(D),W=0;for(const e of oe)x=7*W,e.position.set(D[x+0],D[x+1],D[x+2]),e.quaternion.set(D[x+3],D[x+4],D[x+5],D[x+6]),e.updateMatrix(),W+=1},rt=(e,t)=>{switch(ue.set(e.id,e),e.matrixAutoUpdate=!1,E.createRigidbodies([t]),t.type){case I:oe.add(e);break}},S={bodyMap:ue,dynamicBodies:oe,update:st,add:rt,applyTorqueImpulse:E.applyTorqueImpulse,applyCentralImpulse:E.applyCentralImpulse,applyCentralForce:E.applyCentralForce,teleport:E.teleport,teleportMany:E.teleportMany},N=new le,lt=new Ee,ct=(e,t)=>{lt.setFromObject(e).getSize(N),t[7]=N.x/2,t[8]=N.y/2,t[9]=N.z/2},dt=(e,t)=>{const i=(Math.random()-.5)*6,a=Math.random(),o=(Math.random()-.5)*6,s=Math.random(),r=Math.random(),u=Math.random();return e.position.set(i,a,o),e.rotation.set(s,r,u),e.updateMatrix(),t[0]=i,t[1]=a,t[2]=o,t[3]=e.quaternion.x,t[4]=e.quaternion.y,t[5]=e.quaternion.z,t[6]=e.quaternion.w,t},At=(e,t=.1)=>{N.set((Math.random()-.5)*t,(Math.random()-.5)*t,(Math.random()-.5)*t),S.applyTorqueImpulse(e,N)},mt=e=>{let t=e.length-1,i=0,a;for(;t>0;)i=Math.random()*(t+1)|0,a=e[t],e[t]=e[i],e[i]=a,t-=1;return e},ut=(e,t=300)=>{let i;return function(...a){clearTimeout(i),i=setTimeout(()=>e.apply(this,a),t)}},gt=e=>{const t=new Map,i=function(a){return(t.has(a)||t.set(a,e.call(this,a)))&&t.get(a)};return i.cache=t,i},g={getSize:ct,setRandomTransform:dt,setRandomTorque:At,shuffleArray:mt,debounce:ut,memoize:gt},ge=new URL("/assets/lego.11391bd8.glb",self.location).href,pt=()=>{const{nodes:e,materials:t}=h(ge),i=[c.exports.useRef(),c.exports.useRef(),c.exports.useRef(),c.exports.useRef(),c.exports.useRef()];return c.exports.useEffect(()=>{for(const a of i.map(o=>o.current)){const o=new Float32Array(10);g.setRandomTransform(a,o),g.getSize(a,o),S.add(a,{id:a.id,name:a.name,type:I,shape:M,transform:o,mass:1,linearDamping:0,angularDamping:0,friction:.3,restitution:.9}),g.setRandomTorque(a.id,.05)}},[]),y(O,{children:[n("mesh",{name:"Lego1",ref:i[0],castShadow:!0,receiveShadow:!0,geometry:e.Lego1.geometry,material:t.Material}),n("mesh",{name:"Lego2",ref:i[1],castShadow:!0,receiveShadow:!0,geometry:e.Lego2.geometry,material:t["Material.001"]}),n("mesh",{name:"Lego3",ref:i[2],castShadow:!0,receiveShadow:!0,geometry:e.Lego3.geometry,material:t["Material.002"]}),n("mesh",{name:"Lego4",ref:i[3],castShadow:!0,receiveShadow:!0,geometry:e.Lego4.geometry,material:t["Material.003"]}),n("mesh",{name:"Lego5",ref:i[4],castShadow:!0,receiveShadow:!0,geometry:e.Lego5.geometry,material:t["Material.004"]})]})};h.preload(ge);const pe=new URL("/assets/switch.f6572cad.glb",self.location).href;function ht(){const{nodes:e,materials:t}=h(pe),i=c.exports.useRef();return c.exports.useEffect(()=>{const a=i.current,o=new Float32Array(10);g.setRandomTransform(a,o),g.getSize(new te(e.BoundingBox.geometry),o),S.add(a,{id:a.id,name:a.name,type:I,shape:M,transform:o,mass:1,linearDamping:0,angularDamping:0,friction:.3,restitution:.9}),g.setRandomTorque(a.id,.05)},[]),n("group",{name:"Switch",ref:i,children:n(ae,{castShadow:!0,receiveShadow:!0,meshes:[e.Cube001,e.Cube001_1,e.Cube001_2,e.Right_Stick,e.Left_Stick,e.Pad,e.Body001,e.Body002,e.Body003,e.Body004,e.Body005,e.Body006,e.Screen],children:(a,o,s,r,u,m,p,w,C,R,L,v,J)=>y(O,{children:[n(a,{material:t.Body}),n(o,{material:t["Body Black"]}),n(s,{material:e.Cube001_2.material}),n(r,{material:e.Right_Stick.material}),n(u,{material:e.Left_Stick.material}),n(m,{material:e.Pad.material}),n(p,{material:t.Glass}),n(w,{material:e.Body001.material}),n(C,{material:e.Body002.material}),n(R,{material:e.Body003.material}),n(L,{material:e.Body004.material}),n(v,{material:e.Body005.material}),n(J,{material:e.Body006.material})]})})})}h.preload(pe);const he=new URL("/assets/synth.26258706.glb",self.location).href;function ft(){const{nodes:e,materials:t}=h(he),i=c.exports.useRef();return c.exports.useEffect(()=>{const a=i.current,o=new Float32Array(10);g.setRandomTransform(a,o),g.getSize(new te(e.BoundingBox.geometry),o),S.add(a,{id:a.id,name:a.name,type:I,shape:M,transform:o,mass:1,linearDamping:0,angularDamping:0,friction:.3,restitution:.9}),g.setRandomTorque(a.id,.05)},[]),n("group",{name:"Synth",ref:i,children:n(ae,{castShadow:!0,receiveShadow:!0,meshes:[e.Cube,e.Cube001,e.Cube002,e.Cube003,e.Cube004,e.Cube005,e.Cube006,e.Cube007,e.Cube011,e.Cube012,e.Cube014,e.Cylinder,e.Cylinder001,e.Cylinder002,e.Cylinder003],children:(a,o,s,r,u,m,p,w,C,R,L,v,J,we,Ce)=>y(O,{children:[n(a,{material:t["Black Paint"]}),n(o,{material:t["White Key"]}),n(s,{material:t.Wood}),n(r,{material:e.Cube003.material}),n(u,{material:e.Cube004.material}),n(m,{material:e.Cube005.material}),n(p,{material:e.Cube006.material}),n(w,{material:e.Cube007.material}),n(C,{material:e.Cube011.material}),n(R,{material:e.Cube011.material}),n(L,{material:e.Cube014.material}),n(v,{material:e.Cylinder.material}),n(J,{material:e.Cylinder001.material}),n(we,{material:e.Cylinder002.material}),n(Ce,{material:e.Cylinder003.material})]})})})}h.preload(he);const fe=new URL("/assets/plant.09f3cd7a.glb",self.location).href,yt=()=>{const e=c.exports.useRef(),{nodes:t,materials:i}=h(fe);return c.exports.useEffect(()=>{const a=e.current,o=new Float32Array(10);g.setRandomTransform(a,o),g.getSize(new te(t.BoundingBox.geometry),o),S.add(a,{id:a.id,name:a.name,type:I,shape:M,transform:o,mass:1,linearDamping:0,angularDamping:0,friction:.3,restitution:.9}),g.setRandomTorque(a.id,.05)},[]),n("group",{name:"Plant",ref:e,children:n(ae,{castShadow:!0,receiveShadow:!0,meshes:[t.Circle,t.Circle_1,t.Circle_2],children:(a,o,s)=>y(O,{children:[n(a,{material:i.Dirt}),n(o,{material:i.Clay}),n(s,{material:i.Leaf})]})})})};h.preload(fe);const ye=new URL("/assets/portrait.10a8641f.glb",self.location).href;function Bt(){const e=c.exports.useRef(),{nodes:t,materials:i}=h(ye);return c.exports.useEffect(()=>{const a=e.current,o=new Float32Array(10);g.setRandomTransform(a,o),g.getSize(a,o),S.add(a,{id:a.id,name:a.name,type:I,shape:M,transform:o,mass:1,linearDamping:0,angularDamping:0,friction:.3,restitution:.9}),g.setRandomTorque(a.id,.05)},[]),n("mesh",{name:"Portrait",ref:e,castShadow:!0,receiveShadow:!0,geometry:t.Portrait.geometry,material:i.Bake})}h.preload(ye);const Be=new URL("/assets/name.7ef9a1c7.glb",self.location).href,wt=()=>{const{nodes:e}=h(Be),t=c.exports.useRef(),i=c.exports.useRef();return c.exports.useEffect(()=>{const a=t.current,o=new Float32Array(10);o[0]=a.position.x,o[1]=a.position.y,o[2]=a.position.z,o[3]=a.quaternion.x,o[4]=a.quaternion.y,o[5]=a.quaternion.z,o[6]=a.quaternion.w,g.getSize(a,o);const s=i.current,r=new Float32Array(10);r[0]=s.position.x,r[1]=s.position.y,r[2]=s.position.z,r[3]=s.quaternion.x,r[4]=s.quaternion.y,r[5]=s.quaternion.z,r[6]=s.quaternion.w,g.getSize(s,r),S.add(a,{id:a.id,name:a.name,type:$,shape:M,transform:o,friction:.3,restitution:.9}),S.add(s,{id:s.id,name:s.name,type:$,shape:M,transform:r,friction:.3,restitution:.9})},[]),y(O,{children:[n("mesh",{name:"Micheal",castShadow:!0,receiveShadow:!0,geometry:e.Micheal.geometry,material:e.Micheal.material}),n("mesh",{name:"Title",castShadow:!0,receiveShadow:!0,geometry:e.Title.geometry,material:e.Title.material}),n("mesh",{name:"MichealBB",visible:!1,ref:t,geometry:e.BoundingBox1.geometry,position:[-.019,.035,-.248]}),n("mesh",{name:"TitleBB",visible:!1,ref:i,geometry:e.BoundingBox2.geometry,position:[-.019,.035,.258]})]})};h.preload(Be);Se({frustum:1.75,size:.005,near:2.5,samples:30,rings:11});const Ct=()=>y(O,{children:[n("ambientLight",{intensity:.1}),n("directionalLight",{castShadow:!0,position:[3,2,3],intensity:2,"shadow-mapSize-width":2048,"shadow-mapSize-height":2048,"shadow-camera-far":25,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,onUpdate:t=>t.lookAt(0,0,0)}),n("spotLight",{intensity:.5,position:[-5,10,2],angle:.2,penumbra:1,"shadow-mapSize":[2048,2048],onUpdate:t=>t.lookAt(0,0,0)}),n("rectAreaLight",{color:"red",intensity:.3,position:[1.5,-1,3],width:10,height:10,onUpdate:t=>t.lookAt(0,0,0)})]}),Et=()=>y(be,{multisampling:8,children:[n(De,{intensity:.4,height:200,luminanceThreshold:.4,luminanceSmoothing:.9}),n(xe,{opacity:.06}),n(Te,{eskil:!1,offset:0,darkness:1.3}),n(Me,{maxYaw:.05,maxPitch:.05,maxRoll:.05,yawFrequency:.5,pitchFrequency:.5,rollFrequency:.5,intensity:.5,decay:!1,decayRate:.65,additive:!1})]}),St=new URL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAdRJREFUeJzt3dFuwiAAQFFd9v+/7P5AzCiD9Z7zatRWb0hAWh8PAAAAoOK5+g1er9fyt1j9BgNLP8Pnc+1X9LX01TmeAOIEECeAOAHECSBOAHHTk8wL5vm75/G7TX0Hs+sERoA4AcQJIE4AcQKIE0CcAOKGk0jz/O2WrhMYAeIEECeAOAHECSBOAHECiPu+4DVWz/NH8+Dd6wyrj2/0/Kl1AiNAnADiBBAngDgBxAkgTgBxV6wD7Lb8Hgd3ZgSIE0CcAOIEECeAOAHECSDuk3WA3b+3v7X6Pnojf3AfxOEhDB5/+wEZAeIEECeAOAHECSBOAHECiDthP8Ddf88/+roGI0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxJ+wHmNrXPtqXP3vdwN3/L8EIECeAOAHECSBOAHECiBNA3CfrALv3tS9dJ7jA7nm+/wvg9wQQJ4A4AcQJIE4AcQKIO2E/wOw6w9L/1fvg9f81I0CcAOIEECeAOAHECSBOAHFXrAOcPo+ftXs/xNLzNwLECSBOAHECiBNAnADiBBA3Pcc84Pr5t+fwB/cHWHr8wydPnp8RIE4AcQKIE0CcAOIEECcAAAAAAAAAAICb+QHmrjLWPGV0uAAAAABJRU5ErkJggg==",self.location).href,bt=new URL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAedJREFUeJzt3QFuwjAQAEFS9f9fTn9QIzmWDTvzAAJhZemuQX29AAAAgIpr9QXu+15+idUXGFh6D69r7Vf0s/TVOZ4A4gQQJ4A4AcQJIE4AcdND5gNz/u45frep72B2T+AEiBNAnADiBBAngDgBxAkgbjhEmvO3W7oncALECSBOAHECiBNAnADiBBD3+8BrzM75y3+bMHD6nmL0/qbunxMgTgBxAogTQJwA4gQQJ4C4J/YAs3bP4av3ELs/37+cAHECiBNAnADiBBAngDgBxL2zBzh6jn3A6s83u2cYvb+p5wWcAHECiBNAnADiBBAngDgBxJ3wPMC3/y7g6D2KEyBOAHECiBNAnADiBBAngLgT9gC752S/C6BLAHECiBNAnADiBBAngLgT9gC77f5dwNY9gRMgTgBxAogTQJwA4gQQJ4C4d/YAu+fYT/97/dH3xwkQJ4A4AcQJIE4AcQKIE0DcJzwPsHuOPvq5/llOgDgBxAkgTgBxAogTQJwA4p7YA3z6HH36+1v6PIQTIE4AcQKIE0CcAOIEECeAuOkZ876nx+jT5/DVpr6D65r7Cp0AcQKIE0CcAOIEECeAOAHELf+ffQ/sCYaXWH2BgaX3cHbOH3ECxAkgTgBxAogTQJwA4gQAAAAAEPEHPYUq5hjiMdMAAAAASUVORK5CYII=",self.location).href,Dt=new URL("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAaFJREFUeJzt3VFugzAQQMFQ9f5XpjeASMbF8Gb+m0TN00reUvh8AAAAAAAAAIC32e7+ALPt+z78Eld8jgNn38Hh+2/bNvQd/oz8MM8ngDgBxAkgTgBxAogTQNzv6AtccM4+NHjM/cbsc/7o+0/9BZgAcQKIE0CcAOIEECeAOAHEDe8BPuPn6MNz7uw9wwNM3ROYAHECiBNAnADiBBAngDgBxF2xBxg1dY/wAq4HYB4BxAkgTgBxAogTQJwA4q7YAwz9f/sFnn7BwK17DBMgTgBxAogTQJwA4gQQJ4C4Fa4H4MDs+yOYAHECiBNAnADiBBAngDgBxP3HHuDu6wU4YALECSBOAHECiBNAnADiBBA3vAc4+3u1+/ytzQSIE0CcAOIEECeAOAHECSBuhecGul7gRiZAnADiBBAngDgBxAkgTgBxKzw38O2Wfp6BCRAngDgBxAkgTgBxAogTQNwbnhdwt6Fz/uz7AJ4xAeIEECeAOAHECSBOAHECiFvhPoFn7t4jPPqcf8YEiBNAnADiBBAngDgBxAkAAAAAAAAAAOBl/gCK1x3bjG0kpgAAAABJRU5ErkJggg==",self.location).href,xt=()=>y("div",{className:"absolute bottom-5 right-5",children:[n("a",{title:"Github",target:"_tab",href:"https://github.com/michealparks",children:n("img",{className:"mb-2",width:"30",height:"30",alt:"Github",src:St})}),n("a",{title:"Spotify",target:"_tab",href:"https://open.spotify.com/user/micheal_parks",children:n("img",{className:"mb-2",width:"30",height:"30",alt:"Spotify",src:bt})}),n("a",{title:"Twitter",target:"_tab",href:"https://twitter.com/godisacomputer",children:n("img",{className:"mb-2",width:"30",height:"30",alt:"Twitter",src:Dt})})]}),re=new Oe("#020207"),Tt=()=>(Ie(()=>{S.update()}),n(O,{children:y("div",{className:"w-screen h-screen",children:[y(Re,{shadows:!0,mode:"concurrent",performance:{min:.75},dpr:Math.min(1.5,window.devicePixelRatio),gl:{alpha:!1,antialias:!1},onCreated:({gl:e})=>e.setClearColor(re),children:[n("fog",{attach:"fog",args:[re,4,15]}),n(Le,{pixelated:!0}),n(ve,{}),n(Et,{}),y(ze,{snap:!0,global:!0,speed:.8,zoom:1,rotation:[Math.PI/3,-Math.PI/20,0],config:{mass:1,tension:100,friction:26},children:[n(Ct,{}),n(c.exports.Suspense,{fallback:null,children:n(wt,{})}),n(c.exports.Suspense,{fallback:null,children:n(Bt,{})}),n(c.exports.Suspense,{fallback:null,children:n(pt,{})}),n(c.exports.Suspense,{fallback:null,children:n(ft,{})}),n(c.exports.Suspense,{fallback:null,children:n(ht,{})}),n(c.exports.Suspense,{fallback:null,children:n(yt,{})})]})]}),n(xt,{})]})})),Mt=async()=>{await E.init(),E.setGravity(0,0,0),Ne.exports.render(n(c.exports.StrictMode,{children:n(Tt,{})}),document.getElementById("root"))};Mt();
