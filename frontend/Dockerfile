FROM node:20-alpine3.18

WORKDIR /app

# Copy only package.json + lock first (better layer caching)
COPY package*.json ./

# Install deps
RUN npm install

# Copy rest of the source
COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["npm", "run", "dev"]
