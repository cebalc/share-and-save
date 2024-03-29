import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import {LinkContainer} from "react-router-bootstrap";
import NavMenuOption from "./NavMenuOption";
import UserDropdown from "../users/UserDropdown";
import LogoSnS from "../../images/logo_SnS.png";
import UserLevel from "../../objects/enums/UserLevel";

interface NavMenuProps {
    userLevel: UserLevel,
    userName: string
}

class NavMenu extends React.Component<NavMenuProps> {

    public constructor(props: NavMenuProps | Readonly<NavMenuProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Navbar bg="primary" expand="md" variant="dark">
                <Container fluid>
                    <LinkContainer to={this.props.userLevel !== UserLevel.ANONYMOUS ? "/dashboard" : "/"}>
                        <Navbar.Brand title="Home">
                            <img src={LogoSnS} alt="S&S" className="brand-logo" />
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="mainmenu" />
                    <Navbar.Collapse id="mainmenu">
                        <Nav className="ms-auto">
                            <NavMenuOption to="/about">Quiénes somos</NavMenuOption>
                            <NavMenuOption to="#contact-data" anchor>Contacto</NavMenuOption>
                            <UserDropdown userLevel={this.props.userLevel} userName={this.props.userName} />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

export default NavMenu;
