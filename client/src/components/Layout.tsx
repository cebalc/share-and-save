import React from "react";
import { Outlet } from "react-router-dom";
import NavMenu from "./NavMenu";
import Footer from "./Footer";
import Container from "react-bootstrap/Container";

interface LayoutProps {
    userLevel: number,
    userName: string,
    fluid: boolean | "sm" | "md" | "lg" | "xl" | "xxl"
}

interface LayoutState {
}

abstract class Layout extends React.Component<LayoutProps, LayoutState> {
    public state: LayoutState = {
    };

    public constructor(props: LayoutProps | Readonly<LayoutProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <>
                <header>
                    <NavMenu userLevel={this.props.userLevel} userName={this.props.userName} />
                </header>
                <Container fluid className="m-0 py-4" as="main">
                    <Container fluid={this.props.fluid} className="rounded-3 opacity-95 bg-light shadow-lg p-4 ms-auto my-4">
                        <Outlet />
                    </Container>
                </Container>
                <Footer />
            </>
        );
    }
}

export default Layout;
