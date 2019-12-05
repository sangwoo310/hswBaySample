#include <eosiolib/eosio.hpp>

using namespace eosio;

class[[eosio::contract]] nftbay : public eosio::contract{

public:
	using contract::contract;

	nftbay(name receiver, name code, datastream<const char*> ds) : contract(receiver, code, ds) {};

	[[eosio::action]]
	void regauction(name seller, uint64_t id, uint64_t buy_price_eos) {
		require_auth(seller);
		nftbay_index nftbay_table(_code, _code.value);
		auto iterator = nftbay_table.find(seller.value);
		if (iterator == nftbay_table.end())
		{
			nftbay_table.emplace(seller, [&](auto& row) {
				row.id = id;
				row.seller = seller;
				row.buy_price_eos = buy_price_eos;
			});

			sendsummary(seller, " successfully emplaced record to nftbay_table");
		}
		else {
			std::string changes;
			nftbay_table.modify(iterator, seller, [&](auto& row) {
				row.id = id;
				row.seller = seller;
				row.buy_price_eos = buy_price_eos;
			});

			sendsummary(seller, " successfully modified record to nftbay_table");
		}
	}


	[[eosio::action]]
	void cancelauc(name seller, uint64_t order_id) {
		sendsummary(seller, " cancel auction");
	}

	[[eosio::action]]
	void extest(name from, name to, uint64_t id) {
		regauctionextern(from, to, id);
	}


	[[eosio::action]]
	void bid(name buyer, uint64_t order_id, uint64_t bid_eos) {
		sendsummary(buyer, " bid");
	}


	[[eosio::action]]
	void cancelbid(name buyer, uint64_t order_id) {
		sendsummary(buyer, " cancel bid");
	}


	[[eosio::action]]
	void buy(name buyer, uint64_t order_id) {
		sendsummary(buyer, " buy");
	}


	[[eosio::action]]
	void notify(name user, std::string msg) {
		require_auth(get_self());
		require_recipient(user);
	}

private:
	struct[[eosio::table]] order {
		uint64_t id;
		uint64_t token_id;
		std::string token_type;
		name seller;

		uint64_t buy_price_eos;
		uint64_t bid_price_eos;
		uint64_t end_bid_time;
		std::string state;
		uint64_t created;
		uint64_t updated;

		uint64_t primary_key() const { return id; }
		uint64_t by_token_id() const { return token_id; }
	};
	
	typedef eosio::multi_index<"orders"_n, order, indexed_by<"bytokenid"_n, const_mem_fun<order, uint64_t, &order::by_token_id>>> nftbay_index;
	
	struct[eosio::table]] bid{
		uint64_t id;
		uint64_t order_id;
		
		name buyer;
		uint64_t bid_price;
		uint64_t created;
		
		uint64_t primary_key() const { return id; }
		uint64_t by_buyer() const {return buyer; }
		uint64_t by_bid_price() const{ return bid_price;}
		uint64_t by_created() const { return created; }
	}

	typedef eosio::multi_index<"bids"_n, bid, indexed_by<"bybuyer"_n, const_mem_fun<bid, name, &bid::by_buyer>>, indexed_by<"bybidprice"_n, const_mem_fun<bid, uint64_t, &bid::by_bid_price>>, indexed_by<"bycreated"_n, const_mem_fun<bid, uint64_t, &bid::by_created>>> bidtable;


	void sendsummary(name user, std::string message) {
		
		action(permission_level{ get_self(), "active"_n },
			get_self(),
			"notify"_n,
			std::make_tuple(user, name{ user }.to_string() + message)
		).send();
	}

	void regauctionextern(name from, name to, uint64_t id) {
		action eostransfer= action(
			permission_level{ get_self(),"active"_n },
			"obkobkobk222"_n,
			"eostransfer"_n,
			std::make_tuple(from, to, id, std::string("are you sure?"))
		);

		eostransfer.send();
	}
};

EOSIO_DISPATCH(nftbay, (regauction)(cancelauc)(bid)(cancelbid)(buy)(notify)(extest))


