import {Form, Col, Row} from "react-bootstrap"

export default function profile() {
  
  
  return (
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Current Email:
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly defaultValue = "test@gmail.com"/>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
          <Form.Label column sm="2">
            Password
          </Form.Label>
          <Col sm="10">
            <Form.Control type="password" placeholder="Password" />
          </Col>
        </Form.Group>
      </Form>
    );
}