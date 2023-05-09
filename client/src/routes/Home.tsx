import React from "react";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SignOutFetcher from "../objects/fetchers/SignOutFetcher";

interface HomeProps {
    signOut?: boolean
    onSignOut?: () => Promise<void>
}

interface HomeState {
}

class Home extends React.Component<HomeProps, HomeState> {

    private static defaultProps = {
        signOut: false,
        onSignOut: () => true
    }

    public state: HomeState = {
    }

    public constructor(props: HomeProps | Readonly<HomeProps>) {
        super(props);
        if(this.props.signOut) {
            new SignOutFetcher().retrieveData().then(() => {
                if(this.props.onSignOut !== undefined) {
                    this.props.onSignOut();
                }
            });
        }
    }

    private renderSignOutAlert(): React.ReactNode {
        if(this.props.signOut) {
            return (<Alert variant="success">Sesión cerrada correctamente</Alert>);
        }
    }

    public render(): React.ReactNode {
        return (
            <>
            <Row>
                <Col className="text-center">
                    {this.renderSignOutAlert()}
                    <p className="h1">Share and Save</p>
                    <p className="h5">Compartir experiencias nunca fue tan divertido</p>
                </Col>
            </Row>
            <Row>
                <Col md={6}>

                </Col>
                <Col md={6}>
                    
                </Col>
            </Row>
            </>
        );
    }
}

export default Home;
