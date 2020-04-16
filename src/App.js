import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import "./../node_modules/bulma/css/bulma.min.css";
import Dashboard from "./Dashboard";
import Button from '@material-ui/core/Button';


const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

function AuthButton() {
  let history = useHistory();

  return fakeAuth.isAuthenticated ? (
    <Button onClick={() => {
        fakeAuth.signout(() => history.push("/login"));
      }} color="inherit">Log out</Button>
  ) : (
    <p>You are not logged in.</p>
  );
}

function App() {

  return (
    <Router>
      <Switch>
        {/* <Route path="/login">
          <LoginPage />
        </Route> */}
        <Route path="/">
          <Dashboard>
        {/* <AuthButton /> */}
          </Dashboard>
        </Route>
      </Switch>
    </Router>
  )
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        fakeAuth.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

function LoginPage() {
  let history = useHistory();
  let location = useLocation();

  let { from } = location.state || { from: { pathname: "/" } };
  let login = () => {
    fakeAuth.authenticate(() => {
      history.replace(from);
    });
  };

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <button onClick={login}>Log in</button>
    </div>
  )
}

export default App;