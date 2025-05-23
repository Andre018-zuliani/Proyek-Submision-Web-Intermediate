import { storyMapper } from '../../data/api-mapper';

export default class StoryDetailPresenter {
  #view;
  #apiModel;
  #storyId;

  constructor({ view, apiModel, storyId }) {
    this.#view = view;
    this.#apiModel = apiModel;
    this.#storyId = storyId;
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);

      if (!response.ok) {
        this.#view.populateStoryDetailError(response.message);
        return;
      }

      const story = await storyMapper(response.story);

      // Pastikan location selalu ada
      if (!story.location) {
        story.location = { latitude: null, longitude: null, placeName: '-' };
      }

      this.#view.populateStoryDetailAndInitialMap(response.message, story);
    } catch (error) {
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  async showStoryDetailMap() {
    await this.#view.initialMap();
  }

  showSaveButton() {
    this.#view.renderSaveButton();
  }
}
