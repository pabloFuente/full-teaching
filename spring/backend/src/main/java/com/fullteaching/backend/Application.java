package com.fullteaching.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import org.springframework.http.HttpStatus;

import com.fullteaching.backend.chat.ChatHandler;

//ONLY ON PRODUCTION
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
//ONLY ON PRODUCTION 

@SpringBootApplication
@EnableWebSocket
public class Application implements WebSocketConfigurer 
{
    public static void main( String[] args )
    {
    	SpringApplication.run(Application.class, args);
    }
    
	@Bean
	public ChatHandler chatHandler() {
		return new ChatHandler();
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(chatHandler(), "/chat").setAllowedOrigins("*");		
	}
    
    //ONLY ON PRODUCTION
    @Value("${aws_access_key_id}")
    private String awsId;
 	
    @Value("${aws_secret_access_key}")
    private String awsKey;
    
    @Bean
    public static PropertyPlaceholderConfigurer propertyPlaceholderConfigurer() {
	 	PropertyPlaceholderConfigurer ppc = new PropertyPlaceholderConfigurer();
	 	ppc.setLocations(new Resource[] {
	 		new ClassPathResource("/amazon.properties")
	         });
	 	return ppc;
    }
    
    @Bean
    public AWSCredentials credential() {
    	return new BasicAWSCredentials(awsId, awsKey);
    }
    
    @Bean
    public AmazonS3 s3client() {
    	return new AmazonS3Client(credential()); 
    }
    //ONLY ON PRODUCTION
    
    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer() {
       return (container -> {
    	   // When not authorized, return custom html
           //ErrorPage error401Page = new ErrorPage(HttpStatus.UNAUTHORIZED, "/401.html");
    	   
    	   // When not found, return main page
            ErrorPage error404Page = new ErrorPage(HttpStatus.NOT_FOUND, "/index.html");
            
           // When server error, return custom html
           //ErrorPage error500Page = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/500.html");
            
            container.addErrorPages(error404Page);
            //container.addErrorPages(error401Page, error404Page, error500Page);
       });
    }
    
}
