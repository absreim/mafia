Absreim's Mafia - a simple web app of the mafia party game
==========================================================

Introduction
------------

This project started as an attempt to learn about the fundamentals of
development of single page applications using Node.js and React.

The game follows the typical model in mafia of pitting an informed
minority, in this case the werewolves, against an uninformed majority,
in this case the villagers.

The project includes a back end server and a React front end. The back end
is intended to be potentially usable with other front ends. Notably, the
original intention was to have an iOS client in addition to the React app,
although none has yet been developed.

Prerequisites
--------------

[Node.js](https://nodejs.org) version 8 or later is needed for both running 
the back end server, running the React development server, and for building 
the front end for production.

[npm](https://www.npmjs.com/) can be used for downloading and install Node.js
module dependencies.

[PostgreSQL](https://www.postgresql.org/) version 9 or later is used to store
user account information.

Installation
------------

### OS Compatibility

The back end server has been tested on Unbuntu and OS X but not Windows,
while the front end has been tested on Mozilla Firefox and Safari.

### Initialize the Node.js projects

Once the prerequisites are installed, clone the repository. To install the
Node.js module dependencies for the back end, navigate to the root directory 
of the repository and run `npm install`. To install to the Node.js depdencies
of the front end, navigate to the *client* subdirectory and run the same
command.

### Database setup

The back end uses a single table to user account information. You may use any
database you wish, though it is likely best if you create a separate one for
the app.

Once you have decided on the database to use, run the queries in 
*initialize.sql* on that database to create the table of user accounts and
password hashes.

Configure database connection parameters to your liking by editing the
*db_connection_params* object in *settings.json* configuration file.

In terms of authenticating with PostgreSQL, the server has been tested to work 
on Ubuntu with Ident authentication by installing 
[oidentd](https://oidentd.janikrabe.com/) and editing the *pg_hba.conf*
PostgreSQL configuration file accordingly.

To instead use password-based authentication, add *user* and *password* keys
to the *db_connection_params* object in *settings.json*. For example:

    "db_connection_params": {
        "host": "localhost",
        "port": "5432",
        "database": "mafia",
        "user": "username",
        "password": "myPassword"
    },

### Other configuration settings

Besides the database configuration settings in the *db_connection_params*
object, *settings.json* contains several other settings:

    "cookie_domain": "localhost",
    "dev_secret": "secret",
    "dev_port": 3001,
    "prod_port": 3000,
    "serve_frontend": false

`cookie_domain` - The back end uses cookies for session management, which is
senstive to domain names. Use `localhost` for testing client on the same host
as the server. Otherwise, the domain must match the domain name or ip address
that clients use to connect to server. Note that cookie domains do not include
port numbers.

`dev_secret` - The secret used for signing the session ID cookie when the
server is run in development mode. A simple string is fine for testing purposes,
but when running in production the secret should be much harder to guess and
contained in an environment variable named `SECRET`.

`dev_port` - The port used when running the server in development mode.
Typically, port 3000 would be already in use by the React development server, 
which is set up to proxy requests to the backend on port 3001.

`prod_port` - The port used when running the server in production. Default is
*3000*.

`serve_frontend` - If set to `true`, enables the back end to directly serve
a production build of the React front end in the */client/build* subfolder.
The default is `false`.

### Running in development

After configuration is complete, start the back end server in development mode
by navigating to the root directory of the repository and running `npm start`.
Similarly the React front end development server by navigating to the *client*
subdirectory and running the same command.

### Running in production

#### Back end

Running the back end in production mode requires setting the `SECRET`
environment variable to be used as the secret to sign session cookies.
Preferably, the secret should be a hard-to-guess string.

Then, set the `NODE_ENV` environment to `production`. Start the server
using `npm start`.

Currently, the back end server is not scalable and can only be run on a
single node.

#### Front end

To use the React front end in production, run a production build by navigating
to the *client* subdirectory and running `npm run build`. The files for the 
production build will be located in *client/build* subdirectory.

Serve the production build directory using the backend server by configuring
the `serve_frontend` key in *settings.json* or by configuring a different
web server like Nginx or Apache to directly serve the files.