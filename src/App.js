import React, { useRef, useState } from 'react';
import './App.css';

import googleLogo from './google-icon.png'
import facebookLogo from './facebook-icon.png'
import microsoftLogo from './microsoft-icon.png'

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
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {
  const[user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        {user? <Home/>: <SignOut/>,<Profile/>,<TimeLine/>}
      </header>
      <section>
        {user? <ChatRoom/>: <GoogleSignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  return(
      <form>
        <h2>Welcome</h2>
        <input placeholder='Username'></input>
        <input placeholder='Password' type="password"></input>
        <button id="LogInBtn">Log In</button>
        <div className='social'>
          <GoogleSignIn/>
          <FacebookSignIn/>
          <MicrosoftSignIn/>
        </div>
        
        <a>Don't Have an Account?</a>
      </form>
  )
}

function Home(){
  return(
    <button>Home</button>
  )
}

function TimeLine(){
  return(
    <button>Timeline</button>
  )
}

function Profile(){
  return(
    <button>Profile</button>
  )
}


function CreateAccount(){
  return(
    <form>
      <h2>Create Account</h2>
      <input placeholder='Username'></input>
      <input placeholder='Password' type="password"></input>
      <button id="LogInBtn">Log In</button>
      
      <a onClick={CreateAccount}>Don't Have an Account?</a>
    </form>
  )
}

function GoogleSignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <button id="Google" onClick={signInWithGoogle}><img src={googleLogo} /></button>
  )
}


function FacebookSignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <button onClick={signInWithGoogle}><img src={facebookLogo} /></button>
  )
}

function MicrosoftSignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
      <button id="Microsoft"onClick={signInWithGoogle}><img src={microsoftLogo} /></button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
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

    const { uid, photoURL} = auth.currentUser;

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

    <form id="messager" onSubmit={sendMessage}>
      <input id="messagerInput" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Message" />
      <button id="messagerBtn" type="submit" disabled={!formValue}> => </button>
    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img alt="{uid}"src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}

export default App;