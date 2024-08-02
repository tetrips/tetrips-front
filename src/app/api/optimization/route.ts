import { NextResponse } from 'next/server';
import { Destination } from '@/types/Project'
interface OptimizationRequest {
  startPlace: Destination;
  endPlace: Destination;
  destinations: Destination[];
  date: string;
  dayStartTime: string;
}

interface TmapOptimizationResponse {
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: {
      totalTime: number;
      totalDistance: number;
      pointIndex: number;
      pointCount: number;
      index: number;
      viaPointId: string;
      viaPointName: string;
      viaX: number;
      viaY: number;
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const { startPlace, endPlace, destinations, date, dayStartTime }: OptimizationRequest = await request.json();

    const formattedStartTime = `${date.replace(/-/g, '')}${dayStartTime.replace(':', '')}`;

    const tmapRequest = {
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: startPlace.title,
      startX: (startPlace.mapx / 1e7).toString(),
      startY: (startPlace.mapy / 1e7).toString(),
      startTime: formattedStartTime,
      endName: endPlace.title,
      endX: (endPlace.mapx / 1e7).toString(),
      endY: (endPlace.mapy / 1e7).toString(),
      searchOption: "0",
      viaPoints: destinations.map((dest) => ({
        viaPointId: dest.id,
        viaPointName: dest.title,
        viaX: (dest.mapx / 1e7).toString(),
        viaY: (dest.mapy / 1e7).toString(),
        viaTime: dest.stayDuration ? dest.stayDuration * 60 : 0
      }))
    };

    const searchUrl = 'https://apis.openapi.sk.com/tmap/routes/routeOptimization20';
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'appKey': process.env.APP_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(tmapRequest)
    });

    if (!searchResponse.ok) {
      throw new Error(`Optimization API responded with status: ${searchResponse.status}`);
    }

    const searchData: TmapOptimizationResponse = await searchResponse.json();

    // 중복 제거 및 최적화된 경로 순서대로 장소 리스트 재구성
    const destinationMap = new Map<string, Destination>(
      [startPlace, ...destinations, endPlace].map((dest) => [dest.id, dest])
    );

    const optimizedRoute: Destination[] = [];
    const seenIds = new Set<string>();

    searchData.features
      .filter(feature => feature.properties.viaPointId)
      .forEach(feature => {
        const id = feature.properties.viaPointId;
        if (!seenIds.has(id)) {
          seenIds.add(id);
          const destination = destinationMap.get(id);
          if (destination) {
            optimizedRoute.push(destination);
          }
        }
      });

    return NextResponse.json({
      optimizedRoute,
      rawResponse: searchData
    });
  } catch (error) {
    console.error('Optimize error:', error);
    return NextResponse.json({ error: '경로 최적화 중 오류가 발생했습니다.' }, { status: 500 });
  }
}