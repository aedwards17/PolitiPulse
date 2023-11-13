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
            let question = voteDocData.data().question;

            // Fetch the bill title from the "bills" collection
            const billDocRef = doc(db, 'bills', bill_id);
            const billDocData = await getDoc(billDocRef);
            let bill_title = "";
            if (billDocData.exists()) {
              bill_title = billDocData.data().bill_title
              console.log(bill_title);
            } else {
              console.log('data does not exist')
            }
            positionsSnapshot.forEach((positionDoc) => {
              const position = {
                "bill": bill_id,
                "bill_title": bill_title, // Add the bill title here
                "roll_call": voteDoc.id,
                "question": question,
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
          <h2 class="text-center">Member Info</h2>
          <Card className="bg-light">
            <Card.Header>
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
            <Card.Body className="bg-white">
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
          <Card className="bgwhite hover-overlay">
            <Card.Body>
              <div style={{ maxHeight: '607px', overflowY: 'auto' }}>
                {recentBills.length > 0 ? (
                  recentBills.map((bill, index) => (
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