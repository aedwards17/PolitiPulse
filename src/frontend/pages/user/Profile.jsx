import React, { useState, useEffect } from 'react';
import {Button, Form, Col, Row } from "react-bootstrap"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


async function getUserState(userID) {
  const db = getFirestore();

  // Ensure that "users" is the name of the collection and userID is the ID of the document.
  const userDocRef = doc(db, "users", userID);

  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Assuming "state" is the field in the document you want to retrieve.
      return userData.state; 
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}

export default function Profile() {
  
  const [userEmail, setUserEmail] = useState('');
  const [userID, setUserID] = useState('');
  const [userState, setUserState] = useState('');
  const [userVD, setUserVD] = useState('');

  
  useEffect(() => {
    const auth = getAuth();
    
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const email = user.email;
        
        setUserEmail(email);
        setUserID(uid);
        setUserState("State");

      } 
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="userEmail" className="form-label">
            User Email: {userEmail}
          </label>
          <input type="email" className="form-control" id="userEmail" placeholder="Enter New Email" />
        </div>

        <div className="mb-3">
          <label htmlFor="userState" className="form-label">
            State: {userState}
          </label>
          <input type="text" className="form-control" id="userState" placeholder="Enter state" />
        </div>

        <div className="mb-3">
          <label htmlFor="votingDistrict" className="form-label">
            Voting District: {userVD}
          </label>
          <input type="text" className="form-control" id="votingDistrict" placeholder="Enter voting district" />
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}