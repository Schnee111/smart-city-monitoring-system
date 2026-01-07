package com.smartcity.energy.repository;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.*;
import com.smartcity.energy.model.DistrictProfile;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * DistrictProfile Repository - Raw CQL implementation (NO ORM)
 */
@Repository
public class DistrictProfileRepository {

    private final CqlSession session;

    private PreparedStatement insertStmt;
    private PreparedStatement selectAllStmt;
    private PreparedStatement selectByNameStmt;
    private PreparedStatement updateStmt;
    private PreparedStatement deleteStmt;

    public DistrictProfileRepository(CqlSession session) {
        this.session = session;
    }

    @PostConstruct
    public void init() {
        insertStmt = session.prepare(
            "INSERT INTO district_profiles (district_name, population, category) VALUES (?, ?, ?)"
        );

        selectAllStmt = session.prepare(
            "SELECT district_name, population, category FROM district_profiles"
        );

        selectByNameStmt = session.prepare(
            "SELECT district_name, population, category FROM district_profiles WHERE district_name = ?"
        );

        updateStmt = session.prepare(
            "UPDATE district_profiles SET population = ?, category = ? WHERE district_name = ?"
        );

        deleteStmt = session.prepare(
            "DELETE FROM district_profiles WHERE district_name = ?"
        );
    }

    /**
     * Save district profile
     */
    public DistrictProfile save(DistrictProfile profile) {
        BoundStatement bound = insertStmt.bind(
            profile.getDistrictName(),
            profile.getPopulation(),
            profile.getCategory()
        );
        session.execute(bound);
        return profile;
    }

    /**
     * Find all district profiles
     */
    public List<DistrictProfile> findAll() {
        ResultSet rs = session.execute(selectAllStmt.bind());
        List<DistrictProfile> profiles = new ArrayList<>();

        for (Row row : rs) {
            profiles.add(mapRowToDistrictProfile(row));
        }

        return profiles;
    }

    /**
     * Find district profile by name
     */
    public Optional<DistrictProfile> findByName(String districtName) {
        BoundStatement bound = selectByNameStmt.bind(districtName);
        ResultSet rs = session.execute(bound);
        Row row = rs.one();

        if (row != null) {
            return Optional.of(mapRowToDistrictProfile(row));
        }
        return Optional.empty();
    }

    /**
     * Update district profile
     */
    public void update(DistrictProfile profile) {
        BoundStatement bound = updateStmt.bind(
            profile.getPopulation(),
            profile.getCategory(),
            profile.getDistrictName()
        );
        session.execute(bound);
    }

    /**
     * Delete district profile
     */
    public void deleteByName(String districtName) {
        BoundStatement bound = deleteStmt.bind(districtName);
        session.execute(bound);
    }

    /**
     * Map Cassandra Row to DistrictProfile object
     */
    private DistrictProfile mapRowToDistrictProfile(Row row) {
        DistrictProfile profile = new DistrictProfile();
        profile.setDistrictName(row.getString("district_name"));
        profile.setPopulation(row.getInt("population"));
        profile.setCategory(row.getString("category"));
        return profile;
    }
}
