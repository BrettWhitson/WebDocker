function signup() {
    document.getElementById("signup-box").style.display = "none";
    document.getElementById("signup-success").style.display = "block";
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var pwconfirm = document.getElementById("pwconfirm").value;
    document.getElementById("confirmation-name").innerText = fname + " " + lname;
    document.getElementById("confirmation-email").innerText = email;

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    }).then(function () {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            document.getElementById('quickstart-sign-in').disabled = false;

        });
    }).then(function () {
        // send user confirmation email of sign up
        firebase.auth().currentUser.sendEmailVerification();
    }).then(function(){
        firebase.auth().currentUser.updateProfile({
            displayName: fname,
            email: email
        })
    }).then(function () {
        // sign user out
        firebase.auth().signOut();
    });
}