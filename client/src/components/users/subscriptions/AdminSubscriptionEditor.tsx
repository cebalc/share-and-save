import Container from "react-bootstrap/Container";

const AdminSubscriptionEditor = (): JSX.Element => {
    return (
        <Container fluid>
            <p className="lead text-center">Como administrador tienes privilegios completos
                y tu nivel de suscripción es equivalente a Premium sin caducidad.</p>
        </Container>
    );
}

export default AdminSubscriptionEditor;
