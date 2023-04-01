import React from "react";

interface HomeProps {
}

interface HomeState {
}

class Home extends React.Component<HomeProps, HomeState> {
    public state: HomeState = {
    }

    public constructor(props: HomeProps | Readonly<HomeProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <></>
        );
    }
}

export default Home;
