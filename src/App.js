import React from 'react';
import './App.css';
import logo from './cards.png';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button, IconButton } from '@mui/material';
import { Logout, Google } from '@mui/icons-material';
import ScoreSheet from './ScoreSheet'
// import { useCollectionData } from 'react-firebase-hooks/firestore';



const db = initializeApp({
  apiKey: "AIzaSyDgOndJ0SI4x3OvkGfxSte_GrWcnBdLud4",
  authDomain: "elef-1000.firebaseapp.com",
  projectId: "elef-1000",
  storageBucket: "elef-1000.appspot.com",
  messagingSenderId: "755190142959",
  appId: "1:755190142959:web:37bfd8e67e43f65053c81a"
});

const firestore = getFirestore(db);
const auth = getAuth();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>&#34;1000&#34; Score sheet</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ScoreSheet userId="user-Id" firestore={firestore} /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/cloud-platform');
    signInWithPopup(auth, provider);
  }

  return (
    <Button variant='contained' startIcon={<Google />} onClick={signInWithGoogle}
      className="sign-in" >
      Sign in with Google
    </Button>
  )

}

function SignOut() {
  return auth.currentUser && (
    <IconButton onClick={() => auth.signOut()} style={{color: "snow"}}> <Logout /> </IconButton>
  )
}




export default App;
