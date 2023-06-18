import React from "react";
import BouncingIcon from "../misc/BouncingIcon";
import Modal from "react-bootstrap/Modal";
import User from "../../objects/entities/User";
import Button from "react-bootstrap/Button";
import UnlinkWorkspaceUserFetcher from "../../objects/fetchers/workspaces/UnlinkWorkspaceUserFetcher";

interface UnlinkWorkspaceUserIconProps {
    workspaceId: number,
    removeUser: User,
    onRemoveUser: () => Promise<void>
}

interface UnlinkWorkspaceUserIconState {
    showModal: boolean,
    unlinkError: string
}

class UnlinkWorkspaceUserIcon extends React.Component<UnlinkWorkspaceUserIconProps, UnlinkWorkspaceUserIconState> {
    public state: UnlinkWorkspaceUserIconState = {
        showModal: false,
        unlinkError: ""
    }

    public constructor(props: UnlinkWorkspaceUserIconProps | Readonly<UnlinkWorkspaceUserIconProps>) {
        super(props);
    }

    private showModal(): void {
        this.setState({showModal: true});
    }

    private hideModal(): void {
        this.setState({showModal: false});
    }

    private async unlinkUser(): Promise<void> {
        let unlinkFetcher: UnlinkWorkspaceUserFetcher = new UnlinkWorkspaceUserFetcher(this.props.removeUser.id, this.props.workspaceId);
        if(!await unlinkFetcher.retrieveData()) {
            return;
        }
        if(!unlinkFetcher.success()) {
            this.setState({unlinkError: unlinkFetcher.getResponseData()});
            return;
        }
        if(unlinkFetcher.success()) {
            await this.props.onRemoveUser();
        }
        this.setState({
            showModal: !unlinkFetcher.success(),
            unlinkError: unlinkFetcher.getResponseData()
        })
    }

    public render(): React.ReactNode {
        return (<>
            <div onClick={() => this.showModal()}>
                <BouncingIcon family="far" name="trash-can" size="1x" />
            </div>
            <Modal show={this.state.showModal} onHide={() => this.hideModal()} >
                <Modal.Header closeButton>
                    <Modal.Title>Desvincular usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Quieres desvincular a {`${this.props.removeUser.name} ${this.props.removeUser.surname}`} del espacio?<br/>
                    No se borrarán los movimientos realizados por este usuario.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => this.unlinkUser()}>Desvincular</Button>
                    <Button variant="outline-primary" onClick={() => this.hideModal()}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        </>);
    }
}

export default UnlinkWorkspaceUserIcon;
