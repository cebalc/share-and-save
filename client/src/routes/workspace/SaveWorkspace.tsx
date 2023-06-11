import React from "react";
import Workspace from "../../objects/entities/Workspace";
import WorkspaceDetailsForm from "../../components/WorkspaceDetailsForm";
import {Navigate} from "react-router-dom";

interface SaveWorkspaceProps {
    workspace: Workspace
    onSave: () => void
}

interface SaveWorkspaceState {
    saved: boolean,
    savedWorkspaceId: number
}

class SaveWorkspace extends React.Component<SaveWorkspaceProps, SaveWorkspaceState> {

    public state: SaveWorkspaceState = {
        saved: false,
        savedWorkspaceId: this.props.workspace.id
    };

    public constructor(props: SaveWorkspaceProps | Readonly<SaveWorkspaceProps>) {
        super(props);
    }

    public buildPageTitle(): string {
        let titleVerb: string = (this.props.workspace === Workspace.NULL ? "Crear" : "Editar");
        return `${titleVerb} espacio de trabajo`;
    }

    private redirectIfSaved(): React.ReactNode {
        if(this.state.saved) {
            return (<Navigate to={`/workspace/${this.state.savedWorkspaceId}`} />);
        }
    }

    private confirmPersistence(savedWorkspaceId: number): void {
        this.props.onSave();
        this.setState({
            saved: true,
            savedWorkspaceId: savedWorkspaceId
        });
    }

    public render(): React.ReactNode {
        return (<>
            {this.redirectIfSaved()}
            <p className="h1 text-center">{this.buildPageTitle()}</p>
            <WorkspaceDetailsForm workspace={this.props.workspace} onPersistData={this.confirmPersistence.bind(this)} />
        </>);
    }
}

export default SaveWorkspace;
