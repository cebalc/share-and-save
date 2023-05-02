import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import NotFound from './routes/NotFound';

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout fluid={false} userlevel={3} username="Eric" />}>
            <Route index element={<Home />} />
            <Route path="about" element={<Home />} />
            <Route path="contact" element={<Home />} />
            <Route path="signin" element={<Home />} />
            <Route path="signout" element={<Home />} />
            <Route path="register" element={<Home />} />
            <Route path="settings" element={<Home />} />
          </Route>
          <Route path="*" element={<Layout fluid={false} userlevel={3} username="Eric" />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
