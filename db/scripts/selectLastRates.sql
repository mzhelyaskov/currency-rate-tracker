select max(id), buy_rate, sale_rate
from currency_rates
where currency = ? limit 1;