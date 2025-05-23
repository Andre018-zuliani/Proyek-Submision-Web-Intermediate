import { reportMapper } from '../../data/api-mapper';

export default class NewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showNewFormMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewReport({ description, evidenceImages, latitude, longitude }) {
    this.#view.showSubmitLoadingButton();
    try {
      // Dicoding Story API hanya menerima satu foto, bukan array
      const photo = evidenceImages && evidenceImages.length > 0 ? evidenceImages[0] : null;
      const data = {
        description,
        photo,
        lat: latitude,
        lon: longitude,
      };
      await this.#model.storeNewStory(data);
    } catch (error) {
      console.error('postNewReport: error:', error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
