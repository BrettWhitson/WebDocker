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
 * @type {Dockerode}
 */
const Docker = require('dockerode');
const router = express.Router();

/**
 * The main dockerode connection.
 * @constant
 * 
 * @type {Dockerode}
 */
const docker = new Docker({
    host: '127.0.0.1',
    port: 2375
});

/**
 * Creates a Container in Docker given the application name
 * @param {string} imageName App Name
 * 
 * @returns {string} Id of container
 */
function createContainer(imageName) {
    var nextContainer;
    
    docker.createContainer({
        Image: imageName,
        Tty: true,
        AttachStdin: true,
        Cmd: ['/bin/sh']
    }, function (err, container) {
        nextContainer = container;
        try {
            nextContainer.start(function (err, data) {
                return data;
            });
        } catch (error) {
            console.log("SOMETHING BAD HAPPENED!");
        }

    });
}

function getContainerItems(ConId) {
    let container = docker.getContainer(ConId);
    res.send({
        Image: container.Image,
        Name: container.Name[0],
        Status: container.Status
    });
}


function getContainerNames() {
    docker.listContainers(function (err, containers) {
        console.log(containers);
    });
}

/**
 * Takes the Id of a Container,
 *  Checks if it is running or not,
 *  and then toggle that state of the container
 * 
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


// Routing

router.get('/', (req, res) => {
    res.send("<h1>Woo!</h1>")
});

router.post('/newcontainer', (req, res) => {
    console.log(req.body.Image);
    console.log(createContainer(req.body.Image));
    container.start();
    res.send(container.Id);
    console.log("tried request");
});

router.get('/start_stop', (req, res) => {
    let newState = req.body.StartStop;
    console.log("Switching Container");
    containerStartStop(req.body.Id);
    console.log("Sending new state Parameter");
    if (newState === "running") { newState = "exited"; }
    else { newState = "running"; }
    res.send(newState);
});


// container();

module.exports = router;