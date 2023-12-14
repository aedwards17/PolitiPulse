import React, { useRef, useState, useEffect } from 'react';
import {Button, Card, Form} from "react-bootstrap"
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

async function updateFireStore(userID, state, vd) {
  try {
    await updateDoc(doc(db, "users", userID), {
      state: state,
      district: vd,
    });
    console.log("Document successfully updated!");
  } catch (error) {
    if (error.code === 'auth/requires-recent-login') {
      console.log("Please re-authenticate to update your email.");
    } else {
      console.error("Error updating email:", error);
    }
  }  
}

export default function Profile() {
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userID, setUserID] = useState('');
  const [userState, setUserState] = useState('');
  const [userVD, setUserVD] = useState('');
  const emailRef = useRef(null);
  const stateRef = useRef(null);
  const vdRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserID(user.uid);
        fetchUserData(user.uid);
      } 
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = async (userID) => {
    try {
      const userDocRef = doc(db, "users", userID);
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
  
 async function onSubmit(e) {
    e.preventDefault(); 

   updateFireStore(auth.currentUser.uid, stateRef.current.value, vdRef.current.value);
   navigate("/");
  }
  
  return (
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Profile</h2>
        <Form onSubmit = {onSubmit}>
            <Form.Group id="email">
              <Form.Label>Current Email: {userEmail} </Form.Label>
            </Form.Group>
  
          <Form.Group id="state">
            <Form.Label htmlFor="state">Current State: {userState} </Form.Label>
            <Form.Control as="select" ref={stateRef} required>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </Form.Control>
          </Form.Group>
  
          <Form.Group id="votingDistrict">
            <Form.Label>Current Voting District: {userVD} </Form.Label>
            <Form.Control type="number" ref={vdRef} required />
          </Form.Group>
  
          <Button className="w-100" type="submit">
            Update
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}