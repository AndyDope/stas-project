package com.cdac.groupseven.stas.serviceImpl;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTService {

	private String secretkey;
	
	public JWTService() throws NoSuchAlgorithmException {
		KeyGenerator keyGen=KeyGenerator.getInstance("HmacSHA256");
		SecretKey sk= keyGen.generateKey();
		secretkey = Base64.getEncoder().encodeToString(sk.getEncoded());
	}
	
	public String generateToken(String name) {
		
		Map<String,Object> claims = new HashMap<>();
		
		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(name)
				.issuedAt(new Date())
				.expiration((new Date(System.currentTimeMillis()+60*60*60)))
				.and()
				.signWith(getKey())
				.compact();
	}

	private SecretKey getKey() {
		byte[] keyByte= Decoders.BASE64.decode(secretkey);
		return Keys.hmacShaKeyFor(keyByte);
	}

	public String extractUserName(String token) {
		
		return extractClaim(token , Claims::getSubject);
	}

	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
}

