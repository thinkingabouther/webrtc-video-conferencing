import { ControlIcon, ControlsIconContainer } from "../../styled-components";
import leaveCallIcon from "../../icons/leaveCallIcon.png";
import React from "react";

const LeaveCallControl = ({ leaveCall }) => (
  <ControlsIconContainer onClick={() => leaveCall()}>
    <ControlIcon src={leaveCallIcon} alt={"Leave call"} />
  </ControlsIconContainer>
);

export default LeaveCallControl;
