CREATE TABLE IF NOT EXISTS currency_rates
(
  id INTEGER PRIMARY KEY autoincrement,
  timestamp INTEGER NOT NULL,
  currency text NOT NULL,
  buy_rate text NOT NULL,
  sale_rate text NOT NULL
);