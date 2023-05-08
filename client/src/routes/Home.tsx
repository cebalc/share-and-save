import React from "react";
import Alert from "react-bootstrap/Alert";
import SignOutFetcher from "../objects/fetchers/SignOutFetcher";

interface HomeProps {
    signOut?: boolean
    onSignOut?: () => Promise<void>
}

interface HomeState {
}

class Home extends React.Component<HomeProps, HomeState> {

    private static defaultProps = {
        signOut: false,
        onSignOut: () => true
    }

    public state: HomeState = {
    }

    public constructor(props: HomeProps | Readonly<HomeProps>) {
        super(props);
        if(this.props.signOut) {
            new SignOutFetcher().retrieveData().then(() => {
                if(this.props.onSignOut !== undefined) {
                    this.props.onSignOut();
                }
            });
        }
    }

    public render(): React.ReactNode {
        return (
            <>
                {
                    this.props.signOut ?
                        <Alert variant="success">Sesión cerrada correctamente</Alert>
                        :
                        <></>
                }
                <h1>Homepage Share and Save</h1>
            </>
        );
    }
}

export default Home;
