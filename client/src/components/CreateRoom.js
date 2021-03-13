import React from "react";
import { v1 as uuid } from "uuid";
import GoogleLogin from "react-google-login";
import { oauth } from "../config";
import { AuthConsumer } from "./AuthProvider";

const CreateRoom = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <AuthConsumer>
      {(context) => (
        <div>
          <button onClick={create}>Create room</button>
          <GoogleLogin
            clientId={oauth.clientId}
            buttonText="Log in with Google"
            onSuccess={context.googleLogIn}
            onFailure={context.googleLogIn}
            cookiePolicy={"single_host_origin"}
          />
          <button onClick={context.logOut}>Logout</button>
        </div>
      )}
    </AuthConsumer>
  );
};

export default CreateRoom;
