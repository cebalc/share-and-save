import React from "react";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { scrollIntoContactData } from "../../modules/misc";

interface NMOProps {
    to: string
    anchor?: boolean,
    children: React.ReactNode
}

class NavMenuOption extends React.Component<NMOProps> {

    private static defaultProps = {
        anchor: false
    };

    public constructor(props: NMOProps | Readonly<NMOProps>) {
        super(props);
    }

    private containerLink(): React.ReactNode {
        return (
            <LinkContainer to={this.props.to}>
                <Nav.Link className="d-flex flex-column justify-content-center">{this.props.children}</Nav.Link>
            </LinkContainer>
        );
    }

    private anchorLink(): React.ReactNode {
        return (
            <Nav.Link
                className="d-flex flex-column justify-content-center"
                onClick={() => scrollIntoContactData()}>
                {this.props.children}
            </Nav.Link>
        );
    }

    public render(): React.ReactNode {
        return this.props.anchor ? this.anchorLink() : this.containerLink();
    }
}

export default NavMenuOption;
