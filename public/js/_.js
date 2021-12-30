const _ = {
  newCh: (invitee, isDirectMessage) => { // if `isDirectMessage` is false, set `invitee` to null
    fetch('/channel/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitee, isDirectMessage })
    }).then(async (res) => {
      const result = await res.text();
      console.log(`A new channel (#${result}) has been successly created.`);
    });
  },
  manageCh: (cid, option) => (
    fetch(`/channel/${option}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cid })
    }).then((res) => res.json())
  ),
  dummy: (un, pw = 'password') => {
    fetch('/account/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ un, pw })
    }).then(() => {
      console.log(`A new dummy account ${un} has been successfully created.`);
    });
  },
  alert: (msg, isError = false, time = 600) => {
    setTimeout(() => {
      const alert = document.querySelector('#alert');

      alert.innerHTML = msg;
      if (isError && !alert.classList.contains('error')) alert.classList.add('error');
      else if (!isError && alert.classList.contains('error')) alert.classList.remove('error');
  
      alert.classList.add('active');
      setTimeout(() => alert.classList.remove('active'), 2500);
    }, time);
  },
  formatMessage: ({ isSelf, un, text, time }) => {
    return `
    <div class="bubble-ex ${isSelf ? 'self' : 'server'}">
    <div class="user">${un}</div>
    <div class="bubble-in">
      <div class="msg">${text}</div>
      <div class="time">${time}</div>
    </div>
    </div>
    `;
  },
  signOut: () => fetch('/account/signout', { method: 'DELETE' })
}