import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <Sidebar />
      <main className="app__content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
