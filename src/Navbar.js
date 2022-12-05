import './App.css';

import Travel from './Pages/Travel.js';
import Journey from './Pages/Journey.js';
import Profile from './Pages/Profile.js';
import SignIn from './Pages/SignIn';

import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import {Navbar, Nav, Container} from 'react-bootstrap';



function NavbarHeader() {
  return (
    <Router>
      <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/Journey">EV Charger</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='navbar-brand'>
            <Nav.Link href="/Journey">Journey</Nav.Link>
            <Nav.Link href="/Profile">Profile</Nav.Link>
            <Nav.Link href="/Travel">Travel</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      </div>


      <div>
      <Routes>
      <Route exact path='/' element={<SignIn/>}>
        </Route>
        <Route path='/Travel' element={<Travel/>}>
        </Route>
        <Route path='/Profile' element={<Profile/>}>
        </Route>
        <Route path='/Journey' element={<Journey/>}>
        </Route>
        </Routes>
      </div>

    </Router>



  );
}

export default NavbarHeader;