import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

interface NavMenuProps {
}

interface NavMenuState {
}

class NavMenu extends React.Component<NavMenuProps, NavMenuState> {
    public state: NavMenuState = {
    };

    public constructor(props: NavMenuProps | Readonly<NavMenuProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Navbar bg="primary" expand="md" variant="dark">
                <Container fluid>
                    <LinkContainer to="/">
                        <Navbar.Brand title="Home">S&S</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="mainmenu" />
                    <Navbar.Collapse id="mainmenu">
                        <Nav className="ms-auto">
                            <LinkContainer to="/">
                                <Nav.Link>Quiénes somos</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/">
                                <Nav.Link>Contacto</Nav.Link>
                            </LinkContainer>
                            <Dropdown align="end">
                                <DropdownToggle>
                                    <FontAwesomeIcon icon={faCircleUser} />
                                    Usuario
                                </DropdownToggle>
                                <Dropdown.Menu className="bg-primary">
                                    <LinkContainer to="/">
                                        <Dropdown.Item>Iniciar sesión</Dropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/">
                                        <Dropdown.Item>Registro</Dropdown.Item>
                                    </LinkContainer>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavMenu;
