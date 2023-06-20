import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Workspace from "../../../objects/entities/Workspace";
import WorkspaceCard, {WorkspaceCardSize} from "../../../components/workspaces/WorkspaceCard";
import {LinkContainer} from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import RecordsManager from "../../../components/workspaces/records/RecordsManager";

interface RecordsMainMenuProps {
    workspace: Workspace
}

interface RecordsMainMenuState {
    selectedTab: string
}

interface TabData {
    eventKey: string,
    title: string,
    child: JSX.Element
}

class RecordsMainMenu extends React.Component<RecordsMainMenuProps, RecordsMainMenuState> {

    public state: RecordsMainMenuState = {
        selectedTab: "records"
    }

    public constructor(props: RecordsMainMenuProps | Readonly<RecordsMainMenuProps>) {
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
                child: <RecordsManager workspace={this.props.workspace} />
            } as TabData,
            {
                eventKey: "lists",
                title: "Resúmenes",
                child: <>Resúmenes de gastos e ingresos</>
            } as TabData,
            {
                eventKey: "debts",
                title: "Deudas",
                child: <>Deudas de usuarios</>
            } as TabData,
            {
                eventKey: "advanced",
                title: "Avanzado",
                child: <>Funciones avanzadas</>
            } as TabData
        ] as TabData[];
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

export default RecordsMainMenu;