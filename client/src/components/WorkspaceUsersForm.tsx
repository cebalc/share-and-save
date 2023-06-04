import React from "react";

interface WorkspaceUsersFormProps {

}

interface WorkspaceUsersFormState {

}

class WorkspaceUsersForm extends React.Component<WorkspaceUsersFormProps, WorkspaceUsersFormState> {
    public state: WorkspaceUsersFormState = {

    }

    public constructor(props: WorkspaceUsersFormProps | Readonly<WorkspaceUsersFormProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>Formulario para editar usuarios del espacio</>);
    }
}

export default WorkspaceUsersForm;
