package com.nftbay.api.handler;

import com.nftbay.api.handler.response.BlockStateResponse;
import com.nftbay.api.support.PageModel;
import com.nftbay.common.blockstate.BlockState;
import com.nftbay.common.blockstate.model.BlockIndexStateModel;
import com.nftbay.common.blockstate.repository.BlockIndexStateRepository;
import com.nftbay.common.nodeos.NodeosClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.web.reactive.function.BodyInserters.fromObject;
import static org.springframework.web.reactive.function.server.ServerResponse.notFound;
import static org.springframework.web.reactive.function.server.ServerResponse.ok;

@Component
public class ServerStateHandler {

    private BlockIndexStateRepository blockIndexStateRepository;
    private NodeosClient nodeosClient;

    @Autowired
    public ServerStateHandler(BlockIndexStateRepository blockIndexStateRepository, NodeosClient nodeosClient) {
        this.blockIndexStateRepository = blockIndexStateRepository;
        this.nodeosClient = nodeosClient;
    }

    public Mono<ServerResponse> getHealth(ServerRequest request) {
        Mono<BlockState> mono = Mono.fromCallable(() -> {
            BlockIndexStateModel blockIndexStateModel = blockIndexStateRepository.findById(1).orElse(null);

            if (blockIndexStateModel != null) {
                return new BlockState("server", blockIndexStateModel.getBlockNum());
            }

            return new BlockState("server", 0L);
        });

        Mono<BlockState> mono2 = nodeosClient.getChainInfo().map(eosChainInfo -> new BlockState("eos", eosChainInfo.getHeadBlockNum()));

        List<Mono<BlockState>> monos = Arrays.asList(mono, mono2);

        return Mono.zip(monos, args -> {
            BlockStateResponse response = new BlockStateResponse();

            for (Object arg : args) {
                BlockState blockState = (BlockState) arg;

                if ("server".equalsIgnoreCase(blockState.getName())) {
                    response.setServerState(blockState);
                } else {
                    response.setEosState(blockState);
                }
            }

            return response;
        })
        .flatMap(state -> ok().contentType(APPLICATION_JSON)
        .body(fromObject(state))
        .switchIfEmpty(notFound().build()));
    }
}
