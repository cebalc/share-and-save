import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StatusFetcher from "./objects/fetchers/StatusFetcher";
import Layout from './components/Layout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";

interface AppProps {
}

interface AppState {
  userlevel: 0 | 1 | 2 | 3,
  username: string
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    userlevel: 0,
    username: ""
  };

  public constructor(props: AppProps | Readonly<AppProps>) {
    super(props);
  }

  public render(): React.ReactNode {
    let statusFetcher: StatusFetcher = new StatusFetcher();
    statusFetcher.retrieveData()
        .then(retrieved => {
          if (retrieved && statusFetcher.success()) {
            this.setState({
              userlevel: statusFetcher.getResponseData().userlevel,
              username: statusFetcher.getResponseData().username
            });
          }
        })
        .catch(error => console.log(error));
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout fluid="md" userlevel={this.state.userlevel} username={this.state.username} />}>
            <Route index element={<Home />} />
            <Route path="about" element={<Home />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signout" element={<Home signOut />} />
            <Route path="register" element={<SignUp />} />
            <Route path="settings" element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<Layout fluid="sm" userlevel={3} username="Eric" />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
