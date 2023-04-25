import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";

interface UserDropdownProps {
    userlevel: number,
    username: string
}

class UserDropdown extends React.Component<UserDropdownProps> {

    private static MSG_USER_UNKNOWN: string = "Usuario no identificado";
    private static LEVEL_USER: number = 1;
    private static LEVEL_PREMIUM: number = 2;
    private static LEVEL_ADMIN: number = 3;

    private static USER_LEVELS: Map<number, string> = new Map([
        [this.LEVEL_USER, "Usuario"],
        [this.LEVEL_PREMIUM, "Premium"],
        [this.LEVEL_ADMIN, "Administrador"]
    ]);

    public constructor(props: UserDropdownProps | Readonly<UserDropdownProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Dropdown align="end">
                <DropdownToggle className="p-2">
                    <FontAwesomeIcon icon={["fas", "circle-user"]} size="2x" />
                </DropdownToggle>
                <Dropdown.Menu>
                    <Dropdown.Header>{this.getDropdownHeader()}</Dropdown.Header>
                    <Dropdown.Divider />
                    {this.getDropdownItems()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    private getDropdownHeader(): string {
        if(!UserDropdown.USER_LEVELS.has(this.props.userlevel)) {
            return UserDropdown.MSG_USER_UNKNOWN;
        } else {
            return `${this.props.username}: ${UserDropdown.USER_LEVELS.get(this.props.userlevel)}`;
        }
    }

    private getDropdownItems(): React.ReactNode {
        if(UserDropdown.USER_LEVELS.has(this.props.userlevel)) {
            return ( 
                <>
                <Dropdown.Item>
                    <LinkContainer to="/"><>Ajustes</></LinkContainer>
                </Dropdown.Item>
                <Dropdown.Item>
                    <LinkContainer to="/"><>Cerrar sesión</></LinkContainer>
                </Dropdown.Item>
                </>
            )
        } else {
            return (
                <>
                <Dropdown.Item>
                    <LinkContainer to="/"><>Iniciar sesión</></LinkContainer>
                </Dropdown.Item>
                <Dropdown.Item>
                    <LinkContainer to="/"><>Registro</></LinkContainer>
                </Dropdown.Item>
                </>
            );
        }
    }
}



export default UserDropdown;
