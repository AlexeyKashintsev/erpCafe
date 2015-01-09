/**
 * 
 * @author Алексей
 * @module
 * @public
 */ 
function tpMap(aContainer) {
    var self = this, model = this.model;
    var map;
    var tpMarker;
    var workWithMarker = false;
    var btnPanel;
    var center;
    var urlOSM = "http://nominatim.openstreetmap.org/search/{0}?format=json&polygon=1&addressdetails=1";
    
    function format(aObj, aArguments) {
        var formatted = aObj;
        for (var arg in aArguments) {
            formatted = formatted.replace("{" + arg + "}", aArguments[arg]);
        }
        return formatted;
    };
    
    function newMarker(aPosition) {
        var marker = L.marker(aPosition,
                    {
                        icon        :   new L.Icon.Default(),
                        draggable   :   true
                    });
        marker.addTo(map);
        return marker;
    }
    
    function saveMarker() {
        if(tpMarker){
            if(!model.listTradePoints.empty){
                    model.listTradePoints.cursor.tp_geoposition = JSON.stringify(tpMarker.getLatLng());
                    model.save();
            }
        }
        $('#modalForm').off('hidden.bs.modal', saveMarker);
    }
    
    function invalidate() {
        setTimeout(function() {
                map.invalidateSize(false);
            }, 500);
    }
    
    function setView(aCenter) {
        setTimeout(function() {
            map.setView( aCenter, 14);
        }, 800);
    }
    
    self.setTradePoint = function(aTradePoint) {
        model.listTradePoints.params.franchazi_id = null;
        model.listTradePoints.params.trade_point = aTradePoint;
        model.listTradePoints.requery(function() {
            if(!model.listTradePoints.empty) {
                if (model.listTradePoints.cursor.tp_geoposition) {
                    var center = JSON.parse(model.listTradePoints.cursor.tp_geoposition);
                    tpMarker = newMarker(center);
                    setView(center);
                } else if (model.listTradePoints.cursor.tp_city) {
                    var link = format(urlOSM, [model.listTradePoints.cursor.city + 
                            (!!model.listTradePoints.cursor.tp_address ?
                            (', ' + model.listTradePoints.cursor.tp_address) : '')]);
                    $.get(link, function(osmGeoObject) {
                        if (osmGeoObject) {
                            tpMarker = newMarker(osmGeoObject[0]);
                            var center = {
                                lat : osmGeoObject[0].lat,
                                lon : osmGeoObject[0].lon
                            };
                            tpMarker = newMarker(center);
                            setView(center);
                        }
                    });
                }
                
            }
        });
    };
    
    self.setFranchazi = function(aFranchaziID) {
        model.listTradePoints.params.franchazi_id = aFranchaziID;
        model.listTradePoints.params.trade_point = null;
        model.listTradePoints.requery();
    };
    
    self.manualShow = function(aContainer) {
        if (!map) {
            self.container = cmn.createElement("div", "map-container", aContainer);
            var zoomControl = L.control.zoom({
                position: 'bottomright'
            });

            var mapCrs = L.CRS.EPSG3857;        
            var mapTilesLayer = new L.TileLayer(
                    "http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png",
                    {
                        "subdomains": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                        "attribution": "Mail.ru",
                        "detectRetina": true
                    }
            );

            mapTilesLayer.vendorUrlPattern = "http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png";

            map = new L.Map(self.container,
            {
                "layers": [
                    mapTilesLayer
                ],
                "crs": mapCrs,
                "zoomControl": false,
                "boxZoom": true
            });

            map.addControl(zoomControl);

            map.addLayer(mapTilesLayer);
            map.fitWorld();
            map.setZoom(3);
            
            invalidate();
            
            map.on('click', function(evt) {
                if (!tpMarker) {
                        tpMarker = newMarker(evt.latlng);
                    } else {
                        //Маркер установлен
                    }
            });
            /*serverUnits.settingsUnit.getMapPosition(function(aPosition) {
                map.setView(L.latLng(aPosition.lat, aPosition.lng), aPosition.zoom);
            });*/
        } else {
            aContainer.append(self.container);
        }
        
        $('#modalForm').on('hidden.bs.modal', saveMarker);
    };
    if (aContainer) self.manualShow(aContainer);
    
    self.showModal = function(aTradePoint) {
        var modal = new cmn.Modal('Расположение торговой точки');
        var modalBody = modal.getModalBody();
        self.manualShow(modalBody);
        modal.show();
        self.setTradePoint(aTradePoint);
    };
}
