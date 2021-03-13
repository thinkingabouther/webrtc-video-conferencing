import GoogleLogin from "react-google-login";
import {oauth} from "../../config";
import React from "react";
import {AuthConsumer} from "./AuthProvider";
import {AuthComponentContainer, ControlIcon, LogoutContainer, LogoutIconContainer} from "../../styled-components";

import logoutIcon from "../../icons/logoutIcon.png";

const AuthComponent = (props) => {
    console.log(props);
    if (!props.user)
        return (
            <AuthComponentContainer>
                <AuthConsumer>
                {context => (
                    <GoogleLogin
                        clientId={oauth.clientId}
                        buttonText="Log in with Google"
                        onSuccess={context.googleLogIn}
                        onFailure={context.googleLogIn}
                        cookiePolicy={"single_host_origin"}
                    />
                )}
                </AuthConsumer>
            </AuthComponentContainer>
        )
    else return (
        <AuthComponentContainer>
            <AuthConsumer>
            {context => (
                <LogoutContainer>
                    <span>{context.user.name}</span>
                    <LogoutIconContainer onClick={context.logOut}>
                        <ControlIcon src={logoutIcon} alt={"Logout"} />
                    </LogoutIconContainer>
                </LogoutContainer>
            )}
            </AuthConsumer>
        </AuthComponentContainer>
    )
}

export default AuthComponent