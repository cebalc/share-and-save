import Container from "react-bootstrap/Container";
import React from "react";

const GeneralPlaceholder = (): JSX.Element => {
    return (
        <Container fluid>
            <p className="text-center">Recuperando información...</p>
        </Container>
    );
}

export default GeneralPlaceholder;
