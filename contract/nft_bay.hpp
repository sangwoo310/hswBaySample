#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <eosiolib/action.hpp>
#include <eosiolib/asset.hpp>

using namespace eosio;
using namespace std;

class nftbay : public contract
{
    using contract::contract;
    // nft 토큰 id
    typedef uint64_t token_id;

  public:
    nftbay(account_name self) : contract(self) {}

    // 판매 등록
    void reg_auction(const account_name seller, const token_id id, const asset buy_price_eos);

    // 판매 취소
    void cancel_auction(const account_name seller, const uint64 order_id);

    // 경매 입찰
    void bid(const account_name buyer, const uint64_t order_id, const asset bid_eos);

    // 입찰 취소
    void cancel_bid(const account_name buyer, const uint64_t order_id);

    // 즉시 구매
    void buy(const account_name buyer, const uinit64_t order_id);

  private:
    // @abi table (판매 주문)
    struct orders
    {
        uint64_t _id;
        token_id token_id;
        string token_type;
        account_name seller;
        asset buy_price_eos;
        asset bid_price_eos;
        time end_bid_time;
        string state;
        time created;
        time updated;
    }

    // @abi table (입찰 목록)
    struct bids
    {
        uint64_t _id;
        uint64_t order_id;
        account_name bidder;
        asset bid_eos;
        string state;
        time created;
        time updated;
    }
};