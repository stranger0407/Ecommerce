package com.mahalaxmi.ecommerce.config;

import com.mahalaxmi.ecommerce.entity.Category;
import com.mahalaxmi.ecommerce.entity.Product;
import com.mahalaxmi.ecommerce.entity.Product.ProductType;
import com.mahalaxmi.ecommerce.repository.CategoryRepository;
import com.mahalaxmi.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty (both products AND categories)
        if (productRepository.count() == 0 && categoryRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create Categories
        Category servers = Category.builder()
                .name("Servers")
                .description("Enterprise and rack servers")
                .active(true)
                .build();

        Category desktops = Category.builder()
                .name("Desktop Computers")
                .description("High-performance desktop systems")
                .active(true)
                .build();

        Category laptops = Category.builder()
                .name("Laptops")
                .description("Business and gaming laptops")
                .active(true)
                .build();

        Category components = Category.builder()
                .name("Components")
                .description("Computer parts and components")
                .active(true)
                .build();

        categoryRepository.saveAll(Arrays.asList(servers, desktops, laptops, components));

        // Create Products
        Product product1 = Product.builder()
                .name("Dell PowerEdge R750 Server")
                .description("2U rack server with dual Intel Xeon processors, 128GB RAM, 4TB storage")
                .price(new BigDecimal("4999.99"))
                .stockQuantity(15)
                .category(servers)
                .brand("Dell")
                .model("PowerEdge R750")
                .type(ProductType.SERVER)
                .imageUrls(List.of("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product2 = Product.builder()
                .name("HP ProLiant DL380 Gen10")
                .description("Enterprise server with Intel Xeon Gold, 64GB RAM, RAID storage")
                .price(new BigDecimal("3799.99"))
                .stockQuantity(20)
                .category(servers)
                .brand("HP")
                .model("ProLiant DL380 Gen10")
                .type(ProductType.SERVER)
                .imageUrls(List.of("https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product3 = Product.builder()
                .name("Dell Precision 7920 Tower")
                .description("High-performance workstation with Intel Xeon processors, NVIDIA Quadro graphics")
                .price(new BigDecimal("3299.99"))
                .stockQuantity(25)
                .category(desktops)
                .brand("Dell")
                .model("Precision 7920")
                .type(ProductType.WORKSTATION)
                .imageUrls(List.of("https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product4 = Product.builder()
                .name("HP Z8 G4 Workstation")
                .description("Dual Intel Xeon processors, 256GB RAM, professional graphics")
                .price(new BigDecimal("5499.99"))
                .stockQuantity(12)
                .category(desktops)
                .brand("HP")
                .model("Z8 G4")
                .type(ProductType.WORKSTATION)
                .imageUrls(List.of("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500"))
                .featured(false)
                .active(true)
                .build();

        Product product5 = Product.builder()
                .name("Lenovo ThinkPad P15 Mobile Workstation")
                .description("15.6\" 4K display, Intel Core i9, NVIDIA Quadro RTX, 64GB RAM")
                .price(new BigDecimal("3899.99"))
                .stockQuantity(30)
                .category(laptops)
                .brand("Lenovo")
                .model("ThinkPad P15")
                .type(ProductType.LAPTOP)
                .imageUrls(List.of("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product6 = Product.builder()
                .name("Dell XPS 15 Laptop")
                .description("15.6\" OLED display, Intel Core i7, 32GB RAM, 1TB SSD")
                .price(new BigDecimal("2299.99"))
                .stockQuantity(50)
                .category(laptops)
                .brand("Dell")
                .model("XPS 15")
                .type(ProductType.LAPTOP)
                .imageUrls(List.of("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product7 = Product.builder()
                .name("Intel Xeon Gold 6248R Processor")
                .description("24-Core processor, 3.0 GHz base frequency, 35.75MB cache")
                .price(new BigDecimal("2899.99"))
                .stockQuantity(100)
                .category(components)
                .brand("Intel")
                .model("Xeon Gold 6248R")
                .type(ProductType.COMPONENT)
                .imageUrls(List.of("https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=500"))
                .featured(false)
                .active(true)
                .build();

        Product product8 = Product.builder()
                .name("Supermicro X12DPi-N6 Motherboard")
                .description("Dual LGA4189 socket, 8-channel DDR4, PCIe 4.0 support")
                .price(new BigDecimal("899.99"))
                .stockQuantity(45)
                .category(components)
                .brand("Supermicro")
                .model("X12DPi-N6")
                .type(ProductType.COMPONENT)
                .imageUrls(List.of("https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500"))
                .featured(false)
                .active(true)
                .build();

        Product product9 = Product.builder()
                .name("Samsung 128GB DDR4 ECC RAM")
                .description("Server memory module, 2933MHz, error correction")
                .price(new BigDecimal("599.99"))
                .stockQuantity(200)
                .category(components)
                .brand("Samsung")
                .model("M393A8G40AB2-CVF")
                .type(ProductType.COMPONENT)
                .imageUrls(List.of("https://images.unsplash.com/photo-1541923183345-a90b523dc963?w=500"))
                .featured(false)
                .active(true)
                .build();

        Product product10 = Product.builder()
                .name("NVIDIA RTX A6000 Graphics Card")
                .description("48GB GDDR6, professional visualization and AI computing")
                .price(new BigDecimal("4999.99"))
                .stockQuantity(8)
                .category(components)
                .brand("NVIDIA")
                .model("RTX A6000")
                .type(ProductType.COMPONENT)
                .imageUrls(List.of("https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500"))
                .featured(true)
                .active(true)
                .build();

        Product product11 = Product.builder()
                .name("HPE ProLiant ML350 Gen10 Tower Server")
                .description("Tower server with Intel Xeon, expandable storage, redundant power")
                .price(new BigDecimal("2799.99"))
                .stockQuantity(18)
                .category(servers)
                .brand("HPE")
                .model("ProLiant ML350 Gen10")
                .type(ProductType.SERVER)
                .imageUrls(List.of("https://images.unsplash.com/photo-1560259324-0b07b8c2e9e3?w=500"))
                .featured(false)
                .active(true)
                .build();

        Product product12 = Product.builder()
                .name("Lenovo ThinkStation P620 Workstation")
                .description("AMD Threadripper PRO processor, up to 1TB RAM, PCIe 4.0")
                .price(new BigDecimal("6299.99"))
                .stockQuantity(10)
                .category(desktops)
                .brand("Lenovo")
                .model("ThinkStation P620")
                .type(ProductType.WORKSTATION)
                .imageUrls(List.of("https://images.unsplash.com/photo-1587202372583-49330a15584d?w=500"))
                .featured(true)
                .active(true)
                .build();

        productRepository.saveAll(Arrays.asList(
                product1, product2, product3, product4, product5, product6,
                product7, product8, product9, product10, product11, product12
        ));

        System.out.println("✓ Database initialized with 12 products and 4 categories");
    }
}
