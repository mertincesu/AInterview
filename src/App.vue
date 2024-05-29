<template>
  <div id="app">
    <main>
      <Home v-if="currentStep === 'home'" @field-selected="startInterview" @navigate-about="navigateToAbout" />
      <InterviewComponent v-else-if="currentStep === 'interview'" :field="selectedField" @go-back="goBack" />
      <About v-else-if="currentStep === 'about'" @go-back="goBack" />
    </main>
  </div>
</template>

<script>
import Home from './components/Home.vue';
import InterviewComponent from './components/InterviewComponent.vue';
import About from './components/About.vue';

export default {
  name: 'App',
  components: {
    Home,
    InterviewComponent,
    About,
  },
  data() {
    return {
      currentStep: 'home',
      selectedField: null,
    };
  },
  methods: {
    startInterview({ field, subField }) {
      this.selectedField = { field, subField };
      this.currentStep = 'interview';
    },
    goBack() {
      this.currentStep = 'home';
    },
    navigateToAbout() {
      this.currentStep = 'about';
    },
  },
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  color: #333;
  height: 100vh;
}

#app {
  text-align: center;
  height: 100vh;
}

main {
  height: 100%;
}
</style>
