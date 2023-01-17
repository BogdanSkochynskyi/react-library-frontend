import React from 'react';
import './App.css';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBook } from './layouts/SearchBooksPage/components/SearchBook';
import { SearchBookPage } from './layouts/SearchBooksPage/SearchBookPage';

export const App = () => {
  return (
    <div>
      <Navbar/>
      {/* <HomePage/> */}
      <SearchBookPage />
      <Footer/>
    </div>
    
  );
}
