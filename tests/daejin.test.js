// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { DaejinSharedPoolEngine } from '../dist/index.js';

const mockMarket = {
  marketId: 'sol-1000-2026',
  question: 'Will Solana (SOL) trade above $350 before Dec 31, 2026?',
  category: 'CRYPTO',
  creatorAddress: 'GB2BHZX2SGCNNQVNC3CWSEHGWWJFIARVLDRAHED4IACUKRI5UCWZRN5R',
  proofSourceUrl: 'https://www.coingecko.com/en/coins/solana',
  resolutionTimestamp: 1798761600,
  initialYesPoolUSD: 1000,
  initialNoPoolUSD: 2000,
  feeBps: 200 // 2% fee
};

test('1. quotePosition calculates dynamic odds, creator fees, and potential payout', () => {
  const quote = DaejinSharedPoolEngine.quotePosition(mockMarket, 'YES', 50);

  assert.equal(quote.side, 'YES');
  assert.equal(quote.investAmountUSD, 50);
  assert.equal(quote.protocolFeeUSD, 0.5); // 50 * 0.02 * 0.5
  assert.equal(quote.creatorFeeUSD, 0.5);
  assert.equal(quote.netInvestUSD, 49);

  // New Yes pool = 1000 + 49 = 1049, No = 2000, Total = 3049
  assert.equal(quote.newYesPoolUSD, 1049);
  assert.equal(quote.newNoPoolUSD, 2000);
  assert.ok(quote.currentYesProbabilityPct > 34 && quote.currentYesProbabilityPct < 35);
  assert.ok(quote.potentialPayoutUSD > 140);
  assert.ok(quote.projectedROI > 180);
});

test('2. resolveMarket splits winning shares and audits distributed funds', () => {
  const resolution = DaejinSharedPoolEngine.resolveMarket(mockMarket, 'YES');

  assert.equal(resolution.winningSide, 'YES');
  assert.equal(resolution.winningPoolTotalUSD, 1000);
  assert.equal(resolution.losingPoolTotalUSD, 2000);
  assert.equal(resolution.totalDistributedUSD, 3000);
});

test('3. Rejects non-positive investment stakes', () => {
  assert.throws(() => {
    DaejinSharedPoolEngine.quotePosition(mockMarket, 'NO', 0);
  }, /Investment amount must be greater than zero/);
});
