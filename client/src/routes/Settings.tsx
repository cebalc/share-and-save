import React from "react";

interface SettingsProps {

}

interface SettingsState {

}

class Settings extends React.Component<SettingsProps, SettingsState> {
    public state: SettingsState = {

    }

    public constructor(props: SettingsProps | Readonly<SettingsProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (<>
            Ajustes del usuario
        </>);
    }
}

export default Settings;
