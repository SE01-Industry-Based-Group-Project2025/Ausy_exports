package com.ausyexpo.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ausyexpo.model.Order;
import com.ausyexpo.model.Branch;
import com.ausyexpo.model.User;
import com.ausyexpo.repository.OrderRepository;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private BranchRepository branchRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
    }

    public List<Order> getOrdersByBranch(Long branchId) {
        return orderRepository.findByBranchId(branchId);
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getActiveOrders() {
        return orderRepository.findActiveOrders();
    }

    public List<Order> getOverdueOrders() {
        return orderRepository.findOverdueOrders(LocalDateTime.now());
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(Order order) {
        if (orderRepository.existsByOrderNumber(order.getOrderNumber())) {
            throw new RuntimeException("Order number already exists: " + order.getOrderNumber());
        }
        
        // Validate branch
        if (order.getBranch() != null && order.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(order.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + order.getBranch().getId());
            }
            order.setBranch(branch.get());
        }
        
        // Validate customer if provided
        if (order.getCustomer() != null && order.getCustomer().getId() != null) {
            Optional<User> customer = userRepository.findById(order.getCustomer().getId());
            if (!customer.isPresent()) {
                throw new RuntimeException("Customer not found with id: " + order.getCustomer().getId());
            }
            order.setCustomer(customer.get());
        }
        
        // Set timestamps
        order.setOrderDate(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        
        // Set default status if not provided
        if (order.getStatus() == null || order.getStatus().isEmpty()) {
            order.setStatus("PENDING");
        }
        
        // Set default priority if not provided
        if (order.getPriority() == null || order.getPriority().isEmpty()) {
            order.setPriority("MEDIUM");
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order orderDetails) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Order not found with id: " + id);
        }

        Order order = optionalOrder.get();
        
        // Check if order number is being changed and doesn't conflict
        if (!order.getOrderNumber().equals(orderDetails.getOrderNumber())) {
            if (orderRepository.existsByOrderNumberAndIdNot(orderDetails.getOrderNumber(), id)) {
                throw new RuntimeException("Order number already exists: " + orderDetails.getOrderNumber());
            }
        }

        // Update fields
        order.setOrderNumber(orderDetails.getOrderNumber());
        order.setCustomerName(orderDetails.getCustomerName());
        order.setCustomerEmail(orderDetails.getCustomerEmail());
        order.setCustomerPhone(orderDetails.getCustomerPhone());
        order.setCustomerAddress(orderDetails.getCustomerAddress());
        order.setProductName(orderDetails.getProductName());
        order.setProductCategory(orderDetails.getProductCategory());
        order.setProductDescription(orderDetails.getProductDescription());
        order.setQuantity(orderDetails.getQuantity());
        order.setUnitPrice(orderDetails.getUnitPrice());
        order.setTotalAmount(orderDetails.getTotalAmount());
        order.setStatus(orderDetails.getStatus());
        order.setPriority(orderDetails.getPriority());
        order.setExpectedDeliveryDate(orderDetails.getExpectedDeliveryDate());
        order.setActualDeliveryDate(orderDetails.getActualDeliveryDate());
        order.setPaymentStatus(orderDetails.getPaymentStatus());
        order.setPaymentMethod(orderDetails.getPaymentMethod());
        order.setNotes(orderDetails.getNotes());
        order.setSpecifications(orderDetails.getSpecifications());
        order.setUpdatedAt(LocalDateTime.now());

        // Update branch if provided
        if (orderDetails.getBranch() != null && orderDetails.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(orderDetails.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + orderDetails.getBranch().getId());
            }
            order.setBranch(branch.get());
        }

        // Update customer if provided
        if (orderDetails.getCustomer() != null && orderDetails.getCustomer().getId() != null) {
            Optional<User> customer = userRepository.findById(orderDetails.getCustomer().getId());
            if (!customer.isPresent()) {
                throw new RuntimeException("Customer not found with id: " + orderDetails.getCustomer().getId());
            }
            order.setCustomer(customer.get());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }

    public List<Order> searchOrders(Long branchId, String status, String priority, 
                                   String customerName, String productName, String orderNumber) {
        return orderRepository.searchOrders(branchId, status, priority, customerName, productName, orderNumber);
    }

    public List<Order> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findOrdersByDateRange(startDate, endDate);
    }

    public List<Order> getOrdersByDeliveryDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findOrdersByDeliveryDateRange(startDate, endDate);
    }

    public Map<String, Object> getOrderStatistics(Long branchId) {
        Map<String, Object> stats = new HashMap<>();
        
        if (branchId != null) {
            stats.put("totalOrders", orderRepository.countByBranchId(branchId));
            stats.put("pendingOrders", orderRepository.countByBranchIdAndStatus(branchId, "PENDING"));
            stats.put("confirmedOrders", orderRepository.countByBranchIdAndStatus(branchId, "CONFIRMED"));
            stats.put("deliveredOrders", orderRepository.countByBranchIdAndStatus(branchId, "DELIVERED"));
            stats.put("totalRevenue", orderRepository.getTotalRevenueByBranch(branchId));
        } else {
            stats.put("totalOrders", orderRepository.count());
        }
        
        // Get order distribution by status
        List<Object[]> statusDistribution = orderRepository.getOrdersByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] result : statusDistribution) {
            statusMap.put((String) result[0], (Long) result[1]);
        }
        stats.put("statusDistribution", statusMap);
        
        // Get order distribution by priority
        List<Object[]> priorityDistribution = orderRepository.getOrdersByPriority();
        Map<String, Long> priorityMap = new HashMap<>();
        for (Object[] result : priorityDistribution) {
            priorityMap.put((String) result[0], (Long) result[1]);
        }
        stats.put("priorityDistribution", priorityMap);
        
        // Get order distribution by category
        List<Object[]> categoryDistribution = orderRepository.getOrdersByCategory();
        Map<String, Long> categoryMap = new HashMap<>();
        for (Object[] result : categoryDistribution) {
            categoryMap.put((String) result[0], (Long) result[1]);
        }
        stats.put("categoryDistribution", categoryMap);
        
        return stats;
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Order not found with id: " + id);
        }

        Order order = optionalOrder.get();
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        
        // Set actual delivery date when status is DELIVERED
        if ("DELIVERED".equals(status)) {
            order.setActualDeliveryDate(LocalDateTime.now());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updatePaymentStatus(Long id, String paymentStatus) {
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (!optionalOrder.isPresent()) {
            throw new RuntimeException("Order not found with id: " + id);
        }

        Order order = optionalOrder.get();
        order.setPaymentStatus(paymentStatus);
        order.setUpdatedAt(LocalDateTime.now());

        return orderRepository.save(order);
    }

    public boolean orderNumberExists(String orderNumber) {
        return orderRepository.existsByOrderNumber(orderNumber);
    }

    public boolean orderNumberExistsForOtherOrder(String orderNumber, Long orderId) {
        return orderRepository.existsByOrderNumberAndIdNot(orderNumber, orderId);
    }
}
