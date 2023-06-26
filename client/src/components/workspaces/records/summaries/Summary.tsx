import React from "react";
import SummaryData from "../../../../objects/entities/SummaryData";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import User from "../../../../objects/entities/User";
import Table from "react-bootstrap/Table";
import {formatEUR} from "../../../../modules/misc";
import UserLevel from "../../../../objects/enums/UserLevel";

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

    public getUsersFromSummaryData(summaryData: SummaryData): User[] {
        let users: User[] = [];
        summaryData.categories.forEach(categorySummary => {
            categorySummary.users.forEach(userSummary => {
                if(!users.some(user => user.id === userSummary.user.id)) {
                    users.push(new User(userSummary.user.id, userSummary.user.name, "", "", UserLevel.ANONYMOUS));
                }
            });
        })
        return users;
    }

    public render(): React.ReactNode {
        if(this.props.summaryData.length === 0) {
            return (
                <Alert variant="info">
                    No se han encontrado movimientos con las características solicitadas
                </Alert>
            );
        }
        return this.props.summaryData.map(typeSummary =>
            <Container key={typeSummary.type.id} fluid>
                <p className="h4 text-center">Tipo de movimiento: {typeSummary.type.label}</p>
                <Table striped bordered hover responsive>
                    <tr>
                        <th>Categoría</th>
                    {this.getUsersFromSummaryData(typeSummary).map(user =>
                        <th key={user.id}>{user.name}</th>
                    )}
                    </tr>
                    {typeSummary.categories.map(categorySummary =>
                        <tr key={categorySummary.category.id}>
                            <td>{categorySummary.category.name}</td>
                            {categorySummary.users.map(userSummary =>
                                <td>{formatEUR(userSummary.value)}</td>
                            )}
                        </tr>
                    )}
                </Table>
            </Container>
        );
    }
}

export default Summary;
