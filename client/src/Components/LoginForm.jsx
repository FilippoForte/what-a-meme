import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GameLayout.css'; // External CSS for additional styling
import { useNavigate } from 'react-router-dom';

const LoginForm = (props) => {
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for displaying login errors

    const navigate = useNavigate(); // Hook from react-router-dom for navigation

    // Handles form submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents default form submission behavior

        // Creates credentials object from state
        const credentials = { username, password };

        // Calls handleLogin function passed as prop
        props.handleLogin(credentials)
            .then(() => navigate("/")) // Navigates to home page after successful login
            .catch((err) => {
                if (err.message === "Unauthorized")
                    setError("Invalid username and/or password"); // Sets error message for unauthorized login attempt
                else
                    setError(err.message); // Sets error message for other errors
            });
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} lg={4}>
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>} {/* Displays error alert if error state is not empty */}
                    <Form onSubmit={handleSubmit}>
                        {/* Username input field */}
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={username}
                                required
                                onChange={(e) => setUsername(e.target.value)} // Updates username state on input change
                            />
                        </Form.Group>

                        {/* Password input field */}
                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)} // Updates password state on input change
                            />
                        </Form.Group>

                        {/* Submit button for form */}
                        <Button variant="primary" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
