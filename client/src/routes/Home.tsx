import React from "react";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SignOutFetcher from "../objects/fetchers/SignOutFetcher";
import CoupleAccounts from "../images/home-couple-accounts.jpg";
import SaveMoney from "../images/save-money.jpg";
import LogoSnS from "../images/logo_SnS.png";

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
            return (
                <Row>
                    <Col className="text-center">
                        <Alert variant="success">Sesión cerrada correctamente</Alert>
                    </Col>
                </Row>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <>
            {this.renderSignOutAlert()}
            <Row className="my-4">
                <Col className="text-center">
                    <p className="h1">Share and Save</p>
                    <img src={LogoSnS} alt="S&S" className="d-block mx-auto" />
                    <p className="h5">Compartir experiencias nunca fue tan divertido</p>
                </Col>
            </Row>
            <Row>
                <Col sm={6} className="my-3">
                    <img src={CoupleAccounts} alt="Save money" className="img-fluid mx-auto rounded-4" />
                </Col>
                <Col sm={6} className="my-3 text-justify">
                    Un lugar donde tú, tus amigos y tu familia podéis guardar vuestros gastos diarios y realizar las cuentas como queráis.
                </Col>
            </Row>
            </>
        );
    }
}

export default Home;
