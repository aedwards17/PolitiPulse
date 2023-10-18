import {Link, useMatch, useResolvedPath} from "react-router-dom"

export default function NavBar() {
  return (
    <nav className="nav">
      <ul>
        <Clink to="/">Home</Clink>
        <li>
            <div className="dropdown">
              <a href="/House">House</a>
              <div className="dropdown-content">
                <Clink to="/HCE">Current Elected</Clink>
                <Clink to="/HE">Elction</Clink>
                <Clink to="/HRB">House Recent Business</Clink>
                <Clink to="/HUB">House Upcoming Business </Clink>
              </div>  
            </div>
        </li>
        <li>
            <div className="dropdown">
              <a href="/Senate">Senate</a>
              <div className="dropdown-content">
                <Clink to="/SCE">Current Elected</Clink>
                <Clink to="/SE">Elction</Clink>
                <Clink to="/SRB">Senate Recent Business</Clink>
                <Clink to="/SUB">Senate Upcoming Business </Clink>
              </div>  
            </div>
        </li>
        <li>
            <div className="dropdown">
              <a href="/User">User</a>
              <div className="dropdown-content">
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

function Clink({to, children, ...props}) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({path: resolvedPath.pathname, end: true})

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>  
  )
}