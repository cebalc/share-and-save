import React from "react";
import UserLevel from "../../../../objects/enums/UserLevel";
import ComingSoon from "../../../misc/ComingSoon";
import Alert from "react-bootstrap/Alert";
import {LinkContainer} from "react-router-bootstrap";
import WarningIcon from "../../../../images/warning-icon.webp";

interface AdvancedFeaturesManagerProps {
    userLevel: number
}

interface AdvancedFeaturesManagerState {

}

class AdvancedFeaturesManager extends React.Component<AdvancedFeaturesManagerProps, AdvancedFeaturesManagerState> {

    public state: AdvancedFeaturesManagerState = {

    };

    public constructor(props: Readonly<AdvancedFeaturesManagerProps> | AdvancedFeaturesManagerProps) {
        super(props);
    }


    public render(): React.ReactNode {
        if(this.props.userLevel < UserLevel.PREMIUM) {
            return (
                <Alert variant="warning" className="max-width-75nbp-md mx-auto my-5">
                    <p className="display-4 text-center py-3">Acceso restringido</p>
                    <div className="w-25 mx-auto">
                        <img className="d-block mx-auto w-50" src={WarningIcon} alt="Restringido" />
                    </div>
                    <p className="mt-4 text-center h5">
                        Esta sección solo es accesible para los usuarios Premium.<br />
                        <LinkContainer to="/settings">
                            <Alert.Link>Mejora ahora tu suscripción a Usuario Premium</Alert.Link>
                        </LinkContainer>
                    </p>
                </Alert>
            );
        }
        return <ComingSoon />
    }
}

export default AdvancedFeaturesManager;
