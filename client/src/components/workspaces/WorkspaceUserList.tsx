import React from "react";

interface WorkspaceUserListProps {

}

interface WorkspaceUserListState {

}

class WorkspaceUserList extends React.Component<WorkspaceUserListProps, WorkspaceUserListState> {
    public state: WorkspaceUserListState = {

    }

    public constructor(props: WorkspaceUserListProps | Readonly<WorkspaceUserListProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div>
                Lista de usuarios del espacio
            </div>);
    }
}

export default WorkspaceUserList;
