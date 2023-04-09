import React from "react";

interface FooterProps {
}

interface FooterState {
}

class Footer extends React.Component<FooterProps, FooterState> {
    public state: FooterState = {
    };

    public constructor(props: FooterProps | Readonly<FooterProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <div>Footer</div>
        );
    }
}

export default Footer;
