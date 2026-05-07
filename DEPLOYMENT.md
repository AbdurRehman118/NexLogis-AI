# EC2 Deployment Guide for NexLogis AI

This guide will help you set up a fresh AWS EC2 instance (Ubuntu 22.04 LTS recommended) to run the NexLogis AI platform using Docker.

## 1. AWS Console Configuration

### Security Group Settings
Ensure your EC2 Security Group has the following inbound rules:
- **SSH (22)**: From your IP.
- **HTTP (80)**: From anywhere (for the Frontend).
- **Custom TCP (8000)**: From anywhere (for the Backend API).

---

## 2. Connect to your Instance

SSH into your instance using your key pair:
```bash
ssh -i "your-key.pem" ubuntu@your-ec2-public-dns
```

---

## 3. Install Docker & Docker Compose

Run the following commands to install Docker on your Ubuntu instance:

```bash
# Update packages
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update

# Install Docker
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Allow your user to run docker commands without sudo (optional, requires re-login)
sudo usermod -aG docker $USER
```

---

## 4. Clone & Configure

1. **Clone your repository**:
   ```bash
   git clone <your-repo-url>
   cd NexLogis-AI
   ```

2. **Set up Production Environment**:
   Copy the production templates to create the active `.env` files:
   ```bash
   cp api/.env.production api/.env
   cp web_app/.env.production web_app/.env
   ```
   
3. **Configure Build Arguments**:
   The frontend needs to know where the API is located *during build time*. Export the `VITE_API_URL` before running docker-compose:
   ```bash
   # Replace with your EC2 Public IP or Domain
   export VITE_API_URL=http://your-ec2-ip:8000
   ```

---

## 5. Deploy

Run the stack in detached mode:
```bash
docker compose up -d --build
```

### Useful Commands
- **Check logs**: `docker compose logs -f`
- **Stop application**: `docker compose down`
- **Check running containers**: `docker ps`

---

## 6. Optimization (Optional)

If you have a domain, it is recommended to use **Nginx** as a reverse proxy with **SSL (Certbot)** to handle traffic on port 443.
