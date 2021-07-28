console.log("hello index.js");

function webSocketInvoke() {
    if ("WebSocket" in window) {
        console.log("WebSocket is supported by your browser!");
        const ws = new WebSocket("ws://localhost:8181/","echo-protocol");

        ws.onopen = function() {
            console.log("connection created");
        };

        ws.onmessage = function (event) {
            console.log("hi event");
            console.log(event.data);
        }

        ws.onclose = function() {
            console.log("connection closed");
        };
    } else {
        alert("websocket is not supported by your browser");
    }
}

webSocketInvoke();