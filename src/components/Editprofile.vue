<template>
    <div class="edit-profile-container">
      <div class="edit-profile-card">
        <h2 class="fade-in">EDIT PROFILE</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group fade-in">
            <label for="firstname">First Name</label>
            <input type="text" v-model="firstname" id="firstname" required />
          </div>
          <div class="form-group fade-in">
            <label for="lastname">Last Name</label>
            <input type="text" v-model="lastname" id="lastname" required />
          </div>
          <div class="form-group fade-in">
            <label for="country">Country</label>
            <input type="text" v-model="country" id="country" required />
          </div>
          <button type="submit" class="save-button fade-in">Save Changes</button>
          <button @click="cancelEdit" class="cancel-button fade-in">Cancel</button>
        </form>
        <div v-if="message" :class="{'success-message': message.type === 'success', 'error-message': message.type === 'error'}">
          {{ message.text }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { auth, db } from '../firebase';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  
  export default {
    name: 'EditProfile',
    data() {
      return {
        firstname: '',
        lastname: '',
        country: '',
        message: null,
      };
    },
    async created() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.firstname = userData.firstname;
        this.lastname = userData.lastname;
        this.country = userData.country;
      }
    },
    methods: {
      async handleSubmit() {
        try {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            firstname: this.firstname,
            lastname: this.lastname,
            country: this.country,
          });
          this.showMessage('Profile updated successfully.', 'success');
          setTimeout(() => {
            this.$emit('navigate-profile');
          }, 3000); // Wait 3 seconds before redirecting
        } catch (error) {
          console.error('Error updating profile:', error);
          this.showMessage('Failed to update profile. Please try again.', 'error');
        }
      },
      cancelEdit() {
        this.$emit('navigate-profile');
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
  .edit-profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    background-image: linear-gradient(to right, #1c92d2, #23a997);
  }
  
  .edit-profile-card {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 400px;
    text-align: center;
    animation: fadeIn 0.7s ease-in-out;
  }
  
  h2 {
    margin-bottom: 20px;
    color: #317ddf;
    font-weight: bold;
    font-size: 20px;
    animation: fadeIn 1s ease-in-out; /* Add animation to the title */
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
    animation: fadeIn 1s ease-in-out; /* Add animation to form groups */
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #bebebe;
    border-radius: 5px;
  }
  
  .save-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #ffffff;
    background-color: #317ddf;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .save-button:hover {
    background-color: #2568c1;
  }
  
  .cancel-button {
    padding: 10px 20px;
    font-size: 16px;
    color: #ffffff;
    background-color: #6c757d;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 10px;
  }
  
  .cancel-button:hover {
    background-color: #5a6268;
  }
  
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
  