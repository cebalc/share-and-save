import React from "react";
import User from "../objects/entities/User";
import {Navigate} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import SubscriptionStatus from "../components/users/SubscriptionStatus";
import UserDataForm from "../components/users/UserDataForm";
import OptionalTextAlert from "../components/misc/OptionalTextAlert";

interface SettingsProps {
    user: User
    onUserDataAltered: () => Promise<void>
}

interface SettingsState {

}

class Settings extends React.Component<SettingsProps, SettingsState> {

    public state: SettingsState = {

    }

    private readonly dataModifiedAlert: React.RefObject<OptionalTextAlert>;

    public constructor(props: SettingsProps | Readonly<SettingsProps>) {
        super(props);
        this.dataModifiedAlert = React.createRef();
    }

    private preventAnonymousUsers(): React.ReactNode {
        if(this.props.user === User.GUEST) {
            return (<Navigate to="/signin" />);
        }
    }

    private async confirmUserDataUpdate(): Promise<void> {
        await this.props.onUserDataAltered();
        this.dataModifiedAlert.current != null &&
            this.dataModifiedAlert.current.setState({show: true});
    }

    public render(): React.ReactNode {
        return (
            <div className="mx-auto max-width-75nbp-lg">
                {this.preventAnonymousUsers()}
                <p className="h1 text-center">Ajustes del usuario</p>
                <Row>
                    <Col md={5} className="px-4 my-4">
                        <p className="h3 text-center">Tus datos</p>
                        <OptionalTextAlert ref={this.dataModifiedAlert} variant="info" dismissible
                                           text="Tus datos han sido modificados correctamente" />
                        <UserDataForm user={this.props.user} onPersistData={this.confirmUserDataUpdate.bind(this)} />
                    </Col>
                    <Col md={7} className="px-4 my-4">
                        <p className="h3 text-center">Nivel de suscripción</p>
                        <SubscriptionStatus userId={this.props.user.id} userLevel={this.props.user.level} onStatusChanged={this.props.onUserDataAltered} />
                    </Col>
                </Row>
                <div className="mx-auto text-center max-width-50-sm">
                    <LinkContainer to="/dashboard">
                        <Button variant="outline-primary">Volver al tablero</Button>
                    </LinkContainer>
                </div>
            </div>
        );
    }
}

export default Settings;
