package com.fullteaching.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/*//ONLY ON PRODUCTION
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
//ONLY ON PRODUCTION*/

@SpringBootApplication
public class Application 
{
    public static void main( String[] args )
    {
    	SpringApplication.run(Application.class, args);
    }
    
    /*//ONLY ON PRODUCTION
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
    //ONLY ON PRODUCTION*/
    
}
