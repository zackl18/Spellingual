<template>
    <div class="row text-center justify-content-center">
        <div class="col-10 col-md-8 col-lg-5 pt-2 mb-2 point-display">
            <h1 class="point-header pt-1">{{ store.state.totalPoints }} Points</h1>
            <div v-if="store.state.streak" class="streak pb-1">
                {{ store.state.streak }} level streak
            </div>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex';
const store = useStore();
</script>