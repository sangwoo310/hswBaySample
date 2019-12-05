package com.nftbay.common.gamedata.repositories;

import com.nftbay.common.gamedata.model.UTServantModel;
import org.springframework.data.repository.CrudRepository;

public interface UTServantRepository extends GameInfoBaseRepository<UTServantModel>, CrudRepository<UTServantModel, Long> {
}
