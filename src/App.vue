<template>
  <div id="app">
    <navbar @navigate-dashboard="goToDashboard" @navigate-about="goToAbout" @navigate-join="goToJoin" @navigate-profile="goToProfile" @user-logged-out="handleUserLoggedOut" />
    <main>
      <Home v-if="currentStep === 'home'" @field-selected="startInterview" />
      <InterviewComponent v-if="currentStep === 'interview'" :field="selectedField" @go-back="goBack" />
      <About v-if="currentStep === 'about'" @go-back="goBack" @navigate-dashboard="goToDashboard"/>
      <Join v-if="currentStep === 'join'" @go-back="goBack" @navigate-newacc="goToNewacc" @auth-success="goToDashboard" />
      <Newacc v-if="currentStep === 'newacc'" @go-back="goBack" />
      <Dashboard v-if="currentStep === 'dashboard'" @navigate-fullinterview="goToFullinterview" @navigate-notes="goToInterviewnotes" @navigate-tts="goToTTS" @navigate-newinterview="goToNewinterview" @go-back="goBack" @navigate-settings="goToSettings" @navigate-sentiment="goToSentiment" @navigate-resume="goToResume" @navigate-analytics="goToAnalytics" @navigate-homerally="goToHomerally" @navigate-recentactivity="goToRecentactivity"/>
      <Rally v-if="currentStep === 'rally'" :field="selectedField" @go-back="goBack" @navigate-homerally="goToHomerally"/>
      <Profile v-if="currentStep === 'profile'" @go-back="goBack" @navigate-editprofile="goToEditprofile"/>
      <Homerally v-if="currentStep === 'homerally'" @go-back="goBack" @navigate-rally="goToRally" />
      <Recentactivity v-if="currentStep === 'recentactivity'" @navigate-dashboard="goToDashboard"/>
      <Analytics v-if="currentStep === 'analytics'" @navigate-dashboard="goToDashboard"/>
      <Editprofile v-if="currentStep === 'editprofile'" @navigate-profile="goToProfile"/>
      <Resume v-if="currentStep === 'resume' " @navigate-dashboard="goToDashboard"/>
      <Sentiment v-if="currentStep === 'sentiment' " @navigate-dashboard="goToDashboard"/>
      <Settings v-if="currentStep === 'settings' " @navigate-dashboard="goToDashboard"/>
      <Interviewnotes v-if="currentStep === 'interviewnotes' " @navigate-editsavedinterview="goToEditsavedinterview" @navigate-dashboard="goToDashboard" @navigate-newinterview="goToNewinterview"/>
      <Newinterview v-if="currentStep === 'newinterview' " @navigate-dashboard="goToDashboard"/>
      <Editsavedinterview v-if="currentStep === 'editsavedinterview'" :interview="selectedInterview" @navigate-dashboard="goToDashboard"/>
      <TTS v-if="currentStep === 'tts'" :interview="selectedInterview" @navigate-dashboard="goToDashboard"/>
      <Fullinterview v-if="currentStep === 'fullinterview'" :interview="selectedInterview" @navigate-dashboard="goToDashboard"/>
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Home from './components/Home.vue';
import InterviewComponent from './components/InterviewComponent.vue';
import About from './components/About.vue';
import Join from './components/Join.vue';
import Newacc from './components/Newacc.vue';
import Dashboard from './components/Dashboard.vue';
import Rally from './components/Rally.vue';
import Profile from './components/Profile.vue';
import Homerally from './components/Homerally.vue';
import Recentactivity from './components/Recentactivity.vue';
import Analytics from './components/Analytics.vue';
import Editprofile from './components/Editprofile.vue';
import Resume from './components/Resume.vue';
import Sentiment from './components/Sentiment.vue';
import Settings from './components/Settings.vue';
import Interviewnotes from './components/Interviewnotes.vue';
import Newinterview from './components/Newinterview.vue';
import Editsavedinterview from './components/Editsavedinterview.vue';
import TTS from './components/TTS.vue';
import Fullinterview from './components/Fullinterview.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Home,
    InterviewComponent,
    About,
    Join,
    Newacc,
    Dashboard,
    Rally,
    Profile,
    Homerally,
    Recentactivity,
    Analytics,
    Editprofile,
    Resume,
    Sentiment,
    Settings,
    Interviewnotes,
    Newinterview,
    Editsavedinterview,
    TTS,
    Fullinterview,
  },
  data() {
    return {
      currentStep: 'dashboard', // Set the initial step to 'dashboard'
      selectedField: null,
      selectedInterview: null, // Add a property to store the selected interview
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
    goToAbout() {
      this.currentStep = 'about';
    },
    goToJoin() {
      this.currentStep = 'join';
    },
    goToNewacc() {
      this.currentStep = 'newacc';
    },
    goToDashboard() {
      this.currentStep = 'dashboard';
    },
    goToRally(fieldDetails) {
      this.selectedField = fieldDetails;
      this.currentStep = 'rally';
    },
    goToProfile() {
      this.currentStep = 'profile';
    },
    goToHomerally() {
      this.currentStep = 'homerally';
    },
    handleUserLoggedOut() {
      this.currentStep = 'join';
    },
    goToRecentactivity() {
      this.currentStep = 'recentactivity';
    },
    goToAnalytics() {
      this.currentStep = 'analytics';
    },
    goToEditprofile() {
      this.currentStep = 'editprofile';
    },
    goToResume() {
      this.currentStep = 'resume';
    },
    goToSentiment() {
      this.currentStep = 'sentiment';
    },
    goToSettings() {
      this.currentStep = 'settings';
    },
    goToInterviewnotes() {
      this.currentStep = 'interviewnotes';
    },
    goToNewinterview() {
      this.currentStep = 'newinterview';
    },
    goToEditsavedinterview(interview) {
      this.selectedInterview = interview; // Store the selected interview
      this.currentStep = 'editsavedinterview';
    },
    goToTTS() {
      this.currentStep = 'tts';
    },
    goToFullinterview() {
      this.currentStep = 'fullinterview';
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
  height: 90vh;
}

main {
  height: 100%;
}
</style>
