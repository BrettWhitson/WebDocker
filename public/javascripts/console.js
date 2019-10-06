$(function () {
    const signout = document.getElementById("signout-btn");
    const addnew = document.getElementById("addnew-button");
    const auth = firebase.auth();
    const $addnew_window = $("#new-container-window");

    auth.onAuthStateChanged(function (user) {
        if (user) {
            const displayName = user.displayName;
            console.log(displayName);
            document.getElementById("banner-text").innerText = "Welcome to WebDocker, " + displayName;
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
        }
    });

    $("#submit-new-container").click(function () {
        if ($("#txt-new-container").val()) {
            $.post("docker/newcontainer", {
                    Image: $("#txt-new-container").val()
                },
                function (data, textStatus) {
                    console.log(data);
                }
            );
        } else {
            console.log("New container Text is empty");
        }
    })


    // ref $(".container-list").append($(".container-item").clone());

}());