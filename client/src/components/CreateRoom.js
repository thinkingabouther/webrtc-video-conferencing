import React from "react";
import { v1 as uuid } from "uuid";
import GoogleLogin from "react-google-login";
import { oauth } from  "../config"

const CreateRoom = (props) => {
    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    const handleLogin = async googleData => {
        const res = await fetch("/api/auth", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data.error) {
            throw new Error(data.error)
        }
        console.log(data);
        // store returned user somehow
    }

    return (
        <div>
            <button onClick={create}>Create room</button>
            <GoogleLogin
                clientId={oauth.clientId}
                buttonText="Log in with Google"
                onSuccess={handleLogin}
                onFailure={handleLogin}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};

export default CreateRoom;
