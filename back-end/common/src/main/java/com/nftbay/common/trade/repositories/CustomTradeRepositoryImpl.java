package com.nftbay.common.trade.repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class CustomTradeRepositoryImpl implements CustomTradeRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public CustomTradeRepositoryImpl( EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<Object[]> getRanking() {
        return entityManager.createNativeQuery("select owner, sum(current_price) c from trade where state = 'DONE' and owner != master group by owner order by c desc limit 10").getResultList();
    }
}
