import React from "react";
import WorkspaceData from "../objects/WorkspaceData";
import WorkspaceFetcher from "../objects/fetchers/WorkspaceFetcher";
import Container from "react-bootstrap/Container";

interface WorkspaceListProps {
    userId: number
}

interface WorkspaceListState {
    workspaceListError: boolean,
    workspaces: WorkspaceData[]
}

class WorkspaceList extends React.Component<WorkspaceListProps, WorkspaceListState> {

    private readonly MSG_ERR_WORKSPACES = "Ha ocurrido un problema al cargar los espacios de trabajo";

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
        } else {
            this.setState({
                workspaceListError: false,
                workspaces: responseData
            });
        }
    }

    public render(): React.ReactNode {
        return (
            <Container fluid>
                
            </Container>
        );
    }
}

export default WorkspaceList;
