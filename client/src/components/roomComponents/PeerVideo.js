import React, { useEffect, useRef } from "react";
import {
  VideoDescriptionContainer,
  PeerVideoPlayer,
  SinglePeerVideoContainer, VideoDescription,
} from "../../styled-components";

const PeerVideo = (props) => {
  const ref = useRef();
  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <SinglePeerVideoContainer>
      <PeerVideoPlayer playsInline autoPlay ref={ref} />
      <VideoDescriptionContainer>
        <VideoDescription>
          {props.username}
        </VideoDescription>
      </VideoDescriptionContainer>
    </SinglePeerVideoContainer>
  );
};

export default PeerVideo;
