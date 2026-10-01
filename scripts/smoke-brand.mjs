const base = process.env.SEO_TEST_ORIGIN || 'http://127.0.0.1:3102';
const html=await fetch(base+'/').then(r=>r.text());
if(!html.includes('Hygione Heparre Paro Arro Darriyan')) throw new Error('full name missing homepage');
for(const href of ['/favicon.svg','/favicon-48x48.png','/favicon.ico','/apple-touch-icon.png','/site.webmanifest']) if(!html.includes(`href=\"${href}\"`)) throw new Error('head link missing '+href);
const scripts=[...html.matchAll(/<script[^>]*type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
const nodes=scripts.flatMap(x=>x['@graph']||[x]);
const person=nodes.find(x=>x['@type']==='Person');
if(!person||person.name!=='Hygione Heparre Paro Arro Darriyan') throw new Error('Person identity missing');
if(person.homeLocation?.address?.addressLocality!=='Citayam, Kota Depok') throw new Error('location incorrect');
for(const url of ['https://github.com/gyonmd-tech','https://www.linkedin.com/in/hygione-heparre-paro-arro-darriyan-910724327','https://www.instagram.com/gyon.md/']) if(!person.sameAs.includes(url)) throw new Error('sameAs missing '+url);
for(const path of ['/favicon.svg','/favicon-48x48.png','/favicon.ico','/apple-touch-icon.png','/site.webmanifest','/og-image.png']) { const r=await fetch(base+path); if(r.status!==200) throw new Error(path+' '+r.status); console.log(path,r.status,r.headers.get('content-type')); }
const about=await fetch(base+'/about').then(r=>r.text());
for(const phrase of ['SMK Al Basyariah','SIMANDIRI PENS Program Internasional','ArroBuild','HyBloggyon','Citayam, Kota Depok']) if(!about.includes(phrase)) throw new Error('about missing '+phrase);
console.log('Personal identity SSR checks passed');

