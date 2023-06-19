import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import StatusFetcher from "./objects/fetchers/users/StatusFetcher";
import User from "./objects/entities/User";
import Layout from './components/layout/Layout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";
import Settings from "./routes/Settings";
import WorkspaceRouter from "./components/workspaces/WorkspaceRouter";
import CRUDAction from "./objects/enums/CRUDAction";

interface AppProps {
}

interface AppState {
  currentUser: User
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState = {
    currentUser: User.GUEST
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
            <Route path="settings" element={<Settings user={this.state.currentUser} onUserDataAltered={this.updateUserStatus.bind(this)} />} />
            <Route path="dashboard" element={<Dashboard user={this.state.currentUser} />} />
          </Route>
          <Route path="/workspace" element={<Layout fluid="md" userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} /> }>
            <Route path="create" element={<WorkspaceRouter target="workspace" crudAction={CRUDAction.CREATE} userId={this.state.currentUser.id} /> } />
            <Route path=":id">
              <Route index element={<WorkspaceRouter target="workspace" crudAction={CRUDAction.READ} userId={this.state.currentUser.id} />} />
              <Route path="edit" element={<WorkspaceRouter target="workspace" crudAction={CRUDAction.UPDATE} />} />
              <Route path="delete" element={<WorkspaceRouter target="workspace" crudAction={CRUDAction.DELETE} />} />
            </Route>
          </Route>
          <Route path="/workspace/:id/records" element={<Layout fluid={true} userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} />}>
            <Route index element={<WorkspaceRouter target="records" />} />
          </Route>
          <Route path="*" element={<Layout fluid="sm" userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
