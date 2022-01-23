import React from 'react';
import ReactDOM from 'react-dom';

import { useRoutes, BrowserRouter as Router } from 'react-router-dom';

import routes from '~react-pages';

function App() {
  return useRoutes(routes);
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById(`root`),
);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// )
