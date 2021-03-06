import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
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
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {

                iceServers: [
                    // {
                    //     urls: "stun:numb.viagenie.ca",
                    //     username: "sultan1640@gmail.com",
                    //     credential: "98376683"
                    // },
                    // {
                    //     urls: "turn:numb.viagenie.ca",
                    //     username: "sultan1640@gmail.com",
                    //     credential: "98376683"
                    // }
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

    return (
        <div>
            <Container>
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                {peers.map((peer, index) => {
                    return (
                        <Video key={index} peer={peer} />
                    );
                })}
            </Container>
            <div   style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"}}>
                <button onClick={toggleMicrophone}>Toggle microphone</button>
                <button onClick={toggleVideo}>Toggle video</button>
            </div>
        </div>
    );
};

export default Room;
