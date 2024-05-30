<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

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
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$emit('auth-success');
      } catch (error) {
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

/* Navbar styles */
.navbar {
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  position: fixed; /* Change from absolute to fixed */
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Align title to the left and buttons to the right */
  padding: 0 40px; /* Add padding to the left and right */
  z-index: 10; /* Ensure the navbar is above other elements */
}

/* Navbar content styles */
.navbar-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  padding: 0 40px; /* Add more padding to the left and right */
}

/* Navbar title */
.navbar-title-bold {
  font-size: 30px;
  font-weight: bold;
  color: #000;
}

.navbar-title-semi-bold {
  font-size: 30px;
  font-weight: 400;
  color: #000;
}

/* Navbar buttons container */
.navbar-buttons {
  display: flex;
  gap: 20px;
}

/* Navbar button styles */
.nav-button {
  background: none;
  border: none;
  color: #000;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
}

.nav-button:hover {
  color: #317ddf;
}

/* Main content area styles */
.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 140px; /* Ensure padding to account for fixed navbar */
  padding-bottom: 20px; /* Ensure extra padding at the bottom */
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
