import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

interface WorkspaceAddUserFormProps {
    onAdd: () => Promise<void>
}

interface WorkspaceAddUserFormState {
    email: string,
    emailError: string
}

class WorkspaceAddUserForm extends React.Component<WorkspaceAddUserFormProps, WorkspaceAddUserFormState> {
    public state: WorkspaceAddUserFormState = {
        email: "",
        emailError: ""
    }

    public constructor(props: WorkspaceAddUserFormProps | Readonly<WorkspaceAddUserFormProps>) {
        super(props);
    }

    private async addUser(): Promise<void> {

    }

    public render(): React.ReactNode {
        return (
            <Form className="w-100 mb-2">
                <Row>
                    <Col sm={8} className="my-1">
                        <Form.Group controlId="email">
                            <Form.Control type="email" placeholder="Email del nuevo usuario"
                                onChange={event => this.setState({email: event.target.value})} />
                            <Form.Text className="text-danger">{this.state.emailError}</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col sm={4} className="my-1 d-flex justify-content-center">
                        <Button variant="outline-primary" className="w-75"
                                onClick={() => this.addUser()}>Añadir</Button>
                    </Col>
                </Row>
            </Form>);
    }
}

export default WorkspaceAddUserForm;
