import express = require("express");
import fs = require("fs");
import moment = require('moment');

import sql = require('./mysql');

interface Option {
  res: express.Response;
  part?: string;
  repl?: {
    base?: string[];
    part?: string[];
  };
}

export = {
  html: {
    replace: (string: string, replace: string[]): string => {
      for (let i = 0; i < replace.length; i++) {
        let regex: string = "\\$\\{" + (i + 1).toString() + "\\}";
        string = string.replace(new RegExp(regex, "g"), replace[i]);
      }

      return string;
    },
    part: function (file: string, arr?: string[]): string {
      let part: string = fs.readFileSync(`./html/part/${file}.html`, "utf-8");
      return arr ? this.replace(part, arr) : part;
    }
  },
  channel: {
    getList: (un: any, callback: any): void => {
      sql.async.query('select channels from accounts where un = ? limit 1', [un], callback);
    }
  },
  getDate: (): string => moment().format('MMM DD, hh:mm A'),
  send: function (file: string, option: Option): void {
    let base: string = fs.readFileSync(`./html/${file}.html`, "utf-8");
    let result: string = base;

    if (option.part) {
      let part: string = "";

      if (option.repl) {
        if (option.repl.base) base = this.html.replace(base, option.repl.base);
        if (option.repl.part)
          part = this.html.part(option.part, option.repl.part);
      } else {
        part = this.html.part(option.part);
      }

      result = base.replace("${c}", part);
    } else {
      if (option.repl) {
        if (option.repl.base) base = this.html.replace(base, option.repl.base);
      }

      result = base;
    }

    option.res.send(result);
  }
};