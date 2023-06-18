import React from "react";
import Button from "react-bootstrap/Button";
import PaymentModalForm from "./PaymentModalForm";

interface RegUserSubscriptionEditorProps {
    userId: number,
    onUpgrade: () => Promise<void>
}

interface RegUserSubscriptionEditorState {

}

class RegUserSubscriptionEditor extends React.Component<RegUserSubscriptionEditorProps, RegUserSubscriptionEditorState> {

    public state: RegUserSubscriptionEditorState = {

    }

    private modal: React.RefObject<PaymentModalForm>;

    public constructor(props: RegUserSubscriptionEditorProps | Readonly<RegUserSubscriptionEditorProps>) {
        super(props);
        this.modal = React.createRef();
    }

    private showModal(): void {
        this.modal.current != null &&
            this.modal.current.setState({show: true});
    }

    public render(): React.ReactNode {
        return (<>
            <div className="w-100 my-4 d-flex justify-content-center">
                <Button variant="outline-success" onClick={() => this.showModal()}>
                    Conviértete en Premium ahora
                </Button>
            </div>
            <PaymentModalForm ref={this.modal} userId={this.props.userId} onPaymentCompleted={this.props.onUpgrade} />
        </>);
    }
}

export default RegUserSubscriptionEditor;
