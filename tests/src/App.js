//App.js
import React, { useState } from 'react';

function App() {
  const [buttonName, setButtonName] = useState('');

  const handleClick = (event) => {
    setButtonName(event.target.name);
  };

  return (
    <div>
      <h1>Click a Button</h1>
      <button name="button1" onClick={handleClick}>
        Button 1
      </button>
      <button name="button2" onClick={handleClick}>
        Button 2
      </button>
      <button name="button3" onClick={handleClick}>
        Button 3
      </button>
      <p>You clicked: {buttonName}</p>
    </div>
  );
}

export default App;
