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
        console.error('showStoryDetail: response:', response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }

      // Gunakan storyMapper jika memang perlu normalisasi
      const story = await storyMapper(response.story);
      console.log(story); // for debugging, boleh dihapus jika sudah yakin

      this.#view.populateStoryDetailAndInitialMap(response.message, story);
    } catch (error) {
      console.error('showStoryDetail: error:', error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }
}
