#include <eosiolib/eosio.hpp>

using namespace eosio;

CONTRACT nftcenter : public contract {

public:
  using contract::contract;

  nftcenter(name receiver, name code,  datastream<const char*> ds): contract(receiver, code, ds) {}

  ACTION cancelauc(name seller, uint64_t order_id );

private:
  TABLE chis {
    uint64_t id;
    name seller;
    uint64_t order_id;

    uint64_t primary_key() const { return id; }
  };

  typedef multi_index<"chistory"_n, chis> chis_table;

  
};