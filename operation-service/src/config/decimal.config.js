import Decimal from 'decimal.js';

// global configuration
Decimal.set({
  precision: 20, // internal presition
  rounding: Decimal.ROUND_HALF_UP, // round mode up
  toExpNeg: -9,             
  toExpPos: 20
});

export default Decimal;
