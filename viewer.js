/**
 * Author: Daniel Quisbert
	email: danielquisbert.info@gmail.com
	blog: http://danielquisbert.blogspot.com
 */

/**
 * @requires OpenLayers/Map.js
 */

/*jslint browser: true*/
/*global OpenLayers*/

/*(function () {*/"use strict";

var init, map;
var markers = null,markers2 = null;
var popup = null;
var tamanio = new OpenLayers.Size(30, 30);
var offset = new OpenLayers.Pixel(-(tamanio.w / 2), -tamanio.h);
/*
 * Array CLIENTES, datos que se mostraran de los clientes
 * longitud, latitud, el nombre del cliente, su direccion, tipo de servicio y las perdidas en db
 */
var lon_cli = [-68.1307, -68.1298, -68.13412, -68.1186, -68.1369];
var lat_cli = [-16.5043, -16.5045, -16.4979, -16.5262, -16.4949];
var nombre_cli = ["AFP Prevision", "Universidad Mayor de San Andres", "Alcaldia La Paz", "Rest. Los Amigos", "Banco FIE"];
var direccion = ["Plaza plaza del estudiante de la UMSA", "Atrio principal de la Universidad Mayor de San Andres", "CAlle Mercado, esquina Ayacucho", "Puente de las Américas", "Perez Velazco, pasarela"];
var tipo_serv = ["Datos", "Television", "Datos", "Datos", "Telefono", "Datos"];
var perdidas_db = [8, 12, 24, 8, 8, 12];

/*
 * Arryas Empalmes
 */
var lon_em = [-68.4307, -68.4298, -68.43412, -68.4186, -68.5369];
var lat_em = [-16.8043, -16.8045, -16.7979, -16.8262, -16.7949];
var direccion = ["Plaza plaza del estudiante de la UMSA", "Atrio principal de la Universidad Mayor de San Andres", "CAlle Mercado, esquina Ayacucho", "Puente de las Américas", "Perez Velazco, pasarela"];
var cap_fibra = [24, 12, 24, 8, 8, 12];
var hilos = [7, 7, 7, 7, 7, 7];
var atenuacion = [8, 12, 24, 8, 8, 12];

function extendOsmGoogle() {
	return new OpenLayers.Bounds(-7588438.77501, -1864320.6882818, -7582261.7109984, -1861459.0785812);
}
/*
 * Fondos de Mapa Google Maps
 */
function backgroundMap() {
	map.addLayers([new OpenLayers.Layer.Google("Google Hybrid", {
		type : google.maps.MapTypeId.HYBRID
	}), new OpenLayers.Layer.Google("Google Satellite", {
		type : google.maps.MapTypeId.SATELLITE
	}), new OpenLayers.Layer.Google("Google Physical", {
		type : google.maps.MapTypeId.TERRAIN
	})]);

}

/**
 * Marcamos los markes en el mapa, con las coordenadas respectivas
 */
function marcaPunto(x, y, nom, dir, tipo_serv, per_db, text) {
	var marker, iconMarker, LonLat, text;
	text = "<div style='font-size:11px;color:#000;'><b>&nbsp;<h4>" + nom + "</h4></b><hr><ul>" + "<li>Dirección: " + dir + "</li>" + "<li>Tipo Serv.: " + tipo_serv + "</li>" + "<li>Perdida db: " + per_db + "</li>" + "</ul></div>";

	iconMarker = new OpenLayers.Icon("images/marker1.png", tamanio, offset);
	LonLat = new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), 
	new OpenLayers.Projection(new OpenLayers.Projection("EPSG:900913")));

	marker = new OpenLayers.Marker(LonLat, iconMarker);
	marker.events.register('mousedown', marker, function() {
		popup = new OpenLayers.Popup.FramedCloud("Popup", 
		new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"),
		 new OpenLayers.Projection("EPSG:900913")), null, text, null, true);

		map.addPopup(popup);
	});
	markers.addMarker(marker);
	map.setCenter(LonLat, 10);
}

function marcaPunto2(x, y, dir, cap_fib, hilos, aten) {
	var marker2, iconMarker, LonLat, text;
	text = "<div style='font-size:11px;color:#000;'><b>&nbsp;<h4>" 
	+ dir + "</h4></b><hr><ul>"
	+ "<li>Dirección: " + cap_fib + "</li>"
	 + "<li>Tipo Serv.: " + hilos
	 + "</li>" + "<li>Perdida db: " + aten
	 + "</li>" + "</ul></div>";

	iconMarker = new OpenLayers.Icon("images/marker2.png", tamanio, offset);
	LonLat = new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), 
	new OpenLayers.Projection(new OpenLayers.Projection("EPSG:900913")));

	marker2 = new OpenLayers.Marker(LonLat, iconMarker);
	marker2.events.register('mousedown', marker, function() {
		popup = new OpenLayers.Popup.FramedCloud("Popup", 
		new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"),
		 new OpenLayers.Projection("EPSG:900913")), null, text, null, true);

		map.addPopup(popup);
	});
	markers2.addMarker(marker2);
	map.setCenter(LonLat, 10);
}

function createTools() {
	var vpanel, i, j, b1, b2, b3;
	markers = new OpenLayers.Layer.Markers("Clientes", {
					displayInLayerSwitcher : true,
					isBaseLayer : false
				});
	map.addLayer(markers);
	
	markers2 = new OpenLayers.Layer.Markers("Empalmes", {
					displayInLayerSwitcher : true,
					isBaseLayer : false
				});
	map.addLayer(markers2);
	// Botón Clientes
	b1 = new OpenLayers.Control.Button({
		displayClass : "clientes",
		type : OpenLayers.Control.TYPE_TOGGLE,
		eventListeners : {
			'activate' : function() {
				for ( i = 0; i < nombre_cli.length; i = i + 1) {
					marcaPunto(lon_cli[i], lat_cli[i], nombre_cli[i], direccion[i], tipo_serv[i], perdidas_db[i]);
				}
			},
			'deactivate' : function() {
				popup.destroy();
				for ( j = 0; j < nombre_cli.length; j = j + 1) {
					markers[j].destroy();
				}
			}
		}
	});
	// Botón Empalmes
	b2 = new OpenLayers.Control.Button({
		displayClass : "empalmes",
		type : OpenLayers.Control.TYPE_TOGGLE,
		eventListeners : {
			'activate' : function() {
				for ( i = 0; i < direccion.length; i = i + 1) {
					marcaPunto2(lon_em[i], lat_em[i], direccion[i], cap_fibra[i], hilos[i], atenuacion[i]);
				}
			},
			'deactivate' : function() {
				popup.destroy();
				for ( j = 0; j < direccion.length; j = j + 1) {
					markers2[j].destroy();
				}
			}
		}
	});
	// Botón Fibra
	b3 = new OpenLayers.Control.Button({
		trigger : function() {
			alert("Sección de Fibra en construcción");
		},
		displayClass : "fibra"
	});
	vpanel = new OpenLayers.Control.TextButtonPanel({
		//vertical : true,
		additionalClass : "vpanel"
	});
	vpanel.addControls([b1, b2, b3]);
	map.addControl(vpanel);
}

//function

function createMap() {
	var i, j;
	map = new OpenLayers.Map("map", {
		div : 'map',
		maxResolution : 196543.0339,
		units : 'm',
		maxExtent : extendOsmGoogle(),
		numZoomLevels : 20,
		projection : new OpenLayers.Projection("EPSG:900913"),
		displayProjection : new OpenLayers.Projection("EPSG:4326"),
		controls : [new OpenLayers.Control.Navigation({
			mouseWheelOptions : {
				cumulative : false,
				interval : 100
			},
			dragPanOptions : {
				enableKinetic : {
					deceleration : 0.02
				}
			}
		}), new OpenLayers.Control.ZoomBox()]
	});
	backgroundMap();

	//for ( i = 0; i < map.layers.length; i = i + 1) {
	//	map.layers[i].setTileSize(new OpenLayers.Size(256, 256));
	//}

}

// main
init = function() {
	createMap();
	//menu de capas
	createTools();
	map.setCenter(extendOsmGoogle().getCenterLonLat(), 8);
	map.addControl(new OpenLayers.Control.LayerSwitcher());
};
window.onload = init;
/*}());*/