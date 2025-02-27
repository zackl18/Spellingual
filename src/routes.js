import { createRouter, createWebHistory } from 'vue-router';
import Level from './components/Level.vue';
import LevelSelect from './components/LevelSelect.vue';
import Landing from './components/Landing.vue';
import Menu from './components/Menu.vue';
import Alphabet from './components/Alphabet.vue';
import { useLocalStorage, initializeAlphabet } from './utils/helpers';

/**
 * Generates dynamic routes based on dictionary entries.
 * @returns {Promise<Array>} Array of dynamically generated routes.
 */
const generateRoutes = async () => {
  await useLocalStorage();

  const levelRoutes = [];
  const storedData = localStorage.getItem('dictionary');
  const dictionary = storedData ? JSON.parse(storedData) : [];
  initializeAlphabet();

  for (let i = 0; i < dictionary.length; i++) {
    levelRoutes.push({
      path: `/level/${i}`,
      name: `Level ${i}`,
      component: Level,
      props: { levelIndex: i },
    });
  }

  return levelRoutes;
};

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/levelselect',
    name: 'LevelSelect',
    component: LevelSelect,
  },{
    path: '/menu',
    name: 'Menu',
    component: Menu,
  },
  {
    path: '/alphabet',
    name: 'Alphabet',
    component: Alphabet,
  },
  ...(await generateRoutes()),
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
