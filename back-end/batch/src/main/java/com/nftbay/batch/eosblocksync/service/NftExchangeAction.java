package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonElement;
import org.springframework.beans.factory.annotation.Value;

public abstract class NftExchangeAction {

    @Value("${nodeos.account_name.unlimited_tower_contract}")
    protected String unlimitedTowerContract;

    @Value("${nodeos.account_name.nft_contract}")
    protected String nftContractAccountName;

    @Value("${nodeos.account_name.nft_exchange_contract}")
    protected String nftExchangeContractAccountName;

    abstract String getAccountName();
    abstract String getActionName();

    public abstract void parse(JsonElement jsonActionElement, String transactionId);

    public boolean checkAccountAndActionName(JsonElement jsonActionElement) {
        String contractAccountName = jsonActionElement.getAsJsonObject().get("account").getAsString();
        String actionName = jsonActionElement.getAsJsonObject().get("name").getAsString();

        if (getAccountName().equals(contractAccountName) && getActionName().equalsIgnoreCase(actionName)) {
            return true;
        }

        return false;
    }
}
