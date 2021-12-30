const form = document.querySelector('form');
const msg = document.querySelector('.msg');
const unInput = form.querySelector('input#un');
const pwInput = form.querySelector('input#pw');
const rpwInput = form.querySelector('input#rpw');

const isSignIn = location.href.includes('signin');
const unRegex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const msgList = {
  empty: ' Please fill out the input boxes.',
  incorrect: ' Incorrect username or password.',
  duplicate: ' Account with this username already exists.',
  success: ' You are now one of us.',
  retype: ' The retyped password has a typo.',
  un: ' Please follow the username <u onclick="alert(\'A username must be 6-20 in length and can include the dot, underscore and hyphen, and they must not be consecutive.\')">format</u>.',
  pw: ' Please follow the password <u onclick="alert(\'A password must be 8+ in length and include at least one upper/lowercase, one number and one special character.\')">format</u>.',
};

async function showMsg(msgContent) {
  if (msgContent === 'success') {
    msg.classList.remove('fail');
    msg.classList.add('success');
  } else {
    msg.classList.remove('success');
    msg.classList.add('fail');
  }

  msg.innerHTML = msgList[msgContent];

  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 5000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (unInput.value && pwInput.value) {
    if (!isSignIn && (!rpwInput.value || !unRegex.test(unInput.value) || !pwInput.value === rpwInput.value || !pwRegex.test(pwInput.value))) {
      if (!rpwInput.value) showMsg('empty');
      else if (!unRegex.test(unInput.value)) showMsg('un');
      else if (pwInput.value !== rpwInput.value) showMsg('retype');
      else if (!pwRegex.test(pwInput.value)) showMsg('pw');
      return;
    }

    let body = {
      un: unInput.value,
      pw: pwInput.value,
    };

    fetch(location.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(async (res) => {
      const result = await res.json();

      if (isSignIn) {
        if (!result) {
          showMsg('incorrect');
        } else {
          location.href = '/';
        }
      } else {
        if (!result) {
          showMsg('duplicate');
        } else {
          await showMsg('success');
          setTimeout(() => (location.href = '/account/signin'), 2000);
        }
      }
    });
  } else {
    showMsg('empty');
  }
});