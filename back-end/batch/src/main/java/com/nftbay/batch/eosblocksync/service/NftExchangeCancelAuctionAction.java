package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Calendar;

@Component
public class NftExchangeCancelAuctionAction extends NftExchangeAction {

    private static final String ACTION_NAME = "cancelauc";

    private TradeRepository tradeRepository;

    @Value("${nodeos.account_name.nft_exchange_contract}")
    private String nftExchangeContract;

    @Autowired
    public NftExchangeCancelAuctionAction(TradeRepository tradeRepository) {
        this.tradeRepository = tradeRepository;
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

        String seller = data.get("seller").getAsString();
        long tradeId = data.get("trade_id").getAsLong();

        TradeModel trade = tradeRepository.findByContractTradeId(tradeId);

        if (trade != null) {
            if (seller.equalsIgnoreCase(trade.getSeller())) {
                trade.setState(EnumTradeState.CANCEL);
                trade.setUpdated(Calendar.getInstance().getTime());
                tradeRepository.save(trade);
            }
        }
    }

}
