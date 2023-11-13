import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Card } from "react-bootstrap";

export default function BillDetails() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const billId = queryParams.get("billId");
  
  const [billInfo, setBillInfo] = useState({});
  const [billSimplified, setBillSimplified] = useState("");

  useEffect(() => {
    // Fetch bill info based on billId
    const fetchBillInfo = async () => {
      try {
        const billDocRef = doc(db, 'bills', billId);
        const billDocSnap = await getDoc(billDocRef);

        if (billDocSnap.exists()) {
          const billData = billDocSnap.data();
          setBillInfo(billData);

          // Replace newlines with HTML line breaks
          const simplifiedTextWithBreaks = billData.bill_simplified
            ? billData.bill_simplified.replace(/\n/g, '<br>')
            : "";
          setBillSimplified(simplifiedTextWithBreaks);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching bill info:", error);
      }
    };

    fetchBillInfo();
  }, [billId]);


  return (
    <div className="row mt-4">
      {/* Bill Details Card */}
      <div className="col-md-6 mb-4">
        <Card className="bg-light">
          <Card.Header className="bg-light"><strong><h2>Bill Info</h2></strong></Card.Header>
          <Card.Body className="bg-white">
            <p><strong>Title:</strong> {billInfo.bill_title}</p>
            <p><strong>Date:</strong> {billInfo.bill_date}</p>
            <p><strong>Description:</strong> {billInfo.bill_description}</p>
            <p><strong>Number:</strong> {billInfo.bill_number}</p>
            <p><strong>Status:</strong> {billInfo.bill_status}</p>
            <p><strong>Latest Major Action:</strong> {billInfo.latest_major_action}</p>
            <p><strong>Latest Action Date:</strong> {billInfo.latest_major_action_date}</p>                                      <p><strong>Full Bill URL: </strong><a href={billInfo.bill_url} target="_blank">{billInfo.bill_url}</a></p>
          </Card.Body>
        </Card>
      </div>

      {/* Bill Simplified Text Card */}
      <div className="col-md-6 mb-4">
        <Card className="bg-light">
          <Card.Header className="bg-light"><strong><h2>Simplified Bill Text</h2></strong></Card.Header>
          <Card.Body className="bg-white">
          <div dangerouslySetInnerHTML={{ __html: billSimplified }} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
