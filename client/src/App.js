import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import Room from "./components/Room";
import { AuthConsumer } from "./components/AuthProvider";

function App() {
  return (
    <AuthConsumer>
      {(context) => (
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={CreateRoom} />
            <Route
              path="/room/:roomID"
              component={() => <Room user={context.user} />}
            />
          </Switch>
        </BrowserRouter>
      )}
    </AuthConsumer>
  );
}

export default App;
