FROM nginx:stable-alpine
LABEL authors="yahkerobertkertasnya"

WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY . .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]