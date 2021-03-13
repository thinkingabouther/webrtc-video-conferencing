import React from "react";
import { v1 as uuid } from "uuid";
import { AuthConsumer } from "./AuthProvider";
import AuthComponent from "./AuthComponent";
import {AuthComponentContainer} from "../styled-components";

const Home = (props) => {
  function create() {
    const id = uuid();
    props.history.push(`/room/${id}`);
  }

  return (
    <AuthConsumer>
      {(context) => (
          <div>
          <button onClick={create}>Create room</button>
          <AuthComponentContainer>
            <AuthComponent user={context.user}/>
          </AuthComponentContainer>
          </div>
        )}
    </AuthConsumer>
  );
};

export default Home;
