# Verwenden Sie ein offizielles Node.js-Image als Basis
FROM node:18-alpine

# Setzen Sie das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopieren Sie package.json und package-lock.json in das Arbeitsverzeichnis
COPY package*.json ./

# Installieren Sie die Abhängigkeiten
RUN npm install

# Kopieren Sie den Rest des Anwendungsquellcodes
COPY . .

# Bauen Sie die Anwendung
RUN npm run build

# Exponieren Sie den Port, auf dem die Anwendung läuft
EXPOSE 4173

# Starten Sie den Vite Preview Server
CMD ["npm", "run", "preview"]