# WebDocker

WebDocker is an Easy-to-Use, Accessible Online Platform for Running Containers on the Web.

# WebDocker Usage
WebDocker is a Web Application that allows users to:
* Create and manage containers
* Interact via a simplified interface
* Work in a disposable, remote environment

All without users needing to worry about the ins and outs of maintaining the Docker runtime.

# Structure
## Components
* Docker
* Node.js
* NGINX
* Google Firebase

## Connections
![PNG of Structure](https://github.com/bremwhit/WebDocker/blob/master/READMEimgs/WebDocker_Structure.png)

# Examples

## Authentication
WebDocker has been developed with authentication capability with *Google Firebase* for verification and login. The application takes care of sign up via the "Sign up" page:
![Gif of Signup](https://github.com/bremwhit/WebDocker/blob/master/READMEimgs/signup.gif)

## Container Control
After logging in, the user will be directed to their main page. From the main page the user can view all of their current containers and their current configurations in order of:

* Container ID
* Docker image
* Default interaction shell
* Current running status
* Container Name
* Deletion ability

WebDocker also allows the ability to add containers directly to their container list from the docker host or docker hub!

![Gif of Addition](https://github.com/bremwhit/WebDocker/blob/master/READMEimgs/addition.gif)

## Container Interaction
Once the user has the containers they need, they can access the docker container shell from WebDocker by clicking on the **Default interaction shell** in the configuration menu.  

![Gif of Opening_Shell](https://github.com/bremwhit/WebDocker/blob/master/READMEimgs/shell_open.gif)

The shell will open below the container it is attached to. From there the user is able to interact in real-time with the docker container via the shell.

![Gif of Opening_Shell](https://github.com/bremwhit/WebDocker/blob/master/READMEimgs/realtime_shell.gif)

