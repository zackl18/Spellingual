import { ref } from 'vue';
import axios from 'axios';

const dictionary = ref(null);
const alphabet = ref(null);

/**
 * Fetches, modifies, and shuffles data from '../dictionary.json'.
 * @returns {Promise<Array>} Shuffled and modified array of dictionary entries.
 * @throws {Error} If there is an error during data fetching or processing.
 */
async function initializeDictionary() {
  try {
    const response = await axios.get('../dictionary.json');
    const data = response.data;

    const modifiedData = data.map(entry => ({
      ...entry,
      farsi: reverseSplit(entry.farsi),
      hints: entry.hints || [0, 0, 0],
    }));

    const categoryGroups = {};
    modifiedData.forEach(entry => {
      const category = entry.category;
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(entry);
    });

    const shuffledData = Object.values(categoryGroups).map(categoryGroup => {
      return [...categoryGroup].sort(() => Math.random() - 0.5);
    }).flat();

    return shuffledData;
  } catch (error) {
    console.error('Error fetching and storing data: ', error);
    throw error;
  }
}


/**
 * Initializes the dictionary and stores it in localStorage if not already present.
 * @throws {Error} If there is an error during dictionary initialization or localStorage operation.
 * @returns {Array} The generated dictionary.
 */
export async function useLocalStorage() {
  try {
    const data = await initializeDictionary();
    dictionary.value = data;

    let existingData = JSON.parse(localStorage.getItem('dictionary') || '[]');

    if (!existingData || dictionary.value.length !== existingData.length) {
      const existingUsername = localStorage.getItem('username');
      if (existingUsername && existingUsername.length <= 1) {
        localStorage.setItem('username', "");
      }
      
      if (dictionary.value.length !== existingData.length) {
        const newEntries = dictionary.value.filter(newEntry =>
          !existingData.some(existingEntry => existingEntry.english === newEntry.english)
        );
        existingData = existingData.concat(newEntries);
      }

      const localStorageKeys = ['dictionary', 'levelProgress', 'streak', 'username', 'totalPoints', 'levelIndex'];
      localStorageKeys.forEach(key => {
        if (key === 'dictionary') {
          localStorage.setItem(key, JSON.stringify(dictionary.value));
        } else {
          const existingValue = localStorage.getItem(key);
          if (key === 'username') {
            localStorage.setItem(key, existingValue || "");
          } else {
            localStorage.setItem(key, existingValue || '0');
          }
        }
      });
    }
    return dictionary.value;
  } catch (error) {
    console.error('Error in useLocalStorage: ', error);
    throw error;
  }
}

/**
 * Reverses the order of characters in a given word.
 * @param {string} word - The word to be reversed.
 * @returns {string} The reversed word.
 */
function reverseSplit(word) {
  return word.split('').reverse().join('');
}

/**
 * Reads persian.json, checks for updates, and stores the alphabet in localStorage.
 * @returns {Promise<Array>} Array of Persian letters.
 * @throws {Error} If there is an error during data fetching or processing.
 */
export async function initializeAlphabet() {
  try {
    const response = await axios.get('../persian.json');
    const data = response.data;
    const existingAlphabet = JSON.parse(localStorage.getItem('alphabet') || '[]');

    if (!existingAlphabet || data.length !== existingAlphabet.length) {
      localStorage.setItem('alphabet', JSON.stringify(data));
    }

    alphabet.value = data;
    return alphabet.value;
  } catch (error) {
    console.error('Error fetching and storing data: ', error);
    throw error;
  }
}