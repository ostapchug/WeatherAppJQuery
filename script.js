$(function(){
var APID="";

function getWeather(url, func) {
	$.get(url, function(data) {
		$("#tips").hide();
		$("#tabs").show();
		func(data);
	}, "json").done(function() {
		console.log("Success");
	}).fail(function() {
		console.log("Error");
	});      
}

function getCurrentWeather (data){

	//console.log(data);

	$("#cheader").text(`Current weather in ${data.name}, ${data.sys.country}`);
	$("#temperature").html(`<img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png'> ${Math.round(data.main.temp)}&#8451;`);
	$("#description").text(data.weather[0].description.charAt(0).toUpperCase()+data.weather[0].description.slice(1));
	$("#dt").text(`${new Date(data.dt*1000).toString().substring(16,21)}  ${new Date(data.dt*1000).toString().substring(3,10)}`);
	$("#wind").text(`${data.wind.speed} m/s`);
	$("#cloudiness").text(`${data.clouds.all} %`);
	$("#pressure").text(`${Math.round(data.main.pressure*0.750062)} mm Hg`);
	$("#humidity").text(`${data.main.humidity} %`);
	$("#sunrise").text(new Date(data.sys.sunrise*1000).toString().substring(16,21));
	$("#sunset").text(Date(data.sys.sunset*1000).toString().substring(16,21));
	$("#coords").text(`Lat: ${data.coord.lat} | Long: ${data.coord.lon}`);

}

function getDailyWeather (data){

	var table="";

	//console.log(data);

    $("#dheader").text(`Daily weather and forecasts in ${data.city.name}, ${data.city.country}`);

    for(var i=0;i<data.list.length;i++){

    	if (!table.includes(new Date(data.list[i].dt*1000).toString().substring(0,15))){
    		if(new Date(data.list[i].dt*1000).getDate()==new Date(Date.now()).getDate()){
    			table += `<tr class='active'><th colspan='2'>${new Date(data.list[i].dt*1000).toString().substring(0,15)}&nbsp;Today</th></tr>`;
    			}else{
    				table += `<tr class='active'><th colspan='2'>${new Date(data.list[i].dt*1000).toString().substring(0,15)}</th></tr>`;
    				}
    	}

    	table += `<tr><td>${new Date (data.list[i].dt*1000).toString().substring(16,21)}<img src='http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png'></td>`+
                 `<td><span class='label label-default'>${Math.round(data.list[i].main.temp)}&#8451;</span>&nbsp;&nbsp;<i>${data.list[i].weather[0].description}</i>`+
                 `<p>${data.list[i].wind.speed}&nbsp;m/s,&nbspclouds:&nbsp${data.list[i].clouds.all}%,&nbsp${Math.round(data.list[i].main.pressure*0.750062)}&nbspmm&nbspHg,&nbsphumidity:&nbsp${data.list[i].main.humidity}%</p></td></tr>`;    
	}

    $("#dtable").html(table);
}

$("#seachcity").click(function() {
	var cityName = $("#cityname").val();
	getWeather(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${APID}`, getCurrentWeather);
	getWeather(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${APID}`, getDailyWeather); 
});

$("#form").submit(function (event) {
    event.preventDefault();
    $("#seachcity").click();
});

$("#getlocation").click(function(){
	navigator.geolocation.getCurrentPosition(function(position) {
		getWeather(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${APID}`, getCurrentWeather);
		getWeather(`http://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${APID}`, getDailyWeather);
    });
});

});
