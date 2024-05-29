<template>
  <div id="app">
    <main>
      <Home v-if="currentStep === 'home'" @field-selected="startInterview" @navigate-about="goToAbout" @navigate-join="goToJoin" @navigate-dashboard="goToDashboard"/>
      <InterviewComponent v-if="currentStep === 'interview'" :field="selectedField" @go-back="goBack" @navigate-dashboard="goToDashboard" @navigate-join="goToJoin"/>
      <About v-if="currentStep === 'about'" @go-back="goBack" @navigate-dashboard="goToDashboard" @navigate-join="goToJoin"/>
      <Join v-if="currentStep === 'join'" @go-back="goBack" @navigate-newacc="goToNewAcc" @navigate-dashboard="goToDashboard" @navigate-join="goToJoin"/>
      <Newacc v-if="currentStep === 'newacc'" @go-back="goBack" @navigate-dashboard="goToDashboard" @navigate-join="goToJoin"/>
      <Dashboard v-if="currentStep === 'dashboard'" @go-back="goBack" @navigate-dashboard="goToDashboard" @navigate-join="goToJoin"/>
    </main>
  </div>
</template>

<script>
import Home from './components/Home.vue';
import InterviewComponent from './components/InterviewComponent.vue';
import About from './components/About.vue';
import Join from './components/Join.vue';
import Newacc from './components/Newacc.vue';
import Dashboard from './components/Dashboard.vue';

export default {
  name: 'App',
  components: {
    Home,
    InterviewComponent,
    About,
    Join,
    Newacc,
    Dashboard,
  },
  data() {
    return {
      currentStep: 'dashboard', // Set the initial step to 'dashboard'
      selectedField: null,
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
    goToAbout() {
      this.currentStep = 'about';
    },
    goToJoin() {
      this.currentStep = 'join';
    },
    goToNewAcc() {
      this.currentStep = 'newacc';
    },
    goToDashboard() {
      this.currentStep = 'dashboard';
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
