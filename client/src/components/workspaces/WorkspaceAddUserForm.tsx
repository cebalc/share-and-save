import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import AddWorkspaceUserFetcher, {
    AddWorkspaceUserResponse
} from "../../objects/fetchers/workspaces/AddWorkspaceUserFetcher";
import Alert from "react-bootstrap/Alert";

interface WorkspaceAddUserFormProps {
    workspaceId: number,
    onAdd: () => Promise<void>
}

interface WorkspaceAddUserFormState {
    email: string,
    emailError: string,
    formError: string
}

class WorkspaceAddUserForm extends React.Component<WorkspaceAddUserFormProps, WorkspaceAddUserFormState> {
    public state: WorkspaceAddUserFormState = {
        email: "",
        emailError: "",
        formError: ""
    }

    public constructor(props: WorkspaceAddUserFormProps | Readonly<WorkspaceAddUserFormProps>) {
        super(props);
    }

    private async addUser(): Promise<void> {
        let addFetcher: AddWorkspaceUserFetcher = new AddWorkspaceUserFetcher(
            this.props.workspaceId,
            this.state.email
        );
        if(!await addFetcher.retrieveData()) {
            return;
        }
        let responseData: AddWorkspaceUserResponse = addFetcher.getResponseData();
        if(addFetcher.success()) {
            await this.props.onAdd();
        }
        this.setState({
            email: (addFetcher.success() ? "" : this.state.email),
            emailError: responseData.email,
            formError: responseData.global
        });
    }

    private renderError(): React.ReactNode {
        if(this.state.formError.length > 0) {
            return (
                <Alert variant="danger">
                    {this.state.formError}
                </Alert>
            );
        }
    }

    public render(): React.ReactNode {
        return (
            <Form className="w-100 mb-2">
                {this.renderError()}
                <Row>
                    <Col sm={8} className="my-1">
                        <Form.Group controlId="email">
                            <Form.Control type="email" placeholder="Email del nuevo usuario" value={this.state.email}
                                onChange={event => this.setState({email: event.target.value})} />
                            <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={4} className="my-1 d-flex justify-content-center align-items-start">
                        <Button variant="outline-primary" className="w-75"
                                onClick={() => this.addUser()}>Añadir</Button>
                    </Col>
                </Row>
            </Form>);
    }
}

export default WorkspaceAddUserForm;
