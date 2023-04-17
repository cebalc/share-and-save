import React from 'react';
import SignUp from "./routes/SignUp";

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
      <SignUp />
    );
  }
}

export default App;
