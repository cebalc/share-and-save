import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UpgradeSubscriptionFetcher, {
    UpgradeSubscriptionResponse
} from "../../../objects/fetchers/users/subscriptions/UpgradeSubscriptionFetcher";
import OptionalTextAlert from "../../misc/OptionalTextAlert";

interface PaymentModalFormProps {
    userId: number,
    onPaymentCompleted: () => Promise<void>
}

interface PaymentModalFormState {
    show: boolean,
    cardName: string,
    cardNameError: string,
    cardNumber: string,
    cardNumberError: string,
    month: string,
    monthError: string,
    year: string,
    yearError: string,
    cvv: string,
    cvvError: string,
    formError: string
}

class PaymentModalForm extends React.Component<PaymentModalFormProps, PaymentModalFormState> {

    public state: PaymentModalFormState = {
        show: false,
        cardName: "",
        cardNameError: "",
        cardNumber: "",
        cardNumberError: "",
        month: "",
        monthError: "",
        year: "",
        yearError: "",
        cvv: "",
        cvvError: "",
        formError: ""
    };

    public constructor(props: PaymentModalFormProps | Readonly<PaymentModalFormProps>) {
        super(props);
    }

    private hideModal(): void {
        this.setState({show: false});
    }

    private async upgradeSubscription(): Promise<void> {
        let fetcher: UpgradeSubscriptionFetcher = new UpgradeSubscriptionFetcher(
            this.props.userId,
            this.state.cardName,
            this.state.cardNumber,
            this.state.month,
            this.state.year,
            this.state.cvv
        );
        if(!await fetcher.retrieveData()) {
            this.setState({formError: "Error de conexión al servidor"});
            return;
        }
        let responseData: UpgradeSubscriptionResponse = fetcher.getResponseData();
        if(fetcher.success()) {
            await this.props.onPaymentCompleted();
        }
        this.setState({
            cardNameError: responseData.cardName,
            cardNumberError: responseData.cardNumber,
            monthError: responseData.month,
            yearError: responseData.year,
            cvvError: responseData.cvv,
            formError: responseData.global,
            show: !fetcher.success()
        });
    }

    public render(): React.ReactNode {
        return (
            <Modal backdrop="static" keyboard={false} show={this.state.show} onHide={() => this.hideModal()} >
                <Modal.Header closeButton>
                    <Modal.Title>Mejorar a Premium</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Introduce tus datos de pago a continuación. Sólo se admite tarjeta de crédito.*</p>
                    <Form>
                        <OptionalTextAlert text={this.state.formError} />
                        <Form.Group className="mb-3" controlId="card-holder">
                            <InputGroup>
                                <InputGroup.Text id="card-holder">
                                    <FontAwesomeIcon icon={["fas", "user"]} size="1x" />
                                </InputGroup.Text>
                                <Form.Control placeholder="Nombre en la tarjeta" aria-describedby="card-holder"
                                    onChange={event => this.setState({cardName: event.target.value})} />
                            </InputGroup>
                            <Form.Text className="text-danger">{this.state.cardNameError}</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="card-number">
                            <InputGroup>
                                <InputGroup.Text id="card-number">
                                    <FontAwesomeIcon icon={["far", "credit-card"]} size="1x" />
                                </InputGroup.Text>
                                <Form.Control placeholder="XXXX-XXXX-XXXX-XXXX" aria-describedby="card-number"
                                    onChange={event => this.setState({cardNumber: event.target.value})} />
                            </InputGroup>
                            <Form.Text className="text-danger">{this.state.cardNumberError}</Form.Text>
                        </Form.Group>
                        <Row>
                            <Col xs={3}>
                                <Form.Group className="mb-3" controlId="month">
                                    <InputGroup>
                                        <InputGroup.Text id="month">
                                            <FontAwesomeIcon icon={["fas", "calendar-days"]} size="1x" />
                                        </InputGroup.Text>
                                        <Form.Control placeholder="mm" aria-describedby="month"
                                                      onChange={event => this.setState({month: event.target.value})} />
                                    </InputGroup>
                                    <Form.Text className="text-danger">{this.state.monthError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col xs={4}>
                                <Form.Group className="mb-3" controlId="year">
                                    <Form.Control placeholder="aaaa" aria-describedby="year"
                                          onChange={event => this.setState({year: event.target.value})} />
                                    <Form.Text className="text-danger">{this.state.yearError}</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col xs={{span: 4, offset: 1}}>
                                <Form.Group className="mb-3" controlId="cvv">
                                    <InputGroup>
                                        <InputGroup.Text id="cvv">
                                            <FontAwesomeIcon icon={["fas", "lock"]} size="1x" />
                                        </InputGroup.Text>
                                        <Form.Control type="password" placeholder="CVV (XXX)" aria-describedby="cvv"
                                                      onChange={event => this.setState({cvv: event.target.value})} />
                                    </InputGroup>
                                    <Form.Text className="text-danger">{this.state.cvvError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-success" onClick={() => this.upgradeSubscription()}>Aceptar</Button>
                    <Button variant="outline-primary" onClick={() => this.hideModal()}>Cancelar</Button>
                </Modal.Footer>
                <Modal.Footer>
                    <span className="small">
                        * Formulario ficticio, introduce datos <strong>FICTICIOS</strong> pero que se ajusten a los patrones.
                    </span>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PaymentModalForm;
