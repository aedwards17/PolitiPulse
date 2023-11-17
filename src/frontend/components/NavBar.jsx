// Import necessary components and hooks from react-router-dom
import {Link, useMatch, useResolvedPath} from "react-router-dom"
import {Container, NavDropdown, Nav} from "react-bootstrap"
import Navbar from 'react-bootstrap/Navbar'
import { useAuth  } from '../contexts/contexts'

// NavBar component for the top of the pages
export default function NavBar() {
  const { currentUser } = useAuth();

  return (
      <Navbar bg="dark" data-bs-theme="dark"> 
        <Container>
          <Navbar.Brand>
            <Clink to="/">
              Poltipulse
            </Clink>
          </Navbar.Brand>
          <Nav className="me-auto">
            <NavDropdown title="House" id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                <Clink to="/HCE">
                  Current Elected
                </Clink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Clink to="/HE">
                  Election
                </Clink> 
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Senate" id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                <Clink to="/SCE">
                  Current Elected
                </Clink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Clink to="/SE">
                  Election
                </Clink> 
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="User" id="collapsible-nav-dropdown">
              <NavDropdown.Item>
                <Clink to="/About">
                  About
                </Clink>
              </NavDropdown.Item>
              {!currentUser && (
                <>
                  <NavDropdown.Item>
                    <Clink to="/Login">Login</Clink> 
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Clink to="/Register">Register</Clink>
                  </NavDropdown.Item>
                </>
              )}

              {currentUser && (
                <>
                  <NavDropdown.Item>
                    <Clink to="/UserProfile">User Profile</Clink> 
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Clink to="/Signout">Sign Out</Clink>
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
  )
}

function Clink({to, children, ...props}) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({path: resolvedPath.pathname, end: true});

  return (
    <Nav.Link className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children} 
      </Link>
    </Nav.Link>  
  )
}