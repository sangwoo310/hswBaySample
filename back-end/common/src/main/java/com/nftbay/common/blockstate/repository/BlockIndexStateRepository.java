package com.nftbay.common.blockstate.repository;

import com.nftbay.common.blockstate.model.BlockIndexStateModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockIndexStateRepository extends CrudRepository<BlockIndexStateModel, Integer> {
}
