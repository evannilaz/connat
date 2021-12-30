import * as sessionObject from "express-session";
import session = require("express-session");
import MySQLSession = require("express-mysql-session");
import fs = require("fs");

const profile: any = JSON.parse(fs.readFileSync("./profile.json", "utf-8"));
const MySQLStore = MySQLSession(sessionObject);

export = () => {
  return session({
    secret: profile.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "strict",
      maxAge: 31536000000
    },
    store: new MySQLStore({
      host: "localhost",
      user: profile.mysql.user,
      password: profile.mysql.password,
      database: "connat"
    }),
  });
};