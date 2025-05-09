package com.example.com.voice_assistant_backend.controller;

import com.example.com.voice_assistant_backend.service.SpeechService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class SpeechController {

    private final SpeechService speechService;

    public SpeechController(SpeechService speechService) {
        this.speechService = speechService;
    }

    @PostMapping(value = "/speech-to-text", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> convertSpeechToText(@RequestParam("audioFile") MultipartFile audioFile) {
        System.out.println("✅ /api/speech-to-text endpoint hit");

        try {
            String result = speechService.transcribeAudio(audioFile);
            System.out.println("✅ Transcription: " + result);
            return ResponseEntity.ok(result); // ✅ Send as plain text
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error during transcription: " + e.getMessage());
        }
    }
}
