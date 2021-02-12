!function(){importScripts("ammo.js");const e=new Set,t=new Map,i=new Map,o=new Map,n=new Map,s=new Map,a=new Map,r=new Map;let d,l,c,g,u,y,p,f,m,b,w,v=0,h=0,R=0,M=0,V=0;const B=(e,t)=>{const{id:n}=e;let s=!1;!1===i.has(n)&&i.set(n,{body:e,others:new Map});const a=i.get(n);return!1===a.others.has(t.id)&&(a.others.set(t.id,t),s=!0),!1===o.has(n)&&o.set(n,{body:e,others:new Map}),o.get(n).others.set(t.id,t),s},S=(e,t,i)=>{!1===e.has(t)&&e.set(t,[]),e.get(t).push(i)},C=(e,t,i,o)=>{switch(t){case 0:return c.setValue(i[7],i[8],i[9]),new d.btBoxShape(c);case 2:if(void 0===o)throw Error(e+": vertices is undefined");{const e=new d.btTriangleMesh,t=!0;for(let t=0,i=o.length;t<i;t+=9)c.setValue(o[t+0],o[t+1],o[t+2]),g.setValue(o[t+3],o[t+4],o[t+5]),u.setValue(o[t+6],o[t+7],o[t+8]),e.addTriangle(c,g,u,!0);return new d.btBvhTriangleMeshShape(e,t)}case 1:return new d.btSphereShape(i[7]);default:throw Error("Shape not specified.")}},F=(e,i,o)=>{const{transform:n}=e;let s;const a=C(e.name,e.shape,n,e.triangles);a.setMargin(0),!0===i&&(s=new d.btVector3(0,0,0),a.calculateLocalInertia(e.mass,s)),c.setValue(n[0],n[1],n[2]),y.setValue(n[3],n[4],n[5],n[6]),l.setOrigin(c),l.setRotation(y);const r=new d.btDefaultMotionState(l),g=new d.btRigidBodyConstructionInfo(e.mass,r,a,s),u=new d.btRigidBody(g);return u.type=e.type,u.trigger=!1,u.id=e.id,u.name=e.name,u.linkedRigidbodyId=e.linkedRigidbodyId,u.setRestitution(e.restitution??0),u.setFriction(e.friction??0),u.setDamping(e.linearDamping??0,e.angularDamping??0),void 0!==o&&u.setCollisionFlags(u.getCollisionFlags()|o),d.destroy(g),!0===i&&d.destroy(s),t.set(u.id,u),u},I=e=>{const{transform:i}=e,o=C(e.name,e.shape,e.transform,void 0);o.setMargin(0),c.setValue(i[0],i[1],i[2]),y.setValue(i[3],i[4],i[5],i[6]),l.setOrigin(c),l.setRotation(y);const n=new d.btDefaultMotionState(l),s=new d.btRigidBodyConstructionInfo(1,n,o),a=new d.btRigidBody(s);return a.type=0,a.trigger=!0,a.id=e.id,a.name=e.name,a.enter=e.enter,a.leave=e.leave,a.entity=e.entity,a.linkedRigidbodyId=e.linkedRigidbodyId,a.setRestitution(0),a.setFriction(0),a.setDamping(0,0),c.setValue(0,0,0),a.setLinearFactor(c),a.setAngularFactor(c),a.setCollisionFlags(4|a.getCollisionFlags()),d.destroy(s),t.set(a.id,a),a},D=(e,i,o,n=0)=>{m=t.get(e),m.activate(),!0===o&&(c.setValue(0,0,0),m.setLinearVelocity(c),c.setValue(0,0,0),m.setAngularVelocity(c)),c.setValue(i[n+0],i[n+1],i[n+2]),y.setValue(i[n+3],i[n+4],i[n+5],i[n+6]),l.setOrigin(c),l.setRotation(y),m.setWorldTransform(l),2===m.type&&m.getMotionState()?.setWorldTransform(l),m.activate()},k=i=>{const o=t.get(i),n=o.linkedRigidbodyId;if(void 0!==n){const i=t.get(n);t.delete(n),e.delete(i),p.removeRigidBody(i),d.destroy(i)}t.delete(i),e.delete(o),p.removeRigidBody(o);const s=o.getMotionState();void 0!==s&&d.destroy(s),d.destroy(o)};onmessage=({data:g})=>{switch(g.op){case"update":return(c=>{for(m of(v=performance.now(),R=(v-h)/1e3,h=v,p.stepSimulation(R,40,.016666666666666666),M=0,e))!0===m.isActive()&&(f=m.getMotionState(),f.getWorldTransform(l),b=l.getOrigin(),w=l.getRotation(),V=7*M,c[V+0]=b.x(),c[V+1]=b.y(),c[V+2]=b.z(),c[V+3]=w.x(),c[V+4]=w.y(),c[V+5]=w.z(),c[V+6]=w.w(),void 0!==m.linkedRigidbodyId&&t.get(m.linkedRigidbodyId)?.setMotionState(f)),M+=1;const g=[];(e=>{a.clear(),n.clear(),o.clear();const t=p.getDispatcher(),i=t.getNumManifolds();for(M=0;M<i;M++){const i=t.getManifoldByIndexInternal(M);if(0===i.getNumContacts())continue;const o=d.castObject(i.getBody0(),d.btRigidBody),s=d.castObject(i.getBody1(),d.btRigidBody);let r=!1;const l=4==(4&o.getCollisionFlags()),c=4==(4&s.getCollisionFlags());l||c?(r=B(o,s),r&&!1===c&&(S(a,o.id,s.id),!o.enter||s.name!==o.entity&&"any"!==o.entity||e.push([o.enter,o.id,s.id])),r=B(s,o),r&&!1===l&&(S(a,s.id,o.id),!s.enter||o.name!==s.entity&&"any"!==s.entity||e.push([s.enter,s.id,o.id]))):(r=B(o,s),r&&S(n,o.id,s.id),r=B(s,o),r&&S(n,s.id,o.id))}})(g),(e=>{r.clear(),s.clear();for(const[t,n]of i){const a=o.get(t),{body:d,others:l}=n;for(const[t,i]of l)void 0!==a&&!1!==a.others.has(t)||(l.delete(t),!0===d.trigger?(S(r,d.id,i.id),!d.leave||i.name!==d.entity&&"any"!==d.entity||e.push([d.leave,d.id,i.id])):!1===i.trigger&&S(s,d.id,i.id));0===l.size&&i.delete(t)}})(g),postMessage({op:"update",transforms:c,globalEvents:g,triggerEnter:[...a],collisionStart:[...n],triggerLeave:[...r],collisionEnd:[...s]},[c.buffer])})(g.transforms);case"applyCentralImpulse":return u=g.id,y=g.impulse,m=t.get(u),c.setValue(y.x,y.y,y.z),m.applyCentralImpulse(c),void m.activate();case"applyCentralForce":return((e,i)=>{m=t.get(e),c.setValue(i.x,i.y,i.z),m.applyCentralForce(c),m.activate()})(g.id,g.force);case"teleport":return D(g.id,g.transform,g.clearForces);case"teleportMany":return((e,t,i)=>{M=0;for(const o of e)D(o,t,i,M),M+=7})(g.ids,g.transforms,g.clearForces);case"setGravity":return((e,i)=>{m=t.get(e),c.setValue(i.x,i.y,i.z),m.setGravity(c),m.activate()})(g.id,g.acceleration);case"setFriction":return((e,i)=>{m=t.get(e),m.setFriction(i),m.activate()})(g.id,g.friction);case"createRigidbodies":return(t=>{let i,o,n;for(const s of t)switch(s.type){case 0:n=!1,i=1,o=F(s,n,i),p.addRigidBody(o,2,65533);break;case 1:n=0!==s.mass,i=void 0,o=F(s,n,i),e.add(o),p.addRigidBody(o,1,65535);break;case 2:n=!1,i=2,o=F(s,n,i),o.setActivationState(4),p.addRigidBody(o)}})(g.objects);case"createTriggerVolumes":return(e=>{for(const t of e){const e=I(t);p.addRigidBody(e,2,65533)}})(g.objects);case"removeRigidbodies":return(t=>{for(const e of t)k(e);for(m of e)m.activate();postMessage({op:"unpause"})})(g.ids);case"removeTriggerVolumes":return void g.ids}var u,y},(async()=>{d=await self.Ammo(),l=new d.btTransform,c=new d.btVector3,g=new d.btVector3,u=new d.btVector3,y=new d.btQuaternion;const e=new d.btDefaultCollisionConfiguration,t=new d.btCollisionDispatcher(e),i=new d.btDbvtBroadphase,o=new d.btSequentialImpulseConstraintSolver;p=new d.btDiscreteDynamicsWorld(t,i,o,e),p.setGravity(new d.btVector3(0,-9.8,0)),postMessage({op:"init"})})()}();
