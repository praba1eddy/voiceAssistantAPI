import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Required for *ngIf

@Component({
  selector: 'app-voice-transcriber',
  standalone: true,
  imports: [CommonModule], // ✅ Add this line
  templateUrl: './voice-transcriber.component.html',
  styleUrls: ['./voice-transcriber.component.css']
})
export class VoiceTranscriberComponent {
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  transcribedText: string = '';
  isRecording: boolean = false;

  constructor(private http: HttpClient) {}

  startRecording() {
    this.transcribedText = '';
    this.audioChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.isRecording = true;

      this.mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.sendToServer(audioBlob);
      });
    }).catch(err => {
      this.transcribedText = "❌ Microphone access denied.";
      console.error("Microphone error:", err);
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
        error: (err) => {
          this.transcribedText = "❌ Error during transcription.";
          console.error("Transcription error:", err);
        }
      });
  }
}
