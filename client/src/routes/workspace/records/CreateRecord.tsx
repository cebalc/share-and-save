import React from "react";
import Workspace from "../../../objects/entities/Workspace";
import Record from "../../../objects/entities/Record"
import SaveRecordForm from "../../../components/workspaces/records/SaveRecordForm";
import NavigateToSavedRecord from "../../../components/workspaces/records/NavigateToSavedRecord";

interface CreateRecordProps {
    userId: number,
    workspace: Workspace,
}

interface CreateRecordState {
    createdRecordId: number
}

class CreateRecord extends React.Component<CreateRecordProps, CreateRecordState> {

    public state: CreateRecordState = {
        createdRecordId: Record.NEW.id
    };

    public constructor(props: CreateRecordProps | Readonly<CreateRecordProps>) {
        super(props);
    }

    private confirmCreation(createdRecordId: number): void {
        this.setState({createdRecordId: createdRecordId});
    }

    private redirectIfCreated(): React.ReactNode {
        if(this.state.createdRecordId !== Record.NEW.id) {
            return <NavigateToSavedRecord workspace={this.props.workspace.id} record={this.state.createdRecordId} />
        }
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfCreated()}
            <p className="h1 text-center mb-4">Añadir movimiento</p>
            <SaveRecordForm userId={this.props.userId} workspace={this.props.workspace} record={Record.NEW}
                onSave={this.confirmCreation.bind(this)} />
        </>);
    }
}

export default CreateRecord;
