$(document).ready(function() {
 
	navigator.geolocation.getCurrentPosition(success);
function success(position) {
     var lat = position.coords.latitude;
     var long = position.coords.longitude;

	var myLatLng = new google.maps.LatLng(lat, long);
	 
  MYMAP.init('#map', myLatLng, 14);
 
  
    }
  
  $("#showmarkers").click(function(e){
		MYMAP.placeMarkers('markers.xml');
		currentmarker.setMap(null);
  });
});

var currentmarker;

var MYMAP = {
  map: null,
	bounds: null
}

MYMAP.init = function(selector, latLng, zoom) {
  var myOptions = {
    zoom:zoom,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map($(selector)[0], myOptions);
	this.bounds = new google.maps.LatLngBounds();
	 currentmarker = new google.maps.Marker( 
  { 
    position : latLng,
	animation: google.maps.Animation.DROP,
	title:"Location", 
     map: MYMAP.map 
  });
  var infowindow = new google.maps.InfoWindow({
	  content : 'current position'
	  
	 
	  
  });
  google.maps.event.addListener(currentmarker, 'click', function() {
  infowindow.open(MYMAP, currentmarker)
  });
}

MYMAP.placeMarkers = function(filename) {
	$.get(filename, function(xml){
		$(xml).find("marker").each(function(){
			var name = $(this).find('name').text();
			var address = $(this).find('address').text();
			
			// create a new LatLng point for the marker
			var lat = $(this).find('lat').text();
			var lng = $(this).find('lng').text();
			var point = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
			
			// extend the bounds to include the new point
			MYMAP.bounds.extend(point);
			
			var marker = new google.maps.Marker({
				position: point,
				map: MYMAP.map
			});
			
			var infoWindow = new google.maps.InfoWindow();
			var html='<strong>'+name+'</strong.><br />'+address;
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent(html);
				infoWindow.open(MYMAP.map, marker);
			});
			MYMAP.map.fitBounds(MYMAP.bounds);
		});
	});
}