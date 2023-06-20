import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OptionalTextAlert from "../../misc/OptionalTextAlert";
import Button from "react-bootstrap/Button";

interface AddPlaceModalFormProps {
    onPlaceAdded: (newPlaceId: number) => Promise<void>
}

interface AddPlaceModalFormState {
    show: boolean,
    name: string,
    nameError: string,
    formError: string
}

class AddPlaceModalForm extends React.Component<AddPlaceModalFormProps, AddPlaceModalFormState> {

    public state: AddPlaceModalFormState = {
        show: false,
        name: "",
        nameError: "",
        formError: ""
    }

    public constructor(props: Readonly<AddPlaceModalFormProps> | AddPlaceModalFormProps) {
        super(props);
    }

    private hideModal(): void {
        this.setState({show: false});
    }

    private async addPlace(): Promise<void> {

        await this.props.onPlaceAdded(1234);
        this.hideModal();
    }

    render(): React.ReactNode {
        return (
            <Modal show={this.state.show} onHide={this.hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir lugar o establecimiento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <OptionalTextAlert text={this.state.formError} />
                        <Form.Group controlId="new-place-name">
                            <InputGroup>
                                <InputGroup.Text id="new-place-name">
                                    <FontAwesomeIcon icon={["fas", "shop"]} size="1x" />
                                </InputGroup.Text>
                                <Form.Control placeholder="Nombre del lugar o establecimiento" aria-describedby="new-place-name"
                                              onChange={event => this.setState({name: event.target.value})} />
                            </InputGroup>
                            <Form.Text className="text-danger">{this.state.nameError}</Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={() => this.addPlace()}>Añadir</Button>
                    <Button variant="outline-secondary" onClick={() => this.hideModal()}>Volver</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AddPlaceModalForm;
