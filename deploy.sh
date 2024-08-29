
# Salir inmediatamente si un comando falla
set -e

# Ejecutar el build
echo "Running yarn build..."
yarn run build

# Desplegar en Firebase
echo "Deploying to Firebase..."
yarn firebase deploy

echo "Deployment complete."
