package com.nftbay.common.gamedata.repositories;

import com.nftbay.common.gamedata.model.GameInfoModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface GameInfoBaseRepository<T extends GameInfoModel> extends CrudRepository<T, Long> {

    @Query(value = "select t from #{#entityName} as t where t.deleted is null", countQuery = "select count(t) from #{#entityName} as t where t.deleted is null")
    Page<T> findByDeletedIsNull(Pageable pageable);
}