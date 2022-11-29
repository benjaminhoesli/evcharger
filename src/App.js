import './App.css';

import Travel from './Pages/Travel.js';
import Journey from './Pages/Journey.js';
import Profile from './Pages/Profile.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


import {Navbar, Nav, Container} from 'react-bootstrap';



function App() {
  return (
    <Router>
      <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>EV Charger</Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to={"/Journey"}>Journey</Nav.Link>
            <Nav.Link as={Link} to={"/Profile"}>Profile</Nav.Link>
            <Nav.Link as={Link} to={"/Travel"}>Travel</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      </div>


      <div>
      <Routes>
        <Route exact path='/Travel' element={<Travel/>}>
        </Route>
        <Route exact path='/Profile' element={<Profile/>}>
        </Route>
        <Route exact path='/Journey' element={<Journey/>}>
        </Route>
        </Routes>
      </div>

    </Router>



  );
}

export default App;