//import './App.css'
import NavBar from './frontend/components/NavBar'
import Home from "./frontend/pages/house/Home"
import HouseCE from './frontend/pages/house/HouseCurrentElected'
import HouseE from './frontend/pages/house/HouseElection'
import HouseRB from './frontend/pages/house/HouseRecentBuisness'
import HouseUB from './frontend/pages/house/HouseUpcomingBuisness'
import SenateCE from './frontend/pages/senate/SenateCurrentElection'
import SenateE from './frontend/pages/senate/SenateElection'
import SenateRB from './frontend/pages/senate/SenateRecentBusiness'
import SenateUB from './frontend/pages/senate/SenateUpcomingBusiness'
import UserProfile from './frontend/pages/user/Profile'
import About from './frontend/pages/user/About'
import Login from './frontend/pages/user/Login'
import Register from './frontend/pages/user/Register'
import Signout from "./frontend/pages/user/Signout"
import HouseMembers from './frontend/components/HouseMembers'
import SenateMembers from './frontend/components/SenateMembers'
import BillPages from './frontend/components/BillPages'
import {Route, Routes} from "react-router-dom"
import { AuthProvider } from './frontend/contexts/contexts'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <AuthProvider>
      <main>
          <NavBar />
          <div className = "container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/HCE" element={<HouseCE />} />
              <Route path="/HE" element={<HouseE />} />
              <Route path="/HRB" element={<HouseRB />} />
              <Route path="/HUB" element={<HouseUB />} />
              <Route path="/SCE" element={<SenateCE />} />
              <Route path="/SE" element={<SenateE />} />
              <Route path="/SRB" element={<SenateRB />} />
              <Route path="/SUB" element={<SenateUB />} />
              <Route path="/UserProfile" element={<UserProfile />} />
              <Route path="/About" element={<About />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Signout" element={<Signout />} />
              <Route path="/HouseMembers" element={<HouseMembers />} />
              <Route path="/SenateMembers" element={<SenateMembers />} />
              <Route path="/BillPages" element={<BillPages />} />
            </Routes>
          </div>
      </main>
    </AuthProvider>
  )
}