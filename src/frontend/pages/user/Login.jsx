import React, {useRef, useState} from 'react'
import { Card, Form, Button, Container, Alert } from 'react-bootstrap'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



export default function Login(){
  return (
    <Container 
      className = "d-flex align-items-center justify-content-center" 
      style={{minHeight:"100vh"}}
    >
      <div className="w-100" style={{maxWidth:"400px"}}>
        <LoginComp />
      </div>
    </Container>
  )
}



function LoginComp() {
  const emailRef = useRef()
  const passwordRef = useRef()

  const auth = getAuth();

  function onSubmit(e) {
    e.preventDefault(); // Prevents the default form submit action

    const auth = getAuth();
    signInWithEmailAndPassword(
      auth, 
      emailRef.current.value, 
      passwordRef.current.value
    )
      .then((userCredential) => {
        
        const user = userCredential.user;
        console.log(user)
        console.log("User is logged in")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
    
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button className="w-100" type="submit">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      </div>
    </>
  )
}
