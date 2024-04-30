command to generate keystore file 


keytool -genkeypair -v -keystore IsuzuBreakin.keystore -alias Indicosmic -keyalg RSA -keysize 2048 -validity 10000


Command used to Generate Output File 

java -jar pepk.jar --keystore=IsuzuBreakin.keystore --alias=Indicosmic  --output=IsuzuBreakin_Output.zip --include-cert --rsa-aes-encryption --encryption-key-path=encryption_public_key.pem


used JDK 

openjdk 20 2023-03-21
OpenJDK Runtime Environment (build 20+36-2344)
OpenJDK 64-Bit Server VM (build 20+36-2344, mixed mode, sharing)