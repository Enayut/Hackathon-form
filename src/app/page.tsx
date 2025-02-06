'use client';
import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

export default function TeamPSForm() {
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [preferences, setPreferences] = useState(Array(10).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/login', { teamId, password });
      if (data.success) {
        setToken(data.token);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleSubmitPreferences = async (e: any) => {
    e.preventDefault();
    if (new Set(preferences).size !== 10) {
      alert('Please enter 10 unique PS preferences.');
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:4000/team/submit/ps', { preferences }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setSubmitted(true);
        alert('PS preferences submitted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Submission failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md px-4">
        {!token ? (
          <form onSubmit={handleLogin} className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Team Login</h2>
            <input 
              type="text" 
              placeholder="Team ID" 
              value={teamId} 
              onChange={(e) => setTeamId(e.target.value)} 
              required 
              className="w-full p-3 mb-4 bg-gray-800 text-white rounded-lg border-2 border-transparent focus:border-[#ff69b4] focus:border-opacity-50 focus:outline-none transition-all"
            />
            <div className="relative mb-6">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 bg-gray-800 text-white rounded-lg border-2 border-transparent focus:border-[#ff69b4] focus:border-opacity-50 focus:outline-none transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? 
                  <EyeOff className="w-5 h-5" /> : 
                  <Eye className="w-5 h-5" />
                }
              </button>
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </form>
        ) : !submitted ? (
          <form onSubmit={handleSubmitPreferences} className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">PS Preferences</h2>
            {preferences.map((ps, index) => (
              <input
                key={index}
                type="text"
                placeholder={`PS ${index + 1}`}
                value={ps}
                onChange={(e) => {
                  const newPreferences = [...preferences];
                  newPreferences[index] = e.target.value;
                  setPreferences(newPreferences);
                }}
                required
                className="w-full p-3 mb-3 bg-gray-800 text-white rounded-lg border-2 border-transparent focus:border-[#ff69b4] focus:border-opacity-50 focus:outline-none transition-all"
              />
            ))}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Submit Preferences
            </button>
          </form>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
            <p className="text-center text-xl text-white">You have already submitted your PS preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
}