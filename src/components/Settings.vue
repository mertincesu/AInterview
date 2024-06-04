<template>
    <div class="settings-container">
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">Settings</h4>
          <form @submit.prevent="saveSettings">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" v-model="email" id="email" required />
            </div>
            <div class="form-group">
              <label for="notifications">Notifications</label>
              <select v-model="notifications" id="notifications">
                <option value="all">All</option>
                <option value="mentions">Mentions</option>
                <option value="none">None</option>
              </select>
            </div>
            <div class="form-group">
              <label for="privacy">Privacy</label>
              <select v-model="privacy" id="privacy">
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <button type="submit" class="save-button">Save Changes</button>
            <button @click="cancelSettings" class="cancel-button">Cancel</button>
          </form>
          <div v-if="message" :class="{'success-message': message.type === 'success', 'error-message': message.type === 'error'}">
            {{ message.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db } from '../firebase';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  
  export default {
    name: 'Settings',
    data() {
      return {
        email: '',
        notifications: 'all',
        privacy: 'public',
        message: null,
      };
    },
    async created() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.email = userData.email;
        this.notifications = userData.notifications;
        this.privacy = userData.privacy;
      }
    },
    methods: {
      async saveSettings() {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            email: this.email,
            notifications: this.notifications,
            privacy: this.privacy,
          });
          this.showMessage('Settings updated successfully.', 'success');
        } catch (error) {
          console.error('Error updating settings:', error);
          this.showMessage('Failed to update settings. Please try again.', 'error');
        }
      },
      cancelSettings() {
        this.$emit('navigate-dashboard');
      },
      showMessage(text, type) {
        this.message = { text, type };
        setTimeout(() => {
          this.message = null;
        }, 3000);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Global font style */
  :root {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Container for the entire settings page */
  .settings-container {
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
    align-items: flex-start; /* Aligns the card to the top without intertwining with the navbar */
    width: 100%;
    padding-top: 3%; /* Adds space at the top to avoid intertwining with the navbar */
    overflow-y: auto; /* Ensures overflow content can be scrolled */
  }
  
  /* Card container styles */
  .card-container {
    width: 600px;
    min-height: 80%;
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
    padding-bottom: 20px;
    font-size: 25px;
    text-transform: uppercase;
    font-weight: bold;
    animation: fadeIn 0.7s ease-in-out;
  }
  
  /* Form group styles */
  .form-group {
    margin-bottom: 20px;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #bebebe;
    border-radius: 5px;
  }
  
  /* Button styles */
  .save-button,
  .cancel-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 10px;
    margin-right: 10px;
  }
  
  .save-button {
    background-color: #317ddf;
  }
  
  .save-button:hover {
    background-color: #2568c1;
  }
  
  .cancel-button {
    background-color: #6c757d;
  }
  
  .cancel-button:hover {
    background-color: #5a6268;
  }
  
  /* Success and error message styles */
  .success-message {
    color: green;
    margin-top: 15px;
    animation: fadeIn 1s ease-in-out;
  }
  
  .error-message {
    color: red;
    margin-top: 15px;
    animation: fadeIn 1s ease-in-out;
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
  