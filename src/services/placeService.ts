import { unstable_noStore as noStore } from 'next/cache';
import clientPromise from '@/libs/mongodb';
import { ClientPlace } from '@/types/Place';

async function getCollection(collectionName: string) {
  const client = await clientPromise;
  const db = client.db('travel');
  return db.collection(collectionName);
}
export async function fetchPlaces(query: string) {
  noStore();
  try {
    const placeCollection = await getCollection('places');
    const searchQuery = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { roadAddress: { $regex: query, $options: 'i' } },
          ],
        }
      : {};

    const placesData = await placeCollection.find(searchQuery).toArray();

    const places = placesData.map((place) => ({
      id: place._id.toString(),
      title: place.title,
      roadAddress: place.roadAddress,
      mapx: place.mapx,
      mapy: place.mapy,
      category: place.category,
      link: place.link,
    })) as ClientPlace[];
    return places;
  } catch (error) {
    throw new Error('Failed to fetch places.');
  }
}


