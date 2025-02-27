<template>
    <!-- Confirm Reset Modal -->
    <div class="modal" :class="{ 'display-show': displayModal, 'display-none': !displayModal }" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header reset justify-content-center align-items-center">
                    <h1 class="modal-title" id="resetModalTitle">Reset Progress</h1>
                </div>
                <div class="modal-body">
                    <h1>Are you sure?</h1>
                    <p>Resetting your progress will remove all points, progress, and you will lose your streak.</p>
                </div>
                <div
                    class="modal-footer w-100 justify-content-center align-items-center d-grid mb-2 col-11 col-md-8 col-lg-6">
                    <div class="d-flex flex-fill gap-2 w-100">
                        <button type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
                            @click.prevent="confirmReset">
                            Confirm
                        </button>
                        <button type="button" class="btn btn-secondary btn-red flex-fill"
                            @click.prevent="cancelReset">Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Project Information Modal -->
    <div class="modal" :class="{ 'display-show': displayProjectModal, 'display-none': !displayProjectModal }"
        tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header reset justify-content-center align-items-center">
                    <h1 class="modal-title" id="resetModalTitle">About Spellingual</h1>
                </div>
                <div class="modal-body mb-0 pb-0">
                    <h3>Description</h3>
                    <p>Spellingual is a fun game designed for young Farsi speakers to make learning Farsi spelling
                        skills fun!</p>
                    <h3>Developers</h3>
                    <p>
                        Caitlin Parrott, MSCSIS Student<br>
                        Dr. Elham Ebrahimi, Assisstant Professor
                    </p>
                    
                    <p><em>This project is designed in affiliation with the <a href="https://uncw.edu" target="_blank">University of North Carolina Wilmington</a>.</em></p>
                </div>
                <div class="modal-footer w-100 justify-content-center align-items-center mb-2 col-11 col-md-8 col-lg-6">
                    <button class="w-100 btn btn-primary btn-blue btn-lg" @click.prevent="closeProjectModal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- Menu Display Area -->
    <div class="container-fluid menu justify-content-center">
        <div class="menu-row row align-items-center justify-content-center p-0 m-0">
            <div class="col-9 col-md-7 col-lg-6 p-0 m-0 menu-content white-box">
                <!-- Menu title -->
                <h1 class="menu-title pt-4 pb-4 mb-2">Menu</h1>
                <table class="table table-sm menu-table text-left">
                    <tr v-for="(value, key) in localStorageData" :key="key">
                        <td>{{ getDisplayName(key) }}</td>
                        <td>{{ value }}</td>
                    </tr>
                </table>

                <!-- Project Info Button -->
                <button class="col-10 btn btn-purple btn-blue btn-lg mt-3" @click.prevent="openProjectModal">
                    About the App
                </button>

                <!-- Reset Progress button -->
                <button class="col-10 btn btn-red btn-lg mb-4 mt-3" @click.prevent="resetProgress">
                    Reset Progress
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '../utils/helpers';
import Level from './Level.vue';
import { useSound } from '@vueuse/sound';
import audioClick from '@/assets/media/click.mp3';

const router = useRouter();
const store = useStore();
const displayModal = ref(false);
const displayProjectModal = ref(false);
const namedKeys = ['Username', 'Streak', 'Levels', 'Points']
const selectedKeys = ['username', 'streak', 'levelProgress', 'totalPoints'];
const localStorageData = ref(getLocalStorageData());
const { play: playClick } = useSound(audioClick);

function getLocalStorageData() {
    const data = {};

    for (const key of selectedKeys) {
        const value = localStorage.getItem(key);
        if (value !== null) {
            data[key] = value;
        }
    }

    return data;
}

const getDisplayName = (key) => {
    const index = selectedKeys.indexOf(key);
    return index !== -1 ? namedKeys[index] : key;
};

const openProjectModal = () => {
    playClick();
    displayProjectModal.value = true;
};

const closeProjectModal = () => {
    playClick();
    displayProjectModal.value = false;
};

const resetProgress = () => {
    playClick();
    displayModal.value = true;
};

const confirmReset = async () => {
    playClick();
    displayModal.value = false;

    localStorage.removeItem('username');
    localStorage.removeItem('dictionary');
    localStorage.removeItem('streak');
    localStorage.removeItem('levelProgress');
    localStorage.removeItem('audio');
    localStorage.removeItem('totalPoints');

    store.dispatch('resetStore');
    const generatedDictionary = await useLocalStorage();

    const newRoutes = generatedDictionary.map((entry, index) => ({
        path: `/level/${index + 1}`,
        name: `Level ${index + 1}`,
        component: Level,
        props: { levelIndex: index },
    }));

    router.addRoute(newRoutes);
    router.push('/');
};

const cancelReset = () => {
    playClick();
    displayModal.value = false;
};

</script>