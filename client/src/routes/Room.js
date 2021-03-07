import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const PeerVideoContainer = styled.div`
    padding: 1rem;
    display: flex;
    height: 90vh;
    width: 90vw;
    margin: auto;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
`;

const PeerVideo = styled.video`
    height: 50%;
    width: 40%;
    object-fit: cover;
`;

const UserVideo = styled.video`
    height: 60%;
    width: 40%;
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
  background: lightgrey;
`;

const RoomContainer = styled.div`
  background: black;
`

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <PeerVideo playsInline autoPlay ref={ref} />
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
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;

    let isVideoOn = true;
    let isAudioOn = true;

    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({
                        peerID: userID,
                        peer,
                    });
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                const peerObj = {
                    peerID: payload.callerID,
                    peer,
                }

                setPeers(users => [...users, peerObj]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
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
                    {url:'stun:stun01.sipphone.com'},
                    {url:'stun:stun.ekiga.net'},
                    {url:'stun:stun.fwdnet.net'},
                    {url:'stun:stun.ideasip.com'},
                    {url:'stun:stun.iptel.org'},
                    {url:'stun:stun.rixtelecom.se'},
                    {url:'stun:stun.schlund.de'},
                    {url:'stun:stun.l.google.com:19302'},
                    {url:'stun:stun1.l.google.com:19302'},
                    {url:'stun:stun2.l.google.com:19302'},
                    {url:'stun:stun3.l.google.com:19302'},
                    {url:'stun:stun4.l.google.com:19302'},
                    {url:'stun:stunserver.org'},
                    {url:'stun:stun.softjoys.com'},
                    {url:'stun:stun.voiparound.com'},
                    {url:'stun:stun.voipbuster.com'},
                    {url:'stun:stun.voipstunt.com'},
                    {url:'stun:stun.voxgratia.org'},
                    {url:'stun:stun.xten.com'},
                    {
                        url: 'turn:numb.viagenie.ca',
                        credential: 'muazkh',
                        username: 'webrtc@live.com'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=udp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    },
                    {
                        url: 'turn:192.158.29.39:3478?transport=tcp',
                        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                        username: '28224511:1379330808'
                    }
                ]
            },
            stream: stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

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

        return peer;
    }

    function toggleMicrophone() {
        isAudioOn = !isAudioOn;
        console.log(userStream.current)
        userStream.current.getAudioTracks()[0].enabled = isAudioOn;
    }

    function toggleVideo() {
        isVideoOn = !isVideoOn;
        console.log(userStream.current)
        userStream.current.getVideoTracks()[0].enabled = isVideoOn;
    }

    function shareScreen() {

    }

    function leaveCall() {

    }

    return (
        <RoomContainer>
            <UserVideoContainer>
                <UserVideo muted ref={userVideo} autoPlay playsInline />
            </UserVideoContainer>
            <PeerVideoContainer>
                {peers.map((peer) => {
                    return (
                        <Video key={peer.peerID} peer={peer.peer} />
                    );
                })}
            </PeerVideoContainer>
            <ControlsContainer>
                <button onClick={toggleMicrophone}>Toggle microphone</button>
                <button onClick={toggleVideo}>Toggle video</button>
                <button onClick={shareScreen}>Share screen</button>
                <button onClick={leaveCall}>Leave call</button>
            </ControlsContainer>
        </RoomContainer>
    );
};

export default Room;
