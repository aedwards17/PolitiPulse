import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../../contexts/contexts';
import { db } from "../../../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"; // Ensure to import doc and getDoc
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function Home() {
  const [congressMembers, setCongressMembers] = useState([]);
  const { currentUser } = useAuth();
  const [news, setNews] = useState([]);

  useEffect(() => {

    async function fetchCongressMembers() {
      try {
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.district || userData.state) {
              const members = [];
              const senateQuery = query(collection(db, 'senate'), where('state', '==', userData.state));
              const houseQuery = query(collection(db, 'house'), where('district', '==', userData.district), where('state', '==', userData.state));

              // Fetch senate members
              const senateSnapshot = await getDocs(senateQuery);
              senateSnapshot.forEach((docSnap) => {
                // Include the document ID in the member object
                members.push({ id: docSnap.id, ...docSnap.data() });
              });

              // Fetch house members
              const houseSnapshot = await getDocs(houseQuery);
              houseSnapshot.forEach((docSnap) => {
                // Include the document ID in the member object
                members.push({ id: docSnap.id, ...docSnap.data() });
              });
              setCongressMembers(members);
            } else {
              console.error('User data does not contain valid userVD or userState');
            }
          }
        } else {
          console.log("User is not logged in");
        }
      } catch (error) {
        console.error("An error occurred while fetching congress members:", error);
      }
    }
    
    async function fetchNews() {
      try {
        const newsQuery = query(collection(db, 'news'));
        const newsSnapshot = await getDocs(newsQuery);
        const newsData = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNews(newsData);
      } catch (error) {
        console.error("An error occurred while fetching news:", error);
      }
    }

    fetchCongressMembers();
    fetchNews();  // Fetch news on component mount
  }, [currentUser]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Home</h1>
      <div className="row">
        {/* Congress Members Card */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header><strong><h2>Your Congress Members</h2></strong></Card.Header>
            <ListGroup variant="flush">
              {congressMembers.map(member => (
                <ListGroup.Item key={member.id}>
                  <strong>{member.title}: </strong>
                  {member.title === "Representative" ? (
                    <Link to={`/HouseMembers?houseMemberId=${member.id}`}>{member.first_name} {member.last_name}</Link>
                  ) : (
                    <Link to={`/SenateMembers?senateMemberId=${member.id}`}>{member.first_name} {member.last_name}</Link>
                  )}
                  <span className="badge bg-secondary ml-2">{member.party}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </div>

        {/* Top Right Card - Recent Bills */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header><strong><h2>Recent Bills</h2></strong></Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {'Recent Bills related to user congress members will be placed here'}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        {/* Bottom Left Card - Recent Statements */}
        <div className="col-md-6 mb-4">
          <Card>
            <Card.Header><strong><h2>Recent Statements</h2></strong></Card.Header>
            <Card.Body>
              {<ListGroup variant="flush">
                {'Recent Statements related to user congress members will be placed here'}
              </ListGroup>}
            </Card.Body>
          </Card>
        </div>

        {/* Bottom Right Card - Related News */}
        <div className="col-md-6 mb-4 overflow-scroll" style={{ height: "250px" }}>
          <Card>
            <Card.Header><strong><h2>Related News</h2></strong></Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {news.map(({ id, date, title, shortDescription, url, source }) => (
                  <ListGroup.Item key={id}>
                    <h5>{title}</h5>
                    <p>{shortDescription}</p>
                    <small>{new Date(date).toLocaleDateString()}</small>
                    <br />
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a><br />
                    <small>Source: {source}</small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}