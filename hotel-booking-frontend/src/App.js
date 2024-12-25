import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HotelList from './components/HotelList';

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <HotelList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
