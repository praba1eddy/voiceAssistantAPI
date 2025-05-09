import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-voice-transcriber',
  templateUrl: './voice-transcriber.component.html',
})
export class VoiceTranscriberComponent {
  mediaRecorder: any;
  audioChunks: Blob[] = [];
  transcribedText = '';
  isRecording = false;

  constructor(private http: HttpClient) {}

  startRecording() {
    this.transcribedText = '';
    this.audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;

        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.sendToServer(audioBlob);
        });
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  sendToServer(audioBlob: Blob) {
    const formData = new FormData();
    formData.append("audioFile", audioBlob, "recording.wav");

    this.http.post('http://localhost:8090/api/speech-to-text', formData, { responseType: 'text' })
      .subscribe({
        next: (response) => this.transcribedText = response,
        error: (err) => this.transcribedText = "❌ Error during transcription."
      });
  }
}
