import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Workspace from "../../../objects/entities/Workspace";
import WorkspaceCard, {WorkspaceCardSize} from "../WorkspaceCard";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import RecordsManager from "./RecordsManager";

interface RecordsTabsMenuProps {
    workspace: Workspace
}

interface RecordsTabsMenuState {
    selectedTab: string
}

interface TabData {
    eventKey: string,
    title: string,
    child: JSX.Element
}

class RecordsTabsMenu extends React.Component<RecordsTabsMenuProps, RecordsTabsMenuState> {

    public state: RecordsTabsMenuState = {
        selectedTab: "records"
    }

    public constructor(props: RecordsTabsMenuProps | Readonly<RecordsTabsMenuProps>) {
        super(props);
    }

    private buildTabClassName(eventKey: string): string {
        return (this.state.selectedTab === eventKey ? "text-dark" : "text-secondary");
    }

    private getTabData(): TabData[] {
        return [
            {
                eventKey: "records",
                title: "Movimientos",
                child: <RecordsManager />
            },
            {
                eventKey: "lists",
                title: "Resúmenes",
                child: <>Resúmenes de gastos e ingresos</>
            },
            {
                eventKey: "debts",
                title: "Deudas",
                child: <>Deudas de usuarios</>
            },
            {
                eventKey: "advanced",
                title: "Avanzado",
                child: <>Funciones avanzadas</>
            }
        ];
    }

    public render(): React.ReactNode {
        let tabData: TabData[] = this.getTabData();
        return (<>
            <WorkspaceCard size={WorkspaceCardSize.NORMAL}
                           name={this.props.workspace.name} description={this.props.workspace.description} />
            <div className="mx-auto mb-4 max-width-75nbp-sm d-flex flex-grow-1">
                <LinkContainer to={`/workspace/${this.props.workspace.id}`}>
                    <Button variant="outline-primary" className="d-block w-100">Volver a resumen</Button>
                </LinkContainer>
            </div>
            <Tabs defaultActiveKey="records" id="records-tab" justify className="bg-white"
                onSelect={(eventKey) => this.setState({selectedTab: eventKey as string})}>
                {tabData.map((element, index) =>
                    <Tab key={index} eventKey={element.eventKey} title={element.title}
                        className="record-tab bg-white border border-1 rounded-bottom p-3"
                        tabClassName={this.buildTabClassName(element.eventKey)}>
                        {element.child}
                    </Tab>
                )}
            </Tabs>
        </>);
    }
}

export default RecordsTabsMenu;
