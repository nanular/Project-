$(document).ready(function()
{

	centeranimation();

	function centeranimation()
	{
		var winHeight = window.innerHeight;
		var elementHeight = $(".center_animation").outerHeight();
		var topValue = (winHeight / 2) - (elementHeight / 2);
		$(".center_animation").stop().animate({top: topValue + "px"}, 2000);
	}

	$(window).resize(centeranimation);

	var apis =
	{
		gGeocode: "AIzaSyAtpm5B5wXU56SrAZ-Z9OBgfMoMaXovy3A",
		gStreetView: "AIzaSyDgH7bb2ybHKZ3K-45N_jNKOPAhB6p-5kc",
		zillow: "X1-ZWz1fzqykaoah7_aui2x",
		openWeather: "f6345c7e44b9a02605712b0880591b2b"
	};

	var address =
	{
		street: "",
		city: "",
		state: "",
		zip: "",
		full: ""
	};

	var location =
	{
		lat: 0,
		lon: 0,
		nbhd: "",
		placeID: "",
		cityPlaceID: ""
	};

	var weather =
	{
		description: "",
		icon: "",
		tempK: 0,
		tempF: 0,
		tempC: 0,
		humidity: 0,
		windSpeed: 0,
		windDirection: "",
		sunrise: "",
		sunset: ""
	}

	var zData =
	{
		bedrooms: 0,
		bathrooms: 0,
		yearbuilt: 1900,
		lotSize: 0,
		sqft: 0,
		fips: 00000,
		type: ""
	}







$("#address_submit").click(function()
{
	event.preventDefault();
	address.street = $("#address_street").val().trim().replace(/ /g, "+");
	address.city = $("#address_city").val().trim().replace(/ /g, "+");
	address.state = $("#address_state").val().trim();
	address.zip = $("#address_zipcode").val().trim();	



	//Google GeoCode API (Full Address)
	var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address.street + ",+" + 
		address.city + ",+" + address.state + "&key=" + apis.gGeocode;

	$.ajax(
	{
  		url: geocodeURL,
  		method: "GET",
	})

	.done(function(geocodeapireturn)
	{
		location.lat = geocodeapireturn.results[0].geometry.location.lat;
		location.lon = geocodeapireturn.results[0].geometry.location.lng;
		location.placeID = geocodeapireturn.results[0].place_id;
		location.nbhd = geocodeapireturn.results[0].address_components[2].long_name;


		//OpenWeatherMap API (Current Weather Data)
		var openWeatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + location.lat + 
			"&lon=" + location.lon + "&appid=" + apis.openWeather;

		$.ajax(
		{
			url: openWeatherURL,
			method: "GET"
		})

		.done(function(weatherapireturn)
		{
			console.log("OpenWeatherMap URL: " + openWeatherURL);
			console.log(weatherapireturn);

			weather.description = weatherapireturn.weather[0].description;
			weather.icon = weatherapireturn.weather[0].icon;
			weather.tempK = weatherapireturn.main.temp;
			weather.tempC = weather.tempK - 273.15;
			weather.tempF = (weather.tempC * 1.8) + 32;
			weather.humidity = weatherapireturn.main.humidity;
			weather.windSpeed = weatherapireturn.wind.speed;
			weather.windDirection = weatherapireturn.wind.deg;
			weather.sunrise = weatherapireturn.sys.sunrise;
			weather.sunset = weatherapireturn.sys.sunset;

			var weatherIconURL = "https://openweathermap.org/img/w/" + weather.icon + ".png"

			console.log("Description: " + weather.description);
			console.log("Icon: " + weatherIconURL);
			console.log("Temperature (F): " + weather.tempF);
			console.log("Temperature (C): " + weather.tempC);
			console.log("Humidity: " + weather.humidity + "%");
			console.log("Wind Speed: " + weather.windSpeed);
			console.log("Wind Direction (deg): " + weather.windDirection);

			$("#weather_results").append("<h2>Current Weather</h2><br>")
				.append("<span>Condition: " + weather.description + "</span><br>")
				.append("<span>Temperature (F): " + weather.tempF.toFixed(2) + "</span><br>")
				.append("<span>Temperature (C): " + weather.tempC.toFixed(2) + "</span><br>")
				.append("<span>Humidity: " + weather.humidity + "%</span><br>")
		})


		//Google Street View API
		var steetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + 
			location.lat + "," + location.lon + "&key=" + apis.gStreetView;

		var streetViewImage = $("<img>").attr("src", steetviewURL);
		$("#streetview_results").prepend(streetViewImage);
	})





	//Google GeoCode API (City)
	var geocodeCityURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
		address.city + ",+" + address.state + "&key=" + apis.gGeocode;
	
	$.ajax(
	{
		url: geocodeCityURL,
		method: "GET",
	})
	
	.done(function(apireturn)
	{
		location.cityPlaceID = apireturn.results[0].place_id;

		//Google Places API
		var service = new google.maps.places.PlacesService(document.getElementById("google_places"));
	   
	   service.getDetails(
	   {
	   	placeId: location.cityPlaceID
	   }, function (place, status)
	   {
	      for (i = 0; i < 9; i++)
	      {
				var photoURL = place.photos[i].getUrl({maxWidth: 300, maxHeight: 300});
				var addImg = $("<img>");
				addImg.attr("src", photoURL);
				$("#google_places").append(addImg);
			}
		})
	})





	//Zillow API
	var zillowURL = "https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=" + apis.zillow + 
		"&address=" + address.street + "&citystatezip=" + address.city + 
		"%2C+" + address.state;
	console.log("Zillow URL: " + zillowURL);

	$.getJSON("http://anyorigin.com/go?url="+escape(zillowURL)+"&callback=?", function(zillowapireturn)
	{
		var iframe = $("#output")[0];
		var xmlDocument = iframe.document;
		
		if (iframe.contentDocument)
		{
			xmlDocument = iframe.contentDocument;
		} 

		else if (iframe.contentWindow)
		{
			xmlDocument = iframe.contentWindow.document;
		}
		
		xmlDocument.open();
		xmlDocument.writeln(zillowapireturn.contents);
		xmlDocument.close();
	})

	.done(function(zillowapireturn)
	{
		zData.yearbuilt = $("iframe").contents().find("yearbuilt").html();
		zData.bedrooms = $("iframe").contents().find("bedrooms").html();
		zData.bathrooms = $("iframe").contents().find("bathrooms").html();
		zData.fips = $("iframe").contents().find("FIPScounty").html();
		zData.sqft = $("iframe").contents().find("finishedSqFt").html();
		zData.lotSize = $("iframe").contents().find("lotSizeSqFt").html();
		zData.type = $("iframe").contents().find("useCode").html();

		if (zData.type == "SingleFamily")
		{
			zData.type = "Single Family";
		}

		for (x in zData)
		{
			if (zData[x] == undefined)
			{
				zData[x] = "No Available Info";
			}
		}

		var zStreet = $("iframe").contents().find("street").html();
		var zCity = $("iframe").contents().find("city").html();
		var zState = $("iframe").contents().find("state").html();
		var zZip = $("iframe").contents().find("zipcode").html();
		address.full = zStreet + "<br>" + zCity + ", " + zState + "  " + zZip; + "<br>";

		$("#zillow_results").append("<h2>" + address.full + "</h2><br>")
			.append("<span>Year Built: " + zData.yearbuilt + "    ")
			.append("<small>(Age: " + (2017 - zData.yearbuilt) + " years)</small></span><br>")
			.append("<span>Type Of Home: " + zData.type + "</span><br><br>");

		if (zData.sqft != "N/A")
		{
			$("#zillow_results").append("<span>Property Size: " + zData.sqft + " sqft</span><br>");
		} else
		{
			$("#zillow_results").append("<span>Property Size: " + zData.sqft + " sqft</span><br>");
		}

		if (zData.lotSize != "N/A")
		{
			$("#zillow_results").append("<span>Lot Size: " + zData.lotSize + " sqft</span><br>");
		} else
		{
			$("#zillow_results").append("<span>Lot Size: " + zData.lotSize + "</span><br>");
		}
		
		$("#zillow_results").append("<br><span>Bedrooms: " + zData.bedrooms + "</span><br>")
			.append("<span>Bathrooms: " + zData.bathrooms + "</span><br>");


		$("form").fadeOut(900, function()
		{
			$("#streetview_results").fadeIn(2000);
			$("#zillow_results").fadeIn(2000);
			$("#weather_results").fadeIn(2000);
		});

	})  //End Of .done Function After Zillow API Return
	
	


$("form").trigger("reset");

}) //End Of #address_submit Click Function


$("#clear_button").click (function()
{
	window.location.reload(true);
})




})