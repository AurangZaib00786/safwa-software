import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import './i18n'
import Routing from './Container/routingContainer'
import React, {Suspense } from 'react'

function App() {
  
  return (
    <Suspense fallback={null}>
      <Routing/>
    </Suspense>
    
  );
}

export default App;
