package com.hrushi.finpilot.service;

import com.hrushi.finpilot.dto.CategoryRequest;
import com.hrushi.finpilot.entity.Category;
import com.hrushi.finpilot.entity.User;
import com.hrushi.finpilot.exception.ResourceNotFoundException;
import com.hrushi.finpilot.repository.CategoryRepository;
import com.hrushi.finpilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Create Category
    public Category createCategory(CategoryRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = new Category();
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setBudget(request.getBudget());
        category.setUser(user);

        Category saved = categoryRepository.save(category);

        // Notify user
        notificationService.createNotification(
                user,
                "category",
                "Category created",
                "New category '" + saved.getName() + "' created."
        );

        return saved;
    }

    // Get All Categories of Logged-in User
    public List<Category> getAllCategories(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return categoryRepository.findByUser(user);
    }

    // Get Category By Id (ownership enforced)
    public Category getCategoryById(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    // Update Category (Only Owner)
    public Category updateCategory(Long id, CategoryRequest request, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setBudget(request.getBudget());

        return categoryRepository.save(category);
    }

    // Delete Category (Only Owner) — permanently removes from DB
    public String deleteCategory(Long id, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        String name = category.getName();
        categoryRepository.delete(category);

        // Notify user
        notificationService.createNotification(
                user,
                "category",
                "Category removed",
                "Category '" + name + "' has been removed."
        );

        return "Category deleted successfully";
    }
}
