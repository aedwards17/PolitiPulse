// Import necessary components and hooks from react-router-dom
import {Link, useMatch, useResolvedPath} from "react-router-dom"

// NavBar component for the top of the pages
export default function NavBar() {
  return (
    <nav className="nav"> {/* Start of navigation bar */}
      <ul>
        <Clink to="/">Home</Clink> {/* Link to Home page */}
        <li>
            <div className="dropdown"> {/* Dropdown menu for House related links */}
              <Clink to="/House">House</Clink> 
              <div className="dropdown-content"> {/* Container for dropdown items */}
                {/* Links for various House-related pages */}
                <Clink to="/HCE">Current Elected</Clink>
                <Clink to="/HE">Election</Clink> 
                <Clink to="/HRB">House Recent Business</Clink>
                <Clink to="/HUB">House Upcoming Business</Clink>
              </div>  
            </div>
        </li>
        <li>
            <div className="dropdown">
              <a href="/Senate">Senate</a>
              <div className="dropdown-content">
                {/* Links for various Senate-related pages */}
                <Clink to="/SCE">Current Elected</Clink>
                <Clink to="/SE">Election</Clink> 
                <Clink to="/SRB">Senate Recent Business</Clink>
                <Clink to="/SUB">Senate Upcoming Business</Clink>
              </div>  
            </div>
        </li>
        <li>
            <div className="dropdown">
              <a href="/User">User</a>
              <div className="dropdown-content">
                {/* Links for user-related pages */}
                <Clink to="/UserProfile">Profile</Clink>
                <Clink to="/About">About</Clink>
                <Clink to="/Login">Login</Clink>
                <Clink to="/Register">Register</Clink>
              </div>  
            </div>
        </li>
      </ul>
  </nav>
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
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children} {/* Render the link text or child components */}
      </Link>
    </li>  
  )
}