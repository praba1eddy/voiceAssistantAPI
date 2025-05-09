import { Component } from '@angular/core';
import { VoiceTranscriberComponent } from './voice-transcriber/voice-transcriber.component'; // ✅ Import it

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VoiceTranscriberComponent], // ✅ Add it to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'voice-assistant-ui';
}
