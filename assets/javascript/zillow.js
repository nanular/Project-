 

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
		});

		return false;
	}

	zillowGrab();











	$.ajax(
	{
		url: "assets/xml/GetSearchResults.xml",
		dataType: "xml",
		method: "GET",
	})
	.done(function(zillowapireturn)
	{
		console.log(zillowapireturn);
	})













	




