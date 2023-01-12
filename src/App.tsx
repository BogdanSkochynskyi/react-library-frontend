import React from 'react';
import './App.css';
import { Carousel } from './layouts/HomePage/Carousel';
import { ExploteTopBooks } from './layouts/HomePage/ExploreTopBooks';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

function App() {
  return (
    <div>
      <Navbar/>
      <ExploteTopBooks/>
      <Carousel/>
    </div>
    
  );
}

export default App;
