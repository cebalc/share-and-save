import React from "react";

interface PremiumSubscriptionEditorProps {
    userId: number
}

interface PremiumSubscriptionEditorState {

}

class PremiumSubscriptionEditor extends React.Component<PremiumSubscriptionEditorProps, PremiumSubscriptionEditorState> {

    public state: PremiumSubscriptionEditorState = {

    }

    public constructor(props: PremiumSubscriptionEditorProps | Readonly<PremiumSubscriptionEditorProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            
        </>);
    }
}

export default PremiumSubscriptionEditor;
