import React from 'react';
import logo from './logo.svg';
import './App.css';

interface AppProps {
}

interface AppState {
  data: any
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    data: null
  }

  public constructor(props: any) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    try {
      let response: Response = await fetch("/api");
      console.log(response);
      let jsonData = await response.json();
      console.log(jsonData);
      this.setState({data: jsonData.message});
    } catch (err) {
      // this.setState({data: `Error: ${err}`})
      console.log(err);
    }
  }

  public render(): React.ReactNode {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>{!this.state.data ? "Loading..." : this.state.data}</p>
          </header>
        </div>
      );
  }
}

export default App;
