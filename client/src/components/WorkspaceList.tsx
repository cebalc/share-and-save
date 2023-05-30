import React from "react";
import WorkspaceData from "../objects/WorkspaceData";
import ReadWorkspaceFetcher from "../objects/fetchers/ReadWorkspaceFetcher";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

interface WorkspaceListProps {
    userId: number
}

interface WorkspaceListState {
    workspaceListError: boolean,
    workspaces: WorkspaceData[]
}

class WorkspaceList extends React.Component<WorkspaceListProps, WorkspaceListState> {

    private static readonly MSG_ERR_WORKSPACES: string = "Ha ocurrido un problema al cargar los espacios de trabajo";

    public state: WorkspaceListState = {
        workspaceListError: false,
        workspaces: []
    }

    public constructor(props: WorkspaceListProps | Readonly<WorkspaceListProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        await this.getUserWorkspaceList();
    }

    private async getUserWorkspaceList(): Promise<void> {
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher();
        if(!await fetcher.retrieveData()) {
            return;
        }
        let responseData = fetcher.getResponseData();
        if(!fetcher.success()) {
            this.setState({workspaceListError: true});
            return;
        }
        this.setState({
            workspaceListError: false,
            workspaces: responseData
        });
    }

    private renderError(): React.ReactNode {
        return (
            <Alert variant="danger">{WorkspaceList.MSG_ERR_WORKSPACES}</Alert>
        );
    }

    private renderEmptyList(): React.ReactNode {
        return (
            <Alert variant="info">
                Todavía no existen espacios de trabajo.&nbsp;
                <LinkContainer to="/createworkspace">
                    <Alert.Link>Crea uno nuevo.</Alert.Link>
                </LinkContainer>
            </Alert>
        );
    }

    private renderTable(): React.ReactNode {
        return (
            <Table striped hover bordered responsive>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                </tr>
                </thead>
                <tbody>
                {this.state.workspaces.map(workspace =>
                    <tr key={workspace.id}>
                        <td><Link to={`/workspace?id=${workspace.id}`}>{workspace.name}</Link></td>
                        <td>{workspace.description}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        );
    }

    private renderButton(): React.ReactNode {
        return (
            <Container fluid className="d-flex justify-content-center my-2">
                <LinkContainer to="/createworkspace">
                    <Button variant="outline-primary" className="d-block">Crear nuevo espacio</Button>
                </LinkContainer>
            </Container>
        );
    }

    public render(): React.ReactNode {
        return (
            <Container fluid className="my-5">
                <p className="h2 my-3">Espacios de trabajo</p>
                {this.state.workspaceListError && this.renderError()}
                {this.state.workspaces.length === 0 ?
                    this.renderEmptyList()
                    :
                    this.renderTable()
                }
                {this.renderButton()}
            </Container>
        );
    }
}

export default WorkspaceList;
