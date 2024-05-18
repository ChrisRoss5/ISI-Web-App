FROM timbru31/java-node:21-jdk-iron

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npm install bcrypt

COPY prisma ./prisma
COPY .env .
RUN npx prisma generate
RUN npx prisma migrate reset --force

COPY . .

EXPOSE 5000 5001 5002 5003

CMD ["/bin/sh", "entrypoint.sh"]
