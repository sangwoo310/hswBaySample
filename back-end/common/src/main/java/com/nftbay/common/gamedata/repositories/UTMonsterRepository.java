package com.nftbay.common.gamedata.repositories;

import com.nftbay.common.gamedata.model.UTMonsterModel;
import org.springframework.data.repository.CrudRepository;

public interface UTMonsterRepository extends GameInfoBaseRepository<UTMonsterModel>, CrudRepository<UTMonsterModel, Long> {
}
