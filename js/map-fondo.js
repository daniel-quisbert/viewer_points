/**
 * @author danielquisbert.info@gmail.com [Daniel Quisbert]
 */
"use strict";
var map;

var markers = null;

function Configuration() {

	this.proxy = "/cgi-bin/proxy.cgi?url=";
}

function createMap() {
	map = new OpenLayers.Map("map", {
		div : 'map',
		//allOverlays : true,
		maxResolution : 196543.0339,
		//restrictedExtent : extendOsmGoogle(context.bounds),
		units : 'm',
		maxExtent : extendOsmGoogle(),
		numZoomLevels : 20,
		projection : new OpenLayers.Projection("EPSG:900913"),
		displayProjection : new OpenLayers.Projection("EPSG:4326")
	});
	backgroundMap();
	var i, panel = new OpenLayers.Control.Panel();
	//panel.addControls([new OpenLayers.Control.FullScreen()]);
	map.addControl(panel);

	for ( i = 0; i < map.layers.length; i=i+1) {
		map.layers[i].setTileSize(new OpenLayers.Size(256, 256));
	}
	//Forzamos el centrado con el zoom
	map.setCenter(extendOsmGoogle().getCenterLonLat(), 14);
}

function extendOsmGoogle() {
	var nx = new OpenLayers.Bounds(-7588438.77501, -1864320.6882818, -7582261.7109984, -1861459.0785812);
	return nx;
}

function backgroundMap() {
	map.addLayer(new OpenLayers.Layer.OSM("Mapnik"));
	map.addLayer(new OpenLayers.Layer.OSM("Google-like", ["http://a.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/9/256/${z}/${x}/${y}.png", "http://b.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/9/256/${z}/${x}/${y}.png", "http://c.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/9/256/${z}/${x}/${y}.png"], {
		"tileOptions" : {
			"crossOriginKeyword" : null
		}
	}));
	map.addLayer(new OpenLayers.Layer.OSM("Midnight Commander", ["http://a.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/999/256/${z}/${x}/${y}.png", "http://b.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/999/256/${z}/${x}/${y}.png", "http://c.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/999/256/${z}/${x}/${y}.png"], {
		"tileOptions" : {
			"crossOriginKeyword" : null
		}
	}));
	/*map.addLayer(new OpenLayers.Layer.Google("Google Streets", {
		type : google.maps.MapTypeId.ROADMAP
	}));
	map.addLayer(new OpenLayers.Layer.Google("Google Satellite", {
		type : google.maps.MapTypeId.SATELLITE
	}));
	map.addLayer(new OpenLayers.Layer.Google("Google Hybrid", {
		type : google.maps.MapTypeId.HYBRID
	}));*/
	//map.addLayer(new OpenLayers.Layer.OSM.CycleMap("CycleMap"), new OpenLayers.Layer.Google("Google Physical", {
	//type : google.maps.MapTypeId.TERRAIN,
	//}));

	markers = new OpenLayers.Layer.Markers("Markers", {
		displayInLayerSwitcher : false,
		isBaseLayer : false
	});
	map.addLayer(markers);
}

//map.addControl(new OpenLayers.Control.LayerSwitcher());

var j, popup = null;

var tamanio = new OpenLayers.Size(30, 30);
var offset = new OpenLayers.Pixel(-(tamanio.w / 2), -tamanio.h);

var imagenes = ["images/home_1.jpg", "images/home_2.jpg", "images/home_3.jpg", "images/home_4.jpg", "images/home_5.jpg", "images/home_6.jpg"];
var titulos = ["Plaza del Estudiante", "Atrio UMSA", "Alcaldia La Paz", "Puente de las Américas", "Nevado Illimani", "Perez Velazco"];
var lon = [-68.1307, -68.1298, -68.13412, -68.1186, -67.7792, -68.1369];
var lat = [-16.5043, -16.5045, -16.4979, -16.5262, -16.6557, -16.4949];
var desc = ["Plaza ciudad de La Paz, mas conocido como plaza del estudiante de la UMSA", "Atrio principal de la Universidad Mayor de San Andres", "Honorable Alcaldia Municipal de La Paz", "atractivo turístico: puente de las Américas", "Nevado pricipal y característico de la ciudad de La Paz", "lugar céntrico de la ciudad de La Paz: Perez Velazco"];

for ( j = 0; j < imagenes.length; j=j+1) {
	//marcaPunto(lon[j], lat[j], titulos[j], imagenes[j], desc[j]);
}

function marcaPunto(x, y, tit, img, desc) {
	var marker, iconMarker, LonLat, text = "<div style='font-size:11px;'><b>&nbsp;" + tit + "</b>+<br>" + "<img src=" + img + " width='300' height='230'><br/>" + desc + "<br> </div>";

	iconMarker = new OpenLayers.Icon("images/marker1.png", tamanio, offset);
	LonLat = new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection(map.getProjection()));

	marker = new OpenLayers.Marker(LonLat, iconMarker);
	marker.events.register('mouseover', marker, function() {
		popup = new OpenLayers.Popup.FramedCloud("Popup", new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
		new OpenLayers.Projection("EPSG:900913")), null, text, null, true);

		map.addPopup(popup);
	});
	marker.events.register('mouseout', marker, function() {
		popup.destroy();
	});

	markers.addMarker(marker);

	map.setCenter(LonLat, 14);

}

var conf;
conf = new Configuration();
OpenLayers.ProxyHost = conf.proxy;
createMap();