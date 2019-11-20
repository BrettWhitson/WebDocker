/**
 * @fileoverview The file that holds all the Dockerode Node module
 * and functionality to the electron application
 * @author Lucian Freeze
 * @author Garrett Hay
 * @author Brett Whitson
 * 
 * @requires NPM:node_modules
 * 
 */

/**
 * main importation of express
 * @type {Express}
 */
const express = require('express');

/**
 * main importation of dockerode
 * @constant
 * @type {Dockerode}
 */
const Docker = require('dockerode');

const http = require('http');

/**
 * initializing Express Router to use for HTTP request routing
 * @constant
 * @type {Router}
 */
const router = express.Router();

/**
 * The main dockerode connection to local Docker instance.
 * @constant
 * 
 * @type {Dockerode}
 */
const docker = new Docker({
    host: '127.0.0.1',
    port: 2375
});



/**
 * Creates a Container in local Docker and runs given function with 
 *  the container as a parameter, usually should be a start function
 * 
 * @function
 * @param {string} imageName App Name
 * @param {function} fn
 * 
 */
function createContainer(imageName, fn) {
    docker.createContainer({
        Image: imageName,
        Tty: true,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['/bin/sh'],
        OpenStdin: true
    }, function (err, container) {
        if(err) {
            pullImage(imageName);
        }
        console.log(imageName); 
        fn(container);
    });
}

/**
 * Attempts to pull new images to local docker then create a container from the 
 *  image.
 * Should only gets called if the image is not in docker already.
 * 
 * @function
 * @param {string} imageName 
 */
function pullAndStart(imageName) {
    docker.pull(imageName, function (err, container) {
        docker.createContainer({
            Image: imageName,
            Tty: true,
            AttachStdin: true,
            Cmd: ['/bin/sh']
        });
    });
}

/**
 * Attempts to pull new images to local docker to use later.
 * Only gets called if the image is not in docker already and called by the 
 * createContainer function
 * 
 * @function
 * @param {string} imageName 
 */
function pullImage(imageName) {
    docker.pull(imageName, function (err) {
        console.log(err);
    });
}


/**
 * Test to print all containers and all their information
 * 
 * @function
 * @ignore
 */
function getContainer() {
    docker.listContainers(function (err, containers) {
        console.log(containers);
    });
}

/**
 * Takes the Id of a Container checks if it is running or not, then toggle that
 *  state of the container
 * 
 * @function
 * @param {string} IdName The ID of the Container chosen
 */
function containerStartStop(IdName) {
    let container = docker.getContainer(IdName);
    container.inspect(function (err, data) {
        console.log(data.State.Status);
        if (data.State.Running) {
            container.stop();
        } else {
            container.start();
        }
    });
}

/**
 * Kills a specifed Container, by ID, if running and then
 * removes the container from Docker
 * 
 * @function
 * @param {string} IdName
 */
function containerDestroy(IdName) {
    let container = docker.getContainer(IdName);
    container.inspect(function (err, data) {
        if (data.State.Running) {
            container.kill(function (err) {
                container.remove(function (err) {
                    console.log('container removed');
                });
            });
        } else {
            container.remove(function (err) {
                console.log('container removed');
            });
        }
    });
}

/**************************ROUTING STARTS**************************/

/**
 * Route for Testing default route
 * 
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware -Express middleware
 */
router.get('/', (req, res) => {
    res.send("<h1>Woo!</h1>")
});


/* Test Code - Soon to be Deleted */
// wsapp.ws('/ws/:Id', (ws, req) => {
//     ws.on('open', msg => {
//         var container = docker.getContainer(req.params.Id);
//         container.attach({stream: true, stdin:true, stdout: true, stderr: true}, function (err, stream) {
//             ws = websocket('wss://webdocker.utm.edu/docker/ws/'+ req.params.Id);
//             process.stdin.pipe(ws);
//             ws.pipe(process.stdout);
//             console.log(err);
//         });
//     })

//     ws.on('close', () => {
//         console.log('WebSocket was closed')
//     })
    
//     var container = docker.getContainer(req.params.Id);
//     container.attach({stream: true, stdin:true, stdout: true, stderr: true}, function (err, stream) {
//         var ws = websocket('wss://webdocker.utm.edu/docker/ws/'+ req.params.Id);
//         process.stdin.pipe(ws);
//         ws.pipe(process.stdout);
//         console.log(err)
//     });
// });

/**
 * Route called to create a new container
 * 
 * @name post/newcontainer
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware -Express middleware
 */
router.post('/newcontainer', (req, res) => {
    createContainer(req.body.Image, function (container) {
        try {
            container.start();
            console.log(container.id);
            res.send(container.id);
        } catch (error) {
            res.send("ERROR CONTAINER NO EXIST YET");
        }
    });
    console.log("tried request");
});

/**
 * Route called to toggle and return the new state of a singular container
 * 
 * @name get/startstop
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware -Express middleware
 */
router.get('/startstop', (req, res) => {
    let newState = req.query.StartStop;
    console.log("Switching Container");
    containerStartStop(req.query.Id);
    console.log("Sending new state Parameter");
    if (newState === "running") {
        newState = "exited";
    } else {
        newState = "running";
    }
    res.send(newState); 
});

/**
 * Route called to GET information for a singular container
 * 
 * @name get/getinfo
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware -Express middleware
 */
router.get('/getinfo', (req,res) => {
    container = docker.getContainer(req.query.ID);
    container.inspect(function (err, data) {
        res.send(data);
     });
});


/**
 * Route called to delete containers
 * 
 * @name delete/deletecontainer
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware -Express middleware
 */
router.delete('/deletecontainer', (req,res) => {
    //logs the ID given to the request
    console.log(req.body.delID);
    containerDestroy(req.body.delID);
    res.send("Container Deleted")
});

module.exports = router;