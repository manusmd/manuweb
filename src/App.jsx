import './App.css';
import styles from './App.css';
import Intro from './Pages/Intro/Intro';
import Home from './Pages/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Topbar from './Components/Topbar/Topbar';
import { useEffect, useState } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 4000);
  }, []);
  if (sessionStorage.getItem('anm_played') !== '1' && !isReady) {
    return <Intro />;
  }
  sessionStorage.setItem('anm_played', '1');

  return (
    <>
      <Topbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/a" element={<Home />} />
        <Route exact path="/b" element={<Home />} />
        <Route exact path="/c" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
