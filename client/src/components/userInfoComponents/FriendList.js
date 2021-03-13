import useSWR from "swr";
import {AddFriendContainer} from "../../styled-components";
import {useState} from "react";

const friendsEndpoint = "api/user/friends";

const FriendList = () => {
    const [userEmail, setUserEmail] = useState();
    const [error, setError] = useState('')
    const [dataFetched, setDataFetched] = useState(false);

    const getData = async () => {
        const response = await fetch(friendsEndpoint);
        const json = await response.json();
        // console.log("fetch")
        // console.log(json);
        // console.log(response.status)
        if (response.status === 200) setDataFetched(true);
        // console.log(data);
        // console.log(dataFetched);
        return json;
    }

    const { data } = useSWR(friendsEndpoint, getData)

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
        if (res.status !== 201) {
            const json = await res.json();
            setError(json.message)
        }
    }

    console.log(data)

    return (
        <>
            <AddFriendContainer>
                <input placeholder={"Input email of your friend"} value={userEmail} onChange={handleInputChange}/>
                <span>{error}</span>
                <button onClick={addFriend}>Add friend!</button>
            </AddFriendContainer>
            <>
                {!data && <p>No friends</p>}
                {data && data.message && <p>{data.message}</p>}
                {data && data.length > 0 && data.map(friend => (
                    <div key={friend.roomID}>{friend.roomID}</div>
                ))}
            </>
        </>
    );

}

export default FriendList