
import React, { useRef, useState } from 'react';
import './App.css';


//import firebaseInit from './components/firebase.js';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyDopuyxgoF0XZIg8pRylwTs9KwGY94iCDo",
    authDomain: "socialapp-ffcc9.firebaseapp.com",
    projectId: "socialapp-ffcc9",
    storageBucket: "socialapp-ffcc9.appspot.com",
    messagingSenderId: "78689163010",
    appId: "1:78689163010:web:84379dc65da2907695d41b"
    }
)

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <SignOut />
      </header>
      <section>
        {user? <ChatRoom/>: <SignInGoogle />}
      </section>
    </div>
  );
}

function SignInForm(){
  return(
    <form>
    <h2>LogIn</h2>
    <input placeholder='Username'></input>
    <input placeholder='Passord'></input>
    <button>Sign In</button>
    </form>
  )
}

function SignInGoogle(){
  const GoogleSignIn = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <>
    <button className='signIn' onClick={GoogleSignIn}>Google</button>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function SignInFacebook(){
  const FacebookSignIn = ()=>{
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <button onClick={FacebookSignIn}>Facebook</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;