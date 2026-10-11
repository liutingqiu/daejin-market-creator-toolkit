// SPDX-License-Identifier: MIT

export type OutcomeSide = 'YES' | 'NO';

export interface MarketSpec {
  marketId: string;
  question: string;
  category: 'CRYPTO' | 'SPORTS' | 'CULTURE' | 'TECH';
  creatorAddress: string;
  proofSourceUrl: string;
  resolutionTimestamp: number;
  initialYesPoolUSD: number;
  initialNoPoolUSD: number;
  feeBps: number; // e.g. 100 bps = 1%
}

export interface PositionQuote {
  side: OutcomeSide;
  investAmountUSD: number;
  netInvestUSD: number;
  protocolFeeUSD: number;
  creatorFeeUSD: number;
  newYesPoolUSD: number;
  newNoPoolUSD: number;
  currentYesProbabilityPct: number;
  currentNoProbabilityPct: number;
  potentialPayoutUSD: number;
  projectedROI: number;
}

export interface ResolutionResult {
  winningSide: OutcomeSide;
  winningPoolTotalUSD: number;
  losingPoolTotalUSD: number;
  totalDistributedUSD: number;
}
