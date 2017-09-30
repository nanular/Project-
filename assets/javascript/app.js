$(document).ready(function()
{
	var vpWindowWidth = $(window).width();
	var vpHeadingWidth = $("#snapshot_header").outerWidth();
	console.log("Window Width: " + vpWindowWidth);
	console.log("h1 Width: " + vpHeadingWidth);
	var h1Margin = (vpWindowWidth - vpHeadingWidth) / 2;
	console.log(h1Margin);

	$("#snapshot_header").css("margin-left", h1Margin);

	centeranimation();

	function centeranimation()
	{

		
		$("#snapshot_header").css("margin-left", h1Margin);

		var winHeight = window.innerHeight;
		var elementHeight = $(".center_animation").outerHeight();
		var topValue = (winHeight / 2) - (elementHeight / 2);
		$(".center_animation").stop().animate({top: topValue + "px"}, 2000, function() {
			$("#snapshot_header").fadeIn(1700);
			$("#snapshot_header").css("position", "fixed");
		});
	}

	//$(window).resize(centeranimation);

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
		county: "",
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

	address.street = $("#address_street").val().trim();
	address.city = $("#address_city").val().trim();
	address.state = $("#address_state").val().trim();
	address.zip = $("#address_zipcode").val().trim();

	if (address.street == "" || address.city == "" || address.state == "")
	{
		alert("You must at least enter a street address, city, and state.");
		return;
	}

	$("h1").fadeOut(1500);

	var streetPlus = address.street.replace(/ /g, "+");
	var cityPlus = address.city.replace(/ /g, "+");

	//Google GeoCode API (Full Address)
	var geocodeURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + streetPlus + ",+" + 
		cityPlus + ",+" + address.state + "&key=" + apis.gGeocode;

	$.ajax(
	{
  		url: geocodeURL,
  		method: "GET",
	})

	.done(function(geocodeapireturn)
	{
		console.log("Google GeoCode URL: " + geocodeURL);
		console.log(geocodeapireturn);

		location.lat = geocodeapireturn.results[0].geometry.location.lat;
		location.lon = geocodeapireturn.results[0].geometry.location.lng;
		location.placeID = geocodeapireturn.results[0].place_id;


		var addressArray = geocodeapireturn.results[0].address_components;
		var addressArrayLength = addressArray.length;

		console.log(addressArray);

		for (i = 0; i < addressArrayLength; i++)
		{
			var indexContents = addressArray[i].types[0];
			if (indexContents == "administrative_area_level_2")
			{
				location.county = addressArray[i].long_name;
			}
		}

		if (location.county === "")
		{
			location.county = "No Available Info";
		}

		for (i = 0; i < addressArrayLength; i++)
		{
			var indexContents = addressArray[i].types[0];
			if (indexContents == "neighborhood")
			{
				location.nbhd = addressArray[i].long_name;
			}	
		}

		if (location.nbhd === "")
		{
			location.nbhd = "No Available Info";
		}		


		var nbhdType = geocodeapireturn.results[0].address_components[2].types[0];
		if (nbhdType == "neighborhood")
		{
			location.nbhd = geocodeapireturn.results[0].address_components[2].long_name;
		} else {
			location.nbhd = "No Available Info"			
		}

		var lastIndex = geocodeapireturn.results[0].address_components.slice(-1)[0].types[0];
		var zipSuffix = geocodeapireturn.results[0].address_components.slice(-1)[0].long_name;
		
		if (lastIndex == "postal_code_suffix")
		{
			address.zip = address.zip + "-" + zipSuffix;
		}
		

		$("#geocode_data").append("<h2>Geocoding Info</h2><br>")
			.append("<span>Latitude: " + location.lat.toFixed(5) + "</span><br>")
			.append("<span>Longitude: " + location.lon.toFixed(5) + "</span><br>")
			.append("<span>Neighborhood: " + location.nbhd + "</span><br>")
			.append("<span>County: " + location.county + "</span><br>");


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

			var windSpeedmph = (weather.windSpeed / 1609.344) * 3600
			var weatherIconURL = "https://openweathermap.org/img/w/" + weather.icon + ".png"
			var weatherIconImage = $("<img>");
			weatherIconImage.addClass("weather_icon");
			weatherIconImage.attr("src", weatherIconURL);

			$("#weather_results").append("<h2>Current Weather</h2><br>")
				.append("<span>Condition: " + weather.description + "</span><br>")
				.append(console.log(""))
				.append("<span>Temperature (F): " + weather.tempF.toFixed(2) + "</span><br>")
				.append("<span>Temperature (C): " + weather.tempC.toFixed(2) + "</span><br>")
				.append("<span>Humidity: " + weather.humidity + "%</span><br>")
				.append("<span>Wind Speed: " + windSpeedmph.toFixed(2) + " mph</span><br>");
		})


		//Google Street View API
		var steetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=550x275&location=" + 
			location.lat + "," + location.lon + "&key=" + apis.gStreetView;

		var streetViewImage = $("<img>");
		streetViewImage.attr("src", steetviewURL);
		$("#streetview_results").append(streetViewImage);

	}) // End Of .done Functions After The 


	//Google GeoCode API (City)
	var geocodeCityURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + 
		cityPlus + ",+" + address.state + "&key=" + apis.gGeocode;
	
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
		console.log(service);
	   
	   service.getDetails(
	   {
	   	placeId: location.cityPlaceID
	   }, function (place, status)
	   {
	      for (i = 0; i < 10; i++)
	      {
				var photoURL = place.photos[i].getUrl({maxWidth: 300, maxHeight: 300});
				var addImg = $("<img>");
				addImg.attr("src", photoURL);
				$("#google_places").append(addImg);
			}
		})


	//Zillow API
	var zillowURL = "https://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=" + apis.zillow + 
		"&address=" + streetPlus + "&citystatezip=" + cityPlus + "%2C+" + address.state;

	$.getJSON("https://anyorigin.com/go?url="+escape(zillowURL)+"&callback=?", function(zillowapireturn)
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

		var zillowXMLData = $("iframe").contents().find("result").html();
		console.log("Zillow URL: " + zillowURL);
		console.log(zillowXMLData);
		console.log("============================")

		if (zData.type == "SingleFamily")
		{
			zData.type = "Single Family";
		} else if (zData.type == "VacantResidentialLand")
		{
			zData.type = "Vacant Residential Land";
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
		if (zStreet == undefined)
		{
			address.full = address.street + "<br>" + address.city + ", " + address.state + "  " + address.zip
		} else
		{
			address.full = zStreet + "<br>" + zCity + ", " + zState + "  " + address.zip;
		}

		$("#zillow_results").append("<h2>" + address.full + "</h2><br>")
			.append("<span>Year Built: " + zData.yearbuilt + "     <br>");

		if(zData.yearbuilt !== "No Available Info")
		{
			var currentYear = (new Date()).getFullYear();
			$("#zillow_results").append("<small>(Age: " + (currentYear - zData.yearbuilt) + " years)</small></span><br>");
		}

		$("#zillow_results").append("<span>Type Of Home: " + zData.type + "</span><br><br>");

		if (zData.sqft !== "No Available Info")
		{
			$("#zillow_results").append("<span>Property Size: " + zData.sqft + " sqft</span><br>");
		} else
		{
			$("#zillow_results").append("<span>Property Size: " + zData.sqft + "</span><br>");
		}

		if (zData.lotSize !== "No Available Info")
		{
			$("#zillow_results").append("<span>Lot Size: " + zData.lotSize + " sqft</span><br>");
		} else
		{
			$("#zillow_results").append("<span>Lot Size: " + zData.lotSize + "</span><br>");
		}
		
		$("#zillow_results").append("<span>Bedrooms: " + zData.bedrooms + "</span><br>")
			.append("<span>Bathrooms: " + zData.bathrooms + "</span><br>");


		$("form").fadeOut(950, function()
		{
			$("#streetview_results").fadeIn(1600);
			$("#geocode_data").fadeIn(1100, function()
			{
				$("#zillow_results").fadeIn(1250);
				$("#weather_results").fadeIn(2800);
				$("#google_places").fadeIn(3050);
				$("#current_time").fadeIn(3750);
			});
		});

	})  //End Of .done Function Following Zillow API Return





	})



	


$("form").trigger("reset");

}) //End Of #address_submit Click Function



$("#clear_button").click (function()
{
	$("form").trigger("reset");
})


})