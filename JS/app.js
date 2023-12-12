//The URIs of the REST endpoint
IUPS =
	"https://prod-40.northeurope.logic.azure.com:443/workflows/5024689e859f47c9a7e7a2d60ed471f9/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xEugNOMdStc3qBRwvtiUsCID0Vsi7mERhrPLvGK29Fc";
RAI =
	"https://prod-53.northeurope.logic.azure.com:443/workflows/fb03c79eaaaa4e6295b2f33ac073749d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zeI9GVaoJcqkySojtciD2ddKS64xGvBWP9RQ8feT1Is";
addCommentUrl =
	"https://prod-06.centralus.logic.azure.com:443/workflows/59334b5dd34841ea871e6a9a31af07c3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Jx6kpSlK9JrIVy9dAaa_KPSRGfSvSfQNehxGTVAcxi0";
BLOB_ACCOUNT = "https://videob00911209.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function () {

	//Run the get asset list function
	getVideo();

	// Event listener for search input
	$("#searchInput").on("input", function () {
		var searchTerm = $(this).val();
		filterVideos(searchTerm);
	});

	//Handler for the new asset submission button
	$("#subNewForm").click(function () {
		//Execute the submit new asset function
		submitNewAsset();
	});

		$("#sign-out").on("click", function () {
			localStorage.clear();
			window.location.href = "index.html";
		});
});

//A function to submit a new asset to the REST endpoint
function submitNewAsset() {
	//Create a form data object
	submitData = new FormData();
	//Get form variables and append them to the form data object
	submitData.append("title", $("#title").val());
	submitData.append("producer", $("#producer").val());
	submitData.append("publisher", $("#publisher").val());
	submitData.append("rating", $("#rating").val());
	submitData.append("genre", $("#genre").val());
	submitData.append("File", $("#UpFile")[0].files[0]);

	//Post the form data to the endpoint, note the need to set the content type header
	$.ajax({
		url: IUPS,
		data: submitData,
		cache: false,
		enctype: "multipart/form-data",
		contentType: false,
		processData: false,
		type: "POST",
		success: function (data) {},
	});
}

function processVideoData(data) {
	var processedData = [];

	// Iterate through each video
	$.each(data.videos, function (index, video) {
		var videoWithComments = {
			video: video,
			comments: [],
		};

		// Iterate through comments to find associated ones
		$.each(data.comments, function (commentIndex, comment) {
			if (comment.videoId === video.id) {
				videoWithComments.comments.push(comment);
			}
		});

		// Add the video with associated comments to the processed data array
		processedData.push(videoWithComments);
	});

	return processedData;
}


function filterVideos(searchTerm) {
	var videos = localStorage.getItem("videos");
	if (!videos) return;
	var videoArray = JSON.parse(videos);

	var filteredVideos = videoArray.filter(function (val) {
		// Customize this condition based on your search criteria
		return (
			val.video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			val.video.genre.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	displayVideos(filteredVideos);
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideo() {
	// Replace the current HTML in that div with a loading message
	$("#videoList").html(
		'<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>'
	);

	$.getJSON(RAI, function (data) {
		var videos = processVideoData(data);
    localStorage.setItem("videos", JSON.stringify(videos));
    displayVideos(videos);
	});
}

function displayVideos(videos) {
  var items = [];
  console.log(videos)
	// Iterate through the returned records and build HTML, incorporating the key values of the record in the data
	$.each(videos, function (key, val) {

		items.push(
			"<video width='400' controls><source src='" +
				BLOB_ACCOUNT +
				val.video["filepath"] +
				"' type='video/mp4'>wrong format video uploaded</video><br />"
		);
		items.push(
			"title: " +
				val.video["title"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		);
		items.push("genre: " + val.video["genre"] + "<br />");
		items.push(
			"producer: " +
				val.video["producer"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		);
		items.push("publisher: " + val.video["publisher"] + "<br /><br />");
		items.push("Age Rating: " + val.video["agerating"] + "<br /><br />");

		// Display existing comments and ratings
		if (val["comments"] && val["comments"].length > 0) {
			items.push("<h5>Comments:</h5>");
			$.each(val["comments"], function (index, comment) {
				items.push(
					"<p><strong>" +
						comment.userName +
						":</strong> " +
						comment.comment +
						"</p>"
				);
			});
		}

		// Add a form for commenting and rating
		items.push(
			"<form class='comment-form'  data-video-index=" + val.video["id"] + ">");
		items.push("<label for='comment'>Comment:</label>");
		items.push(
			"<textarea class='form-control' name='comment' rows='2'></textarea><br />"
		);
		items.push("<label for='rating'>Rate:</label>");
		items.push(
			"<input type='number' class='form-control' name='rating' min='1' max='5' required/><br />"
		);
		items.push("<button type='submit' class='btn btn-primary'>Submit</button>");
		items.push("</form>");

		items.push("<hr />");
	});

	// Clear the videoList div
	$("#videoList").empty();

	// Append the contents of the items array to the videoList div
	$("<ul/>", {
		class: "my-new-list",
		html: items.join(""),
	}).appendTo("#videoList");
}



// Bind the submit event using jQuery
$(document).on("submit", ".comment-form", function (event) {
	// Prevent the default form submission behavior
	event.preventDefault();

	// Get the values from the form
	var commentText = $(this).find("textarea[name='comment']").val();
	var rating = $(this).find("input[name='rating']").val();
	var videoIndex = $(this).data("video-index"); // Assuming you set a data attribute in your HTML
	var user = JSON.parse(localStorage.getItem("user"));

	// Validate the rating
	if (rating < 1 || rating > 5) {
		alert("Rating must be between 1 and 5.");
		return false; // Prevent form submission
	}

	// Prepare data to be sent in the request body
	var requestBody = JSON.stringify({
		videoId: videoIndex,
		comment: commentText,
		rating: Number(rating),
		userName: user.userName,
	});

	console.log(requestBody);

	// Make a fetch request to your endpoint
	fetch(addCommentUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// Add any other headers if needed
		},
		body: requestBody,
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		})
		.then((data) => {
			// Handle the successful response
			$(this).find("textarea[name='comment']").val("");
			$(this).find("input[name='rating']").val("");

			// Update UI with the new comment without refreshing the page
			updateUIWithCommentAndRating(data);
		})
		.catch((error) => {
			console.error("There was a problem with the fetch operation:", error);
			// Handle the error, show an alert, or perform other error-handling actions
		});

	return false; // Prevent form submission
});

function updateUIWithCommentAndRating(data) {
	// Find the corresponding comment section and append the new comment
	var newComment =
		"<p><strong>User:</strong> " +
		data.userName +
		"<br /><strong>Comment:</strong> " +
		data.comment +
		"</p>";
	$("#videoList")
		.find(".comment-form[data-video-index='" + data.videoId + "']")
		.append(newComment);
}
