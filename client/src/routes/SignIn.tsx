import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import SignInFetcher from "../objects/fetchers/users/SignInFetcher";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import RestorePasswordForm from "../components/users/RestorePasswordForm";
import OptionalTextAlert from "../components/misc/OptionalTextAlert";

interface SignInProps {
    onSignIn: () => Promise<void>
}

interface SignInState {
    email: string,
    pass: string,
    errors: string[],
    signedIn: boolean
}

class SignIn extends React.Component<SignInProps, SignInState> {
    public state: SignInState = {
        email: "",
        pass: "",
        errors: [],
        signedIn: false
    }

    private readonly restorePasswordForm: React.RefObject<RestorePasswordForm>;
    private readonly alertRestored: React.RefObject<OptionalTextAlert>;

    public constructor(props: SignInProps | Readonly<SignInProps>) {
        super(props);
        this.restorePasswordForm = React.createRef();
        this.alertRestored = React.createRef();
    }

    private showRestorePasswordForm(): void {
        this.restorePasswordForm.current?.setState({show: true});
    }

    private redirectIfSignedIn(): React.ReactNode {
        if(this.state.signedIn) {
            return (<Navigate to="/dashboard" />);
        }
    }

    private showAlertRestored(): void {
        this.alertRestored.current?.setState({show: true});
    }

    public render(): React.ReactNode {
        return (
            <div className="max-width-50nbp-sm mx-auto">
                <p className="h1 text-center mb-4">Iniciar sesión</p>
                <Form>
                    {this.redirectIfSignedIn()}
                    <OptionalTextAlert ref={this.alertRestored} variant="info" dismissible
                           text="Formulario enviado. Revisa tu buzón de correo electrónico" />
                    {this.state.errors.map((error: string, index: number) =>
                        <Alert key={index} variant="danger">{error}</Alert>
                    )}
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email" placeholder="tucorreo@servidor.com" onChange={event => this.setState({email: event.target.value})} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password"
                                      onChange={event => this.setState({pass: event.target.value})}
                                      onKeyDown={event => {
                                          if(event.key === "Enter") {
                                              event.preventDefault();
                                              this.checkUserData();
                                          }
                                      }} />
                    </Form.Group>
                    <Container fluid className="mx-auto mt-4 d-flex flex-row justify-content-center">
                        <Button variant="outline-primary" className="me-3" onClick={() => this.checkUserData()}>
                            Enviar
                        </Button>
                        <Button variant="outline-danger" onClick={() => this.showRestorePasswordForm()}>
                            Olvidé la contraseña
                        </Button>
                    </Container>
                </Form>
                <RestorePasswordForm ref={this.restorePasswordForm} onFormSubmitted={this.showAlertRestored.bind(this)} />
            </div>

        );
    }

    private async checkUserData(): Promise<void> {
        let fetcher: SignInFetcher = new SignInFetcher(this.state.email, this.state.pass);
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData: string[] = fetcher.getResponseData();
        if(fetcher.success()) {
            await this.props.onSignIn();
        }
        this.setState({errors: responseData, signedIn: fetcher.success()});
    }
}

export default SignIn;