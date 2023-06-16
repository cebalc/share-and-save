import React from "react";
import { Navigate } from "react-router-dom";
import WorkspaceList from "../components/workspaces/WorkspaceList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {LinkContainer} from "react-router-bootstrap";
import User from "../objects/entities/User";

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
        if(this.props.userId === User.GUEST.id) {
            return (<Navigate to="/signin" />);
        }
    }

    public render(): React.ReactNode {
        return (
          <>
              {this.preventAnonymousUsers()}
              <p className="h1 text-center">Tablero de {this.props.userName}</p>
              <WorkspaceList userId={this.props.userId} />
              <Row>
                <Col sm={6} className="d-flex justify-content-center my-2">
                    <LinkContainer to="/settings">
                        <Button variant="outline-primary">Ajustes de usuario</Button>
                    </LinkContainer>
                </Col>
                <Col sm={6} className="d-flex justify-content-center my-2">
                    <LinkContainer to="/signout">
                        <Button variant="outline-primary">Cerrar sesión</Button>
                    </LinkContainer>
                </Col>
              </Row>
          </>
        );
    }
}

export default Dashboard;
