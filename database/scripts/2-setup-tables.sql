\connect ecomm;
SET search_path TO graphql;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone CHAR(12),
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state_abbr CHAR(2) NOT NULL,
    zip_code CHAR(10) NOT NULL,
    created_dtm timestamp with time zone
);

COPY customers (first_name, last_name, email, phone, street_address, city, state_abbr, zip_code, created_dtm)
FROM '/customers.csv' 
WITH (FORMAT csv);

CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    retail_price NUMERIC(5,2) NOT NULL,
    sku CHAR(10)
);

COPY products (product_name,company_name,retail_price,sku)
FROM '/products.csv' 
WITH (FORMAT csv, DELIMITER '|');

CREATE TABLE customer_orders (
    id SERIAL PRIMARY KEY NOT NULL,
    customer_id NUMERIC NOT NULL,
    payment_type VARCHAR(8) NOT NULL,
    ordered_dtm timestamp with time zone,
    shipped_dtm timestamp with time zone
);

COPY customer_orders (customer_id,payment_type,ordered_dtm,shipped_dtm)
FROM '/customer_orders.csv' 
WITH (FORMAT csv, DELIMITER ',');

CREATE TABLE order_line_items (
    order_id NUMERIC,
    product_id NUMERIC,
    quantity NUMERIC,
    PRIMARY KEY (order_id, product_id)
);

COPY order_line_items (order_id,product_id,quantity)
FROM '/order_line_items.csv' 
WITH (FORMAT csv, DELIMITER ',');

