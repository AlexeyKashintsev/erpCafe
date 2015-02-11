/**
 * @name GeoCodingUtils
 * @stateless
 * @public
 */

function GeoCodingUtils() {


    var self = this;


    /**
     * Геокодирование.js
     *
     * Created on 20.04.2012, 10:42:56
     * 
     * Формат ГеоОбъекта: {addressCollection:{
     *                     count:1,
     *                     objects: [{
     *                         geoObject:{
     *                             textAddress: "Россия, Москва, улица Новый Арбат, 24",
     *                             topCorner.lat: "37.591701 55.755409", (\d*\.\d{3})\d*
     *                             topCorner.lon: "37.591701 55.755409",
     *                             downCorner.lat: "37.583490 55.750778",
     *                             downCorner.lon: "37.583490 55.750778",
     *                             point.lat: "37.587596 55.753093",
     *                             point.lon: "37.587596 55.753093"
     *                         }
     *                     },
     *                     {
     *                         geoObject:{
     *                             textAddress: "Россия, Москва, улица Новый Арбат, 24",
     *                             topCorner: "37.591701 55.755409",
     *                             downCorner: "37.583490 55.750778",
     *                             point: "37.587596 55.753093"
     *                         }
     *                     }     
     *                     ]
     *                      
     * }
     * }
     * 
     */

    /**
     *
     * @author AB
     */

    var yaKey = "ANpUFEkBAAAAf7jmJwMAHGZHrcKNDsbEqEVjEUtCmufxQMwAAAAAAAAAAAAvVrubVT4btztbduoIgTLAeFILaQ==";
 //Безлимитный сервис http://open.mapquestapi.com/nominatim/
    var urlYandex = "http://geocode-maps.yandex.ru/1.x/?format=json&geocode={0}&key={1}";
    var urlOSM = "http://nominatim.openstreetmap.org/search/{0}?format=json&polygon=1&addressdetails=1";
    var urlOSMReverse = "http://nominatim.openstreetmap.org/reverse?format=json&accept-language=ru&lat={0}&lon={1}&zoom=18&addressdetails=1";

    var utils = new StringUtils();

    function constructOSMAddress(aAddress) {
        var result = aAddress.road ? aAddress.road/*.replace(/улица/, "ул.")*/ + " " : "";
        result += aAddress.house_number ? "д." + aAddress.house_number : "";
        result += result ? ", " : "";
        result += aAddress.city ? aAddress.city : aAddress.town ? aAddress.town : aAddress.village ? aAddress.village : aAddress.state ? aAddress.state : aAddress.country ? aAddress.country : "";
        return result;
    }
    /**
     *  Создать геообъект из данных, полученных с внутреннего сервера.
     */
  /*  function constructInternalGeoObjectFromBase(adressId) {
        self.model.dsFullAddress.params.address.value = adressId;
        self.model.dsFullAddress.execute();
        if (self.model.dsFullAddress.empty) {
            var internalGeoObject = new Object();
            internalGeoObject.count = 1;
            var geoObjects = new Array();
            var geoObject = new Object();
            geoObject.textAddress = "";
            self.model.dsFullAddress.beforeFirst();
            while (self.model.dsFullAddress.next()) {
                geoObject.textAddress += self.model.dsFullAddress.cursor.typename + " " + self.model.dsFullAddress.cursor.name;
                if (!self.model.dsFullAddress.eof()) {
                    geoObject.textAddress += ", ";
                } else {
                    geoObject.point = {
                        lat: self.model.dsFullAddress.cursor.latitude,
                        lon: self.model.dsFullAddress.cursor.longtitude
                    };
                }
            }
            internalGeoObject.objects = geoObjects;
            geoObjects.push(geoObject);
            return internalGeoObject;
        } else {
            return null;
        }
    }*/

    /**
     *  Получить координаты объекта по его имени(yandex).
     */
    function getCoordinatesFromYandex(objName, key, aCallBack) {
        key = key ? key : yaKey;
        var address = encodeURIComponent(objName);
        var link = utils.format(urlYandex, [address, key]);
        Resource.loadText(link, function(aJSONText) {
            var yaGeoObject = JSON.parse(aJSONText);
            if (aCallBack) {
                if (yaGeoObject && yaGeoObject.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found != 0) {
                    var point = yaGeoObject.response.GeoObjectCollection.featureMember[0].GeoObject.Point;
                    if (point) {
                        var coordinats = point.Point.split(" ");
                        aCallBack(new Point(coordinats[1], coordinats[0]));
                    }
                } else {
                    //TO DO Add new geocode service.
                }
            }
        });
    }

    /**
     *  Получить координаты объекта по его имени(OpenStreetMap).
     */
    function getCoordinatesFromOSM(objName, aCallBack) {
        var address = encodeURIComponent(objName);
        var link = utils.format(urlOSM, [address]);
        Resource.loadText(link, function(aJSONText) {
            var osmGeoObject = JSON.parse(aJSONText);
            if (aCallBack) {
                if (osmGeoObject && osmGeoObject.length > 0) {
                    aCallBack({lat:osmGeoObject[0].lat, lng:osmGeoObject[0].lon, address:constructOSMAddress(osmGeoObject[0].address)});
                } else
                    getCoordinatesFromYandex(objName, yaKey, aCallBack);
            }
            return {lat:osmGeoObject[0].lat, lng:osmGeoObject[0].lon, address:constructOSMAddress(osmGeoObject[0].address)};
        });
    }

    /**
     *  Получить имя объекта по его координатам (yandex).
     */
    function getAddressFromYandex(lat, lon, key, aCallBack) {
        key = key ? key : yaKey;
        var point = lon + "," + lat;
        var link = utils.format(urlYandex, [point, key]);
        var result = "Неизвестно";
        Resource.loadText(link, function(aJSONText) {
            var yaGeoObject = JSON.parse(aJSONText);
            if (yaGeoObject && yaGeoObject.response.GeoObjectCollection.metaDataProperty.GeocoderResponseMetaData.found != 0) {
                var fullDescription = yaGeoObject.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.AddressDetails.Country;
                if (fullDescription) {
                    result = fullDescription.Locality.Thoroughfare ? fullDescription.Locality.Thoroughfare.ThoroughfareName.replace(/улица/, "ул.") + "," : "";
                    result += (fullDescription.Locality.Thoroughfare && fullDescription.Locality.Thoroughfare.Premise) ? "д." + fullDescription.Locality.Thoroughfare.Premise.PremiseNumber + "," : "";
                    result += fullDescription.Locality ? fullDescription.Locality.LocalityName : fullDescription.CountryName;
                }

            } else {
                // TO DO Add new reverse geocode service.
            }
            if (aCallBack) {
                aCallBack(result);
            }
        });
        return result;
    }

    /**
     *  Получить имя объекта по его координатам (OpenStreetMap).
     */
    function getAddressFromOSM(lat, lon, aCallBack) {
        var link = utils.format(urlOSMReverse, [lat, lon]);
        var result = "Неизвестно";
        Resource.loadText(link, function(aJSONText) {
            var osmGeoObject = JSON.parse(aJSONText);
            if (osmGeoObject && osmGeoObject.address) {
                result = constructOSMAddress(osmGeoObject.address);
            } else {
                result = getAddressFromYandex(lat, lon, yaKey, aCallBack);
            }
            if (aCallBack) {
                aCallBack(result);
            }
        });
        return result;
    }

    /**
     * Получение координат объекта по его имени.
     * @param {type} objName
     * @param {type} aCallBack
     * @returns {undefined}
     */
    self.getCoordinates4GeoObject = function(objName, aCallBack) {
        return getCoordinatesFromOSM(objName, aCallBack);
    };

    /**
     * Получение наименования объекта по его координатам.
     * @param {type} lat
     * @param {type} lon
     * @param {type} aCallBack
     * @returns {undefined}
     */
    self.getGeoObject4Coordinates = function(lat, lon, aCallBack) {
        return getAddressFromOSM(lat, lon, aCallBack);
    };


}