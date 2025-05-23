import Map from '../utils/map';

export async function storyMapper(story) {
  return {
    ...story,
    location: {
      latitude: story.lat ?? null,
      longitude: story.lon ?? null,
      placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
    },
  };
}
