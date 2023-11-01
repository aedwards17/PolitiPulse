import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { Card } from "react-bootstrap";

export default function HouseMembers() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const houseMemberId = queryParams.get("houseMemberId");

  const [memberInfo, setMemberInfo] = useState({});
  const [recentBills, setRecentBills] = useState([]);
  const [memberBio, setMemberBio] = useState("");
  const [recentStatements, setRecentStatements] = useState([]);

  useEffect(() => {
    // Fetch member info based on houseMemberId
    const fetchMemberInfo = async () => {
      try {
        const q = query(collection(db, "house"), where("__name__", "==", houseMemberId));
        const querySnapshot = await getDocs(q);
        const memberData = querySnapshot.docs[0].data();
        setMemberInfo(memberData);
      } catch (error) {
        console.error("Error fetching member info:", error);
      }
    };

    const fetchMemberVotes = async () => {
      let allRecentBills = []; // Temporary array to accumulate positions

      const votesSnapshot = await getDocs(query(collection(db, 'votes'), limit(10)));

      const promises = votesSnapshot.docs.map(async (voteDoc) => {
        const q = query(
          collection(db, `votes/${voteDoc.id}/positions`),
          where('__name__', '==', houseMemberId),
        );

        const positionsSnapshot = await getDocs(q);

        if (!positionsSnapshot.empty) {
          const voteDocRef = doc(db, 'votes', voteDoc.id);
          const voteDocData = await getDoc(voteDocRef);

          if (voteDocData.exists()) {
            let bill_id = voteDocData.data().bill_id;

            positionsSnapshot.forEach((positionDoc) => {
              const position = {
                "bill": bill_id,
                "roll_call": voteDoc.id,
                "position": positionDoc.data().vote_position
              };
              allRecentBills.push(position); // Pushing each position to the temporary array
            });
          }
        }
      });

      await Promise.all(promises); // Wait for all promises to resolve

      setRecentBills(allRecentBills); // Setting the state once with all positions
    }

    fetchMemberInfo();
    fetchMemberVotes();
  }, [houseMemberId]);

  return (
    <div>
      <div className="row mt-4">
        {/* Member Info Card */}
        <div className="col-md-6">
          <h2>Member Info</h2>
          <Card>
            <Card.Body>
              <div style={{ position: 'relative' }}>
                {/* Displaying the image at the top right corner */}
                {memberInfo.imageUrl && (
                  <img
                    src={memberInfo.imageUrl}
                    alt={`${memberInfo.first_name} ${memberInfo.last_name}`}
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 0,
                      maxWidth: '100px', // or any size you want
                    }}
                  />
                )}
              </div>
              <hr></hr>
              <h3>{memberInfo.first_name} {memberInfo.last_name}</h3>
              <h4><strong>Representative</strong></h4>
              <br></br>
              <hr></hr>
              <p><strong>Congress: </strong>{memberInfo.congress}</p>
              <p><strong>District: </strong>{memberInfo.district}</p>
              <p><strong>D</strong>Date of Birth: {memberInfo.dob}</p>
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
        </div>

        {/* Recent Bills Voted On Card */}
        <div className="col-md-6">
          <h2>Recent Bills Voted On</h2>
          <Card>
            <Card.Body>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {recentBills.length > 0 ? (
                  recentBills.map((bill, index) => (
                    <div key={index}>
                      <p><strong>Bill ID:</strong> {bill.bill}</p>
                      <p><strong>Rollcall Number:</strong> {bill.roll_call}</p>
                      <p><strong>Vote Position:</strong> {bill.position}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No recent bills available.</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Member Bio Card */}
        <div className="col-md-6">
          <h2>Member Bio</h2>
          <Card>
            <Card.Body>
              {/* You can insert the code to display the member bio here */}
              {memberBio}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Recent Statements Card */}
      <h2>Recent Statements</h2>
      <Card>
        <Card.Body>
          {/* Add code to display recent statements here */}
        </Card.Body>
      </Card>
    </div>
  );
}