package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.nftbay.common.Constants;
import com.nftbay.common.bidding.EnumBiddingState;
import com.nftbay.common.bidding.EnumBiddingType;
import com.nftbay.common.bidding.models.BiddingHistoryModel;
import com.nftbay.common.bidding.repositories.BiddingHistoryReactiveRepository;
import com.nftbay.common.bidding.repositories.BiddingHistoryRepository;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.nodeos.remote.model.api.GetTableRequest;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.List;

@Slf4j
@Component
public class NftExchangeBidAction extends NftExchangeAction {

    private static final String BIDDING = "bid";
    private static final String BUYITNOW = "buyitnow";

    private static final String ACTION_NAME = "transfer";
    private static final String CONTRACT_ACCOUNT = "eosio.token";

    private TradeRepository tradeRepository;
    private BiddingHistoryRepository biddingHistoryRepository;

    private NodeosClient nodeosClient;

    @Value("${nodeos.account_name.nft_exchange_contract}")
    private String nftExchangeContract;

    @Autowired
    public NftExchangeBidAction(TradeRepository tradeRepository, BiddingHistoryRepository biddingHistoryRepository, NodeosClient nodeosClient) {
        this.tradeRepository = tradeRepository;
        this.biddingHistoryRepository = biddingHistoryRepository;
        this.nodeosClient = nodeosClient;
    }

    @Override
    String getAccountName() {
        return CONTRACT_ACCOUNT;
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

        String from = data.get("from").getAsString();
        String to = data.get("to").getAsString();
        String quantity = data.get("quantity").getAsString();
        String memo = data.get("memo").getAsString();

        if (nftExchangeContractAccountName.equals(to)) {
            String[] qty = quantity.split(" ");

            if (!"EOS".equals(qty[1])) {
                return;
            }

            String[] memos = memo.split(":");

            // bid:account:price
            // buyitnow:account:price
            if (memos.length != 3 || (!BIDDING.equalsIgnoreCase(memos[0]) && !BUYITNOW.equalsIgnoreCase(memos[0]))) {
                return;
            }

            float bidEos = Float.parseFloat(qty[0]);
            String bidType = memos[0];
            String seller = memos[1];
            long tradeId = Long.parseLong(memos[2]);

            BiddingHistoryModel biddingHistoryModel = biddingHistoryRepository.findByTransactionId(transactionId);

            if (biddingHistoryModel != null && transactionId.equalsIgnoreCase(biddingHistoryModel.getTransactionId())) {
                // 이미 처리됨
                return;
            }

            TradeModel trade = tradeRepository.findByContractTradeId(tradeId);

            if (trade != null) {
                EnumBiddingType biddingType = null;
                try {
                    biddingType = EnumBiddingType.valueOf(bidType.toUpperCase());
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }

                if (biddingType == null) {
                    return;
                }

                BiddingHistoryModel biddingHistory = BiddingHistoryModel.builder()
                        .bidEos(bidEos)
                        .bidder(from)
                        .biddingType(biddingType)
                        .transactionId(transactionId)
                        .state(biddingType == EnumBiddingType.BUYITNOW ? EnumBiddingState.WINNING : EnumBiddingState.BIDDING)
                        .trade(trade)
                        .type(trade.getType())
                        .created(Calendar.getInstance().getTime())
                        .build();

                biddingHistoryRepository.save(biddingHistory);

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

                trade.setOwner(tradeObj.get("owner").getAsString());
                trade.setBuyer(tradeObj.get("owner").getAsString());
                trade.setCurrentPrice(Float.parseFloat(tradeObj.get("current_price").getAsString().split(" ")[0]));
                trade.setState(tradeState);
                trade.setUpdated(Calendar.getInstance().getTime());

                // 즉구시 다른 유저들은 낙찰
                if (biddingType == EnumBiddingType.BUYITNOW) {
                    List<BiddingHistoryModel> biddingHistoryModelList = biddingHistoryRepository.findByTradeId(trade.getId());

                    for (BiddingHistoryModel historyModel : biddingHistoryModelList) {
                        if (historyModel.getState() != EnumBiddingState.WINNING) {
                            historyModel.setState(EnumBiddingState.MISCARRY);
                            historyModel.setUpdated(Calendar.getInstance().getTime());
                        }
                    }

                    biddingHistoryRepository.saveAll(biddingHistoryModelList);
                }

                tradeRepository.save(trade);
            }
        }
    }
}
