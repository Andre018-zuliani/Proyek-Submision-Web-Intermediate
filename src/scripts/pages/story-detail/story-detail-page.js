import {
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import StoryDetailPresenter from './story-detail-presenter';
import * as StoriesAPI from '../../data/api';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';

export default class StoryDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section class="container">
        <div id="report-detail"></div>
        <div id="save-actions-container"></div>
        <div id="map-loading-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const id = parseActivePathname().id;
    this.#presenter = new StoryDetailPresenter({
      view: this,
      apiModel: StoriesAPI,
      storyId: id,
    });
    this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
      description: story.description,
      evidenceImages: story.evidenceImages,
      location: story.location,
      latitudeLocation: story.location.latitude,
      longitudeLocation: story.location.longitude,
      reporterName: story.name || '-',
      createdAt: story.createdAt,
    });

    // Carousel images
    createCarousel(document.getElementById('images'));

    // Map
    await this.#presenter.showStoryDetailMap();

    if (this.#map) {
      const storyCoordinate = [story.location.latitude, story.location.longitude];
      const markerOptions = { alt: story.title };
      const popupOptions = { content: story.title };
      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    // Actions buttons
    this.#presenter.showSaveButton();
    this.addNotifyMeEventListener();
  }

  populateStoryDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }

  // Tambahkan di class StoryDetailPage
  showStoryDetailLoading() {
    // Implementasi loading indicator
    document.getElementById('report-detail').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    // Tidak perlu implementasi khusus karena populateStoryDetailAndInitialMap
    // akan mengganti konten secara otomatis
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveReportButtonTemplate();

    document.getElementById('report-detail-save').addEventListener('click', async () => {
      this.showAnimatedNotification('Fitur simpan laporan akan segera hadir!');
    });
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      this.showAnimatedNotification('Fitur simpan laporan akan segera hadir!');
    });
  }

  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      this.showAnimatedNotification('Fitur notifikasi laporan akan segera hadir!');
    });
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  showAnimatedNotification(message) {
    // Hapus notifikasi lama jika ada
    let notif = document.getElementById('animated-notification');
    if (notif) notif.remove();

    notif = document.createElement('div');
    notif.id = 'animated-notification';
    notif.className = 'animated-notification';
    notif.innerHTML = `<i class="far fa-bell"></i> ${message}`;

    document.body.appendChild(notif);

    // Trigger animasi
    setTimeout(() => notif.classList.add('show'), 10);

    // Hilangkan setelah 2.5 detik
    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 400);
    }, 2500);
  }
}
