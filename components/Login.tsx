import React, { useState } from 'react';
import { MockService } from '../services/mockData';
import { User } from '../types';

interface Props {
  onLogin: (user: User) => void;
}

export const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@newlife.org');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await MockService.login(email);
      if (user) {
        onLogin(user);
      } else {
        setError('User not found. Try admin@newlife.org or uwase@newlife.org');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ache-100/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-white p-8 text-center border-b border-gray-100">
          <img 
            src="/logo.png"
            alt="NewLife Logo" 
            className="mx-auto h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-xl font-bold text-chocolate-900">Cell Management System</h1>
          <p className="text-gray-500 mt-2 text-sm">Pastoral Care & Discipleship</p>
        </div>
        
        <div className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="you@newlife.org"
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-70"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">Demo Credentials:</p>
            <div className="flex justify-center space-x-2 text-xs">
              <button onClick={() => setEmail('admin@newlife.org')} className="px-3 py-1 bg-chocolate-800 text-white rounded hover:bg-chocolate-900">Admin</button>
              <button onClick={() => setEmail('uwase@newlife.org')} className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700">Leader (Kabeza)</button>
              <button onClick={() => setEmail('mugabo@newlife.org')} className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700">Leader (Kanombe)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};