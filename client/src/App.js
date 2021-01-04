import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/Pages/Home";
import Profile from "./components/Pages/Profile";
import SignIn from "./components/Pages/SignIn";
import SignUp from "./components/Pages/SignUp";
import CreatePost from "./components/Pages/CreatePost";
import UserProfile from "./components/Pages/UserProfile";
import SubscribedUserPost from "./components/Pages/SubscribedUserPost";
import { useEffect } from "react";
import { useGlobalContext } from "./context";
import Reset from "./components/Pages/Reset";
import NewPassword from "./components/Pages/NewPassword";

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useGlobalContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    dispatch({
      type: "USER",
      payload: user,
    });
    if (history.location.pathname.startsWith("/reset")) {
      history.push("/reset");
    }
    if (!user) {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPost />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routing />
    </Router>
  );
}

export default App;
