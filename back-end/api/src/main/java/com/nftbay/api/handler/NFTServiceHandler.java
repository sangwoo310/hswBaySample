package com.nftbay.api.handler;

        import com.nftbay.common.gameservice.models.GameServiceModel;
        import com.nftbay.common.gameservice.repositories.GameServiceReactiveRepository;
        import org.springframework.http.MediaType;
        import org.springframework.stereotype.Component;
        import org.springframework.web.reactive.function.server.ServerRequest;
        import org.springframework.web.reactive.function.server.ServerResponse;
        import reactor.core.publisher.Mono;

        import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
        import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Component
public class NFTServiceHandler {

    private GameServiceReactiveRepository gameServiceReactiveRepository;

    public NFTServiceHandler(GameServiceReactiveRepository gameServiceReactiveRepository) {
        this.gameServiceReactiveRepository = gameServiceReactiveRepository;
    }

    public Mono<ServerResponse> getServices(ServerRequest serverRequest) {
        return ok().contentType(MediaType.APPLICATION_JSON)
                .body(gameServiceReactiveRepository.getGameServices(), GameServiceModel.class)
                .switchIfEmpty(notFound().build());
    }
}
