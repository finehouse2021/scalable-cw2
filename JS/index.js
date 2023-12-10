   // jQuery script for toggling between login and registration forms
 var loginUrl =
		"https://prod-09.centralus.logic.azure.com/workflows/5931853206814f0abee169b0313cc186/triggers/manual/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=38r3vUGJ43xToixDM3dEy_vSNHfoOgTC7eqvGIGi0cE";
 var regUrl =
		"https://prod-08.centralus.logic.azure.com:443/workflows/236c39fd76b24c57a5ba35dd1ef57107/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=cL4i4ZRV3mGTihJjg3JDId3hle-LXJ5hm0mxbPJZarU";
 
$(document).ready(function () {
    $("#showRegister").click(function () {
        $("#login-form").hide();
        $("#register-form").show();
    });

    $("#showLogin").click(function () {
        $("#register-form").hide();
        $("#login-form").show();
    });


    $("#login").click(function () {
        login()
    });

    $("#register").click(function () {
        register()
    });
});

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function login() {
    
    console.log("herer");

	var username = $("#loginUsername").val();
	var password = $("#loginPassword").val();

	var submitData = {
		Username: username,
		PasswordHash: password,
	};

	fetch(loginUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(submitData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			var respdata = data[0];

			if (
				respdata.Username === submitData.Username &&
				respdata.PasswordHash === submitData.PasswordHash
			) {
				// Login successful, perform actions like redirecting to another page or showing a success message
				console.log("Login successful");
				localStorage.setItem("user", JSON.stringify(respdata));
				// Clear the data in the loginUsername and loginPassword fields
				$("#loginUsername").val("");
				$("#loginPassword").val("");
				window.location.href = "videoViwer.html";
			} else {
				// Handle login failure, show an error message, etc.
				console.log("Login failed");
			}
		})
		.catch((error) => {
			// Handle error if fetch request fails
			console.error("Fetch request failed:", error);
		});
}


function register() {
	var username = $("#registerUsername").val();
	var email = $("#registerEmail").val();
	var password = $("#registerPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	var firstName = $("#firstName").val();
	var lastName = $("#lastName").val();
	var middleName = $("#middleName").val();
	var phoneNumber = $("#phoneNumber").val();
	var city = $("#city").val();
	var address = $("#address").val();

	// Check if passwords match before proceeding with registration
	if (password !== confirmPassword) {
		alert("Passwords do not match");
		// Optionally, you can display an error message to the user
		return; // Stop the registration process if passwords don't match
	}

	var submitData = {
		Username: username,
		Email: email,
		PasswordHash: password,
		FirstName: firstName,
		LastName: lastName,
		MiddleName: middleName,
		PhoneNumber: phoneNumber,
		City: city,
		Address: address
    };
        
	fetch(regUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(submitData)
	})
		.then((response) => response.json())
        .then((data) => {
            console.log(submitData);
			if (data.Username === submitData.Username) {
				// Registration successful, perform actions like redirecting to another page or showing a success message
				console.log("Registration successful");
				$("#register-form").hide();
				$("#login-form").show();
			} else {
				// Registration failed, handle the error (display an error message, clear fields, etc.)
				console.log("Registration failed");
			}
		})
		.catch((error) => {
			// Handle an error if the fetch request fails
			console.error("Fetch request failed:", error);
		});
}
