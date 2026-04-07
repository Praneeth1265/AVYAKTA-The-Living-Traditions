// Content for Testing purposes only
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <head>
        <title>Avyakta</title>
      </head>
      <main style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome to Avyakta</h1>
        <p>
          Edit <code>src/App.jsx</code> to get started.
        </p>
        <button onClick={() => setCount(count + 1)}>Count is {count}</button>
      </main>
    </>
  );
}

export default App;
