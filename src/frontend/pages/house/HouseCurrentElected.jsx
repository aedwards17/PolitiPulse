import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase'


export default function HouseCurrentElected() {
  const [house, setHouse] = useState([]);

  const fetchPost = async () => {
    await getDocs(collection(db, "house"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }));
        setHouse(newData);
      });
  }

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="container">
      <div className="row">
        {house.map((house) => (
          <div key={house.id} className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Last name: {house.last_name}</h5>
                <h5 className="card-title">First name: {house.first_name}</h5>
                <p className="card-text">Email: {house.email}</p>
                <p className="card-text">Role: {house.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}