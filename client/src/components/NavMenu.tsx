import React from "react";

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
            <></>
        );
    }
}

export default NavMenu;
