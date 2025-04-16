import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/TripMeUp')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message);  // from Django: {"message": "Hello from Django!"}
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to fetch from Django API.');
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>TripMeUp Frontend</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p><strong>Message from Django API:</strong> {message || 'Loading...'}</p>
      )}
    </div>
  );
}

export default App;
