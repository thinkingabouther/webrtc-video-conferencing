import styled from "styled-components";

export const PeersVideoContainer = styled.div`
  padding: 1rem;
  display: flex;
  height: 90vh;
  width: 90vw;
  margin: auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
`;

export const SinglePeerVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
`;

export const VideoDescriptionContainer = styled.div`
  background: white;
  width: 100%;
`;

export const PeerVideoPlayer = styled.video`
  height: 360px;
  width: 640px;
  object-fit: cover;
`;

export const UserVideo = styled.video`
  height: 90px;
  width: 160px;
  object-fit: cover;
`;

export const UserVideoContainer = styled.div`
  max-width: 30rem;
  max-height: 30rem;
  height: auto;
  width: auto;
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
`;

export const ControlsContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 5rem;
  z-index: 1;
  align-items: center;
  justify-content: space-around;
  display: flex;
  background: white;
`;

export const RoomContainer = styled.div`
  background: black;
`;

export const ControlsIconContainer = styled.span`
  padding: 10px;
  border-radius: 50%;
  border: 2px solid black;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  display: flex;
  background: lightgrey;
`;

export const ControlIcon = styled.img`
  object-fit: cover;
`;

export const AuthComponentContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`

export const LogoutIconContainer = styled.span`
  padding: 10px;
  border-radius: 50%;
  border: 1px solid black;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  display: flex;
  background: #BB0000;
  margin: 3px;
`;

export const LogoutContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const JoinRoomContainer = styled.div`
    
`;

export const AddFriendContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HomeContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
