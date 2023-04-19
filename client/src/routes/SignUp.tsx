import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface SignUpProps {
}

interface Field {
    value?: string,
    error?: boolean,
    errorMsg?: string
}

interface SignUpState {
    name?: Field,
    surname?: Field,
    email?: Field,
    pass?: Field,
    formError?: string
}

class SignUp extends React.Component<SignUpProps, SignUpState> {
    private static HELP_NAME: string = "Máximo 25 caracteres, sin símbolos";
    private static HELP_SURNAME: string = "Máximo 50 caracteres, sin símbolos";
    private static HELP_EMAIL: string = "Máximo 50 caracteres";
    private static HELP_EMAIL_EXISTS: string = "El email introducido ya existe. Escoge otro.";
    private static HELP_PASS: string = "Características por definir";
    private static USER_NOT_CREATED: string = "El usuario no ha podido crearse";

    public state: SignUpState = {
        name: {
            value: "",
            error: false,
            errorMsg: SignUp.HELP_NAME
        },
        surname: {
            value: "",
            error: false,
            errorMsg: SignUp.HELP_SURNAME
        },
        email: {
            value: "",
            error: false,
            errorMsg: SignUp.HELP_EMAIL
        },
        pass: {
            value: "",
            error: false,
            errorMsg: SignUp.HELP_PASS
        },
        formError: ""
    }

    public constructor(props: SignUpProps | Readonly<SignUpProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <>
            <div>Rellena el siguiente formulario para crear una cuenta de usuario gratuita en Share and Save.</div>
            <div className="text-danger">{this.state.formError && this.state.formError.length > 0 ? this.state.formError : ""}</div>
            <Form>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Tu nombre" onChange={event => this.setState({name: {value: event.target.value}})} />
                    <Form.Text className="text-danger">{this.state.name && this.state.name.error ? this.state.name.errorMsg : ""}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="surname">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control type="text" placeholder="Tus apellidos" onChange={event => this.setState({surname: {value: event.target.value}})} />
                    <Form.Text className="text-danger">{this.state.surname && this.state.surname.error ? this.state.surname.errorMsg : ""}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" placeholder="tucorreo@servidor.com" onChange={event => this.setState({email: {value: event.target.value}})} />
                    <Form.Text className="text-danger">{this.state.email && this.state.email.error ? this.state.email.errorMsg : ""}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" onChange={event => this.setState({pass: {value: event.target.value}})} />
                    <Form.Text className="text-danger">{this.state.pass && this.state.pass.error ? this.state.pass.errorMsg : ""}</Form.Text>
                </Form.Group>
                <Button variant="success" onClick={() => this.sendUserData()}>Enviar</Button>
            </Form>
            </>
        );
    }

    private resetErrors(): void {
        this.setState({
            name: {error: false},
            surname: {error: false},
            email: {error: false},
            pass: {error: false},
            formError: ""
        });
    }

    private async sendUserData(): Promise<void> {
        let requestInit: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state),
            credentials: "include"
        };
        try {
            let response = await fetch("/users/create", requestInit);
            if (!response.ok) {
                throw new Error("Error al enviar los datos al servidor");
            }
            let jsonResponse = await response.json();
            this.resetErrors();
            if(jsonResponse.response === "emailExists") {
                this.setState({email: {error: true, errorMsg: SignUp.HELP_EMAIL_EXISTS}});
                return;
            }
            if(jsonResponse.response === "userNotCreated") {
                this.setState({formError: SignUp.USER_NOT_CREATED});
                return;
            }
            if(jsonResponse.response === "userCreated") {
                console.log(`El usuario se ha creado correctamente (id = ${jsonResponse.data})`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

export default SignUp;