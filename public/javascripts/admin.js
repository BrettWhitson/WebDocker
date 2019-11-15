
/* FIREBASE API KEY HERE */

const auth = firebase.auth();
const user = auth.currentUser;
const database = firebase.database();
const $containerList = $(".container-list");
const $listItemTemplate = $(".template").clone().removeClass("template").removeClass("hidden");
const $containerItemTemplate= $("#template-user-container").clone().removeAttr('id').removeClass('hidden');

$listItemTemplate.find("#template-user-container").remove();
$(".template").remove();
$("#template-user-container").remove();

$(function () {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            $("html").css("visibility", "initial");

            let ref = database.ref('users');
            ref.once('value').then(function (snapshot) {
                let users = snapshot.val();

                Object.keys(users).forEach(function (userID) {
                    let currentUser = users[userID];
                    //let $newItem = $(".template").clone().removeClass("template").removeClass('hidden');
                    let $newItem = $listItemTemplate.clone();

                    $newItem.find(".display-name")
                        .text(currentUser.name);
                    $newItem.find(".user-email")
                        .text(currentUser.email);

                    if (currentUser.hasOwnProperty('containers')) {
                        let userContainers = currentUser.containers;
                        Object.keys(userContainers).forEach(function (containerKey) {
                            let containerID = userContainers[containerKey];
                            let $newContainerItem = $containerItemTemplate.clone();
                            /* let $newContainerItem = $newItem
                                .find("#template-user-container")
                                .clone()
                                .removeAttr('id')
                                .removeClass('hidden'); */

                            $.get('docker/getinfo', {
                                ID: containerID
                            }, function (data, Status) {
                                $newContainerItem.find("#container-ID").text(data.Id.slice(0, 12));
                                $newContainerItem.find("#container-cmd").text(data.Config.Cmd);
                                $newContainerItem.find("#container-image").text(data.Config.Image);
                                $newContainerItem.find("#container-status").text(data.State.Status);
                                $newContainerItem.find("#container-name").text(data.Name);
                                $newContainerItem.find(".delbutton").data("key", containerKey).data("id", containerID);
                                $newItem.append($newContainerItem);
                            });
                        })
                    }
                    $containerList.append($newItem);
                })
            })
        } else {
            window.location = "/index.html";
        }
    })

    $(".container-list").on('click', '.user-header', function () {
            $(this).closest('.user-list-item-container').find('.user-info').slideToggle(200);
    })

    $(".container-list").on('click', '.delbutton', function() {
        if ( confirm("you sure bruh?") ) {
            let $key = $(this).data("key");
            let $id  = $(this).data("id");

            /* $.ajax({
                type: "delete",
                url: "docker/deletecontainer",
                data: {
                    delID: $id
                },
                success: function (response) {
                    console.log(response);
                    $(this).closest(".user-info").remove();

                }
            }); */
        }
    })
})