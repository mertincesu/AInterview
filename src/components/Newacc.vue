<template>
  <div class="join-container">
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container">
        <h4 class="card-title">CREATE AN ACCOUNT</h4>
        <form @submit.prevent="handleSubmit">
          <div class="form-row1">
            <div class="form-group">
              <label for="firstname">First Name</label>
              <input type="text" v-model="firstname" id="firstname" required />
            </div>
            <div class="form-group">
              <label for="lastname">Last Name</label>
              <input type="text" v-model="lastname" id="lastname" required />
            </div>
          </div>
          <div class="form-row2">
            <div class="form-group email-input">
              <label for="email">Email</label>
              <input type="email" v-model="email" id="email" required />
            </div>
          </div>
          <div class="form-row1">
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" v-model="password" id="password" required />
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <input type="text" v-model="country" id="country" required />
            </div>
          </div>
          <button type="submit" class="start-button">Sign Up</button>
        </form>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default {
  name: 'Newacc',
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      country: '',
      error: '',
    };
  },
  methods: {
    async handleSubmit() {
      try {
        console.log(`Attempting to create user with: ${this.email} ${this.password}`);
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        console.log('User created:', userCredential.user);

        const user = userCredential.user;
        const userData = {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          country: this.country,
          createdAt: new Date().toISOString(),
        };
        console.log('Saving user data:', userData);
        await setDoc(doc(db, 'users', user.uid), userData);

        this.$emit('auth-success');
      } catch (error) {
        console.error('Error signing up:', error);
        this.error = 'Error signing up: ' + error.message;
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
  width: 90%;
  max-width: 1600px;
  padding: 50px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

/* Form row styles */
.form-row1, .form-row2 {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
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

/* Email input specific styles */
.email-input {
  width: 30%;
}

/* Start button styles */
.start-button {
  width: 20%;
  padding: 15px 0;
  font-size: 1.5em;
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

.error {
  color: red;
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
