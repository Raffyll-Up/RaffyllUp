// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IERC20 } from "../interfaces/IERC20.sol";

library SafeTransferLib {
    function safeTransfer(IERC20 token, address to, uint256 amount) internal {
        bool ok = token.transfer(to, amount);
        require(ok, "TRANSFER_FAILED");
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint256 amount) internal {
        bool ok = token.transferFrom(from, to, amount);
        require(ok, "TRANSFER_FROM_FAILED");
    }

    function safeApprove(IERC20 token, address spender, uint256 amount) internal {
        bool ok = token.approve(spender, amount);
        require(ok, "APPROVE_FAILED");
    }

    function safeTransferETH(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success, "ETH_TRANSFER_FAILED");
    }
}