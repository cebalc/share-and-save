import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
                    <Col className="pt-4 text-center">
                        Share and Save &copy; 2022. Todos los derechos reservados.
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Footer;
