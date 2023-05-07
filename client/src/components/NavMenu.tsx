import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import NavMenuOption from "./NavMenuOption";
import UserDropdown from "./UserDropdown";

interface NavMenuProps {
    userlevel: number,
    username: string
}

class NavMenu extends React.Component<NavMenuProps> {

    public constructor(props: NavMenuProps | Readonly<NavMenuProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Navbar bg="primary" expand="md" variant="dark">
                <Container fluid>
                    <LinkContainer to="/">
                        <Navbar.Brand title="Home">
                            <img src="/img/logo_SnS.png" alt="S&S" className="brand-logo" />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="mainmenu" />
                    <Navbar.Collapse id="mainmenu">
                        <Nav className="ms-auto">
                            <NavMenuOption to="/about">Quiénes somos</NavMenuOption>
                            <NavMenuOption to="#contact-data" anchor>Contacto</NavMenuOption>
                            <UserDropdown userlevel={this.props.userlevel} username={this.props.username} />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavMenu;
