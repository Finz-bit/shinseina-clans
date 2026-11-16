import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
export const CFG={apiKey:'AIzaSyAPv-2wBgN_unmMLvJbxYWCXjoD64UCoYw',authDomain:'shinseina-clans.firebaseapp.com',projectId:'shinseina-clans',appId:'1:532982627462:web:028097d6c755b56582e507'};
export const CLOUD={name:'cpifpljs',preset:'shinseina_unsigned'};
const app=initializeApp(CFG);
export const db=getFirestore(app),auth=getAuth(app);
export async function up(file){
 if(!file.type.startsWith('image/'))throw Error('File harus berupa gambar.');
 if(file.size>5e6)throw Error('Ukuran gambar maksimal 5 MB.');
 const f=new FormData();f.append('file',file);f.append('upload_preset',CLOUD.preset);
 const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.name}/image/upload`,{method:'POST',body:f});
 if(!r.ok)throw Error('Upload gagal.');
 return (await r.json()).secure_url}
