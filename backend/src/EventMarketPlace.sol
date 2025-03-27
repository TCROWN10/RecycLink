// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;


interface USDToken {
    
    function balanceOf(address account) external view returns (uint256);

    function transferFrom(address from, address to, uint256 value) external returns (bool);

    function burn(address userAccount,uint256 amountToBurn) external ;
}

interface RecycLink {
    function getAdmins() external view returns (address[] memory);
}

/**
 * @title MarketPlace: A smart contract for managing item listings in a marketplace.
 * @author Tcrown , Graphic Doc , Ayobmin
 * @dev This MarketPlace contract allows users who have recycled their pet Bottles to easily redeem their receipt tokens.
 */
contract EventMarketPlace {
    /// @dev Structure to represent information about an item listing.
    struct ItemInfo {
        string name;
        string description;
        string image;
        uint256 price;
        uint256 deadline;
        address lister;
        uint256 itemId;
    }

    struct Transaction {
        uint date;
        Type typeOfTransaction;
        uint amountOfTokensTransfered;
        string itemName;
        uint itemPrice;
        uint itemId;
        uint qty;
    }

    struct Statistics {
        uint totalUsers;
        uint totalAdmins;
        uint totalVerifiers;
        uint totalRecycled;
        uint totalTransactions;
        uint totalMarketplaceEvents;
        uint totalExpiredMarketplaceEvents;
        uint totalMinted;
        uint totalSupply;
    }

    enum Type {
        Recycle,
        Purchase
    }

    mapping(address => Transaction[]) transactions;

    /// @dev Mapping to store item information by their unique listing ID.
    mapping(uint256 => ItemInfo) public itemInfoToId;

    /// @dev The address of the administrator of the marketplace.
    address public admin;

    /// @dev The ID to assign to the next listing.
    uint256 public listingId;

    /* ERRORS */

    error MinPriceTooLow();
    error DeadlineTooSoon();
    error MinDurationNotMet();
    error InvalidSignature();
    error ListingDoesNotExist();
    error ListingNotActive();
    error PriceNotMet(int256 difference);
    error ListingExpired();
    error PriceMismatch(uint256 originalPrice);
    error NoImageUrl();
    error NotAdmin();
    error NotEnoughToken();

    /* EVENTS */
    event ListingCreated(string indexed _name,
        string _description,
        string _image,
        uint indexed _price,
        uint indexed _deadline);

    event ListingEdited(string indexed _name,
        string _description,
        string _image,
        uint listingId,
        uint indexed _price,
        uint indexed _deadline);

    event ListingBought(string indexed _name,
        uint listingId,
        uint indexed _price,
        uint quantity);

    

    USDToken usdt;
    RecycLink RecycLink;

    Statistics statistics;

    constructor(address tokenAddress, address RecycLinkAddr) {
        usdt = USDToken(tokenAddress);
        RecycLink = RecycLink(RecycLinkAddr);
    }

    modifier onlyAdmins() {
        bool isAdmin;
        for (uint i = 0; i < RecycLink.getAdmins().length; i++) {
            if (RecycLink.getAdmins()[i] == msg.sender) {
                isAdmin = true;
            }
        }
        require(isAdmin, "Not Admin");
        _;
    }

    function createListing(
        string calldata _name,
        string calldata _description,
        string calldata _image,
        uint _price,
        uint _deadline
    ) public onlyAdmins {
        if (_price < 0.01 ether) revert MinPriceTooLow();
        if (block.timestamp + _deadline <= block.timestamp)
            revert DeadlineTooSoon();
        if (_deadline - block.timestamp < 60 minutes)
            revert MinDurationNotMet();
        if (keccak256(abi.encode(_image)) == keccak256(abi.encode("")))
            revert NoImageUrl();
        // Append item information to storage.
        // append to Storage
        listingId++;
        ItemInfo storage newItemInfo = itemInfoToId[listingId];
        newItemInfo.name = _name;
        newItemInfo.description = _description;
        newItemInfo.image = _image;
        newItemInfo.price = _price;
        newItemInfo.deadline = _deadline;
        newItemInfo.lister = msg.sender;
        newItemInfo.itemId = listingId;
        emit ListingCreated(_name, _description, _image, _price, _deadline);
    }

    /// @dev Buy an item from the marketplace.
    /// @param _listingId The unique identifier of the item listing to buy.
    function buyListing(uint256 _listingId, uint256 quantity) public {
        ItemInfo memory newItemInfo = itemInfoToId[_listingId];
        if (newItemInfo.itemId != _listingId) revert ListingDoesNotExist();
        if (block.timestamp > newItemInfo.deadline) revert ListingNotActive();

        uint256 totalPrice = newItemInfo.price * quantity;
        if (usdt.balanceOf(msg.sender) < totalPrice)
            revert NotEnoughToken();

        // transfer tokens from buyer to seller
        usdt.transferFrom(msg.sender, address(this), totalPrice);

        // burn the tokens collected
        usdt.burn(address(this), totalPrice);

        // Create a new transaction
        Transaction memory transaction;
        transaction.date = block.timestamp;
        transaction.typeOfTransaction = Type.Purchase;
        transaction.amountOfTokensTransfered = totalPrice;
        transaction.itemId = newItemInfo.itemId;
        transaction.itemName = newItemInfo.name;
        transaction.itemPrice = newItemInfo.price;
        transaction.qty = quantity;

        // Store the transaction
        transactions[msg.sender].push(transaction);

        Statistics memory _stats;
        // Increase the transactions
        _stats.totalTransactions = statistics.totalTransactions + 1;
        statistics.totalTransactions = _stats.totalTransactions;

        emit ListingBought(newItemInfo.name, listingId, newItemInfo.price, quantity);
    }

    /**
     * @dev Update the information of an existing item listing.
     * @param _name  The new name of the item.
     * @param _description New description of the item.
     * @param _listingId The unique identifier of the item listing to update.
     * @param _newPrice New price for the item.
     */
    function updateListing(
        string calldata _name,
        string calldata _description,
        string calldata _image,
        uint256 _listingId,
        uint256 _newPrice,
        uint256 _deadline
    ) public onlyAdmins {
        if (_listingId > listingId) revert ListingDoesNotExist();
        ItemInfo storage itemInfo = itemInfoToId[_listingId];
        itemInfo.name = _name;
        itemInfo.description = _description;
        itemInfo.image = _image;
        itemInfo.price = _newPrice;
        itemInfo.deadline = _deadline;
        emit ListingEdited(_name, _description, _image, listingId, _newPrice, _deadline);
    }

    /**
     * @dev Get information about an item listing by its unique identifier.
     * @param _listingId The unique identifier of the item listing.
     * @return ItemInfo The information about the item listing.
     */
    function getItemInfo(
        uint256 _listingId
    ) public view returns (ItemInfo memory) {
        return itemInfoToId[_listingId];
    }

    function getAllItemInfo() public view returns (ItemInfo[] memory) {
        ItemInfo[] memory allItemInfo = new ItemInfo[](listingId);
        for (uint i = 0; i < listingId; i++) {
            allItemInfo[i] = itemInfoToId[i + 1];
        }
        return allItemInfo;
    }

    function getAllActiveItemInfo() public view returns (ItemInfo[] memory) {
        uint activeItemsLength;
        for (uint i = 0; i < listingId; i++) {
            ItemInfo memory itemInfo = itemInfoToId[i + 1];
            if (block.timestamp < itemInfo.deadline) {
                activeItemsLength++;
            }
        }
        ItemInfo[] memory allActiveItemInfo = new ItemInfo[](activeItemsLength);
        uint index;
        for (uint i = 0; i < listingId; i++) {
            ItemInfo memory itemInfo = itemInfoToId[i + 1];
            if (block.timestamp < itemInfo.deadline) {
                allActiveItemInfo[index] = itemInfoToId[i + 1];
                index++;
            }
        }
        return allActiveItemInfo;
    }

    function getEventsByUser(
        address userAddr
    ) public view returns (Transaction[] memory) {
        return transactions[userAddr];
    }

    function getUserTransactions() public view returns (Transaction[] memory) {
        return transactions[msg.sender];
    }
}