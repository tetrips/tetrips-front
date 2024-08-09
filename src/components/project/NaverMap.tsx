'use client'

import { useYjs } from "@/hooks/useYjs";
import { ClientProject } from "@/types/Project";
import { useEffect, useRef } from "react";

export default function NaverMap({project}: {project: ClientProject}) {
  const { markers } = useYjs({project});
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

    markers.forEach((markerData, index) => {
      const lat = markerData.mapy / 1e7 + index * 0.00001;
      const lng = markerData.mapx / 1e7 + index * 0.00001;
      const latlng = new naver.maps.LatLng(lat, lng);

      let marker = markerInstancesRef.current[markerData.id];

      if (!marker) {
        const markerIcon = {
          content: `
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 16 40 16 40C16 40 32 24.836 32 16C32 7.164 24.836 0 16 0Z" fill="#06B6D4"/>
              <text x="16" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${index + 1}</text>
            </svg>
          `,
          size: new naver.maps.Size(32, 40),
          anchor: new naver.maps.Point(16, 40),
        };
    
        marker = new naver.maps.Marker({
          position: latlng,
          map: map,
          icon: markerIcon,
        });

        const infowindow = new naver.maps.InfoWindow({
          content: `
            <div style="padding: 15px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); max-width: 300px;">
              <h3 style="margin: 0 0 10px; color: #3F51B5; font-size: 16px; font-weight: bold;">${markerData.buildingName}</h3>
              <p style="margin: 5px 0; font-size: 14px;"><strong>주소:</strong> ${markerData.roadAddress}</p>
              ${markerData.category ? `<p style="margin: 5px 0; font-size: 14px;"><strong>유형:</strong> ${markerData.category}</p>` : ''}
              ${markerData.link ? `
                <a href="${markerData.link}" target="_blank" style="display: inline-block; margin-top: 5px; padding: 5px 5px; color: #94D9DA; text-decoration: none; border-radius: 4px;">${markerData.link}</a>
              ` : ''}
            </div>
          `,
          backgroundColor: "transparent",
          borderColor: "transparent",
          disableAnchor: true,
          pixelOffset: new naver.maps.Point(0, -10)
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
        marker.setIcon({
          content: `
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 16 40 16 40C16 40 32 24.836 32 16C32 7.164 24.836 0 16 0Z" fill="#06B6D4"/>
              <text x="16" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${index + 1}</text>
            </svg>
          `,
          size: new naver.maps.Size(32, 40),
          anchor: new naver.maps.Point(16, 40),
        });
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