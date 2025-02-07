'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, GripVertical } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

interface PSItem {
  id: number;
  name: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  message?: string;
}

interface SubmitResponse {
  success: boolean;
  message?: string;
}

export default function TeamPSForm() {
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preferences, setPreferences] = useState<PSItem[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `PS ${i + 1}`
    }))
  );
  const [draggedItem, setDraggedItem] = useState<PSItem | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post<LoginResponse>(`${baseUrl}/login`, { teamId, password });
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        setToken(data.token);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed ' + error);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(preferences[index]);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const newPreferences = [...preferences];
    const draggedItemIndex = preferences.findIndex(item => item.id === draggedItem.id);
    newPreferences.splice(draggedItemIndex, 1);
    newPreferences.splice(index, 0, draggedItem);
    setPreferences(newPreferences);
  };

  const handleSubmitPreferences = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderedPreferences = preferences.map(p => p.name);
    try {
      const { data } = await axios.post<SubmitResponse>(
        `${baseUrl}/team/submit/ps`,
        { preferences: orderedPreferences },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      if (data.success) {
        setSubmitted(true);
        alert('PS preferences submitted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Submission failed ' + error);
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
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Arrange PS Preferences</h2>
            <p className="text-gray-300 text-sm mb-4 text-center">Drag and drop to reorder your preferences</p>
            <div className="space-y-2">
              {preferences.map((ps, index) => (
                <div
                  key={ps.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center p-3 bg-gray-800 text-white rounded-lg border-2 border-transparent hover:border-[#ff69b4] hover:border-opacity-50 cursor-move transition-all"
                >
                  <GripVertical className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="flex-grow">{ps.name}</span>
                  <span className="text-gray-400 text-sm">#{index + 1}</span>
                </div>
              ))}
            </div>
            <button 
              type="submit" 
              className="w-full mt-6 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
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