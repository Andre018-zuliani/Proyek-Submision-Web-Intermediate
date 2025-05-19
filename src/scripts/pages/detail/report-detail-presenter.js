import { reportMapper } from '../../data/api-mapper';

export default class ReportDetailPresenter {
  #view;
  #apiModel;
  #reportId;

  constructor({ view, apiModel, reportId }) {
    this.#view = view;
    this.#apiModel = apiModel;
    this.#reportId = reportId;
  }

  async showReportDetail() {
    this.#view.showReportDetailLoading();
    try {
      const response = await this.#apiModel.getReportById(this.#reportId);

      if (!response.ok) {
        console.error('showReportDetail: response:', response);
        this.#view.populateReportDetailError(response.message);
        return;
      }

      const report = await reportMapper(response.data);
      console.log(report); // for debugging purpose, remove after checking it
      this.#view.populateReportDetailAndInitialMap(response.message, report);
    } catch (error) {
      console.error('showReportDetail: error:', error);
      this.#view.populateReportDetailError(error.message);
    } finally {
      this.#view.hideReportDetailLoading();
    }
  }

  // ...kode lainnya disembunyikan...
}