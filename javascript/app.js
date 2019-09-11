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

    // get elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnSubmit = document.getElementById("btnSubmit");
    const login = document.getElementById("login-container");
    const console = document.getElementById("console-container");

    // sign in button event listender
    btnSubmit.addEventListener('click', e => {
        // get login element
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        // set persistence to local
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
            // sign in with email and password, return promise for exception handling
            return auth.signInWithEmailAndPassword(email, pass).catch(e => console.log(e.message));
        }).then(function(){
            // update to console page
            const newURL = "./console.html";
            window.location = newURL;
        })
    });
}());