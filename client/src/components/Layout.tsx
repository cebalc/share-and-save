import React from "react";

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
            <></>
        );
    }
}

export default Layout;
