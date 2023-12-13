import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'; 

import avatarImage from '../../img/avatar.png'; // Import the image


export default function HouseElection() {
  // State variables to store data and manage pagination
  const [house, setHouse] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [perPage] = useState(6); // Number of items to display per currentPage (set to 5)

  // Function to fetch data from Firestore
  const fetchPost = async () => {
    try {
      // Firestore query to fetch House representatives with congress value 118 and limit the results to 5
      const q = query(collection(db, "house"), where("next_election", "==", '2024'));
      const querySnapshot = await getDocs(q); // Execute the query
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setHouse(newData); // Update the state with the fetched data
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
  const paginatedHouse = house.slice(startIndex, endIndex);

  const totalResults = house.length;
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
      <h1 className="text-center">House Candidates</h1>
      <hr></hr>
      <div className="row">
        {paginatedHouse.map((house) => (
          <div key={house.id} className={`col-md-4 mb-4`}>
            <Link to={`/HouseMembers?houseMemberId=${house.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                <Card>
                <div className="d-flex justify-content-center" style={{ background: house.party === "D" ? "DarkBlue" : house.party === "R" ? "DarkRed" : "black" }}>
                  <Card.Img src={house.imageUrl || avatarImage} alt="Avatar" className="avatar" style={{ width: "20%" }} />
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
