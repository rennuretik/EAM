package com.hfut;

import org.hibernate.validator.internal.util.Version;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EamApplication {

	public static void main(String[] args) {
		SpringApplication.run(EamApplication.class, args);
		System.out.println ( "------------------------------------------------------------------------" );
		System.out.println ( "========================================================================" );
		System.out.println ( "--------------EAM platform " + Version.getVersionString() + " started------------" );
		System.out.println ( "========================================================================" );
		System.out.println ( "------------------------------------------------------------------------" );
	}
}
