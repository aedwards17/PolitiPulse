export default function NavBar() {
  return (
    <nav className="nav">
    <ul>
      <li>
          <div class="dropDown">
            <button class="dropbtn">Dropdown</button>
            <div class="dropDownContent">
              
          </div>
          </div>
          <a href="/home">Home</a>
      </li>
      <li>
          <a href="/House">House</a>
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