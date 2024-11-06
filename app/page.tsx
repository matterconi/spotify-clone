'use client'

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from './components/Navbar';
import Library from './components/Library';
import TracksQuery from './components/TracksQuery';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store'; // Import Redux store
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toast styles
import { useMusicOnMount } from './hooks/useMusicOnMount';
import { useAuthSetup } from './hooks/useAuthSetup';



const HomePage: React.FC = () => {
  // Initialize music data and authentication on mount
  useMusicOnMount();
  useAuthSetup();

  // Sidebar toggle state for the Library
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar toggleLibrary={() => setIsLibraryOpen((prev) => !prev)} />

      {/* Main layout with library and content sections */}
      <div className="flex flex-grow">
        <Library isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        <div className="flex-grow p-8">
          <TracksQuery />
        </div>
      </div>
    </div>
  );
};

// Wrapping the HomePage component with both SessionProvider and ReduxProvider
export default function PageWrapper() {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <HomePage />
        {/* Global Toast Container */}
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ReduxProvider>
    </SessionProvider>
  );
}
