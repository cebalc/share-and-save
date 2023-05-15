import React from "react";
import WorkspaceData from "../objects/WorkspaceData";
import WorkspaceFetcher from "../objects/fetchers/WorkspaceFetcher";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";

interface WorkspaceListProps {
    userId: number
}

interface WorkspaceListState {
    workspaceListError: boolean,
    workspaces: WorkspaceData[]
}

class WorkspaceList extends React.Component<WorkspaceListProps, WorkspaceListState> {

    private static readonly MSG_ERR_WORKSPACES = "Ha ocurrido un problema al cargar los espacios de trabajo";

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
        let fetcher: WorkspaceFetcher = new WorkspaceFetcher();
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
            <Table striped hover bordered responsive="sm">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Opciones</th>
                </tr>
                </thead>
                <tbody>
                {this.state.workspaces.map(workspace =>
                    <tr>
                        <td>{workspace.name}</td>
                        <td>{workspace.description}</td>
                        <td>(Opciones)</td>
                    </tr>
                )}
                </tbody>
            </Table>
        );
    }

    public render(): React.ReactNode {
        return (
            <Container fluid className="my-5">
                <p className="h2">Espacios de trabajo</p>
                {this.state.workspaceListError && this.renderError()}
                {this.state.workspaces.length === 0 ?
                    this.renderEmptyList()
                    :
                    this.renderTable()
                }
            </Container>
        );
    }
}

export default WorkspaceList;
