import clientPromise from '@/libs/mongodb';
import { Project, Itinerary, Guest } from '@/types/Project';
import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { convertToKoreanDate } from '@/utils/formatTime';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {

  const client = await clientPromise;
  const db = client.db('travel');
  const projectCollection = db.collection('projects');

  try {
    const data = await request.json();
    const createdAt = convertToKoreanDate(new Date());
    const startDate = convertToKoreanDate(new Date(data.startDate));
    const endDate = convertToKoreanDate(new Date(data.endDate));
    const startDateUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
    const endDateUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    // const usernameData = cookies().get('username');
    // if (!usernameData) {
    //   return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    // }
    // const username = usernameData.value;
    // const extractedNickname = username.split('@')[0];
    const test = 'test1@naver.com';
    const extractedtest = test.split('@')[0];
    const itineraries: Itinerary[] = [];

    let currentDate = new Date(startDateUTC);
    while (currentDate <= endDateUTC) {
      itineraries.push({
        itineraryId: new ObjectId().toString(),
        date: currentDate.toISOString().split('T')[0],
        dayStartTime: '10:00',
        startPlace: undefined,
        endPlace: undefined,
        destinations: []
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    const guests: Guest[] = [{
      email: test,
      nickname: extractedtest,
      img: 'user1.jpg' || ''
    }];
    const newProject: Project = {
      _id: new ObjectId(),
      title: data.title,
      creator: test,
      startDate: startDateUTC,
      endDate: endDateUTC,
      createdAt: createdAt,
      guests: guests,
      itineraries: itineraries,
    };

    const result = await projectCollection.insertOne(newProject);
    const projectId = result.insertedId;
    const redirectUrl = `/project/${projectId}`;
    
    return NextResponse.json(
      { newProject, redirectUrl },
      { 
        status: 201,
        headers: {
          'Location': redirectUrl
        }
      }
    );
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: '프로젝트 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
