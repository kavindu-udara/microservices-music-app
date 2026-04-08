# Microservice Music Application

music-app/
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml
├── .env.example
├── services/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── catalog-service/
│   ├── streaming-service/
│   ├── playlist-service/
│   ├── search-service/
│   └── analytics-service/
├── packages/
│   ├── shared/          # Zod schemas, types, error classes, logger
│   ├── db/              # Prisma/Drizzle clients, migration helpers
│   └── messaging/       # RabbitMQ/Redis pub-sub wrappers
└── infra/
    ├── docker/
    ├── k8s/             # (Optional) Helm/Kustomize manifests
    └── scripts/         # Bootstrap, seed, health checks

> Project is still under development