package com.fullteaching.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 * Security configuration. In this class can be configured several aspects
 * related to security:
 * Security behavior: Login method, session management, CSRF, etc..
 * Authentication provider: Responsible to authenticate users. In this
 * example, we use an instance of UserRepositoryAuthProvider, that authenticate
 * users stored in a Spring Data database.
 * URL Access Authorization: Access to http URLs depending on Authenticated
 * vs anonymous users and also based on user role.
 * 
 * 
 * NOTE: The only part of this class intended for app developer customization is
 * the method configureUrlAuthorization. App developer should
 * decide what URLs are accessible by what user role.
 */
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	public UserRepositoryAuthProvider userRepoAuthProvider;

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		configureUrlAuthorization(http);

		// Disable CSRF protection (it is difficult to implement with ng2)
		http.csrf().disable();

		// Use Http Basic Authentication
		http.httpBasic();

		// Do not redirect when logout
		http.logout().logoutSuccessHandler((rq, rs, a) -> {
		});
	}

	private void configureUrlAuthorization(HttpSecurity http) throws Exception {

		// APP: This rules have to be changed by app developer

		// URLs that need authentication to access to it
		//Courses API
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/courses/**").hasAnyRole("TEACHER", "STUDENT");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/courses/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/courses/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/courses/**").hasRole("TEACHER");
		//Forum API
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/entries/**").hasAnyRole("TEACHER", "STUDENT");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/comments/**").hasAnyRole("TEACHER", "STUDENT");
		//Session API
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/sessions/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/sessions/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/sessions/**").hasRole("TEACHER");
		//Files API
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/files/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.PUT, "/files/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.DELETE, "/files/**").hasRole("TEACHER");
		//Files upload/download API
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/load-files/upload/course/**").hasRole("TEACHER");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/load-files/upload/picture/**").hasAnyRole("TEACHER", "STUDENT");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/load-files/course/**").hasAnyRole("TEACHER", "STUDENT");
		
		// Other URLs can be accessed without authentication
		http.authorizeRequests().anyRequest().permitAll();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {

		// Database authentication provider
		auth.authenticationProvider(userRepoAuthProvider);
	}
}