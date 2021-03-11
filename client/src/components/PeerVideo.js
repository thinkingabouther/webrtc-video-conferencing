import React, {useEffect, useRef} from "react";
import {PeerVideoDescriptionContainer, PeerVideoPlayer, SinglePeerVideoContainer} from "../styled-components";

const PeerVideo = (props) => {
    const ref = useRef();
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <SinglePeerVideoContainer>
            <PeerVideoPlayer playsInline autoPlay ref={ref}/>
            <PeerVideoDescriptionContainer>{props.username}</PeerVideoDescriptionContainer>
        </SinglePeerVideoContainer>
    );
}

export default PeerVideo