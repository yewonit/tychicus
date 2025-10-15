FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 빌드 모드 인자(VUE_MODE)로 Vue 빌드 모드 제어 (default: production)
ARG VUE_MODE=production
ENV VUE_MODE=$VUE_MODE
RUN npm run build -- --mode $VUE_MODE

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
