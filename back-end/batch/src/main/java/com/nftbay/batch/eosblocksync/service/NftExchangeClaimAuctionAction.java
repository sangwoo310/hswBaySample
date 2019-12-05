package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.nftbay.common.Constants;
import com.nftbay.common.bidding.EnumBiddingState;
import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.bidding.repositories.BiddingHistoryRepository;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.nodeos.remote.model.api.GetTableRequest;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.List;

@Component
public class NftExchangeClaimAuctionAction extends NftExchangeAction {

    private static final String ACTION_NAME = "claim";

    private TradeRepository tradeRepository;
    private BiddingHistoryRepository biddingHistoryRepository;

    private NodeosClient nodeosClient;

    @Value("${nodeos.account_name.nft_exchange_contract}")
    private String nftExchangeContract;

    public NftExchangeClaimAuctionAction(TradeRepository tradeRepository,
                                  BiddingHistoryRepository biddingHistoryRepository, NodeosClient nodeosClient) {
        this.tradeRepository = tradeRepository;
        this.biddingHistoryRepository = biddingHistoryRepository;
        this.nodeosClient = nodeosClient;
    }

    @Override
    String getAccountName() {
        return nftExchangeContractAccountName;
    }

    @Override
    String getActionName() {
        return ACTION_NAME;
    }

    @Override
    public void parse(JsonElement jsonActionElement, String transactionId) {
        if (!jsonActionElement.getAsJsonObject().get("data").isJsonObject()) {
            return;
        }

        JsonObject data = jsonActionElement.getAsJsonObject().get("data").getAsJsonObject();

        String actor = data.get("actor").getAsString();
        String account = data.get("account").getAsString();
        long tradeId = data.get("trade_id").getAsLong();

        TradeModel tradeModel = tradeRepository.findByContractTradeId(tradeId);

        if (tradeModel == null) {
            return;
        }

        // get trade table
         JsonObject tradeTaleObject = nodeosClient.getTableRows(GetTableRequest.builder()
                .json(true)
                .code(nftExchangeContract)
                .scope(nftExchangeContract)
                .table(Constants.NFT_TRADES_TABLE)
                .lower_bound(String.valueOf(tradeId))
                .upper_bound(String.valueOf(tradeId))
                .table_key("")
                .key_type("i64")
                .index_position(1)
                .limit(1)
                .build()).block();

        if (tradeTaleObject == null) {
            return;
        }

        JsonArray trades = tradeTaleObject.get("rows").getAsJsonArray();

        if (trades.size() == 0) {
            return;
        }

        JsonObject tradeObj = trades.get(0).getAsJsonObject();

        EnumTradeState tradeState = EnumTradeState.valueOf(tradeObj.get("state").getAsString().toUpperCase());

        tradeModel.setOwner(tradeObj.get("owner").getAsString());
        tradeModel.setBuyer(tradeObj.get("owner").getAsString());
        tradeModel.setCurrentPrice(Float.parseFloat(tradeObj.get("current_price").getAsString().split(" ")[0]));
        tradeModel.setState(tradeState);
        tradeModel.setUpdated(Calendar.getInstance().getTime());

        tradeRepository.save(tradeModel);

        List<BiddingHistoryModel> biddingHistoryModel = biddingHistoryRepository.findByBidderAndTradeIdOrderByCreatedDesc(tradeModel.getOwner(), tradeModel.getId());

        if (biddingHistoryModel.size() == 0) {
            return;
        }

        biddingHistoryModel.get(0).setState(EnumBiddingState.WINNING);
        biddingHistoryModel.get(0).setUpdated(Calendar.getInstance().getTime());

        biddingHistoryRepository.save(biddingHistoryModel.get(0));

        // 다른 유저들은 낙찰
        List<BiddingHistoryModel> biddingHistoryModelList = biddingHistoryRepository.findByTradeId(tradeModel.getId());

        for (BiddingHistoryModel historyModel : biddingHistoryModelList) {
            if (historyModel.getState() != EnumBiddingState.WINNING) {
                historyModel.setState(EnumBiddingState.MISCARRY);
                historyModel.setUpdated(Calendar.getInstance().getTime());
            }
        }

        biddingHistoryRepository.saveAll(biddingHistoryModelList);
    }
}
