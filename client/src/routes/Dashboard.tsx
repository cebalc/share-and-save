import React from "react";
import { Navigate } from "react-router-dom";
import WorkspaceList from "../components/WorkspaceList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface DashboardProps {
    userId: number,
    userName: string
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
              <p className="h1">Tablero de {this.props.userName}</p>
              <WorkspaceList userId={this.props.userId} />
              <Row>
                <Col sm={6}>Ajustes de usuario</Col>
                <Col sm={6}>Cerrar sesión</Col>
              </Row>
          </>
        );
    }
}

export default Dashboard;
