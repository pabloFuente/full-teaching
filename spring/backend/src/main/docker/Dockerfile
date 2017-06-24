FROM java:8
ADD full-teaching-0.5-SNAPSHOT.war app.jar

## Add the init script to the image
ADD init.sh init.sh
RUN chmod +x /init.sh

## Add the wait script to the image
ADD wait.sh wait.sh
RUN chmod +x /wait.sh

RUN bash -c 'touch /app.jar'

RUN apt-get update
RUN apt-get install netcat-openbsd

EXPOSE 5000

CMD /wait.sh && /init.sh