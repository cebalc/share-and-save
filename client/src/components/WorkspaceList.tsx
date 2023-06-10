import React from "react";
import Workspace from "../objects/entities/Workspace";
import ReadWorkspaceFetcher from "../objects/fetchers/ReadWorkspaceFetcher";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface WorkspaceListProps {
    userId: number
}

interface WorkspaceListState {
    workspaceListError: boolean,
    workspaces: Workspace[]
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
        let responseData: Workspace[] = fetcher.getResponseData();
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
            <Alert variant="info">Todavía no existen espacios de trabajo.</Alert>
        );
    }

    private renderTable(): React.ReactNode {
        return (
            <div className="mx-auto max-width-75nbp-md opacity-100 bg-light rounded-4">
                <Row className="d-none d-md-flex bg-primary text-light p-2">
                    <Col md={4} className="fw-bold p-1">Nombre</Col>
                    <Col md={8} className="fw-bold p-1">Descripción</Col>
                </Row>
                {this.state.workspaces.map(workspace =>
                    <LinkContainer to={`/workspace/${workspace.id}`} key={workspace.id} className="clickable">
                        <Row key={workspace.id} className="table-row p-3">
                            <Col md={4} className="p-1">
                                <div className="d-block d-md-none mb-2 fw-bold">Nombre</div>
                                <div>{workspace.name}</div>
                            </Col>
                            <Col md={8} className="p-1">
                                <div className="d-block d-md-none mb-2 fw-bold">Descripción</div>
                                <div>{workspace.description}</div>
                            </Col>
                        </Row>
                    </LinkContainer>
                )}
            </div>
        )
    }

    private renderButton(): React.ReactNode {
        return (
            <Container fluid className="d-flex justify-content-center my-3">
                <LinkContainer to="/workspace/create">
                    <Button variant="outline-primary" className="d-block">Crear nuevo espacio</Button>
                </LinkContainer>
            </Container>
        );
    }

    public render(): React.ReactNode {
        return (
            <Container fluid className="my-5">
                <p className="h2 my-3 text-center">Espacios de trabajo</p>
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
