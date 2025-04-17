import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MyRoutes from './routers/routes';

function App() {
  return (
    <Router>
      <div className="App">
        <MyRoutes />
      </div>
    </Router>
  );
}

export default App;