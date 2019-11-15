(function () {

    /* 
        FB API KEY HERE 
    */

    // get elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnSubmit = document.getElementById("btnSubmit");
    const login = document.getElementById("login-container");
    const console = document.getElementById("console-container");
    const forgotPass = document.getElementById("forgot-password-link");
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
            }).then(function () {
                var user = firebase.auth().currentUser;
                if (user.emailVerified === false) {
                    alert("Email has not been verified");
                } else {
                    // update to console page
                    const newURL = "console.html";
                    window.location = newURL;
                }

            })
    });

    $("#forgot-password-link").on('click', function () {
        $("#forgot-password-window").attr('class', 'shown-absolute');
    })

    $("#forgot-password-window").on('click', 'button', function () {
        $("#forgot-password-window").attr('class', 'hidden');
    })

    $("#btn-forgot-password").on('click', function () {
        var auth = firebase.auth();
        var email = $("#txt-forgot-password").val();

        auth.sendPasswordResetEmail(email).then(function () {
            alert("A password reset email has been sent to your email.")
            $("#forgot-password-window").attr('class', 'hidden');
        }).catch(function (error) {
            alert(error);
        });
    })

    $("#txt-forgot-password").on('keyup', function (e) {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            $("#btn-forgot-password").click();
        }
    })

    txtPassword.addEventListener('keyup', e => {
        if (e.code === 'Enter') {
            e.preventDefault();
            btnSubmit.click();
        }
    })
}());