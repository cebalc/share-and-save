import React from "react";
import ReadWorkspaceFetcher from "../../objects/fetchers/ReadWorkspaceFetcher";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WorkspaceEntity from "../../objects/entities/Workspace";
import WorkspaceUsersForm from "../../components/WorkspaceUsersForm";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {LinkContainer} from "react-router-bootstrap";

interface WorkspaceProps {
    userId: number
}

const Workspace = (props: WorkspaceProps) : JSX.Element => {

    const NO_WORKSPACE: number = 0;

    const [restricted, setRestricted] = React.useState(false);
    const [name, setName] = React.useState("Cargando...");
    const [description, setDescription] = React.useState("Cargando...");

    const { id } = useParams();
    const workspaceId: number = (id === undefined ? NO_WORKSPACE : parseInt(id));

    const redirectIfRestricted = (): React.ReactNode => {
        if(props.userId === 0 || restricted) {
            return <Navigate to="/dashboard" />;
        }
    }

    const retrieveWorkspaceData = React.useCallback(() : void => {
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher(workspaceId);
        fetcher.retrieveData()
            .then(retrieved => {
                if (!retrieved) {
                    return Promise.reject(retrieved);
                }
                let responseData: WorkspaceEntity = fetcher.getResponseData()[0];
                if(fetcher.success()) {
                    setName(responseData.name);
                    setDescription(responseData.description);
                } else {
                    setRestricted(true);
                }
            });
    }, [workspaceId]);

    React.useEffect(() => {retrieveWorkspaceData()}, [retrieveWorkspaceData]);

    return (
        <Container fluid>
            {redirectIfRestricted()}
            <p className="h1 text-center">{name}</p>
            <p className="h4 text-center">{description}</p>
            <Row>
                <Col md={6}>
                    <div className="mx-auto max-width-50nbp-sm d-flex flex-column">
                        <LinkContainer to={`/workspace/${workspaceId}/edit`}>
                            <Button variant="outline-primary" className="m-2">Editar nombre y descripción</Button>
                        </LinkContainer>
                        <LinkContainer to="/dashboard">
                            <Button variant="outline-primary" className="m-2">Volver a tablero</Button>
                        </LinkContainer>
                    </div>
                </Col>
                <Col md={6}>
                    <WorkspaceUsersForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Workspace;
