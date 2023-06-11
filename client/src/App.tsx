import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import StatusFetcher from "./objects/fetchers/StatusFetcher";
import User from "./objects/entities/User";
import Layout from './components/Layout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/Dashboard";
import CreateWorkspace from "./routes/workspace/CreateWorkspace";
import RecordList from "./routes/workspace/RecordList";
import WorkspaceRouter from "./components/WorkspaceRouter";
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
            <Route path="settings" element={<Home />} />
            <Route path="dashboard" element={<Dashboard userId={this.state.currentUser.id} userName={this.state.currentUser.name} />} />
          </Route>
          <Route path="/workspace" element={<Layout fluid="md" userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} /> }>
            <Route path="create" element={<CreateWorkspace />} />
            <Route path=":id">
              <Route index element={<WorkspaceRouter crudAction={CRUDAction.READ} />} />
              <Route path="edit" element={<WorkspaceRouter crudAction={CRUDAction.UPDATE} />} />
            </Route>
          </Route>
          <Route path="/workspace/:id/records" element={<Layout fluid={true} userLevel={this.state.currentUser.level} userName={this.state.currentUser.name} />}>
            <Route index element={<RecordList />} />
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
