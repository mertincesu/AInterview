<template>
    <div class="edit-interview-container">
      <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" />
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <div class="card-header">
            <h4 class="card-title">Edit Interview</h4>
          </div>
          <div class="card-content">
            <div class="new-interview-form">
              <input v-model="editInterviewData.title" placeholder="Interview Title" class="form-control mb-3" />
              <input v-model="editInterviewData.date" type="date" class="form-control mb-3" />
              <textarea v-model="editInterviewData.notes" placeholder="Notes" class="form-control mb-3"></textarea>
              <button @click="updateInterview" class="btn btn-primary mt-3 save-button">Update Interview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { updateDoc, doc } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  export default {
    name: 'Editsavedinterview',
    props: {
      interview: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        editInterviewData: {
          title: this.interview.title,
          date: this.interview.date,
          notes: this.interview.notes,
          docId: this.interview.docId,
        },
      };
    },
    methods: {
      async updateInterview() {
        const user = auth.currentUser;
        if (user) {
          const interviewDoc = doc(db, 'users', user.uid, 'savedInterviews', this.editInterviewData.docId);
          try {
            await updateDoc(interviewDoc, {
              title: this.editInterviewData.title,
              date: this.editInterviewData.date,
              notes: this.editInterviewData.notes,
            });
            this.$emit('navigate-dashboard');
          } catch (error) {
            console.error('Error updating interview:', error);
          }
        } else {
          console.error('User not authenticated');
        }
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
  .edit-interview-container {
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
  }
  
  /* Form styles */
  .new-interview-form {
    display: flex;
    flex-direction: column;
  }
  
  .new-interview-form .form-control {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
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
  </style>
  