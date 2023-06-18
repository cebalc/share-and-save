import React from "react";
import UserLevel from "../../objects/enums/UserLevel";
import LevelCard from "./LevelCard";
import LevelsTable from "./LevelsTable";
import SubscriptionEditor from "./SubscriptionEditor";
import OptionalTextAlert from "../misc/OptionalTextAlert";

interface SubscriptionStatusProps {
    userId: number,
    userLevel: UserLevel,
    onStatusChanged: () => Promise<void>
}

interface SubscriptionStatusState {

}

class SubscriptionStatus extends React.Component<SubscriptionStatusProps, SubscriptionStatusState> {

    public state: SubscriptionStatusState = {

    };

    private statusUpdatedAlert: React.RefObject<OptionalTextAlert>;

    public constructor(props: SubscriptionStatusProps | Readonly<SubscriptionStatusProps>) {
        super(props);
        this.statusUpdatedAlert = React.createRef();
    }

    private async confirmEdition(): Promise<void> {
        await this.props.onStatusChanged();
        this.statusUpdatedAlert.current !== null &&
            this.statusUpdatedAlert.current.setState({show: true});
    }

    public render(): React.ReactNode {
        return (<>
            <OptionalTextAlert ref={this.statusUpdatedAlert} dismissible variant="info"
                               text="Tu suscripción se ha actualizado correctamente." />
            <LevelCard level={this.props.userLevel} />
            <LevelsTable show={this.props.userLevel < UserLevel.PREMIUM} />
            <SubscriptionEditor userId={this.props.userId} userLevel={this.props.userLevel} onSubscriptionEdited={this.confirmEdition.bind(this)} />
        </>);
    }
}

export default SubscriptionStatus;
