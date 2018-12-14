"use strict";
// create jwt undeclared variable
let jwt;

// Remember user login (Auth)
function rememberLogIn() {
  // when dicumetn is ready run this function
  $(document).ready(function() {
    // get authToken from session Storage
    if (sessionStorage.getItem("authToken")) {
      // create ajax POST call
      $.ajax({
        type: "POST",
        url: "/api/auth/refresh",
        dataType: "json",
        contentType: "application/json",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        },
        success: function(res) {
          // log response
          console.log(res);
          // store response authToken in jwt variable
          jwt = res.authToken;
          // set authToken and jwt variable from session Storage
          sessionStorage.setItem("authToken", jwt);
          // create function that gets the username from session Storage
          getUserDashboard(sessionStorage.getItem("username"));
        }
      });
    }
  });
}

// render html for Login page
function renderLoginPage() {
  return `
		<section class="login-screen" aria-live="assertive">
			<form role="form" class="login">
				<fieldset name="login-info">
					<div class="login-header">
						<legend align="center">Log In</legend>
				    </div>
				    <p id='notification'></p>
					<label for="email" required>Email</label>
					<input type="email" name="email" id="email" placeholder="Email address" required="">
					<label for="password" required>Password</label>
					<input type="password" name="password" id="password" placeholder="Password" required>
				</fieldset>
				<button type="submit" class="js-login-button">Login</button>
				<p>Don't have an account? <a href="#" class ="nav-signup">Sign up</a></p>
			</form>
		</section> `;
}

// display Login page on document
function displayLoginPage() {
  // create variable that holds the render login page function
  const loginPage = renderLoginPage();
  // select main page id and display html from render login page function
  $("#main-page").html(loginPage);
  // select landing page class and prop method with hidden class = true
  $(".landing-page").prop("hidden", true);
}

// create login btn function
function handleLoginButton() {
  // select main area class div with inputs and on click and look for nav-login link run e
  $(".main-area").on("click", ".nav-login", function(e) {
    console.log("Login button clicked");
    // stop page from submitting
    e.preventDefault();
    // excute display login function
    displayLoginPage();
  });
}

// render sign up page
function renderSignupPage() {
  return `
	<section class="signup-page-screen" aria-live="assertive">
			<form role="form" class="signup">
				<fieldset name="signup-info">
					<div class="login-header">
						<legend>Sign Up</legend>
				    </div>
				    <p id='notification'></p>
					<label for="email" required>Email</label>
					<input type="email" name="email" id="email" placeholder="Email address" required="">
					<label for="password" required>Password</label>
					<input type="password" name="password" id="password" placeholder="Password" required>
					<label for="password-confirm" required>Confirm password</label>
					<input type="password" name="password" id="password-confirm" placeholder="Confirm password" required >
				</fieldset>
				<button type="submit" class="js-signup-button">Sign up</button>
				<p>Already have an account? <a href="#" class="nav-login">Log in</p></a>
			</form>
		</section>
	`;
}

// create display sign up page like login
function displaySignupPage() {
  // create variable that holds the render sign up html
  const signupPage = renderSignupPage();
  $(".landing-page").prop("hidden", true);
  // select main-page and display html from signup variable that holds the function
  $("#main-page").html(signupPage);
}

// create sign up btn
function handleSignUpButton() {
  $(".main-area").on("click", ".nav-signup", function(e) {
    console.log("SignUp button clicked");
    // stop from form submitting
    e.preventDefault();
    // excute display signup page function that holds the html
    displaySignupPage();
  });
}

// create sign up success function
function handleSignUpSuccess() {
  // select main-area div, when submit on wiht signup class run e function
  $(".main-area").on("submit", ".signup", function(e) {
    console.log("SignUp Success");
    // stop from form submitting
    e.preventDefault();
    //get values from sign up form
    const username = $("#email").val();
    const password = $("#password").val();
    const confirmPassword = $("#password-confirm").val();

    // validate user inputs
    if (username == "") alert("Please type a username");
    else if (password == "") alert("Please type a password");
    else if (confirmPassword == "") alert("please re-enter password");
    else if (password != confirmPassword) alert("Passwords do not match");
    // if valid
    else {
      // create the payload object (what data we send to the api call)
      const newUserObject = {
        username: username,
        password: password
      };
      // make ajax POST call using the payload from above
      $.ajax({
        type: "POST",
        url: "/api/users",
        dataType: "json",
        data: JSON.stringify(newUserObject),
        contentType: "application/json"
      })
        // if call is successful
        .done(function() {
          // show user the result
          alert("Account created! Log in please!");
          // call display login page function
          displayLoginPage();
        })
        //if the call is failing
        .fail(function(err) {
          console.error(err);
          alert(`Sign up error: ${err.responseJSON.message}`);
        });
    }
  });
}

// Create render html user prolfile function with journal entries parameter
function renderUserDashboard(journalEntries) {
  return `
	<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class='my-journal-button'>My Profile</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
	</div>
	
	<main role="main" class="user-dashboard">
		<div class="dashboard-header">
			<h2>My places</h2>
		</div>
		<section class="trip-entries">
			<div class="entry"><a href=""class="js-edit-entry">${
        journalEntries.length > 0 ? "Add a place" : "Add my first place"
      }</a></div>
			<ul>
			${
        journalEntries
          ? journalEntries
              .map(function(entry) {
                return ` <li><h5 class="entry-title"><a data-entryid="${
                  entry.id
                }">${entry.title}</a></h5>
      		 <p class="entry-date">${entry.travelDate}</p>
      		 <div class="entry-list"><img class="main-entry-photo" src="${
             entry.coverPhoto
           }"></div>
      		 </li>`;
              })
              .join("\n")
          : ""
      }
			</ul>
		</section>	
	`;
}

// create display user profile function with journal entries parameter
function displayUserDashboard(journalEntries) {
  // create variable that holds render user profile function with journal entries parameter
  const userDashboard = renderUserDashboard(journalEntries);
  // select landing page and prop method
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  // select main-area class and html method to display the html from userDashboard profile
  $(".main-area").html(userDashboard);
}

// create get user profile function with user as parameter
function getUserDashboard(user) {
  // create ajax GET call
  $.ajax({
    type: "GET",
    url: "/api/entries",
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    .done(function(result) {
      console.log(result);
      // call display user dashboard function with result.entries as agrument
      displayUserDashboard(result.entries);
    })
    .fail(function(err) {
      console.err(err);
    });
}

// create login success function
function handleLoginSuccess() {
  // select main-area class div and when clicked on look for a submit and listen class and run e function
  $(".main-area").on("submit", ".login", function(e) {
    console.log("Login Success");
    // stop from form submitting
    e.preventDefault();
    // Get the inputs from the user in Log In form
    const username = $("#email").val();
    const password = $("#password").val();

    // validate the input
    if (username == "") {
      alert("Please type a username");
    } else if (password == "") {
      alert("Please type a password");
    }
    // if the input is valid
    else {
      // create the payload object (what data we send to the api call)
      const loginUserObject = {
        username: username,
        password: password
      };
      console.log(loginUserObject);
      // make ajax POST call using the payload from above
      $.ajax({
        type: "POST",
        url: "/api/auth/login",
        dataType: "json",
        data: JSON.stringify(loginUserObject),
        contentType: "application/json"
      })
        // if call is successfull
        .done(function(data) {
          jwt = data.authToken;
          // set item authToken and jwt from session Storage
          sessionStorage.setItem("authToken", jwt);
          // set item username and login object.username from session Storage
          sessionStorage.setItem("username", loginUserObject.username);
          // console.log(sessionStorage.getItem("authToken"));
          // console.log(jwt);
          // log data from ajax call
          console.log(data);
          // log login user objects username
          console.log(loginUserObject.username);
          // call get user dashboard with login objects username
          getUserDashboard(loginUserObject.username);
        })
        //if call is failing
        .fail(function(err) {
          console.error(err);
          $("#notification").html(
            "No fields are correct. Please re-type or sign up!"
          );
        });
    }
  });
}

// create journal btn function
function handleMyJournalButton() {
  // select main-area class div when clicked on, look for my journal button class and run e function
  $(".main-area").on("click", ".my-journal-button", function(e) {
    console.log("My Journal button clicked");
    // stop from form submitting
    e.preventDefault();
    // select landing page and prop method hide
    $(".landing-page").prop("hidden", true);
    // call get user dashboard
    getUserDashboard();
  });
}

// create add/edit render html entry function with parameter as entry = null
function renderAddEditEntry(entry = null) {
  return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-journal-button">My Profile</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
	</div>
	
	<main role="main" class="edit-journal-entry">
		<div class="dashboard-header">
			<h2>Edit My Place</h2>
		</div>
		<form id="js-edit-form" ${entry ? `data-entryid="${entry.id}"` : ""}>
		<div class="save-delete">
			<button type = "submit" class="save" id="js-save-button">Save</button>
			<button class="cancel" id="js-cancel-button">Cancel</button>
		</div>
		<section class="edit-entry">
			<div class="entry-title">
				<input type="text" name="journal-title" id="journal-title" placeholder="Name of place" maxlength="70" type="text" 
				${entry ? `value="${entry.title}"` : ""} required>
      </div>
			<div class="entry-date">
				<input type="date" name="travel-date" id="travel-date" placeholder="Date of place"
				${entry ? `value="${entry.travelDate}"` : ""}>
			</div>
			<div class="entry-photo" id = "entry-photo">
				<input type="text" name="entry-photo" id="main-image" ${
          entry
            ? ` value="${entry.coverPhoto}"`
            : `placeholder="Paste image link"`
        }>
			</div>
		</section>
		</form>	
	</main>
	`;
}

// create display add/edit entry html function with entry = null
function displayAddEditEntry(entry = null) {
  console.log(entry);
  // create variable that holds the render entry function parameter
  const entryEditor = renderAddEditEntry(entry);
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  // select main-area class and display variable in html method to display the html
  $(".main-area").html(entryEditor);
}

// create add/edit btns function
function handleAddEditButtons() {
  // select main-area class div, when clicked on look for edit-entry class and run e function
  $(".main-area").on("click", ".js-edit-entry", function(e) {
    console.log("Add entry clicked");
    // stop from form submitting
    e.preventDefault();
    // call display entry function that will display the html on document
    displayAddEditEntry();
  });
}

// create edit entry btn function
function handleEditButton() {
  // select main-area class div, when clicked on listen for a click and edit button class and run e function
  $(".main-area").on("click", "#js-edit-button", function() {
    console.log("Edit entry clicked");
    // create variable id that holds this (main-area class) method and data method holding entry id
    const id = $(this).data("entryid");
    // call get each entry function down below with id and display add edit entry function as parameter
    getEachEntry(id, displayAddEditEntry);
  });
}

// create render each entry function with built html and entyr as a parameter
function renderEachEntry(entry) {
  console.dir(entry);
  return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-journal-button">My Profile</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
		</div>
		<main role="main" class="journal-entry">
		<div class="dashboard-header">
			<h2>Where To Place's</h2>
		</div>
		<div class="edit-delete">
			<button class="edit" id="js-edit-button" data-entryid="${
        entry.id
      }">Edit</button>
			<button class="delete" id="js-delete-button" data-entryid="${
        entry.id
      }">Delete</button>
		</div>
		<section class="each-entry">
			<div class="entry-title">
				<h5 class="entry-title">${entry.title}</h5>
			</div>
			<p class="entry-date">${entry.travelDate}</p>
			 <div class="entry-list"><img class="main-entry-photo" src="${
         entry.coverPhoto
       }">
       </div>
		</section>	
	</main>
	`;
}

// create display each entry htmlto document function with entry parameter
function displayEachEntry(entry) {
  // create variable with render html function and entry as parameter
  const eachEntry = renderEachEntry(entry);
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  // select main-area class div and html method that holds variable from above
  $(".main-area").html(eachEntry);
}

// create get each entry function with id and callback as parameter
function getEachEntry(id, callback) {
  console.log(id);
  // create ajax GET call that gets each entries with id
  $.ajax({
    type: "GET",
    url: `/api/entries/${id}`,
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    .done(function(entry) {
      callback(entry);
    })
    .fail(function(jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// create entry click function
function handleEntryClick() {
  // select main-area class div, when clicked on method and listent for entry-title a (links) and run e function
  $(".main-area").on("click", ".entry-title a", function() {
    console.log("Individual entry clicked");
    // create variable that holds this (main-area class) and data method holds entry id
    const id = $(this).data("entryid");
    // call get each entry function with id and display each entry function as parameter
    getEachEntry(id, displayEachEntry);
  });
}

//create cancel btn function
function handleCancelButton() {
  $(".main-area").on("click", "#js-cancel-button", function() {
    console.log("Cancel button clicked");
    $(".landing-page").prop("hidden", true);
    // call get user dashboard function when canclled btn is clicked from function above
    getUserDashboard();
  });
}

// create delete btn function with id as parameter
function deleteEntry(id) {
  // create ajax DELETE call hold id from entries
  $.ajax({
    type: "DELETE",
    url: `/api/entries/${id}`,
    dataType: "json",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    //if call is succefull
    .done(function() {
      console.log("Deleting entry");
      // call get user dashboard function
      getUserDashboard();
    })
    //if the call is failing
    .fail(function(jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

// create delete btn function
function handleDeleteButton() {
  $(".main-area").on("click", "#js-delete-button", function() {
    console.log("Delete button clicked");
    // create variable that holds this (main-area class) and data method holds entry id
    const id = $(this).data("entryid");
    // create variable that holds confirm alert
    const confirmDelete = confirm("You want to delete this entry?");
    // if confirm variable is true the call delete entry wuth id as parameter
    if (confirmDelete) {
      deleteEntry(id);
    }
  });
}
// create saving entry function with new entry parameter
function saveEntry(newEntry) {
  console.log(JSON.stringify(newEntry));
  // create ajax PUT call with new entry id
  $.ajax({
    type: "PUT",
    url: `/api/entries/${newEntry.id}`,
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(newEntry),

    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    .done(function() {
      getUserDashboard();
    })
    .fail(function(jqXHR, error, errorThrown) {
      console.error(jqXHR);
      console.error(error);
      console.error(errorThrown);
    });
}

// create new created entry function with title date and phot as parameter
function createEntry(title, travelDate, coverPhoto) {
  // create variable that holds what a new entry object should include
  const newEntry = {
    title,
    travelDate,
    coverPhoto
  };
  // create ajax POST call that uses entries in url value
  $.ajax({
    type: "POST",
    url: "/api/entries",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(newEntry),

    headers: {
      Authorization: `Bearer ${jwt}`
    }
  })
    .done(function() {
      getUserDashboard();
    })
    .fail(function(jqXHR, error, errorThrown) {
      console.error(jqXHR);
      console.error(error);
      console.error(errorThrown);
    });
}

// create save btn function
function handleSaveButton() {
  $(".main-area").on("submit", "#js-edit-form", function(e) {
    console.log("Save button clicked");
    // stop from form submitting
    e.preventDefault();
    // create variable that holds title value
    let title = $("#journal-title").val();
    // create variable that holds date value
    let travelDate = $("#travel-date").val();
    // create variable that hold image value
    let coverPhoto = $("#main-image").val();
    // if this (main-area) data method entry id equal undefined (meaning nothing inputted) is true
    if ($(this).data("entryid") === undefined) {
      // call create entyr function with title, date and photo as parameter
      createEntry(title, travelDate, coverPhoto);
    } else {
      const id = $(this).data("entryid");
      // create new entry object that has different keys
      const newEntry = {
        id,
        title,
        travelDate,
        coverPhoto
      };
      // call save entry with new entry object as a parameter
      saveEntry(newEntry);
    }
  });
}

// create when user logout btn function
function handleLogOutButton() {
  $(".main-area").on("click", ".js-logout-button", function(e) {
    // stop from form submitting
    e.preventDefault();
    console.log("Logged out!");
    // re declare jwt variable to null
    jwt = null;
    // clear session storage
    sessionStorage.clear();
    // reload location method
    location.reload();
  });
}

// create home btn function
function handleHomeButton() {
  // select home btn class and when clicked on run function
  $(".home-button").on("click", function() {
    // reload location when home btn is clicked
    location.reload();
  });
}

// create function that calls all the e handlers
function setUpeHandlers() {
  handleLoginButton();
  handleSignUpButton();
  handleLoginSuccess();
  handleMyJournalButton();
  handleAddEditButtons();
  handleSignUpSuccess();
  handleEntryClick();
  handleEditButton();
  handleCancelButton();
  handleDeleteButton();
  handleSaveButton();
  handleLogOutButton();
  handleHomeButton();
  rememberLogIn();
}

// calls the e handlers functions that holds all functions
$(setUpeHandlers);
