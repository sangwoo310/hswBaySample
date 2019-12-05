package com.nftbay.common.nodeos;

import com.nftbay.common.nodeos.remote.NodeosApi;
import com.nftbay.common.nodeos.remote.model.api.AccountInfoRequest;
import com.nftbay.common.nodeos.remote.model.api.EosChainInfo;
import com.nftbay.common.nodeos.remote.model.api.GetBlockInfoRequest;
import com.google.gson.JsonObject;
import com.nftbay.common.nodeos.remote.model.api.GetTableRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.ArrayList;
import java.util.List;

@Component
public class NodeosClient {

    private List<NodeosApi> nodeosApiList;

    private NodeosApi nodeosClient;

    @Autowired
    public NodeosClient(@Qualifier("nodeosApis") List<NodeosApi> nodeosApiList, @Qualifier("generalNodeosClient") NodeosApi nodeosClient) {
        this.nodeosApiList = nodeosApiList;
        this.nodeosClient = nodeosClient;
    }

    public Mono<EosChainInfo> getChainInfo() {
        List<Mono<EosChainInfo>> monos = new ArrayList<>();

        for (NodeosApi nodeosApi : nodeosApiList) {
            Mono<EosChainInfo> mono = nodeosApi.readInfo("get_info").onErrorReturn(new EosChainInfo());
            monos.add(mono);
        }

        return Mono.zip(monos, args -> {
            for (Object arg : args) {
                if (((EosChainInfo) arg).getHeadBlockNum() != null && ((EosChainInfo) arg).getHeadBlockNum() > 0) {
                    return (EosChainInfo) arg;
                }
            }

            return new EosChainInfo();
        }).subscribeOn(Schedulers.parallel());
    }

    public Mono<JsonObject> getBlockInfo(String blockNumOrId) {
        List<Mono<JsonObject>> monos = new ArrayList<>();

        for (NodeosApi nodeosApi : nodeosApiList) {
            Mono<JsonObject> mono = nodeosApi.getBlockInfo(GetBlockInfoRequest.builder().blockNumOrId(blockNumOrId).build())
                    .onErrorReturn(new JsonObject());
            monos.add(mono);
        }

        return getMonoRequest(monos, "id");
    }

    public Mono<JsonObject> getAccountInfo(String accountName) {
        List<Mono<JsonObject>> monos = new ArrayList<>();

        for (NodeosApi nodeosApi : nodeosApiList) {
            Mono<JsonObject> mono = nodeosApi
                    .getAccountInfo(AccountInfoRequest.builder().account_name(accountName).build())
                    .onErrorReturn(new JsonObject());
            monos.add(mono);
        }

        return getMonoRequest(monos, "account_name");
    }

    public Mono<JsonObject> getTableRows(GetTableRequest tableRequest) {
        List<Mono<JsonObject>> monos = new ArrayList<>();

        Mono<JsonObject> mono = nodeosClient.getTable(tableRequest)
                .onErrorReturn(new JsonObject());
        monos.add(mono);

        return getMonoRequest(monos, "rows");
    }

    private Mono<JsonObject> getMonoRequest(List<Mono<JsonObject>> monos, String hasCheckField) {
        return Mono.zip(monos, args -> {
            for (Object arg : args) {
                if (((JsonObject) arg).has(hasCheckField)) {
                    return (JsonObject) arg;
                }
            }

            return new JsonObject();
        }).subscribeOn(Schedulers.parallel());
    }
}
