import {db,auth,up} from './firebase-config.js';
import {DEF} from './data.js';
import {signInWithEmailAndPassword as si,onAuthStateChanged as oa,signOut} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {doc,getDoc,setDoc,collection,getDocs,addDoc,deleteDoc} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
const $=s=>document.querySelector(s),E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),msg=t=>$('#ms').textContent=t;
const S=[['title','Judul website'],['tagline','Deskripsi beranda','t'],['about','Teks Tentang','t'],['logo','URL logo (kosong = logo bawaan)','i']];
const L={history:[['d','Tanggal'],['t','Judul'],['x','Isi','t']],rules:[['c','Kategori'],['x','Aturan','t']],staff:[['r','Jabatan'],['n','Nama'],['p','Foto profil','i']],gallery:[['p','Foto','i'],['t','Judul'],['x','Keterangan','t']]};
const N={umum:'Umum',history:'Sejarah',rules:'Peraturan',staff:'Kepengurusan',gallery:'Galeri',anggota:'Anggota'};
let C={...DEF},cur='umum',RQ={};
const fld=(k,l,t,v)=>`<label>${l}${t=='t'?`<textarea data-k="${k}" rows="3">${E(v)}</textarea>`:`<input data-k="${k}" value="${E(v)}">`}${t=='i'?'<input type="file" accept="image/*" class="up">':''}</label>`;
const grab=()=>{if(!$('#sv'))return;if(cur=='umum')S.forEach(([k])=>C[k]=$(`[data-k=${k}]`).value);else C[cur]=[...document.querySelectorAll('.it')].map(e=>Object.fromEntries([...e.querySelectorAll('[data-k]')].map(i=>[i.dataset.k,i.value])))};
const tab=k=>{cur=k;msg('');document.querySelectorAll('.tabs [data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t==k));
 if(k=='anggota')return mem();
 $('#bd').innerHTML=(k=='umum'?S.map(([a,l,t])=>fld(a,l,t,C[a]||'')).join(''):(C[k]||[]).map((o,i)=>`<div class="c it">${L[k].map(([a,l,t])=>fld(a,l,t,o[a]||'')).join('')}<br><button class="b o" data-x="${i}">Hapus</button></div>`).join('')+'<button class="b o" id="ad">Tambah</button> ')+' <button class="b" id="sv">Simpan perubahan</button>'};
async function mem(){try{const[q,m]=await Promise.all([getDocs(collection(db,'memberRequests')),getDocs(collection(db,'members'))]);RQ={};
 $('#bd').innerHTML='<h3>Kode undangan</h3><input id="cd" placeholder="Kode baru"><button class="b" id="ic">Simpan kode</button><h3>Menunggu persetujuan</h3>'+
 (q.empty?'<p>Tidak ada pengajuan.</p>':q.docs.map(d=>{const x=RQ[d.id]=d.data();return `<div class="c">${x.p?`<img class="av" src="${E(x.p)}" alt="">`:''}<h3>${E(x.n)}</h3><small>${E(x.b)}</small><div class="btns"><button class="b" data-a="ok" data-id="${d.id}">Setujui</button><button class="b o" data-a="no" data-id="${d.id}">Tolak</button></div></div>`}).join(''))+
 '<h3>Anggota yang tampil</h3>'+(m.empty?'<p>Belum ada.</p>':m.docs.map(d=>`<div class="c"><b>${E(d.data().n)}</b> <button class="b o" data-a="rm" data-id="${d.id}">Hapus</button></div>`).join(''))}catch(x){$('#bd').innerHTML='<p>Gagal memuat data anggota. Pastikan login sebagai owner.</p>'}}
document.onclick=async e=>{const t=e.target,d=t.dataset;try{
 if(d.t){grab();tab(d.t)}
 else if(t.id=='ad'){grab();C[cur].push({});tab(cur)}
 else if(d.x!==undefined){grab();C[cur].splice(+d.x,1);tab(cur)}
 else if(t.id=='sv'){grab();msg('Menyimpan...');await setDoc(doc(db,'site','content'),C);msg('Tersimpan.')}
 else if(d.a=='ok'){const r=RQ[d.id];await addDoc(collection(db,'members'),{n:r.n,b:r.b,p:r.p});await deleteDoc(doc(db,'memberRequests',d.id));mem()}
 else if(d.a=='no'){await deleteDoc(doc(db,'memberRequests',d.id));mem()}
 else if(d.a=='rm'){await deleteDoc(doc(db,'members',d.id));mem()}
 else if(t.id=='ic'){await setDoc(doc(db,'private','invite'),{code:$('#cd').value.trim()});msg('Kode undangan tersimpan.')}
 else if(t.id=='lo')signOut(auth)
}catch(x){msg('Gagal. Pastikan login sebagai owner dan Security Rules sudah dipasang.')}};
document.onchange=async e=>{const t=e.target;if(!t.classList.contains('up')||!t.files[0])return;msg('Mengunggah...');try{t.previousElementSibling.value=await up(t.files[0]);msg('Foto terunggah. Tekan Simpan perubahan.')}catch(x){msg(x.message)}};
oa(auth,async u=>{$('#lg').classList.toggle('on',!u);$('#ds').classList.toggle('on',!!u);if(!u)return;
 try{const s=await getDoc(doc(db,'site','content'));if(s.exists())C={...DEF,...s.data()}}catch(e){}
 $('.tabs').innerHTML=Object.entries(N).map(([k,v])=>`<button class="b o" data-t="${k}">${v}</button>`).join('')+'<button class="b o" id="lo">Keluar</button>';tab('umum')});
$('#lf').onsubmit=async e=>{e.preventDefault();try{await si(auth,$('#em').value,$('#pw').value)}catch(x){$('#le').textContent='Login gagal. Periksa email dan password.'}};
