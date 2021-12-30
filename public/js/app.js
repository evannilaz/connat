const side = document.querySelector('#side');
const chat = document.querySelector('#chat');
const chatPh = document.querySelector('#chat-ph');

const chatHeader = chat.querySelector('#chat-header');
const channelInfo = chatHeader.querySelector('#chat-header-info');

const bubbleList = chat.querySelector('#bubble-list');
const channelList = side.querySelector('#channel-list');

const chatForm = chat.querySelector('#chat-input-ex > form#chat-input-in');
const chatInput = chatForm.querySelector('input[type=text]');

const promptWindow = document.querySelectorAll('.prompt-ex');

const observer = new MutationObserver((event) => {
  if (!event[0].target.classList.contains('active')) {
    setTimeout(() => promptWindow[0].querySelector('.prompt-content > form input[type=text]#cid').value = '', 350);
  }
});

async function importChannelList() {
  return fetch('/channel/list', {
    method: 'POST'
  }).then((res) => res.text());
}

function initChannels() {
  const personIcon = chatHeader.querySelector('ion-icon[name=person]');
  const groupIcon = chatHeader.querySelector('ion-icon[name=people]');

  function openChannelHist(channel) {
    const activeChannel = channelList.querySelector('.active');
    if (activeChannel) activeChannel.classList.remove('active');
    
    channel.classList.add('active');
    channelInfo.innerHTML = channel.querySelector('.channel-id').innerHTML;
    channelInfo.className = channel.id;

    if (channel.classList.contains('group')) {
      personIcon.classList.add('hidden-hard');
      groupIcon.classList.remove('hidden-hard');
    } else {
      personIcon.classList.remove('hidden-hard');
      groupIcon.classList.add('hidden-hard');
    }

    chatPh.classList.add('hidden-hard');
    chat.classList.remove('hidden-hard');

    bubbleList.scrollTo(0, bubbleList.scrollHeight);
  }

  importChannelList().then((res) => {
    channelList.innerHTML = res;

    channelList.querySelectorAll('.channel').forEach((channel) => {
      channel.addEventListener('click', (event) => {
        const activeChannel = channelList.querySelector('.channel.active');
        let clickedChannel;
  
        if (event.target.classList.contains('channel-id') || event.target.classList.contains('channel-preview')) clickedChannel = event.target.parentElement.parentElement;
        else if (event.target.classList.contains('channel-info')) clickedChannel = event.target.parentElement;
        else clickedChannel = event.target;
        
        const cid = clickedChannel.id;
  
        if (!activeChannel || cid !== activeChannel.id) {
          fetch('/channel/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cid }),
          }).then(async (res) => {
            const chatHistory = await res.json();
            bubbleList.innerHTML = '';
            chatHistory.forEach((message) => bubbleList.innerHTML += _.formatMessage(message));
            openChannelHist(clickedChannel);
          });
        }
      });
    });
  });
}

function init() {
  const signOutButton = document.querySelector('header > input[type=button]');
  const leaveButton = chatHeader.querySelector('button.icon');
  const prompt = {
    joinForm: promptWindow[0].querySelector('form'),
    joinButton: promptWindow[0].querySelector('input[type=button]#join'),
    leaveButton: promptWindow[1].querySelector('input[type=button]#leave')
  };

  initChannels();

  function joinChannel() {
    const cid = promptWindow[0].querySelector('.prompt-content > form input[type=text]#cid').value;
    promptWindow[0].classList.remove('active');

    _.manageCh(cid, 'join').then((success) => {
      if (success) {
        initChannels();
        _.alert(`Successfully joined connection: #${cid}.`);
      } else {
        _.alert('Error: The CID entered is invalid.', true);
      }
    });
  }

  side.addEventListener('click', (event) => {
    if (event.target.id === 'side') {
      const activeChannel = channelList.querySelector('.active');

      chat.classList.add('hidden-hard');
      chatPh.classList.remove('hidden-hard');

      if (activeChannel) activeChannel.classList.remove('active');
    }
  });

  channelInfo.addEventListener('click', (event) => {
    navigator.clipboard.writeText(event.target.className).then(() => _.alert('Pasted the CID to clipboard.', false, 0));
  });

  chatPh.addEventListener('click', () => promptWindow[0].classList.add('active'));
  leaveButton.addEventListener('click', () => promptWindow[1].classList.add('active'));

  document.querySelectorAll('.prompt-control > input[type=button].standard').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.target.parentElement.parentElement.parentElement.classList.remove('active');
    });
  });

  promptWindow.forEach((prompt) => {
    prompt.addEventListener('click', (event) => {
      if (event.target.classList.contains('prompt-ex')) prompt.classList.remove('active');
    });
  });

  prompt.joinButton.addEventListener('click', joinChannel);
  prompt.joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    joinChannel();
  });
  
  prompt.leaveButton.addEventListener('click', () => {
    const cid = document.querySelector('.channel.active').id;
    promptWindow[1].classList.remove('active');

    _.manageCh(cid, 'leave').then(initChannels);

    chat.classList.add('hidden-hard');
    chatPh.classList.remove('hidden-hard');

    _.alert(`Successfully leaved connection: ${cid}.`);
  });

  signOutButton.addEventListener('click', () => {
    _.signOut().then(() => {
      _.alert('Signed out. Redirecting you in 5 seconds...', false, 0);
      setTimeout(() => location.href = '/account/signin', 5000)
    });
  });

  observer.observe(promptWindow[0], {
    attributes: true, 
    attributeFilter: ['class'],
    childList: false, 
    characterData: false
  });
}

init();