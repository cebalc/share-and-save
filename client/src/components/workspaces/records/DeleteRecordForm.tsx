import React from "react";

interface DeleteRecordFormProps {
    onDelete: () => void
}

interface DeleteRecordFormState {
    show: boolean
}

class DeleteRecordForm extends React.Component<DeleteRecordFormProps, DeleteRecordFormState> {

    public state: DeleteRecordFormState = {
        show: false
    };

    public constructor(props: Readonly<DeleteRecordFormProps> | DeleteRecordFormProps) {
        super(props);
    }

    public render(): React.ReactNode {
        return <></>;
    }
}

export default DeleteRecordForm;
