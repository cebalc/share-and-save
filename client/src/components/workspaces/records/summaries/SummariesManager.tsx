import React from "react";

interface SummariesManagerProps {

}

interface SummariesManagerState {

}

class SummariesManager extends React.Component<SummariesManagerProps, SummariesManagerState> {

    public state: SummariesManagerState = {

    };

    public constructor(props: Readonly<SummariesManagerProps> | SummariesManagerProps) {
        super(props);
    }


    public render(): React.ReactNode {
        return <>Resúmenes de gastos e ingresos</>;
    }
}

export default SummariesManager;
