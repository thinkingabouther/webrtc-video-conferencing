import {ControlIcon, ControlsIconContainer} from "../styled-components";
import microphoneIconOn from "../icons/microphoneOnIcon.png";
import microphoneIconOff from "../icons/microphoneOffIcon.png";
import React from "react";

const AudioControl = ({isAudioOn, toggleMicrophone}) => (
    <ControlsIconContainer onClick={() => toggleMicrophone()}>
        <ControlIcon src={isAudioOn ? microphoneIconOff : microphoneIconOn} alt={"Toggle microphone"}/>
    </ControlsIconContainer>
)

export default AudioControl