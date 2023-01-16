import React from 'react';
import './App.css';
import { Carousel } from './layouts/HomePage/Carousel';
import { ExploteTopBooks } from './layouts/HomePage/ExploreTopBooks';
import { Heros } from './layouts/HomePage/Heros';
import { LibraryServices } from './layouts/HomePage/LibraryServices';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';

function App() {
  return (
    <div>
      <Navbar/>
      <ExploteTopBooks/>
      <Carousel/>
      <Heros/>
      <LibraryServices/>
    </div>
    
  );
}

export default App;
