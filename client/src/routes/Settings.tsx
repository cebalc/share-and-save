import React from "react";
import UserDataForm from "../components/users/UserDataForm";
import User from "../objects/entities/User";
import {Navigate} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface SettingsProps {
    user: User
    onUserDataAltered: () => Promise<void>
}

interface SettingsState {
    showDataModifiedAlert: boolean
}

class Settings extends React.Component<SettingsProps, SettingsState> {
    public state: SettingsState = {
        showDataModifiedAlert: false
    }

    public constructor(props: SettingsProps | Readonly<SettingsProps>) {
        super(props);
    }

    private preventAnonymousUsers(): React.ReactNode {
        if(this.props.user === User.GUEST) {
            return (<Navigate to="/signin" />);
        }
    }

    private async confirmUserDataUpdate(): Promise<void> {
        await this.props.onUserDataAltered();
        this.setState({showDataModifiedAlert: true});
    }

    private renderDataModifiedAlert(): React.ReactNode {
        if(this.state.showDataModifiedAlert) {
            return (
                <Alert variant="info" onClose={() => this.setState({showDataModifiedAlert: false})} dismissible>
                    Tus datos han sido modificados correctamente.
                </Alert>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="mx-auto max-width-75nbp-lg">
                {this.preventAnonymousUsers()}
                <p className="h1 text-center">Ajustes del usuario</p>
                <Row>
                    <Col md={6} className="m-2">
                        <p className="h3 text-center">Tus datos</p>
                        {this.renderDataModifiedAlert()}
                        <UserDataForm user={this.props.user} onPersistData={this.confirmUserDataUpdate.bind(this)} />
                    </Col>
                    <Col md={5} className="m-2">
                        <p className="h3 text-center">Nivel de suscripción</p>
                        <p>Tu nivel actual es {User.getLabel(this.props.user.level)}</p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Settings;
