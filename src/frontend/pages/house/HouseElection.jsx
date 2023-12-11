import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom'; // Import Link for routing

import avatarImage from '../../img/avatar.png'; // Import the image

export default function HouseElection() {
  // State variables to store data and manage pagination
  const [house, setHouse] = useState([]); // Represents the list of House representatives
  const [page, setPage] = useState(1); // Current page number
  const [perPage] = useState(5); // Number of items to display per page (set to 5)

  // Function to fetch data from Firestore
  const fetchPost = async () => {
    try {
      // Firestore query to fetch House representatives with congress value 118 and limit the results to 5
      const q = query(collection(db, "house"), where("next_election", "==", '2024'), limit(5));
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

  // Calculate the start and end indexes for pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Create a paginated subset of the data based on the current page
  const paginatedHouse = house.slice(startIndex, endIndex);

  // Calculate the total number of results
  const totalResults = house.length;

  // Create a string to display the current range of results
  const currentPageRange = `${startIndex + 1} - ${Math.min(endIndex, totalResults)}`;

  // Function to go to the next page
  const nextPage = () => {
    setPage(page + 1);
  };

  // Function to go to the previous page (if not on the first page)
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
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
                  <Card.Img src={house.imageUrl} alt="Avatar" className="avatar" style={{ width: "20%" }} />
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
        <Button onClick={prevPage} disabled={page === 1} className="btn btn-outline-primary mx-5">Previous</Button>
        <Button onClick={nextPage} disabled={endIndex >= totalResults} className="btn btn-outline-primary mx-5" >Next</Button>
      </div>
      <div className="results-info text-center">
        Showing {currentPageRange} of {totalResults} results
      </div>
    </div>
  );
}
