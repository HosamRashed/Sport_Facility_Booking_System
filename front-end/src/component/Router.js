import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./dashboard/Dashboard";

import Reset from "./Reset/Reset";

class Router extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reset_password" element={<Reset />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default Router;
