import React from "react";
import Container from "react-bootstrap/Container"
import BouncingIcon from "./BouncingIcon";

interface SocialNetworksProps {
}

interface SocialNetworksState {
    hoverInstagram: boolean,
    hoverFacebook: boolean,
    hoverTwitter: boolean
}

class SocialNetworks extends React.Component<SocialNetworksProps, SocialNetworksState> {
    public state: SocialNetworksState = {
        hoverInstagram: false,
        hoverFacebook: false,
        hoverTwitter: false
    }

    public constructor(props: SocialNetworksProps | Readonly<SocialNetworksProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <>
            <p className="lead fw-bold">Nuestras redes sociales</p>
            <Container fluid className="d-flex flex-wrap justify-content-center">
                <BouncingIcon family="fab" name="instagram" size="3x" />
                <BouncingIcon family="fab" name="facebook-f" size="3x" />
                <BouncingIcon family="fab" name="twitter" size="3x" />
            </Container>
            </>
        );
    }
}

export default SocialNetworks;
