package com.smartcity.energy.config;

import com.datastax.oss.driver.api.core.CqlSession;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.InetSocketAddress;

/**
 * Cassandra Configuration using DataStax Java Driver 4.x
 * IMPORTANT: NO ORM - Using Raw CQL with CqlSession and PreparedStatement
 */
@Configuration
public class CassandraConfig {

    @Value("${cassandra.contact-points}")
    private String contactPoints;

    @Value("${cassandra.port}")
    private int port;

    @Value("${cassandra.keyspace}")
    private String keyspace;

    @Value("${cassandra.local-datacenter}")
    private String localDatacenter;

    private CqlSession session;

    @Bean
    public CqlSession cqlSession() {
        session = CqlSession.builder()
                .addContactPoint(new InetSocketAddress(contactPoints, port))
                .withLocalDatacenter(localDatacenter)
                .withKeyspace(keyspace)
                .build();
        return session;
    }

    @PreDestroy
    public void closeSession() {
        if (session != null && !session.isClosed()) {
            session.close();
        }
    }
}
