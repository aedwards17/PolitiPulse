import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'; // Import Link for routing

import avatarImage from '../../img/avatar.png'; // Import the image

export default function SenateElection() {
  // State variables to store data and manage pagination
  const [senate, setSenate] = useState([]); // Represents the list of Senate candidates
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [perPage] = useState(6); // Number of items to display per page (set to 5)

  // Function to fetch data from Firestore
  const fetchPost = async () => {
    try {
      // Firestore query to fetch Senate candidates with next_election value '2024' and limit the results to 5
      const q = query(collection(db, "senate"), where("next_election", "==", '2024'));
      const querySnapshot = await getDocs(q); // Execute the query
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setSenate(newData); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  }

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchPost();
  }, []);

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedSenate = senate.slice(startIndex, endIndex);

  const totalResults = senate.length;
  const totalPage = Math.ceil(totalResults / perPage);

  const nextPage = () => {
    setCurrentPage((prevCurrentPage) => Math.min(prevCurrentPage + 1, totalPage));
  };

  const prevPage = () => {
    setCurrentPage((prevCurrentPage) => Math.max(prevCurrentPage - 1, 1));
  };

  // Render the component with fetched data and pagination controls
  return (
    <div className="container">
      <h1 className="text-center">Senate Candidates</h1>
      <hr></hr>
      <div className="row">
        {paginatedSenate.map((senate) => (
          <div key={senate.id} className={`col-md-4 mb-4`}>
            <Link to={`/SenateMembers?senateMemberId=${senate.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <Card>
                <div className="d-flex justify-content-center" style={{ background: senate.party === "D" ? "DarkBlue" : senate.party === "R" ? "DarkRed" : "black" }}>
                  <Card.Img src={senate.imageUrl || avatarImage} alt="Avatar" className="avatar" style={{ width: "20%" }} />
                </div>
                <Card.Body>
                  <Card.Title>Last name: {senate.last_name}</Card.Title>
                  <Card.Title>First name: {senate.first_name}</Card.Title>
                  <Card.Text>Party: {senate.party}</Card.Text>
                  <Card.Text>State: {senate.state}</Card.Text>
                  <Card.Text>Congress: {senate.congress}</Card.Text>
                  <Card.Text>Next Election: {senate.next_election}</Card.Text>
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
