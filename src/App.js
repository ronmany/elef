import React from 'react';
import './App.css';
import logo from './cards.png';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from '@mui/material';
import { Google } from '@mui/icons-material';
import ScoreSheet from './ScoreSheet'
import Menu from './Menu';
import { GameProvider } from './GameProvider'

// import { useCollectionData } from 'react-firebase-hooks/firestore';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const auth = getAuth();

function App() {

  const [user] = useAuthState(auth);
  console.log(auth, user)
  return (
    <ThemeProvider theme={darkTheme}>
      <GameProvider>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1>&#34;1000&#34; Scoresheet</h1>
            </header>
            <section>
              {user ? <>
                <ScoreSheet user={user} />
                <Menu auth={auth} signout={SignOut} />
                </>
                  : <SignIn />}
            </section>
          </div>
      </GameProvider>
    </ThemeProvider>
  );
}

function SignOut() {
  auth.signOut()
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




export default App;
