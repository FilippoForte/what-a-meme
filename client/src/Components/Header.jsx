import { Button, Col, Container, Row } from "react-bootstrap/";
import { Link, useNavigate } from "react-router-dom";

function Header(props) {

    const navigate = useNavigate();

    return (
        <header className="py-1 py-md-3 border-bottom bg-primary">
            <Container fluid className="gap-3 align-items-center">
                <Row>
                    {/* Mobile menu button */}
                    <Col xs={3} className="d-md-none">
                        <Button>
                            <i className="bi bi-list" />
                        </Button>
                    </Col>

                    {/* Logo and site title */}
                    <Col xs={6} md={4}>
                        <Button variant="outline-light" onClick={() => navigate('/')}>
                            <i className="bi bi-collection-play me-2 flex-shrink-0"></i>
                            <span className="h5 mb-0">What a meme</span>
                        </Button>
                    </Col>

                    {/* Login/Profile buttons */}
                    <Col xs={5} md={8} className="d-flex align-items-center justify-content-end">
                        {props.loggedIn ? (
                            <>
                                <Button variant="outline-light" className="me-2" onClick={() => navigate('/profile')}>Profile</Button>
                                <Button variant="outline-light" onClick={props.logOut}>Logout</Button>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </header>
    );
}


export default Header;
