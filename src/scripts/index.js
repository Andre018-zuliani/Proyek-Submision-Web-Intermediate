// CSS imports
import '../styles/styles.css';
import '../styles/responsives.css';
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';

// Components
import App from './pages/app';
import Camera from './utils/camera';

async function safeRenderPage(app) {
  try {
    await app.renderPage();
  } catch (error) {
    console.error('Render page error:', error);
    document.getElementById('main-content').innerHTML =
      '<h2>Terjadi kesalahan saat memuat halaman.</h2>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link'),
  });
  await safeRenderPage(app);

  window.addEventListener('hashchange', async () => {
    await safeRenderPage(app);

    // Stop all active media
    Camera.stopAllStreams();
  });
});
