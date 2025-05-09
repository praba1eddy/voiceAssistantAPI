package com.example.com.voice_assistant_backend.service;

import com.google.cloud.speech.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class SpeechService {

    public String transcribeAudio(MultipartFile audioFile) throws IOException {
        // Convert MultipartFile to ByteString
        ByteString audioBytes = ByteString.copyFrom(audioFile.getBytes());

        // Set recognition config
        RecognitionConfig config = RecognitionConfig.newBuilder()
                .setEncoding(RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED) // ✅ Let Google auto-detect
                .setLanguageCode("en-US")
                .build();

        // Set audio content
        RecognitionAudio audio = RecognitionAudio.newBuilder()
                .setContent(audioBytes)
                .build();

        // Use Google SpeechClient
        try (SpeechClient speechClient = SpeechClient.create()) {
            RecognizeResponse response = speechClient.recognize(config, audio);
            StringBuilder resultText = new StringBuilder();

            for (SpeechRecognitionResult result : response.getResultsList()) {
                SpeechRecognitionAlternative alternative = result.getAlternativesList().get(0);
                resultText.append(alternative.getTranscript());
            }

            return resultText.toString();
        }
    }
}
