import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
// Isi dengan konfigurasi web app dari Firebase Console
export const CFG={apiKey:'ISI_API_KEY',authDomain:'ISI.firebaseapp.com',projectId:'ISI_PROJECT_ID',appId:'ISI_APP_ID'};
// Isi dengan data Cloudinary (preset harus bertipe Unsigned)
export const CLOUD={name:'ISI_CLOUD_NAME',preset:'ISI_UPLOAD_PRESET'};
const app=initializeApp(CFG);
export const db=getFirestore(app),auth=getAuth(app);
export async function up(file){
 if(!file.type.startsWith('image/'))throw Error('File harus berupa gambar.');
 if(file.size>5e6)throw Error('Ukuran gambar maksimal 5 MB.');
 const f=new FormData();f.append('file',file);f.append('upload_preset',CLOUD.preset);
 const r=await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.name}/image/upload`,{method:'POST',body:f});
 if(!r.ok)throw Error('Upload gagal.');
 return (await r.json()).secure_url}
