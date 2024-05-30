<template>
  <div class="home-rally-container">
    <!-- Main content area -->
    <div class="main-content d-flex justify-content-center align-items-center">
      <div class="card text-center p-4 card-container">
        <h4 class="card-title">Select a Field</h4>
        <div class="field-buttons">
          <button
            v-for="field in fields"
            :key="field"
            :class="['field-button', { active: selectedField === field }]"
            @click="selectField(field)"
          >
            {{ field }}
          </button>
        </div>
        <div v-if="selectedField">
          <h5 class="subfield-title">Select a Sub-field</h5>
          <div class="subfield-buttons">
            <button
              v-for="subField in subFields[selectedField]"
              :key="subField"
              :class="['field-button', { active: selectedSubField === subField }]"
              @click="selectSubField(subField)"
            >
              {{ subField }}
            </button>
          </div>
        </div>
        <button :disabled="!selectedSubField" @click="startRally" class="btn btn-primary mt-3 start-button">
          Start Rally
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Homerally',
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
      this.selectedField = field;
      this.selectedSubField = null; // Reset sub-field selection
    },
    selectSubField(subField) {
      this.selectedSubField = subField;
    },
    startRally() {
      this.$emit('navigate-rally', { field: this.selectedField, subField: this.selectedSubField });
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
  .home-rally-container {
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
    width: 1600px;
    height: 80%;
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
  
  /* Sub-field title styles */
  .subfield-title {
    color: #317ddf;
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
    margin-top: 40px;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    animation: fadeIn 0.7s ease-in-out;
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
    animation: fadeIn 0.7s ease-in-out;
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
  