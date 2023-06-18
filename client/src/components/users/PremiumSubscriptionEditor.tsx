import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DowngradeSubscriptionFetcher from "../../objects/fetchers/users/subscriptions/DowngradeSubscriptionFetcher";
import OptionalTextAlert from "../misc/OptionalTextAlert";

interface PremiumSubscriptionEditorProps {
    userId: number,
    onDowngrade: () => Promise<void>
}

interface PremiumSubscriptionEditorState {
    showModal: boolean,
    error: string
}

class PremiumSubscriptionEditor extends React.Component<PremiumSubscriptionEditorProps, PremiumSubscriptionEditorState> {

    public state: PremiumSubscriptionEditorState = {
        showModal: false,
        error: ""
    }

    private errorAlert: React.RefObject<OptionalTextAlert>;

    public constructor(props: PremiumSubscriptionEditorProps | Readonly<PremiumSubscriptionEditorProps>) {
        super(props);
        this.errorAlert = React.createRef();
    }

    private showModal(): void {
        this.setState({showModal: true});
    }

    private hideModal(): void {
        this.setState({showModal: false});
    }

    private async downgradeSubscription(): Promise<void> {
        let fetcher: DowngradeSubscriptionFetcher = new DowngradeSubscriptionFetcher(this.props.userId);
        if(!await fetcher.retrieveData()) {
            this.setState({error: "Error de conexión al servidor"});
            return;
        }
        if(fetcher.success()) {
            await this.props.onDowngrade();
        }
        this.setState({
            error: fetcher.getResponseData(),
            showModal: !fetcher.success()
        });
    }

    public render(): React.ReactNode {
        return (<>
            <div className="w-100 my-4 d-flex justify-content-center">
                <Button variant="outline-success" onClick={() => this.showModal()}>
                    Cancelar Suscripción
                </Button>
            </div>
            <Modal backdrop="static" keyboard={false} show={this.state.showModal} onHide={() => this.hideModal()} >
                <Modal.Header closeButton>
                    <Modal.Title>Cancelar Suscripción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OptionalTextAlert ref={this.errorAlert} text={this.state.error} />
                    <p>Si cancelas tu suscripción perderás el acceso a todas las funciones adicionales de los usuarios Premium.</p>
                    <p>Tus espacios de trabajo existentes no se borrarán, pero no podrás añadir nuevos. ¿Continuar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={() => this.downgradeSubscription()}>Cancelar suscripción</Button>
                    <Button variant="outline-primary" onClick={() => this.hideModal()}>Volver</Button>
                </Modal.Footer>
            </Modal>
        </>);
    }
}

export default PremiumSubscriptionEditor;
