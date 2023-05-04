import { IconName, IconPrefix, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface BouncingIconProps {
    family: IconPrefix,
    name: IconName
    size: SizeProp
}

interface BouncingIconState {
    hover: boolean
}

class BouncingIcon extends React.Component<BouncingIconProps, BouncingIconState> {

    public state: BouncingIconState = {
        hover: false
    };

    public constructor(props: BouncingIconProps | Readonly<BouncingIconProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <FontAwesomeIcon icon={[this.props.family, this.props.name]}
                className="mx-3 clickable"
                bounce={this.state.hover} 
                onMouseOver={() => this.setState({hover: true})} 
                onMouseOut={() => this.setState({hover: false})}
                size={this.props.size}
            />
        );
    }
}

export default BouncingIcon;
