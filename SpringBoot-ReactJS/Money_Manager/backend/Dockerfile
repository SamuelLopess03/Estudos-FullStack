FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/moneymanager-0.0.1-SNAPSHOT.jar moneymanager-v1.0.jar

EXPOSE 9090

ENTRYPOINT ["java", "-jar", "moneymanager-v1.0.jar"]
