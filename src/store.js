import { createStore } from 'vuex';

export default createStore({
  state: {
    dictionary: JSON.parse(localStorage.getItem('dictionary')) || [],
    levelProgress: parseInt(localStorage.getItem('levelProgress')) || 0,
    username: localStorage.getItem('username') || '',
    levelIndex: parseInt(localStorage.getItem('levelIndex')) || 0,
    totalPoints: parseInt(localStorage.getItem('totalPoints')) || 0,
    streak: parseInt(localStorage.getItem('streak')) || 0,
  },
  mutations: {
    setDictionary(state, newDictionary) {
      state.dictionary = newDictionary;
      localStorage.setItem('dictionary', JSON.stringify(newDictionary));
    },
    setLevelProgress(state, newLevelProgress) {
      state.levelProgress = newLevelProgress;
      localStorage.setItem('levelProgress', newLevelProgress);
    },
    setUsername(state, newUsername) {
      state.username = newUsername;
      localStorage.setItem('username', newUsername);
    },
    setLevelIndex(state, newLevelIndex) {
      state.levelIndex = newLevelIndex;
      localStorage.setItem('levelIndex', newLevelIndex);
    },
    setTotalPoints(state, newTotalPoints) {
      state.totalPoints = newTotalPoints;
      localStorage.setItem('totalPoints', newTotalPoints);
    },
    setStreak(state, newStreak) {
      state.streak = newStreak;
      localStorage.setItem('streak', newStreak);
    },
    resetStore(state) {
      state.dictionary = [];
      state.levelProgress = 0;
      state.username = '';
      state.totalPoints = 0;
      state.levelIndex = 0;
      state.streak = 0;

      localStorage.removeItem('username');
      localStorage.removeItem('dictionary');
      localStorage.removeItem('streak');
      localStorage.removeItem('levelProgress');
      localStorage.removeItem('audio');
      localStorage.removeItem('totalPoints');
      localStorage.removeItem('levelIndex');
    },
  },
  actions: {
    updateDictionary({ commit }, newDictionary) {
      commit('setDictionary', newDictionary);
    },
    resetStore({ commit }) {
      commit('resetStore');
    },
  },
});
