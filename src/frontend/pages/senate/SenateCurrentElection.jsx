import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

export default function SenateCurrentElected() {
  const [senate, setSenate] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);

  const fetchsenates = async () => {
    try {
      const q = query(collection(db, "senate"), where("congress", "==", "118"), limit(5));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSenate(newData);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  }

  useEffect(() => {
    fetchsenates();
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
      <h1 className="text-center">senates</h1>
      <hr></hr>
      <div className="row">
        {paginatedSenate.map((senate) => (
          <div key={senate.id} className={`col-md-4 mb-4`}>
            <Link to={`/SenateMembers?senateId=${senate.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <Card>
                <div className="d-flex justify-content-center" style={{ background: senate.party === "D" ? "DarkBlue" : senate.party === "R" ? "DarkRed" : "black" }}>
                  <Card.Img src={senate.imageUrl} alt="Avatar" className="avatar" style={{ width: "20%" }} />
                </div>
                <Card.Body>
                  <Card.Title>Last name: {senate.last_name}</Card.Title>
                  <Card.Title>First name: {senate.first_name}</Card.Title>
                  <Card.Text>Party: {senate.party}</Card.Text>
                  <Card.Text>State: {senate.state}</Card.Text>
                  <Card.Text>Congress: {senate.congress}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination d-flex justify-content-center mt-3">
        <Button onClick={prevPage} disabled={page === 1} className="btn btn-outline-primary mx-5">Previous</Button>
        <Button onClick={nextPage} disabled={endIndex >= totalResults} className="btn btn-outline-primary mx-5" >Next</Button>
      </div>
      <div className="results-info text-center">
        Showing {currentPageRange} of {totalResults} results
      </div>
    </div>
  );
}
