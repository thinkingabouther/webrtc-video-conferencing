import {ControlIcon, ControlsIconContainer} from "../../styled-components";
import shareScreenIcon from "../../icons/shareScreenIcon.png";
import React from "react";

const ShareScreenControl = ({shareScreen}) => (
    <ControlsIconContainer onClick={() => shareScreen()}>
        <ControlIcon src={shareScreenIcon} alt={"Share screen"}/>
    </ControlsIconContainer>
)

export default ShareScreenControl