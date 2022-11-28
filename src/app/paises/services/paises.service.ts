import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';
@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
  private _BASE_URL: string = 'https://restcountries.com/v2'
  public get regiones(): string[] {
    return [...this._regiones]
  }
  constructor(private http: HttpClient) { }
  getCountryByRegion(region: string): Observable<PaisSmall[]> {
    const url: string = `${this._BASE_URL}/region/${region}?fields=name,alpha3Code`
    return this.http.get<PaisSmall[]>(url)
  }
  getCountryByCode(code: string): Observable<Pais | null> {
    if (!code) return of(null)
    const url = `${this._BASE_URL}/alpha/${code}`
    return this.http.get<Pais>(url)
  }
  getCountryByCodeSmall(code: string): Observable<PaisSmall> {
    const url = `${this._BASE_URL}/alpha/${code}?fields=name,alpha3Code`
    return this.http.get<PaisSmall>(url)
  }
  getCountriesByCodes(borders: string[]): Observable<PaisSmall[]> {
    if (borders.length === 0) return of([])
    const peticiones: Observable<PaisSmall>[] = []
    borders.forEach(border => {
      const peticion = this.getCountryByCodeSmall(border)
      peticiones.push(peticion)
    });
    return combineLatest(peticiones)
  }
}