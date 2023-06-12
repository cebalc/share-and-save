import React from "react";

interface WorkspaceAddUserFormProps {

}

interface WorkspaceAddUserFormState {

}

class WorkspaceAddUserForm extends React.Component<WorkspaceAddUserFormProps, WorkspaceAddUserFormState> {
    public state: WorkspaceAddUserFormState = {

    }

    public constructor(props: WorkspaceAddUserFormProps | Readonly<WorkspaceAddUserFormProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div>
                Formulario para añadir usuarios
            </div>);
    }
}

export default WorkspaceAddUserForm;
