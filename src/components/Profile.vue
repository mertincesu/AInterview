<template>
  <div class="profile-container">
    <div v-if="loading" class="loading-spinner"></div>
    <div v-else class="profile-card">
      <div class="profile-header">
        <div class="profile-picture">{{ initial }}</div>
        <div class="profile-info">
          <h2>{{ fullName }}</h2>
          <h4>{{ email }}</h4>
        </div>
      </div>
      <div class="profile-details">
        <div class="profile-section">
          <h3>Personal Information</h3>
          <p><strong>Full Name:</strong> {{ fullName }}</p>
          <p><strong>Country:</strong> {{ country }}</p>
        </div>
        <div class="profile-section">
          <h3>Account Details</h3>
          <p><strong>Member Since:</strong> {{ memberSince }}</p>
          <p><strong>Last Login:</strong> {{ lastLogin }}</p>
          <p><strong>Subscription:</strong> {{ subscription }}</p>
        </div>
      </div>
      <div class="buttons-class">
        <button @click="$emit('navigate-editprofile')" class="logout-button">Edit Profile</button>
        <button @click="logout" class="logout-button">Logout</button>
        <button @click="confirmDelete" class="delete-button">Delete Account</button>
      </div>
    </div>

    <!-- Delete Account Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="confirm-dialog">
      <div class="confirm-dialog-content">
        <p>Are you sure you want to delete your account?</p>
        <button @click="deleteAccount" class="confirm-button">Yes</button>
        <button @click="cancelDelete" class="cancel-button">No</button>
      </div>
    </div>

    <!-- Account Deleted Success Message -->
    <div v-if="showSuccessMessage" class="success-message">
      <div class="success-message-content">
        <p>Account successfully deleted. Redirecting to sign-in page...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

export default {
  name: 'Profile',
  data() {
    return {
      email: '',
      initial: '',
      fullName: '',
      country: '',
      memberSince: '',
      lastLogin: '',
      subscription: 'Free', // Default value
      showConfirmDialog: false,
      showSuccessMessage: false,
      loading: true, // Add a loading state
    };
  },
  async created() {
    try {
      this.email = auth.currentUser.email;
      this.initial = this.email.charAt(0).toUpperCase();

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.fullName = `${userData.firstname} ${userData.lastname}`;
        this.country = userData.country;
      }

      const creationTime = auth.currentUser.metadata.creationTime;
      const lastSignInTime = auth.currentUser.metadata.lastSignInTime;
      this.memberSince = new Date(creationTime).toLocaleDateString();
      this.lastLogin = new Date(lastSignInTime).toLocaleDateString();
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      this.loading = false; // Set loading to false once data is fetched
    }
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
    confirmDelete() {
      this.showConfirmDialog = true;
    },
    cancelDelete() {
      this.showConfirmDialog = false;
    },
    async deleteAccount() {
      try {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        // Delete the user from Firebase Auth
        await deleteUser(auth.currentUser);
        this.showConfirmDialog = false;
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.$router.push('/signin');
        }, 3000);
      } catch (error) {
        console.error('Error deleting account:', error);
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
  text-align: center;
  animation: fadeIn 0.7s ease-in-out;
}

/* Profile header styles */
.profile-header {
  display: flex;
  flex-direction: column;
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
  margin-bottom: 10px;
}

/* Profile info styles */
.profile-info h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.profile-info h4 {
  font-size: 18px;
  color: #666;
  margin: 5px 0;
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

/* Buttons container styles */
.buttons-class {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

/* Logout button styles */
.logout-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #317ddf;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #2568c1;
}

/* Delete button styles */
.delete-button {
  padding: 10px 20px;
  font-size: 16px;
  color: #ffffff;
  background-color: #dc3545;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #bd2130;
}

/* Confirm dialog styles */
.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.confirm-dialog-content {
  background: #ffffff;
  padding: 20px;
  padding-top: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.confirm-button {
  background-color: #d9534f;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #c9302c;
}

.cancel-button {
  background-color: #6c757d;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* Success message styles */
.success-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.success-message-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

