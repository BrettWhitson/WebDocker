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
function createContainer(imageName, fn) {
    docker.createContainer({
        Image: imageName,
        Tty: true,
        AttachStdin: true,
        Cmd: ['/bin/sh']
    }, function (err, container) {
        // console.log(container);
        fn(container);
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

// Routing

router.get('/', (req, res) => {
    res.send("<h1>Woo!</h1>")
});

router.post('/newcontainer', (req, res) => {
    createContainer(req.body.Image, function (container) {
        try {
            container.start();
            setTimeout(() => {
                console.log(container.id);
                res.send(container.id);
            }, 1500);
        } catch (error) {
            res.send("ERROR CONTAINER NO EXIST YET");
        }
    });
    console.log("tried request");
});

router.get('/startstop', (req, res) => {
    let newState = req.body.StartStop;
    console.log("Switching Container");
    containerStartStop(req.body.Id);
    console.log("Sending new state Parameter");
    if (newState === "running") {
        newState = "exited";
    } else {
        newState = "running";
    }
    res.send(newState);
});

router.get('/getinfo', (req,res) => {
    container = docker.getContainer(req.query.ID);
    container.inspect(function (err, data) {
        res.send(data);
     });
});

router.delete('/deletecontainer', (req,res) => {
    console.log(req.body.delID);
    containerDestroy(req.body.delID);
    res.send("Container Deleted")
});

module.exports = router;