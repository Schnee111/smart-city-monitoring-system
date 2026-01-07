backend-java/
├── src/main/java/com/smartcity/energy/
│   ├── config/             # CassandraConfig.java (CqlSession setup)
│   ├── controller/         # REST API Endpoints
│   ├── model/              # Plain Old Java Objects (POJO)
│   ├── repository/         # Raw CQL logic (Manual execute query)
│   └── service/            # Logika bisnis & agregasi data
├── src/main/resources/
│   └── application.properties
└── pom.xml                 # Maven dependencies