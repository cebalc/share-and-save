import React from "react";
import { Navigate } from "react-router-dom";

interface DashboardProps {
    userId: number
}

interface DashboardState {

}

class Dashboard extends React.Component<DashboardProps, DashboardState> {

    public static defaultProps = {
        userId: 0
    }

    public state: DashboardState = {
    };

    public constructor(props: DashboardProps | Readonly<DashboardProps>) {
        super(props);
        console.log(props);
    }

    private preventAnonymousUsers(): React.ReactNode {
        if(this.props.userId === 0) {
            return (<Navigate to="/signin" />);
        }
    }

    public render(): React.ReactNode {
        return (
          <>
              {this.preventAnonymousUsers()}
              <h1>Bienvenido al área privada</h1>
          </>
        );
    }
}

export default Dashboard;
