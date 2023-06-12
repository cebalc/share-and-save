import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import WorkspaceAddUserForm from "./WorkspaceAddUserForm";
import WorkspaceUserList from "./WorkspaceUserList";

interface WorkspaceUserManagerProps {

}

interface WorkspaceUserManagerState {

}

class WorkspaceUserManager extends React.Component<WorkspaceUserManagerProps, WorkspaceUserManagerState> {
    public state: WorkspaceUserManagerState = {

    }

    public constructor(props: WorkspaceUserManagerProps | Readonly<WorkspaceUserManagerProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Container fluid>
                <p className="h5 text-center">Usuarios del espacio</p>
                <WorkspaceAddUserForm />
                <WorkspaceUserList />
            </Container>
        );
    }
}

export default WorkspaceUserManager;
