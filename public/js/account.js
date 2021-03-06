import { _ } from '/js/_.js';

const form = document.querySelector('form');

const isSignIn = location.href.includes('signin');
const unRegex = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const messages = {
  empty: 'Please fill out all of the input boxes.',
  incorrect: 'Incorrect username or password.',
  duplicate: 'Account with this username already exists.',
  retype: 'The retyped password has a typo.',
  username: 'Please follow the username <u onclick="alert(\'A username must be 6-20 in length and can include the dot, underscore and hyphen, and they must not be consecutive.\')">format</u>.',
  password: 'Please follow the password <u onclick="alert(\'A password must be 8+ in length and include at least one upper/lowercase, one number and one special character.\')">format</u>.',
  signUpSuccess: 'You are now one of us.',
  signInSuccess: 'Successfully signed in.'
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  if (username && password) {
    if (!isSignIn && (!passwordConfirm || !unRegex.test(username) || !password === passwordConfirm || !pwRegex.test(password))) {
      if (!passwordConfirm) _.alert(messages.empty, true);
      else if (!unRegex.test(username)) _.alert(messages.username, true);
      else if (password !== passwordConfirm) _.alert(messages.retype, true);
      else if (!pwRegex.test(password)) _.alert(messages.password, true);
      return;
    }

    fetch(location.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(async (res) => {
      const valid = await res.json();

      if (isSignIn) {
        if (valid) {
          _.alert(messages.signInSuccess, false);
          setTimeout(() => location.href = '/', 2000);
        } else {
          _.alert(messages.incorrect, true, 0);
        }
      } else {
        if (valid) {
          _.alert(messages.signUpSuccess, false);
          setTimeout(() => location.href = '/account/signin', 2000);
        } else {
          _.alert(messages.duplicate, true);
        }
      }
    });
  } else {
    _.alert(messages.empty, true);
  }
});