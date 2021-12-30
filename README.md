# Connat

### Acknowledgement

This project was originally hosted by [captain0potlid](https://github.com/captain0potlid) in the name of [Artrium Code](https://github.com/captain0potlid/Artrium-Chat). However, this app is now being hosted by me, with its name changed to **Connat**.

## About

Connat is an application that has modern and simple design while being feature-rich at the same time.

This application will have features below:

### Features

- [ ] Live Chatting using socket.io
- [ ] Anonymous Chatting
- [ ] Account/Friend Management
- [ ] Group Chatting
- [ ] PWA/Electron Implement
- [ ] Integration with Kiwitter
- [ ] Connection with third-party SNS
- [ ] Korean/Japanese Support
- [ ] API Support

### Dependancies

Check out [`package.json`](./package.json) for the list of dependancies.

### Branches

- `dev`: Main development branch. Every single update happens on this branch.
- `main`: Will not be used during initial development stage, but this branch will be used when this app is deployed.

### Versions

- `DV-xX.X` (dev): The latest version. Since this version is quite unstable, it is only accessible to the developers.

### Deployment Date

Deployment for this project is not specified yet, but this project will be available for public by the end of 2021.

### Testing

You can check out how this app looks like by running the server by yourself. First of all, you'll need to make a `profile.json` file **at the root of the project directory**, which is for identifying MySQL user data and session's secret. Here is the format:

```json
{
  "secret": "your_session_secret",
  "mysql": {
    "user": "your_mysql_username",
    "password": "your_mysql_user_password"
  }
}
```

After you've done that, you'll have to create a database and tables. To do that, you have to import the `source.sql` file. The `source.sql` file will create the database named `connat` by itself, so you won't have to make a new database before you import the file.

All you need to do now is just installing the dependancies, and you're good to go. You can run the command below to run the application:

```console
foo@bar:~$ npm start # This will run the application via Node.js.

foo@bar:~$ npm run dev # This will compile & run the application.
```
