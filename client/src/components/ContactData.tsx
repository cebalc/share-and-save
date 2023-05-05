import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ContactData = () : JSX.Element => {
    return (
        <>
            <p className="lead fw-bold">Datos de contacto</p>
            <p>
                <span className="fw-bold h6">Share and Save S.L.</span><br />
                <FontAwesomeIcon icon={["fas", "location-dot"]} />
                &nbsp;
                Calle del Ahorro 1. Valencia (España)<br />
                <FontAwesomeIcon icon={["fas", "envelope"]} />
                &nbsp;
                shareandsave.app@gmail.com
                <br />
                <FontAwesomeIcon icon={["fas", "phone-volume"]} />
                &nbsp;
                +34 961 234 567
            </p>
        </>
    );
};

export default ContactData;
