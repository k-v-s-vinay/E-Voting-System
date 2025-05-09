import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [elections, setElections] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const fetchElections = async () => {
    const res = await axios.get('http://localhost:5000/api/elections', {
      headers: { Authorization: token },
    });
    setElections(res.data);
  };

  const vote = async (electionId, candidateIndex) => {
    await axios.post(
      `http://localhost:5000/api/elections/${electionId}/vote`,
      { candidateIndex },
      { headers: { Authorization: token } }
    );
    fetchElections();
  };

  useEffect(() => {
    if (token) fetchElections();
  }, [token]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {!token ? (
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Login</h2>
          <input
            className="border p-2 w-full"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-blue-500 text-white p-2 w-full" onClick={login}>
            Login
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Elections</h2>
          {elections.map((election) => (
            <div key={election._id} className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold">{election.title}</h3>
              <p>{election.description}</p>
              <ul className="space-y-1">
                {election.candidates.map((c, i) => (
                  <li key={i}>
                    {c.name} - {c.votes} votes
                    <button
                      onClick={() => vote(election._id, i)}
                      className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Vote
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
