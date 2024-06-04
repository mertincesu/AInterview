<template>
  <div class="analytics-container">
    <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" @navigate-about="$emit('navigate-about')" @navigate-join="$emit('navigate-join')" @user-logged-out="handleUserLoggedOut" />
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="cards-wrapper">
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Questions Answered per Day</h4>
          <line-chart v-if="chartData1" :chart-data="chartData1" :options="chartOptions" />
          <p v-else>Loading chart...</p>
        </div>
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Average Feedback Score</h4>
          <line-chart v-if="chartData2" :chart-data="chartData2" :options="chartOptions" />
          <p v-else>Loading chart...</p>
        </div>
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Questions per Category</h4>
          <line-chart v-if="chartData3" :chart-data="chartData3" :options="chartOptions" />
          <p v-else>Loading chart...</p>
        </div>
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Questions per Sub-Category</h4>
          <line-chart v-if="chartData4" :chart-data="chartData4" :options="chartOptions" />
          <p v-else>Loading chart...</p>
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
  name: 'Analytics',
  components: {
    LineChart,
  },
  data() {
    return {
      chartData1: null,
      chartData2: null,
      chartData3: null,
      chartData4: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
      },
      interviewData: [],
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
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
    prepareChartData() {
      // Prepare data for chartData1 (Questions Answered per Day)
      const dates = this.interviewData.map(data => {
        const date = new Date(data.timestamp.seconds * 1000);
        return date.toDateString();
      });
      const dateCounts = dates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      const labels1 = Object.keys(dateCounts);
      const data1 = Object.values(dateCounts);
      this.chartData1 = {
        labels: labels1,
        datasets: [
          {
            label: 'Questions Answered per Day',
            backgroundColor: '#42A5F5',
            data: data1,
          },
        ],
      };

      // Prepare data for chartData2 (Average Feedback Score)
      const feedbackByDate = this.interviewData.reduce((acc, data) => {
        const date = new Date(data.timestamp.seconds * 1000).toDateString();
        if (!acc[date]) {
          acc[date] = { totalScore: 0, count: 0 };
        }
        acc[date].totalScore += data.scoreFeedback || 0; // Use scoreFeedback parameter
        acc[date].count += 1;
        return acc;
      }, {});
      const labels2 = Object.keys(feedbackByDate);
      const data2 = labels2.map(date => feedbackByDate[date].count > 0 ? (feedbackByDate[date].totalScore / feedbackByDate[date].count).toFixed(2) : 0);
      this.chartData2 = {
        labels: labels2,
        datasets: [
          {
            label: 'Average Feedback Score',
            backgroundColor: '#66BB6A',
            data: data2,
          },
        ],
      };

      // Prepare data for chartData3 (Questions per Category)
      const categories = this.interviewData.map(data => data.category);
      const categoryCounts = categories.reduce((acc, category) => {
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      const labels3 = Object.keys(categoryCounts);
      const data3 = Object.values(categoryCounts);
      this.chartData3 = {
        labels: labels3,
        datasets: [
          {
            label: 'Questions per Category',
            backgroundColor: '#FFA726',
            data: data3,
          },
        ],
      };

      // Prepare data for chartData4 (Questions per Sub-Category)
      const subCategories = this.interviewData.map(data => data.subCategory);
      const subCategoryCounts = subCategories.reduce((acc, subCategory) => {
        acc[subCategory] = (acc[subCategory] || 0) + 1;
        return acc;
      }, {});
      const labels4 = Object.keys(subCategoryCounts);
      const data4 = Object.values(subCategoryCounts);
      this.chartData4 = {
        labels: labels4,
        datasets: [
          {
            label: 'Questions per Sub-Category',
            backgroundColor: '#AB47BC',
            data: data4,
          },
        ],
      };
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

/* Container for the entire analytics page */
.analytics-container {
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
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* Card container styles */
.card-container {
  width: 800px;
  height: 300px;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.7s ease-in-out;
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

