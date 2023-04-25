import React from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

interface NMOProps {
    to: string
    children: React.ReactNode
}

class NavMenuOption extends React.Component<NMOProps> {

    public constructor(props: NMOProps | Readonly<NMOProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <Nav.Link className="d-flex flex-column justify-content-center">
                <LinkContainer to="{this.props.to}"><>{this.props.children}</></LinkContainer>
            </Nav.Link>
        );
    }
}

export default NavMenuOption;
