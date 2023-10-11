export default function NavBar() {
  return (
    <nav className="nav">
    <ul>
      <li>
          <a href="/home">Home</a>
      </li>
      <li>
          <div className="dropdown">
            <a href="/House">House</a>
            <div className="dropdown-content">
              <a href="#">Link1</a>
              <a href="#">Link2</a>
              <a href="#">Link3</a>
              <a href="#">Link4</a>
            </div>  
          </div>
      </li>
      <li>
          <a href="/Senate">Senate</a>
      </li>
      <li>
          <a href="/Misc">Misc</a>
      </li>
    </ul>
  </nav>
  )
}