import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SocialNetworks from "./SocialNetworks";
import { Link } from "react-router-dom";
import ContactData from "./ContactData";

interface FooterProps {
}

interface FooterState {
}

class Footer extends React.Component<FooterProps, FooterState> {
    public state: FooterState = {
    };

    public constructor(props: FooterProps | Readonly<FooterProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Container fluid className="small bg-primary text-light p-4" as="footer">
                <Row>
                    <Col md={8}>
                        <Row>
                            <Col sm={6} className="px-2 py-3 text-center" id="contact-data">
                                <ContactData />
                            </Col>
                            <Col sm={6} className="px-2 py-3 text-center">
                                <p className="lead fw-bold">Menú</p>
                                <Container fluid className="d-flex flex-column">
                                    <Link to="/about" className="link-light link-footer d-block py-1">Quiénes somos</Link>
                                    <div className="clickable link-light link-footer d-block py-1">Política de privacidad</div>
                                </Container>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} className="px-2 py-3 text-center">
                        <SocialNetworks />
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-4 text-center">
                        Diseño y desarrollo: Eric Ceballos Alcantarilla<br />
                        Share and Save &copy; 2023. Todos los derechos reservados.
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Footer;
