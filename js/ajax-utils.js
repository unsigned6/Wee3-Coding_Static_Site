//AJAX
(function (global) {
	// Set namespace for our utility
	var ajaxUtils = {};

	// Returns an HHT request object
	function getRequestObject() {
		if (window.XMLHttpRequest) {
			return (new XMLHttpRequest());
		}
		else if (window.ActiveXObject) {
			return (new ActiveXObject("Microsoft.XMLHTTP"));
		}
		else {
			global.alert("Ajax is not supported!");
			return(null);
		}
	}

	// Makes an Ajax GET request to 'requestUrl'
	ajaxUtils.sendGetRequest = 
		function (requestUrl, responseHandler, isJsonResponse) {
			var request = getRequestObject();
			// different stages of request
			// set up a paremeter for request
			request.onreadystatechange = 
				function () {
					handleResponse(request, 
						responseHandler,
						isJsonResponse);
				};
			request.open("GET", requestUrl, true);
			// execute request
			request.send(null); // for POST only, take parameter for request
		};

	// Only calls user provided 'responseHandler' function 
	// if response is ready and not an error
	function handleResponse(request, responseHandler, isJsonResponse) {
		if ((request.readyState == 4) && (request.status == 200)) {
			if (isJsonResponse == undefined) {
				isJsonResponse = true;
			}
			if (isJsonResponse) {
				responseHandler(JSON.parse(request.responseText));
			}
			else {
				responseHandler(request.responseText)
			}
			//responseHandler(request);
		}
	}

	// Expose utility to the global object
	global.$ajaxUtils = ajaxUtils;

})(window);