import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import CreateWorkspaceFetcher, {CreateWorkspaceResponse} from "../objects/fetchers/CreateWorkspaceFetcher";

interface CreateWorkspaceProps {

}

interface CreateWorkspaceState {
    name: string,
    nameError: string,
    description: string,
    descriptionError: string,
    formError: string,
    workspaceId: number
}

class CreateWorkspace extends React.Component<CreateWorkspaceProps, CreateWorkspaceState> {
    public state: CreateWorkspaceState = {
        name: "",
        nameError: "",
        description: "",
        descriptionError: "",
        formError: "",
        workspaceId: 0
    };

    public constructor(props: CreateWorkspaceProps | Readonly<CreateWorkspaceProps>) {
        super(props);
    }

    private async sendWorkspaceData(): Promise<void> {
        let fetcher: CreateWorkspaceFetcher = new CreateWorkspaceFetcher(
            this.state.name,
            this.state.description
        );
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData: CreateWorkspaceResponse = fetcher.getResponseData();
        this.setState({
            nameError: responseData.name,
            descriptionError: responseData.description,
            formError: responseData.global,
            workspaceId: responseData.id
        });
    }

    private redirectIfCreated(): React.ReactNode {
        if(this.state.workspaceId > 0) {
            return (<Navigate to={`/workspace?id=${this.state.workspaceId}`} />);
        }
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfCreated()}
            <p className="h1 text-center">Nuevo espacio de trabajo</p>
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
                <Button variant="outline-primary" onClick={() => this.sendWorkspaceData()}>Enviar</Button>
            </Form>
        </>);
    }
}

export default CreateWorkspace;
