#!/bin/bash
set -e

# BoxBoxBox F1 Platform Deployment Script
# This script helps with building and deploying the application

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}║  ${YELLOW}BoxBoxBox F1 Platform - Deployment Script${BLUE}         ║${NC}"
echo -e "${BLUE}║                                                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo

# Check for required environment variables
if [ -z "$DOCKER_REGISTRY" ]; then
  echo -e "${RED}Error: DOCKER_REGISTRY environment variable is not set${NC}"
  echo -e "Please set it with: ${YELLOW}export DOCKER_REGISTRY=your-registry.com${NC}"
  exit 1
fi

# Parse command line arguments
COMMAND=${1:-"help"}
ENV=${2:-"dev"}

case $ENV in
  dev)
    KUBE_CONTEXT="minikube"
    ;;
  staging)
    KUBE_CONTEXT="staging-cluster"
    ;;
  prod)
    KUBE_CONTEXT="production-cluster"
    ;;
  *)
    echo -e "${RED}Invalid environment: $ENV${NC}"
    echo -e "Valid environments are: ${YELLOW}dev, staging, prod${NC}"
    exit 1
    ;;
esac

# Help command
function show_help {
  echo -e "${GREEN}Usage:${NC} ./deploy.sh [command] [environment]"
  echo
  echo -e "${GREEN}Commands:${NC}"
  echo -e "  ${YELLOW}build${NC}      Build Docker images"
  echo -e "  ${YELLOW}push${NC}       Push Docker images to registry"
  echo -e "  ${YELLOW}deploy${NC}     Deploy to Kubernetes"
  echo -e "  ${YELLOW}all${NC}        Build, push and deploy"
  echo -e "  ${YELLOW}help${NC}       Show this help message"
  echo
  echo -e "${GREEN}Environments:${NC}"
  echo -e "  ${YELLOW}dev${NC}        Development environment (default)"
  echo -e "  ${YELLOW}staging${NC}    Staging environment"
  echo -e "  ${YELLOW}prod${NC}       Production environment"
  echo
  echo -e "${GREEN}Examples:${NC}"
  echo -e "  ${YELLOW}./deploy.sh build dev${NC}     Build images for development"
  echo -e "  ${YELLOW}./deploy.sh all prod${NC}      Build, push and deploy to production"
}

# Build Docker images
function build_images {
  echo -e "${GREEN}Building Docker images for $ENV environment...${NC}"
  
  echo -e "${BLUE}Building frontend image...${NC}"
  docker build -t $DOCKER_REGISTRY/boxboxbox-frontend:latest -f Dockerfile.frontend .
  
  echo -e "${BLUE}Building backend image...${NC}"
  docker build -t $DOCKER_REGISTRY/boxboxbox-backend:latest -f backend/Dockerfile backend/
  
  echo -e "${GREEN}Docker images built successfully!${NC}"
}

# Push Docker images to registry
function push_images {
  echo -e "${GREEN}Pushing Docker images to registry...${NC}"
  
  echo -e "${BLUE}Pushing frontend image...${NC}"
  docker push $DOCKER_REGISTRY/boxboxbox-frontend:latest
  
  echo -e "${BLUE}Pushing backend image...${NC}"
  docker push $DOCKER_REGISTRY/boxboxbox-backend:latest
  
  echo -e "${GREEN}Docker images pushed successfully!${NC}"
}

# Deploy to Kubernetes
function deploy_to_k8s {
  echo -e "${GREEN}Deploying to $ENV environment...${NC}"
  
  echo -e "${BLUE}Setting Kubernetes context to $KUBE_CONTEXT...${NC}"
  kubectl config use-context $KUBE_CONTEXT
  
  echo -e "${BLUE}Creating namespace if it doesn't exist...${NC}"
  kubectl create namespace boxboxbox-$ENV --dry-run=client -o yaml | kubectl apply -f -
  
  echo -e "${BLUE}Applying ConfigMap and Secrets...${NC}"
  envsubst < k8s/config.yaml | kubectl apply -n boxboxbox-$ENV -f -
  
  echo -e "${BLUE}Deploying database components...${NC}"
  kubectl apply -n boxboxbox-$ENV -f k8s/database.yaml
  
  echo -e "${BLUE}Deploying backend...${NC}"
  envsubst < k8s/backend-deployment.yaml | kubectl apply -n boxboxbox-$ENV -f -
  
  echo -e "${BLUE}Deploying frontend...${NC}"
  envsubst < k8s/frontend-deployment.yaml | kubectl apply -n boxboxbox-$ENV -f -
  
  echo -e "${BLUE}Deploying ingress...${NC}"
  kubectl apply -n boxboxbox-$ENV -f k8s/ingress.yaml
  
  echo -e "${GREEN}Deployment to $ENV completed successfully!${NC}"
}

# Execute command
case $COMMAND in
  build)
    build_images
    ;;
  push)
    push_images
    ;;
  deploy)
    deploy_to_k8s
    ;;
  all)
    build_images
    push_images
    deploy_to_k8s
    ;;
  help|*)
    show_help
    ;;
esac

echo -e "${GREEN}Done!${NC}" 