import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import API from '../API.mjs';
import './UserProfile.css';

export function UserProfile(props) {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);

    // Effect to fetch user's game history when props.user.id changes
    useEffect(() => {
        API.getUserGames(props.user.id)
            .then(setGames)
            .catch(setError)

    }, [props.user.id]); // Dependency array for useEffect hook

    // Render error message if there is an error fetching data
    if (error) {
        return (
            <Col className="d-flex justify-content-center align-items-center">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Col>
        );
    }

    // Render login prompt if user is not logged in
    if (!props.user) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="warning">
                    User not logged in!
                    <Button variant="outline-light" onClick={() => navigate('/login')} className="mt-3">
                        Login
                    </Button>
                </Alert>
            </Container>
        );
    }

    // Render user profile and game history if user is logged in and no error occurred
    return (
        <Container className="d-flex flex-column align-items-center text-center mt-5">
            {/* User Profile Card */}
            <Row className="w-100 mb-4">
                <Col>
                    <Card className="user-card">
                        <Card.Body>
                            <Card.Title>Profile</Card.Title>
                            <Card.Text>Email: {props.user.username}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Game History Card */}
            <Row className="w-100 mb-4">
                <Col>
                    <Card className="games-card">
                        <Card.Body>
                            <Card.Title>Game History</Card.Title>
                            {games.length > 0 ? (<GameHistory games={games}/>) : (<Card.Text>No games played yet.</Card.Text>)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Link to navigate back to home page */}
            <Row>
                <Col>
                    <Link to="/" className="btn btn-primary mt-2">Back to Home</Link>
                </Col>
            </Row>
        </Container >
    );
}

// Render games if there are games in history
export function GameHistory(props) {
    return (
        <>{
            props.games.sort((a, b) => a.id-b.id).map((game, index) => (
                <Card key={index} className="mb-3">
                    <Card.Body>
                        <Card.Title>Game {index+1}</Card.Title>
                        <Card.Text>Total Points: {game.score}</Card.Text>
                        <Row>
                            {game.rounds.map((round, roundIndex) => (
                                <Col key={roundIndex} className="mb-3">
                                    {/* Display points earned per round and associated image */}
                                    <div>Round {roundIndex + 1}: {round.guessed ? 5 : 0} points</div>
                                    <Image src={`http://localhost:3001/${round.image}`} rounded className="game-image" />
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            ))
        }
        </>
    )
}

export default UserProfile;
