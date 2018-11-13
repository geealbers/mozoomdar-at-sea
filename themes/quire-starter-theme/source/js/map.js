import L from 'leaflet'
import 'leaflet-fullscreen'

class Map {
  constructor() {
    this.el = 'js-map'
    this.tiles = 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
    this.attribution =
      '<a href="http://maps.stamen.com">Map tiles</a> by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="https://creativecommons.org/licenses/by/3.0">CC BY SA</a>'
    this.data = $(`#${this.el}`).data('geojson')
    this.center = this.getCoordinates()
    this.defaultZoom = 4
    this.map = this.createMap()
    this.addTiles()

    if (this.data) {
      this.getData()
    }

    setTimeout(() => {
      this.map.invalidateSize()
    }, 100)

    this.map.on('fullscreenchange', () => {
      this.map.invalidateSize()
    })
  }

  createMap() {
    return L.map(this.el, {
      // add leaflet options here
      fullscreenControl: true
    }).setView(this.center, this.defaultZoom)
  }

  addTiles() {
    L.tileLayer(this.tiles, {
      // options
      attribution: this.attribution
    }).addTo(this.map)
  }

  getCoordinates() {
    let lat = $('#' + this.el).data('lat')
    let long = $('#' + this.el).data('long')
    return [lat, long]
  }

  getData() {
    $.getJSON(this.data, json => {
      L.geoJson(json, {
        // Change the style here as desired
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 5,
            fillColor: '#e06353',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.75
          })
        },
        style: function (feature) {
          return {
            stroke: feature.properties.stroke,
            color: feature.properties.color,
            opacity: feature.properties.opacity,
          }
        },
        // Change styles here as desired
        onEachFeature: (feature, layer) => {
          $(L.circleMarker).mouseover(feature.properties.description, options)
          })
          //let options = { minWidth: 100, maxHeight: 250 }
          //layer.bindPopup(feature.properties.description, options)
        }
      }).addTo(this.map);
      L.circleMarker.on('click', function(leafletEvent) {
        window.location = "../content/journey.farewell-to-kolkata.md"
      });
    })
  }
}

export default Map
