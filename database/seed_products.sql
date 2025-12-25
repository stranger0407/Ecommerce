-- ============================================
-- Mahalaxmi E-Commerce Product Seed Script
-- Run this in MySQL Workbench
-- ============================================

-- Select the database first
USE mahalaxmi_ecommerce;

-- STEP 1: Insert Categories (skip if already exist)
-- ============================================
INSERT INTO categories (name, description, image_url, parent_id, active, created_at, updated_at) VALUES
('Servers', 'Enterprise rack servers and tower servers for data centers', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400', NULL, true, NOW(), NOW()),
('Desktop Computers', 'Business desktops and workstations for office use', 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400', NULL, true, NOW(), NOW()),
('Laptops', 'Business laptops and ultrabooks for professionals', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', NULL, true, NOW(), NOW()),
('Workstations', 'High-performance workstations for CAD and rendering', 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400', NULL, true, NOW(), NOW()),
('Components', 'Computer components including RAM, SSD, and graphics cards', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400', NULL, true, NOW(), NOW());

-- ============================================
-- STEP 2: Insert Products
-- NOTE: Adjust category_id values if your categories have different IDs
-- To check: SELECT id, name FROM categories;
-- ============================================

INSERT INTO products (name, description, price, stock_quantity, brand, model, type, category_id, active, featured, created_at, updated_at) VALUES

-- SERVERS (category_id = 1)
('Dell PowerEdge R750 Rack Server', 
 '2U rack server powered by 3rd Gen Intel Xeon Scalable processors. Features up to 32 DDR4 DIMM slots supporting up to 8TB of memory. Ideal for data centers, virtualization, and database applications. Includes redundant power supplies and advanced cooling technology.', 
 485000.00, 10, 'Dell', 'PowerEdge R750', 'SERVER', 1, true, true, NOW(), NOW()),

('HP ProLiant DL380 Gen10 Plus Server', 
 'Industry-leading 2P 2U server delivering world-class performance with Intel Xeon Scalable processors. Features HPE Smart Array controllers, 30 drive bays, and HPE iLO 5 for advanced management. Perfect for virtualization, databases, and hybrid cloud.', 
 520000.00, 8, 'HP', 'ProLiant DL380 Gen10+', 'SERVER', 1, true, true, NOW(), NOW()),

('Lenovo ThinkSystem SR650 V2 Server', 
 'Versatile 2-socket 2U rack server supporting demanding workloads including AI inference, analytics, and cloud computing. Features up to 40 cores per processor, 32 DIMM slots, and flexible storage options.', 
 475000.00, 12, 'Lenovo', 'ThinkSystem SR650 V2', 'SERVER', 1, true, false, NOW(), NOW()),

('Dell PowerEdge T550 Tower Server', 
 'Powerful 2-socket tower server ideal for remote offices and edge computing. Intel Xeon Scalable processors with up to 16 DDR4 DIMM slots. Quiet operation suitable for office environments.', 
 385000.00, 6, 'Dell', 'PowerEdge T550', 'SERVER', 1, true, false, NOW(), NOW()),

-- DESKTOP COMPUTERS (category_id = 2)
('Dell OptiPlex 7090 Tower Desktop', 
 'Powerful business desktop with Intel Core i7-11700 processor, 16GB DDR4 RAM, and 512GB NVMe SSD. Features vPro technology for enterprise management. Built for productivity and reliability.', 
 78000.00, 25, 'Dell', 'OptiPlex 7090', 'DESKTOP_COMPUTER', 2, true, true, NOW(), NOW()),

('HP EliteDesk 800 G8 Mini Desktop', 
 'Ultra-compact mini desktop with Intel Core i5-11500T, 8GB RAM, and 256GB SSD. Perfect for space-constrained offices. Features HP Sure Start and Sure Recover for enhanced security.', 
 62000.00, 30, 'HP', 'EliteDesk 800 G8', 'DESKTOP_COMPUTER', 2, true, false, NOW(), NOW()),

('Lenovo ThinkCentre M90q Gen 2 Tiny', 
 'Tiny form factor desktop delivering exceptional performance. Intel Core i7-11700T, 16GB DDR4, 512GB NVMe SSD. ThinkShield security and Modern Standby support for instant wake.', 
 72000.00, 20, 'Lenovo', 'ThinkCentre M90q Gen 2', 'DESKTOP_COMPUTER', 2, true, false, NOW(), NOW()),

('Dell Precision 3460 Small Form Factor', 
 'Compact workstation desktop with Intel Core i7-12700 vPro, 32GB RAM, 512GB SSD, and NVIDIA T1000 graphics. ISV certified for professional applications.', 
 125000.00, 15, 'Dell', 'Precision 3460 SFF', 'DESKTOP_COMPUTER', 2, true, true, NOW(), NOW()),

-- LAPTOPS (category_id = 3)
('Dell Latitude 5530 Business Laptop', 
 '15.6" FHD display laptop with Intel Core i7-1265U, 16GB RAM, 512GB SSD. Features Dell Express Sign-in, ExpressConnect, and ComfortView Plus. Built for mobile professionals.', 
 95000.00, 15, 'Dell', 'Latitude 5530', 'LAPTOP', 3, true, true, NOW(), NOW()),

('HP EliteBook 840 G9 Laptop', 
 '14" business laptop with Intel Core i7-1265U, 32GB RAM, 1TB SSD. Premium build quality with aluminum chassis. HP Sure View privacy screen and IR camera for Windows Hello.', 
 125000.00, 12, 'HP', 'EliteBook 840 G9', 'LAPTOP', 3, true, true, NOW(), NOW()),

('Lenovo ThinkPad X1 Carbon Gen 10', 
 'Ultralight 14" 2.8K OLED display laptop weighing just 1.12kg. Intel Core i7-1260P, 16GB RAM, 512GB SSD. Dolby Voice and Dolby Atmos speakers. Ultimate business mobility.', 
 145000.00, 10, 'Lenovo', 'ThinkPad X1 Carbon Gen 10', 'LAPTOP', 3, true, true, NOW(), NOW()),

('Dell Latitude 7430 2-in-1 Laptop', 
 '14" FHD touchscreen convertible with Intel Core i7-1265U, 16GB RAM, 512GB SSD. Active pen support for creative work. SafeShutter privacy camera with Built for mobile productivity.', 
 135000.00, 8, 'Dell', 'Latitude 7430 2-in-1', 'LAPTOP', 3, true, false, NOW(), NOW()),

('HP ProBook 450 G9 Laptop', 
 '15.6" FHD laptop with Intel Core i5-1235U, 8GB RAM, 256GB SSD. Perfect balance of performance and value. HP Wolf Security for business protection.', 
 68000.00, 35, 'HP', 'ProBook 450 G9', 'LAPTOP', 3, true, false, NOW(), NOW()),

-- WORKSTATIONS (category_id = 4)
('Dell Precision 5860 Tower Workstation', 
 'Professional tower workstation with Intel Xeon W-2423, NVIDIA RTX A4000 16GB, 64GB ECC RAM, 1TB NVMe SSD. ISV certified for CAD, 3D rendering, and AI development.', 
 285000.00, 5, 'Dell', 'Precision 5860', 'WORKSTATION', 4, true, true, NOW(), NOW()),

('HP Z4 G5 Workstation', 
 'High-performance workstation with Intel Xeon W5-2445, 128GB ECC RAM, 2TB NVMe SSD, NVIDIA RTX A5000 24GB. Built for creative professionals, engineers, and data scientists.', 
 375000.00, 4, 'HP', 'Z4 G5', 'WORKSTATION', 4, true, true, NOW(), NOW()),

('Lenovo ThinkStation P360 Tower', 
 'Compact tower workstation with Intel Core i9-12900K, 64GB RAM, 1TB SSD, NVIDIA RTX A4000. Half the size of traditional towers with flagship performance.', 
 245000.00, 6, 'Lenovo', 'ThinkStation P360', 'WORKSTATION', 4, true, false, NOW(), NOW()),

-- COMPONENTS (category_id = 5)
('Samsung 980 PRO 2TB NVMe SSD', 
 'High-speed PCIe 4.0 NVMe SSD with read speeds up to 7000 MB/s and write speeds up to 5100 MB/s. Samsung V-NAND technology. 5-year warranty.', 
 18500.00, 50, 'Samsung', '980 PRO 2TB', 'COMPONENT', 5, true, false, NOW(), NOW()),

('Corsair Vengeance DDR5 32GB Kit', 
 'High-performance DDR5-5600 memory kit (2x16GB). Intel XMP 3.0 ready for automatic overclocking. Compact form factor with aluminum heat spreader.', 
 12500.00, 40, 'Corsair', 'CMK32GX5M2B5600C36', 'COMPONENT', 5, true, false, NOW(), NOW()),

('NVIDIA GeForce RTX 4090 24GB', 
 'Ultimate graphics card for AI, rendering, and gaming. 24GB GDDR6X memory, 16384 CUDA cores. Ada Lovelace architecture with DLSS 3 support.', 
 175000.00, 6, 'NVIDIA', 'RTX 4090 Founders Edition', 'COMPONENT', 5, true, true, NOW(), NOW()),

('Kingston Server Premier DDR4 64GB ECC', 
 'Enterprise-grade ECC registered memory module. DDR4-3200 speed, 64GB capacity. Designed for servers and workstations requiring error correction.', 
 28000.00, 25, 'Kingston', 'KSM32RD4/64MER', 'COMPONENT', 5, true, false, NOW(), NOW()),

('Western Digital Red Pro 18TB NAS HDD', 
 'High-capacity NAS hard drive optimized for 24/7 operation. 7200 RPM, 512MB cache. CMR recording technology for reliability. 5-year warranty.', 
 42000.00, 20, 'Western Digital', 'WD181KFGX', 'COMPONENT', 5, true, false, NOW(), NOW()),

('Intel Xeon Gold 6330 Processor', 
 'Enterprise processor with 28 cores, 56 threads. Base frequency 2.0GHz, turbo up to 3.1GHz. 42MB cache, TDP 205W. LGA4189 socket.', 
 195000.00, 8, 'Intel', 'Xeon Gold 6330', 'COMPONENT', 5, true, true, NOW(), NOW());

-- ============================================
-- STEP 3: Get Product IDs for Images
-- Run this query to see product IDs:
-- SELECT id, name FROM products ORDER BY id;
-- ============================================

-- STEP 4: Insert Product Images
-- Replace product_id values with actual IDs from your database
-- ============================================

-- Assuming products are inserted with IDs starting from 1
-- Servers (IDs 1-4)
INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'),
(1, 'https://images.unsplash.com/photo-1484662020986-75935d2ebc66?w=800'),
(2, 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800'),
(2, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800'),
(3, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'),
(4, 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800');

-- Desktop Computers (IDs 5-8)
INSERT INTO product_images (product_id, image_url) VALUES
(5, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'),
(5, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800'),
(6, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'),
(7, 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800'),
(8, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800');

-- Laptops (IDs 9-13)
INSERT INTO product_images (product_id, image_url) VALUES
(9, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'),
(9, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'),
(10, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'),
(10, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'),
(11, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'),
(11, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800'),
(12, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'),
(13, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800');

-- Workstations (IDs 14-16)
INSERT INTO product_images (product_id, image_url) VALUES
(14, 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800'),
(14, 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'),
(15, 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800'),
(16, 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800');

-- Components (IDs 17-22)
INSERT INTO product_images (product_id, image_url) VALUES
(17, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'),
(18, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'),
(19, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'),
(19, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800'),
(20, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800'),
(21, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'),
(22, 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800');

-- ============================================
-- STEP 5: Insert Product Specifications
-- ============================================

-- Server Specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES
(1, 'Processor', 'Intel Xeon Gold 6330 (28 cores, 2.0GHz)'),
(1, 'Memory', 'Up to 32 DIMM slots, max 8TB DDR4'),
(1, 'Storage', 'Up to 24 NVMe/SAS/SATA drives'),
(1, 'Form Factor', '2U Rack Mount'),
(1, 'Power Supply', 'Dual 800W/1400W/2400W Hot-Plug'),
(2, 'Processor', 'Intel Xeon Scalable 3rd Gen'),
(2, 'Memory', 'Up to 32 DIMM slots, max 8TB DDR4'),
(2, 'Storage', 'Up to 30 SFF or 19 LFF drives'),
(2, 'Form Factor', '2U Rack Mount'),
(2, 'Management', 'HPE iLO 5 with Intelligent Provisioning');

-- Laptop Specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES
(9, 'Processor', 'Intel Core i7-1265U (10 cores, up to 4.8GHz)'),
(9, 'Memory', '16GB DDR4 3200MHz'),
(9, 'Storage', '512GB PCIe NVMe SSD'),
(9, 'Display', '15.6" FHD (1920x1080) Anti-Glare'),
(9, 'Battery', 'Up to 10 hours'),
(11, 'Processor', 'Intel Core i7-1260P (12 cores, up to 4.7GHz)'),
(11, 'Memory', '16GB LPDDR5 5200MHz'),
(11, 'Storage', '512GB PCIe Gen 4 NVMe SSD'),
(11, 'Display', '14" 2.8K OLED (2880x1800) Touch'),
(11, 'Weight', '1.12 kg (2.48 lbs)');

-- Component Specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES
(17, 'Capacity', '2TB'),
(17, 'Interface', 'PCIe Gen 4.0 x4, NVMe 1.3c'),
(17, 'Read Speed', 'Up to 7,000 MB/s'),
(17, 'Write Speed', 'Up to 5,100 MB/s'),
(17, 'Warranty', '5 Years'),
(19, 'CUDA Cores', '16384'),
(19, 'Memory', '24GB GDDR6X'),
(19, 'Memory Bandwidth', '1008 GB/s'),
(19, 'Power', '450W TDP'),
(19, 'Architecture', 'Ada Lovelace');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check inserted categories
-- SELECT id, name, active FROM categories;

-- Check inserted products
-- SELECT id, name, brand, price, type, active, featured FROM products ORDER BY id;

-- Check product images
-- SELECT p.name, pi.image_url FROM products p JOIN product_images pi ON p.id = pi.product_id;

-- Check product specifications
-- SELECT p.name, ps.spec_key, ps.spec_value FROM products p JOIN product_specifications ps ON p.id = ps.product_id;
