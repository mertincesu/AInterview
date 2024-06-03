<template>
  <div class="home-container">
    <!-- Navigation bar -->

    <!-- Main content area -->
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container">
        <h4 class="card-title">Recent Activities</h4>
        <div class="search-bar">
          <input type="text" v-model="questionSearch" placeholder="Search by question" class="search-input" @input="searchQuestions"/>
          <input type="date" v-model="dateSearch" placeholder="Search by date" class="search-input" @input="searchQuestions"/>
        </div>
        <div v-if="!selectedQuestion" class="question-list">
          <p v-if="filteredQuestions.length === 0">No questions found.</p>
          <div v-for="(data, index) in filteredQuestions" :key="index" class="question-item">
            <p class="question-text">{{ data.question }}</p>
            <button @click="selectQuestion(data)" class="btn btn-primary mt-2">View</button>
          </div>
        </div>
        <div v-if="selectedQuestion" class="question-details">
          <p><strong>Question:</strong> {{ selectedQuestion.question }}</p>
          <p><strong>Response:</strong> {{ selectedQuestion.response }}</p>
          <p><strong>Feedback:</strong> {{ selectedQuestion.feedback }}</p>
        </div>
        <button v-if="selectedQuestion" @click="clearSelection" class="btn btn-primary mt-3">Back</button>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  name: 'RecentActivity',
  data() {
    return {
      questionSearch: '',
      dateSearch: '',
      interviewData: [],
      filteredQuestions: [],
      selectedQuestion: null,
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      await this.fetchUserData(user.uid);
      this.filteredQuestions = this.interviewData.slice(0, 5); // Show the first 5 questions initially
    }
  },
  methods: {
    async fetchUserData(userId) {
      const q = query(collection(db, 'users', userId, 'interviewData'));
      const querySnapshot = await getDocs(q);
      this.interviewData = querySnapshot.docs.map(doc => doc.data()).sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
    },
    searchQuestions() {
      const lowerCaseQuestionSearch = this.questionSearch.toLowerCase();
      const selectedDate = new Date(this.dateSearch).toDateString();

      this.filteredQuestions = this.interviewData.filter(data => {
        const matchesQuestion = data.question.toLowerCase().includes(lowerCaseQuestionSearch);
        const matchesDate = this.dateSearch ? new Date(data.timestamp.seconds * 1000).toDateString() === selectedDate : true;
        return matchesQuestion && matchesDate;
      }).slice(0, 5); // Show only the first 5 results
    },
    selectQuestion(question) {
      this.selectedQuestion = question;
    },
    clearSelection() {
      this.selectedQuestion = null;
      this.filteredQuestions = this.interviewData.slice(0, 5); // Reset to the first 5 questions
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
.home-container {
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

/* Card container styles */
.card-container {
  width: 1600px;
  height: 80%;
  padding: 50px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.7s ease-in-out;
}

/* Card title styles */
.card-title {
  color: #317ddf;
  margin-bottom: 20px;
  font-size: 25px;
  text-transform: uppercase;
  font-weight: bold;
  animation: fadeIn 0.7s ease-in-out; /* Add this line */
}

/* Search bar styles */
.search-bar {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #bebebe;
  border-radius: 5px;
  width: 200px;
}

/* Question list styles */
.question-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.question-item {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.question-text {
  flex-grow: 1;
  text-align: left;
  margin-right: 20px; /* Adjust this value to change the gap */
}

/* Question details styles */
.question-details {
  text-align: left;
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-details h5,
.question-details p {
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 1.5;
}

.question-details h5 {
  font-weight: bold;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #317ddf;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-primary:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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
