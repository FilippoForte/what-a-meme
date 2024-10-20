import React from 'react';
import { Container, Row, Col, Image, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./GameLayout.css"

// The GameDetails component displays the details of each round in a game.
const GameDetails = (props) => {
    const roundsData = props.lastGame
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            {/* Heading for the game details page */}
            <h2 className="mb-4 text-center">Game Details</h2>
            <Row className="mb-4">
                <Col className="d-flex justify-content-center">
                    {/* Button to navigate back to the home page */}
                    <Button onClick={() => navigate('/')} variant="primary">Back to Home</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {roundsData.filter(round => round.guessed === true).length === 0 ? (
                    <Alert variant="warning" className="text-center">
                        <p>You didn't win any round. Try again!!</p>
                    </Alert>
                ) : (
                    <GameRecap roundsData={roundsData} />
                )}
            </Row>
        </Container>
    );

};


export function GameRecap(props) {
    return (
        <>
            {/* Loop through the roundsData to display details of each round */}
            {props.roundsData && props.roundsData.filter(round => round.guessed == true).map((round, index) => (
                <Col xs={12} md={6} lg={4} key={index} className="mb-4">
                    <Card>
                        {/* Display the meme image for the round */}
                        <Image src={`http://localhost:3001/meme${round.memeId}.png`} rounded className="meme-image" />
                        <Card.Body>
                            {/* Display whether the guess was correct or incorrect */}
                            <Card.Title>{round.guessed ? 'Correct' : 'Incorrect'}</Card.Title>
                            {/* Display the Meme ID */}
                            <Card.Text>
                                Your Answer: {round.answer}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </>
    )
}

export default GameDetails;
