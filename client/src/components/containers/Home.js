import React from "react";
import { AuthConsumer } from "../auth/AuthProvider";
import AuthComponent from "../auth/AuthComponent";
import { HomeContainer } from "../../styled-components";
import JoinRoom from "./JoinRoom";
import UserInfo from "./UserInfo";

const Home = (props) => {
  return (
    <AuthConsumer>
      {(context) => (
        <div>
          <HomeContainer>
            <JoinRoom history={props.history} />
            <UserInfo />
          </HomeContainer>
          <AuthComponent user={context.user} />
        </div>
      )}
    </AuthConsumer>
  );
};

export default Home;
