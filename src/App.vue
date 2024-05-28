<template>
  <div id="app">
    <main>
      <Home v-if="currentStep === 'home'" @field-selected="startInterview" />
      <InterviewComponent v-else :field="selectedField" @go-back="goBack" />
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
      selectedSubField: null,
    };
  },
  methods: {
    startInterview({ field, subField }) {
      console.log('Field selected:', field);
      console.log('Sub-field selected:', subField);
      this.selectedField = { field, subField };
      this.currentStep = 'interview';
    },
    goBack() {
      this.currentStep = 'home';
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
