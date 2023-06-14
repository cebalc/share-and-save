import React from "react";
import { Navigate } from "react-router-dom";
import UserDataForm from "../components/users/UserDataForm";
import User from "../objects/entities/User";

interface SignUpProps {
    onSignUp: () => Promise<void>
}

interface SignUpState {
    signedUp: boolean
}

class SignUp extends React.Component<SignUpProps, SignUpState> {

    public state: SignUpState = {
        signedUp: false
    }

    public constructor(props: SignUpProps | Readonly<SignUpProps>) {
        super(props);
    }

    private redirectIfSignedUp(): React.ReactNode {
        if(this.state.signedUp) {
            return (<Navigate to="/dashboard" />);
        }
    }

    private async confirmSignUp(): Promise<void> {
        await this.props.onSignUp();
        this.setState({signedUp: true});
    }

    public render(): React.ReactNode {
        return (
            <div className="max-width-50nbp-sm mx-auto">
                {this.redirectIfSignedUp()}
                <p className="h1 text-center mb-4">Registro de nuevo usuario</p>
                <UserDataForm user={User.GUEST} onPersistData={this.confirmSignUp.bind(this)} />
            </div>
        );
    }
}

export default SignUp;