import React from 'react';
import { Link } from 'react-router-dom';

const TopMenu = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">Checklist Diário</Link>
        <Link to="/patch-notes" className="text-white hover:text-gray-300">Patch Notes</Link>
      </div>
    </nav>
  );
};

export default TopMenu;