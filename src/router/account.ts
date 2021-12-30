import express = require('express');
import bcrypt = require('bcrypt');

import sql = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.get('/signin', (req: any, res: express.Response) => {
  if (!req.session.un) _.send('card', { res, part: 'signin' });
  else res.redirect('/');
});

router.post('/signin', (req: any, res: express.Response) => {
  sql.async.query('select pw from accounts where binary un = ?', [req.body.un], (err, account: any) => {
    if (err) throw err;

    if (!account[0]) {
      res.send(false);
    } else {
      bcrypt.compare(req.body.pw, account[0].pw, (err, result) => {
        if (result) {
          req.session.un = req.body.un;
          res.send(true);
        } else {
          res.send(false);
        }
      });
    }
  });
});

router.get('/signup', (req: any, res: express.Response) => {
  if (!req.session.un) _.send('card', { res, part: 'signup' });
  else res.redirect('/');
});

router.post('/signup', (req: any, res: express.Response) => {
  sql.async.query('select exists(select * from accounts where un = ? limit 1)', [req.body.un], (err, exists: any) => {
    if (err) throw err;

    if (!exists[0][Object.keys(exists[0])[0]]) {
      bcrypt.hash(req.body.pw, 10, (err, pw) => {
        if (err) throw err;

        sql.async.query("insert into accounts (un, pw) values (?, ?)", [req.body.un, pw], (err, data) => {
          if (err) throw err;
          res.send(true);
        });
      });
    } else {
      res.send(false);
    }
  });
});

router.delete('/signout', (req: express.Request, res: express.Response) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.send();
  });
})

export = router;