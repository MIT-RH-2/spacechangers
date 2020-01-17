import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div style={{ flex: 1 }}>
      <ml-model
        extractable="true"
        src="balloon.fbx"
        style={{width: '300px', height: '300px'}}>
      </ml-model>
    </div>
  );
}

export default App;
