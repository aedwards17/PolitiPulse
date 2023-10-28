import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../../../firebase';
import { Card, Button } from "react-bootstrap";

import avatarImage from '../../img/avatar.png'; // Import the image

export default function SenateElection() {
  // State variables to store data and manage pagination
  const [senate, setSenate] = useState([]); // Represents the list of Senate candidates
  const [page, setPage] = useState(1); // Current page number
  const [perPage] = useState(5); // Number of items to display per page

  // Function to fetch data from Firestore
  const fetchCandidates = async () => {
    try {
      // Firestore query to fetch Senate candidates with next election year 2024 and limit the results to 5
      const q = query(collection(db, "senate"), where("next_election", "==", '2024'), limit(5));
      const querySnapshot = await getDocs(q); // Execute the query
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })); // Extract data from the query result
      setSenate(newData); // Update the state with the fetched data
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  }

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    fetchCandidates();
  }, []);

  // Calculate the start and end indexes for pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Create a paginated subset of the data based on the current page
  const paginatedSenate = senate.slice(startIndex, endIndex);

  // Calculate the total number of results
  const totalResults = senate.length;

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
      <h1 className="text-center">Senate Candidates</h1> {/* Header */}
      <hr></hr>
      <div className="row">
        {/* Map through and display paginated Senate candidates */}
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
                <Card.Text>Next Election: {senator.next_election}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <div className="pagination d-flex justify-content-center">
        <Button onClick={prevPage} disabled={page === 1}>Previous</Button> {/* Button to go to the previous page */}
        <Button onClick={nextPage} disabled={endIndex >= totalResults}>Next</Button> {/* Button to go to the next page */}
      </div>
      <div className="results-info text-center">
        Showing {currentPageRange} of {totalResults} results
      </div>
    </div>
  );
}
