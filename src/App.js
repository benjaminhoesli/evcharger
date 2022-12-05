import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarHeader from './Navbar';

const stackTokens = { childrenGap: 100 };
const stackStyles = { root: { width: 650,
  color: '#FFFFFF'   
} };
const columnProps = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300 } },
};

function App() {
    return (
      <div style={{ 
        background: 'gray',
        height:'100vh',
        marginTop:'0px',
        fontSize:'50px',
        backgroundSize: 'cover',
      }}>
      <NavbarHeader/>
     </div>
      );
}

export default App;