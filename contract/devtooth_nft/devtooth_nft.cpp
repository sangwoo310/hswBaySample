#include "devtooth_nft.hpp"

void devtooth_nft::create(name issuer, std::string sym)
{
    require_auth(_self);

    eosio_assert(is_account(issuer), "issuer account does not exist");
    asset supply(0, symbol(sym, 0));

    auto symbol = supply.symbol;
    eosio_assert(symbol.is_valid(), "invalid symbol name");
    eosio_assert(supply.is_valid(), "invalid supply");

    currency_index currency_table(_self, symbol.code().raw());
    auto existing_currency = currency_table.find(symbol.code().raw());
    eosio_assert(existing_currency == currency_table.end(), "token with symbol already exists");

    currency_table.emplace(_self, [&](auto &currency) {
        currency.supply = supply;
        currency.issuer = issuer;
    });
}

void devtooth_nft::issue(name to, eosio::asset quantity, uint64_t index)
{
    eosio_assert(is_account(to), "to account does not exist");

    auto symbols = quantity.symbol;
    eosio_assert(symbols.is_valid(), "invalid symbol name");
    eosio_assert(symbols.precision() == 0, "quantity must be a whole number");

    auto symbol_name = symbols.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto existing_currency = currency_table.find(symbol_name);
    eosio_assert(existing_currency != currency_table.end(), "token with symbol does not exist. create token before issue");
    const auto &st = *existing_currency;

    require_auth(to);
    eosio_assert(quantity.is_valid(), "invalid quantity");
    eosio_assert(quantity.amount > 0, "must issue positive quantity of uts");
    eosio_assert(symbols == st.supply.symbol, "symbol precision mismatch");

    if (symbols == symbol("UTS", 0))
    {
        servant_table servant("unlimittest1"_n, to.value);
        auto servant_iter = servant.get(index, "Not exist Servant");

        auto uts_list = stokens.get_index<"byowner"_n>();
        bool not_exist = true;
        for (auto it = uts_list.begin(); it != uts_list.end(); ++it)
        {
            if (it->t_idx == servant_iter.index)
            {
                not_exist = false;
                break;
            }
        }
        eosio_assert(not_exist, "Already exist Token");

        stokens.emplace(to, [&](auto &token) {
            token.idx = stokens.available_primary_key();
            token.t_idx = index;
            token.state = "idle";

            token.owner = to;
            token.master = to;
            token.value = eosio::asset{1, symbols};
        });
    }
    if (symbols == symbol("UTM", 0))
    {
        monster_table monster("unlimittest1"_n, to.value);
        auto monster_iter = monster.get(index, "Not exist Monster");

        auto utm_list = mtokens.get_index<"byowner"_n>();
        bool not_exist = true;
        for (auto it = utm_list.begin(); it != utm_list.end(); ++it)
        {
            if (it->t_idx == monster_iter.index)
            {
                not_exist = false;
                break;
            }
        }
        eosio_assert(not_exist, "Already exist Token");

        mtokens.emplace(to, [&](auto &token) {
            token.idx = mtokens.available_primary_key();
            token.t_idx = index;
            token.state = "idle";

            token.owner = to;
            token.master = to;
            token.value = eosio::asset{1, symbols};
        });
    }
    if (symbols == symbol("UTI", 0))
    {
        item_table item("unlimittest1"_n, to.value);
        auto item_iter = item.get(index, "Not exist Item");

        auto uti_list = itokens.get_index<"byowner"_n>();
        bool not_exist = true;
        for (auto it = uti_list.begin(); it != uti_list.end(); ++it)
        {
            if (it->t_idx == item_iter.index)
            {
                not_exist = false;
                break;
            }
        }
        eosio_assert(not_exist, "Already exist Token");

        itokens.emplace(to, [&](auto &token) {
            token.idx = itokens.available_primary_key();
            token.t_idx = index;
            token.state = "idle";

            token.owner = to;
            token.master = to;
            token.value = eosio::asset{1, symbols};
        });
    }

    add_supply(quantity);

    add_balance(to, quantity, to);
}

void devtooth_nft::transferid(name from, name to, id_type id, std::string sym)
{
    eosio_assert(from != to, "cannot transfer to self");
    require_auth(from);

    eosio_assert(is_account(to), "to account does not exist");

    eosio::asset token(0, symbol(symbol_code(sym), 0));

    if (token.symbol == symbol("UTS", 0))
    {
        auto sender_token = stokens.find(id);
        eosio_assert(sender_token != stokens.end(), "token with specified ID does not exist");
        eosio_assert(sender_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(sender_token->state == "idle", "a non-tradeable token");

        const auto &st = *sender_token;

        stokens.modify(st, from, [&](auto &token) {
            token.owner = to;
        });

        sub_balance(from, st.value);
        add_balance(to, st.value, from);
    }
    if (token.symbol == symbol("UTM", 0))
    {
        auto sender_token = mtokens.find(id);
        eosio_assert(sender_token != mtokens.end(), "token with specified ID does not exist");
        eosio_assert(sender_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(sender_token->state == "idle", "a non-tradeable token");

        const auto &st = *sender_token;

        mtokens.modify(st, from, [&](auto &token) {
            token.owner = to;
        });

        sub_balance(from, st.value);
        add_balance(to, st.value, from);
    }
    if (token.symbol == symbol("UTI", 0))
    {
        auto sender_token = itokens.find(id);
        eosio_assert(sender_token != itokens.end(), "token with specified ID does not exist");
        eosio_assert(sender_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(sender_token->state == "idle", "a non-tradeable token");

        const auto &st = *sender_token;

        itokens.modify(st, from, [&](auto &token) {
            token.owner = to;
        });

        sub_balance(from, st.value);
        add_balance(to, st.value, from);
    }

    require_recipient(from);
    require_recipient(to);
}

void devtooth_nft::changestate(name from, std::string sym, id_type id)
{
    require_auth(from);

    eosio::asset token(0, symbol(symbol_code(sym), 0));

    if (token.symbol == symbol("UTS", 0))
    {
        auto target_token = stokens.find(id);
        eosio_assert(target_token != stokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");

        const auto &st = *target_token;

        if (st.state == "idle")
        {
            stokens.modify(st, from, [&](auto &token) {
                token.state = "selling";
            });
        }
        else
        {
            stokens.modify(st, from, [&](auto &token) {
                token.state = "idle";
            });
        }
    }
    if (token.symbol == symbol("UTM", 0))
    {
        auto target_token = mtokens.find(id);
        eosio_assert(target_token != mtokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");

        const auto &st = *target_token;

        if (st.state == "idle")
        {
            mtokens.modify(st, from, [&](auto &token) {
                token.state = "selling";
            });
        }
        else
        {
            mtokens.modify(st, from, [&](auto &token) {
                token.state = "idle";
            });
        }
    }
    if (token.symbol == symbol("UTI", 0))
    {
        auto target_token = itokens.find(id);
        eosio_assert(target_token != itokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");

        const auto &st = *target_token;

        if (st.state == "idle")
        {
            itokens.modify(st, from, [&](auto &token) {
                token.state = "selling";
            });
        }
        else
        {
            itokens.modify(st, from, [&](auto &token) {
                token.state = "idle";
            });
        }
    }
}

void devtooth_nft::backtogame(name from, std::string sym, id_type id)
{
    require_auth(from);

    eosio::asset token(0, symbol(symbol_code(sym), 0));

    if (token.symbol == symbol("UTS", 0))
    {
        auto target_token = stokens.find(id);
        eosio_assert(target_token != stokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(target_token->state == "idle", "Can not back to game in auction");

        const auto &st = *target_token;

        stokens.erase(st);
    }
    if (token.symbol == symbol("UTM", 0))
    {
        auto target_token = mtokens.find(id);
        eosio_assert(target_token != mtokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(target_token->state == "idle", "Can not back to game in auction");

        const auto &st = *target_token;

        mtokens.erase(st);
    }
    if (token.symbol == symbol("UTI", 0))
    {
        auto target_token = itokens.find(id);
        eosio_assert(target_token != itokens.end(), "token with specified ID does not exist");
        eosio_assert(target_token->owner == from, "sender does not own token with specified ID");
        eosio_assert(target_token->state == "idle", "Can not back to game in auction");

        const auto &st = *target_token;

        itokens.erase(st);
    }
}

void devtooth_nft::clean()
{
    for (auto iter = stokens.begin(); iter != stokens.end();)
    {
        auto token_iter = stokens.find(iter->primary_key());
        iter++;
        stokens.erase(token_iter);
    }

    for (auto iter2 = mtokens.begin(); iter2 != mtokens.end();)
    {
        auto token_iter2 = mtokens.find(iter2->primary_key());
        iter2++;
        mtokens.erase(token_iter2);
    }

    for (auto iter3 = itokens.begin(); iter3 != itokens.end();)
    {
        auto token_iter3 = itokens.find(iter3->primary_key());
        iter3++;
        itokens.erase(token_iter3);
    }
}

void devtooth_nft::sub_balance(name owner, eosio::asset value)
{
    account_index from_acnts(_self, owner.value);
    const auto &from = from_acnts.get(value.symbol.code().raw(), "no balance object found");
    eosio_assert(from.balance.amount >= value.amount, "overdrawn balance");

    if (from.balance.amount == value.amount)
    {
        from_acnts.erase(from);
    }
    else
    {
        from_acnts.modify(from, owner, [&](auto &a) {
            a.balance -= value;
        });
    }
}

void devtooth_nft::add_balance(name owner, eosio::asset value, name ram_payer)
{
    account_index to_accounts(_self, owner.value);
    auto to = to_accounts.find(value.symbol.code().raw());
    if (to == to_accounts.end())
    {
        to_accounts.emplace(ram_payer, [&](auto &a) {
            a.balance = value;
        });
    }
    else
    {
        to_accounts.modify(to, owner, [&](auto &a) {
            a.balance += value;
        });
    }
}

void devtooth_nft::sub_supply(eosio::asset quantity)
{
    auto symbol_name = quantity.symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto current_currency = currency_table.find(symbol_name);

    currency_table.modify(current_currency, _self, [&](auto &currency) {
        currency.supply -= quantity;
    });
}

void devtooth_nft::add_supply(eosio::asset quantity)
{
    auto symbol_name = quantity.symbol.code().raw();
    currency_index currency_table(_self, symbol_name);
    auto current_currency = currency_table.find(symbol_name);

    currency_table.modify(current_currency, _self, [&](auto &currency) {
        currency.supply += quantity;
    });
}

// nft exchange actions

void devtooth_nft::regauction(name seller, uint64_t token_id, asset min_price, asset max_price, std::string sym)
{
    require_auth(seller);
    uint64_t game_table_id = -1;
    // 판매가능한 토큰인지(token_id, owner) 확인

    uint64_t nftType = 0;

    //UTS
    if (sym == "UTS")
    {
        auto iterator = stokens.find(token_id);
        eosio_assert(iterator != stokens.end(), "Token is not exist");
        eosio_assert(iterator->owner == seller, "you have no permission to register auction for this token.");
        eosio_assert(iterator->state == STATE_IDLE, "The token is already selling or sold.");
        game_table_id = iterator->t_idx;
        nftType = NFT_TYPE_UTS;
    }
    //UTM
    else if (sym == "UTM")
    {
        auto iterator = mtokens.find(token_id);
        eosio_assert(iterator != mtokens.end(), "Token is not exist");
        eosio_assert(iterator->owner == seller, "you have no permission to register auction for this token.");
        eosio_assert(iterator->state == STATE_IDLE, "The token is already selling or sold.");
        game_table_id = iterator->t_idx;
        nftType = NFT_TYPE_UTM;
    }
    // UTI
    else if (sym == "UTI")
    {
        auto iterator = itokens.find(token_id);
        eosio_assert(iterator != itokens.end(), "Token is not exist");
        eosio_assert(iterator->owner == seller, "you have no permission to register auction for this token.");
        eosio_assert(iterator->state == STATE_IDLE, "The token is already selling or sold.");
        game_table_id = iterator->t_idx;
        nftType = NFT_TYPE_UTI;
    }
    else
    {
        eosio_assert(false, "Invalid Symbol");
    }

    if (min_price.symbol != symbol("EOS", 4) || max_price.symbol != symbol("EOS", 4))
    {
        eosio_assert(false, "Invalid price format.");
    }

    if (game_table_id < 0)
    {
        eosio_assert(false, "Invalid Game Table Token id");
    }

    regauction_core(seller, token_id, min_price, max_price, nftType, game_table_id);
}

void devtooth_nft::regauction_core(name seller, uint64_t token_id, asset min_price, asset max_price, uint64_t nft_type, uint64_t game_table_id)
{
    auto contract_account = name{CONTRACT_ACCOUNT};
    trade_index trade_table(contract_account, contract_account.value);

    // 이미 판매 등록된 토큰인지 확인
    auto token_id_list = trade_table.get_index<"bytokenid"_n>();
    auto token_iter = token_id_list.lower_bound(token_id);

    while (token_iter != token_id_list.end() && token_iter->token_id == token_id)
    {
        if (token_iter->token_id == token_id && token_iter->nft_type == nft_type)
        {
            eosio_assert(token_iter->state == STATE_DONE, "Token is already registed.");
        }
        token_iter++;
    }

    uint64_t cur_time = current_time();
    uint64_t end_bid_time = cur_time + EXPIRED_TIME;

    //첫 번째 파라미터는 저장소값을 지불할 어카운트
    trade_table.emplace(_code, [&](auto &row) {
        row.id = trade_table.available_primary_key();
        row.token_id = token_id;
        row.master = seller;
        row.owner = seller;
        row.min_price = min_price;
        row.max_price = max_price;
        row.current_price = min_price;
        row.created = cur_time;
        row.end_bid_time = end_bid_time;
        row.nft_type = nft_type;
        row.state = STATE_SELLING;
        row.game_table_id = game_table_id;
    });

    // 토큰 상태 변경
    updatenftstate(seller, nft_type, token_id, STATE_SELLING);
}

void devtooth_nft::updatenftstate(name seller, uint64_t nft_type, uint64_t token_id, std::string state)
{
    //UTS
    if (nft_type == 1)
    {
        auto seller_token = stokens.find(token_id);

        eosio_assert(seller_token != stokens.end(), "Invalid Access");
        eosio_assert(seller_token->owner == seller, "Invalid Access");

        const auto &st = *seller_token;

        stokens.modify(st, seller, [&](auto &token) {
            token.state = state;
        });
    }
    //UTM
    else if (nft_type == 2)
    {
        auto seller_token = mtokens.find(token_id);

        eosio_assert(seller_token != mtokens.end(), "Invalid Access");
        eosio_assert(seller_token->owner == seller, "Invalid Access");

        const auto &st = *seller_token;

        mtokens.modify(st, seller, [&](auto &token) {
            token.state = state;
        });
    }
    //UTI
    else if (nft_type == 3)
    {
        auto seller_token = itokens.find(token_id);

        eosio_assert(seller_token != itokens.end(), "Invalid Access");
        eosio_assert(seller_token->owner == seller, "Invalid Access");

        const auto &st = *seller_token;

        itokens.modify(st, seller, [&](auto &token) {
            token.state = state;
        });
    }
}

// 만료시간까지 판매가 안되었으면 취소
void devtooth_nft::cancelauc(name seller, uint64_t trade_id)
{
    require_auth(seller);

    auto contract_account = name{CONTRACT_ACCOUNT};
    trade_index trade_table(contract_account, contract_account.value);
    auto iterator = trade_table.find(trade_id);

    if (iterator != trade_table.end())
    {
        uint64_t cur_time = current_time();

        // 입찰자가 없어야지만 취소 가능.
        eosio_assert(iterator->owner == seller, "seller account does not match.");
        eosio_assert(iterator->master == seller, "owner account does not match.");
        eosio_assert(cur_time > iterator->end_bid_time, "you can not cancel.");

        trade_table.modify(iterator, contract_account, [&](auto &row) {
            row.state = STATE_DONE;
            row.updated = cur_time;
        });

        // change token state

        uint64_t nft_type = iterator->nft_type;
        uint64_t token_id = iterator->token_id;

        updatenftstate(seller, nft_type, token_id, STATE_IDLE);
    }
    else
    {
        eosio_assert(false, "there is no trade for trade_id");
    }
}

void devtooth_nft::successbid(name seller, name bid_winner, uint64_t nft_type, uint64_t token_id)
{
    //UTS
    if (nft_type == 1)
    {
        auto seller_token = stokens.find(token_id);
        eosio_assert(seller_token != stokens.end(), "Invalid Access");
        eosio_assert(seller_token->master == seller, "Invalid Access");

        const auto &st = *seller_token;

        stokens.modify(st, seller, [&](auto &token) {
            token.state = STATE_IDLE;
            token.owner = bid_winner;
            token.master = bid_winner;
        });
    }
    //UTM
    else if (nft_type == 2)
    {
        auto seller_token = mtokens.find(token_id);
        eosio_assert(seller_token != mtokens.end(), "Invalid Access");
        eosio_assert(seller_token->master == seller, "Invalid Access");

        const auto &st = *seller_token;

        mtokens.modify(st, seller, [&](auto &token) {
            token.state = STATE_IDLE;
            token.owner = bid_winner;
            token.master = bid_winner;
        });
    }
    //UTI
    else if (nft_type == 3)
    {
        auto seller_token = itokens.find(token_id);
        eosio_assert(seller_token != itokens.end(), "Invalid Access");
        eosio_assert(seller_token->master == seller, "Invalid Access");

        const auto &st = *seller_token;

        itokens.modify(st, seller, [&](auto &token) {
            token.state = STATE_IDLE;
            token.owner = bid_winner;
            token.master = bid_winner;
        });
    }
}

void devtooth_nft::notify(name user, std::string msg)
{
    require_auth(get_self());
    require_recipient(user);
}

void devtooth_nft::claim(std::string actor, name account, uint64_t trade_id)
{
    require_auth(account);

    auto contract_account = name{CONTRACT_ACCOUNT};
    trade_index trade_table(contract_account, contract_account.value);
    auto iterator = trade_table.find(trade_id);

    if (iterator != trade_table.end())
    {
        uint64_t cur_time = current_time();

        // 거래 시간이 안끝났으면 오류
        if (iterator->end_bid_time > cur_time && iterator->state != STATE_SELLING)
        {
            eosio_assert(false, "Do not claim");
        }

        // claim 요청자 확인
        if (actor != "buyer" && actor != "seller")
        {
            eosio_assert(false, "Bad request");
        }

        // buyer일 경우 owner와 account가 같은지 확인
        if (actor == "buyer")
        {
            if (iterator->owner != account)
            {
                eosio_assert(false, "Bad request");
            }
        }
        // seller일 경우 master와 account가 같은지 확인, owner와 master가 다른지 확인(안팔린경우)
        else if (actor == "seller")
        {
            if (iterator->master != account || iterator->master == iterator->owner)
            {
                eosio_assert(false, "Bad request");
            }
        }

        // trans eos to seller
        std::string sold_memo;
        sold_memo.append("nftbay_sold:", trade_id);

        asset soldPrice = asset(iterator->current_price.amount * (1.0f - TRADE_FEE), iterator->current_price.symbol);

        action(permission_level{get_self(), "active"_n},
               "eosio.token"_n, "transfer"_n,
               std::make_tuple(_self, iterator->master, soldPrice, sold_memo))
            .send();

        // change trade STATE_DONE
        trade_table.modify(iterator, contract_account, [&](auto &row) {
            row.updated = cur_time;
            row.state = STATE_DONE;
        });

        // change token owner
        successbid(iterator->master, iterator->owner, iterator->nft_type, iterator->token_id);
    }
    else
    {
        eosio_assert(false, "Trade does not exits.");
    }
}

void devtooth_nft::sendsummary(name user, std::string message)
{
    action(permission_level{get_self(), "active"_n},
           get_self(),
           "notify"_n,
           std::make_tuple(user, name{user}.to_string() + message))
        .send();
}

// 메모 형식 type:to_account:trade_id
// * type : bid, buyitnow, refund
// ex) bid:kylinaccount:23
// ex) buyitnow:kylinaccount:11
void devtooth_nft::bid()
{
    auto transfer_data = eosio::unpack_action_data<nft_transfer>();
    std::vector<std::string> tokens;
    tokenize(transfer_data.memo, tokens, ":");

    if (tokens.size() == 3)
    {
        std::vector<std::string>::iterator iter = tokens.begin();

        auto trans_type = *iter;

        if (trans_type == "bid" || trans_type == "buyitnow")
        {
            iter++;
            auto seller = name{*iter};
            iter++;
            std::string tid = *iter;
            const char *tid_char = tid.c_str();
            uint64_t trade_id = std::atoi(tid_char);
            auto buyer = transfer_data.from;
            auto bid_price = transfer_data.quantity;

            auto contract_account = name{CONTRACT_ACCOUNT};
            trade_index trade_table(contract_account, contract_account.value);
            auto iterator = trade_table.find(trade_id);

            if (iterator != trade_table.end())
            {
                std::string changes;
                name target_name = iterator->owner;
                name master_name = iterator->master;
                std::string state = iterator->state;
                asset min_price = iterator->min_price;
                asset max_price = iterator->max_price;
                asset current_price = iterator->current_price;
                uint64_t end_bid_time = iterator->end_bid_time;
                uint64_t cur_time = current_time();
                uint64_t nft_type = iterator->nft_type;
                uint64_t game_table_id = iterator->game_table_id;

                eosio_assert(master_name == seller, "seller account does not match.");
                eosio_assert(master_name != buyer, "seller cannot be a buyer.");
                eosio_assert(target_name != buyer, "already bidding.");
                eosio_assert(state == "selling", "it is not on selling product or already sold.");
                eosio_assert(end_bid_time >= cur_time, "the order deadline ends.");

                if (bid_price.symbol != symbol("EOS", 4))
                {
                    eosio_assert(false, "Invalid Bid_price format.");
                }

                eosio_assert(current_price.amount < bid_price.amount, "bid_price should be greater than previous bid_price");
                eosio_assert(min_price.amount <= bid_price.amount && max_price.amount >= bid_price.amount, "Current bid price is out of range.");

                //비딩
                if (trans_type == "bid")
                {
                    trade_table.modify(iterator, contract_account, [&](auto &row) {
                        row.current_price = bid_price;
                        row.owner = buyer;
                        row.updated = cur_time;
                    });

                    // refund eos
                    if (target_name != master_name)
                    {
                        std::string refund_memo;
                        refund_memo.append("nftbay_refund:", trade_id);

                        action(permission_level{get_self(), "active"_n},
                               "eosio.token"_n, "transfer"_n,
                               std::make_tuple(_self, target_name, current_price, refund_memo))
                            .send();
                    }
                }
                //즉구
                else if (trans_type == "buyitnow")
                {
                    if (max_price.amount == bid_price.amount)
                    {
                        // NFT 토큰 테이블의 소유자와 상태 업데이트
                        successbid(master_name, buyer, nft_type, iterator->token_id);
                        //즉구를 bid_price >= max_price 비교해서 하는게 더 타당해 보이는...?
                        // 트레이드 테이블 업데이트
                        trade_table.modify(iterator, contract_account, [&](auto &row) {
                            row.current_price = bid_price;
                            row.owner = buyer;
                            row.updated = cur_time;
                            row.state = STATE_DONE;
                        });

                        std::string sold_memo;
                        sold_memo.append("nftbay_sold:", trade_id);

                        asset soldPrice = asset(bid_price.amount * (1.0f - TRADE_FEE), bid_price.symbol);

                        action(permission_level{get_self(), "active"_n},
                               "eosio.token"_n, "transfer"_n,
                               std::make_tuple(_self, target_name, soldPrice, sold_memo))
                            .send();
                    }
                    else
                    {
                        eosio_assert(false, "invalid bid price ");
                    }
                }
            }
            else
            {
                eosio_assert(false, "there is no trade for trade_id");
            }
        }
    }
}

// test

void devtooth_nft::removetrade()
{
    require_auth(_code);
    trade_index trade_table(_code, _code.value);

    auto it = trade_table.begin();

    while (it != trade_table.end())
    {
        it = trade_table.erase(it);
    }

    auto it1 = stokens.begin();

    while (it1 != stokens.end())
    {
        it1 = stokens.erase(it1);
    }

    auto it2 = mtokens.begin();

    while (it2 != mtokens.end())
    {
        it2 = mtokens.erase(it2);
    }

    auto it3 = itokens.begin();

    while (it3 != itokens.end())
    {
        it3 = itokens.erase(it3);
    }
}

void devtooth_nft::tokenize(const std::string &str,
                            std::vector<std::string> &tokens,
                            const std::string &delimiters = " ")
{
    // 맨 첫 글자가 구분자인 경우 무시
    std::string::size_type lastPos = str.find_first_not_of(delimiters, 0);
    // 구분자가 아닌 첫 글자를 찾는다
    std::string::size_type pos = str.find_first_of(delimiters, lastPos);

    while (std::string::npos != pos || std::string::npos != lastPos)
    {
        // token을 찾았으니 vector에 추가한다
        tokens.push_back(str.substr(lastPos, pos - lastPos));
        // 구분자를 뛰어넘는다.  "not_of"에 주의하라
        lastPos = str.find_first_not_of(delimiters, pos);
        // 다음 구분자가 아닌 글자를 찾는다
        pos = str.find_first_of(delimiters, lastPos);
    }
}

extern "C"
{
    void apply(uint64_t receiver, uint64_t code, uint64_t action)
    {
        if (code == receiver)
        {
            eosio_assert(action != "transfer"_n.value, "Impossible Action");
            switch (action)
            {
                EOSIO_DISPATCH_HELPER(devtooth_nft, (create)(issue)(transferid)(changestate)(backtogame)(clean)(regauction)(cancelauc)(notify)(claim)(removetrade))
            }
        }
        else if (code == "eosio.token"_n.value && action == "transfer"_n.value)
        {
            execute_action(name(receiver), name(code), &devtooth_nft::bid);
        }
    }
};

// EOSIO_DISPATCH(devtooth_nft, (create)(issue)(transferid)(changestate)(backtogame)(clean)(regauction)(bid)(notify)(claim)(removetrade))
