import React, { useEffect, useState } from 'react';
import { Container, Row, Image, Button, Card, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import API from '../API.mjs';
import Timer from './Timer.jsx';
import "./GameLayout.css";

export default function GameLayout(props) {
    const [round, setRound] = useState(1);
    const [status, setStatus] = useState("running");
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [points, setPoints] = useState(0);
    const [roundsData, setRoundsData] = useState([]);
    const [answerSelected, setAnswerSelected] = useState(false);
    const [memes, setMemes] = useState([]);
    const [currentMemeIndex, setCurrentMemeIndex] = useState(0);

    const maxRounds = props.loggedIn ? 3 : 1;

    // Fetch memes based on maxRounds and update state
    useEffect(() => {
        API.getMemes(maxRounds)
            .then(setMemes)
            .catch(console.error);
    }, [props.loggedIn, maxRounds]);

    // Save roundsData when game ends and update last game data if logged in
    useEffect(() => {
        if (round >= maxRounds && (status === "lost" || status === "win")) {
            if (props.loggedIn) {
                API.saveRounds(roundsData, props.user.id)
                    .catch(console.error);
            }
            props.setLastGame(roundsData)
        }
    }, [round, status, props.loggedIn, roundsData, maxRounds]);

    // Handle user's answer selection
    const handleAnswer = async (captionId, captionText) => {
        setAnswerSelected(true);
        try {
            const result = await API.checkAnswer(memes[currentMemeIndex].id, captionId);
            const roundData = { memeId: memes[currentMemeIndex].id, guessed: result.correct, answer: captionText };
            setRoundsData(prev => [...prev, roundData]);

            if (result.correct) {
                setPoints(prev => prev + 5);
                setStatus("win");
            } else {
                setStatus("lost");
                const answers = await API.getAnswers(memes[currentMemeIndex].id);
                setCorrectAnswers(answers);
            }

        } catch (error) {
            console.error("Error checking answer:", error);
        }
    };

    // Handle when time is up for a round
    const handleTimeUp = async () => {
        const roundData = { memeId: memes[currentMemeIndex].id, guessed: false };
        setRoundsData(prev => [...prev, roundData]);
        setAnswerSelected(true);
        try {
            const answers = await API.getAnswers(memes[currentMemeIndex].id);
            setCorrectAnswers(answers);
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

    // Start a new round, updating game state and data
    const startNewRound = () => {
        if (round < maxRounds) {
            if (!answerSelected) {
                const roundData = { memeId: memes[currentMemeIndex].id, guessed: false };
                setRoundsData(prev => [...prev, roundData]);
            }
            setCurrentMemeIndex(prev => prev + 1);
            setRound(prev => prev + 1);
            setStatus("running");
            setCorrectAnswers([]);
            setAnswerSelected(false);
        } else {
            setStatus("gameOver");
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center text-center mt-5">
            <Row className="w-100 mb-4">

                <GameManagement points={points} round={round} status={status} maxRounds={maxRounds} startNewRound={startNewRound} loggedIn={props.loggedIn} />

                <MemeCard memes={memes} currentMemeIndex={currentMemeIndex} />

                <GameStatus status={status} setStatus={setStatus} memes={memes} currentMemeIndex={currentMemeIndex} handleTimeUp={handleTimeUp} correctAnswers={correctAnswers} />

            </Row>

            {/* Display answer buttons for user selection */}
            <AnswerButtons status={status} memes={memes} currentMemeIndex={currentMemeIndex} handleAnswer={handleAnswer} />
        </Container>
    );
}

/* Display points and current round */
export function GameManagement(props) {
    const navigate = useNavigate();

    return (
        <Col xs={12} md={4} className="d-flex flex-column justify-content-center align-items-center mb-4">
            <div className="mb-2 info-message">Points: {props.points}</div>
            <div className="mb-2 info-message">Round: {props.round}</div>

            {/* Display next round or game details button based on game status */}
            {props.status === "win" || props.status === "lost" ? (
                props.round < props.maxRounds ? (
                    <Button onClick={props.startNewRound} className="btn btn-primary">Next Round</Button>
                ) : (
                    props.loggedIn ? (
                        <Button onClick={() => navigate('/game-details')} className="btn btn-primary">See Game Details</Button>
                    ) : (
                        <Button onClick={() => navigate('/')} variant="primary">Back to Home</Button>
                    )
                )
            ) : null}
        </Col>
    );
}

/* Display current meme image */
export function MemeCard(props) {
    return (
        <Col xs={12} md={4} className="d-flex justify-content-center mb-4">
            <Card>
                {props.memes[props.currentMemeIndex] && <Image src={`http://localhost:3001/${props.memes[props.currentMemeIndex].image}`} rounded className="meme-image" />}
            </Card>
        </Col>
    )
}

/* Display game status and timer */
export function GameStatus(props) {
    return (
        <Col xs={12} md={4} className="d-flex flex-column justify-content-center align-items-center">
            {["running", "finish", "newGame"].includes(props.status) && <Timer setStatus={props.setStatus} status={props.status} meme={props.memes[props.currentMemeIndex]} onTimeUp={props.handleTimeUp} />}
            {props.status === "win" && <div className="alert alert-success">You Won!</div>}
            {props.status === "lost" && (
                <div className="alert alert-danger">
                    You Lost!
                    <div>Correct Answers:</div>
                    <ul>
                        {/* Display correct answers for the current meme */}
                        {props.correctAnswers.map((answer, index) => (
                            <li key={index}>{answer.text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Col>
    );
}

// Component to render answer selection buttons
export function AnswerButtons(props) {
    return (
        <Row className="d-flex justify-content-center w-100 flex-wrap">
            {/* Render answer buttons if game status is 'running' */}
            {props.status === "running" && props.memes[props.currentMemeIndex] && props.memes[props.currentMemeIndex].captions.map((caption, index) => (
                <Button
                    key={index}
                    variant="outline-primary"
                    className="caption-button mx-2 mb-2"
                    onClick={() => props.handleAnswer(caption.id, caption.text)}
                >
                    {caption.text}
                </Button>
            ))}
        </Row>
    );
}
