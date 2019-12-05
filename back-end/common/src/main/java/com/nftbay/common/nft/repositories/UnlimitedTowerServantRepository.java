package com.nftbay.common.nft.repositories;

import com.nftbay.common.nft.models.NFTUTServantModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UnlimitedTowerServantRepository extends NFTBaseRepository<NFTUTServantModel>, CrudRepository<NFTUTServantModel, Long> {

    NFTUTServantModel findTopByContractTableId(Long NftTokenId);
}
