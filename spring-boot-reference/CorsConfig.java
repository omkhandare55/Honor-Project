// ============================================================
// Spring Boot — CORS Configuration
// File: src/main/java/com/yourapp/config/CorsConfig.java
// ============================================================
//
// WHY THIS FILE?
//   The Vite dev server runs on port 5173. Without explicit
//   CORS headers, the browser will block responses from 8080.
//   This config allows the frontend origin in EVERY controller.
//
// OPTION A — Global CORS bean (recommended, applies everywhere)
// ============================================================

package com.yourapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration cfg = new CorsConfiguration();

        // ✅ Allow only your frontend origin (never use "*" in production)
        cfg.setAllowedOrigins(List.of(
            "http://localhost:5173",   // Vite dev server
            "https://your-prod-domain.com"  // Production origin — update before deploy
        ));

        // ✅ Methods your API uses
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // ✅ Allow all common headers
        cfg.setAllowedHeaders(List.of("*"));

        // ✅ Expose headers the frontend might read (e.g. X-Total-Count for pagination)
        cfg.setExposedHeaders(List.of("X-Total-Count", "Content-Disposition"));

        // ✅ Allow cookies / Authorization header (needed for auth)
        cfg.setAllowCredentials(true);

        // ✅ Preflight cache — browser won't re-check for 1 hour
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);  // applies to ALL routes

        return new CorsFilter(source);
    }
}


// ============================================================
// OPTION B — Per-controller @CrossOrigin annotation
//            (simpler, but you must add it to every controller)
// ============================================================
/*

@RestController
@RequestMapping("/api/contacts")
@CrossOrigin(origins = "http://localhost:5173", maxAge = 3600)
public class ContactController {
    // ... your endpoints
}

*/


// ============================================================
// Minimal ContactController example (Spring Boot)
// File: src/main/java/com/yourapp/controller/ContactController.java
// ============================================================
/*

package com.yourapp.controller;

import com.yourapp.model.Contact;
import com.yourapp.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService service;
    public ContactController(ContactService service) { this.service = service; }

    @GetMapping
    public List<Contact> getAll() { return service.findAll(); }

    @GetMapping("/search")
    public List<Contact> search(@RequestParam String query) {
        return service.search(query);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getById(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contact create(@Valid @RequestBody Contact contact) {
        return service.save(contact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> update(
            @PathVariable Long id,
            @Valid @RequestBody Contact contact) {
        return service.update(id, contact)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

*/
