import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkContainer } from "react-router-bootstrap";

interface UserDropdownProps {
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
                    <Dropdown.Header>Usuario no identificado</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        <LinkContainer to="/"><>Iniciar sesión</></LinkContainer>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <LinkContainer to="/"><>Registro</></LinkContainer>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default UserDropdown;
