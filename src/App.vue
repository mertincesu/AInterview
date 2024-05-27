<template>
  <div id="app">
    <header>
      <h1>Interview Simulator</h1>
    </header>
    <main>
      <Home v-if="currentStep === 'home'" @field-selected="startInterview" />
      <InterviewComponent v-else :field="selectedField" @go-back="goBack" />
    </main>
  </div>
</template>

<script>
import Home from './components/Home.vue';
import InterviewComponent from './components/InterviewComponent.vue';

export default {
  name: 'App',
  components: {
    Home,
    InterviewComponent,
  },
  data() {
    return {
      currentStep: 'home',
      selectedField: '',
    };
  },
  methods: {
    startInterview(field) {
      this.selectedField = field;
      this.currentStep = 'interview';
    },
    goBack() {
      this.currentStep = 'home';
      this.selectedField = '';
    },
  },
};
</script>

<style>
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #4CAF50;
  color: white;
  padding: 20px 0;
  margin-bottom: 20px;
}

header h1 {
  margin: 0;
  font-size: 24px;
}

main {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
