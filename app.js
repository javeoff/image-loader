import firebase from 'firebase/app'
import 'firebase/storage'
import { upload } from './upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyBMb8mg35qwIqe8RyPAcodEH7EvCsttUX0",
    authDomain: "myprojwxr1.firebaseapp.com",
    databaseURL: "https://myprojwxr1.firebaseio.com",
    projectId: "myprojwxr1",
    storageBucket: "myprojwxr1.appspot.com",
    messagingSenderId: "682012820008",
    appId: "1:682012820008:web:011295ae27747c073aeb1d",
    measurementId: "G-6H1YFJKHEC"
  }

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.prev-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error);
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download url', url);
                })
            })
        })
    }
})

console.log('app.js')