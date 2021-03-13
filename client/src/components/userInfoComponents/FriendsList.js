import useSWR from "swr";
import { AddFriendContainer } from "../../styled-components";
import { useState } from "react";

const friendsEndpoint = "api/user/friends";

const FriendsList = () => {
  const [userEmail, setUserEmail] = useState();
  const [error, setError] = useState("");
  const { data, mutate } = useSWR(friendsEndpoint, { refreshInterval: 100 });

  const handleInputChange = (e) => {
    setUserEmail(e.target.value);
  };

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
      setError(json.message);
    }
    mutate();
  };

  return (
    <>
      <AddFriendContainer>
        <input
          placeholder={"Input email of your friend"}
          value={userEmail}
          onChange={handleInputChange}
        />
        <span>{error}</span>
        <button onClick={addFriend}>Add friend!</button>
      </AddFriendContainer>
      <>
        {(!data || data.message) && <p>Your friends will appear here</p>}
        {data &&
          data.length > 0 &&
          data.map((friend) => <div key={friend.roomID}>{friend.name}</div>)}
      </>
    </>
  );
};

export default FriendsList;
