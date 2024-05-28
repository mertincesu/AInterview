<template>
    <div class="home-container">
      <!-- Navigation bar -->
      <div class="navbar">
        <div class="navbar-content">
          <div class="navbar-title">
            <span class="navbar-title-bold">AI</span><span class="navbar-title-semi-bold">nterview</span>
          </div>
          <div class="navbar-buttons">
            <button class="nav-button">DASHBOARD</button>
            <button class="nav-button">ABOUT</button>
            <button class="nav-button">SIGN IN / JOIN</button>
          </div>
        </div>
      </div>
  
      <!-- Main content area -->
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container">
          <h4 class="card-title">THIS IS ABOUT PAGE</h4>
          </div>
          <button :disabled="!selectedSubField" @click="startInterview" class="btn btn-primary mt-3 start-button">
            Start Interview
          </button>
        </div>
      </div>
  </template>
  
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
  
  /* Card container styles */
  .card-container {
    width: 1600px;
    height: 80%;
    padding: 50px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  /* Card title styles */
  .card-title {
    color: #317ddf;
    margin-bottom: 20px;
    font-size: 25px;
    text-transform: uppercase;
    font-weight: bold;
  }
  
  /* Sub-field title styles */
  .subfield-title {
    color: #317ddf;
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 40px;
    text-transform: uppercase;
    width: 100%; /* Add this */
    text-align: center; /* Add this */
  }
  
  /* Field buttons container styles */
  .field-buttons, .subfield-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    padding-top: 10px;
  }
  
  /* Field button styles */
  .field-button {
    flex: 1 1 200px;
    padding: 15px 25px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    background-color: #317ddf;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .field-button:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .field-button.active {
    background-color: #23a997;
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
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .start-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>
  