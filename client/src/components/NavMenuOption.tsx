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
            <LinkContainer to={this.props.to}>
                <Nav.Link className="d-flex flex-column justify-content-center">{this.props.children}</Nav.Link>
            </LinkContainer>
        );
    }
}

export default NavMenuOption;
