const V='mellisa-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
  if(u.origin!==location.origin&&!font)return;
  const keep=x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x};
  e.respondWith(font
    ?caches.match(r).then(m=>m||fetch(r).then(keep))
    :fetch(r).then(keep).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
