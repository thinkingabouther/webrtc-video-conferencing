import {JoinRoomContainer} from "../../styled-components";
import {v1 as uuid} from "uuid";

const JoinRoom = (props) => {

    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    return (
        <JoinRoomContainer>
            <button onClick={create}>Create room</button>
        </JoinRoomContainer>
    )
}
export default JoinRoom