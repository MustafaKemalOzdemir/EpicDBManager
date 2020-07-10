/*
"http://www.mapquestapi.com/directions/v2/route?key=0CicTOKa32WGJ0abIf33j0GY3yGb7TF6"

*/
const fetch = require('node-fetch');
var containerList = [{
        id: 0,
        lat: -15.770963,
        lng: -47.8885022
    },
    {
        id: 1,
        lat: -15.759711,
        lng: -47.8807123
    },
    {
        id: 2,
        lat: -15.755850,
        lng: -47.8841224
    },
    {
        id: 3,
        lat: -15.741696,
        lng: -47.8927705
    },
    {
        id: 4,
        lat: -15.752528,
        lng: -47.9287056
    },
    {
        id: 5,
        lat: -15.716746,
        lng: -47.8833267
    },
    {
        id: 6,
        lat: -15.716918,
        lng: -47.8808438
    },
    {
        id: 7,
        lat: -15.720775,
        lng: -47.8833509
    },
    {
        id: 8,
        lat: -15.733281,
        lng: -47.8649061
    },
    {
        id: 9,
        lat: -15.744001,
        lng: -47.850570
    },
    {
        id: 10,
        lat: -15.750803,
        lng: -47.840663
    },
    {
        id: 11,
        lat: -15.748769,
        lng: -47.840684
    },
    {
        id: 12,
        lat: -15.746621,
        lng: -47.840705
    },
    {
        id: 13,
        lat: -15.745196,
        lng: -47.844396
    },
    {
        id: 14,
        lat: -15.741406,
        lng: -47.852303
    }
]


updateContainerData();

async function updateContainerData() {
    for (var i = 0; i < containerList.length; i++) {
        for (var k = 0; k < containerList.length; k++) {
            if (k === i) {
                continue;
            }
            var distance = await makeCall(containerList[i].lat, containerList[i].lng, containerList[k].lat, containerList[k].lng);
            console.log(i + '-' + k + ' -> ' + distance);
            await register2db(containerList[i], containerList[k], distance);
        }
    }
}

async function register2db(source, destination, distance) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            containerId: source.id,
            nextContainerId: destination.id,
            nextLatitude: destination.lat,
            nextLongitude: destination.lng,
            distanceShortest: distance
        })
    }
    const response = await fetch('http://localhost:1502/distance/updateDistance', options);
    var data = await response.json();
    console.log(data);
}

async function addContainer(object) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            containerId: object.id,
            latitude: object.lat,
            longitude: object.lng,
            fullness: 0
        })
    }
    const response = await fetch('http://localhost:1502/container/addContainer', options);
    var data = await response.json();
    console.log(data);
}



//makeCall(-15.770963, -47.8885022, -15.741406, -47.852303);

async function makeCall(sLat, sLon, dLat, dLon) {
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(getCallBody(sLat, sLon, dLat, dLon))
    }
    const response = await fetch('http://www.mapquestapi.com/directions/v2/routematrix?key=0CicTOKa32WGJ0abIf33j0GY3yGb7TF6', options);
    const data = await response.json();
    return data.distance[1] * 1.609;
}


function getCallBody(sLat, sLon, dLat, dLon) {
    return {
        locations: [{
                latLng: {
                    lat: sLat,
                    lng: sLon
                }
            },
            {
                latLng: {
                    lat: dLat,
                    lng: dLon
                }
            }
        ],
        options: {
            avoids: [],
            avoidTimedConditions: false,
            doReverseGeocode: true,
            shapeFormat: 'raw',
            generalize: 0,
            routeType: 'shortest',
            timeType: 1,
            locale: 'en_US',
            unit: 'km',
            enhancedNarrative: false,
            drivingStyle: 2,
            highwayEfficiency: 21.0
        }
    }
}