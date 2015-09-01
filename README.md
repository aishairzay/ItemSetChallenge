#Item Set Challenge

###Up now at www.LeagueOfBuilds.com

##Design
Frontend folder -
  Contains all publicly served files separated into js/css/images/templates folders.
Backend -
  Contains handling for all routes in routes files and contains database schema information.
app.js -
  Lays out a framework for all routes and their cooresponding actions and handles all server configurations.

##Developer Notes
You must make a file name keys.js in the root directory containing your RIOT API key in order to develop on top of this project.
Your keys.js file must contain a line like the following: "exports.RIOT_API_KEY = '<api_key_here>'"

###Running Instructions
- Clone the repo

- Create your keys.js file as mentioned above

- Run "npm install"

- Start mongodb on its default port

- Run the command "npm start" 