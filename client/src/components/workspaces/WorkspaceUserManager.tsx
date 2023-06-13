import React from "react";
import Container from "react-bootstrap/Container";
import WorkspaceAddUserForm from "./WorkspaceAddUserForm";
import WorkspaceUserList from "./WorkspaceUserList";

interface WorkspaceUserManagerProps {
    workspaceId: number
    userIsAdmin: boolean
}

interface WorkspaceUserManagerState {

}

class WorkspaceUserManager extends React.Component<WorkspaceUserManagerProps, WorkspaceUserManagerState> {
    public state: WorkspaceUserManagerState = {

    }

    private userList: React.RefObject<WorkspaceUserList>;

    public constructor(props: WorkspaceUserManagerProps | Readonly<WorkspaceUserManagerProps>) {
        super(props);
        this.userList = React.createRef();
    }

    private async refreshList(): Promise<void> {
        if(this.userList.current !== null) {
            await this.userList.current.refresh();
        }
    }

    public render(): React.ReactNode {
        return (
            <Container fluid className="my-2">
                <p className="h5 text-center">Usuarios del espacio</p>
                <WorkspaceAddUserForm onAdd={this.refreshList.bind(this)} />
                <WorkspaceUserList ref={this.userList} workspaceId={this.props.workspaceId} userIsAdmin={this.props.userIsAdmin} />
            </Container>
        );
    }
}

export default WorkspaceUserManager;
