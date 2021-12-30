// THIS CODE IS NOT INITIAL. WHEREAS VERY MUCH USED CODE...

const connationList = document.querySelector('#connations');
const chatIndicator = document.querySelector('#bubbles');

//socket.io

const socket = io()

//document const(public static String object lineup)

const nickname = document.querySelector("#nickname")
const chatList = document.querySelector(".chatting-list")
const chatInput = document.querySelector(".chatting-input")
const sendButton = document.querySelector(".send-button")

//main code(f(x) codes only / public static void.String)

function createElement(str) {
    const frag = document.createDocumentFragment();
    const elem = document.createElement("div");
    elem.innerHTML = str;

    while(elem.childNodes[0]) {
        frag.appendChild(elem.childNodes[0]);
    }

    return frag;
}

function getDate() {
    const d = new Date();
    const ww = d.getHours() + ":" + d.getMinutes();
    return ww;
}

//JavaScript Codes which calls upper f(x)

chatInput.addEventListener("keypress", (event)=>{
    if(event.keyCode === 13) {
        alert(getDate() + '- is the time right now')
    }
})

sendButton.addEventListener("click", ()=>{
    var myDiv = document.getElementById("chat");
    myDiv.scrollTop = myDiv.scrollHeight;
    
    const param = {
        name: nickname.value,
        msg: chatInput.value
    }

    socket.emit("chatting", param)
})

socket.on("chatting", (data) => {
    
    if(data.name != nickname.value) {
        const name = data.name;
        const msg = data.msg;

        const html = `
        <div id="msgContainer">    
        <div class="chat-inner" id="DATE">
            code2133 ${name} sent ${msg}
        </div><br>
        </div>
        `

        let fragment = createElement(html)
        chatList.appendChild(fragment)

        return;
    }

    const name = data.name;
    const msg = data.msg;

    const html = `
    <div id="msgContainer">    
    <div class="chat-outter" id="null">
    code6455 ${name} sent ${msg}
    </div><br></div>
    `

    let fragment = createElement(html)
    chatList.appendChild(fragment)
})


// fetch('location.href', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify()
// });