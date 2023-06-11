import React from "react";
import WorkspaceEntity from "../objects/entities/Workspace";
import {Navigate, useParams} from "react-router-dom";
import ReadWorkspaceFetcher from "../objects/fetchers/ReadWorkspaceFetcher";
import Workspace from "../routes/workspace/Workspace";
import CRUDAction from "../objects/enums/CRUDAction";
import EditWorkspace from "../routes/workspace/EditWorkspace";
import Container from "react-bootstrap/Container";

interface WorkspaceRouterProps {
    crudAction: CRUDAction
}

const WorkspaceRouter = (props: WorkspaceRouterProps): JSX.Element => {

    const [retrieved, setRetrieved] = React.useState<boolean>(false);
    const [restricted, setRestricted] = React.useState<boolean>(false);
    const [workspace, setWorkspace] = React.useState<WorkspaceEntity>(WorkspaceEntity.NULL);

    const { id } = useParams();
    const workspaceId: number = (id === undefined ? WorkspaceEntity.NULL.id : parseInt(id));

    const retrieveWorkspaceData = React.useCallback(() : void => {
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher(workspaceId);
        fetcher.retrieveData()
            .then(retrieved => {
                if (!retrieved) {
                    setRestricted(true);
                    return Promise.reject(retrieved);
                }
                if(fetcher.success()) {
                    setWorkspace(fetcher.getResponseData()[0]);
                } else {
                    setRestricted(true);
                }
                setRetrieved(true);
            });
    }, [workspaceId]);

    React.useEffect(() => {retrieveWorkspaceData()}, [retrieveWorkspaceData]);

    let fetchPending: boolean = !restricted && !retrieved;
    let userNotAuthenticated: boolean = restricted && !retrieved;
    let userNotAllowed: boolean = restricted && retrieved;

    if(userNotAuthenticated) {
        return (<Navigate to="/signin" />);
    }
    if(userNotAllowed) {
        return (<Navigate to="/dashboard" />);
    }
    if(fetchPending) {
        return (
            <Container fluid>
                <p className="text-center">Recuperando información...</p>
            </Container>
        );
    }

    let crudReactNodes: Map<CRUDAction, JSX.Element> = new Map([
        [CRUDAction.READ, <Workspace workspace={workspace} />],
        [CRUDAction.UPDATE, <EditWorkspace workspace={workspace} />]
    ]);

    return crudReactNodes.get(props.crudAction) as JSX.Element;
}

export default WorkspaceRouter;
