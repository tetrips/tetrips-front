import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {

  try {
    const data = await request.json();


    return NextResponse.json({});
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}