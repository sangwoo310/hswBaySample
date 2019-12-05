package com.nftbay.common.nft.repositories;

import com.nftbay.common.nft.models.NFTModel;
import com.nftbay.common.support.ReactiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public class NFTReactiveRepository extends ReactiveRepository {

    private UnlimitedTowerItemRepository unlimitedTowerItemRepository;
    private UnlimitedTowerMonsterRepository unlimitedTowerMonsterRepository;
    private UnlimitedTowerServantRepository unlimitedTowerServantRepository;

    @Autowired
    public NFTReactiveRepository(UnlimitedTowerItemRepository unlimitedTowerItemRepository,
            UnlimitedTowerMonsterRepository unlimitedTowerMonsterRepository,
            UnlimitedTowerServantRepository unlimitedTowerServantRepository) {
        this.unlimitedTowerItemRepository = unlimitedTowerItemRepository;
        this.unlimitedTowerMonsterRepository = unlimitedTowerMonsterRepository;
        this.unlimitedTowerServantRepository = unlimitedTowerServantRepository;
    }
}
