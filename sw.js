const V="egetek-v21",F=["./","./index.html","./icon.svg","./manifest.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=="egetek-rem").map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});

async function remCheck(){const c=await caches.open("egetek-rem"),r=await c.match("rem.json");if(!r)return;const d=await r.json();if(!d.on)return;
  const sr=await c.match("shown.json");let sh=sr?await sr.json():{};const now=Date.now();
  for(const x of d.list){if(x.at<=now&&now-x.at<864e5&&!sh[x.k]){sh[x.k]=1;await self.registration.showNotification("EGETEK Hatırlatma",{body:x.t,icon:"icon.svg",badge:"icon.svg",tag:x.k})}}
  Object.keys(sh).forEach(k=>{if(!d.list.some(x=>x.k===k))delete sh[k]});
  await c.put("shown.json",new Response(JSON.stringify(sh)))}
self.addEventListener("periodicsync",e=>{if(e.tag==="egetek-rem")e.waitUntil(remCheck().catch(()=>{}))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(L=>{for(const c of L){if("focus" in c)return c.focus()}return self.clients.openWindow("./index.html")}))});
