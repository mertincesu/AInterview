<template>
    <div class="home-container">
      <!-- Navigation bar -->
      <div class="navbar">
        <div class="navbar-content">
          <div class="navbar-title">
            <span class="navbar-title-bold">AI</span><span class="navbar-title-semi-bold">nterview</span>
          </div>
          <div class="navbar-buttons">
            <button class="nav-button" @click="$emit('navigate-dashboard')">DASHBOARD</button>
            <button class="nav-button" @click="$emit('navigate-about')">ABOUT</button>
            <button class="nav-button" @click="$emit('navigate-join')">SIGN IN / JOIN</button>
          </div>
        </div>
      </div>
  
      <!-- Main content area -->
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="cards-wrapper">
          <div class="cards-container1">
            <div class="card text-center p-4 card-container">
              <h4 class="card-title">Recent Activities</h4>
              <p>View your recent interview activities and feedback.</p>
            </div>
            <div class="card text-center p-4 card-container">
              <h4 class="card-title">Upcoming Interviews</h4>
              <p>Check your upcoming scheduled interviews.</p>
            </div>
          </div>
          <div class="cards-container2">
            <div class="card text-center p-4 card-container">
              <h4 class="card-title">Performance Analytics</h4>
              <p>Analyze your interview performance and progress.</p>
            </div>
            <div class="card text-center p-4 card-container">
              <h4 class="card-title">Start New Interview</h4>
              <button @click="$emit('go-back')" class="btn btn-primary mt-3 start-button">Start Interview</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Home',
    data() {
      return {
        selectedField: null,
        selectedSubField: null,
        fields: ['Software', 'Marketing', 'Finance', 'Healthcare', 'Education'],
        subFields: {
          Software: ['Frontend', 'Backend', 'Devops'],
          Marketing: ['Market Research', 'Brand Management', 'Digital Marketing'],
          Finance: ['Investment Banking', 'Personal Finance', 'Corporate Finance'],
          Healthcare: ['Clinical Practice', 'Healthcare Management', 'Public Health'],
          Education: ['Curriculum Development', 'Instructional Design', 'Education Management'],
        },
      };
    },
    methods: {
      selectField(field) {
        console.log('Field selected:', field);
        this.selectedField = field;
        this.selectedSubField = null; // Reset sub-field selection
      },
      selectSubField(subField) {
        console.log('Sub-field selected:', subField);
        this.selectedSubField = subField;
      },
      startInterview() {
        this.$emit('field-selected', { field: this.selectedField, subField: this.selectedSubField });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Global font style */
  :root {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Container for the entire home page */
  .home-container {
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
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Align title to the left and buttons to the right */
    padding: 0 40px; /* Add padding to the left and right */
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
    padding-top: 100px;
  }
  
  /* Cards wrapper styles */
  .cards-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  
  /* Cards container styles */
  .cards-container1, .cards-container2 {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
  }
    
  /* Card container styles */
  .card-container {
    width: 800px;
    height: 300px;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.7s ease-in-out;
  }
  
  /* Card title styles */
  .card-title {
    color: #317ddf;
    margin-bottom: 10px;
    font-size: 18px;
    text-transform: uppercase;
    font-weight: bold;
    animation: fadeIn 0.7s ease-in-out; /* Add this line */
  }
  
  /* Start button styles */
  .start-button {
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
  
  .start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
  