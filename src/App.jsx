import './App.css'
import NavBar from './frontend/components/NavBar'
import Home from "./frontend/pages/house/Home"
import HouseCE from './frontend/pages/house/HouseCurrentElected'
import HouseE from './frontend/pages/house/HouseElection'
import HouseRB from './frontend/pages/house/HouseRecentBuisness'
import HouseUB from './frontend/pages/house/HouseUpcomingBuisness'
import {Route, Routes} from "react-router-dom"

export default function App() {
  return (
    <main>
      <NavBar />
      <div className = "container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/HCE" element={<HouseCE />} />
          <Route path="/HE" element={<HouseE />} />
          <Route path="/HRB" element={<HouseRB />} />
          <Route path="/HUB" element={<HouseUB />} />
        </Routes>
      </div>
    </main>
  )
}