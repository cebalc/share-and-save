import React from "react";

interface DashboardProps {

}

interface DashboardState {

}

class Dashboard extends React.Component<DashboardProps, DashboardState> {
    public state: DashboardState = {

    };

    public constructor(props: DashboardProps | Readonly<DashboardProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return <h1>Bienvenido al área privada</h1>;
    }
}

export default Dashboard;
