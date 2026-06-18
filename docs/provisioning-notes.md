# Azure Provisioning Notes — Project 2

## Resource Group
```bash
az group create --name rg-claims-aks-demo --location canadacentral
```

## Azure Container Registry
```bash
az acr create \
  --resource-group rg-claims-aks-demo \
  --name acrclaimsstatus110587 \
  --sku Basic
```

## Build and Push Image (ARM64 for B2ps_v2 node)
```bash
docker buildx build \
  --platform linux/arm64 \
  -t acrclaimsstatus110587.azurecr.io/claims-status-aks:latest \
  --push ./app
```

## AKS Cluster
```bash
az aks create \
  --resource-group rg-claims-aks-demo \
  --name aks-claims-demo \
  --node-count 1 \
  --node-vm-size Standard_B2ps_v2 \
  --attach-acr acrclaimsstatus110587 \
  --generate-ssh-keys
```

Note: Standard_B2s is not available on free trial subscriptions in canadacentral.
Standard_B2ps_v2 (ARM64, 2 vCPU, 4GB RAM) is the equivalent available alternative.
Image must be built for linux/arm64 to match the node architecture.

## Connect kubectl to AKS
```bash
az aks get-credentials \
  --resource-group rg-claims-aks-demo \
  --name aks-claims-demo
```

## Teardown (run after every session)
```bash
# Delete main resource group
az group delete --name rg-claims-aks-demo --yes --no-wait

# Also delete the auto-generated node resource group
az group delete \
  --name MC_rg-claims-aks-demo_aks-claims-demo_canadacentral \
  --yes --no-wait
```

## Notes
- ACR Tasks (az acr build) is blocked on free trial subscriptions — use docker buildx + docker push instead
- The MC_ resource group is auto-created by AKS and must be deleted separately during teardown
- All resources are in canadacentral region