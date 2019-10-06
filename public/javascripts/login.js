(function () {
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
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
            // sign in with email and password, return promise for exception handling
            return auth.signInWithEmailAndPassword(email, pass).catch(e => console.log(e.message));
        }).then(function(){
            // update to console page
            const newURL = "console.html";
            window.location = newURL;
        })
    });

    txtPassword.addEventListener('keyup', e => {
        if (e.code === 'Enter') {
            e.preventDefault();
            btnSubmit.click();
        }
    })
}());