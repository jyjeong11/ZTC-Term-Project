# --- Build Stage ---
FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# --- Run Stage (Nginx) ---
FROM nginx:latest

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# dist 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
