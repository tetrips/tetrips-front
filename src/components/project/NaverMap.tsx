'use client'
import { useYjs } from "@/hooks/useYjs";
import { useTabStore } from "@/stores/tabStore";
import { ClientProject } from "@/types/Project";
import { useEffect, useRef, useMemo } from "react";

export default function NaverMap({ project }: { project: ClientProject }) {
  const { markers } = useYjs({ project });
  const { selectedItineraryId } = useTabStore();
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markerInstancesRef = useRef<{ [key: string]: naver.maps.Marker }>({});
  const polylineRef = useRef<naver.maps.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const filteredMarkers = useMemo(() => {
    if (!selectedItineraryId && markers.length > 0) {
      const firstItineraryId = markers[0].id.split('-')[0];
      return markers.filter(marker => marker.id.startsWith(firstItineraryId));
    }
    return selectedItineraryId ? markers.filter(marker => marker.id.startsWith(selectedItineraryId)) : [];
  }, [markers, selectedItineraryId]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
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

    mapRef.current = new naver.maps.Map(mapContainerRef.current, mapOptions);

    if (mapContainerRef.current) {
      mapContainerRef.current.style.zIndex = '1';
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    Object.values(markerInstancesRef.current).forEach(marker => {
      marker.setMap(null);
    });
    markerInstancesRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const latLngs: naver.maps.LatLng[] = [];

    filteredMarkers.forEach((markerData, index) => {
      const lat = markerData.mapy / 1e7;
      const lng = markerData.mapx / 1e7;
      const latlng = new naver.maps.LatLng(lat, lng);

      let fillColor = '#06B6D4';
      let textColor = 'white';
      let text = `${markerData.dayIndex}`;

      if (markerData.id.includes('-start-')) {
        fillColor = '#10b981';
        text = 'S';
      } else if (markerData.id.includes('-end-')) {
        fillColor = '#fb7185';
        text = 'E';
      }

      const markerIcon = {
        content: `
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 16 40 16 40C16 40 32 24.836 32 16C32 7.164 24.836 0 16 0Z" fill="${fillColor}"/>
          <text x="16" y="18" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${text}</text>
        </svg>
        `,
        size: new naver.maps.Size(32, 40),
        anchor: new naver.maps.Point(16, 40),
      };
  
      const marker = new naver.maps.Marker({
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
      latLngs.push(latlng);
    });

    if (latLngs.length > 1) {
      polylineRef.current = new naver.maps.Polyline({
        path: latLngs,
        strokeColor: '#06B6D4',
        strokeOpacity: 0.8,
        strokeWeight: 1.5,
        strokeStyle: 'solid',
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        map: map
      });
    }

    if (latLngs.length > 0) {
      const bounds = new naver.maps.LatLngBounds(latLngs[0], latLngs[0]);
      for (let i = 1; i < latLngs.length; i++) {
        bounds.extend(latLngs[i]);
      }
      map.fitBounds(bounds);
    }
  }, [filteredMarkers]);

  return (
    <div className="w-full h-full">
      <div id="map" ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}