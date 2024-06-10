<template>
    <div class="full-interview-container">
      <navbar :isAuthenticated="true" @navigate-dashboard="$emit('navigate-dashboard')" />
      <div class="main-content d-flex justify-content-center align-items-center">
        <div class="card text-center p-4 card-container" ref="cardContainer">
          <template v-if="!questionsGenerated">
            <h4 class="card-title">RESUME-BASED QUESTIONS</h4>
            <div class="upload-section">
              <label for="field-input">Enter Your Applied Job Position:</label>
              <input type="text" id="field-input" v-model="selectedField" placeholder="e.g., Software, Data Science, Marketing" />
              <label for="level-select">Select Your Experience Level:</label>
              <select id="level-select" v-model="selectedLevel">
                <option value="middle_school">Middle School</option>
                <option value="high_school">High School</option>
                <option value="university">University</option>
                <option value="internship">Internship</option>
                <option value="entry_level">Entry Level</option>
                <option value="professional">Professional</option>
                <option value="experienced_professional">Experienced Professional</option>
                <option value="expert">Expert</option>
              </select>
              <label>Upload Your Resume / CV</label>
              <input type="file" @change="handleFileUpload" />
            </div>
            <button class="submit-button" @click="generateQuestions" :disabled="!cvFile">Submit</button>
          </template>
          <template v-else>
            <div class="card-header">
              <h4 class="card-title">{{ selectedField }} - {{ selectedLevel }}</h4>
            </div>
            <div class="card-content">
              <div v-if="loading" class="loading-spinner-container">
                <div class="loading-spinner"></div>
              </div>
              <div v-else>
                <div v-if="question">
                  <p class="question-text">{{ question }}</p>
                </div>
                <div v-if="isRecording" class="recording-status">
                  <p>Recording... ({{ timeLeft }}s)</p>
                </div>
                <button v-if="!isRecording" @click="startRecording" class="btn btn-primary mt-3 record-button">
                  Start Answering
                </button>
                <button v-if="isRecording" @click="stopRecording" class="btn btn-danger mt-3 record-button">
                  Stop Recording
                </button>
                <div v-if="audioURL" class="audio-container">
                  <audio :src="audioURL" controls></audio>
                </div>
                <div v-if="transcript" class="transcript-container">
                  <p><strong>Transcript:</strong> {{ transcript }}</p>
                </div>
                <button v-if="feedback && !isRecording" @click="nextQuestion" class="btn btn-secondary mt-3 next-button">
                  Next Question
                </button>
                <div v-if="feedback" class="feedback-container">
                  <p><strong>Feedback:</strong> {{ feedback }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';

  export default {
    name: 'FullInterview',
    data() {
      return {
        question: 'Tell me a bit about yourself',
        feedback: '',
        transcript: '',
        isRecording: false,
        audioChunks: [],
        audioURL: null,
        mediaRecorder: null,
        timeLeft: 30,
        countdownTimer: null,
        loading: false,
        dialogue: 'AI: Tell me a bit about yourself\n',
        max_followup: 2,
        followup_threshold: 0.85,
        previous_followup_score: 0.0,
        cvFile: null,
        questions: [],
        questionsGenerated: false,
        selectedField: '',
        selectedLevel: 'internship',
        currentQuestionIndex: 0,  // Initialize current question index
      };
    },
    methods: {
      handleFileUpload(event) {
        this.cvFile = event.target.files[0];
      },
      async generateQuestions() {
        if (this.cvFile) {
          try {
            const formData = new FormData();
            formData.append('resume', this.cvFile);
            formData.append('field', this.selectedField);
            formData.append('level', this.selectedLevel);
  
            const response = await axios.post('http://localhost:3000/analyze-resume', formData);
            this.questions = response.data.questions;
            this.questionsGenerated = true;
            this.currentQuestionIndex = 0;  // Reset to the first question
            
            console.log('Generated Questions:');
            this.questions.forEach((question, index) => {
              console.log(`Question ${index + 1}: ${question}`);
            });
  
          } catch (error) {
            console.error('Error generating questions:', error);
            this.error = 'Error generating questions. Please try again.';
          }
        }
      },
      startRecording() {
        this.isRecording = true;
        this.timeLeft = 30;
        this.audioChunks = [];
        this.startCountdown();
  
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
  
            this.mediaRecorder.ondataavailable = (event) => {
              this.audioChunks.push(event.data);
            };
  
            this.mediaRecorder.onstop = async () => {
              const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
              this.audioURL = URL.createObjectURL(audioBlob);
              await this.transcribeAudio(audioBlob);
            };
  
            this.mediaRecorder.start();
          })
          .catch(error => console.error('Error accessing media devices:', error));
      },
      stopRecording() {
        this.isRecording = false;
        this.mediaRecorder.stop();
        clearInterval(this.countdownTimer);
      },
      startCountdown() {
        this.countdownTimer = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
          } else {
            this.stopRecording();
          }
        }, 1000);
      },
      async transcribeAudio(audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const audioData = reader.result.split(',')[1];
          try {
            const response = await axios.post('http://localhost:3000/transcribe', { audioData });
            this.transcript = response.data.transcript;
            this.dialogue += `User: ${this.transcript}\n`;
            await this.get_response(this.transcript);
          } catch (error) {
            console.error('Error transcribing audio:', error);
          }
        };
      },
      async get_response(userResponse) {
        try {
          const response = await axios.post('http://localhost:3000/followup-chance', { dialogue: this.dialogue });
          const followupChance = parseInt(response.data.response, 10);
  
          console.log("follow-up chance: ", followupChance);
  
          if (followupChance >= 85 && this.max_followup > 0) {
            await this.generateFollowup();
            console.log("follow-up chance: ", followupChance);
            this.max_followup--;
            console.log("IN FOLLOWUP");
          } else {
            await this.generateResponse();
            console.log("follow-up chance: ", followupChance);
            this.max_followup = 2;
            this.followup_threshold = 0.85;
            this.previous_followup_score = 0.0;
            console.log("IN NEW QUESTION");
          }
        } catch (error) {
          console.error('Error determining follow-up chance:', error);
        }
      },
      async generateResponse() {
        if (this.currentQuestionIndex == 5) {
            const response = "That will be the end of out interview, thank you for participating. Your results and feedback will be availible shortly..."
            this.dialogue += 'AI: ${response}\n';
            this.question = response;
            await this.textToSpeech(response);
        }
        else {
            try {
            const questionToAsk = this.questions[this.currentQuestionIndex] || 'Tell me a bit about yourself';
            const response = await axios.post('http://localhost:3000/generate-new-frontend-response', { dialogue: this.dialogue, questionIndex: this.currentQuestionIndex, questionsArray: this.questions });
            const aiResponse = response.data.response;
            this.dialogue += `AI: ${aiResponse}\n`;
            this.question = aiResponse;
            await this.textToSpeech(aiResponse);
    
            // Increment question index after asking
            this.currentQuestionIndex++;
            } catch (error) {
            console.error('Error generating response:', error);
            }
        }
      },
      async generateFollowup() {
        try {
          const response = await axios.post('http://localhost:3000/generate-new-frontend-followup', { dialogue: this.dialogue });
          const aiResponse = response.data.response;
          this.dialogue += `AI: ${aiResponse}\n`;
          this.question = aiResponse;
          await this.textToSpeech(aiResponse);
        } catch (error) {
          console.error('Error generating follow-up:', error);
        }
      },
      async textToSpeech(text) {
        try {
          const response = await axios.post('http://localhost:3000/text-to-speech', { text }, { responseType: 'arraybuffer' });
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          this.audioURL = URL.createObjectURL(audioBlob);
          const audio = new Audio(this.audioURL);
          audio.play();
        } catch (error) {
          console.error('Error converting text to speech:', error);
        }
      },
    },
  };
</script>  
  
<style scoped>
.full-interview-container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  background-image: linear-gradient(to right, #1c92d2, #23a997);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.card-container {
  width: 60%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.card-header {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.card-title {
  color: #317ddf;
  font-size: 25px;
  font-weight: bold;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.loading-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.question-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.record-button, .next-button, .submit-button {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  font-weight: bold;
  color: #fff;
  background-color: #317ddf;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.record-button:hover, .next-button:hover, .submit-button:hover {
  background-color: #2568c1;
}

.audio-container {
  margin-top: 20px;
  width: 100%;
}

.transcript-container {
  margin-top: 20px;
  text-align: left;
}

.feedback-container {
  margin-top: 20px;
  text-align: left;
}

.recording-status {
  font-size: 18px;
  color: red;
  margin-bottom: 20px;
}

/* Upload section styles */
.upload-section {
  margin-bottom: 20px;
  text-align: left;
  justify-content: center;
  align-items: center;
}

.upload-section label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

.upload-section select,
.upload-section input[type="file"],
.upload-section input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.nav-button {
  width: 15%;
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

.nav-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

/* Loading spinner styles */
.loading-spinner {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
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

  