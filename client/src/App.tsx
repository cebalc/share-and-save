import React from 'react';

interface AppProps {
}

interface AppState {
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
  }

  public constructor(props: AppProps | Readonly<AppProps>) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <></>
    );
  }
}

export default App;
