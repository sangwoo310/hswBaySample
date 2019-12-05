#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/symbol.hpp>

using namespace eosio;

static const std::string CONTRACT_ACCOUNT = "epochchasert";
static const std::string STATE_SELLING = "selling";
static const std::string STATE_IDLE = "idle";
static const std::string STATE_DONE = "done";
static const float TRADE_FEE = 0.01f;

// 경매 종료 시간(등록시간 + x)
//static const uint64_t EXPIRED_TIME = ((uint64_t)(1LLU * 86400 * 1000000));

// 5분
static const uint64_t EXPIRED_TIME = ((uint64_t)(1LLU * 10 * 60 * 1000000));

static const uint64_t NFT_TYPE_UTS = 1;
static const uint64_t NFT_TYPE_UTM = 2;
static const uint64_t NFT_TYPE_UTI = 3;

typedef uint64_t id_type;

CONTRACT devtooth_nft : public contract
{
  public:
    devtooth_nft(name _self, name _code, datastream<const char *> ds) : contract(_self, _code, ds), stokens(_self, _self.value), mtokens(_self, _self.value), itokens(_self, _self.value) {}

    struct nft_transfer
    {
        eosio::name from;
        eosio::name to;
        asset quantity;
        std::string memo;
    };
    ACTION create(name issuer, std::string sym);

    ACTION issue(name to, asset quantity, uint64_t index);

    ACTION transferid(name from, name to, id_type id, std::string sym);

    ACTION changestate(name from, std::string sym, id_type id);

    ACTION backtogame(name from, std::string sym, id_type id);

    ACTION clean();

    ACTION regauction(name seller, uint64_t token_id, asset min_price, asset max_price, std::string sym);

    ACTION cancelauc(name seller, uint64_t trade_id);

    ACTION notify(name user, std::string msg);

    ACTION claim(std::string actor, name account, uint64_t trade_id);

    ACTION removetrade();

    ACTION bid();

  private:
    // servant struct
    struct status_info
    {
        uint32_t basic_str = 0;
        uint32_t basic_dex = 0;
        uint32_t basic_int = 0;
        uint32_t plus_str = 0;
        uint32_t plus_dex = 0;
        uint32_t plus_int = 0;
    };

    struct servant_info
    {
        uint32_t id;
        uint32_t state;   //서번트 상태
        uint32_t exp = 0; //서번트 경험치
        uint32_t stat_point = 0;
        status_info status;               //기본 힘,민,지 추가 힘,민,지
        std::vector<uint32_t> equip_slot; //서번트 장비 리스트
    };

    // monster struct
    struct monster_info
    {
        uint32_t id;
        uint32_t state;       //몬스터 상태값
        uint32_t exp = 0;     //경험치
        uint32_t type = 0;    //속성 타입
        uint32_t grade;       // 등급
        uint32_t upgrade = 0; //강화수치
        status_info status;   //기본 힘,민,지 추가 힘,민,지
    };

    // item struct
    struct item_info
    {
        uint32_t id;          //아이템 리소스 아이디
        uint32_t state;       //아이템 현재 상태
        uint32_t type;        //장착 타입
        uint32_t tier;        //티어
        uint32_t job;         //직업제한
        uint32_t grade;       //아이템 등급
        uint32_t upgrade = 0; //아이템 강화 수치
        uint32_t atk = 0;
        uint32_t def = 0;
        status_info status; //기본 힘,민,지 추가 힘,민,지
    };

    TABLE account
    {

        asset balance;

        uint64_t primary_key() const { return balance.symbol.code().raw(); }
    };

    TABLE stats
    {
        asset supply;
        name issuer;

        uint64_t primary_key() const { return supply.symbol.code().raw(); }
        uint64_t get_issuer() const { return issuer.value; }
    };

    TABLE utstoken
    {
        id_type idx;       // Unique 64 bit identifier,
        uint32_t t_idx;    // 유저 테이블 상에서의 고유 인덱스
        std::string state; // 토큰 상태

        name owner;  // token owner
        name master; // token master for search detail info
        asset value; // token value (1 UTS)

        id_type primary_key() const { return idx; }
        uint64_t get_owner() const { return owner.value; }
    };

    TABLE utmtoken
    {
        id_type idx;       // Unique 64 bit identifier,
        uint32_t t_idx;    // 유저 테이블 상에서의 고유 인덱스
        std::string state; // 토큰 상태

        name owner;  // token owner
        name master; // token master for search detail info
        asset value; // token value (1 UTM)

        id_type primary_key() const { return idx; }
        uint64_t get_owner() const { return owner.value; }
    };

    TABLE utitoken
    {
        id_type idx;       // Unique 64 bit identifier,
        uint32_t t_idx;    // 유저 테이블 상에서의 고유 인덱스
        std::string state; // 토큰 상태

        name owner;  // token owner
        name master; // token master for search detail info
        asset value; // token value (1 UTI)

        id_type primary_key() const { return idx; }
        uint64_t get_owner() const { return owner.value; }
    };

    TABLE tservant
    {
        uint64_t index;
        uint32_t id;
        status_info status;

        uint64_t primary_key() const { return index; }
    };

    TABLE tmonster
    {
        uint64_t index;
        uint32_t id;
        uint32_t grade;
        status_info status;

        uint64_t primary_key() const { return index; }
    };

    TABLE titem
    {
        uint64_t index;
        uint32_t id;
        uint32_t type;
        uint32_t tier;
        uint32_t job;
        uint32_t grade;
        uint32_t main_status;

        uint64_t primary_key() const { return index; }
    };

    TABLE trade
    {
        // trade id
        uint64_t id;
        // game table id
        uint64_t game_table_id;
        // nft id
        uint64_t token_id;
        // 현재 주인
        name owner;
        // 판매자
        name master;
        // 입찰 시작가
        asset min_price;
        // 즉시 구매가
        asset max_price;
        // 현재 경매가
        asset current_price;
        // 경매 종료 시간
        uint64_t end_bid_time;
        // 경매 상태
        std::string state;
        // 토큰 종류
        uint64_t nft_type;
        uint64_t created;
        uint64_t updated;

        uint64_t primary_key() const { return id; }
        uint64_t by_token_id() const { return token_id; }
        uint64_t by_nft_type() const { return nft_type; }
        uint64_t by_master() const { return master.value; }
    };

    typedef eosio::multi_index<"trades"_n, trade, indexed_by<"bytokenid"_n, const_mem_fun<trade, uint64_t, &trade::by_token_id>>, indexed_by<"bynfttype"_n, const_mem_fun<trade, uint64_t, &trade::by_nft_type>>, indexed_by<"bymaster"_n, const_mem_fun<trade, uint64_t, &trade::by_master>>> trade_index;

    typedef eosio::multi_index<"accounts"_n, account> account_index;

    typedef eosio::multi_index<"stat"_n, stats, indexed_by<"byissuer"_n, const_mem_fun<stats, uint64_t, &stats::get_issuer>>> currency_index;

    typedef eosio::multi_index<"utstokens"_n, utstoken, indexed_by<"byowner"_n, const_mem_fun<utstoken, uint64_t, &utstoken::get_owner>>> servant_index;

    typedef eosio::multi_index<"utmtokens"_n, utmtoken, indexed_by<"byowner"_n, const_mem_fun<utmtoken, uint64_t, &utmtoken::get_owner>>> monster_index;

    typedef eosio::multi_index<"utitokens"_n, utitoken, indexed_by<"byowner"_n, const_mem_fun<utitoken, uint64_t, &utitoken::get_owner>>> item_index;

    using servant_table = eosio::multi_index<"preservant"_n, tservant>;
    using monster_table = eosio::multi_index<"premonster"_n, tmonster>;
    using item_table = eosio::multi_index<"preitem"_n, titem>;

    servant_index stokens;
    monster_index mtokens;
    item_index itokens;

    void sub_balance(name owner, asset value);
    void add_balance(name owner, asset value, name ram_payer);
    void sub_supply(asset quantity);
    void add_supply(asset quantity);
    void updatenftstate(name seller, uint64_t nft_type, uint64_t token_id, std::string state);
    void regauction_core(name seller, uint64_t token_id, asset min_price, asset max_price, uint64_t nft_type, uint64_t game_table_id);
    void successbid(name seller, name bid_winner, uint64_t nft_type, uint64_t game_table_id);
    void sendsummary(name user, std::string message);
    void tokenize(const std::string &str, std::vector<std::string> &tokens, const std::string &delimiters);
};
