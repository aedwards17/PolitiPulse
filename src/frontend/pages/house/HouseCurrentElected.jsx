import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'; // Import Link for routing

export default function HouseCurrentElected() {
  const [house, setHouse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);

  const fetchPost = async () => {
    try {
      const q = query(collection(db, "house"), where("congress", "==", "118"), limit(25)); // Fetch more data to simulate pagination
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

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedHouse = house.slice(startIndex, endIndex);

  const totalResults = house.length;
  const totalPage = Math.ceil(totalResults / perPage);

  const nextPage = () => {
    setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPage));
  };

  const prevPage = () => {
    setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
  };

  return (
    <div className="container">
      <h1 className="text-center">House Representatives</h1>
      <hr />
      <div className="row">
        {paginatedHouse.map((houseMember) => (
          <div key={houseMember.id} className="col-md-4 mb-4">
            <Link to={`/HouseMembers?houseMemberId=${houseMember.id}`} style={{ textDecoration: 'none', color: 'black' }}>
              <Card>
                <div className="d-flex justify-content-center" style={{ background: houseMember.party === "D" ? "DarkBlue" : houseMember.party === "R" ? "DarkRed" : "black" }}>
                  <Card.Img src={houseMember.imageUrl || avatarImage} alt={houseMember.last_name} className="avatar" style={{ width: "20%" }} />
                </div>
                <Card.Body>
                  <Card.Title>Last name: {houseMember.last_name}</Card.Title>
                  <Card.Title>First name: {houseMember.first_name}</Card.Title>
                  <Card.Text>Party: {houseMember.party}</Card.Text>
                  <Card.Text>State: {houseMember.state}</Card.Text>
                  <Card.Text>District: {houseMember.district}</Card.Text>
                  <Card.Text>Congress: {houseMember.congress}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      <div className="pagination d-flex justify-content-center mt-3">
        <Button onClick={prevPage} disabled={currentPage === 1} className="me-5 bg-light text-dark" >Previous</Button>
        <Button onClick={nextPage} disabled={currentPage >= totalPage} className="bg-light text-dark">Next</Button>
      </div>
      <div className="results-info text-center">
        Showing {startIndex + 1} to {Math.min(endIndex, totalResults)} of {totalResults} results
      </div>
    </div>
  );
}
