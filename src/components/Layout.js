import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
  <div>
    <nav>
      {/* Nav links should be dynamically created based on the user role */}
    </nav>
    <main>
      {children}
    </main>
  </div>
);

export default Layout;
