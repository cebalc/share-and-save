import React from "react";
import WorkspaceEntity from "../../objects/entities/Workspace";
import {Navigate, useParams} from "react-router-dom";
import ReadWorkspaceFetcher from "../../objects/fetchers/workspaces/ReadWorkspaceFetcher";
import Workspace from "../../routes/workspace/Workspace";
import CRUDAction from "../../objects/enums/CRUDAction";
import SaveWorkspace from "../../routes/workspace/SaveWorkspace";
import User from "../../objects/entities/User";
import DeleteWorkspace from "../../routes/workspace/DeleteWorkspace";
import RecordsMainMenu from "../../routes/workspace/records/RecordsMainMenu";
import GeneralPlaceholder from "../misc/GeneralPlaceholder";
import CreateRecord from "../../routes/workspace/records/CreateRecord";
import AlterRecord from "../../routes/workspace/records/AlterRecord";
import Record from "../../objects/entities/Record";
import UserLevel from "../../objects/enums/UserLevel";

type WorkspaceRouterProps =
    {
        target: "workspace",
        crudAction: CRUDAction.CREATE | CRUDAction.READ,
        userId: number,
        userLevel?: never
    }
    |
    {
        target: "workspace",
        crudAction: CRUDAction.UPDATE | CRUDAction.DELETE,
        userId?: never,
        userLevel?: never
    }
    |
    {
        target: "records",
        crudAction?: never,
        userId?: never,
        userLevel: UserLevel
    }
    |
    {
        target: "record",
        crudAction: CRUDAction.CREATE | CRUDAction.UPDATE,
        userId: number,
        userLevel?: never
    };

const WorkspaceRouter = (props: WorkspaceRouterProps): JSX.Element => {

    const [retrieved, setRetrieved] = React.useState<boolean>(false);
    const [restricted, setRestricted] = React.useState<boolean>(false);
    const [workspace, setWorkspace] = React.useState<WorkspaceEntity>(WorkspaceEntity.NULL);

    const { id } = useParams<string>();
    const { record } = useParams<string>();
    const workspaceId: number = (id === undefined ? WorkspaceEntity.NULL.id : parseInt(id));
    const recordId: number = (record === undefined ? Record.NEW.id : parseInt(record));

    const retrieveWorkspaceData = React.useCallback(() : void => {
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher(workspaceId);
        fetcher.retrieveData()
            .then(retrieved => {
                if (!retrieved) {
                    setRestricted(true);
                    return false;
                }
                if(fetcher.success()) {
                    let workspace: WorkspaceEntity = fetcher.getResponseData()[0];
                    setWorkspace(workspace);
                    let alterAction: boolean = (props.crudAction === CRUDAction.UPDATE || props.crudAction === CRUDAction.DELETE);
                    if(props.target === "workspace" && alterAction && !workspace.userIsAdmin) {
                        setRestricted(true);
                    }
                } else {
                    setRestricted(true);
                }
                setRetrieved(true);
            });
    }, [workspaceId, props.target, props.crudAction]);

    React.useEffect(() => {
        if (props.target === "workspace" && props.crudAction === CRUDAction.CREATE) {
            if(props.userId === User.GUEST.id) {
                setRestricted(true);
            } else {
                setWorkspace(WorkspaceEntity.NULL)
            }
            setRetrieved(true);
        } else {
            retrieveWorkspaceData();
        }
    }, [retrieveWorkspaceData, props.target, props.userId, props.crudAction]);

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
        return <GeneralPlaceholder />;
    }

    if(props.target === "records") {
        return <RecordsMainMenu workspace={workspace} userLevel={props.userLevel} />
    }

    let crudRoutes: Map<string, Map<CRUDAction, JSX.Element>> = new Map([
        ["workspace", new Map([
            [CRUDAction.CREATE, <SaveWorkspace workspace={workspace} onSave={() => null} />],
            [CRUDAction.READ, <Workspace workspace={workspace} userId={props.userId as number} />],
            [CRUDAction.UPDATE, <SaveWorkspace workspace={workspace} onSave={retrieveWorkspaceData} />],
            [CRUDAction.DELETE, <DeleteWorkspace workspace={workspace} />]
        ])],
        ["record", new Map([
            [CRUDAction.CREATE, <CreateRecord userId={props.userId as number} workspace={workspace} />],
            [CRUDAction.UPDATE, <AlterRecord workspace={workspace} recordId={recordId}  userId={props.userId as number}/>]
        ])]
    ]);

    return (crudRoutes.get(props.target) as Map<CRUDAction, JSX.Element>).get(props.crudAction) as JSX.Element;
}

export default WorkspaceRouter;
