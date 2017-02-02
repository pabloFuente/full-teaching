FROM java:8
ADD full-teaching-0.5-SNAPSHOT.war app.jar
ADD init.sh init.sh
RUN chmod +x /init.sh
RUN bash -c 'touch /app.jar'
ENTRYPOINT ["/init.sh"]