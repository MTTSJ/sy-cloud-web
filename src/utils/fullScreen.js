
export function enterFullscreen(el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
    return true;
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
    return true;
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
    return true;
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
    return true;
  }
  return false;
}

export function outFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function addListener(callback) {
  document.addEventListener('fullscreenchange', callback);
  document.addEventListener('webkitfullscreenchange', callback);
  document.addEventListener('mozfullscreenchange', callback);
  document.addEventListener('msfullscreenchange', callback);
}

function removeListener(callback) {
  document.removeEventListener('fullscreenchange', callback);
  document.removeEventListener('webkitfullscreenchange', callback);
  document.removeEventListener('mozfullscreenchange', callback);
  document.removeEventListener('msfullscreenchange', callback);
}

export default { enterFullscreen, outFullScreen, addListener, removeListener };
