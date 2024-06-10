<template>
    <div class="new-interview-container">
      <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" />
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Save New Interview</h4>
          <div class="new-interview-form">
            <input v-model="newInterview.title" placeholder="Interview Title" class="form-control mb-3" />
            <input v-model="newInterview.date" type="date" class="form-control mb-3" />
            <textarea v-model="newInterview.notes" placeholder="Notes" class="form-control mb-3"></textarea>
            <button @click="saveInterview" class="btn btn-primary mt-3 save-button">Save Interview</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { addDoc, collection } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  export default {
    name: 'SaveInterview',
    data() {
      return {
        newInterview: {
          title: '',
          date: '',
          notes: '',
        },
      };
    },
    methods: {
      async saveInterview() {
        const user = auth.currentUser;
        if (user) {
          if (this.newInterview.title && this.newInterview.date && this.newInterview.notes) {
            try {
              await addDoc(collection(db, 'users', user.uid, 'savedInterviews'), {
                ...this.newInterview,
                timestamp: new Date(),
              });
              this.$emit('navigate-interview-notes');
            } catch (error) {
              console.error('Error saving interview:', error);
            }
          } else {
            alert('Please fill in all fields.');
          }
        } else {
          console.error('User not authenticated');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Use the same styles as InterviewNotes.vue for consistency */
  
  /* Global font style */
  :root {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Container for the entire page */
  .new-interview-container {
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
    width: 800px;
    height: auto;
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
    animation: fadeIn 0.7s ease-in-out;
  }
  
  /* Form control styles */
  .form-control {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
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

  