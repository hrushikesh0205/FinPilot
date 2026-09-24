package com.hrushi.finpilot.controller;

import com.hrushi.finpilot.dto.CategoryRequest;
import com.hrushi.finpilot.entity.Category;
import com.hrushi.finpilot.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Category", description = "Category management APIs")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // POST /api/categories — Create a new category
    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<Category> createCategory(
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Category created = categoryService.createCategory(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/categories — Get all categories of logged-in user
    @GetMapping
    @Operation(summary = "Get all categories of the logged-in user")
    public ResponseEntity<List<Category>> getAllCategories(Authentication authentication) {

        String email = authentication.getName();
        List<Category> categories = categoryService.getAllCategories(email);
        return ResponseEntity.ok(categories);
    }

    // GET /api/categories/{id} — Get a specific category by ID
    @GetMapping("/{id}")
    @Operation(summary = "Get a specific category by ID")
    public ResponseEntity<Category> getCategoryById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        Category category = categoryService.getCategoryById(id, email);
        return ResponseEntity.ok(category);
    }

    // PUT /api/categories/{id} — Update a category
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        Category updated = categoryService.updateCategory(id, request, email);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/categories/{id} — Permanently delete a category from the database
    @DeleteMapping("/{id}")
    @Operation(summary = "Permanently delete a category")
    public ResponseEntity<String> deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();
        String result = categoryService.deleteCategory(id, email);
        return ResponseEntity.ok(result);
    }
}
