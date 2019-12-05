package com.nftbay.common.gameservice.repositories;

import com.nftbay.common.gameservice.models.GameServiceModel;
import com.nftbay.common.support.ReactiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public class GameServiceReactiveRepository extends ReactiveRepository {

    private GameServiceRepository gameServiceRepository;

    @Autowired
    public GameServiceReactiveRepository(GameServiceRepository gameServiceRepository) {
        this.gameServiceRepository = gameServiceRepository;
    }

    public Flux<GameServiceModel> getGameServices() {
        var defer = Flux.defer(() -> Flux.fromIterable(gameServiceRepository.findAllByDeletedIsNull()));

        return defer.subscribeOn(jdbcScheduler);
    }
}
