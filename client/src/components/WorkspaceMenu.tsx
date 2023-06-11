import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

interface WorkspaceMenuProps {
    workspaceId: number
}

interface MenuItem {
    mapping: string,
    label: string
}

const WorkspaceMenu = (props: WorkspaceMenuProps): JSX.Element => {

    let menuItems: MenuItem[] = [
        {
            mapping: `/workspace/${props.workspaceId}/records`,
            label: "Lista de movimientos"
        },
        {
            mapping: `/workspace/${props.workspaceId}/edit`,
            label: "Editar nombre y descripción"
        },
        {
            mapping: "/dashboard",
            label: "Volver a tablero"
        }
    ];

    return (
        <div className="mx-auto max-width-50nbp-sm d-flex flex-column">
        {menuItems.map((menuItem: MenuItem, index: number) =>
            <LinkContainer key={index} to={menuItem.mapping}>
                <Button variant="outline-primary" className="m-2">{menuItem.label}</Button>
            </LinkContainer>
        )}
        </div>
    )
}

export default WorkspaceMenu;
