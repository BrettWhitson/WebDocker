(function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBcN01VtGgruSG5084epcwpBYAZvDNULGo",
        authDomain: "webdocker-79f6c.firebaseapp.com",
        databaseURL: "https://webdocker-79f6c.firebaseio.com",
        projectId: "webdocker-79f6c",
        storageBucket: "",
        messagingSenderId: "481734697555",
        appId: "1:481734697555:web:3c3be628693bc3883f1ca6"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const signout = document.getElementById("signout-btn");
    const auth = firebase.auth();

    auth.onAuthStateChanged(function (user) {
        if (user) {
            const displayName = user.displayName;
            document.getElementById("banner-text").innerText = "Welcome to WebDocker, " + displayName;
        } else {
            console.log("no user");
            window.location = "./index.html";
        }
    })

    signout.addEventListener('click', e => {
        firebase.auth().signOut();
        window.location = "./index.html";
    })

}());