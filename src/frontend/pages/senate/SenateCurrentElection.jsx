import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";

import avatarImage from '../../img/avatar.png'; // Import the image

export default function SenateCurrentElected() {
  const [senate, setSenate] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5); // Change perPage to 5

  const fetchSenators = async () => {
    try {
      const q = query(collection(db, "senate"), where("congress", "==", "118"), limit(5)); // Limit to 5 results
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSenate(newData);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  }

  useEffect(() => {
    fetchSenators();
  }, []);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedSenate = senate.slice(startIndex, endIndex);

  const totalResults = senate.length;
  const currentPageRange = `${startIndex + 1} - ${Math.min(endIndex, totalResults)}`;

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center">Senators</h1>
      <hr></hr>
      <div className="row">
        {paginatedSenate.map((senator) => (
          <div key={senator.id} className={`col-md-4 mb-4`}>
            <Card>
              <div className="d-flex justify-content-center" style={{ background: senator.party === "D" ? "DarkBlue" : senator.party === "R" ? "DarkRed" : "black" }}>
                <Card.Img src={avatarImage} alt="Avatar" className="avatar" style={{ width: "20%" }} />
              </div>
              <Card.Body>
                <Card.Title>Last name: {senator.last_name}</Card.Title>
                <Card.Title>First name: {senator.first_name}</Card.Title>
                <Card.Text>Party: {senator.party}</Card.Text>
                <Card.Text>State: {senator.state}</Card.Text>
                <Card.Text>Congress: {senator.congress}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <div className="pagination d-flex justify-content-center">
        <Button onClick={prevPage} disabled={page === 1}>Previous</Button>
        <Button onClick={nextPage} disabled={endIndex >= totalResults}>Next</Button>
      </div>
      <div className="results-info text-center">
        Showing {currentPageRange} of {totalResults} results
      </div>
    </div>
  );
}
