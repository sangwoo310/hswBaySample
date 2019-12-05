package com.nftbay.common.nft.repositories;

import com.nftbay.common.nft.models.NFTUTItemModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UnlimitedTowerItemRepository extends NFTBaseRepository<NFTUTItemModel>, CrudRepository<NFTUTItemModel, Long> {

    NFTUTItemModel findTopByNftTokenId(Long NftTokenId);
}
