import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../services/account.service';
import { AirQualityResponse } from '../interfaces/air-quality-response';
import { ThirdPartyService } from '../services/third-party.service';
import { WeatherResponse } from '../interfaces/weather-response';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('fullpageRef') fp_directive: ElementRef;
  private fullpage_api: any;
  private config: any;
  private airQuality: AirQualityResponse;
  private currentWeather: WeatherResponse;

  constructor(private accountService: AccountService,
              private thirdPartyService: ThirdPartyService) {
    this.config = {
      licenseKey: null,
      anchors: ['main', 'add-device', 'show-devices', 'control-device'],
      menu: '#menu',
      controlArrows: true,
      loopHorizontal: false,
      dragAndMove: true,
      navigation: true,
    };
  }

  getRef(fullPageRef) {
    this.fullpage_api = fullPageRef;
  }

  ngOnInit() {
    if (!localStorage.getItem('access_token')) {
      document.getElementsByClassName('mat-sidenav-content').item(0)
        .setAttribute('style', 'overflow: hidden;');
    } else {
      this.thirdPartyService.getAirQualityIndex().then(q => {
        this.airQuality = q;
        if (this.airQuality.aqi < 50) {
          this.airQuality.color = 'rgba(0, 153, 102,.95)';
          this.airQuality.text = 'good';
        } else if (this.airQuality.aqi < 100) {
          this.airQuality.color = 'rgba(255, 222, 51, .95)';
          this.airQuality.text = 'moderate';
        } else if (this.airQuality.aqi < 150) {
          this.airQuality.color = 'rgba(255, 153, 51, .95)';
          this.airQuality.text = 'unhealthy for sensitive groups';
        } else if (this.airQuality.aqi < 200) {
          this.airQuality.color = 'rgba(204, 0, 51, .95)';
          this.airQuality.text = 'unhealthy';
        } else if (this.airQuality.aqi < 300) {
          this.airQuality.color = 'rgba(102, 0, 153, .95)';
          this.airQuality.text = 'very unhealthy';
        } else {
          this.airQuality.color = 'rgba(126, 0, 35, .95)';
          this.airQuality.text = 'hazardous';
        }
      }, err => {
        document.getElementsByClassName('mat-sidenav-content').item(0)
          .setAttribute('style', 'overflow: hidden;');
      });
      this.thirdPartyService.getWeather().then(weather => {
        this.currentWeather = weather;
      });
    }
  }

  ngOnDestroy(): void {
    document.getElementsByClassName('mat-sidenav-content').item(0)
      .setAttribute('style', 'overflow: auto;');
  }

}
