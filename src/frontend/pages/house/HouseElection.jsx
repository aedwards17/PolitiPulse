import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";

import avatarImage from '../../img/avatar.png'; // Import the image

export default function HouseElection() {
  const [house, setHouse] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);

  const fetchPost = async () => {
    try {
      const q = query(collection(db, "house"), where("next_election", "==", '2024'), limit(5)); // Limit to 5 results
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setHouse(newData);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedHouse = house.slice(startIndex, endIndex);

  const totalResults = house.length;
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
      <h1 className="text-center">House Candidates</h1>
      <hr></hr>
      <div className="row">
        {paginatedHouse.map((house) => (
          <div key={house.id} className={`col-md-4 mb-4`}>
            <Card>
              <div className="d-flex justify-content-center" style={{ background: house.party === "D" ? "DarkBlue" : house.party === "R" ? "DarkRed" : "black" }}>
                <Card.Img src={avatarImage} alt="Avatar" className="avatar" style={{ width: "20%" }} />
              </div>
              <Card.Body>
                <Card.Title>Last name: {house.last_name}</Card.Title>
                <Card.Title>First name: {house.first_name}</Card.Title>
                <Card.Text>Party: {house.party}</Card.Text>
                <Card.Text>State: {house.state}</Card.Text>
                <Card.Text>District: {house.district}</Card.Text>
                <Card.Text>Congress: {house.congress}</Card.Text>
                <Card.Text>Next Election: {house.next_election}</Card.Text>
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
