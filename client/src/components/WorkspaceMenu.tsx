import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";

interface WorkspaceMenuProps {
    workspaceId: number,
    userIsAdmin: boolean
}

interface MenuItem {
    mapping: string,
    label: string,
    onlyForAdmins: boolean
}

const WorkspaceMenu = (props: WorkspaceMenuProps): JSX.Element => {

    let menuItems: MenuItem[] = [
        {
            mapping: `/workspace/${props.workspaceId}/records`,
            label: "Lista de movimientos",
            onlyForAdmins: false
        },
        {
            mapping: `/workspace/${props.workspaceId}/edit`,
            label: "Editar nombre y descripción",
            onlyForAdmins: true
        },
        {
            mapping: "/dashboard",
            label: "Volver a tablero",
            onlyForAdmins: false
        }
    ];

    return (
        <div className="mx-auto max-width-50nbp-sm d-flex flex-column">
        {menuItems.map((menuItem: MenuItem, index: number) =>
            <LinkContainer key={index} to={menuItem.mapping}>
                <Button variant="outline-primary" className="m-2"
                    disabled={menuItem.onlyForAdmins && !props.userIsAdmin}>
                    {menuItem.label}
                </Button>
            </LinkContainer>
        )}
        </div>
    )
}

export default WorkspaceMenu;
