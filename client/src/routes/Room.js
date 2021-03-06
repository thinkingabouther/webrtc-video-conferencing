import React, {useRef, useEffect} from "react";
import io from "socket.io-client";

const Room = (props) => {
    const userVideo = useRef();
    const peerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const peer = useRef();
    const userStream = useRef();

    let isVideoOn = true;
    let isAudioOn = true;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true}).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID)

            socketRef.current.on("peer", userID => {
                callUser(userID);
                peer.current = userID;
            })

            socketRef.current.on("peer joined", userID => {
                peer.current = userID;
            })

            socketRef.current.on("offer", handleReceiveCall);
            socketRef.current.on("answer", handleAnswer);
            socketRef.current.on("ice-candidate", handleNewICECandidateMessage);

        });
    });

    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                }
            ]
        });
        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer)
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleReceiveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: peer.current,
                candidate: e.candidate
            };
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMessage(incoming) {
        const candidate = new RTCIceCandidate(incoming);
        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        peerVideo.current.srcObject = e.streams[0];
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
          <video autoPlay ref={userVideo}/>
          <video autoPlay ref={peerVideo}/>
          <button onClick={toggleMicrophone}>Toggle microphone</button>
          <button onClick={toggleVideo}>Toggle video</button>
      </div>
    );
};

export default Room;