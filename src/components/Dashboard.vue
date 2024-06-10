<template>
  <div class="dashboard-container">
    <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" @navigate-about="$emit('navigate-about')" @navigate-join="$emit('navigate-join')" @user-logged-out="handleUserLoggedOut" />
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="cards-wrapper">
        <div v-if="loading" class="loading-spinner-container">
          <div class="loading-spinner"></div>
        </div> <!-- Loading spinner -->
        <div v-else>
          <div class="cards-container1">
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">Recent Activities</h4>
              </div>
              <div class="card-content">
                <p v-if="!interviewData.length">No recent activities found.</p>
                <div v-for="(data, index) in interviewData.slice(0, 2)" :key="index" class="activity-card">
                  <h5 class="activity-title"><strong>Question: </strong>{{ data.question }}</h5>
                  <p class="activity-date"><strong>Date Answered:</strong> {{ formatDate(data.timestamp) }}</p>
                </div>
                <button @click="$emit('navigate-recentactivity')" class="recent-button">See Recent Activity</button>
              </div>
            </div>
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">AI-GENERATED INTERVIEW</h4>
              </div>
              <div class="card-content">
                <button @click="$emit('go-back')" class="btn btn-primary mt-3 start-button">Free-Style Mode</button>
                <button @click="$emit('navigate-homerally')" class="btn btn-primary mt-3 start-button">Rally-Out Mode</button>
                <button @click="$emit('go-back')" class="btn btn-primary mt-3 start-button">Case-Study Mode</button>
              </div>
            </div>
          </div>
          <div class="cards-container2">
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">Performance Analytics</h4>
              </div>
              <div class="card-content">
                <line-chart v-if="chartData" :chart-data="chartData" :options="chartOptions" />
                <p v-else-if="isUserLoggedIn">Loading chart...</p>
                <p v-else><strong>Sign In</strong> to view Personal Analytics...</p>
                <button v-if="isUserLoggedIn && chartData" @click="$emit('navigate-analytics')" class="btn btn-primary mt-3">See More</button>
              </div>
            </div>
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">PERSONALIZED INTERVIEW</h4>
              </div>
              <div class="card-content">
                <p>Get Tailored Interview Questions Created from Your Resume.</p>
                <button @click="$emit('navigate-resume')" class="btn btn-primary mt-3 start-button">Upload Resume</button>
              </div>
            </div>
          </div>
          <div class="cards-container3">
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">MY INTERVIEWS</h4>
              </div>
              <div class="card-content">
                <div v-if="soonestInterview" class="interview-details">
                  <div class="interview-info">
                    <span class="interview-label">Next Interview:</span>
                    <span class="interview-value">{{ soonestInterview.title }}</span>
                  </div>
                  <div class="interview-info">
                    <span class="interview-label">Date:</span>
                    <span class="interview-value">{{ formatDate(soonestInterview.date) }}</span>
                  </div>
                </div>
                <p v-else>Save Real-Life Interviews and Save Notes</p>
                <button @click="$emit('navigate-notes')" class="btn btn-primary mt-3 start-button">My Interviews</button>
              </div>
            </div>
            <div class="card text-center p-4 card-container">
              <div class="card-header">
                <h4 class="card-title">SETTINGS & CONTACT US</h4>
              </div>
              <div class="card-content">
                <button @click="$emit('navigate-settings')" class="btn btn-primary mt-3 start-button">Settings</button>
                <button @click="$emit('navigate-fullinterview')" class="btn btn-primary mt-3 start-button">Contact Us</button>
                <button @click="$emit('navigate-tts')" class="btn btn-primary mt-3 start-button">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import LineChart from './LineChart.vue';

export default {
  name: 'Dashboard',
  components: {
    LineChart,
  },
  data() {
    return {
      interviewData: [],
      savedInterviews: [], // Add savedInterviews data
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      isUserLoggedIn: false,
      loading: true, // Add a loading state
    };
  },
  computed: {
    soonestInterview() {
      if (!this.savedInterviews.length) return null;
      return this.savedInterviews.reduce((soonest, current) => {
        return new Date(current.date) < new Date(soonest.date) ? current : soonest;
      }, this.savedInterviews[0]);
    },
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.isUserLoggedIn = true;
        await this.fetchUserData(user.uid);
        await this.fetchSavedInterviews(user.uid);
        this.prepareChartData();
      } else {
        this.isUserLoggedIn = false;
      }
      this.loading = false; // Set loading to false once auth state is determined and data is fetched
    });
  },
  methods: {
    async fetchUserData(userId) {
      const q = query(collection(db, 'users', userId, 'interviewData'));
      const querySnapshot = await getDocs(q);
      this.interviewData = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      console.log('Interview Data:', this.interviewData);
    },
    async fetchSavedInterviews(userId) {
      const q = query(collection(db, 'users', userId, 'savedInterviews'));
      const querySnapshot = await getDocs(q);
      this.savedInterviews = querySnapshot.docs.map(doc => doc.data());
      console.log('Saved Interviews:', this.savedInterviews);
    },
    formatDate(date) {
      const dateObj = new Date(date.seconds ? date.seconds * 1000 : date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    prepareChartData() {
      const dates = this.interviewData.map(data => {
        const date = new Date(data.timestamp.seconds * 1000);
        return date.toDateString();
      });
      const dateCounts = dates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const labels = Object.keys(dateCounts);
      const data = Object.values(dateCounts);
      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Questions Answered per Day',
            backgroundColor: '#42A5F5',
            data,
          },
        ],
      };
      console.log('Chart Data:', this.chartData);
    },
    handleUserLoggedOut() {
      this.$emit('navigate-join');
    },
  },
};
</script>

<style scoped>
/* Global font style */
/* Global font style */
/* Global font style */
:root {
  font-family: 'Roboto', sans-serif;
}

/* Container for the entire home page */
.dashboard-container {
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
  height: 90vh; /* Adjusted height to fit within the remaining screen space */
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the top */
  width: 100%;
  overflow-y: auto; /* Ensure scrolling is handled by the main content */
  padding: 20px; /* Added padding for content spacing */
}

/* Cards wrapper styles */
.cards-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px; /* Adjusted margin */
}

/* Cards container styles */
.cards-container1, .cards-container2, .cards-container3 {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-bottom: 20px; /* Added margin to increase vertical gap between card containers */
}

/* Card container styles */
.card-container {
  width: 800px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.7s ease-in-out;
  margin-bottom: 20px; /* Added margin to increase vertical gap between cards */
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Card header styles */
.card-header {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  top: 0;
  background: #fff;
  z-index: 1;
}

/* Card content styles */
.card-content {
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Activity card styles */
.activity-card {
  background: #f9f9f9;
  padding: 15px;
  font-size: 14px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 5px;
  font-size: 21px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out;
}

/* Interview details styles */
.interview-details {
  margin-top: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.interview-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.interview-label {
  font-weight: bold;
  color: #555;
}

.interview-value {
  color: #333;
}

/* Button container styles */
.button-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align buttons to the bottom */
  flex-grow: 1;
  margin-top: auto;
}

/* Start button styles */
.start-button {
  width: 100%;
  padding: 10px 0;
  font-size: 1em;
  font-weight: bold;
  background-color: #317ddf;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 10px; /* Add space between buttons */
}

.recent-button {
  width: 100%;
  padding: 10px 0;
  font-size: 1em;
  font-weight: bold;
  background-color: #317ddf;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:disabled, .recent-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.start-button:hover, .recent-button:hover {
  background-color: #2568c1;
}

/* Loading spinner container styles */
.loading-spinner-container {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Loading spinner styles */
.loading-spinner {
  border: 5px solid #f3f3f3; /* Light grey */
  border-top: 5px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

/* Chart styles */
.line-chart {
  margin-top: 20px;
}

/* Animation keyframes */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
