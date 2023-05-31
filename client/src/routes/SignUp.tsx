import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"
import SignUpFetcher, { SignUpResponse } from "../objects/fetchers/SignUpFetcher";
import { Navigate } from "react-router-dom";

interface SignUpProps {
    onSignUp: () => Promise<void>
}

interface SignUpState {
    name: string,
    nameError: string,
    surname: string,
    surnameError: string,
    email: string,
    emailError: string
    pass: string,
    passError: string,
    formError: string,
    signedUp: boolean
}

class SignUp extends React.Component<SignUpProps, SignUpState> {

    public state: SignUpState = {
        name: "",
        nameError: "",
        surname: "",
        surnameError: "",
        email: "",
        emailError: "",
        pass: "",
        passError: "",
        formError: "",
        signedUp: false
    }

    public constructor(props: SignUpProps | Readonly<SignUpProps>) {
        super(props);
    }

    private redirectIfSignedUp(): React.ReactNode {
        if(this.state.signedUp) {
            return (<Navigate to="/dashboard" />);
        }
    }

    private showFormError(): React.ReactNode {
        if(this.state.formError.length > 0) {
            return (<Alert variant="danger">{this.state.formError}</Alert>);
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="max-width-50nbp-sm mx-auto">
                {this.redirectIfSignedUp()}
                <p className="h1 text-center mb-4">Registro de nuevo usuario</p>
                {this.showFormError()}
                <Form>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Tu nombre" onChange={event => this.setState({name: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.nameError}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="surname">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control type="text" placeholder="Tus apellidos" onChange={event => this.setState({surname: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.surnameError}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email" placeholder="tucorreo@servidor.com" onChange={event => this.setState({email: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" onChange={event => this.setState({pass: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.passError}</Form.Text>
                    </Form.Group>
                    <Button variant="outline-primary" onClick={() => this.sendUserData()}>Enviar</Button>
                </Form>
            </div>
        );
    }

    private async sendUserData(): Promise<void> {
        let fetcher: SignUpFetcher = new SignUpFetcher(
            this.state.name,
            this.state.surname,
            this.state.email,
            this.state.pass
        );
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData: SignUpResponse = fetcher.getResponseData();
        if(fetcher.success()) {
            await this.props.onSignUp();
        }
        this.setState({
            nameError: responseData.name,
            surnameError: responseData.surname,
            emailError: responseData.email,
            passError: responseData.pass,
            formError: responseData.global,
            signedUp: fetcher.success()
        });
    }
}

export default SignUp;