TABLE trade
{
    // trade id
    uint64_t id;
    // game contract id
    uint64_t id;
    // nft id
    uint64_t t_id;
    // 현재 주인
    name owner;
    // 판매자
    name master;
    // 입찰 시작가
    uint64_t min_price;
    // 즉시 구매가
    uint64_t max_price;
    // 현재 경매가
    uint64_t current_price;
    // 경매 종료 시간
    uint64_t end_bid_time;
    // 경매 상태
    std::string state;
    // 토큰 종류
    std::string nft_type;
    uint64_t created;
    uint64_t updated;

    uint64_t primary_key() const { return id; }
    uint64_t by_token_id() const { return t_id; }
};

typedef multi_index<"trades"_n, trade, indexed_by<"bytid"_n, const_mem_fun<trade, uint64_t, &trade::by_t_id>>> trade_table;
