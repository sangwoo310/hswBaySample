package com.nftbay.batch.eosblocksync.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.nftbay.common.Constants;
import com.nftbay.common.gamedata.model.GameInfoModel;
import com.nftbay.common.gamedata.repositories.GameInfoBaseRepository;
import com.nftbay.common.gameservice.models.GameServiceModel;
import com.nftbay.common.gameservice.repositories.GameServiceRepository;
import com.nftbay.common.nft.models.NFTModel;
import com.nftbay.common.nft.models.NFTUTItemModel;
import com.nftbay.common.nft.models.NFTUTMonsterModel;
import com.nftbay.common.nft.models.NFTUTServantModel;
import com.nftbay.common.nodeos.NodeosClient;
import com.nftbay.common.nodeos.remote.model.api.GetTableRequest;
import com.nftbay.common.trade.EnumNftType;
import com.nftbay.common.trade.EnumTradeState;
import com.nftbay.common.trade.models.TradeModel;
import com.nftbay.common.trade.repositories.TradeReactiveRepository;
import com.nftbay.common.trade.repositories.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.Nullable;
import java.util.Calendar;
import java.util.Date;

@Component
public class NftExchangeRegAuctionAction extends NftExchangeAction {

    private static final String ACTION_NAME = "regauction";

    private TradeRepository tradeRepository;
    private GameInfoBaseRepository gameInfoBaseRepository;
    private GameServiceRepository gameServiceRepository;

    private NodeosClient nodeosClient;

    @Value("${nodeos.table.uts_table}")
    private String utsTable;

    @Value("${nodeos.table.utm_table}")
    private String utmTable;

    @Value("${nodeos.table.uti_table}")
    private String utiTable;

    @Value("${nodeos.table.uts_game_table}")
    private String utsGameTable;

    @Value("${nodeos.table.utm_game_table}")
    private String utmGameTable;

    @Value("${nodeos.table.uti_game_table}")
    private String utiGameTable;

    @Value("${nodeos.account_name.unlimited_tower_contract}")
    private String unlimitedTowerContract;

    @Value("${nodeos.account_name.nft_exchange_contract}")
    private String nftExchangeContract;

    @Value("${nodeos.account_name.nft_contract}")
    private String nftContract;

    @Autowired
    public NftExchangeRegAuctionAction(TradeRepository tradeRepository, GameInfoBaseRepository gameInfoBaseRepository,
            GameServiceRepository gameServiceRepository, NodeosClient nodeosClient) {
        this.tradeRepository = tradeRepository;
        this.gameInfoBaseRepository = gameInfoBaseRepository;
        this.gameServiceRepository = gameServiceRepository;
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

        TradeModel tradeModel = tradeRepository.findByTransactionId(transactionId);

        if (tradeModel != null && transactionId.equalsIgnoreCase(tradeModel.getTransactionId())) {
            // 이미 처리됨
            return;
        }

        JsonObject data = jsonActionElement.getAsJsonObject().get("data").getAsJsonObject();

        String seller = data.get("seller").getAsString();
        long tokenId = data.get("token_id").getAsLong();
        String minPrice = data.get("min_price").getAsString();
        String maxPrice = data.get("max_price").getAsString();
        String sym = data.get("sym").getAsString();
        int symInt = 0;

        EnumNftType nftType = EnumNftType.valueOf(sym);

        String gameTable = "";

        if (nftType == EnumNftType.UTI) {
            gameTable = utiGameTable;
            symInt = Constants.NFT_UTI;
        } else if (nftType == EnumNftType.UTM) {
            gameTable = utmGameTable;
            symInt = Constants.NFT_UTM;
        } else if (nftType == EnumNftType.UTS) {
            gameTable = utsGameTable;
            symInt = Constants.NFT_UTS;
        }

        // get trade table
        JsonObject tradeTaleObject = nodeosClient.getTableRows(GetTableRequest.builder()
                .json(true)
                .code(nftExchangeContract)
                .scope(nftExchangeContract)
                .table(Constants.NFT_TRADES_TABLE)
                .table_key("by_token_id")
                .index_position(2)
                .key_type("i64")
                .lower_bound(String.valueOf(tokenId))
                .upper_bound(String.valueOf(tokenId))
                .limit(100)
                .build()).block();

        if (tradeTaleObject == null) {
            return;
        }

        JsonArray trades = tradeTaleObject.get("rows").getAsJsonArray();

        JsonObject trade = null;

        for (int i = 0; i < trades.size(); i++) {
            trade = trades.get(i).getAsJsonObject();

            int symbol = trade.get("nft_type").getAsInt();

            if (symInt == symbol && "selling".equalsIgnoreCase(trade.get("state").getAsString())) {
                break;
            }
        }

        if (trade == null) {
            return;
        }

        long bidEndTime = trade.get("end_bid_time").getAsLong() / 1000;

        // todo - get game info idx
        JsonObject gameInfoObject = nodeosClient.getTableRows(GetTableRequest.builder()
                .json(true)
                .code(unlimitedTowerContract)
                .scope(trade.get("master").getAsString())
                .table(gameTable)
                .key_type("i64")
                .upper_bound(String.valueOf(trade.get("game_table_id").getAsLong()))
                .lower_bound(String.valueOf(trade.get("game_table_id").getAsLong()))
                .index_position(1)
                .limit(1)
                .build()).block();

        if (gameInfoObject.get("rows").getAsJsonArray().size() == 0) {
            return;
        }

        NFTModel nftModel = parseNtf(nftType, gameInfoObject);

        if (nftModel == null) {
            return;
        }

        nftModel.setNftTokenId(tokenId);
        nftModel.setCreated(Calendar.getInstance().getTime());

        GameServiceModel gameServiceModel = gameServiceRepository.findById(Constants.UT_SERVICE_ID).orElse(null);

        tradeModel = TradeModel.builder()
                .contractTradeId(trade.get("id").getAsLong())
                .idx(tokenId)
                .tokenIdx(trade.get("game_table_id").getAsLong())
                .owner(seller)
                .master(seller)
                .buyer(seller)
                .seller(seller)
                .minPrice(Float.parseFloat(minPrice.split(" ")[0]))
                .maxPrice(Float.parseFloat(maxPrice.split(" ")[0]))
                .currentPrice(Float.parseFloat(minPrice.split(" ")[0]))
                .state(EnumTradeState.SELLING)
                .bidEndTime(new Date(bidEndTime))
                .type(nftType)
                .transactionId(transactionId)
                .created(Calendar.getInstance().getTime())
                .nft(nftModel)
                .gameService(gameServiceModel)
                .build();

        nftModel.setOrder(tradeModel);

        tradeRepository.save(tradeModel);
    }

    @Nullable
    private NFTModel parseNtf(EnumNftType nftType, JsonObject gameInfoObject) {
        JsonObject dataObject = gameInfoObject.getAsJsonArray("rows").get(0).getAsJsonObject();
        long index = dataObject.get("index").getAsLong();

        long gameInfoId = 0;
        NFTModel nftModel = null;

        if (nftType == EnumNftType.UTI) {
            // { "id": 891401, "state": 1, "type": 2, "tier": 4, "job": 1, "grade": 3,
            // "upgrade": 0, "value": 26, "equipservantindex": 0 }
            JsonObject itemObj = dataObject.get("equipment").getAsJsonObject();

            gameInfoId = itemObj.get("id").getAsLong();

            nftModel = NFTUTItemModel.builder()
                    .contractTableId(index)
                    .type(itemObj.get("type").getAsInt())
                    .tier(itemObj.get("tier").getAsInt())
                    .job(itemObj.get("job").getAsInt())
                    .grade(itemObj.get("grade").getAsInt())
                    .upgrade(itemObj.get("upgrade").getAsInt())
                    .mainStatus(0)
                    .build();
        } else if (nftType == EnumNftType.UTM) {
            // 	{ "id": 102311, "state": 1, "exp": 0, "type": 1, "monster_class": 2, "grade": 5,
            // 	"upgrade": 0, "level": 1, "status": { "basic_str": 34, "basic_dex": 34, "basic_int": 36 },
            // 	"passive_skill": [ 100008 ], "active_skill": [] }
            JsonObject monsterObj = dataObject.get("monster").getAsJsonObject();

            gameInfoId = monsterObj.get("id").getAsLong();

            nftModel = NFTUTMonsterModel.builder()
                    .contractTableId(index)
                    .basicStr(monsterObj.getAsJsonObject("status").get("basic_str").getAsInt())
                    .basicDex(monsterObj.getAsJsonObject("status").get("basic_dex").getAsInt())
                    .basicInt(monsterObj.getAsJsonObject("status").get("basic_int").getAsInt())
//                    .plusStr(monsterObj.getAsJsonObject("status").get("plus_str").getAsInt())
//                    .plusDex(monsterObj.getAsJsonObject("status").get("plus_dex").getAsInt())
//                    .plusInt(monsterObj.getAsJsonObject("status").get("plus_int").getAsInt())
                    .type(monsterObj.get("type").getAsInt())
                    .grade(monsterObj.get("grade").getAsInt())
                    .upgrade(monsterObj.get("upgrade").getAsInt())
                    .level(monsterObj.get("level").getAsInt())
                    .monsterClass(0)
                    //.monsterClass(monsterObj.get("monster_class").getAsInt())
                    .build();
        } else if (nftType == EnumNftType.UTS) {
            // { "state": 1, "exp": 15, "id": 1220101, "level": 1, "grade": 5,
            // "status": { "basic_str": 42, "basic_dex": 46, "basic_int": 44 },
            // "equip_slot": [ 0, 0, 0 ], "passive_skill": [], "active_skill": [] }
            JsonObject servantObj = dataObject.get("servant").getAsJsonObject();

            gameInfoId = servantObj.get("id").getAsLong();

            nftModel = NFTUTServantModel.builder()
                    .contractTableId(index)
                    .basicStr(servantObj.getAsJsonObject("status").get("basic_str").getAsInt())
                    .basicDex(servantObj.getAsJsonObject("status").get("basic_dex").getAsInt())
                    .basicInt(servantObj.getAsJsonObject("status").get("basic_int").getAsInt())
//                    .plusStr(dataObject.getAsJsonObject("status").get("plus_str").getAsInt())
//                    .plusDex(dataObject.getAsJsonObject("status").get("plus_dex").getAsInt())
//                    .plusInt(dataObject.getAsJsonObject("status").get("plus_int").getAsInt())
                    .exp(servantObj.get("exp").getAsLong())
                    .level(servantObj.get("level").getAsInt())
                    .grade(servantObj.get("grade").getAsInt())
                    .build();
        }

        if (nftModel != null) {
            GameInfoModel gameInfoModel = (GameInfoModel) gameInfoBaseRepository.findById(gameInfoId)
                    .orElse(null);

            nftModel.setGameInfo(gameInfoModel);
        }

        return nftModel;
    }
}
