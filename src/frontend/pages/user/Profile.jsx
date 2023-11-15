import React, { useState, useEffect } from 'react';
import {Button, Form, Col, Row } from "react-bootstrap"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from '../../../firebase';


export default function Profile() {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userID, setUserID] = useState('');
  const [userState, setUserState] = useState('');
  const [userVD, setUserVD] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
        fetchUserData(user.uid);
      } else {
        // Handle user not signed in
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserEmail(userData.email);
        setUserState(userData.state);
        setUserVD(userData.district);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    }
  };
  
  
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