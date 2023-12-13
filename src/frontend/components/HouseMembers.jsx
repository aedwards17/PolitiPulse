import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, collectionGroup, query, where, getDocs, doc, getDoc, limit } from "firebase/firestore";
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
  const [isLoading, setIsLoading] = useState(true);

  var billId = "";

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
      setIsLoading(true);
      let allRecentBills = []; // Temporary array to accumulate votes

      // Fetch positions where the member's ID is present
      const positionsSnapshot = await getDocs(query(collectionGroup(db, 'positions'), where('member_id', '==', houseMemberId), limit(10)));

      for (const positionDoc of positionsSnapshot.docs) {
        const positionData = positionDoc.data();
        const voteRef = positionDoc.ref.parent.parent; // Getting a reference to the parent 'votes' document

        if (voteRef) {
          const voteSnapshot = await getDoc(voteRef);
          if (voteSnapshot.exists()) {
            const voteData = voteSnapshot.data();

            let bill_title = "";
            if (voteData.bill_id) {
              const billDocRef = doc(db, 'bills', voteData.bill_id);
              const billDocData = await getDoc(billDocRef);
              if (billDocData.exists()) {
                bill_title = billDocData.data().bill_title;
              }
            }

            const billData = {
              "bill": voteData.bill_id,
              "bill_title": bill_title,
              "roll_call": voteData.roll_call,
              "question": voteData.question,
              "position": positionData.vote_position
            };

            allRecentBills.push(billData);
          }
        }
      }

      setRecentBills(allRecentBills); // Update the state with the accumulated data
      setIsLoading(false);
    };




    fetchMemberInfo();
    fetchMemberVotes();
  }, [houseMemberId]);

  return (
    <div>
      <div className="row mt-4">
        {/* Member Info Card */}
        <div className="col-md-6">
          <h2 class="text-center">Member Info</h2>
          <Card className="bg-light">
            <Card.Header className="border">
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
                      maxWidth: '100px',
                      maxHeight: '125px'
                    }}
                  />
                )}
              </div>
              <hr></hr>
              <h3>{memberInfo.first_name} {memberInfo.last_name}</h3>
              <h4><strong>Representative</strong></h4>
              <br></br>
              <hr></hr>
            </Card.Header>
            <Card.Body className="bg-white border">
              <p><strong>Congress: </strong>{memberInfo.congress}</p>
              <p><strong>District: </strong>{memberInfo.district}</p>
              <p><strong>Date of Birth: </strong>{memberInfo.dob}</p>
              <p><strong>Facebook: </strong>{memberInfo.facebook_account}</p>
              <p><strong>Gender: </strong>{memberInfo.gender}</p>
              <p><strong>Next Election: </strong>{memberInfo.next_election}</p>
              <p><strong>Party: </strong>{memberInfo.party}</p>
              <p><strong>State: </strong>{memberInfo.state}</p>
              <p><strong>Twitter: </strong>{memberInfo.twitter_account}</p>
              <p><strong>Website: </strong><a href={memberInfo.website} target='_blank'>{memberInfo.website}</a></p>
              <p><strong>YouTube: </strong>{memberInfo.youtube_account}</p>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Bills Voted On Card */}
        <div className="col-md-6">
          <h2 className="text-center">Recent Bills Voted On</h2>
          <Card className="bg-white hover-overlay text-center">
            <Card.Body className="border">
              <div style={{ maxHeight: '607px', overflowY: 'auto' }}>
                {isLoading ? (
                  <p>Loading... Please wait</p>
                ) : recentBills.length > 0 ? (
                  recentBills.filter(bill => bill.bill_title !== null).map((bill, index) => ( // Filter out bills with null title
                    <a
                      key={index}
                      href={`/BillPages?billId=${bill.bill}`}
                      className="list-group-item list-group-item-action text-decoration-none"
                    >
                      <p><strong>Bill Title:</strong> {bill.bill_title}</p>
                      <p><strong>Bill ID:</strong> {bill.bill}</p>
                      <p><strong>Rollcall Number:</strong> {bill.roll_call}</p>
                      <p><strong>Question:</strong> {bill.question}</p>
                      <p><strong>Vote Position:</strong> {bill.position}</p>
                      <hr />
                    </a>
                  ))
                ) : (
                  <p>No recent bills available.</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}