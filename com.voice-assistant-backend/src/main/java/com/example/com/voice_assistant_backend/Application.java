package com.example.com.voice_assistant_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		// ✅ Set your full credential path here
		System.setProperty("GOOGLE_APPLICATION_CREDENTIALS",
				"/Users/prabandhareddy/Downloads/key.json");

		SpringApplication.run(Application.class, args);
	}
}
