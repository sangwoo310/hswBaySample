package com.nftbay.common.nft.repositories;

import com.nftbay.common.nft.models.NFTUTMonsterModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UnlimitedTowerMonsterRepository extends NFTBaseRepository<NFTUTMonsterModel>, CrudRepository<NFTUTMonsterModel, Long> {

    NFTUTMonsterModel findTopByNftTokenId(Long NftTokenId);
}
