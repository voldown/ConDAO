// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Condo Registry Contract 
/// @notice Condo units being registered as NFTs, which can later be transferred to homeowners
/// @dev Only the estate developer is able to mint NFTs; homeowners can only transfer
contract CondoRegistry is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

    uint256 immutable maxSupply;

    event MintedNFT(uint256 indexed tokenId, string tokenURI);

    /// @dev _tokenIdCounter starts from 1, which naturally corresponds to the real-world condo unit #1
    constructor(uint256 _maxSupply) ERC721("CondoRegistry", "CONDO") {
        maxSupply = _maxSupply;    
    }

    /// @dev With this function, owner can only mint maxSupply amount NFTs, since there is only limited units in our condo for simplicity
    /// @param _tokenURI The token URI of the condo_unit metadata
    /// @return tokenId The tokenID of the corresponding assets
    function safeMint(address to, uint256 tokenId, string memory _tokenURI) public onlyOwner returns (uint256) {
        require((tokenId > 0 && tokenId <= maxSupply), "Minting NFTs more than maxSupply is not allowed.");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        emit MintedNFT(tokenId, _tokenURI);

        return tokenId;
    }

    function maxTotalSupply()
        public
        view
        returns (uint256)
    {
        return maxSupply;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }


    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

