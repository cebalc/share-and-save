import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LinkContainer} from "react-router-bootstrap";
import User from "../objects/entities/User";
import UserLevel from "../objects/enums/UserLevel";

interface UserDropdownProps {
    userLevel: UserLevel,
    userName: string
}

class UserDropdown extends React.Component<UserDropdownProps> {

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
        let header: string = "";
        if(this.props.userLevel !== UserLevel.ANONYMOUS) {
            header += `${this.props.userName}: `;
        }
        header += User.getLabel(this.props.userLevel);
        return header;
    }

    private getDropdownItems(): React.ReactNode {
        if(this.props.userLevel !== UserLevel.ANONYMOUS) {
            return ( 
                <>
                <LinkContainer to="/settings">
                    <Dropdown.Item>Ajustes</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/signout">
                    <Dropdown.Item>Cerrar sesión</Dropdown.Item>
                </LinkContainer>
                </>
            )
        } else {
            return (
                <>
                <LinkContainer to="/signin">
                    <Dropdown.Item>Iniciar sesión</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/register">
                    <Dropdown.Item>Registro</Dropdown.Item>
                </LinkContainer>
                </>
            );
        }
    }
}

export default UserDropdown;
