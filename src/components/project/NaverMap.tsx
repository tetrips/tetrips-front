'use client'
import { useProjectStore } from "@/stores/projectStore";
import { useEffect, useRef } from "react";

export default function NaverMap() {
  const { markers } = useProjectStore();
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerInstancesRef = useRef<{ [key: string]: naver.maps.Marker }>({});

  useEffect(() => {
    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(37.3614483, 127.1114883),
      zoom: 12,
      minZoom: 10,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      },
    };

    mapRef.current = new naver.maps.Map('map', mapOptions);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    

    Object.keys(markerInstancesRef.current).forEach(id => {
      if (!markers.find(m => m.id === id)) {
        markerInstancesRef.current[id].setMap(null);
        delete markerInstancesRef.current[id];
      }
    });

    const latLngs: naver.maps.LatLng[] = [];

    markers.forEach((markerData) => {
      const lat = markerData.mapy / 1e7;
      const lng = markerData.mapx / 1e7;
      const latlng = new naver.maps.LatLng(lat, lng);

      let marker = markerInstancesRef.current[markerData.id];

      if (!marker) {
        marker = new naver.maps.Marker({
          position: latlng,
          map: map,
        });

        const infowindow = new naver.maps.InfoWindow({
          content: `<div style="padding:10px;">
                      <p>${markerData.buildingName}</p>
                    </div>`,
        });

        naver.maps.Event.addListener(marker, "click", () => {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, marker);
          }
        });

        markerInstancesRef.current[markerData.id] = marker;
      } else {
        marker.setPosition(latlng);
      }

      latLngs.push(latlng);
    });

    if (latLngs.length > 0) {
      const bounds = new naver.maps.LatLngBounds(latLngs[0], latLngs[0]);
      for (let i = 1; i < latLngs.length; i++) {
        bounds.extend(latLngs[i]);
      }
      map.fitBounds(bounds);
    }
  }, [markers]);

  return (
    <div className="w-full h-full">
      <div id="map" className="h-full w-full" />
    </div>
  );
}