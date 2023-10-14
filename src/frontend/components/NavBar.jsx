import { Outlet, Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="nav">
    <ul>
      <li>
          <a hre="/home">Home</a>
      </li>
      <li>
          <div className="dropdown">
            <a href="/House">House</a>
            <div className="dropdown-content">
              <a href="#">Current Elected</a>
              <a href="#">Elction</a>
              <a href="#">Recent Buisness</a>
              <a href="#">Upcoming Buisness</a>
            </div>  
          </div>
      </li>
      <li>
          <div className="dropdown">
          <a href="/House">Senate</a>
          <div className="dropdown-content">
            <a href="#">Current Elected</a>
            <a href="#">Elction</a>
            <a href="#">Recent Buisness</a>
            <a href="#">Upcoming Buisness</a>
          </div>  
        </div>
      </li>
      <li>
        <div className="dropdown">
          <a href="/House">User</a>
          <div className="dropdown-content">
            <a href="#">About</a>
            <a href="#">Login</a>
            <a href="#">Political Compass</a>
            <a href="#">Register</a>          
          </div>  
        </div>
      </li>
    </ul>
  </nav>
  )
}