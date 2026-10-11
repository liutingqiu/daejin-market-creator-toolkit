export class DaejinSharedPoolEngine {
    /**
     * Evaluates dynamic pricing and projected payout in a shared-pool prediction market.
     * In a parimutuel / shared-pool design:
     * Prob(YES) = YesPool / (YesPool + NoPool)
     * If YES wins, all YES contributors split the total post-fee pool proportionally to their stake.
     */
    static quotePosition(spec, side, investAmountUSD) {
        if (investAmountUSD <= 0) {
            throw new Error('Investment amount must be greater than zero');
        }
        const totalFee = investAmountUSD * (spec.feeBps / 10000);
        const creatorFee = totalFee * 0.5; // 50% of fees to market creator
        const protocolFee = totalFee * 0.5;
        const netInvest = investAmountUSD - totalFee;
        const newYes = side === 'YES' ? spec.initialYesPoolUSD + netInvest : spec.initialYesPoolUSD;
        const newNo = side === 'NO' ? spec.initialNoPoolUSD + netInvest : spec.initialNoPoolUSD;
        const totalPool = newYes + newNo;
        const currentYesProbabilityPct = Number(((newYes / totalPool) * 100).toFixed(2));
        const currentNoProbabilityPct = Number(((newNo / totalPool) * 100).toFixed(2));
        // Potential payout if this side wins: (userNetStake / winningSidePool) * totalPool
        const winningPool = side === 'YES' ? newYes : newNo;
        const potentialPayoutUSD = Number(((netInvest / winningPool) * totalPool).toFixed(2));
        const projectedROI = Number((((potentialPayoutUSD - investAmountUSD) / investAmountUSD) * 100).toFixed(2));
        return {
            side,
            investAmountUSD,
            netInvestUSD: netInvest,
            protocolFeeUSD: protocolFee,
            creatorFeeUSD: creatorFee,
            newYesPoolUSD: newYes,
            newNoPoolUSD: newNo,
            currentYesProbabilityPct,
            currentNoProbabilityPct,
            potentialPayoutUSD,
            projectedROI
        };
    }
    /**
     * Resolves the market with published proof source and calculates distributions.
     */
    static resolveMarket(spec, winningSide) {
        const total = spec.initialYesPoolUSD + spec.initialNoPoolUSD;
        return {
            winningSide,
            winningPoolTotalUSD: winningSide === 'YES' ? spec.initialYesPoolUSD : spec.initialNoPoolUSD,
            losingPoolTotalUSD: winningSide === 'YES' ? spec.initialNoPoolUSD : spec.initialYesPoolUSD,
            totalDistributedUSD: total
        };
    }
}
