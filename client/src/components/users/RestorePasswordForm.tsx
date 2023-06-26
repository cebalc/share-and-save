import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import RestorePasswordFetcher, {
    RestorePasswordResponse
} from "../../objects/fetchers/workspaces/users/RestorePasswordFetcher";

interface RestorePasswordFormProps {
    onFormSubmitted: () => void
}

interface RestorePasswordFormState {
    fetching: boolean,
    show: boolean,
    email: string,
    emailError: string,
    formError: string
}

class RestorePasswordForm extends React.Component<RestorePasswordFormProps, RestorePasswordFormState> {

    public state: RestorePasswordFormState = {
        fetching: false,
        show: false,
        email: "",
        emailError: "",
        formError: ""
    };


    public constructor(props: Readonly<RestorePasswordFormProps> | RestorePasswordFormProps) {
        super(props);
    }

    private hideModal(): void {
        this.setState({show: false});
    }

    private async restorePassword(): Promise<void> {
        this.setState({fetching: true});
        await this.processRestoreRequest();
    }

    private async processRestoreRequest(): Promise<void> {
        let fetcher: RestorePasswordFetcher = new RestorePasswordFetcher(this.state.email);
        if(!await fetcher.retrieveData()) {
            this.setState({
                fetching: false,
                formError: "Error en la conexión al servidor"
            });
            return;
        }
        let responseData: RestorePasswordResponse = fetcher.getResponseData();
        if(fetcher.success()) {
            this.props.onFormSubmitted();
        }
        this.setState({
            fetching: false,
            show: !fetcher.success(),
            emailError: responseData.email,
            formError: responseData.global
        });
    }

    public render(): React.ReactNode {
        return (
            <Modal show={this.state.show} onHide={() => this.hideModal()} backdrop="static" keyboard={false}>
                <Modal.Header closeButton={!this.state.fetching}>
                    <Modal.Title>Restablecer contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Introduce tu dirección de email. Si está registrado en nuestro sistema
                        te enviaremos un email con instrucciones para restablecer tu contraseña.
                    </p>
                    <Form>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Control type="email" placeholder="tucorreo@servidor.com"
                                          onChange={event => this.setState({email: event.target.value})} />
                            <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-success" disabled={this.state.fetching}
                            onClick={() => this.restorePassword()}>Restablecer</Button>
                    <Button variant="outline-primary" disabled={this.state.fetching}
                            onClick={() => this.hideModal()}>Volver</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RestorePasswordForm;
