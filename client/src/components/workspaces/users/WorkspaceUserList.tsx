import React from "react";
import Container from "react-bootstrap/Container";
import User from "../../../objects/entities/User";
import Placeholder from "react-bootstrap/Placeholder";
import ListGroup from "react-bootstrap/ListGroup";
import ReadWorkspaceUsersFetcher from "../../../objects/fetchers/workspaces/users/ReadWorkspaceUsersFetcher";
import UnlinkWorkspaceUserIcon from "./UnlinkWorkspaceUserIcon";

interface WorkspaceUserListProps {
    userId: number,
    workspaceId: number,
    userIsAdmin: boolean
}

interface WorkspaceUserListState {
    users: User[];
    nothingRetrievedYet: boolean
}

class WorkspaceUserList extends React.Component<WorkspaceUserListProps, WorkspaceUserListState> {
    public state: WorkspaceUserListState = {
        users: [],
        nothingRetrievedYet: true
    }

    public constructor(props: WorkspaceUserListProps | Readonly<WorkspaceUserListProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        await this.refresh();
    }

    private renderPlaceholderList(): React.ReactNode {
        let mockElements: number[] = [0, 0, 0];
        return (<ListGroup>
            {mockElements.map((element, index) =>
                <ListGroup.Item key={index} className="d-flex flex-column justify-content-start align-items-start">
                    <div className="ms-2 me-auto w-75">
                        <div>
                            <Placeholder as="span" animation="glow">
                                <Placeholder xs={12} />
                            </Placeholder>
                        </div>
                        <div>
                            <Placeholder as="span" animation="glow">
                                <Placeholder xs={10} />
                            </Placeholder>
                        </div>
                    </div>
                </ListGroup.Item>
            )}
        </ListGroup>);
    }

    private renderDeleteIcon(user: User): React.ReactNode {
        if(this.props.userIsAdmin && this.props.userId !== user.id) {
            return <UnlinkWorkspaceUserIcon workspaceId={this.props.workspaceId}
                        removeUser={user} onRemoveUser={this.refresh.bind(this)} />
        }
    }

    private renderList(): React.ReactNode {
        if(this.state.users.length === 0) {
            return (<Container fluid>Este espacio no contiene usuarios</Container>);
        }
        return (<ListGroup>
            {this.state.users.map(user =>
                <ListGroup.Item key={user.id} className="table-row d-flex justify-content-between align-items-center">
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">{`${user.name} ${user.surname}`}</div>
                        <div>{user.email}</div>
                    </div>
                    {this.renderDeleteIcon(user)}
                </ListGroup.Item>
            )}
        </ListGroup>);
    }

    public render(): React.ReactNode {
        if(this.state.nothingRetrievedYet) {
            return this.renderPlaceholderList();
        }
        return this.renderList();
    }

    public async refresh(): Promise<void> {
        let usersFetcher: ReadWorkspaceUsersFetcher = new ReadWorkspaceUsersFetcher(this.props.workspaceId);
        if(!await usersFetcher.retrieveData()) {
            return;
        }
        let workspaceUsers: User[] = usersFetcher.getResponseData();
        if(usersFetcher.success()) {
            this.setState({users: workspaceUsers, nothingRetrievedYet: false});
        }
    }
}

export default WorkspaceUserList;
