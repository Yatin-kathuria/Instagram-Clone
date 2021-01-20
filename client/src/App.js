import "./App.css";
import Navbar from "./components//Navbar";
import { Route, Switch, useHistory } from "react-router-dom";
import PostContainer from "./components/Pages/PostContainer";
import Profile from "./components/Pages/Profile";
import SignIn from "./components/Pages/SignIn";
import SignUp from "./components/Pages/SignUp";
import CreatePost from "./components/Pages/CreatePost";
import { useEffect } from "react";
import { useGlobalContext } from "./context";
import Reset from "./components/Pages/Reset";
import NewPassword from "./components/Pages/NewPassword";
import Footer from "./components/Pages/Footer";
import Explore from "./components/Pages/Explore";
import Settings from "./components/Pages/Settings";

// import Test from "./components/Testing/Profile";

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
  }, []);

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
