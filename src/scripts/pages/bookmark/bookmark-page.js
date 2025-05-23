import { parseActivePathname } from '../../routes/url-parser';
import StoryDetailPresenter from '../story-detail/story-detail-presenter';
import * as StoriesAPI from '../../data/api';

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return '';
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

  // Tambahkan method berikut:
  showStoryDetailLoading() {
    // Tampilkan loader di elemen yang sesuai, misal:
    document.getElementById('main-content').innerHTML = '<div class="loader"></div>';
  }

  populateStoryDetailAndInitialMap(message, story) {
    // Tampilkan detail story di elemen yang sesuai
    document.getElementById('main-content').innerHTML = generateReportDetailTemplate({
      description: story.description,
      evidenceImages: story.evidenceImages,
      location: story.location,
      latitudeLocation: story.location.latitude,
      longitudeLocation: story.location.longitude,
      reporterName: story.name || '-',
      createdAt: story.createdAt,
    });
    // ...tambahkan logic map jika perlu...
  }

  populateStoryDetailError(message) {
    document.getElementById('main-content').innerHTML = `<div class="error">${message}</div>`;
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
