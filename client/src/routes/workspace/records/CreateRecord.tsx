import React from "react";
import Workspace from "../../../objects/entities/Workspace";

interface CreateRecordProps {
    workspace: Workspace
}

interface CreateRecordState {

}

class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    public state: CreateRecordState = {

    }

    public constructor(props: CreateRecordProps | Readonly<CreateRecordProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            Generador de movimientos
        </>);
    }
}

export default CreateRecord;
