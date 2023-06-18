import Table from "react-bootstrap/Table";
import {Badge} from "react-bootstrap";

interface LevelsTableProps {
    show: boolean
}

const LevelsTable = (props: LevelsTableProps): JSX.Element => {

    const tableData: string[][] = [
        ["Registro de gastos e ingresos", "Sí", "Sí"],
        ["Gestión de deudas", "Sí", "Sí"],
        ["Resúmenes por categoría", "Sí", "Sí"],
        ["Varios espacios de trabajo", "Limitado", "Sin límite"],
        ["Uso de API", "Limitado", "Sin límite"],
        ["Funciones avanzadas", "No", "Sin límite"]
    ];

    if(props.show) {
        return (
            <Table responsive="md">
                <thead>
                <tr>
                    <th></th>
                    <th className="text-center">
                        <Badge className="d-block fs-6" bg="warning" text="dark">Usuario</Badge>
                        <div>Gratuito</div>
                    </th>
                    <th className="text-center">
                        <Badge className="d-block fs-6" bg="success">Premium</Badge>
                        <div>4.99 €/mes</div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {tableData.map((row, index) =>
                    <tr key={index} className="align-middle">
                        <td className="fst-italic fw-bold">{row[0]}</td>
                        <td className={
                            `text-center${row[1].match(/(No|Limitado)/) ? " text-danger fw-bold" : ""}`
                        }>
                            {row[1]}
                        </td>
                        <td className="text-center text-success fw-bold">{row[2]}</td>
                    </tr>
                )}
                </tbody>
            </Table>
        );
    }
    return <></>;
}

export default LevelsTable;
