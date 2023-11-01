import React, {useRef} from 'react'
import { Card, Form, Button, Container} from 'react-bootstrap'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


export default function Signup(){
  return (
    <Container 
      className = "d-flex align-items-center justify-content-center" 
      style={{minHeight:"100vh"}}
    >
      <div className="w-100" style={{maxWidth:"400px"}}>
        <SignupComp />
      </div>
    </Container>
  )
}



function SignupComp() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const navigate = useNavigate()
  const auth = getAuth()

  function onSubmit(e) {
    e.preventDefault(); // Prevents the default form submit action

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      // Handle the case where the passwords don't match
      console.error("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(
      auth, 
      emailRef.current.value, 
      passwordRef.current.value
    )
    .then((userCredential) => {
      // Handle successful account creation
      const user = userCredential.user;
      console.log(user);
      navigate("/");
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    });
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Button className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      </div>
    </>
  )
}