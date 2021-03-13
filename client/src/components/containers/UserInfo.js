import {UserInfoContainer} from "../../styled-components";
import {useState} from "react";

const UserInfo = () => {
    const [userEmail, setUserEmail] = useState();

    const handleInputChange = (e) => {
        setUserEmail(e.target.value)
    }

    const addFriend = async () => {
        const res = await fetch("/api/user/add-friend", {
            method: "POST",
            body: JSON.stringify({
                email: userEmail,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return (
        <UserInfoContainer>
            <input placeholder={"Input email of your friend"} value={userEmail} onChange={handleInputChange}/>
            <button onClick={addFriend}>Add friend!</button>
        </UserInfoContainer>
    )
}

export default UserInfo