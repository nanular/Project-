$(document).ready(function()
{



var apiKeys =
{
	googleGeocode: "AIzaSyAtpm5B5wXU56SrAZ-Z9OBgfMoMaXovy3A",
	googleStreetview: "AIzaSyDgH7bb2ybHKZ3K-45N_jNKOPAhB6p-5kc",
	googlePlaces: "AIzaSyD5dj6sTAyGKxhzt9pd2gAo7Kp2JfOacLc",
	zillow: "X1-ZWz1fzqykaoah7_aui2x",
	onboardAPI: "4eae65e6461ddc50632bb992c6ee5fc2",
	foursquareClientID: "GTDR2JU024JPC111OI04WJT5NUZYF2FE5OI10LCSU2PRJEZ4",
	foursquareClientSecret: "GTDR2JU024JPC111OI04WJT5NUZYF2FE5OI10LCSU2PRJEZ4",
	openWeatherAPI: "f6345c7e44b9a02605712b0880591b2b"
};

var userAddress =
{
	street1: "",
	street2: "",
	city: "",
	state: "",
	zipcode: ""
};

var userLocation =
{
	latitude: 0,
	longitude: 0,
	neighborhood: "",
	placeID: "",
	cityPlaceID: ""
};

var weatherStats =
{
	description: "",
	icon: "",
	tempF: 0,
	tempC: 0,
	humidity: 0,
	windSpeed: 0,
	windDirection: ""
}

var propertyDetails =
{
	fulladdress: "",
	rooms: 0,
	bathrooms: 0,
	year: 1900,
	zestimate: 0.00,
}


	


$("#address_submit").click(function()
{
	//Capturing Address Data From User Input
	event.preventDefault();
	userAddress.street1 = $("#address_street1").val().trim().replace(/ /g, "+");
	userAddress.street2 = $("#address_street2").val().trim();
	userAddress.city = $("#address_city").val().trim().replace(/ /g, "+");
	userAddress.state = $("#address_state").val().trim();
	userAddress.zipcode = $("#address_zipcode").val().trim();	




	//Google GeoCode API (Full Address)
	var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + userAddress.street1 + ",+" + 
		userAddress.city + ",+" + userAddress.state + "&key=" + apiKeys.googleGeocode;

	$.ajax(
	{
  		url: geocodeURL,
  		method: "GET",
	})

	.done(function(geocodeapireturn)
	{
		userLocation.latitude = geocodeapireturn.results[0].geometry.location.lat;
		userLocation.longitude = geocodeapireturn.results[0].geometry.location.lng;
		userLocation.placeID = geocodeapireturn.results[0].place_id;
		userLocation.neighborhood = geocodeapireturn.results[0].address_components[2].long_name;

		//Google Street View API
		var steetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + 
			userLocation.latitude + "," + userLocation.longitude + "&key=" + apiKeys.googleStreetview;

		var streetViewImage = $("<img>").attr("src", steetviewURL);
		$("#streetview_results").prepend(streetViewImage);
	})




	//Google GeoCode API (City)
	var geocodeCityURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
		userAddress.city + ",+" + userAddress.state + "&key=" + apiKeys.googleGeocode;
	
	$.ajax(
	{
		url: geocodeCityURL,
		method: "GET",
	})
	
	.done(function(apireturn)
	{
		userLocation.cityPlaceID = apireturn.results[0].place_id;

		//Google Places API
		var service = new google.maps.places.PlacesService(document.getElementById('map'));
	   
	   service.getDetails(
	   {
	   	placeId: userLocation.cityPlaceID
	   }, function (place, status)
	   {
	      for (i = 0; i < 9; i++)
	      {
				var photoURL = place.photos[i].getUrl({maxWidth: 400, maxHeight: 400});
				var addImg = $("<img>");
				addImg.attr("src", photoURL);
				$("#pictures").append(addImg);
			}
		})
	})




	//OpenWeatherMap API
	var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + userLocation.latitude + 
		"&lon=" + userLocation.longitude + "&appid=" + apiKeys.openWeatherAPI;

	$.ajax(
	{
		url: openWeatherURL,
		method: "GET"
	})

	.done(function(weatherapireturn)
	{
		//console.log("OpenWeatherMap URL: " + openWeatherURL);
		//console.log(weatherapireturn);
	})




	//Zillow API
	var zillowURL = "https://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" + apiKeys.zillow + 
		"&address=" + userAddress.street1 + "&citystatezip=" + userAddress.city + 
		"%2C+" + userAddress.state;
	console.log("Zillow URL: " + zillowURL);

	function zillowGrab()
	{
		$.getJSON("http://anyorigin.com/go?url="+escape(zillowURL)+"&callback=?", function(zillowapireturn)
		{
			var iframe = $("#output")[0];
			var doc = iframe.document;
			
			if (iframe.contentDocument)
			{
				doc = iframe.contentDocument;
			} else if (iframe.contentWindow)
			{
				doc = iframe.contentWindow.document;
			}
			
			doc.open();
			doc.writeln(zillowapireturn.contents);
			doc.close();

			console.log(zillowapireturn);
		})

		.done(function(zillowapireturn)
		{
			console.log("Once Again: ");
			console.log(zillowapireturn);
		})

		return false;
	}

	zillowGrab();
	
	



}) //End Of #address_submit Click Function


$("#clear_button").click (function()
{
	$("form").trigger("reset");
	//window.location.reload(true);
})




})