import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
declare var google: any; // 讓 TypeScript 認識 google 物件
@Component({
  selector: 'app-googlemap',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss'],
})
export class GooglemapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef; // 引用 HTML 元素

  map!: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  travelMode: google.maps.TravelMode = google.maps.TravelMode.WALKING; // 預設旅行方式
  routeInfo: string = ''; // 用來顯示路線資訊

  google: any;
  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const location = { lat: 25.0374865, lng: 121.5647688 }; // 預設地點

    // 建立地圖
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: location,
      zoom: 16,
      mapTypeId: 'terrain', // 地圖類型
    });

    // 將 DirectionsRenderer 綁定到地圖和路線面板
    this.directionsRenderer.setMap(this.map);
    this.directionsRenderer.setPanel(
      document.getElementById('directions-panel')!
    );

    // 放置 Marker
    new google.maps.Marker({
      position: location,
      map: this.map,
      title: '台北市政府親子劇場', // Marker 標題
    });

    // 路徑規劃
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute(): void {
    const request: google.maps.DirectionsRequest = {
      origin: { lat: 22.98279038768174, lng: 120.16015566419003 }, // 起點
      destination: { lat: 23.156647663552032, lng: 120.30294936261154 }, // 終點
      travelMode: this.travelMode, // 旅行方式：如開車、步行等
      provideRouteAlternatives: true,
    };
    console.log(this.travelMode);

    // 呼叫 DirectionsService 並顯示路徑
    this.directionsService.route(
      request,
      (
        result: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          // 確保 result 不為 null
          this.directionsRenderer.setDirections(result);
          console.log(status);

          console.log(result);

          // 顯示路線資訊
          this.displayRouteInfo(result);
        } else {
          console.error('路徑規劃失敗，錯誤訊息：' + status);
        }
      }
    );
  }

  // 顯示起點、終點、時間和旅行方式
  displayRouteInfo(result: google.maps.DirectionsResult): void {
    const route = result.routes[0];
    const leg = route.legs[0]; // 只有一條路線時取第一個 leg

    // 提取相關資訊
    const startAddress = leg.start_address;
    const endAddress = leg.end_address;
    const distance = leg.distance?.text;
    const duration = leg.duration?.text;

    // 顯示資訊
    this.routeInfo = `
      <h3>路線資訊</h3>
      <p><strong>起點:</strong> ${startAddress}</p>
      <p><strong>終點:</strong> ${endAddress}</p>
      <p><strong>總距離:</strong> ${distance}</p>
      <p><strong>總時間:</strong> ${duration}</p>
      <p><strong>旅行方式:</strong> ${this.travelMode}</p>
    `;
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
