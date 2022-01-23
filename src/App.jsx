import './App.css';
import styles from './App.css';
import Intro from './Pages/Intro/Intro';
import Home from './Pages/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Topbar from './Components/Topbar/Topbar';
import { useState } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);

  setTimeout(() => {
    setIsReady(true);
  }, 4000);

  if (!isReady) {
    return <Intro />;
  }

  return (
    <>
      <Topbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
