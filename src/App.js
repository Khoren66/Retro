import "./App.css";
import Login from "./screens/login/Login";
import Admin from "./screens/admin/Admin";
import RetroBoard from "./screens/board/RetroBoard";
import NotFoundPage from "./screens/NotFoundPage"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ValidateToken } from "./Helpers/common";

function App({ cableApp }) {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route
            path="/admin"
            render={() => {
              if (ValidateToken()) {
                return <Admin />;
              }
              return <Redirect to="/" />;
            }}
          />

          <Route
            exact
            path="/retros/:id"
            render={() => <RetroBoard cableApp={cableApp} />}
          />
          <Route path="/404" component={NotFoundPage} />
          <Route path="*" component={NotFoundPage} />
          {/* <Route render={() => <Redirect to="/admin" />} /> */}
        </Switch>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
