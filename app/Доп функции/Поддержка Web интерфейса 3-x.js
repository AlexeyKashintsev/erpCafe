/**
 * 
 * @author mg
 * @name WebClientsSupport
 * @public
 * @stateless
 */

function WebClientsSupport() {
    var self = this, model = this.model;
    model.dsDeviceOwner.manual = true;
    model.dsEquipmentByParent.manual = true;
    /**
     * 
     * @returns {Array}
     * @rolesAllowed tilesSelector
     */
    self.supportedTilesVendors = function() {
        var titlePrefix = "Powered by Corvus. Вендор подложки:";
        return [
            {
                vendorPrefix: titlePrefix,
                vendorTitle: "Open Street Map",
                vendorUrlPattern: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                subdomains: ["a", "b", "c"],
                minZoom: 2,
                maxZoom: 17
            },
            {
                vendorPrefix: titlePrefix,
                vendorTitle: "Google Maps",
                vendorUrlPattern: "https://mts{s}.google.com/vt/lyrs=m@223000000&hl=ru&src=app&x={x}&s=&y={y}&z={z}",
                subdomains: ["0", "1", "2", "3"],
                minZoom: 2,
                maxZoom: 17
            },
            {
                vendorPrefix: titlePrefix,
                vendorTitle: "Карты@Mail.Ru",
                vendorUrlPattern: "http://t{s}maps.mail.ru/tiles/scheme/{z}/{y}/{x}.png",
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                minZoom: 2,
                maxZoom: 13
            },
            {
                vendorPrefix: titlePrefix,
                vendorTitle: "2Гис",
                vendorUrlPattern: "http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}",
                subdomains: ["0", "1", "2", "3"],
                minZoom: 2,
                maxZoom: 18
            }
        ];
    };
    this.pushPacket = function() {
        if (self.http) {
            var body = self.http.request.body;
            var data = JSON.parse(body ? body : "null");
            // only for tests
            if (data == null || data == "") {
                data = {imei: 869158001755590, time: (new Date()).getTime(), lontitude: 57.10055, latitude: 40.994617};
                body = JSON.stringify(data);
            }
            if (data) {
                var pusher = com.eas.server.websocket.TaggedFeedEndPoint;
                if (!data.imei)
                    throw "Missing imei while push";
                if (!data.time)
                    throw "Missing time while push";
                pusher.broadcast(data.imei, body);
            }
        }
    };
    this.pushEvent = function() {
        if (self.http) {
            var body = self.http.request.body;
            var data = JSON.parse(body ? body : "null");
            if (data && data.eventType && data.deviceId) {
                var eventUtils = Modules.get("EventUtils");
                var canNotify = false;
                if (eventUtils.isSOSevent(data.eventType)) {
                    canNotify = true;
                } else {
                    var servicesChecker = Modules.get("ServiceCheckingModule");
                    model.dsDeviceOwner.params.parDevice = data.deviceId;
                    model.dsDeviceOwner.params.parTA = new Date();
                    model.dsDeviceOwner.requery();
                    if (!model.dsDeviceOwner.empty) {
                        canNotify = servicesChecker.isUserInRole(model.dsDeviceOwner.cursor.usr_name, "eventListener");
                    }
                }
                if (canNotify) {
                    if (data.phone || data.email) {
                        var notificator = Modules.get("MessageSender");
                        var parkUnit = Modules.get("VehicleUtils");
                        var eventName = data.eventname;
                        var point = data.location; //??????
                        model.dsEquipmentByParent.params.date = new Date();
                        model.dsEquipmentByParent.params.aEqu = data.deviceId;
                        model.dsEquipmentByParent.requery();
                        var Msg = eventName + " " +
                                (model.dsEquipmentByParent.cursor ? parkUnit.assembleEquDescriptionWithGosReg(model.dsEquipmentByParent.cursor) : "<Неизвестно>") +
                                "http://openstreetmap.ru/#mmap=17/" + point.y + "/" + point.x;
//                    geoCoding.getGeoObject4Coordinates(point.x, point.y, function(aTextView) { Возможно добавить разименованное местоположение (город улица ...)
//                        self.lblLocation.text = "<html>" + aTextView.replace(/,/g, "<br>") + "<br>" + latLngAnchorText;
//                    });
                        if (data.phone) {
                            var phones = data.phone.split(" ");
                            for (var i = 0; i < phones.length; i++) {
                                //notificator.sendSMS(Msg, phones[i]); времмено тк пока живем без смс
                            }
                        }
                        if (data.email) {
                            var emails = data.email.split(" ");
                            for (var i = 0; i < emails.length; i++) {
                                notificator.sendMail(eventName, Msg, emails[i]);
                            }
                        }
                        var pusher = com.eas.server.websocket.TaggedFeedEndPoint;
                        pusher.broadcast(data.deviceId, body);
                    }
                }
            } else {
                throw "Missing eventType while push";
            }
        }
    };
}