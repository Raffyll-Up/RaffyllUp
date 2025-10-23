// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

library RaffleHelpers {
    error NoWinners();

    // Equal distribution helper: splits total into n shares, distributing remainder by +1 wei to first rem winners
    function _equalShares(uint256 total, uint256 n) internal pure returns (uint256[] memory shares) {
        if (n == 0) revert NoWinners();
        shares = new uint256[](n);
        uint256 base = total / n;
        uint256 rem = total - (base * n);
        for (uint256 i = 0; i < n; i++) {
            shares[i] = base + (i < rem ? 1 : 0);
        }
    }

    function _selectWinners(address[] memory pool, uint32 k, bytes32 seed) internal pure returns (address[] memory) {
        address[] memory res = new address[](k);
        uint256 n = pool.length;
        for (uint256 i = 0; i < k; i++) {
            uint256 r = uint256(keccak256(abi.encode(seed, i))) % (n - i);
            address tmp = pool[i];
            pool[i] = pool[i + r];
            pool[i + r] = tmp;
            res[i] = pool[i];
        }
        return res;
    }
}
