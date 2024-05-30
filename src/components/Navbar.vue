<template>
    <div class="navbar">
      <div class="navbar-content">
        <div class="navbar-title">
          <span class="navbar-title-bold">AI</span><span class="navbar-title-semi-bold">nterview</span>
        </div>
        <div class="navbar-buttons">
          <button class="nav-button" @click="$emit('navigate-dashboard')">DASHBOARD</button>
          <button class="nav-button" @click="$emit('navigate-about')">ABOUT</button>
          <button class="nav-button" v-if="isAuthenticated" @click="$emit('navigate-profile')">PROFILE</button>
          <button class="nav-button" v-else @click="$emit('navigate-join')">SIGN IN / JOIN</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { auth } from '../firebase';
  
  export default {
    name: 'Navbar',
    data() {
      return {
        isAuthenticated: false,
      };
    },
    created() {
      auth.onAuthStateChanged((user) => {
        this.isAuthenticated = !!user;
        if (!user) {
          this.$emit('user-logged-out');
        }
      });
    },
  };
  </script>
  
  <style scoped>
  /* Navbar styles */
  .navbar {
    width: 100%;
    height: 10vh;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }
  
  .navbar-content {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    padding: 0 40px;
  }
  
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
  
  .navbar-buttons {
    display: flex;
    gap: 20px;
  }
  
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
  </style>  
  