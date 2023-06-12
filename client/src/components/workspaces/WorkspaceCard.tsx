import React from "react";
import Card from "react-bootstrap/Card";

enum WorkspaceCardSize {
    NORMAL,
    CAPTION
}

interface WorkspaceCardProps {
    name: string,
    description: string
    size: WorkspaceCardSize
}

interface DataSizes {
    header: React.ElementType<any>,
    subtitle: React.ElementType<any>
}

const dataSizes: Map<WorkspaceCardSize, DataSizes> = new Map([
    [WorkspaceCardSize.CAPTION, {header: "h1", subtitle: "h4"}],
    [WorkspaceCardSize.NORMAL, {header: "h5", subtitle: "h6"}]
]);

const WorkspaceCard = (props: WorkspaceCardProps): JSX.Element => {

    const headerSize = (dataSizes.get(props.size) as DataSizes).header;
    const subtitleSize = (dataSizes.get(props.size) as DataSizes).subtitle;

    const buildWorkspaceDescription = (): string => {
        if(props.description.length > 0) {
            return props.description;
        } else {
            return "Sin descripción";
        }
    }

    const buildCardClassName = (): string => {
        let className: string = "mx-auto my-4 text-center";
        if(props.size === WorkspaceCardSize.NORMAL) {
            className += " max-width-75nbp-sm";
        }
        return className;
    }

    return (
        <Card border="primary" className={buildCardClassName()}>
            <Card.Header as={headerSize}>
                <span className="text-dark">{props.name}</span>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle as={subtitleSize} className="text-muted">
                    {buildWorkspaceDescription()}
                </Card.Subtitle>
            </Card.Body>
        </Card>
    );
}

export default WorkspaceCard;
export { WorkspaceCardSize };
