// Import necessary components and hooks from react-router-dom
import {Link, useMatch, useResolvedPath} from "react-router-dom"
import {Dropdown, Container, NavDropdown, Nav} from "react-bootstrap"
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
              Home
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
              <NavDropdown.Item>
                <Clink to="/HRB">
                  House Recent Business
                </Clink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Clink to="/HUB">
                  House Upcoming Business
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
              <NavDropdown.Item>
                <Clink to="/SRB">
                  Senate Recent Business
                </Clink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Clink to="/SUB">
                  Senate Upcoming Business
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
                <NavDropdown.Item>
                  <Clink to="/UserProfile">Profile</Clink>
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
  )
}

// Custom link component that adds active class to the link that matches the current URL
function Clink({to, children, ...props}) {
  // Resolve the path to an absolute path
  const resolvedPath = useResolvedPath(to);
  // Check if the current path matches the target path exactly
  const isActive = useMatch({path: resolvedPath.pathname, end: true});

  // Return a list item with the link. If the link is active, add the "active" class
  return (
    <Nav.Link className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children} {/* Render the link text or child components */}
      </Link>
    </Nav.Link>  
  )
}