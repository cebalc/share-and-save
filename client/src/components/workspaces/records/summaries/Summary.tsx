import React from "react";
import SummaryData from "../../../../objects/entities/SummaryData";

interface SummaryProps {
    summaryData: SummaryData[]
}

interface SummaryState {

}

class Summary extends React.Component<SummaryProps, SummaryState> {

    public state: SummaryState = {

    };

    public constructor(props: Readonly<SummaryProps> | SummaryProps) {
        super(props);
    }


    public render(): React.ReactNode {
        return <>Tabla de resumen</>;
    }
}

export default Summary;
