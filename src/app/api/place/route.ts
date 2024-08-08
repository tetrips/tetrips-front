import clientPromise from '@/libs/mongodb';
import { Place } from '@/types/Place';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const client = await clientPromise;
  const db = client.db('travel');
  const placeCollection = await db.collection('places');
  try {
    const data = await request.json();
    const newPlace = {
      _id: data.id,
      title: data.title,
      roadAddress: data.roadAddress,
      category: data.category,
      mapx: data.mapx,
      mapy: data.mapy,
      link: data.link,
    }as Place;
    await placeCollection.insertOne(newPlace);
    return NextResponse.json({ newPlace }, { status: 201 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}