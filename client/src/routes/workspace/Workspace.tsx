import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WorkspaceEntity from "../../objects/entities/Workspace";
import WorkspaceUserManager from "../../components/workspaces/WorkspaceUserManager";
import WorkspaceMenu from "../../components/workspaces/WorkspaceMenu";
import WorkspaceCard, {WorkspaceCardSize} from "../../components/workspaces/WorkspaceCard";

interface WorkspaceProps {
    workspace: WorkspaceEntity
}

const Workspace = (props: WorkspaceProps) : JSX.Element => {

    return (
        <Container fluid>
            <WorkspaceCard name={props.workspace.name} description={props.workspace.description} size={WorkspaceCardSize.CAPTION} />
            <Row className="mt-4">
                <Col md={4}>
                    <WorkspaceMenu workspaceId={props.workspace.id} userIsAdmin={props.workspace.userIsAdmin} />
                </Col>
                <Col md={8}>
                    <WorkspaceUserManager />
                </Col>
            </Row>
        </Container>
    );
}

export default Workspace;
