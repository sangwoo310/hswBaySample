#include <eosiolib/eosio.hpp>

using namespace eosio;

class[[eosio::contract]] externcont : public eosio::contract{

public:
	using contract::contract;

	externcont(name receiver, name code, datastream<const char*> ds) : contract(receiver, code, ds) {};

	[[eosio::action]]
	void eostransfer(name from, name to, uint64_t id ) {
		require_auth(from);
		externcont_index externcont_table(_code, _code.value);
		auto iterator = externcont_table.find(from.value);

		if (iterator == externcont_table.end())
		{
			externcont_table.emplace(from, [&](auto& row) {
				row.id = id;
				row.from = from;
				row.to= to;
			});
		}
		else {
			std::string changes;
			externcont_table.modify(iterator, from, [&](auto& row) {
				row.id = id;
				row.from= from;
				row.to= to;
			});
		}

		eosio_assert(false, "wow error in externcont contract!");
	}


private:
	struct[[eosio::table]] tran{
		uint64_t id;
		name from;
		name to;

		uint64_t primary_key() const { return id; }
	};

	typedef eosio::multi_index<"trans"_n, tran> externcont_index;
};

EOSIO_DISPATCH(externcont, (eostransfer))


