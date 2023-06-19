import React from "react";
import Record from "../../../objects/entities/Record";
import DateTimeTools from "../../../objects/DateTimeTools";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

interface RecordsTableRowProps {
    record: Record
}

interface RecordsTableRowState {

}

class RecordsTableRow extends React.Component<RecordsTableRowProps, RecordsTableRowState> {

    public state: RecordsTableRowState = {

    }

    public constructor(props: RecordsTableRowProps | Readonly<RecordsTableRowProps>) {
        super(props);
    }

    private formatEUR(amount: number) {
        return amount.toLocaleString("es-ES", {style: "currency", currency: "EUR"});
    }

    public render(): React.ReactNode {
        return (
            <tr>
                <CenteredCell>
                    <ButtonGroup size="sm">
                        <Button variant="outline-primary">
                            <FontAwesomeIcon icon={["fas", "pencil"]} size="1x" />
                        </Button>
                        <Button variant="outline-secondary">
                            <FontAwesomeIcon icon={["fas", "hand-holding-dollar"]} size="1x" />
                        </Button>
                        <Button variant="outline-danger">
                            <FontAwesomeIcon icon={["fas", "xmark"]} size="1x" />
                        </Button>
                    </ButtonGroup>
                </CenteredCell>
                <CenteredCell>
                    {this.props.record.type.label}
                </CenteredCell>
                <CenteredCell>
                    {DateTimeTools.getFormattedDate(this.props.record.date)}
                </CenteredCell>
                <CenteredCell>{this.props.record.description}</CenteredCell>
                <td className="text-end">
                    {this.formatEUR(this.props.record.amount)}
                </td>
                <CenteredCell>
                    {this.props.record.user.name}
                </CenteredCell>
                <CenteredCell>
                    <SharedIcon shared={this.props.record.shared} />
                </CenteredCell>
                <CenteredCell>
                    {this.props.record.category.name}
                </CenteredCell>
                <CenteredCell>{this.props.record.place.name}</CenteredCell>
                <CenteredCell>{this.props.record.reference}</CenteredCell>
            </tr>
        );
    }
}

const SharedIcon = (props: {shared: boolean}): JSX.Element => {
    let iconName: IconName = "square-check";
    let colorClass: string = "text-success";
    if(!props.shared) {
        iconName = "square-xmark";
        colorClass = "text-danger";
    }
    return <FontAwesomeIcon icon={["fas", iconName]} size="1x" className={colorClass} />
}

const CenteredCell = (props: {children: React.ReactNode}): JSX.Element => {
    return <td className="text-center">{props.children}</td>;
}

export default RecordsTableRow;
