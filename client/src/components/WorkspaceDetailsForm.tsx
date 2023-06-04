import React from "react";

interface WorkspaceDetailsFormProps {

}

interface WorkspaceDetailsFormState {

}

class WorkspaceDetailsForm extends React.Component<WorkspaceDetailsFormProps, WorkspaceDetailsFormState> {
    public state: WorkspaceDetailsFormState = {

    }

    public constructor(props: WorkspaceDetailsFormProps | Readonly<WorkspaceDetailsFormProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>Formulario para editar nombre y descripción o borrar</>);
    }
}

export default WorkspaceDetailsForm;
