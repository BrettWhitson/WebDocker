$(function () {
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

                                $newItem.find("#container-ID").text(data.Id.slice(0, 12));
                                $newItem.find("#container-image").text(data.Config.Image);
                                $newItem.find("#container-cmd").text(data.Config.Cmd);
                                $newItem.find("#container-status").text(data.State.Status);
                                $newItem.find("#container-name").text(data.Name);
                                $newItem.find(".delbutton").attr("data-id", data.Id).attr("data-id-key", item);

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
                        alert("That image does not exist yet.");
                    } else {
                        var key = database.ref('users/' + firebase.auth().currentUser.uid + '/containers').push(data).key;
                        console.log(data);
                        createNewListItem(data, key);
                    }
                }
            );
        } else {
            console.log("New container Text is empty");
        }
    })

    $(".container-list").on('click', '.delbutton', function () {
        $delID = $(this).attr("data-id");
        $delKey = $(this).attr("data-id-key");
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
    })

    function createNewListItem(containerID, dbKey) {
        $.get("docker/getinfo", {
                ID: containerID
            },
            function (data, textStatus, jqXHR) {
                var $newItem = $("#template-item").clone();

                $newItem.find("#container-ID").text(data.Id.slice(0, 12));
                $newItem.find("#container-image").text(data.Config.Image);
                $newItem.find("#container-cmd").text(data.Config.Cmd);
                $newItem.find("#container-status").text(data.State.Status);
                $newItem.find("#container-name").text(data.Name);
                $newItem.find(".delbutton").attr("data-id", data.Id).attr("data-id-key", dbKey);

                $newItem.attr('class', 'container-item item-' + getListIterator());
                $(".container-list").append($newItem);
            }
        );
    }

    function getListIterator() {
        return $(".container-list div").length;
    }

    // ref $(".container-list").append($(".container-item").clone());

}());