import React from "react";
import WorkspaceEntity from "../../objects/entities/Workspace";
import {Navigate, useParams} from "react-router-dom";
import ReadWorkspaceFetcher from "../../objects/fetchers/workspaces/ReadWorkspaceFetcher";
import Workspace from "../../routes/workspace/Workspace";
import CRUDAction from "../../objects/enums/CRUDAction";
import Container from "react-bootstrap/Container";
import SaveWorkspace from "../../routes/workspace/SaveWorkspace";
import StatusFetcher from "../../objects/fetchers/users/StatusFetcher";
import User from "../../objects/entities/User";
import DeleteWorkspace from "../../routes/workspace/DeleteWorkspace";

interface WorkspaceRouterProps {
    crudAction: CRUDAction
    userId?: number
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
                    let workspace: WorkspaceEntity = fetcher.getResponseData()[0];
                    setWorkspace(workspace);
                    if((props.crudAction === CRUDAction.UPDATE || props.crudAction === CRUDAction.DELETE) && !workspace.userIsAdmin) {
                        setRestricted(true);
                    }
                } else {
                    setRestricted(true);
                }
                setRetrieved(true);
            });
    }, [workspaceId, props.crudAction]);

    const checkUserAuth = React.useCallback((): void => {
        let fetcher: StatusFetcher = new StatusFetcher();
        fetcher.retrieveData()
            .then(retrieved => {
                if(!retrieved) {
                    setRestricted(true);
                    return Promise.reject(retrieved);
                }
                let currentUser: User = fetcher.getResponseData();
                if(currentUser.id === User.GUEST.id) {
                    setRestricted(true);
                } else {
                    setWorkspace(WorkspaceEntity.NULL)
                }
                setRetrieved(true);
            });
    }, []);

    React.useEffect(() => {
        if(props.crudAction === CRUDAction.CREATE) {
            checkUserAuth();
        } else {
            retrieveWorkspaceData();
        }
    }, [retrieveWorkspaceData, checkUserAuth, props.crudAction]);

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

    let crudRoutes: Map<CRUDAction, JSX.Element> = new Map([
        [CRUDAction.CREATE, <SaveWorkspace workspace={workspace} onSave={() => null} />],
        [CRUDAction.READ, <Workspace workspace={workspace} userId={props.userId as number} />],
        [CRUDAction.UPDATE, <SaveWorkspace workspace={workspace} onSave={retrieveWorkspaceData} />],
        [CRUDAction.DELETE, <DeleteWorkspace workspace={workspace} />]
    ]);

    return crudRoutes.get(props.crudAction) as JSX.Element;
}

WorkspaceRouter.defaultProps = ({
    crudAction: CRUDAction.READ,
    userId: 0
} as WorkspaceRouterProps);

export default WorkspaceRouter;
