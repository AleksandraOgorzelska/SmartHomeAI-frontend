import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AirQualityResponse } from '../interfaces/air-quality-response';
import {WeatherResponse} from '../interfaces/weather-response';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyService {

  constructor(private http: HttpClient) { }

  public getAirQualityIndex(): Promise<AirQualityResponse> {
    return this.http.get<AirQualityResponse>('/api/status/air').toPromise();
  }

  public getWeather(): Promise<WeatherResponse> {
    return this.http.get<WeatherResponse>('/api/status/weather').toPromise();
  }
}
