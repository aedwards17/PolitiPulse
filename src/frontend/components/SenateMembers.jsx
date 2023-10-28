import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Card } from "react-bootstrap";

export default function SenateMembers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const senateId = queryParams.get("senateId");

  const [memberInfo, setMemberInfo] = useState({});
  const [recentBills, setRecentBills] = useState([]);
  const [memberBio, setMemberBio] = useState("");
  const [recentStatements, setRecentStatements] = useState([]);

  useEffect(() => {
    // Fetch member info based on senateId
    const fetchMemberInfo = async () => {
      try {
        const q = query(collection(db, "senate"), where("__name__", "==", senateId));
        const querySnapshot = await getDocs(q);
        const memberData = querySnapshot.docs[0].data();
        setMemberInfo(memberData);
      } catch (error) {
        console.error("Error fetching member info:", error);
      }
    };

    // Fetch recent bills, member bio, and recent statements here

    fetchMemberInfo();
    // Fetch other data here if needed
  }, [senateId]);

  return (
    <div>
      <h2>Member Info</h2>
      <Card>
        <Card.Body>
          <h3>{memberInfo.first_name} {memberInfo.last_name}</h3>
          <h4>Senator</h4>
          <hr></hr>
          <p>Congress: {memberInfo.congress}</p>
          <p>District: {memberInfo.district}</p>
          <p>Date of Birth: {memberInfo.dob}</p>
          <p>Facebook: {memberInfo.facebook_account}</p>
          <p>Gender: {memberInfo.gender}</p>
          <p>Next Election: {memberInfo.next_election}</p>
          <p>Party: {memberInfo.party}</p>
          <p>State: {memberInfo.state}</p>
          <p>Twitter: {memberInfo.twitter_account}</p>
          <p>Website: <a href={memberInfo.website} target='_blank'>{memberInfo.website}</a></p>
          <p>YouTube: {memberInfo.youtube_account}</p>
        </Card.Body>
      </Card>

      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Recent Bills Voted On</h2>
          <Card>
            <Card.Body>
              {/* Add code to display recent bills here */}
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <h2>Member Bio</h2>
          <Card>
            <Card.Body>
              {memberBio}
            </Card.Body>
          </Card>
        </div>
      </div>

      <h2>Recent Statements</h2>
      <Card>
        <Card.Body>
          {/* Add code to display recent statements here */}
        </Card.Body>
      </Card>
    </div>
  );
}
