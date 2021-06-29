import "./App.css";
import Login from "./screens/login/Login";
import Admin from "./screens/admin/Admin";
import RetroBoard from "./screens/board/RetroBoard";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="App">
        
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/admin/" component={Admin} />
          <Route exact path="/retros/:id" component={RetroBoard} />
          RetroBoard
          <Route render={() => <Redirect to="/admin" />} />
        </Switch>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
