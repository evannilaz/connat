create database connat;

use connat;

create table accounts (
  id int not null auto_increment,
  un varchar(40) not null unique,
  pw varchar(72) not null,
  channels varchar(550) not null default '',
  primary key (id)
);

create table channels (
  id int not null auto_increment,
  cid varchar(10) not null unique,
  users tinytext not null,
  dm boolean not null,
  primary key (id)
);

create table history (
  id int not null auto_increment,
  cid varchar(10) not null,
  un varchar(40) not null,
  msg text not null,
  time timestamp not null default current_timestamp,
  primary key (id)
);