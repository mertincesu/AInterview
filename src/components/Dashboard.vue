<template>
  <div class="dashboard-container">
    <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" @navigate-about="$emit('navigate-about')" @navigate-join="$emit('navigate-join')" @user-logged-out="handleUserLoggedOut" />
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="cards-wrapper">
        <div class="cards-container1">
          <div class="card text-center p-4 card-container">
            <h4 class="card-title">Recent Activities</h4>
            <p v-if="!interviewData.length">No recent activities found.</p>
            <div v-for="(data, index) in interviewData.slice(0, 2)" :key="index" class="activity-card">
              <h5 class="activity-title"><strong>Question: </strong>{{ data.question }}</h5>
              <p class="activity-date"><strong>Date Answered:</strong> {{ formatDate(data.timestamp) }}</p>
            </div>
            <button v-if="interviewData.length > 2" @click="$emit('navigate-recentactivity')" class="btn btn-primary mt-3">See Recent Activity</button>
          </div>
          <div class="card text-center p-4 card-container">
            <h4 class="card-title">Upcoming Interviews</h4>
            <p>Check your upcoming scheduled interviews.</p>
          </div>
        </div>
        <div class="cards-container2">
          <div class="card text-center p-4 card-container">
            <h4 class="card-title">Performance Analytics</h4>
            <line-chart v-if="chartData" :chart-data="chartData" :options="chartOptions" />
            <p v-else-if="isUserLoggedIn">Loading chart...</p>
            <p v-else><strong>Sign In</strong> to view Personal Analytics...</p>
            <button v-if="isUserLoggedIn && chartData" @click="$emit('navigate-analytics')" class="btn btn-primary mt-3">See More</button>
          </div>
          <div class="card text-center p-4 card-container">
            <h4 class="card-title-interview">Start New Interview</h4>
            <button @click="$emit('go-back')" class="btn btn-primary mt-3 start-button">Free-Style Mode</button>
            <button @click="$emit('navigate-homerally')" class="btn btn-primary mt-3 start-button">Rally-Out Mode</button>
            <button @click="$emit('go-back')" class="btn btn-primary mt-3 start-button">Deep-Dive Mode</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      isUserLoggedIn: false,
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      this.isUserLoggedIn = true;
      await this.fetchUserData(user.uid);
      this.prepareChartData();
    }
  },
  methods: {
    async fetchUserData(userId) {
      const q = query(collection(db, 'users', userId, 'interviewData'));
      const querySnapshot = await getDocs(q);
      this.interviewData = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      console.log('Interview Data:', this.interviewData);
    },
    formatDate(timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString('en-US', {
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
:root {
  font-family: 'Roboto', sans-serif;
}

/* Container for the entire home page */
.dashboard-container {
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Cards wrapper styles */
.cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

/* Cards container styles */
.cards-container1, .cards-container2 {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* Card container styles */
.card-container {
  width: 800px;
  height: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.7s ease-in-out;
}

/* Activity card styles */
.activity-card {
  background: #f9f9f9;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 10px;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out;
}

.card-title-interview {
  color: #317ddf;
  margin-bottom: 20px;
  font-size: 18px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out;
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
}

.start-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.start-button:hover {
  background-color: #2568c1;
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
