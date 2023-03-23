import { useState } from 'react';
import { auth, storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import Loader from './Loader';


// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
   // const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    const uploadRef = ref(storage,`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
   
    setUploading(true);

    // Starts the upload
    //const task = ref.put(file);
    const uploadTask = uploadBytesResumable(uploadRef, file);
    // Listen to updates to upload task

    // Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(pct);
    }, 
    (error) => {
      // Handle unsuccessful uploads
      setUploading(false);
    }, 
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setDownloadURL(downloadURL);
        setUploading(false);
      });
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    // task
    //   .then((d) => ref.getDownloadURL())
    //   .then((url) => {
    //     setDownloadURL(url);
    //     setUploading(false);
    //   });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
          </label>
        </>
      )}

      {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
    </div>
  );
}