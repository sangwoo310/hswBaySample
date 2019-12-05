#include "nftcenter.hpp"

void nftcenter::cancelauc(name seller, uint64_t order_id) {
    require_auth(seller);
    
    chis_table chistable(_code, _code.value);
    auto iterator = chistable.find(seller.value);
    if (iterator == chistable.end())
    {
        chistable.emplace(seller, [&](auto& row) {
            row.seller = seller;
            row.order_id = order_id;
        });
    }
    else {
        std::string changes;
        chistable.modify(iterator, seller, [&](auto& row) {
            row.seller = seller;
            row.order_id = order_id;
        });
    }

    // eosio_assert(false, "welcome to nft center : cancelauc");
}

EOSIO_DISPATCH( nftcenter, (cancelauc))