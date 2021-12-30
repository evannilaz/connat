import express = require('express');
import nanoid = require('nanoid');

import sql = require('../lib/mysql');
import _ = require('../lib/_');

const router: express.IRouter = express.Router();

router.post('/list', (req: any, res: express.Response) => {
  _.channel.getList(req.session.un, async(err: any, channelList: any) => {
    if (err) throw err;
  
    let result: string = '';
  
    if (channelList[0].channels) {
      for (let cid of channelList[0].channels.trim().split(' ')) {
        const channelInfo: any = (await (await sql.promise).execute('select users, dm from channels where cid = ? limit 1', [cid]))[0];
        const lastMsg: any = (await (await sql.promise).execute('select msg from history where id = (select max(id) from history where cid = ?)', [cid]))[0];
        
        let userList: Array<string> = channelInfo[0].users.trim().split(' ');
        userList.splice(userList.indexOf(req.session.un), 1);
  
        result += _.html.part('channel', [cid, userList ? (channelInfo[0].dm ? userList[0] : cid) : 'Empty Channel', lastMsg[0] ? lastMsg[0].msg : '', channelInfo[0].dm ? 'user' : 'group']);
      }
    }
  
    res.send(result);
  });
});

router.post('/history', (req: any, res: express.Response) => {
  let result: Array<any> = [];

  // TODO: Load messages when scroll up
  // FIXME: Group messages from the same user into one
  sql.async.query('select un, msg, time from history where cid = ? order by id desc limit 20', [req.body.cid], (err, data: any) => {
      if (err) throw err;

      data.reverse().forEach((message: any) => {
        result.push({
          isSelf: message.un === req.session.un,
          un: message.un,
          text: message.msg,
          time: _.getDate()
        });
      });

      res.send(JSON.stringify(result));
  });
});

router.post('/create', async (req: any, res: express.Response) => {
  let cid: string;

  async function duplicateCID(cid: string): Promise<boolean> {
    const duplicate: any = (await (await sql.promise).execute('select id from channels where cid = ? limit 1', [cid]))[0];
    if (duplicate[0]) return true;
    else return false;
  }

  while (true) {
    cid = nanoid.nanoid(10);
    if (!(await duplicateCID(cid))) break;
    else continue;
  }

  sql.async.query('insert into channels (cid, users, dm) values (?, ?, ?)', [cid, req.body.invitee ? `${req.session.un} ${req.body.invitee} ` : `${req.session.un} `, req.body.isDirectMessage]);
  sql.async.query('update accounts set channels = concat(channels, ?) where un = ?', [`${cid} `, req.session.un]);
  sql.async.query('update accounts set channels = concat(channels, ?) where un = ?', [`${cid} `, req.body.invitee], (err) => {
    if (err) throw err;
    res.send(cid);
  });
});

router.post('/join', async (req: any, res: express.Response) => {
  if (req.body.cid.length === 10) {
    _.channel.getList(req.session.un, (err: any, data: any) => {
      if (err) throw err;
  
      if (!data[0].channels.trim().split(' ').includes(req.body.cid)) {
        sql.async.query('select users, dm from channels where cid = ? limit 1', [req.body.cid], (err, data: any) => {
          if (err) throw err;
  
          if (data[0] && !(data[0].users.trim().split(' ').includes(req.session.un) || data[0].dm)) {
            sql.async.query('update channels set users = concat(users, ?) where cid = ?', [`${req.session.un} `, req.body.cid]);
            sql.async.query('update accounts set channels = concat(channels, ?) where un = ?', [`${req.body.cid} `, req.session.un], (err) => {
              if (err) throw err;
              res.send(true);
            });
          } else res.send(false);
        });
      } else res.send(false);
    });
  } else res.send(false);
});

router.post('/leave', (req: any, res: express.Response) => {
  if (req.body.cid.length === 10) {
    _.channel.getList(req.session.un, (err: any, data: any) => {
      if (err) throw err;
  
      let channelList: Array<string> = data[0].channels.trim().split(' ');
      if (channelList.includes(req.body.cid)) {
        sql.async.query('select users from channels where cid = ? limit 1', [req.body.cid], (err, data: any) => {
          if (err) throw err;
          let userList: Array<string> = data[0].users.trim().split(' ');
  
          if (userList.includes(req.session.un)) {
            channelList.splice(channelList.indexOf(req.body.cid), 1);
            userList.splice(userList.indexOf(req.session.un), 1);
  
            sql.async.query('update channels set users = ? where cid = ?', [(userList.toString().replaceAll(',', ' ') + ' '), req.body.cid]);
            sql.async.query('update accounts set channels = ? where un = ?', [(channelList.toString().replaceAll(',', ' ') + (channelList[0] ? ' ' : '')), req.session.un], (err) => {
              if (err) throw err;
  
              res.send(true);
            });
          } else res.send(false);
        });
      } else res.send(false);
    });
  } else res.send(false);
});

export = router;