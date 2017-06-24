# NGINX
sudo apt-get update
sudo apt-get install nginx
sudo service nginx restart

#JAVA
sudo apt-get install default-jre

# KMS
echo "deb http://ubuntu.kurento.org xenial kms6" | sudo tee /etc/apt/sources.list.d/kurento.list
wget -O - http://ubuntu.kurento.org/kurento.gpg.key | sudo apt-key add -
sudo apt-get update
sudo apt-get install kurento-media-server-6.0

# VARIABLES
INTERNALIP="$(ip route get 8.8.8.8 | awk '{print $NF; exit}')"
PUBLICIP="$(wget -qO- ipinfo.io/ip)"

# TURN SERVER
sudo apt-get install coturn

# WEBRTC ENDPOINT CONF
sudo touch /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo chmod 777 /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo > /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo echo "stunServerAddress=193.147.51.12" >> /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo echo "stunServerPort=3478" >> /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini
sudo echo "turnURL=FTOPENVIDU:FTOPENVIDU@${PUBLICIP}:3478" >> /etc/kurento/modules/kurento/WebRtcEndpoint.conf.ini

# TURN CONF
sudo touch /etc/turnserver.conf
sudo chmod 777 /etc/turnserver.conf
sudo > /etc/turnserver.conf
sudo echo "external-ip=${PUBLICIP}" >> /etc/turnserver.conf
sudo echo "fingerprint" >> /etc/turnserver.conf
sudo echo "user=FTOPENVIDU:FTOPENVIDU" >> /etc/turnserver.conf
sudo echo "lt-cred-mech" >> /etc/turnserver.conf
sudo echo "realm=kurento.org" >> /etc/turnserver.conf
sudo echo "log-file=/var/log/turnserver/turnserver.log" >> /etc/turnserver.conf
sudo echo "simple-log" >> /etc/turnserver.conf

# TURN CONF
sudo touch /etc/default/coturn
sudo chmod 777 /etc/default/coturn
sudo > /etc/default/coturn
sudo echo "TURNSERVER_ENABLED=1" >> /etc/default/coturn

# INIT SERVICES
sudo service coturn restart
sudo service kurento-media-server-6.0 restart

# DOCKER
sudo sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
sudo apt-get install -y docker-engine
sudo usermod -aG docker $(whoami)
sudo docker stop $(docker ps -a -q)
sudo docker rm $(docker ps -a -q)
sudo docker run -d -p 8443:8443 -e kms.uris=[\"ws://${INTERNALIP}:8888/kurento\"] -e openvidu.security=true -e openvidu.secret=MY_SECRET openvidu/openvidu-server

