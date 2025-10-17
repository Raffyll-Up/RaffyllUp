// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library RewardsLib {
    function equalShares(uint256 total, uint256 winners) internal pure returns (uint256[] memory) {
        require(winners > 0, "NO_WINNERS");
        uint256[] memory amounts = new uint256[](winners);
        uint256 base = total / winners;
        uint256 rem = total % winners;
        for (uint256 i = 0; i < winners; i++) {
            amounts[i] = base;
        }
        // Distribute remainder to first recipients to avoid dust
        for (uint256 i = 0; i < rem; i++) {
            amounts[i] += 1;
        }
        return amounts;
    }

    function validateCustomShares(uint256[] memory amounts, uint256 total) internal pure returns (bool) {
        uint256 sum;
        for (uint256 i = 0; i < amounts.length; i++) {
            sum += amounts[i];
        }
        return sum == total;
    }
}