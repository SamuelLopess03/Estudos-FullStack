package com.samuel.moneymanager.utils;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

	@Value("${jwt.secret}")
	private String SECRET_KEY;

	public String generateToken(String email) {
		Map<String, Object> claims = new HashMap<>();
		
		return createToken(claims, email);
	}
	
	public Boolean validateToken(String token, UserDetails userDetails) {
		final String email = extractEmail(token);
		
		return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}
	
	public String extractEmail(String token) {
		return extractClaim(token, Claims::getSubject);
	}
	
	public Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = extractAllClaims(token);
		
		return claimsResolver.apply(claims);
	}
	
	private Boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Key getSigningKey() {
	    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	private String createToken(Map<String, Object> claims, String email) {
	    return Jwts.builder()
	        .setClaims(claims)
	        .setSubject(email)
	        .setIssuedAt(new Date(System.currentTimeMillis()))
	        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
	        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
	        .compact();
	}

	private Claims extractAllClaims(String token) {
	    return Jwts.parserBuilder()
	        .setSigningKey(getSigningKey())
	        .build()
	        .parseClaimsJws(token)
	        .getBody();
	}

}
