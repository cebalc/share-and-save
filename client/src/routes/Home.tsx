import React from "react";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import SignOutFetcher from "../objects/fetchers/SignOutFetcher";
import CoupleAccounts from "../images/home-couple-accounts.jpg";
import SaveMoney from "../images/save-money.jpg";
import LogoSnS from "../images/logo_SnS.png";

interface HomeProps {
    signOut?: boolean
    onSignOut?: () => Promise<void>
}

interface HomeState {
    signedOut: boolean,
    previousUserName: string
}

class Home extends React.Component<HomeProps, HomeState> {

    static defaultProps = {
        signOut: false,
        onSignOut: () => true
    }

    public state: HomeState = {
        signedOut: false,
        previousUserName: ""
    }

    public constructor(props: HomeProps | Readonly<HomeProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        if(this.props.signOut) {
            let signOutFetcher: SignOutFetcher = new SignOutFetcher();
            if(!await signOutFetcher.retrieveData()) {
                return;
            }
            if(signOutFetcher.success() && this.props.onSignOut !== undefined) {
                await this.props.onSignOut();
            }
            this.setState({
                signedOut: true,
                previousUserName: signOutFetcher.getResponseData()
            });
        }
    }

    private renderSignOutAlert(): React.ReactNode {
        if(this.props.signOut) {
            let userExisted: boolean = (this.state.previousUserName.length > 0);
            return (
                <Container fluid>
                    {this.state.signedOut &&
                        (userExisted ?
                            <Alert variant="success">Tu sesión se ha cerrado correctamente, {this.state.previousUserName}</Alert>
                            :
                            <Alert variant="info">No había ninguna sesión iniciada</Alert>
                        )
                    }
                </Container>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <>
            {this.renderSignOutAlert()}
            <Container className="my-3">
                <Col className="text-center d-flex flex-column align-items-middle">
                    <p className="h1">Share and Save</p>
                    <img src={LogoSnS} alt="S&S" className="d-block mx-auto" />
                    <p className="h5">Compartir experiencias nunca fue tan divertido</p>
                </Col>
            </Container>
            <div className="mx-auto max-width-75nbp-md">
                <Row>
                    <Col sm={5} className="my-4">
                        <img src={CoupleAccounts} alt="Familia y amigos compartiendo gastos" className="img-fluid mx-auto rounded-4" />
                    </Col>
                    <Col sm={7} className="my-4 lead text-justify">
                        Un lugar donde amigos y familia podéis guardar vuestros gastos diarios y realizar vuestras cuentas de forma cómoda, rápida y sencilla.
                    </Col>
                </Row>
                <Row className="flex-sm-row-reverse">
                    <Col sm={5} className="my-4">
                        <img src={SaveMoney} alt="Ahorra dinero" className="img-fluid mx-auto rounded-4" />
                    </Col>
                    <Col sm={7} className="my-4 lead text-justify">
                        Texto
                    </Col>
                </Row>
            </div>
            </>
        );
    }
}

export default Home;
