import "./App.css";
import Navbar from "./components//Navbar";
import { Route, Switch, useHistory } from "react-router-dom";
import PostContainer from "./Pages/PostContainer";
import Profile from "./Pages/Profile";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import CreatePost from "./Pages/CreatePost";
import { useEffect } from "react";
import { useGlobalContext } from "./context";
import Reset from "./Pages/Reset/Reset";
import NewPassword from "./Pages/NewPassword";
import Footer from "./Pages/Footer";
import Explore from "./Pages/Explore";
import Settings from "./Pages/Settings";

const Routing = () => {
  const history = useHistory();
  const { userDispatch } = useGlobalContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    userDispatch({
      type: "USER",
      payload: user,
    });
    if (history.location.pathname.startsWith("/reset")) {
      history.push("/reset");
    }
    if (!user) {
      history.push("/signin");
    }
  }, [history, userDispatch]);

  return (
    <div style={{ marginTop: "80px" }}>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/accounts" component={Settings} />
        <Route path="/explore" component={Explore} />
        <Route path="/create" component={CreatePost} />
        <Route path="/reset" component={Reset} />
        <Route path="/password_reset" component={Reset} />
        <Route path="/reset/:token" component={NewPassword} />
        <Route path="/:username" component={Profile} />
        <Route exact path="/" component={PostContainer} />
      </Switch>
    </div>
  );
};

function App() {
  const { userState } = useGlobalContext();
  return (
    <>
      {userState ? <Navbar /> : null}
      <Routing />
      <Footer />
    </>
  );
}

export default App;
