import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChangePassword from "../Setting/ChangePassword";
import EditProfile from "../Setting/EditProfile";
import EmailAndSMS from "../Setting/EmailAndSMS";
import EmailsFromInstagram from "../Setting/EmailsFromInstagram";
import LoginActivity from "../Setting/LoginActivity";
import ManageContacts from "../Setting/ManageContacts";
import PrivacyAndSecurity from "../Setting/PrivacyAndSecurity";
import PushNotification from "../Setting/PushNotification";
import Sidebar from "../Setting/Sidebar";
import "./Settings.css";

function Settings() {
  const { path } = useRouteMatch();
  return (
    <section className="settings">
      <Sidebar />
      <div className="settings_content">
        <Switch>
          <Route path={`${path}/edit`} component={EditProfile} />
          <Route path={`${path}/password_change`} component={ChangePassword} />

          <Route path={`${path}/manage_access`} component={ManageContacts} />
          <Route path={`${path}/emails_settings`} component={EmailAndSMS} />
          <Route
            path={`${path}/push_web_settings`}
            component={PushNotification}
          />
          <Route path={`${path}/contact_history`} component={ManageContacts} />
          <Route
            path={`${path}/privacy_and_security`}
            component={PrivacyAndSecurity}
          />
          <Route
            path={`${path}/session_login_activity`}
            component={LoginActivity}
          />
          <Route path={`${path}/emails_sent`} component={EmailsFromInstagram} />
        </Switch>
      </div>
    </section>
  );
}

export default Settings;
