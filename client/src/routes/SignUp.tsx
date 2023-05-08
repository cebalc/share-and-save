import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert"
import SignUpFetcher from "../objects/fetchers/SignUpFetcher";
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
        } else {
            return (<></>);
        }
    }

    public render(): React.ReactNode {
        return (
            <>
            {this.redirectIfSignedUp()}
            <h1>Registro de nuevo usuario</h1>
            <div>Rellena el siguiente formulario para crear una cuenta de usuario gratuita en Share and Save.</div>
            {this.state.formError.length > 0 ?
                <Alert variant="danger">{this.state.formError}</Alert>
                :
                <></>
            }
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
                <Button variant="success" onClick={() => this.sendUserData()}>Enviar</Button>
            </Form>
            </>
        );
    }

    private async sendUserData(): Promise<void> {
        let fetcher: SignUpFetcher = new SignUpFetcher(
            this.state.name as string,
            this.state.surname as string,
            this.state.email as string,
            this.state.pass as string
        );
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData: any = fetcher.getResponseData();
        if(fetcher.success()) {
            await this.props.onSignUp();
        }
        this.setState({
            nameError: responseData.name !== undefined ? responseData.name : "",
            surnameError: responseData.surname !== undefined ? responseData.surname : "",
            emailError: responseData.email !== undefined ? responseData.email : "",
            passError: responseData.pass !== undefined ? responseData.pass : "",
            formError: responseData.global !== undefined ? responseData.global : "",
            signedUp: fetcher.success()
        });
    }
}

export default SignUp;