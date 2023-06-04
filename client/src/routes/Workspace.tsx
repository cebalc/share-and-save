import React from "react";
import ReadWorkspaceFetcher from "../objects/fetchers/ReadWorkspaceFetcher";
import { Navigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WorkspaceData from "../objects/WorkspaceData";
import WorkspaceUsersForm from "../components/WorkspaceUsersForm";
import WorkspaceDetailsForm from "../components/WorkspaceDetailsForm";
import { useParams } from "react-router-dom";

interface WorkspaceProps {
    userId: number
}

const Workspace = (props: WorkspaceProps) : JSX.Element => {

    const [restricted, setRestricted] = React.useState(false);
    const [name, setName] = React.useState("Cargando...");
    const [description, setDescription] = React.useState("Cargando...");

    const { id } = useParams();

    const redirectIfRestricted = (): React.ReactNode => {
        if(props.userId === 0 || restricted) {
            return <Navigate to="/dashboard" />;
        }
    }

    const retrieveWorkspaceData = React.useCallback(() : void => {
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher(parseInt(id as string));
        fetcher.retrieveData()
            .then(retrieved => {
                if (!retrieved) {
                    return Promise.reject(retrieved);
                }
                let responseData: WorkspaceData = fetcher.getResponseData()[0];
                if(fetcher.success()) {
                    setName(responseData.name);
                    setDescription(responseData.description);
                } else {
                    setRestricted(true);
                }
            });
    }, [id]);

    React.useEffect(() => {retrieveWorkspaceData()}, [retrieveWorkspaceData]);

    return (
        <Container fluid>
            {redirectIfRestricted()}
            <p className="h1 text-center">{name}</p>
            <p className="h4 text-center">{description}</p>
            <Row>
                <Col xxl={8}>
                    <Row>
                        <Col md={6}><WorkspaceDetailsForm /></Col>
                        <Col md={6}><WorkspaceUsersForm /></Col>
                    </Row>
                </Col>
                <Col xxl={4}>Botones</Col>
            </Row>
        </Container>
    );
}

/*
class Workspace extends React.Component<WorkspaceProps, WorkspaceState> {
    public state: WorkspaceState = {
        restricted: false,
        name: "",
        description: ""
    };

    public constructor(props: WorkspaceProps | Readonly<WorkspaceProps>) {
        super(props);
    }

    public async componentDidMount(): Promise<void> {
        //await this.retrieveWorkspaceData();
    }

    private async retrieveWorkspaceData(): Promise<void> {
        // @ts-ignore
        let fetcher: ReadWorkspaceFetcher = new ReadWorkspaceFetcher(this.props.match.id);
        if(!await fetcher.retrieveData()) {
            this.setState({restricted: true})
            return;
        }
        let responseData: WorkspaceData = fetcher.getResponseData()[0];
    }

    private redirectIfRestricted(): React.ReactNode {
        if(this.props.userId === 0 || this.state.restricted) {
            return <Navigate to="/dashboard" />
        }
    }

    public render(): React.ReactNode {
        return (
            <Container fluid>
                {this.redirectIfRestricted()}
                <p className="h1 text-center">{this.state.name}</p>
                <p className="h4 text-center">{this.state.description}</p>
                <Row>
                    <Col xxl={8}>
                        <Row>
                            <Col md={6}><WorkspaceDetailsForm />{this.props.match.id}</Col>
                            <Col md={6}><WorkspaceUsersForm /></Col>
                        </Row>
                    </Col>
                    <Col xxl={4}>Botones</Col>
                </Row>
            </Container>
        );
    }
}
*/

export default Workspace;
