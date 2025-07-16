package com.samuel.authify.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender mailSender;
	
	private final TemplateEngine templateEngine;
	
	@Value("${spring.mail.properties.mail.smtp.from}")
	private String fromEmail;
	
	public void sendWelcomeEmail(String toEmail, String name) {
		SimpleMailMessage message = new SimpleMailMessage();
		
		message.setFrom(fromEmail);
		message.setTo(toEmail);
		message.setSubject("Welcome to Our Platform");
		message.setText("Hello " + name + ",\n\nThanks for Registering with us!\n\nRegards,\nAuthify Team");
		
		mailSender.send(message);
	}
	
	public void sendOtpEmail(String toEmail, String otp) throws MessagingException {
		Context context = new Context();
		context.setVariable("email", toEmail);
		context.setVariable("otp", otp);
		
		String process = templateEngine.process("verify-email", context);
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
		
		helper.setFrom(fromEmail);
		helper.setTo(toEmail);
		helper.setSubject("Account Verification OTP");
		helper.setText(process, true);
		
		mailSender.send(mimeMessage);
	}
	
	public void sendResetOtpEmail(String toEmail, String otp) throws MessagingException {
		Context context = new Context();
		context.setVariable("email", toEmail);
		context.setVariable("otp", otp);
		
		String process = templateEngine.process("password-reset-email", context);
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
		
		helper.setFrom(fromEmail);
		helper.setTo(toEmail);
		helper.setSubject("Forgot your password?");
		helper.setText(process, true);
		
		mailSender.send(mimeMessage);
	}
	
}
