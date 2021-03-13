import { ControlIcon, ControlsIconContainer } from "../../styled-components";
import videoIconOff from "../../icons/videoOffIcon.png";
import videoIconOn from "../../icons/videoOnIcon.png";
import React from "react";

const VideoControl = ({ isVideoOn, toggleVideo }) => (
  <ControlsIconContainer onClick={() => toggleVideo()}>
    <ControlIcon
      src={isVideoOn ? videoIconOff : videoIconOn}
      alt={"Toggle video"}
    />
  </ControlsIconContainer>
);

export default VideoControl;
