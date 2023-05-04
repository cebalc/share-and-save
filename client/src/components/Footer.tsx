import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SocialNetworks from "./SocialNetworks";

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
                                <p className="lead fw-bold">Datos de contacto</p>
                                <p>
                                    Share and Save SL<br />
                                    Calle del Ahorro 1<br />
                                    Valencia (España)<br />
                                    shareandsave.app@gmail.com<br />
                                    +34 961 234 567
                                </p>
                            </Col>
                            <Col sm={6} className="px-2 py-3 text-center">
                                Menú
                            </Col>
                        </Row>
                    </Col>
                    <Col md={4} className="px-2 py-3 text-center">
                        <SocialNetworks />
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-4 text-center">
                        Share and Save &copy; 2022. Todos los derechos reservados.
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Footer;
