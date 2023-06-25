import React from "react";
import Workspace from "../../../objects/entities/Workspace";
import SaveRecordForm from "../../../components/workspaces/records/SaveRecordForm";
import Record from "../../../objects/entities/Record";
import GeneralPlaceholder from "../../../components/misc/GeneralPlaceholder";
import ReadRecordFetcher from "../../../objects/fetchers/workspaces/records/ReadRecordFetcher";
import Alert from "react-bootstrap/Alert";
import NavigateToSavedRecord from "../../../components/workspaces/records/NavigateToSavedRecord";
import {Navigate} from "react-router-dom";

interface AlterRecordProps {
    userId: number,
    workspace: Workspace,
    recordId: number
}

interface AlterRecordState {
    fetching: boolean,
    record: Record | null,
    updated: boolean,
    deleted: boolean,
}

class AlterRecord extends React.Component<AlterRecordProps, AlterRecordState> {

    public state: AlterRecordState = {
        fetching: true,
        record: null,
        updated: false,
        deleted: false
    }

    public constructor(props: AlterRecordProps | Readonly<AlterRecordProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        await this.getRecord();
    }

    private async getRecord(): Promise<void> {
        let fetcher: ReadRecordFetcher = new ReadRecordFetcher(this.props.workspace.id, this.props.recordId);
        if(!await fetcher.retrieveData()) {
            this.setState({fetching: false});
        }
        let responseData: Record[] = fetcher.getResponseData();
        console.log(responseData);
        this.setState({
            fetching: false,
            record: fetcher.success() ? responseData[0] : null
        });
    }

    private confirmUpdated(): void {
        this.setState({updated: true});
    }

    private confirmDelete(): void {
        this.setState({deleted: true});
    }

    private redirectIfUpdated(): React.ReactNode {
        if(this.state.updated) {
            return <NavigateToSavedRecord workspace={this.props.workspace.id} record={this.props.recordId} />;
        }
    }

    private redirectIfDeleted(): React.ReactNode {
        if(this.state.deleted) {
            return <Navigate to={`/workspace/${this.props.workspace}/records`} />;
        }
    }

    private renderForm(): React.ReactNode {
        if(this.state.fetching) {
            return <GeneralPlaceholder />
        }
        if(this.state.record === null) {
            return <Alert variant="danger">Ha ocurrido un error al recuperar los datos.</Alert>
        }
        return <SaveRecordForm userId={this.props.userId} workspace={this.props.workspace} record={this.state.record}
                               onSave={this.confirmUpdated.bind(this)}
                               onDelete={this.confirmDelete.bind(this)} />
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfUpdated()}
            {this.redirectIfDeleted()}
            <p className="h1 text-center mb-4">Editar movimiento</p>
            {this.renderForm()}
        </>);
    }
}

export default AlterRecord;
