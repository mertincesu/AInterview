<template>
    <div class="about-container">
      <!-- Navigation bar -->
  
      <!-- Main content area -->
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <h4 class="about-title">About Us</h4>
          <div class="about-content">
            <p class="fade-in">Welcome to AInterview, the future of interview preparation. At AInterview, we harness the power of artificial intelligence to transform the way you get ready for your next big opportunity.</p>
            <p class="fade-in">Our AI-powered platform provides personalized interview simulations that mimic real-life scenarios, helping you build confidence and improve your responses. With AInterview, you have access to a wide range of fields and sub-fields, ensuring that your preparation is tailored specifically to your career aspirations.</p>
            <p class="fade-in">Our intelligent system analyzes your answers in real-time, offering constructive feedback to help you refine your skills. Whether you're preparing for a software development role, a marketing position, or any other field, AInterview is designed to help you succeed.</p>
            <p class="fade-in">Join us and experience the next generation of interview preparation. With AInterview, your success is just one click away.</p>
          </div>
          <button class="go-back-button" @click="$emit('navigate-dashboard')">Go To Dashboard</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'About',
  };
  </script>
  
  <style scoped>
  /* Global font style */
  :root {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Container for the entire about page */
  .about-container {
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
    width: 60%;
    padding: 50px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    animation: fadeIn 0.7s ease-in-out; /* Add this line */
  }
  
  /* About title styles */
  .about-title {
    color: #317ddf;
    margin-bottom: 20px;
    font-size: 30px;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  /* About content styles */
  .about-content p {
    font-size: 18px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 20px;
    opacity: 0;
    animation: fadeIn 1s ease-in-out forwards;
    animation-delay: 0.3s;
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
  
  /* Go back button styles */
  .go-back-button {
    margin-top: 20px;
    padding: 15px 25px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #317ddf;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .go-back-button:hover {
    background-color: #2568c1;
  }
  </style>
  