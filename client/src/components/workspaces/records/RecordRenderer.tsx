import Record from "../../../objects/entities/Record";
import Alert from "react-bootstrap/Alert";
import RecordsList from "./RecordsList";
import RecordsTable from "./RecordsTable";
import React from "react";

interface RecordRendererProps {
    records: Record[]
    showList: boolean
    noRecordsMsg: string
}

const RecordRenderer = (props: RecordRendererProps): JSX.Element => {
    if(props.records === null || props.records.length === 0) {
        return (<Alert variant="info">{props.noRecordsMsg}</Alert>);
    }
    if(props.showList) {
        return <RecordsList records={props.records} />;
    }
    return <RecordsTable records={props.records} />;
}

export default RecordRenderer;
