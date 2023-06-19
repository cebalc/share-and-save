import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

interface CellHeaderProps {
    iconFamily: IconPrefix,
    iconName: IconName,
    tooltip: string
}

const fieldsData = (): CellHeaderProps[] => {
    return [
        {iconFamily: "fas", iconName: "plus-minus", tooltip: "Tipo (+ = ingreso, - = gasto)"},
        {iconFamily: "fas", iconName: "calendar-days", tooltip: "Fecha (dd/mm/aaaa)"},
        {iconFamily: "fas", iconName: "align-left", tooltip: "Descripción"},
        {iconFamily: "fas", iconName: "coins", tooltip: "Cantidad (€)"},
        {iconFamily: "fas", iconName: "user", tooltip: "Usuario"},
        {iconFamily: "fas", iconName: "users", tooltip: "Gasto compartido"},
        {iconFamily: "fas", iconName: "cart-shopping", tooltip: "Categoría"},
        {iconFamily: "fas", iconName: "shop", tooltip: "Lugar o establecimiento"},
        {iconFamily: "fas", iconName: "barcode", tooltip: "Referencia interna (p. ej. nº ticket)"}
    ];
}

const RecordTableHeader = (): JSX.Element => {
    return (
        <thead>
            <tr>
                <th key={fieldsData().length}></th>
                {fieldsData().map((fieldData, index) =>
                    <CellHeader key={index} {...fieldData} />
                )}
            </tr>
        </thead>
    )
}

const CellHeader = (props: CellHeaderProps): JSX.Element => {
    return (
        <th className="text-center">
            <OverlayTrigger placement="top" delay={{show: 250, hide: 400}}
                            overlay={<Tooltip>{props.tooltip}</Tooltip>}>
                <FontAwesomeIcon icon={[props.iconFamily, props.iconName]} size="2x"
                                 className="clickable text-primary" />
            </OverlayTrigger>
        </th>
    )
}

export default RecordTableHeader;
