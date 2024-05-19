FROM timbru31/java-node:21-jdk-iron

WORKDIR /app

COPY package*.json .
RUN npm install

COPY prisma ./prisma
COPY .env .
COPY src/utils/logger.ts src/utils/logger.ts
RUN npx prisma generate
RUN npx prisma migrate reset --force

COPY . .

EXPOSE 5000 5001 5002 5003

CMD ["/bin/sh", "entrypoint.sh"]
