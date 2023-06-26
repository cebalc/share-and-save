import React from "react";
import ComingSoon from "../../../misc/ComingSoon";

interface DebtsManagerProps {

}

interface DebtsManagerState {

}

class DebtsManager extends React.Component<DebtsManagerProps, DebtsManagerState> {

    public state: DebtsManagerState = {

    };

    public constructor(props: Readonly<DebtsManagerProps> | DebtsManagerProps) {
        super(props);
    }


    public render(): React.ReactNode {
        return <ComingSoon />;
    }
}

export default DebtsManager;
