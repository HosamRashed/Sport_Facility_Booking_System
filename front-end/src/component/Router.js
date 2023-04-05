import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./dashboard/Dashboard";
import Facility from "./pages/Facility/Facility";
import Activities from "./pages/Activities/Activities";
import Announcements from "./pages/Announcement/Announcements";
import Bookings from "./pages/Booking/Bookings";
import Students from "./pages/Student/Students";

class Router extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default Router;
