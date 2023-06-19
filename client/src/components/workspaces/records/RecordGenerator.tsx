import React from "react";

interface RecordGeneratorProps {

}

interface RecordGeneratorState {

}

class RecordGenerator extends React.Component<RecordGeneratorProps, RecordGeneratorState> {

    public state: RecordGeneratorState = {

    }

    public constructor(props: RecordGeneratorProps | Readonly<RecordGeneratorProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            Generador de movimientos
        </>);
    }
}

export default RecordGenerator;
