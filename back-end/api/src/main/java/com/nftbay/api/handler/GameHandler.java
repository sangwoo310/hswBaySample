package com.nftbay.api.handler;

import com.nftbay.api.support.PageModel;
import com.nftbay.common.gamedata.repositories.GameInfoRepository;
import com.nftbay.common.gamedata.repositories.UTItemRepository;
import com.nftbay.common.gamedata.repositories.UTMonsterRepository;
import com.nftbay.common.gamedata.repositories.UTServantRepository;
import com.nftbay.common.nft.models.NFTUTItemModel;
import com.nftbay.common.nft.models.NFTUTMonsterModel;
import com.nftbay.common.nft.models.NFTUTServantModel;
import com.nftbay.common.nft.repositories.UnlimitedTowerItemRepository;
import com.nftbay.common.nft.repositories.UnlimitedTowerMonsterRepository;
import com.nftbay.common.nft.repositories.UnlimitedTowerServantRepository;
import com.nftbay.common.trade.models.Ranking;
import com.nftbay.common.trade.repositories.TradeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.MediaType.sortByQualityValue;
import static org.springframework.web.reactive.function.BodyInserters.fromObject;
import static org.springframework.web.reactive.function.server.ServerResponse.*;

@Component
public class GameHandler {

    private GameInfoRepository gameInfoRepository;
    private UTItemRepository utItemRepository;
    private UTMonsterRepository utMonsterRepository;
    private UTServantRepository utServantRepository;
    private TradeRepository tradeRepository;
    private UnlimitedTowerItemRepository unlimitedTowerItemRepository;
    private UnlimitedTowerMonsterRepository unlimitedTowerMonsterRepository;
    private UnlimitedTowerServantRepository unlimitedTowerServantRepository;

    public GameHandler(GameInfoRepository gameInfoRepository, UTItemRepository utItemRepository,
            UTMonsterRepository utMonsterRepository, UTServantRepository utServantRepository,
            TradeRepository tradeRepository, UnlimitedTowerItemRepository unlimitedTowerItemRepository,
            UnlimitedTowerMonsterRepository unlimitedTowerMonsterRepository, UnlimitedTowerServantRepository unlimitedTowerServantRepository) {
        this.gameInfoRepository = gameInfoRepository;
        this.utItemRepository = utItemRepository;
        this.utMonsterRepository = utMonsterRepository;
        this.utServantRepository = utServantRepository;
        this.tradeRepository = tradeRepository;
        this.unlimitedTowerItemRepository = unlimitedTowerItemRepository;
        this.unlimitedTowerMonsterRepository = unlimitedTowerMonsterRepository;
        this.unlimitedTowerServantRepository = unlimitedTowerServantRepository;
    }

    public Mono<ServerResponse> searchProducts(ServerRequest request) {
        String query = request.queryParam("q").orElse(null);

        if (!StringUtils.isEmpty(query)) {
            return Mono.fromCallable(() -> gameInfoRepository.findByNameContainingIgnoreCaseAndDeletedIsNull(query.toLowerCase()))
                .flatMap(gameInfos -> ok().contentType(APPLICATION_JSON)
                    .body(fromObject(gameInfos))
                    .switchIfEmpty(notFound().build()));
        }

        return notFound().build();
    }

    public Mono<ServerResponse> getProduct(ServerRequest request) {
        String productType = request.pathVariable("productType");
        String productId = request.pathVariable("productId");
        String type = request.queryParam("type").orElse(null);
        Mono mono = null;

        long prodId = 0;

        if (!StringUtils.isEmpty(productId)) {
            try {
                prodId = Long.parseLong(productId);
            } catch (NumberFormatException e) {
                return badRequest().build();
            }
        }

        long finalProdId = prodId;

        if ("game".equalsIgnoreCase(type)) {
            if ("uts".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> utServantRepository.findById(finalProdId));
            } else if ("uti".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> utItemRepository.findById(finalProdId));
            } else if ("utm".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> utMonsterRepository.findById(finalProdId));
            } else {
                return notFound().build();
            }
        } else {
            if ("uts".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> {
                    NFTUTServantModel nftutServantModel = unlimitedTowerServantRepository.findTopByContractTableId(finalProdId);

                    return nftutServantModel.getGameInfoId();
                }).map(id -> utServantRepository.findById(id));
            } else if ("uti".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> {
                    NFTUTItemModel nftutItemModel = unlimitedTowerItemRepository.findTopByNftTokenId(finalProdId);

                    return nftutItemModel.getGameInfoId();
                }).map(id -> utItemRepository.findById(id));
            } else if ("utm".equalsIgnoreCase(productType)) {
                mono = Mono.fromCallable(() -> {
                    NFTUTMonsterModel nftutMonsterModel = unlimitedTowerMonsterRepository.findTopByNftTokenId(finalProdId);

                    return nftutMonsterModel.getGameInfoId();
                }).map(id -> utMonsterRepository.findById(id));
            } else {
                return notFound().build();
            }
        }



        return mono.flatMap(product -> ok().contentType(APPLICATION_JSON)
            .body(fromObject(product))
            .switchIfEmpty(notFound().build()));
    }

    public Mono<ServerResponse> getRankings(ServerRequest request) {
        String type = request.queryParam("type").orElse(null);

        return Mono.fromCallable(() -> tradeRepository.getRanking())
                .flatMap(rankings -> {
                    List<Ranking> rankingList = rankings.isEmpty() || rankings.get(0)[0] == null ? new ArrayList<>() :
                            rankings.parallelStream().map(item -> {
                                String name = (String) item[0];
                                Double balance = (Double) item[1];

                                return new Ranking(name, balance);
                            }).collect(Collectors.toCollection(ArrayList::new));

                    Page page = new PageImpl(rankingList);

                    return ok().contentType(APPLICATION_JSON)
                            .body(fromObject(PageModel.of(page)))
                            .switchIfEmpty(notFound().build());
                });
    }
}
