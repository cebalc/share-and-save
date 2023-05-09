import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import SignInFetcher from "../objects/fetchers/SignInFetcher";
import { Navigate } from "react-router-dom";

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

    public constructor(props: SignInProps | Readonly<SignInProps>) {
        super(props);
    }

    private redirectIfSignedIn(): React.ReactNode {
        if(this.state.signedIn) {
            return (<Navigate to="/dashboard" />);
        }
    }

    public render(): React.ReactNode {
        return (
            <Form>
                {this.redirectIfSignedIn()}
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
                            if(event.key == "Enter") {
                                event.preventDefault();
                                this.checkUserData();
                            }
                        }} />
                </Form.Group>
                <Button variant="success" onClick={() => this.checkUserData()}>Enviar</Button>
            </Form>
        );
    }

    private async checkUserData(): Promise<void> {
        let fetcher: SignInFetcher = new SignInFetcher(this.state.email, this.state.pass);
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData: string[] = fetcher.getResponseData();
        if(!fetcher.success()) {
            this.setState({errors: responseData});
        } else {
            await this.props.onSignIn();
            this.setState({errors: [], signedIn: true});
        }
    }
}

export default SignIn;