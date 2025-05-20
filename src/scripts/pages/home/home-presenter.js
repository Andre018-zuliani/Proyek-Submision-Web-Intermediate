export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showStoriesListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('initialGalleryAndMap: response:', response);
        this.#view.populateStoriesListError(response.message);
        return;
      }

      // Mapping agar ada property location
      const stories = (response.listStory || [])
        .filter(
          (story) =>
            story &&
            story.lat !== null &&
            story.lat !== undefined &&
            story.lon !== null &&
            story.lon !== undefined,
        )
        .map((story) => ({
          ...story,
          location: {
            latitude: story.lat,
            longitude: story.lon,
          },
        }));

      this.#view.populateStoriesList(response.message, stories);
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }
}
