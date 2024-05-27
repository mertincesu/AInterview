<template>
  <div class="home">
    <h2>Select a Field</h2>
    <div class="fields">
      <div
        v-for="field in fields"
        :key="field"
        :class="['field', { selected: selectedField === field }]"
        @click="selectField(field)"
      >
        {{ field }}
      </div>
    </div>
    <button @click="startInterview" :disabled="!selectedField" class="start-button">
      Start Interview
    </button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      selectedField: '',
      fields: ['Software', 'Marketing', 'Finance', 'Healthcare', 'Education'],
    };
  },
  methods: {
    selectField(field) {
      this.selectedField = field;
    },
    startInterview() {
      if (this.selectedField) {
        this.$emit('field-selected', this.selectedField);
      } else {
        alert('Please select a field.');
      }
    },
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #4CAF50;
}

.fields {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.field {
  background-color: #4CAF50;
  color: white;
  padding: 15px 25px;
  margin: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
  font-size: 1.2rem;
}

.field:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.field.selected {
  background-color: #45a049;
  border: 5px solid #1723a4;
}

.start-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.start-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.start-button:not(:disabled):hover {
  background-color: #45a049;
}
</style>
