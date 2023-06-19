import React from "react";
import WorkspaceEntity from "../../objects/entities/Workspace";
import {Navigate, useParams} from "react-router-dom";
import ReadWorkspaceFetcher from "../../objects/fetchers/workspaces/ReadWorkspaceFetcher";
import Workspace from "../../routes/workspace/Workspace";
import CRUDAction from "../../objects/enums/CRUDAction";
import Container from "react-bootstrap/Container";
import SaveWorkspace from "../../routes/workspace/SaveWorkspace";
import User from "../../objects/entities/User";
import DeleteWorkspace from "../../routes/workspace/DeleteWorkspace";
import RecordsTabsMenu from "./records/RecordsTabsMenu";

type WorkspaceRouterProps =
    {
        target: "workspace",
        crudAction: CRUDAction.CREATE | CRUDAction.READ,
        userId: number
    }
    |
    {
        target: "workspace",
        crudAction: CRUDAction.UPDATE | CRUDAction.DELETE,
        userId?: never
    }
    |
    {
        target: "records",
        crudAction?: never,
        userId?: never
    };

const WorkspaceRouter = (props: WorkspaceRouterProps): JSX.Element => {

    const [retrieved, setRetrieved] = React.useState<boolean>(false);
    const [restricted, setRestricted] = React.useState<boolean>(false);
    const [workspace, setWorkspace] = React.useState<WorkspaceEntity>(WorkspaceEntity.NULL);

    const { id } = useParams<string>();
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

    React.useEffect(() => {
        if (props.crudAction === CRUDAction.CREATE) {
            if(props.userId === User.GUEST.id) {
                setRestricted(true);
            } else {
                setWorkspace(WorkspaceEntity.NULL)
            }
            setRetrieved(true);
        } else {
            retrieveWorkspaceData();
        }
    }, [retrieveWorkspaceData, props.userId, props.crudAction]);

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
        return <Placeholder />;
    }

    if(props.target === "records") {
        return <RecordsTabsMenu workspace={workspace} />
    }

    if(props.target === "workspace") {
        let crudRoutes: Map<CRUDAction, JSX.Element> = new Map([
            [CRUDAction.CREATE, <SaveWorkspace workspace={workspace} onSave={() => null} />],
            [CRUDAction.READ, <Workspace workspace={workspace} userId={props.userId as number} />],
            [CRUDAction.UPDATE, <SaveWorkspace workspace={workspace} onSave={retrieveWorkspaceData} />],
            [CRUDAction.DELETE, <DeleteWorkspace workspace={workspace} />]
        ]);
        return crudRoutes.get(props.crudAction) as JSX.Element;
    }

    return <></>;
}

const Placeholder = (): JSX.Element => {
    return (
        <Container fluid>
            <p className="text-center">Recuperando información...</p>
        </Container>
    );
}

export default WorkspaceRouter;
