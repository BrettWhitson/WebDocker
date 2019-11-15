$(function () {

    /*
        Firebase API key here
    */

    const signout = document.getElementById("signout-btn");
    const addnew = document.getElementById("addnew-button");
    const auth = firebase.auth();
    const $addnew_window = $("#new-container-window");
    const database = firebase.database()
    auth.onAuthStateChanged(function (user) {
        if (user) {
            const displayName = user.displayName;
            const userID = auth.currentUser.uid;
            console.log(displayName);

            document.getElementById("banner-text").innerText = "Welcome to WebDocker, " + displayName;

            database.ref('users/' + userID + '/containers').once('value').then(function (snapshot) {
                var containers = snapshot.val();
                if (snapshot.val()) {
                    Object.keys(containers).forEach(function (item) {
                        var containerID = containers[item];

                        $.get("docker/getinfo", {
                                ID: containerID
                            },
                            function (data, textStatus, jqXHR) {
                                var $newItem = $("#template-item").clone();
                                console.log(data.Id);
                                $newItem.find("#container-ID").text(data.Id.slice(0, 12)).data("full-id", data.Id).on('click', function () {
                                    alert($(this).data("full-id"));
                                });
                                $newItem.find("#container-image").text(data.Config.Image);
                                $newItem.find("#container-cmd").text(data.Config.Cmd);
                                $newItem.find("#container-status").find(".status-btn").text(data.State.Status)
                                .data("id", data.Id)
                                .data("status", data.State.Status);
                                $newItem.find("#container-name").text(data.Name);
                                $newItem.find(".delbutton").attr("data-id", data.Id).attr("data-id-key", item);
                                $newItem.find("#terminal-window").data("container-id", data.Id);

                                $newItem.attr('class', 'container-item item-' + getListIterator());
                                $(".container-list").append($newItem);
                            }
                        );
                    })
                }
            })
        } else {
            console.log("no user");
            window.location = "/index.html";
        }
    })

    signout.addEventListener('click', e => {
        firebase.auth().signOut();
        window.location = "/index.html";
    })

    $("#addnew-button").click(function () {
        $addnew_window.removeClass('hidden');
        $addnew_window.addClass('shown-absolute')
        $("#txt-new-container").focus();
    })

    $("#close-addnew").click(function () {
        $addnew_window.removeClass('shown-absolute');
        $addnew_window.addClass('hidden');
    })

    $("#txt-new-container").keyup(function (e) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            $("#submit-new-container").click();
            $("#close-addnew").click();
        }
    });

    $("#submit-new-container").click(function () {
        if ($("#txt-new-container").val()) {
            $.post("docker/newcontainer", {
                    Image: $("#txt-new-container").val()
                },
                function (data, textStatus) {
                    if (data === 'ERROR CONTAINER NO EXIST YET') {
                        alert("Image pulling. Please try again shortly.");
                    } else {
                        var key = database.ref('users/' + firebase.auth().currentUser.uid + '/containers').push(data).key;
                        console.log(data);
                        createNewListItem(data, key);
                    }
                }
            );
            $("#close-addnew").click();
        } else {
            console.log("New container Text is empty");
        }
    })

    $(".container-list").on('click', '.container-ID', function () {
        var $id = $(this).next('.delbutton').attr("data-id");
        alert($id);
    })

    $(".container-list").on('click', '#container-cmd', function () {
        let termWindow = $(this).closest(".container-item").find("#terminal-window")
        let termWindowDOMOBJECT = termWindow.get(0);
        let containerID = termWindow.data("container-id");
        termWindow.slideToggle(200);

        const term = new Terminal();
        const socket = new WebSocket('wss://webdocker.utm.edu:8090/v1.24/containers/' + containerID + '/attach/ws?stream=1&stdin=1&stdout=1');
        const attachAddon = new AttachAddon.AttachAddon(socket);
        const fitAddon = new FitAddon.FitAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(attachAddon);
        term.open(termWindowDOMOBJECT);

        function runTerminal() {
            if (term._initialized) {
                return;
            }

            term._initialized = true;

            term.prompt = () => {
                term.write('\r\n\# ');
            };

            term.onKey(e => {
                const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

                if (e.domEvent.keyCode === 13) {
                    // socket.send()
                    prompt(term);
                } else if (e.domEvent.keyCode === 8) {
                    // Do not delete the prompt
                    if (term._core.buffer.x > 2) {
                        term.write('\b \b');
                    }
                } else if (printable) {
                    // term.write(e.key);
                }
            });
        }

        runTerminal();
    })

    $(".container-list").on('click', '.status-btn', function () {
        $runID = $(this).data("id");
        $startStop = $(this).data("status");
    
        $.ajax({
            type: "get",
            url: "docker/startstop",
            data: {
                Id: $runID,
                StartStop: $startStop
            },
            success: function (res) {
                console.log(res);
            }
        });
    });

    $(".container-list").on('click', '.delbutton', function () {
        $delID = $(this).attr("data-id");
        $delKey = $(this).attr("data-id-key");
        if (confirm("Are you sure you want to do that? you can't get it back!")) {
            var userID = firebase.auth().currentUser.uid;
            const ref = firebase.database().ref('users/' + userID + '/containers/' + $delKey);

            $.ajax({
                type: "delete",
                url: "docker/deletecontainer",
                data: {
                    delID: $delID
                },
                success: function (res) {
                    console.log(res);
                }
            });
            $(this).closest(".container-item").remove();
            ref.remove();
        }
    })

    function createNewListItem(containerID, dbKey) {
        $.get("docker/getinfo", {
                ID: containerID
            },
            function (data, textStatus, jqXHR) {
                var $newItem = $("#template-item").clone();
                $newItem.find("#container-ID").text(data.Id.slice(0, 12)).data("full-id", data.Id).on('click', function () {
                    alert($(this).data("full-id"));
                });
                $newItem.find("#container-image").text(data.Config.Image);
                $newItem.find("#container-cmd").text(data.Config.Cmd);
                $newItem.find("#container-status").find(".status-btn").text(data.State.Status)
                    .data("id", data.Id)
                    .data("status", data.State.Status);
                $newItem.find("#container-name").text(data.Name);
                $newItem.find(".delbutton").attr("data-id", data.Id).attr("data-id-key", dbKey);
                $newItem.find("#terminal-window").data("container-id", data.Id);

                $newItem.attr('class', 'container-item item-' + getListIterator());
                $(".container-list").append($newItem);
            }
        );
    }

    $("#suggestion-box button").on('click', function () {
        var $container = $(this).text().toLowerCase();

        $.post("docker/newcontainer", {
                Image: $container
            },
            function (data, textStatus) {
                if (data === 'ERROR CONTAINER NO EXIST YET') {
                    alert("Image pulling. Please try again shortly.");
                } else {
                    var key = database.ref('users/' + firebase.auth().currentUser.uid + '/containers').push(data).key;
                    console.log(data);
                    createNewListItem(data, key);
                }
            }
        );
        $("#close-addnew").click();
    })

    function getListIterator() {
        return $(".container-list div").length;
    }

    function prompt(term) {
        // term.write('\r\n$ ');
    }

    // ref $(".container-list").append($(".container-item").clone());

}());