import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

interface WorkspaceDetailsFormProps {

}

interface WorkspaceDetailsFormState {
    name: string,
    nameError: string,
    description: string,
    descriptionError: string,
    formError: string,
    workspaceId: number
}

class WorkspaceDetailsForm extends React.Component<WorkspaceDetailsFormProps, WorkspaceDetailsFormState> {
    public state: WorkspaceDetailsFormState = {
        name: "",
        nameError: "",
        description: "",
        descriptionError: "",
        formError: "",
        workspaceId: 0
    }

    public constructor(props: WorkspaceDetailsFormProps | Readonly<WorkspaceDetailsFormProps>) {
        super(props);
    }

    private async sendWorkspaceData(): Promise<void> {

    }

    public render(): React.ReactNode {
        return (
            <Container fluid>
                <p className="h5 fw-bold">Editar detalles de espacio</p>
                <Form>
                    <Form.Group className="mb-3" controlId="wsname">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" placeholder="Nombre del espacio de trabajo" onChange={event => this.setState({name: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.nameError}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="wsdescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control type="text" placeholder="Descripción del espacio de trabajo" onChange={event => this.setState({description: event.target.value})} />
                        <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                    </Form.Group>
                    <Button variant="outline-primary" onClick={async () => await this.sendWorkspaceData()}>Enviar</Button>
                </Form>
            </Container>
        );
    }
}

export default WorkspaceDetailsForm;
