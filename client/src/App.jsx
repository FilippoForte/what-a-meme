import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap/';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import API from './API.mjs';
import Header from './Components/Header';
import LoginForm from './Components/LoginForm';
import UserProfile from './Components/UserProfile';
import GameLayout from './Components/GameLayout';
import HomeLayout from './Components/HomeLayout';
import GameDetails from './Components/GameDetails';

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [lastGame, setLastGame] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial render
  useEffect(() => {
    API.getUserInfo()
      .then(user => {
        setLoggedIn(true);
        setUser(user);
      })
      .catch(error => {
        setLoggedIn(false);
        setUser(null);
      });
  }, []);

  // Handle user login
  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user);
    setLoggedIn(true);
    navigate('/profile'); // Redirect to profile page after successful login
  };

  // Handle user logout
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <>
      {/* Header component with logout button and login status */}
      <Header logOut={handleLogout} loggedIn={loggedIn} />

      {/* Main content container with routing */}
      <Container>
        <Routes>
          <Route path='/' element={<HomeLayout loggedIn={loggedIn} user={user} />} />
          <Route path='/game' element={<GameLayout loggedIn={loggedIn} user={user} setLastGame={setLastGame} />} />
          <Route path="/game-details" element={<GameDetails lastGame={lastGame} />} />
          <Route path="/profile" element={ loggedIn ? <UserProfile user={user} /> : <Navigate replace to='/login' /> } />
          <Route path="/login" element={ loggedIn ? <Navigate replace to='/profile' /> : <LoginForm handleLogin={handleLogin} /> } />
          <Route path="*" element={<NotFoundLayout />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;


// Component for displaying not found page layout
export function NotFoundLayout() {
  return (
      <>
          <Row><Col><h2>Error: page not found!</h2></Col></Row>
          <Row><Col><img src="http://localhost:3001/404_not_found.png" alt="page not found" className="my-3" style={{ display: 'block' }} /></Col></Row>
          <Row><Col><Link to="/" className="btn btn-primary mt-2 my-5">Go Home!</Link></Col></Row>
      </>
  );
}
