import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import User from "../../objects/entities/User";
import Alert from "react-bootstrap/Alert";
import {LinkContainer} from "react-router-bootstrap";
import Container from "react-bootstrap/Container";
import PersistUserFetcher, {PersistUserResponse} from "../../objects/fetchers/users/PersistUserFetcher";

interface UserDataFormProps {
    user: User,
    onPersistData: () => Promise<void>
}

interface UserDataFormState {
    name: string,
    nameError: string,
    surname: string,
    surnameError: string,
    email: string,
    emailError: string
    oldPass: string,
    oldPassError: string,
    pass: string,
    passError: string,
    checkPass: string,
    checkPassError: string,
    formError: string
}

class UserDataForm extends React.Component<UserDataFormProps, UserDataFormState> {
    public state: UserDataFormState = {
        name: this.props.user.name,
        nameError: "",
        surname: this.props.user.surname,
        surnameError: "",
        email: this.props.user.email,
        emailError: "",
        oldPass: "",
        oldPassError: "",
        pass: "",
        passError: "",
        checkPass: "",
        checkPassError: "",
        formError: ""
    }

    public constructor(props: UserDataFormProps | Readonly<UserDataFormProps>) {
        super(props);
    }

    private renderFormError(): React.ReactNode {
        if(this.state.formError.length > 0) {
            return (<Alert variant="danger">{this.state.formError}</Alert>);
        }
    }

    private renderOldPasswordField(): React.ReactNode {
        if(this.props.user !== User.GUEST) {
            return (
                <Form.Group className="mb-3" controlId="oldpass">
                    <Form.Label>Contraseña actual</Form.Label>
                    <Form.Control type="password" onChange={event => this.setState({oldPass: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.oldPassError}</Form.Text>
                </Form.Group>
            );
        }
    }

    private buildReturnURL(): string {
        let url: string = "/";
        if(this.props.user !== User.GUEST) {
            url += "dashboard";
        }
        return url;
    }

    private async sendUserData(): Promise<void> {
        let persistFetcher: PersistUserFetcher = new PersistUserFetcher(
            this.props.user.id,
            this.state.name,
            this.state.surname,
            this.state.email,
            this.state.pass,
            this.state.oldPass
        );
        if(!await persistFetcher.retrieveData()) {
            return;
        }
        let responseData: PersistUserResponse = persistFetcher.getResponseData();
        if(persistFetcher.success()) {
            await this.props.onPersistData();
        }
        this.setState({
            nameError: responseData.name,
            surnameError: responseData.surname,
            emailError: responseData.email,
            passError: responseData.pass,
            oldPassError: responseData.oldPass,
            checkPassError: "",
            formError: responseData.global
        });
    }

    private async validateForm(): Promise<void> {
        if(this.state.pass !== this.state.checkPass) {
            this.setState({checkPassError: "Las contraseñas no coinciden"});
            return;
        }
        await this.sendUserData();
    }

    public render(): React.ReactNode {
        return (
            <Form>
                {this.renderFormError()}
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text" placeholder="Tu nombre" defaultValue={this.props.user.name}
                              onChange={event => this.setState({name: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.nameError}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="surname">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control type="text" placeholder="Tus apellidos" defaultValue={this.props.user.surname}
                              onChange={event => this.setState({surname: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.surnameError}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type="email" placeholder="tucorreo@servidor.com" defaultValue={this.props.user.email}
                              onChange={event => this.setState({email: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                </Form.Group>
                {this.renderOldPasswordField()}
                <Form.Group className="mb-3" controlId="pass">
                    <Form.Label>{this.props.user !== User.GUEST && "Nueva "}Contraseña</Form.Label>
                    <Form.Control type="password" onChange={event => this.setState({pass: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.passError}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="checkpass">
                    <Form.Label>Repite Contraseña</Form.Label>
                    <Form.Control type="password" onChange={event => this.setState({checkPass: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.checkPassError}</Form.Text>
                </Form.Group>
                <Container fluid className="mx-auto mt-4 d-flex flex-row justify-content-center">
                    <Button variant="outline-primary" className="me-3" onClick={() => this.validateForm()}>Enviar</Button>
                    <LinkContainer to={this.buildReturnURL()}>
                        <Button variant="outline-primary">Volver</Button>
                    </LinkContainer>
                </Container>
            </Form>
        );
    }
}

export default UserDataForm;
