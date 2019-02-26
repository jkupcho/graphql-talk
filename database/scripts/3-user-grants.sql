\connect ecomm;

GRANT USAGE ON SCHEMA graphql TO ecommapp;

GRANT ALL ON ALL TABLES IN SCHEMA graphql TO ecommapp;
GRANT ALL ON ALL SEQUENCES IN SCHEMA graphql TO ecommapp;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA graphql TO ecommapp;