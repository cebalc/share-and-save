import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import StatusFetcher from "./objects/fetchers/StatusFetcher";
import Layout from './components/Layout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";
import CreateWorkspace from "./routes/CreateWorkspace";
import Workspace from "./routes/Workspace";
import User from "./objects/entities/User";

interface AppProps {
}

interface AppState {
  currentUser: User
  // userId: number,
  // userLevel: 0 | 1 | 2 | 3,
  // userName: string
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    currentUser: User.GUEST
    // userId: 0,
    // userLevel: 0,
    // userName: ""
  };

  public constructor(props: AppProps | Readonly<AppProps>) {
    super(props);
  }

  public async componentDidMount(): Promise<void> {
    await this.updateUserStatus();
  }

  private async updateUserStatus(): Promise<void> {
    let statusFetcher: StatusFetcher = new StatusFetcher();
    if(!await statusFetcher.retrieveData()) {
      return;
    }
    let responseData: User = statusFetcher.getResponseData();
    if(statusFetcher.success()) {
      this.setState({currentUser: responseData});
    }
  }

  public render(): React.ReactNode {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout fluid="md" userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} />}>
            <Route index element={<Home />} />
            <Route path="about" element={<Home />} />
            <Route path="signin" element={<SignIn onSignIn={this.updateUserStatus.bind(this)} />} />
            <Route path="signout" element={<Home signOut onSignOut={this.updateUserStatus.bind(this)} />} />
            <Route path="register" element={<SignUp onSignUp={this.updateUserStatus.bind(this)} />} />
            <Route path="settings" element={<Home />} />
            <Route path="dashboard" element={<Dashboard userId={this.state.currentUser.id} userName={this.state.currentUser.name} />} />
            <Route path="createworkspace" element={<CreateWorkspace />} />
          </Route>
          <Route path="/workspace" element={<Layout fluid={true} userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} />}>
            <Route path=":id" element={<Workspace userId={this.state.currentUser.id}/>} />
          </Route>
          <Route path="*" element={<Layout fluid="sm" userLevel={3} userName="Eric" />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
export type { AppState };
