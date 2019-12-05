#!/bin/bash

eosio-cpp -o devtooth_nft.wasm devtooth_nft.cpp --abigen
cleos wallet unlock -n default --password $1
cleos -u http://jungle2.cryptolions.io set contract epochchasert ./ -p epochchasert@active 
