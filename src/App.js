import logo from './logo.svg';
import './App.css';

import './Pages/Travel.js';
import './Pages/Journey.js';
import './Pages/Profile.js';
import './Pages/SignIn.js';
import './Pages/SignUp.js';
import 'bootstrap/dist/css/bootstrap.min.css'


import {Navbar, Nav, Container} from 'react-bootstrap';



function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

    </>



  );
}

export default App;