import React from "react";
import Table from "react-bootstrap/Table";
import RecordTableHeader from "./RecordTableHeader";
import RecordsTableRow from "./RecordsTableRow";
import Record from "../../../objects/entities/Record"

interface RecordsTableProps {
    records: Record[]
}

interface RecordsTableState {

}

class RecordsTable extends React.Component<RecordsTableProps, RecordsTableState> {

    public state: RecordsTableState = {

    }

    public constructor(props: RecordsTableProps | Readonly<RecordsTableProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Table striped hover responsive>
                <RecordTableHeader />
                <tbody>
                {this.props.records.map(record =>
                    <RecordsTableRow key={record.id} record={record} />
                )}
                </tbody>
            </Table>
        );
    }
}

export default RecordsTable;
