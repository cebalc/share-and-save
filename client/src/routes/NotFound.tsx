import React from "react";
import Container from "react-bootstrap/Container";
import NotFoundImg from "../images/not-found.jpg";

interface NotFoundProps {
}

interface NotFoundState {
}

class NotFound extends React.Component<NotFoundProps, NotFoundState> {
    public state: NotFoundState = {
    };

    public constructor(props: NotFoundProps | Readonly<NotFoundProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <>
            <h1 className="text-center">Página no encontrada</h1>
            <Container fluid="sm" className="w-75 d-flex justify-content-center">
                <img alt="No encontrado" src={NotFoundImg} className="m-3 d-block mx-auto img-fluid" />
            </Container>
            </>
        );
    }
}

export default NotFound;
