import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-5xl font-bold mb-8">Welcome Home</h1>
      <Link to="/linktree">
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
          Go to Linktree
        </button>
      </Link>
    </div>
  );
}

export default App;
