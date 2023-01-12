import React from 'react';
import './App.css';
import { ExploteTopBooks } from './layouts/HomePage/ExploreTopBooks';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

function App() {
  return (
    <div>
      <Navbar/>
      <ExploteTopBooks/>
    </div>
    
  );
}

export default App;
