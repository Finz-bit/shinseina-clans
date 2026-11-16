import {db,up} from './firebase-config.js';
import {DEF} from './data.js';
import {doc,getDoc,collection,getDocs,addDoc} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const $=s=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),H=(s,h)=>$(s).innerHTML=h;
const go=()=>{let h=location.hash.slice(1);const e=document.getElementById(h);if(!e||!e.classList.contains('pg'))h='beranda';document.querySelectorAll('.pg').forEach(p=>p.classList.toggle('on',p.id==h));$('#m').classList.remove('open');scrollTo(0,0)};
addEventListener('hashchange',go);$('#hb').onclick=()=>$('#m').classList.toggle('open');go();
let C={...DEF};
try{const s=await getDoc(doc(db,'site','content'));if(s.exists())C={...DEF,...s.data()}}catch(e){}
document.title=C.title;
const lg=C.logo||'logo.png';document.querySelectorAll('.lg').forEach(i=>i.src=lg);
H('#tg',E(C.tagline));H('#ab',E(C.about));
H('#ct',[['discord','Discord'],['wa','Grup WhatsApp']].filter(([k])=>/^https:\/\//.test(C[k]||'')).map(([k,l])=>`<a class="b" href="${E(C[k])}" target="_blank" rel="noopener">${l}</a>`).join(''));
H('#hs',`<div class="tl">${C.history.map(h=>`<div class="c"><small>${E(h.d)}</small><h3>${E(h.t)}</h3><p>${E(h.x)}</p></div>`).join('')}</div>`);
const R={};C.rules.forEach(r=>(R[r.c||'Lainnya']??=[]).push(r.x));
H('#rl',Object.entries(R).map(([c,a])=>`<h3>${E(c)}</h3><div class="g">${a.map(x=>`<div class="c">${E(x)}</div>`).join('')}</div>`).join(''));
H('#st',`<div class="g">${C.staff.map(s=>`<div class="c ctr"><img class="av" src="${E(s.p||lg)}" alt=""><br><small>${E(s.r)}</small><h3>${s.n?E(s.n):'<i>Belum terisi</i>'}</h3></div>`).join('')}</div>`);
H('#gl',C.gallery.length?`<div class="g">${C.gallery.map(x=>`<div class="c"><img class="gi" src="${E(x.p)}" alt="${E(x.t)}"><h3>${E(x.t)}</h3><small>${E(x.x)}</small></div>`).join('')}</div>`:'<p>Belum ada foto.</p>');
try{const m=await getDocs(collection(db,'members'));H('#mb',m.empty?'<p>Belum ada anggota.</p>':`<div class="g">${m.docs.map(d=>{const x=d.data();return `<div class="c ctr"><img class="av" src="${E(x.p||lg)}" alt=""><h3>${E(x.n)}</h3><small>${E(x.b)}</small></div>`}).join('')}</div>`)}catch(e){H('#mb','<p>Belum ada anggota.</p>')}
$('#f').onsubmit=async e=>{e.preventDefault();const f=e.target,m=$('#fm'),b=f.querySelector('button');b.disabled=true;m.textContent='Mengirim...';
try{const file=f.p.files[0],p=file?await up(file):'';await addDoc(collection(db,'memberRequests'),{n:f.n.value.trim(),b:f.b.value.trim(),p,code:f.code.value.trim()});f.reset();m.textContent='Terkirim. Profilmu tampil setelah disetujui owner.'}
catch(x){m.textContent='Gagal mengirim. Periksa kode undangan, foto, dan koneksi.'}b.disabled=false};
