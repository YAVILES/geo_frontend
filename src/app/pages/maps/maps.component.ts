import { Component, OnInit, AfterViewInit } from '@angular/core';
// Google Maps
//declare const google: any;
import * as L from 'leaflet';
import { MarkerService } from './services/marker.service';
import { ShapeService } from './services/shape.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  private mapboxAttribution = "Yonathan Aviles";
  private mapboxUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


  private map;
  private states;
  constructor(private markerService: MarkerService, private shapeService: ShapeService) { }

  ngOnInit() {
  }

  private initMap(): void {
    let grayscale = L.tileLayer(this.mapboxUrl, { id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: this.mapboxAttribution });
    let streets = L.tileLayer(this.mapboxUrl, { id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: this.mapboxAttribution });
    let maker_draggable = L.marker([10.180121916071537, -67.99253003067679], { draggable: true }).bindPopup('This is Littleton, CO.');
    maker_draggable.on('dragend', (e) => {
      console.log(e);
    });
    let cities = L.layerGroup([
      maker_draggable,
      L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
      L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
      L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.')
    ]);

    this.map = L.map('map', {
      center: [10.176216, -67.995865],
      zoom: 12,
      layers: [grayscale, cities]
    });

    this.map.on('click', (e) => {
      let popupGlobal = L.popup();
      popupGlobal.setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
    });


    this.map.on('locationfound', (e) => {
      let radius = e.accuracy;

      L.marker(e.latlng).addTo(this.map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

      L.circle(e.latlng, radius).addTo(this.map);
    });

    this.map.on('locationerror', (e) => {
      alert(e.message);
    });

    let baseMaps = {
      "<span style='color: gray'>Grayscale</span>": grayscale,
      "Streets": streets
    };

    let overlayMaps = {
      "Cities": cities
    };
    L.control.layers(baseMaps, overlayMaps).addTo(this.map);
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
        })
      )
    });
    this.map.addLayer(stateLayer);
    stateLayer.bringToBack();
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeMarkers(this.map);
    //this.markerService.makeCircleMarkers(this.map);
    /*   this.shapeService.getStateShapes().subscribe(states => {
         this.states = states;
         this.initStatesLayer();
       }); */
  }

  private highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042'
    });
  }

  private resetFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }

}
