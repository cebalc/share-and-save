import React from "react";
import Workspace from "../../../objects/entities/Workspace";

interface AlterRecordProps {
    workspace: Workspace
}

interface AlterRecordState {

}

class AlterRecord extends React.Component<AlterRecordProps, AlterRecordState> {

    public state: AlterRecordState = {

    }

    public constructor(props: AlterRecordProps | Readonly<AlterRecordProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            Editor de movimiento
        </>);
    }
}

export default AlterRecord;
