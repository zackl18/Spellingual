<template>
    <div class="modal" :class="{ 'display-show': displayHintModal, 'display-none': !displayHintModal }">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header reset justify-content-center align-items-center"
                :class="{ 'bg-green': hintType === 0, 'bg-blue': hintType === 1, 'bg-purple': hintType === 2 }">
                    <h1 v-if="hintType === 0">Define the Word</h1>
                    <h1 v-if="hintType === 1">Hear the Word</h1>
                    <h1 v-if="hintType === 2">See Letter Sounds</h1>
                </div>
                <div class="modal-body pb-0">
                    <div v-if="hintType === 0">
                        <h1>Buy for <strong>{{ hintCosts[0] }} Points</strong>?</h1>
                    </div>
                    <div v-if="hintType === 1">
                        <h1>Buy for <strong>{{ hintCosts[1] }}  Points</strong>?</h1>
                    </div>
                    <div v-if="hintType === 2">
                        <h1>Buy for <strong>{{ hintCosts[2] }}  Points</strong>?</h1>
                    </div>
                </div>
                <div
                    class="modal-footer w-100 justify-content-center align-items-center d-grid mb-2 col-11 col-md-8 col-lg-6">
                    <div class="d-flex flex-fill gap-2 w-100">
                        <button type="button" class="btn btn-primary btn-blue btn-lg flex-fill"
                            @click.prevent="confirmPurchase">
                            Confirm
                        </button>
                        <button type="button" class="btn btn-secondary btn-red flex-fill"
                            @click.prevent="cancelPurchase">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hint Selection Modal -->
    <div class="modal" :class="{ 'display-show': displayModal, 'display-none': !displayModal }" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header hint justify-content-center align-items-center">
                    <h1 class="modal-title" id="hintModalTitle">Buy Hint</h1>
                </div>
                <div class="modal-body row d-flex justify-content-center pt-4">
                    <h2>Available Points: {{ store.state.totalPoints }}</h2>
                    <div class="col-10 pt-3">
                        <p class="no-hints-available" v-if="isHintDisabled(0) && isHintDisabled(1) && isHintDisabled(2)">No more hints available</p>
                        <button type="button" class="btn btn-lg btn-green btn-hint mx-2 mb-3 px-4 w-100"
                            :disabled="isHintDisabled(0)" @click="buyHint(0)">
                            Define the word
                        </button>
                        <button type="button" class="btn btn-lg btn-blue btn-hint mx-2 mb-3 px-4 w-100"
                            :disabled="isHintDisabled(1)" @click="buyHint(1)">
                            Hear the word
                        </button>
                        <button type="button" class="btn btn-lg btn-purple btn-hint mx-2 mb-4 px-4 w-100"
                            :disabled="isHintDisabled(2)" @click="buyHint(2)">
                            See letter sounds
                        </button>
                        <button type="button" class="btn btn-lg btn-red btn-hint mx-2 mt-4 mb-3 px-4 w-100"
                            @click.prevent="cancelHintModal">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
import { useSound } from "@vueuse/sound";
import audioClick from "@/assets/media/click.mp3";
import store from '@/store';

const { displayModal, closeModal, openModal } = defineProps([
    "displayModal",
    "closeModal",
    "openModal"
]);

const hintCosts = [10, 20, 30];
const { play: playClick } = useSound(audioClick);
const displayHintModal = ref(false);
const hintType = ref(0);

const dictionary = ref([...store.state.dictionary]);
watch(() => store.state.dictionary, (newDictionary) => {
    dictionary.value = [...newDictionary];
});

const isHintDisabled = (index) => {
    const hints = store.state.dictionary[store.state.levelIndex]?.hints;
    const totalPoints = store.state.totalPoints;
    return (hints?.[index] === 1 || totalPoints < hintCosts[index]);
};

const buyHint = (hintNum) => {
    displayHintModal.value = true;
    hintType.value = hintNum;
    closeModal();
};

const confirmPurchase = () => {
    playClick();
    const updatedDictionary = [...dictionary.value];
    updatedDictionary[store.state.levelIndex].hints[hintType.value] = 1;
    store.commit('setDictionary', updatedDictionary);
    if (store.state.levelIndex !== 1) {
        switch (hintType.value) {
            case 0:
                store.commit('setTotalPoints', store.state.totalPoints - hintCosts[0]);
                break;
            case 1:
                store.commit('setTotalPoints', store.state.totalPoints - hintCosts[1]);
                break;
            case 2:
                store.commit('setTotalPoints', store.state.totalPoints - hintCosts[2]);
                break;
        }
    }
    displayHintModal.value = false;
};

const cancelPurchase = () => {
    displayHintModal.value = false;
    openModal();
};

const cancelHintModal = () => {
    closeModal();
};

</script>