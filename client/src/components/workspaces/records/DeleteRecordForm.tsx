import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import DeleteRecordFetcher from "../../../objects/fetchers/workspaces/records/DeleteRecordFetcher";
import OptionalTextAlert from "../../misc/OptionalTextAlert";

interface DeleteRecordFormProps {
    workspaceId: number,
    recordId: number,
    onDelete: () => void
}

interface DeleteRecordFormState {
    show: boolean,
    fetching: boolean,
    error: string
}

class DeleteRecordForm extends React.Component<DeleteRecordFormProps, DeleteRecordFormState> {

    public state: DeleteRecordFormState = {
        show: false,
        fetching: false,
        error: ""
    };

    public constructor(props: Readonly<DeleteRecordFormProps> | DeleteRecordFormProps) {
        super(props);
    }

    private hideModal(): void {
        this.setState({show: false});
    }

    private async deleteRecord(): Promise<void> {
        this.setState({fetching: true});
        await this.processDeleteRequest();
    }

    private async processDeleteRequest(): Promise<void> {
        let fetcher: DeleteRecordFetcher = new DeleteRecordFetcher(this.props.recordId, this.props.workspaceId);
        if(!await fetcher.retrieveData()) {
            this.setState({
                fetching: false,
                error: "Error de conexión al servidor"
            });
        }
        let responseData: string = fetcher.getResponseData();
        if(fetcher.success()) {
            this.props.onDelete();
        }
        this.setState({
            fetching: false,
            error: responseData,
            show: !fetcher.success()
        });
    }

    public render(): React.ReactNode {
        return (
            <Modal show={this.state.show} onHide={() => this.hideModal()}>
                <Modal.Header closeButton={!this.state.fetching}>
                    <Modal.Title>Eliminar movimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OptionalTextAlert text={this.state.error} />
                    <p>Si eliminas el movimiento no podrás recuperar la información despúes. ¿Continuar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" disabled={this.state.fetching}
                        onClick={() => this.deleteRecord()}>Eliminar</Button>
                    <Button variant="outline-primary" disabled={this.state.fetching}
                        onClick={() => this.hideModal()}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DeleteRecordForm;
