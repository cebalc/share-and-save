import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Workspace from "../objects/entities/Workspace";
import {LinkContainer} from "react-router-bootstrap";
import Stack from "react-bootstrap/Stack";
import PersistWorkspaceFetcher, {PersistWorkspaceResponse} from "../objects/fetchers/PersistWorkspaceFetcher";
import Alert from "react-bootstrap/Alert";

interface WorkspaceDetailsFormProps {
    workspace: Workspace
    onPersistData: (savedWorkspaceId: number) => void
}

interface WorkspaceDetailsFormState {
    name: string,
    nameError: string,
    description: string,
    descriptionError: string,
    formError: string
}

class WorkspaceDetailsForm extends React.Component<WorkspaceDetailsFormProps, WorkspaceDetailsFormState> {
    public state: WorkspaceDetailsFormState = {
        name: this.props.workspace.name,
        nameError: "",
        description: this.props.workspace.description,
        descriptionError: "",
        formError: ""
    }

    public constructor(props: WorkspaceDetailsFormProps | Readonly<WorkspaceDetailsFormProps>) {
        super(props);
    }

    private async sendWorkspaceData(): Promise<void> {
        let persistFetcher: PersistWorkspaceFetcher = new PersistWorkspaceFetcher(
            this.props.workspace.id,
            this.state.name,
            this.state.description
        );
        if(!await persistFetcher.retrieveData()) {
            return;
        }
        let responseData: PersistWorkspaceResponse = persistFetcher.getResponseData();
        this.setState({
            nameError: responseData.name,
            descriptionError: responseData.description,
            formError: responseData.global
        });
        if(persistFetcher.success()) {
            this.props.onPersistData(responseData.id);
        }
    }

    private buildReturnURL(): string {
        if(this.props.workspace === Workspace.NULL) {
            return "/dashboard";
        } else {
            return `/workspace/${this.props.workspace.id}`;
        }
    }

    private showFormError(): React.ReactNode {
        if(this.state.formError.length > 0) {
            return (<Alert variant="danger">{this.state.formError}</Alert>);
        }
    }

    public render(): React.ReactNode {
        return (
            <Form className="max-width-75nbp-md mx-auto">
                {this.showFormError()}
                <Form.Group className="mb-3" controlId="wsname">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="text"
                                  placeholder="Nombre del espacio de trabajo"
                                  defaultValue={this.props.workspace.name}
                                  onChange={event => this.setState({name: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.nameError}</Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="wsdescription">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control type="text"
                                  placeholder="Descripción del espacio de trabajo"
                                  defaultValue={this.props.workspace.description}
                                  onChange={event => this.setState({description: event.target.value})} />
                    <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                </Form.Group>
                <Stack direction="horizontal" gap={3}>
                    <Button variant="outline-primary" onClick={() => this.sendWorkspaceData()}>Enviar</Button>
                    <LinkContainer to={this.buildReturnURL()}>
                        <Button variant="outline-primary">Volver</Button>
                    </LinkContainer>
                </Stack>
            </Form>
        );
    }
}

export default WorkspaceDetailsForm;
