package com.nftbay.batch.job.ut;

import com.nftbay.batch.eosblocksync.service.UtNFTService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.PeriodicTrigger;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class NFTSyncJob implements InitializingBean {

    private Logger logger = LoggerFactory.getLogger(getClass());

    private ThreadPoolTaskScheduler scheduler;

    private UtNFTService nodeosService;

    @Autowired
    public NFTSyncJob(UtNFTService nodeosService) {
        this.nodeosService = nodeosService;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        startSync();
    }

    public void startSync() {
        if (scheduler != null) {
            scheduler.shutdown();
        }

        scheduler = new ThreadPoolTaskScheduler();
        scheduler.initialize();
        scheduler.schedule(runnable(), new PeriodicTrigger(50, TimeUnit.MILLISECONDS));
    }

    public void stopSync() {
        if (scheduler != null) {
            scheduler.shutdown();
        }

        scheduler = null;
    }

    private Runnable runnable() {
        return () -> {
            try {
                nodeosService.syncNFT();
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        };
    }
}
