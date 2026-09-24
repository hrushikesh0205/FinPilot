# -------------------------------------------------------------
# Stage 1: Build the Spring Boot application using Maven Wrapper
# -------------------------------------------------------------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper configuration and project descriptor
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Normalize line endings (CRLF to LF) and ensure execute permissions
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Pre-fetch dependencies to speed up future builds via layer caching
RUN ./mvnw dependency:resolve -B

# Copy application source code
COPY src ./src

# If application.properties is absent (gitignored in repo), initialize from example template
RUN if [ ! -f src/main/resources/application.properties ] && [ -f src/main/resources/application.properties.example ]; then \
        cp src/main/resources/application.properties.example src/main/resources/application.properties; \
    fi

# Package the application into a standalone executable JAR (skipping tests)
RUN ./mvnw clean package -DskipTests -B

# Copy the built JAR to a fixed name for clean multi-stage transfer
RUN cp target/finpilot-*.jar app.jar

# -------------------------------------------------------------
# Stage 2: Production runtime container
# -------------------------------------------------------------
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy executable JAR from build stage
COPY --from=builder /app/app.jar app.jar

# Default port configuration for Railway (overridden dynamically at runtime by $PORT)
ENV PORT=8080
EXPOSE ${PORT}

# Run the Spring Boot application binding to 0.0.0.0 and listening on Railway's $PORT
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:-} -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar"]
