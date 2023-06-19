import React from "react";

interface RecordEditorProps {

}

interface RecordsEditorState {

}

class RecordsEditor extends React.Component<RecordEditorProps, RecordsEditorState> {

    public state: RecordsEditorState = {

    }

    public constructor(props: RecordEditorProps | Readonly<RecordEditorProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            Editor de movimiento
        </>);
    }
}

export default RecordsEditor;
