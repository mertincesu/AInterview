<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-picture">{{ initial }}</div>
        <div class="profile-info">
          <h2>{{ email }}</h2>
        </div>
      </div>
      <div class="profile-details">
        <div class="profile-section">
          <h3>Personal Information</h3>
          <p><strong>Full Name:</strong> {{ fullName }}</p>
          <p><strong>Phone:</strong> {{ phone }}</p>
          <p><strong>Address:</strong> {{ address }}</p>
        </div>
        <div class="profile-section">
          <h3>Account Details</h3>
          <p><strong>Member Since:</strong> {{ memberSince }}</p>
          <p><strong>Last Login:</strong> {{ lastLogin }}</p>
          <p><strong>Subscription:</strong> {{ subscription }}</p>
        </div>
      </div>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';

export default {
  name: 'Profile',
  data() {
    return {
      email: '',
      initial: '',
      fullName: 'John Doe', // Example data, replace with actual data
      phone: '+1234567890', // Example data, replace with actual data
      address: '123 Main St, Anytown, USA', // Example data, replace with actual data
      memberSince: 'January 1, 2021', // Example data, replace with actual data
      lastLogin: 'March 3, 2024', // Example data, replace with actual data
      subscription: 'Premium', // Example data, replace with actual data
    };
  },
  created() {
    this.email = auth.currentUser.email;
    this.initial = this.email.charAt(0).toUpperCase();
  },
  methods: {
    async logout() {
      try {
        await auth.signOut();
        this.$emit('user-logged-out');
        this.$router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
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

/* Container for the entire profile page */
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

/* Profile card styles */
.profile-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 500px;
  animation: fadeIn 0.7s ease-in-out;
}

/* Profile header styles */
.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Profile picture styles */
.profile-picture {
  background: #317ddf;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  height: 100px;
  width: 100px;
  margin-right: 20px;
}

/* Profile info styles */
.profile-info h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

/* Profile details styles */
.profile-details {
  margin-top: 20px;
}

/* Profile section styles */
.profile-section {
  margin-bottom: 20px;
}

.profile-section h3 {
  font-size: 20px;
  color: #317ddf;
  margin-bottom: 10px;
}

.profile-section p {
  font-size: 16px;
  color: #666;
  margin: 5px 0;
}

/* Logout button styles */
.logout-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #d9534f;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #c9302c;
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
