package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.nftbay.batch.monitoring.SlackClient;
import com.nftbay.common.blockstate.model.BlockIndexStateModel;
import com.nftbay.common.blockstate.repository.BlockIndexStateRepository;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.nodeos.remote.model.api.EosChainInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UtNFTService {

    // 10분
    private static final long MONITORING_BLOCK_SIZE = 2 * 60 * 10;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Value("${nodeos.parallel_get_block_num_size}")
    private long parallelGetBlockNumSize;

    @Value("${nodeos.sync_start_block_num}")
    private long syncStartBlockNum;

    @Value("${nodeos.only_irreversible}")
    private boolean onlyIrreversible;

    private NodeosClient nodeosClient;

    private BlockIndexStateRepository blockIndexStateRepository;

    private AtomicLong blockIndex = new AtomicLong(0);

    private List<NftExchangeAction> nftExchangeActionList;

    private SlackClient slackClient;

    private DecimalFormat df = new DecimalFormat("#,###");

    @Autowired
    public UtNFTService(NodeosClient nodeosClient, BlockIndexStateRepository blockIndexStateRepository,
        List<NftExchangeAction> nftExchangeActionList, SlackClient slackClient) {
        this.nodeosClient = nodeosClient;
        this.blockIndexStateRepository = blockIndexStateRepository;
        this.nftExchangeActionList = nftExchangeActionList;
        this.slackClient = slackClient;
    }

    @Transactional
    public boolean syncNFT() {
        long blockNum = 0;

        if (blockIndex.get() == 0) {
            BlockIndexStateModel blockIndexState = blockIndexStateRepository.findById(1).orElse(null);

            if (blockIndexState == null) {
                blockNum = syncStartBlockNum;
            } else {
                blockNum = syncStartBlockNum > blockIndexState.getBlockNum() ? syncStartBlockNum : blockIndexState.getBlockNum();
            }

            blockIndex.set(blockNum);
        }

        List<Mono<JsonObject>> monos = new ArrayList<>();

        // 입력받은 블록 갯수만큼 병렬러 가져오기
        for (int i = 0; i < parallelGetBlockNumSize; i++) {
            monos.add(nodeosClient.getBlockInfo(String.valueOf(blockIndex.get() + i)));
        }

        final Map<Long, JsonObject> results = Mono.zip(monos, args -> {
            final Map<Long, JsonObject> res = new HashMap<>();

            for (Object arg : args) {
                JsonObject jo = (JsonObject) arg;
                if (jo.has("id")) {
                    res.put(jo.get("block_num").getAsLong(), jo);
                }
            }

            return res;
        }).subscribeOn(Schedulers.parallel()).block();

        JsonObject lastBlockInfo = null;

        for (var idx = 0; idx < parallelGetBlockNumSize; idx++) {
            JsonObject blockInfo = results.get(blockIndex.get());

            // 블록을 못가져올 경우 마지막으로 싱크된 블록 인덱스 저장
            if (blockInfo == null || !blockInfo.has("block_num")) {
                saveSyncBlockIndex(lastBlockInfo);
                return true;
            }

            JsonArray transactions = blockInfo.getAsJsonArray("transactions");

            for (var transaction : transactions) {
                JsonObject transactionObject = transaction.getAsJsonObject();

                if (transactionObject.get("trx") instanceof JsonPrimitive) {
                    continue;
                }

                String transactionId = transactionObject.get("trx").getAsJsonObject().get("id").getAsString();
                JsonArray actionsAsJsonArray = transactionObject.get("trx").getAsJsonObject().get("transaction")
                    .getAsJsonObject().get("actions").getAsJsonArray();

                for (var jsonActionElement : actionsAsJsonArray) {
                    for (var nftExchangeAction : nftExchangeActionList) {
                        if (nftExchangeAction.checkAccountAndActionName(jsonActionElement)) {
                            nftExchangeAction.parse(jsonActionElement, transactionId);
                        }
                    }
                }
            }

            lastBlockInfo = blockInfo;
            blockIndex.addAndGet(1);
        }

        saveSyncBlockIndex(lastBlockInfo);



        return true;
    }

    private void saveSyncBlockIndex(JsonObject lastBlockInfo) {
        if (lastBlockInfo != null) {
            BlockIndexStateModel blockIndexState = blockIndexStateRepository.findById(1).orElse(null);
            if (blockIndexState == null) {
                blockIndexState = BlockIndexStateModel.builder().id(1).build();
            }

            long blockNum = lastBlockInfo.getAsJsonPrimitive("block_num").getAsLong();

            blockIndexState.setBlockNum(blockNum);
            blockIndexState.setBlockHash(lastBlockInfo.getAsJsonPrimitive("id").getAsString());
            blockIndexStateRepository.save(blockIndexState);

            logger.error("block sync : {}", blockNum);
            if (blockNum % MONITORING_BLOCK_SIZE < parallelGetBlockNumSize) {
                EosChainInfo eosChainInfo = nodeosClient.getChainInfo().block();

                long jungleBlockNum = 0;

                if (eosChainInfo != null) {
                    jungleBlockNum = eosChainInfo.getHeadBlockNum();
                }

                slackClient.sendMsg(BatchStatus.COMPLETED, "block sync",
                    "now : " + df.format(blockNum) + ", mainnet : " + df.format(jungleBlockNum));
            }
        }
    }
}
