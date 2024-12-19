import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
declare var google: any;

@Component({
  selector: 'app-googlemap',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss'],
})
export class GooglemapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;

  map!: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING;

  origin: google.maps.LatLng | null = null;
  destination: google.maps.LatLng | null = null;

  routeInfo: string = '';
  markers: google.maps.Marker[] = []; // 用來存放 Marker 的清單

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const location = { lat: 25.0374865, lng: 121.5647688 };

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: location,
      zoom: 16,
      mapTypeId: 'terrain',
    });

    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setPanel(
      document.getElementById('directions-panel')!
    );

    // 監聽地圖點擊事件
    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        this.handleMapClick(event.latLng);
      }
    });
  }

  handleMapClick(latLng: google.maps.LatLng): void {
    if (this.origin && this.destination) {
      // 如果起點和終點都已設定，重置地圖
      this.resetMarkers();
    }

    // 設定起點或終點
    if (!this.origin) {
      this.origin = latLng;
      const marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: '起點',
        label: 'A',
      });
      this.markers.push(marker); // 保存 Marker
    } else if (!this.destination) {
      this.destination = latLng;
      const marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: '終點',
        label: 'B',
      });
      this.markers.push(marker); // 保存 Marker

      // 起點和終點都設定後，規劃路線
      this.calculateAndDisplayRoute();
    }
  }

  calculateAndDisplayRoute(): void {
    if (!this.origin || !this.destination) {
      console.error('起點或終點未設定');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: this.origin,
      destination: this.destination,
      travelMode: this.travelMode,
    };

    this.directionsService.route(
      request,
      (
        result: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          this.directionsRenderer.setDirections(result);
          this.displayRouteInfo(result);
        } else {
          console.error('路徑規劃失敗，錯誤訊息：' + status);
        }
      }
    );
  }

  displayRouteInfo(result: google.maps.DirectionsResult): void {
    const route = result.routes[0];
    const leg = route.legs[0];

    const startAddress = leg.start_address;
    const endAddress = leg.end_address;
    const distance = leg.distance?.text;
    const duration = leg.duration?.text;

    this.routeInfo = `
      <h3>路線資訊</h3>
      <p><strong>起點:</strong> ${startAddress}</p>
      <p><strong>終點:</strong> ${endAddress}</p>
      <p><strong>總距離:</strong> ${distance}</p>
      <p><strong>總時間:</strong> ${duration}</p>
      <p><strong>旅行方式:</strong> ${this.travelMode}</p>
    `;
  }

  resetMarkers(): void {
    // 清除地圖上的 Marker
    this.markers.forEach((marker) => marker.setMap(null));
    this.markers = [];

    // 重置起點和終點
    this.origin = null;
    this.destination = null;

    // 清除 DirectionsRenderer
    this.directionsRenderer.setDirections({ routes: [] });
    this.routeInfo = '';
  }

  // 動態切換交通方式
  setTravelModeD(mode: google.maps.TravelMode): void {
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.calculateAndDisplayRoute(); // 更新路線
  }
  setTravelModeW(mode: google.maps.TravelMode): void {
    this.travelMode = google.maps.TravelMode.WALKING;
    this.calculateAndDisplayRoute(); // 更新路線
  }
  setTravelModeT(mode: google.maps.TravelMode): void {
    this.travelMode = google.maps.TravelMode.TRANSIT;
    this.calculateAndDisplayRoute(); // 更新路線
  }
  setTravelModeB(mode: google.maps.TravelMode): void {
    this.travelMode = google.maps.TravelMode.BICYCLING;
    this.calculateAndDisplayRoute(); // 更新路線
  }
}
