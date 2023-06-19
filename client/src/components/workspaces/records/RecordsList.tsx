import Record from "../../../objects/entities/Record";
import React from "react";
import Container from "react-bootstrap/Container";
import {formatEUR} from "../../../modules/misc";
import RecordType from "../../../objects/enums/RecordType";
import DateTimeTools from "../../../objects/DateTimeTools";
import { LinkContainer } from "react-router-bootstrap";

interface RecordsListProps {
    records: Record[]
}

interface RecordsListState {

}

class RecordsList extends React.Component<RecordsListProps, RecordsListState> {

    private static buildUsersInfo(record: Record): string {
        const actionVerbs: Map<RecordType, string> = new Map([
            [RecordType.SPEND, "Pagado"],
            [RecordType.EARN, "Ingresado"]
        ]);
        let actionVerb: string = actionVerbs.get(record.type) as string;
        let sharedStatus: string = (record.shared ? "común" : "individual");
        return `${actionVerb} por ${record.user.name} (${sharedStatus})`;
    }

    public state: RecordsListState = {

    }

    public constructor(props: RecordsListProps | Readonly<RecordsListProps>) {
        super(props);
    }

    private buildLinkURL(record: Record): string {
        let workspaceId: number = record.workspace.id;
        let recordId: number = record.id;
        return `/workspace/${workspaceId}/records/${recordId}`;
    }

    private buildFirstRowClassName(isEarn: boolean): string {
        let className: string = "fw-bold d-flex justify-content-between flex-wrap";
        if(isEarn) {
            className += " text-success";
        }
        return className;
    }

    public render(): React.ReactNode {
        return this.props.records.map(record =>
            <LinkContainer to={this.buildLinkURL(record)}>
                <Container fluid key={record.id} className="table-row p-2 clickable">
                    <Container fluid className={this.buildFirstRowClassName(record.type === RecordType.EARN)}>
                        <div className="me-2">{record.description}</div>
                        <div>{formatEUR(record.amount)}</div>
                    </Container>
                    <Container fluid className="d-flex justify-content-between flex-wrap">
                        <div>{RecordsList.buildUsersInfo(record)}</div>
                        <div>{DateTimeTools.getFormattedDate(record.date)}</div>
                    </Container>
                </Container>
            </LinkContainer>

        );
    }
}

export default RecordsList;
