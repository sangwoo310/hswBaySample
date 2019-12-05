package com.nftbay.common.gamedata.repositories;

import com.nftbay.common.gamedata.model.UTItemModel;
import org.springframework.data.repository.CrudRepository;

public interface UTItemRepository extends GameInfoBaseRepository<UTItemModel>, CrudRepository<UTItemModel, Long> {
}
