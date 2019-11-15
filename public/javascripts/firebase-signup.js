
/* FIREBASE API KEY HERE */

function signup() {
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var pwconfirm = document.getElementById("pwconfirm").value;
    document.getElementById("confirmation-name").innerText = fname + " " + lname;
    document.getElementById("confirmation-email").innerText = email;
    var database = firebase.database();

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
        firebase.auth().signInWithEmailAndPassword(email, password);
        firebase.auth().currentUser.sendEmailVerification();
        var currentUser = firebase.auth().currentUser;
        
        currentUser.updateProfile({
            displayName: fname,
            email: email
        })
        database.ref('users/'+currentUser.uid).set({
            name: fname,
            email: email
        })
        document.getElementById("signup-box").style.display = "none";
        document.getElementById("signup-success").style.display = "block";
        firebase.auth().signOut();
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
    });
}