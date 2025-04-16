import React, { useEffect, useState } from 'react';

function App() {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/TripMeUpApp/city/')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCities(data);  // list of city objects
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
        <>
          <h2>Cities:</h2>
          {cities.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {cities.map((city) => (
                <li key={city.city_id}>
                  <strong>{city.name}</strong> – {city.location}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default App;
