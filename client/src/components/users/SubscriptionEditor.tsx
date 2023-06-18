import React from "react";
import UserLevel from "../../objects/enums/UserLevel";
import RegUserSubscriptionEditor from "./RegUserSubscriptionEditor";
import PremiumSubscriptionEditor from "./PremiumSubscriptionEditor";
import AdminSubscriptionEditor from "./AdminSubscriptionEditor";

interface SubscriptionEditorProps {
    userId: number,
    userLevel: UserLevel,
    onSubscriptionEdited: () => Promise<void>
}

const SubscriptionEditor = (props: SubscriptionEditorProps): JSX.Element => {

    const editors: Map<UserLevel, JSX.Element> = new Map([
        [UserLevel.ANONYMOUS, <></>],
        [UserLevel.REGISTERED, <RegUserSubscriptionEditor userId={props.userId} onUpgrade={props.onSubscriptionEdited} />],
        [UserLevel.PREMIUM, <PremiumSubscriptionEditor userId={props.userId} />],
        [UserLevel.ADMIN, <AdminSubscriptionEditor />]
    ]);

    return editors.get(props.userLevel) as JSX.Element;
}

export default SubscriptionEditor;
