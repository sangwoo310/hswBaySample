package com.nftbay.common.gamedata.repositories;

import com.nftbay.common.gamedata.model.GameInfoModel;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GameInfoRepository extends GameInfoBaseRepository<GameInfoModel>, CrudRepository<GameInfoModel, Long> {

    @Query("select distinct g.name from GameInfoModel g where lower(g.name) like %?1% order by g.name asc")
    List<GameInfoModel> findByNameContainingIgnoreCaseAndDeletedIsNull(String name);
}
