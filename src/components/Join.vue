<template>
  <div class="join-container">
    <navbar :isAuthenticated="false" @navigate-dashboard="$emit('navigate-dashboard')" @navigate-about="$emit('navigate-about')" @navigate-join="$emit('navigate-join')" />
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container">
        <h4 class="card-title">Sign In</h4>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" required />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required />
          </div>
          <button type="submit" class="btn btn-primary mt-3 start-button">Submit</button>
          <div class="jointext">
            <span>Don't have an account? </span>
            <button type="button" class="joinlink" @click="$emit('navigate-newacc')">Join Us</button>
          </div>
        </form>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default {
  name: 'Join',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      success: '',
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = '';
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        this.success = 'Sign-in successful! Redirecting to the dashboard...';
        setTimeout(() => {
          this.$emit('auth-success');
        }, 3000); // Delay to show success message before redirecting
      } catch (error) {
        this.error = this.getErrorMessage(error.code);
      }
    },
    getErrorMessage(code) {
      switch (code) {
        case 'auth/invalid-email':
          return 'The email address is not valid.';
        case 'auth/user-disabled':
          return 'The user account has been disabled.';
        case 'auth/user-not-found':
          return 'No user found with this email.';
        case 'auth/wrong-password':
          return 'Incorrect password. Please try again.';
        default:
          return 'An error occurred during sign-in. Please try again.';
      }
    },
    async saveUserData(userId, question, response, feedback) {
      try {
        await setDoc(doc(db, 'users', userId, 'interviewData', question.id), {
          question: question.text,
          response: response,
          feedback: feedback,
          timestamp: new Date(),
        });
        console.log('Document written with ID: ', question.id);
      } catch (e) {
        console.error('Error adding document: ', e);
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

/* Container for the entire join page */
.join-container {
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
  padding-bottom: 20px;
}

/* Card container styles */
.card-container {
  width: 60%;
  max-width: 600px;
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

/* Form group styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #bebebe;
  border-radius: 5px;
}

/* Start button styles */
.start-button {
  width: 100%;
  padding: 15px 0;
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

/* Join text styles */
.jointext {
  padding-top: 20px;
}

.joinlink:hover {
  color: #317ddf;
}

.joinlink {
  font-weight: bold;
}

/* Error and success message styles */
.error-message {
  color: red;
  margin-top: 20px;
}

.success-message {
  color: green;
  margin-top: 20px;
}

/* Animation styles */
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

