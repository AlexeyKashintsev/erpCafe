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
    
    self.setTradePoint = function(aTradePoint) {
        model.listTradePoints.params.franchazi_id = null;
        model.listTradePoints.params.trade_point = aTradePoint;
        model.listTradePoints.requery(function() {
            
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
                        "attribution": "Powered by 4R. Вендор подложки: Карты@Mail.Ru",
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
            
          //  if (!!model.listTradePoints.params.trade_point) {
                L.easyButton('fa-map-marker', 
                    function () {
                        alert(tpMarker.getLatLng());
                    },
                    'Установить маркер',
                    map
                );
           // }
            
            setTimeout(function() {
                map.invalidateSize(true);
            }, 500);
            
            map.on('click', function(evt) {
                if (!tpMarker) {
                        tpMarker = L.marker(evt.latlng,
                                    {
                                        icon        :   new L.Icon.Default(),
                                        draggable   :   true
                                    });
                        tpMarker.addTo(map);
                    } else {
                        //Маркер утановлен
                    }
            });
            /*serverUnits.settingsUnit.getMapPosition(function(aPosition) {
                map.setView(L.latLng(aPosition.lat, aPosition.lng), aPosition.zoom);
            });*/
        } else {
            aContainer.append(self.container);
        }
    };
    if (aContainer) self.manualShow(aContainer);
    
    self.showModal = function() {
        var modal = new cmn.Modal('Расположение торговой точки');
        var modalBody = modal.getModalBody();
        self.manualShow(modalBody);
        modal.show();
    };
}
