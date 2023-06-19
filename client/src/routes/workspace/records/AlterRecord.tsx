import React from "react";
import Workspace from "../../../objects/entities/Workspace";

interface AlterRecordProps {
    workspace: Workspace,
    recordId: number
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
            Editor de movimiento nº {this.props.recordId}
        </>);
    }
}

export default AlterRecord;
