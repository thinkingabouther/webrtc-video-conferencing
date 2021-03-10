import React, {useEffect, useRef, useState} from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import {useHistory} from "react-router-dom";

import {
    ControlsContainer,
    PeersVideoContainer,
    RoomContainer,
    UserVideo,
    UserVideoContainer
} from "../styled-components";

import PeerVideo from "./PeerVideo";
import VideoControl from "./VideoControl";
import AudioControl from "./AudioControl";
import LeaveCallControl from "./LeaveCallControl";
import ShareScreenControl from "./ShareScreenControl";


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

    const [isVideoOn, setVideo] = useState(false);
    const [isAudioOn, setAudio] = useState(false);

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
        setVideo(!isVideoOn, () => {})
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
                <AudioControl isAudioOn={isAudioOn} toggleMicrophone={toggleMicrophone} />
                <VideoControl isVideoOn={isVideoOn} toggleVideo={toggleVideo} />
                <ShareScreenControl shareScreen={shareScreen} />
                <LeaveCallControl leaveCall={leaveCall} />
            </ControlsContainer>
        </RoomContainer>
    );
};

export default Room;
