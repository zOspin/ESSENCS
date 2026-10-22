// Sonido de los videos de producto.
//
// Los navegadores solo dejan sonar un video cuando la persona ya tocó o hizo clic en la página
// (entrar con "Descubrir la colección" cuenta). Si aún no lo ha hecho, el video arranca en
// silencio y se le pone el sonido en el primer toque, clic o tecla, sin botones de por medio.
// Solo un video suena a la vez: el último que empezó le quita el sonido al anterior.

let owner = null;
const waiting = new Set();

function unmuteWaiting() {
  waiting.forEach((video) => {
    video.muted = false;
    claim(video);
  });
  waiting.clear();
}

['pointerdown', 'touchend', 'keydown'].forEach((type) =>
  window.addEventListener(type, unmuteWaiting, { capture: true, passive: true }),
);

function claim(video) {
  if (owner && owner !== video) owner.muted = true;
  owner = video;
}

// Reproduce el video con sonido o, si el navegador no lo permite todavía, en silencio hasta
// la siguiente interacción. `isActive` dice si el video sigue debiendo sonar cuando el navegador
// responde (la persona pudo haberse ido de la tarjeta mientras tanto).
export function playWithSound(video, isActive = () => true) {
  video.muted = false;
  claim(video);
  return video.play().catch((error) => {
    // AbortError: lo pausaron antes de arrancar; no hay que reintentar.
    if (error.name !== 'NotAllowedError' || !isActive()) return;
    video.muted = true;
    waiting.add(video);
    return video.play().catch(() => {});
  });
}

// Detiene el video y lo saca de la lista de espera del sonido.
export function stopVideo(video, { rewind = true } = {}) {
  waiting.delete(video);
  if (owner === video) owner = null;
  video.pause();
  if (rewind) video.currentTime = 0;
}
