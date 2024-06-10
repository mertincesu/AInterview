<template>
    <div class="interview-notes-container">
      <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" />
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="cards-wrapper">
          <div class="card text-center p-4 card-container">
            <div class="card-header">
              <h4 class="saved-interviews-title">Saved Interviews</h4>
            </div>
            <div class="card-content">
              <div v-if="loading" class="loading-spinner-container">
                <div class="loading-spinner"></div>
              </div>
              <div v-else>
                <div v-if="interviews.length > 0" class="saved-interviews mt-4">
                  <div class="interviews-scrollable">
                    <div v-for="(interview, index) in interviews" :key="index" class="interview-card">
                      <h6 class="interview-title">{{ interview.title }}</h6>
                      <p class="interview-date">{{ formatDate(interview.date) }}</p>
                      <p class="interview-notes">{{ interview.notes }}</p>
                      <button @click="editInterview(interview)" class="btn btn-secondary mt-2">Edit</button>
                    </div>
                  </div>
                </div>
                <button @click="navigateToNewInterview" class="btn btn-primary mt-3 save-button">Save New Interview</button>
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
  
  export default {
    name: 'InterviewNotes',
    data() {
      return {
        interviews: [],
        loading: true, // Loading state
      };
    },
    async created() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await this.fetchSavedInterviews(user.uid);
        } else {
          console.error('User not authenticated');
        }
        this.loading = false; // Set loading to false once data is fetched and UI is rendered
      });
    },
    methods: {
      async fetchSavedInterviews(userId) {
        const q = query(collection(db, 'users', userId, 'savedInterviews'));
        const querySnapshot = await getDocs(q);
        this.interviews = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id,
        }));
        this.$nextTick(() => {
          this.loading = false; // Ensure loading is false after UI is fully rendered
        });
      },
      navigateToNewInterview() {
        this.$emit('navigate-newinterview');
      },
      editInterview(interview) {
        this.$emit('navigate-editsavedinterview', interview);
      },
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Global font style */
  :root {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Container for the entire page */
  .interview-notes-container {
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
  
  /* Card container styles */
  .card-container {
    width: 200%;
    height: 650px; /* Fixed height */
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
    padding: 20px;
    border-bottom: 1px solid #ddd;
    top: 0;
    background: #fff;
    z-index: 1;
  }
  
  /* Card content styles */
  .card-content {
    padding: 20px;
    flex-grow: 1;
    overflow-y: hidden; /* Hide overflow */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  /* Saved interviews section styles */
  .saved-interviews {
    text-align: left;
  }
  
  .saved-interviews-title {
    color: #317ddf;
    margin-bottom: 10px;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  .interviews-scrollable {
    max-height: 400px; /* Adjust based on card height */
    overflow-y: auto; /* Scrollable content */
  }
  
  .interview-card {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
  }
  
  .interview-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .interview-date {
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
  }
  
  .interview-notes {
    font-size: 16px;
  }
  
  /* Save button styles */
  .save-button {
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
  
  .save-button:hover {
    background-color: #2568c1;
  }
  
  /* Loading spinner container styles */
  .loading-spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  
  .loading-spinner {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }
  
  /* Animation for fade-in effect */
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
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  