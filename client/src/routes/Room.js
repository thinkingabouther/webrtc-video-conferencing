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
          <video autoPlay muted ref={userVideo}/>
          <video autoPlay ref={peerVideo}/>
          <button onClick={toggleMicrophone}>Toggle microphone</button>
          <button onClick={toggleVideo}>Toggle video</button>
      </div>
    );
};

export default Room;