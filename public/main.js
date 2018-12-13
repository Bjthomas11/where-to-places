"use strict";
let jwt;

//Authentication
function rememberLogIn() {
  $(document).ready(function() {
    if (sessionStorage.getItem("authToken")) {
      $.ajax({
        type: "POST",
        url: "/api/auth/refresh",
        dataType: "json",
        contentType: "application/json",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
        },
        success: function(res) {
          console.log(res);
          jwt = res.authToken;
          sessionStorage.setItem("authToken", jwt);
          getUserDashboard(sessionStorage.getItem("username"));
        }
      });
    }
  });
}

// LOGIN PAGE
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
				<p>Don't have an account? <a href="" class ="nav-signup">Sign up</a></p>
			</form>
			<div class="demo-account"> 
				<p>Demo account:</p>
				<ul>
             	 <li>Username: demo@gmail.com</li>
             	 <li>Password: password</li>
           	   </ul>
           	   </div>
		</section> `;
}

function displayLoginPage() {
  const loginPage = renderLoginPage();
  $("#main-page").html(loginPage);
  $(".landing-page").prop("hidden", true);
}

function handleLoginButton() {
  $(".main-area").on("click", ".nav-login", function(event) {
    console.log("Login button clicked");
    event.preventDefault();
    displayLoginPage();
  });
}

// SIGNUP PAGE

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
				<p>Already have an account? <a href="" class="nav-login">Log in</p></a>
			</form>
		</section>
	`;
}

function displaySignupPage() {
  const signupPage = renderSignupPage();
  $(".landing-page").prop("hidden", true);
  $("#main-page").html(signupPage);
}

function handleSignUpButton() {
  $(".main-area").on("click", ".nav-signup", function(event) {
    console.log("SignUp button clicked");
    event.preventDefault();
    displaySignupPage();
  });
}

function handleSignUpSuccess() {
  $(".main-area").on("submit", ".signup", function(event) {
    console.log("SignUp Success");
    event.preventDefault();
    //get values from sign up form
    const username = $("#email").val();
    const password = $("#password").val();
    const confirmPassword = $("#password-confirm").val();

    //validate user inputs
    // validate user inputs
    if (username == "") alert("Must input username");
    else if (password == "") alert("Must input password");
    else if (confirmPassword == "") alert("Must re-enter password");
    else if (password != confirmPassword) alert("Passwords do not match");
    // if valid
    else {
      // create the payload object (what data we send to the api call)
      const newUserObject = {
        username: username,
        password: password
      };
      // make the api call using the payload above
      $.ajax({
        type: "POST",
        url: "/api/users",
        dataType: "json",
        data: JSON.stringify(newUserObject),
        contentType: "application/json"
      })
        // if call is successful
        .done(function() {
          alert("Account created! Please, log in!");
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

// USER DASHBOARD PAGE
function renderUserDashboard(journalEntries) {
  return `
	<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class='my-journal-button'>My Journal</a></div>
			<div class="nav-link"><a href="" class="js-edit-entry plus">&#43;</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log out</a></div>
		</div>
	</div>
	
	<main role="main" class="user-dashboard">
		<div class="dashboard-header">
			<h2>My trips</h2>
		</div>
		<section class="trip-entries">
			<h4>Let the journey begin!</h4>

			<div class="entry"><a href=""class="js-edit-entry">${
        journalEntries.length > 0 ? "Add a trip" : "Add my first trip"
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

function displayUserDashboard(journalEntries) {
  const userDashboard = renderUserDashboard(journalEntries);
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  $(".main-area").html(userDashboard);
}

function getUserDashboard(user) {
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
      displayUserDashboard(result.entries);
    })
    .fail(function(err) {
      console.err(err);
    });
}

function handleLoginSuccess() {
  $(".main-area").on("submit", ".login", function(event) {
    console.log("Login Success");
    event.preventDefault();
    // Get the inputs from the user in Log In form
    const username = $("#email").val();
    const password = $("#password").val();

    // validate the input
    if (username == "") {
      alert("Please input user name");
    } else if (password == "") {
      alert("Please input password");
    }
    // if the input is valid
    else {
      // create the payload object (what data we send to the api call)
      const loginUserObject = {
        username: username,
        password: password
      };
      console.log(loginUserObject);
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
          sessionStorage.setItem("authToken", jwt);
          sessionStorage.setItem("username", loginUserObject.username);
          console.log(sessionStorage.getItem("authToken"));
          console.log(jwt);
          console.log(data);
          console.log(loginUserObject.username);
          getUserDashboard(loginUserObject.username);
        })
        //if call is failing
        .fail(function(err) {
          console.error(err);
          $("#notification").html(
            "Login failed. Try again or click below to sign up!"
          );
        });
    }
  });
}

// MY JOURNAL
function handleMyJournalButton() {
  $(".main-area").on("click", ".my-journal-button", function(event) {
    console.log("My Journal button clicked");
    event.preventDefault();
    $(".landing-page").prop("hidden", true);
    getUserDashboard();
  });
}

// ADD or EDIT ENTRY

function renderAddEditEntry(entry = null) {
  return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-journal-button">My Journal</a></div>
			<div class="nav-link"><a href="" class="js-edit-entry plus">&#43;</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
	</div>
	
	<main role="main" class="edit-journal-entry">
		<div class="dashboard-header">
			<h2>Edit My Journal</h2>
		</div>
		<form id="js-edit-form" ${entry ? `data-entryid="${entry.id}"` : ""}>
		<div class="save-delete">
			<button type = "submit" class="save" id="js-save-button">Save</button>
			<button class="cancel" id="js-cancel-button">Cancel</button>
		</div>
		<section class="edit-entry">
			<div class="entry-title">
				<input type="text" name="journal-title" id="journal-title" placeholder="Name your trip here" maxlength="70" type="text" 
				${entry ? `value="${entry.title}"` : ""} required>
			</div>
			<div class="entry-date">
				<input type="text" name="travel-date" id="travel-date" placeholder="Enter the date of trip"
				${entry ? `value="${entry.travelDate}"` : ""}>
			</div>
			<div class="entry-photo" id = "entry-photo">
				<input type="text" name="entry-photo" id="main-image" ${
          entry ? ` value="${entry.coverPhoto}"` : `placeholder="Image link"`
        }>
				<p class="main-image-p">*If you want to add an image but don't have a link, you can upload an 
				image at imgbb.com to get one. <a class="main-image-a" href ="https://imgbb.com/">Click here</a> for instructions</p>
			<div class="entry-description">
				<input type="text" name="entry-description" id="journal-description" 
				placeholder="Add description of your trip here..." ${
          entry ? `value="${entry.description}"` : ""
        }>
			</div>
			<div class="best-memory">
				<h5>Best memory</h5>
				<input type="text" name="best-memory" id="entry-best-memory" placeholder="Share your best memory of the trip..." 
				${entry ? `value="${entry.memories}"` : ""}>
			</div>
			<div class="foreign-words">
				<h5>Foreign words to remember</h5>
				<input type="text" name="foreign-words" id="entry-foreign-words" placeholder="Keep the new foreign words learned here..." 
				${entry ? `value="${entry.words}"` : ""}>
			</div>
			<div class="more-photos">
				<h5>Add more photos here</h5>
				<input type="text" name="morePhotos" id="morePhotos-0" ${
          entry && entry.morePhotos[0]
            ? ` value="${entry.morePhotos[0]}"`
            : `placeholder="Image link"`
        }>
				<input type="text" name="morePhotos" id="morePhotos-1" ${
          entry && entry.morePhotos[1]
            ? ` value="${entry.morePhotos[1]}"`
            : `placeholder="Image link"`
        }>
				<input type="text" name="morePhotos" id="morePhotos-2" ${
          entry && entry.morePhotos[2]
            ? ` value="${entry.morePhotos[2]}"`
            : `placeholder="Image link"`
        }>
			</div>
		</section>
		</form>	
	</main>
	`;
}

function displayAddEditEntry(entry = null) {
  console.log(entry);
  const entryEditor = renderAddEditEntry(entry);
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  $(".main-area").html(entryEditor);
}

function handleAddEditButtons() {
  $(".main-area").on("click", ".js-edit-entry", function(event) {
    console.log("Add entry clicked");
    event.preventDefault();

    displayAddEditEntry();
  });
}

function handleEditButton() {
  $(".main-area").on("click", "#js-edit-button", function() {
    console.log("Edit entry clicked");
    const id = $(this).data("entryid");

    getEachEntry(id, displayAddEditEntry);
  });
}

function renderEachEntry(entry) {
  console.dir(entry);
  return `
		<div class="nav-bar">
		<div class="nav-1">
			<div class="nav-link"><a href="" class="my-journal-button">My Journal</a></div>
			<div class="nav-link"><a href="" class="js-edit-entry plus">&#43;</a></div>
			<div class="nav-link"><a href="" class="js-logout-button">Log Out</a></div>
		</div>
		</div>
		<main role="main" class="journal-entry">
		<div class="dashboard-header">
			<h2>My Journal</h2>
		</div>
		<div class="edit-delete">
			<button class="edit" id="js-edit-button" data-entryid="${
        entry.id
      }">EDIT</button>
			<button class="delete" id="js-delete-button" data-entryid="${
        entry.id
      }">DELETE</button>
		</div>
		<section class="each-entry">
			<div class="entry-title">
				<h5 class="entry-title">${entry.title}</h5>
			</div>
			<p class="entry-date">${entry.travelDate}</p>
			 <div class="entry-list"><img class="main-entry-photo" src="${
         entry.coverPhoto
       }"></div>
			<div class="main-entry-description">
				<p class="p-entry" id="p-entry">${entry.description}</p>		
			</div>
			<div class="main-best-memory">
				<h5>Best memory</h5>
				<p class="p-entry" id="js-memory"> 
					${entry.memories}
				</p>	
			</div>
			<div class="main-foreign-words">
				<h5>Foreign words to remember</h5>
				<p class="p-entry">
					${entry.words}
				</p>
			</div>
			<div class="more-photos">

			${entry.morePhotos
        .map(function(photoUrl) {
          return `
				<img class="more-photos" src="${photoUrl}">
				`;
        })
        .join("\n")}
			</div>
		</section>	
	</main>
	`;
}

function displayEachEntry(entry) {
  const eachEntry = renderEachEntry(entry);
  $(".landing-page").prop("hidden", true);
  $(".main-nav-bar").prop("hidden", true);
  $(".main-area").html(eachEntry);
}

function getEachEntry(id, callback) {
  console.log(id);
  //journalEntriesStorage.get(displayEachEntry, id);
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

function handleEntryClick() {
  $(".main-area").on("click", ".entry-title a", function() {
    console.log("Individual entry clicked");
    const id = $(this).data("entryid");

    getEachEntry(id, displayEachEntry);
  });
}

//CANCEL BUTTON
function handleCancelButton() {
  $(".main-area").on("click", "#js-cancel-button", function() {
    console.log("Cancel button clicked");
    $(".landing-page").prop("hidden", true);
    getUserDashboard();
  });
}

//DELETE button
function deleteEntry(id) {
  //journalEntriesStorage.delete(getUserDashboard, id);

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
      getUserDashboard();
    })
    //if the call is failing
    .fail(function(jqXHR, error, errorThrown) {
      console.log(jqXHR);
      console.log(error);
      console.log(errorThrown);
    });
}

function handleDeleteButton() {
  $(".main-area").on("click", "#js-delete-button", function() {
    console.log("Delete button clicked");
    const id = $(this).data("entryid");
    const confirmDelete = confirm("Are you sure you want to delete this?");
    if (confirmDelete) {
      deleteEntry(id);
    }
  });
}
// SAVE BUTTON

function saveEntry(newEntry) {
  console.log(JSON.stringify(newEntry));
  //journalEntriesStorage.update(getUserDashboard, newEntry);
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

function createEntry(
  title,
  travelDate,
  coverPhoto,
  description,
  memories,
  words,
  morePhotos
) {
  //journalEntriesStorage.create(getUserDashboard, title, travelDate, coverPhoto, description, memories,
  //	words, morePhotos);
  const newEntry = {
    title,
    travelDate,
    coverPhoto,
    description,
    memories,
    words,
    morePhotos
  };
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

function handleSaveButton() {
  $(".main-area").on("submit", "#js-edit-form", function(event) {
    console.log("Save button clicked");
    event.preventDefault();
    let title = $("#journal-title").val();
    let travelDate = $("#travel-date").val();
    let coverPhoto = $("#main-image").val();
    let description = $("#journal-description").val();
    let memories = $("#entry-best-memory").val();
    let words = $("#entry-foreign-words").val();
    let morePhotos = [
      $("#morePhotos-0").val(),
      $("#morePhotos-1").val(),
      $("#morePhotos-2").val()
    ];
    // $('#more-photos').val().map(function(photoUrl) {
    //		return morePhotos.push(photoUrl);
    //	});
    console.log(morePhotos);

    if ($(this).data("entryid") === undefined) {
      createEntry(
        title,
        travelDate,
        coverPhoto,
        description,
        memories,
        words,
        morePhotos
      );
    } else {
      const id = $(this).data("entryid");

      const newEntry = {
        id,
        title,
        travelDate,
        coverPhoto,
        description,
        memories,
        words,
        morePhotos
      };
      saveEntry(newEntry);
    }
  });
}

// LOGOUT BUTTON
function handleLogOutButton() {
  $(".main-area").on("click", ".js-logout-button", function(event) {
    event.preventDefault();
    console.log("Logged out!");
    jwt = null;
    sessionStorage.clear();
    location.reload();
  });
}

// SET UP HOME button
function handleHomeButton() {
  $(".home-button").on("click", function() {
    //displayUserDashboard()
    location.reload();
  });
}

function setUpEventHandlers() {
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

$(setUpEventHandlers);
