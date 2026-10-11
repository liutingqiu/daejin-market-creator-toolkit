import { OutcomeSide, MarketSpec, PositionQuote, ResolutionResult } from '../types.js';
export declare class DaejinSharedPoolEngine {
    /**
     * Evaluates dynamic pricing and projected payout in a shared-pool prediction market.
     * In a parimutuel / shared-pool design:
     * Prob(YES) = YesPool / (YesPool + NoPool)
     * If YES wins, all YES contributors split the total post-fee pool proportionally to their stake.
     */
    static quotePosition(spec: MarketSpec, side: OutcomeSide, investAmountUSD: number): PositionQuote;
    /**
     * Resolves the market with published proof source and calculates distributions.
     */
    static resolveMarket(spec: MarketSpec, winningSide: OutcomeSide): ResolutionResult;
}
