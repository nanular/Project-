API Keys
========
Google GeoCode [Neil]		AIzaSyAtpm5B5wXU56SrAZ-Z9OBgfMoMaXovy3A
Google Street View [Neil]	AIzaSyDgH7bb2ybHKZ3K-45N_jNKOPAhB6p-5kc
Google Places [Bryce]		AIzaSyD5dj6sTAyGKxhzt9pd2gAo7Kp2JfOacLc
OpenWeatherMap				f6345c7e44b9a02605712b0880591b2b

OnBoard Informatics [Bryce]	6f1057e839cf36ac5c35744c5461b18c
OnBoard Informatics [Neil]	212169cc419724fda46e92196b083cfb
OnBoard [user_key]			4eae65e6461ddc50632bb992c6ee5fc2
Zillow [Lorna]				X1-ZWz1fzlt3e34sr_76gmj
Zillow [Neil]				X1-ZWz1fzqykaoah7_aui2x
FourSquare (ClientID)		GTDR2JU024JPC111OI04WJT5NUZYF2FE5OI10LCSU2PRJEZ4
FourSquare (Client Secret)	GTDR2JU024JPC111OI04WJT5NUZYF2FE5OI10LCSU2PRJEZ4





OpenWeatherMap API
==================

Example:
https://api.openweathermap.org/data/2.5/weather?lat=30.4162076&lon=-97.64841349999999&appid=f6345c7e44b9a02605712b0880591b2b

Icon = "https://openweathermap.org/img/w/" + apireturn.weather.icon + ".png"
Temp (F) = 1.8 * (apireturn.main.temp - 273) + 32
Temp (C) = apireturn.main.temp - 273
Pressure: Atmospheric Pressure (Unit of measurement: hPa)
Humidity: Unit of measurement: %
Wind Speed (mph) = (apireturn.wind.speed * 60) / 1609.344





Zillow API
==========

Example: 
http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1fzqykaoah7_aui2x&address=813+Crieff+Cross+Dr&citystatezip=Pflugerville%2C+TX





Google GeoCode API
==================

Example: 
https://maps.googleapis.com/maps/api/geocode/json?address=813+Crieff+Cross+Dr,+Pflugerville,+TX&key=AIzaSyAtpm5B5wXU56SrAZ-Z9OBgfMoMaXovy3A





Google Street View API
======================

Example:
https://maps.googleapis.com/maps/api/streetview?size=600x300&location=30.4162076,-97.64841349999999&key=AIzaSyDgH7bb2ybHKZ3K-45N_jNKOPAhB6p-5kc










