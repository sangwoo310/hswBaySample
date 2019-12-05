#include "devtooth_nft_new.hpp"

namespace eosio {
    using std::string;
    using eosio::asset;
	
    void uts::create( name issuer, string sym ) {
	    require_auth( get_self() );

	    // Check if issuer account exists
	    eosio_assert( is_account( issuer ), "issuer account does not exist");

        // Valid symbol
        asset supply(0, symbol(sym, 0));

        auto symbol = supply.symbol;
        eosio_assert( symbol.is_valid(), "invalid symbol name" );
        eosio_assert( supply.is_valid(), "invalid supply");

        // Check if currency with symbol already exists
        currency_index currency_table( get_self(), symbol.code().raw() );
        auto existing_currency = currency_table.find( symbol.code().raw() );
        eosio_assert( existing_currency == currency_table.end(), "token with symbol already exists" );

        // Create new currency
        currency_table.emplace( get_self(), [&]( auto& currency ) {
           currency.supply = supply;
           currency.issuer = issuer;
        });
    }

    void uts::issue(name to, asset quantity, uint64_t index)
    {
	    eosio_assert( is_account( to ), "to account does not exist");

        // e,g, Get EOS from 3 EOS
        symbol symbol = quantity.symbol;
        eosio_assert( symbol.is_valid(), "invalid symbol name" );
        eosio_assert( symbol.precision() == 0, "quantity must be a whole number" );

        // Ensure currency has been created
        auto symbol_name = symbol.code().raw();
        currency_index currency_table( get_self(), symbol_name );
        auto existing_currency = currency_table.find( symbol_name );
        eosio_assert( existing_currency != currency_table.end(), "token with symbol does not exist. create token before issue" );
        const auto& st = *existing_currency;

        // Ensure have issuer authorization and valid quantity
        //require_auth( to );
        require_auth(to);
        eosio_assert( quantity.is_valid(), "invalid quantity" );
        eosio_assert( quantity.amount > 0, "must issue positive quantity of uts" );
        eosio_assert( symbol == st.supply.symbol, "symbol precision mismatch" );

        // Case UTS
        if( symbol == S(0, UTS)){
            // Get Servant info
            servant_table servant(N(unlimittest1), to);
            auto servant_iter = servant.get(index, "Not exist Servant");

            // Check Token duplication
            auto uts_list = s_tokens.get_index<N(byowner)>();
            bool not_exist = true;
            for(auto it = uts_list.begin(); it != uts_list.end(); ++it){
                if(it->t_idx == servant_iter.index){
                    not_exist = false;
                    break;
                }
            }
            eosio_assert(not_exist, "Already exist Token");

             // Add token with creator paying for RAM
            s_tokens.emplace( to, [&]( auto& token ) {
                token.idx = s_tokens.available_primary_key();
                token.t_idx = index;
                token.s_idx = servant_iter.id;
                token.state = "idle";

                token.owner = to;
                token.value = asset{1, symbol};
            });
        }
        // Case UTM
        if( symbol == S(0, UTM)){
            // Get Monster info
            monster_table monster(N(unlimittest1), to);
            auto monster_iter = monster.get(index, "Not exist Monster");

            // Check Token duplication
            auto utm_list = m_tokens.get_index<N(byowner)>();
            bool not_exist = true;
            for(auto it = utm_list.begin(); it != utm_list.end(); ++it){
                if(it->t_idx == monster_iter.index){
                    not_exist = false;
                    break;
                }
            }
            eosio_assert(not_exist, "Already exist Token");

             // Add token with creator paying for RAM
            m_tokens.emplace( to, [&]( auto& token ) {
                token.idx = m_tokens.available_primary_key();
                token.t_idx = index;
                token.m_idx = monster_iter.id;
                token.state = "idle";

                token.owner = to;
                token.value = asset{1, symbol};
            });
        }
        // Case UTI
        if( symbol == S(0, UTI)){
            // Get Item info
            item_table item(N(unlimittest1), to);
            auto item_iter = item.get(index, "Not exist Item");

            // Check Token duplication
            auto uti_list = i_tokens.get_index<N(byowner)>();
            bool not_exist = true;
            for(auto it = uti_list.begin(); it != uti_list.end(); ++it){
                if(it->t_idx == item_iter.index){
                    not_exist = false;
                    break;
                }
            }
            eosio_assert(not_exist, "Already exist Token");

             // Add token with creator paying for RAM
            i_tokens.emplace( to, [&]( auto& token ) {
                token.idx = i_tokens.available_primary_key();
                token.t_idx = index;
                token.i_idx = item_iter.id;
                token.state = "idle";

                token.owner = to;
                token.value = asset{1, symbol};
            });
        }

        // Increase supply
	    add_supply( quantity );

        // Add balance to account
        add_balance( to, quantity, to );
    }

    void uts::transferid( name from, name to, id_type id, string sym)
    {
        // Ensure authorized to send from account
        eosio_assert( from != to, "cannot transfer to self" );
        require_auth( from );

        // Ensure 'to' account exists
        eosio_assert( is_account( to ), "to account does not exist");

        asset token(0, string_to_symbol(0, sym.c_str()));

        // UTS
        if( token.symbol == S(0, UTS) ){
            auto sender_token = s_tokens.find( id );
            eosio_assert( sender_token != s_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( sender_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( sender_token->state == "idle", "a non-tradeable token");

            const auto& st = *sender_token;

            s_tokens.modify( st, from, [&]( auto& token ) {
	            token.owner = to;
            });

            sub_balance( from, st.value );
            add_balance( to, st.value, from );
        }
        // UTM
        if( token.symbol == S(0, UTM) ){
            auto sender_token = m_tokens.find( id );
            eosio_assert( sender_token != m_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( sender_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( sender_token->state == "idle", "a non-tradeable token");

            const auto& st = *sender_token;

            m_tokens.modify( st, from, [&]( auto& token ) {
	            token.owner = to;
            });

            sub_balance( from, st.value );
            add_balance( to, st.value, from );
        }
        // UTI
        if( token.symbol == S(0, UTI) ){
            auto sender_token = i_tokens.find( id );
            eosio_assert( sender_token != i_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( sender_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( sender_token->state == "idle", "a non-tradeable token");

            const auto& st = *sender_token;

            i_tokens.modify( st, from, [&]( auto& token ) {
	            token.owner = to;
            });

            sub_balance( from, st.value );
            add_balance( to, st.value, from );
        }

	    // Notify both recipients
        require_recipient( from );
        require_recipient( to );
    }

    void uts::changestate(name from, string sym, id_type id){
        require_auth(from);

        asset token(0, string_to_symbol(0, sym.c_str()));

        // UTS
        if( token.symbol == S(0, UTS) ){
            auto target_token = s_tokens.find( id );
            eosio_assert( target_token != s_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");

            const auto& st = *target_token;

            if(st.state == "idle"){
                s_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "auction";
                });
            }
            else{
                s_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "idle";
                });
            }
        }
        // UTM
        if( token.symbol == S(0, UTM) ){
            auto target_token = m_tokens.find( id );
            eosio_assert( target_token != m_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");

            const auto& st = *target_token;

            if(st.state == "idle"){
                m_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "auction";
                });
            }
            else{
                m_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "idle";
                });
            }
        }
        // UTI
        if( token.symbol == S(0, UTI) ){
            auto target_token = i_tokens.find( id );
            eosio_assert( target_token != i_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");

            const auto& st = *target_token;

            if(st.state == "idle"){
                i_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "auction";
                });
            }
            else{
                i_tokens.modify( st, from, [&]( auto& token ) {
	            token.state = "idle";
                });
            }
        }
    }

    void uts::backtogame(name from, string sym, id_type id){
        require_auth(from);

        asset token(0, string_to_symbol(0, sym.c_str()));

        // UTS
        if( token.symbol == S(0, UTS) ){
            auto target_token = s_tokens.find( id );
            eosio_assert( target_token != s_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( target_token->state == "idle", "Can not back to game in auction");

            const auto& st = *target_token;

            s_tokens.erase( st ); 
        }
        // UTM
        if( token.symbol == S(0, UTM) ){
            auto target_token = m_tokens.find( id );
            eosio_assert( target_token != m_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( target_token->state == "idle", "Can not back to game in auction");

            const auto& st = *target_token;

            m_tokens.erase( st ); 
        }
        // UTI
        if( token.symbol == S(0, UTI) ){
            auto target_token = i_tokens.find( id );
            eosio_assert( target_token != i_tokens.end(), "token with specified ID does not exist" );
            eosio_assert( target_token->owner == from, "sender does not own token with specified ID");
            eosio_assert( target_token->state == "idle", "Can not back to game in auction");

            const auto& st = *target_token;

            i_tokens.erase( st ); 
        }
    }

    void uts::clean() {
        for(auto iter = s_tokens.begin(); iter != s_tokens.end();){
            auto token_iter = s_tokens.find(iter->primary_key());
            iter++;
            s_tokens.erase(token_iter);
        }

        for(auto iter2 = m_tokens.begin(); iter2 != m_tokens.end();){
            auto token_iter2 = m_tokens.find(iter2->primary_key());
            iter2++;
            m_tokens.erase(token_iter2);
        }

        for(auto iter3 = i_tokens.begin(); iter3 != i_tokens.end(); ){
            auto token_iter3 = i_tokens.find(iter3->primary_key());
            iter3++;
            i_tokens.erase(token_iter3);
        }
    }

    void uts::sub_balance( name owner, asset value ) 
    {
        account_index from_acnts( get_self(), owner );
        const auto& from = from_acnts.get( value.symbol.name(), "no balance object found" );
        eosio_assert( from.balance.amount >= value.amount, "overdrawn balance" );


        if( from.balance.amount == value.amount ) {
            from_acnts.erase( from );
        } else {
            from_acnts.modify( from, owner, [&]( auto& a ) {
                a.balance -= value;
            });
        }
    }

    void uts::add_balance( name owner, asset value, name ram_payer )
    {
        account_index to_accounts( get_self(), owner );
        auto to = to_accounts.find( value.symbol.name() );
        if( to == to_accounts.end() ) {
            to_accounts.emplace( ram_payer, [&]( auto& a ){
                a.balance = value;
            });
        } else {
            to_accounts.modify( to, 0, [&]( auto& a ) {
                a.balance += value;
            });
        }
    }

    void uts::sub_supply( asset quantity ) {
        auto symbol_name = quantity.symbol.name();
        currency_index currency_table( get_self(), symbol_name );
        auto current_currency = currency_table.find( symbol_name );

        currency_table.modify( current_currency, 0, [&]( auto& currency ) {
            currency.supply -= quantity;
        });
    }

    void uts::add_supply( asset quantity )
    {
        auto symbol_name = quantity.symbol.name();
        currency_index currency_table( get_self(), symbol_name );
        auto current_currency = currency_table.find( symbol_name );

        currency_table.modify( current_currency, 0, [&]( auto& currency ) {
            currency.supply += quantity;
        });
    }

EOSIO_DISPATCH( uts, (create)(issue)(transferid)(changestate)(backtogame)(clean) )

} /// namespace eosio
