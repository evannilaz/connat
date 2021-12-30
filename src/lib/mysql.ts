import mysql = require("mysql2");
import asyncMysql = require("mysql2/promise");
import fs = require("fs");

const profile: any = JSON.parse(fs.readFileSync("./profile.json", "utf-8"));

let asyncConnection: asyncMysql.Connection;
const connection: mysql.Connection = mysql.createConnection({
  host: "localhost",
  user: profile.mysql.user,
  password: profile.mysql.password,
  database: "connat",
});

async function asyncConnect() {
  if (!asyncConnection) {
    asyncConnection = await asyncMysql.createConnection({
      host: "localhost",
      user: profile.mysql.user,
      password: profile.mysql.password,
      database: "connat",
    });

    await asyncConnection.connect();
  }

  return asyncConnection;
}

export = {
  async: connection,
  promise: asyncConnect(),
};