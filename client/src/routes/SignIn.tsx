import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import SignInFetcher from "../objects/fetchers/SignInFetcher";

interface SignInProps {
}

interface SignInState {
    email: string,
    pass: string,
    errors: string[]
}

class SignIn extends React.Component<SignInProps, SignInState> {
    public state: SignInState = {
        email: "",
        pass: "",
        errors: []
    }

    public constructor(props: SignInProps | Readonly<SignInProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Form>
                {this.state.errors.map((error: string, index: number) =>
                    <Alert key={index} variant="danger">{error}</Alert>
                )}
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" placeholder="tucorreo@servidor.com" onChange={event => this.setState({email: event.target.value})} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" onChange={event => this.setState({pass: event.target.value})} />
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
        let responseData: any = fetcher.getResponseData();
        if(!fetcher.success()) {
            this.setState({errors: responseData as string[]});
        } else {
            console.log(`Autenticación correcta (id = ${responseData as number})`);
            this.setState({errors: []});
        }
    }
}

export default SignIn;