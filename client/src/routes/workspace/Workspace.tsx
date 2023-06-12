import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WorkspaceEntity from "../../objects/entities/Workspace";
import WorkspaceUsersForm from "../../components/WorkspaceUsersForm";
import WorkspaceMenu from "../../components/WorkspaceMenu";

interface WorkspaceProps {
    workspace: WorkspaceEntity
}

const Workspace = (props: WorkspaceProps) : JSX.Element => {

    const renderDescription = (): React.ReactNode => {
        if(props.workspace.description.length > 0) {
            return (<p className="h4 text-center">{props.workspace.description}</p>);
        }
    }

    return (
        <Container fluid>
            <p className="h1 text-center">{props.workspace.name}</p>
            {renderDescription()}
            <Row>
                <Col md={4} lg={6}>
                    <WorkspaceMenu workspaceId={props.workspace.id} userIsAdmin={props.workspace.userIsAdmin} />
                </Col>
                <Col md={8} lg={6}>
                    <WorkspaceUsersForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Workspace;
