import Alert from "react-bootstrap/Alert";
import React from "react";
import { Variant } from "react-bootstrap/esm/types";

interface OptionalTextAlertProps {
    variant?: Variant,
    text: string
    dismissible?: boolean
}

interface OptionalTextAlertState {
    show: boolean
}

class OptionalTextAlert extends React.Component<OptionalTextAlertProps, OptionalTextAlertState> {

    static defaultProps = {
        variant: "danger",
        dismissible: false
    }

    public state: OptionalTextAlertState = {
        show: false
    }

    public componentDidMount(): void {
        if(!this.props.dismissible) {
            this.setState({show: true});
        }
    }

    public render(): React.ReactNode {
        if(this.props.text.length > 0) {
            return (
                <Alert variant={this.props.variant} dismissible={this.props.dismissible} show={this.state.show}
                       onClose={() => this.setState({show: false})}>
                    {this.props.text}
                </Alert>
            );
        }
    }
}

export default OptionalTextAlert;
