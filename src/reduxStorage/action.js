export const SET_ALL_DATA = 'SET_ALL_DATA';
export const SET_VIDEO_URL = 'SET_VIDEO_URL';
export const SET_SCORE_URL = 'SET_SCORE_URL';
export const SET_ALL_SESSION = 'SET_ALL_SESSION';

export const setAllData = (data) => ({
  type: SET_ALL_DATA,
  payload: data,
});

export const setVideoUrl = (url) => ({
  type: SET_VIDEO_URL,
  payload: url,
});

export const setScoreUrl = (url) => ({
  type: SET_SCORE_URL,
  payload: url,
});

export const setAllSession = (sessionData) => ({
  type: SET_ALL_SESSION,
  payload: sessionData,
});