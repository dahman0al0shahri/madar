function createNetworkNewsPlayer(frame) {
  return createNewsFramePlayer({ frame, eventTarget: window, origin: location.origin,
    observe: callback => new IntersectionObserver(callback),
    isPaused: () => announcements.isPaused() || motionPreference.matches });
}
