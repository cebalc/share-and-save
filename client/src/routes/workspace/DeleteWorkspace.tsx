import React from "react";
import Workspace from "../../objects/entities/Workspace";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {LinkContainer} from "react-router-bootstrap";
import DeleteWorkspaceFetcher from "../../objects/fetchers/workspaces/DeleteWorkspaceFetcher";
import {Navigate} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import WorkspaceCard, {WorkspaceCardSize} from "../../components/workspaces/WorkspaceCard";

interface DeleteWorkspaceProps {
    workspace: Workspace
}

interface DeleteWorkspaceState {
    deleted: boolean,
    deleteError: string
}

class DeleteWorkspace extends React.Component<DeleteWorkspaceProps, DeleteWorkspaceState> {
    public state: DeleteWorkspaceState = {
        deleted: false,
        deleteError: ""
    }

    public constructor(props: DeleteWorkspaceProps | Readonly<DeleteWorkspaceProps>) {
        super(props);
    }

    private redirectIfDeleted(): React.ReactNode {
        if(this.state.deleted) {
            return (<Navigate to="/dashboard" />);
        }
    }

    private buildReturnURL(): string {
        return `/workspace/${this.props.workspace.id}`;
    }

    private renderError(): React.ReactNode {
        if(this.state.deleteError.length > 0) {
            return (<Alert variant="danger" className="mx-auto text-center">{this.state.deleteError}</Alert>);
        }
    }

    private async deleteWorkspace(): Promise<void> {
        let deleteFetcher: DeleteWorkspaceFetcher = new DeleteWorkspaceFetcher(this.props.workspace.id);
        if(!await deleteFetcher.retrieveData()) {
            return;
        }
        let responseData: string = deleteFetcher.getResponseData();
        this.setState({
            deleted: deleteFetcher.success(),
            deleteError: responseData
        });
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfDeleted()}
            <p className="h1 text-center">Borrar espacio de trabajo</p>
            <WorkspaceCard name={this.props.workspace.name} description={this.props.workspace.description} size={WorkspaceCardSize.NORMAL} />
            {this.renderError()}
            <p className="h5 text-center">Se borrará el espacio de trabajo seleccionado y todos los datos asociados. ¿Continuar?</p>
            <Container fluid className="mx-auto mt-4 d-flex flex-row justify-content-center">
                <Button variant="outline-danger" className="me-3" onClick={() => this.deleteWorkspace()}>Borrar</Button>
                <LinkContainer to={this.buildReturnURL()}>
                    <Button variant="outline-primary">Volver</Button>
                </LinkContainer>
            </Container>
        </>);
    }
}

export default DeleteWorkspace;
