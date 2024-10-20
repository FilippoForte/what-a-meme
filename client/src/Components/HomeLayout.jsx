import React from 'react';
import { Container, Row, Button, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomeLayout.css'; 

export function HomeLayout() {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column align-items-center text-center mt-5">
            <Row className="mb-4">
                <Col>
                    <h1>Welcome to Meme Quiz!</h1>
                </Col>
            </Row>
            
            {/* Instructions Section */}
            <Row className="mb-4">
                <Col md={8} className="mx-auto">
                    <p>
                        Test your knowledge and guess the correct captions for the memes.
                        Click "Start New Game" to begin your adventure. Good luck and have fun!
                    </p>
                </Col>
            </Row>
            
            {/* Start New Game Button */}
            <Row className="mb-4">
                <Col className="d-flex justify-content-center">
                    <Button 
                        onClick={() => navigate('/game')} 
                        className="btn btn-primary"
                    >
                        Start New Game
                    </Button>
                </Col>
            </Row>
            
            {/* Meme Image */}
            <Row>
                <Col>
                    <Image src="http://localhost:3001/homeImage.jpg" rounded className="meme-image" />
                </Col>
            </Row>
        </Container>
    );
}

export default HomeLayout;
