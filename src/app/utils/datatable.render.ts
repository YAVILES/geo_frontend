import { HttpParams } from '@angular/common/http';
import { API } from './api'
import * as moment from 'moment';

export class DataTableRender {
  constructor() {
  }

  static buildQueryParams(source: any): HttpParams {
    let target: HttpParams = new HttpParams();
    if (source.columns) {
      source.columns.forEach((element: any) => {
        target = target.append(
          `${element.data}`,
          `${element.search.value}`
        );
      });
    }
    Object.keys(source).forEach((key: string) => {
      const value: any = source[key];
      if (typeof value !== 'undefined' && value !== null) {
        if (typeof value === 'object') {
          if (key === 'search') {
            Object.keys(value).forEach((currentKey, index: number) => {
              target = target.append(
                `${key}[${currentKey}]`,
                value[currentKey]
              );
            });
          } else {
            value.forEach((element: any, index: number) => {
              if (element.hasOwnProperty('data') && !element.data) {
                return;
              }
              Object.keys(element).forEach(currentKey => {
                if (currentKey === 'search') {
                  Object.keys(element[currentKey]).forEach(currentSearchKey => {
                    target = target.append(
                      `${key}[${index}][${currentKey}][${currentSearchKey}]`,
                      element[currentKey][currentSearchKey]
                    );
                  });
                } else {
                  target = target.append(
                    `${key}[${index}][${currentKey}]`,
                    element[currentKey]
                  );
                }
              });
            });
          }
        } else {
          target = target.append(key, value.toString());
        }
      }
    });
    return target;
  }

  conLink(data: string, direccion: any, data_url?: string | number) {
    if (data_url) {
      return `<a href="${direccion}${data_url}">${data}</a>`;
    } else {
      return `<a href="${direccion}${data}">${data}</a>`;
    }
  }

  isActivo(data: number) {
    return data === 1 ? 'Activo' : 'Desactivado';
  }

  isNull(data: string) {
    return data === null || data === undefined ? '' : data;
  }

  siNo(data: number | boolean) {
    return data === 1 || data === true ? 'SI' : 'NO';
  }

  descripcionDesdeURL(url: string) {
    // tslint:disable-next-line: variable-name
    let _url: any = url;
    let descripcion = '';
    _url = _url.replace('#!/', '').split('/');

    for (let i = 0; i < _url.length; i++) {
      descripcion += _url[i] + (_url.length - 1 > i ? ' > ' : '');
    }

    descripcion = descripcion.replace('_', ' ').replace('-', ' ');

    return descripcion;
  }

}