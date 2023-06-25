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
        let recordType = RecordType.of(record.type.id);
        let actionVerb: string = "Aportado";
        if(recordType !== undefined) {
            actionVerb = recordType.verb;
        }
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
            <LinkContainer key={record.id} to={this.buildLinkURL(record)}>
                <Container fluid className="table-row p-2 clickable" id={`r-${record.id}`}>
                    <Container fluid className={this.buildFirstRowClassName(record.type === RecordType.EARN)}>
                        <div className="me-2">{record.description}</div>
                        <div>{formatEUR(record.amount)}</div>
                    </Container>
                    <Container fluid className="d-flex justify-content-between flex-wrap">
                        <div>{RecordsList.buildUsersInfo(record)}</div>
                        <div>{DateTimeTools.getFormattedDate(new Date(record.date))}</div>
                    </Container>
                </Container>
            </LinkContainer>

        );
    }
}

export default RecordsList;
