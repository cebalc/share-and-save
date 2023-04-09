import React from "react";
import { Outlet } from "react-router-dom";
import NavMenu from "./NavMenu";
import Footer from "./Footer";

interface LayoutProps {
}

interface LayoutState {
}

class Layout extends React.Component<LayoutProps, LayoutState> {
    public state: LayoutState = {
    };

    public constructor(props: LayoutProps | Readonly<LayoutProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <>
                <NavMenu />
                <Outlet />
                <Footer />
            </>
        );
    }
}

export default Layout;
