import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RatingPage from './RatingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/rating/:id" element={<RatingPage />} />
      </Routes>
    </Router>
  );
};

export default App;