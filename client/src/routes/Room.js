import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import microphoneIconOn from '../icons/microphoneOnIcon.png'
import microphoneIconOff from '../icons/microphoneOffIcon.png'
import videoIconOn from '../icons/videoOnIcon.png'
import videoIconOff from '../icons/videoOffIcon.png'
import shareScreenIcon from '../icons/shareScreenIcon.png'
import leaveCallIcon from '../icons/leaveCallIcon.png'

const PeersVideoContainer = styled.div`
    padding: 1rem;
    display: flex;
    height: 90vh;
    width: 90vw;
    margin: auto;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
`;

const SinglePeerVideoContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
`

const PeerVideoDescriptionContainer = styled.div`
    background: white;
    width: 100%;
`

const PeerVideoPlayer = styled.video`
    height: 360px;
    width: 640px;
    object-fit: cover;
`;

const UserVideo = styled.video`
    height: 90px;
    width: 160px;
    object-fit: cover;
`;

const UserVideoContainer = styled.div`
    max-width: 30rem;
    max-height: 30rem;
    height: auto;
    width: auto;
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 1;
`;

const ControlsContainer = styled.div`
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

const RoomContainer = styled.div`
    background: black;
`;

const ControlsIconContainer = styled.span`
    padding: 10px;
    border-radius: 50%;
    border: 2px solid black;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    display: flex;
    background: lightgrey;
`;

const ControlIcon = styled.img`
    object-fit: cover;
`;

const PeerVideo = (props) => {
    console.log(props)
    const ref = useRef();
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <SinglePeerVideoContainer>
            <PeerVideoPlayer playsInline autoPlay ref={ref} />
            <PeerVideoDescriptionContainer>{props.username}</PeerVideoDescriptionContainer>
        </SinglePeerVideoContainer>
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const userStream = useRef();
    const userPeer = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    const history = useHistory();
    const [connectionEstablished, setConnectionEstablished] = useState(false);

    const [isVideoOn, setVideo] = useState(true);
    const [isAudioOn, setAudio] = useState(true);

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.socketID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: user.socketID,
                        peer,
                    })
                    peers.push({
                        peerID: user.socketID,
                        username: user.username,
                        peer,
                    });
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                console.log(payload);
                const peer = addPeer(payload.signal, payload.callerID, stream);
                userPeer.current = peer;
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                const peerObj = {
                    peerID: payload.callerID,
                    username: payload.username,
                    peer,
                }

                setPeers(users => [...users, peerObj]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
                setConnectionEstablished(true);
            });

            socketRef.current.on("user left", id => {
                const peerObj = peersRef.current.find(p => p.peerID === id);
                if (peerObj) peerObj.peer.destroy();
                const peers = peersRef.current.filter(p => p.peerID !== id);
                setPeers(peers)
            })
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {url:'stun:stun.l.google.com:19302'},
                    {url:'stun:stun1.l.google.com:19302'},
                    {url:'stun:stun2.l.google.com:19302'},
                    {url:'stun:stun3.l.google.com:19302'},
                    {url:'stun:stun4.l.google.com:19302'},
                ]
            },
            stream: stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal, roomID })
        })

        userPeer.current = peer;

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);
        setConnectionEstablished(true);
        return peer;
    }

    function toggleMicrophone() {
        setAudio(!isAudioOn);
        userStream.current.getAudioTracks()[0].enabled = isAudioOn;
    }

    function toggleVideo() {
        setVideo(!isVideoOn)
        userStream.current.getVideoTracks()[0].enabled = isVideoOn;
    }

    function leaveCall() {
        if (connectionEstablished) {
            userPeer.current.destroy();
            userStream.current.getTracks().forEach(track => track.stop())
        }
        history.push("/");
    }

    function shareScreen() {
        if (!connectionEstablished) {
            alert("connection was not established");
            return;
        }
        navigator.mediaDevices.getDisplayMedia( { cursor:true } )
            .then(screenStream => {
                userPeer.current.replaceTrack(userStream.current.getVideoTracks()[0],
                                              screenStream.getVideoTracks()[0],
                                              userStream.current);
                userVideo.current.srcObject = screenStream;
                screenStream.getTracks()[0].onended = () => {
                    userPeer.current.replaceTrack(screenStream.getVideoTracks()[0],
                                                  userStream.current.getVideoTracks()[0],
                                                  userStream.current)
                    userVideo.current.srcObject = userStream.current;
                }
            })
    }

    const AudioControl = () => {
        if (isAudioOn) {
            return (
                <ControlsIconContainer onClick={() => toggleMicrophone()}>
                    <ControlIcon src={microphoneIconOn} alt={"Mute microphone"}/>
                </ControlsIconContainer>
            );
        } else {
            return (
                <ControlsIconContainer onClick={() => toggleMicrophone()}>
                    <ControlIcon src={microphoneIconOff} alt={"Unmute microphone"}/>
                </ControlsIconContainer>
            );
        }
    }

    const VideoControl = () => {
        if (isVideoOn) {
            return (
                <ControlsIconContainer onClick={() => toggleVideo()}>
                    <ControlIcon src={videoIconOn} alt={"Stop video"}/>
                </ControlsIconContainer>
            );
        } else {
            return (
                <ControlsIconContainer onClick={() => toggleVideo()}>
                    <ControlIcon src={videoIconOff} alt={"Start video"}/>
                </ControlsIconContainer>
            );
        }
    }

    const ShareScreenControl = () => {
        return (
            <ControlsIconContainer onClick={() => shareScreen()}>
                <ControlIcon src={shareScreenIcon} alt={"Share screen"}/>
            </ControlsIconContainer>
        );
    }

    const LeaveCallControl = () => {
        return (
            <ControlsIconContainer onClick={() => leaveCall()}>
                <ControlIcon src={leaveCallIcon} alt={"Leave call"}/>
            </ControlsIconContainer>
        );
    }

    return (
        <RoomContainer>
            <UserVideoContainer>
                <UserVideo muted ref={userVideo} autoPlay playsInline />
            </UserVideoContainer>
            <PeersVideoContainer>
                {peers.map(peer => {
                    return (
                        <PeerVideo key={peer.peerID} peer={peer.peer} username={peer.username}/>
                    );
                })}
            </PeersVideoContainer>
            <ControlsContainer>
                <AudioControl/>
                <VideoControl/>
                <ShareScreenControl/>
                <LeaveCallControl/>
            </ControlsContainer>
        </RoomContainer>
    );
};

export default Room;
