import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../utils/api';
import * as L from 'leaflet';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class MarkerService extends API<any> {
  protected URL = `${this.URL_API}/client/client/`;

  constructor(protected http: HttpClient, private popupService: PopupService) {
    super(http);
  }

  static scaledRadius(val: number, maxVal: number): number {
    return 20 * (val / maxVal);
  }

  makeMarkers(map: L.Map): void {

    this.http.get(`${this.URL_API}/security/user/`, { params: { query: '{point, name}', not_paginator: true } }).subscribe((users_points: any) => {
      for (const user of users_points) {
        const lon = user.point.longitude;
        const lat = user.point.latitude;
        const marker = L.marker([lat, lon]);
        marker.bindPopup(this.popupService.makeCapitalPopup(user));
        marker.addTo(map);
      }
    });
  }

  makeCircleMarkers(map: L.Map): void {
    this.http.get(`${this.URL_API}/security/user/`, { params: { query: '{point, name}', not_paginator: true } }).subscribe((users_points: any) => {
      // const maxPop = Math.max(...res.features.map(x => x.properties.population), 0);
      const maxPop = users_points.length
      for (const user of users_points) {
        const lon = user.point.longitude;
        const lat = user.point.latitude;
        /*const circle = L.circleMarker([lat, lon], { color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,}).addTo(map);
        // Definir el radio del circulo
        const circle = L.circleMarker([lat, lon], { 
          radius: 20,     
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5, }).addTo(map);
        */
        // Definir la escala del circulo dependiendo de la población
        const circle = L.circleMarker([lat, lon], {
          radius: MarkerService.scaledRadius(users_points.length, maxPop),
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
        });

        circle.bindPopup(this.popupService.makeCapitalPopup(user));

        circle.addTo(map);
      }
    });
  }
}
