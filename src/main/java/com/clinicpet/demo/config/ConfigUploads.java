package com.clinicpet.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigUploads implements WebMvcConfigurer {

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Carpeta de uploads (fuera de resources)
		String uploadPath = System.getProperty("user.dir") + "/uploads/";

		// Cuando pidan /uploads/**, Spring lo buscará en esa carpeta
		registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + uploadPath);
	}
}
