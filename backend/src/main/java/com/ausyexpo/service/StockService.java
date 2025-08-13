package com.ausyexpo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ausyexpo.model.Branch;
import com.ausyexpo.model.Stock;
import com.ausyexpo.repository.BranchRepository;
import com.ausyexpo.repository.StockRepository;

@Service
@Transactional
public class StockService {

    @Autowired
    private StockRepository stockRepository;
    
    @Autowired
    private BranchRepository branchRepository;

    public List<Stock> getAllStock() {
        return stockRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public List<Stock> getStockByBranch(Long branchId) {
        return stockRepository.findByBranchId(branchId);
    }

    public Optional<Stock> getStockById(Long id) {
        return stockRepository.findById(id);
    }

    public Stock createStock(Stock stock) {
        // Validate branch exists
        if (stock.getBranch() != null && stock.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(stock.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + stock.getBranch().getId());
            }
            stock.setBranch(branch.get());
        }
        
        return stockRepository.save(stock);
    }

    public Stock updateStock(Long id, Stock stockDetails) {
        Optional<Stock> optionalStock = stockRepository.findById(id);
        if (!optionalStock.isPresent()) {
            throw new RuntimeException("Stock not found with id: " + id);
        }

        Stock stock = optionalStock.get();

        // Update fields
        stock.setStockType(stockDetails.getStockType());
        stock.setMaterialType(stockDetails.getMaterialType());
        stock.setQuantity(stockDetails.getQuantity());
        stock.setPrice(stockDetails.getPrice());
        stock.setPurchaseDate(stockDetails.getPurchaseDate());
        stock.setReleaseDate(stockDetails.getReleaseDate());
        
        // Update branch if provided
        if (stockDetails.getBranch() != null && stockDetails.getBranch().getId() != null) {
            Optional<Branch> branch = branchRepository.findById(stockDetails.getBranch().getId());
            if (!branch.isPresent()) {
                throw new RuntimeException("Branch not found with id: " + stockDetails.getBranch().getId());
            }
            stock.setBranch(branch.get());
        }

        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        Optional<Stock> optionalStock = stockRepository.findById(id);
        if (!optionalStock.isPresent()) {
            throw new RuntimeException("Stock not found with id: " + id);
        }
        stockRepository.deleteById(id);
    }

    public List<Stock> searchStock(Long branchId, String stockType, String materialType, Boolean isReleased) {
        return stockRepository.findBySearchCriteria(branchId, stockType, materialType, isReleased);
    }

    public List<Stock> getUnreleasedStock() {
        return stockRepository.findByReleaseDateIsNull();
    }

    public List<Stock> getReleasedStock() {
        return stockRepository.findByReleaseDateIsNotNull();
    }

    public List<Stock> getUnreleasedStockByBranch(Long branchId) {
        return stockRepository.findByBranchIdAndReleaseDateIsNull(branchId);
    }

    public List<Object[]> getStockSummaryByBranch(Long branchId) {
        return stockRepository.getStockSummaryByBranch(branchId);
    }

    public List<Stock> getLowStockItems(Integer threshold) {
        if (threshold == null) {
            threshold = 10; // Default threshold
        }
        return stockRepository.findLowStockItems(threshold);
    }

    public Stock releaseStock(Long id) {
        Optional<Stock> optionalStock = stockRepository.findById(id);
        if (!optionalStock.isPresent()) {
            throw new RuntimeException("Stock not found with id: " + id);
        }

        Stock stock = optionalStock.get();
        if (stock.getReleaseDate() != null) {
            throw new RuntimeException("Stock is already released");
        }

        stock.setReleaseDate(java.time.LocalDate.now());
        return stockRepository.save(stock);
    }
}
