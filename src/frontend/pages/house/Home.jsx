import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../contexts/contexts';
import { db } from "../../../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"; // Ensure to import doc and getDoc

export default function Home() {
  const [congressMembers, setCongressMembers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchCongressMembers() {
      try {
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.userVD || userData.userState) {
            const members = [];
            const senateQuery = query(collection(db, 'senate'), where('state', '==', userData.userState));
            const houseQuery = query(collection(db, 'house'), where('district', '==', userData.userVD), where('state', '==', userData.userState));

            // Fetch senate members
            const senateSnapshot = await getDocs(senateQuery);
            senateSnapshot.forEach((docSnap) => members.push(docSnap.data()));

            // Fetch house members
            const houseSnapshot = await getDocs(houseQuery);
            houseSnapshot.forEach((docSnap) => members.push(docSnap.data()));

            setCongressMembers(members);
          } else {
            console.error('User data does not contain valid userVD or userState');
          }
        }
      } else {
        console.log("User is not logged in");
      }
    } catch (error) {
      console.error("An error occurred while fetching congress members:", error);
    }
  }

    fetchCongressMembers();
}, [currentUser]);

return (
  <div className="container mt-4">
    <h1 className="text-center mb-4">Home</h1>
    <div className="row">
      {/* Top Left Card */}
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Your Congress Members</h5>
            <ul className="card-text">
              {congressMembers.map(member => (
                <li key={member.id}>{member.title} {member.first_name} {member.last_name} ({member.party})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Right Card */}
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Recent Bills</h5>
            <p className="card-text">Information on recent bills can be found here.</p>
          </div>
        </div>
      </div>

      {/* Bottom Left Card */}
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Recent userStatements</h5>
            <p className="card-text">Recent userStatements from your representatives will be shown here.</p>
          </div>
        </div>
      </div>

      {/* Bottom Right Card */}
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Political News</h5>
            <p className="card-text">The latest political news related to you will be updated here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
