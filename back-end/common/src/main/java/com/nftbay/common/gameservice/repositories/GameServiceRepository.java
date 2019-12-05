package com.nftbay.common.gameservice.repositories;

import com.nftbay.common.gameservice.models.GameServiceModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface GameServiceRepository extends CrudRepository<GameServiceModel, Integer> {

    List<GameServiceModel> findAllByDeletedIsNull();
}
