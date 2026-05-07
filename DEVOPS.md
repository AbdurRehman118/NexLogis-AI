# NexLogis.ai | DevOps Implementation Plan

This plan details how to transition the NexLogis platform into a professional DevOps-managed environment.

## 🏁 DevOps Strategy
The goal is to move from manual `npm run dev` and `uvicorn` commands to an automated **Containerized Lifecycle**.

### 1. Continuous Integration (GitHub Actions)
Create a `.github/workflows/main.yml` file to automate quality checks:
- **Python Check**: Run `pytest` on `api/main.py`.
- **Node Check**: Run `npm run build` for the frontend.
- **Trigger**: Automatic on every `git push` via GitHub Desktop.

### 2. Containerization (Docker)
Docker ensures that the complex PDF/Excel parsing dependencies work perfectly on any server.
- **Backend**: Use a `python:3.13-slim` base image.
- **Frontend**: Use a multi-stage build with `nginx:alpine`.
- **Orchestration**: Use `docker-compose.yml` to launch both services with a shared network.

### 3. Deployment Strategy
- **Platform**: Recommend **Railway.app** or **Render.com** for their native support for Docker and GitHub integration.
- **Persistence**: Ensure `api/rate_store.json` is mounted to a **Persistent Volume** so data is not lost during redeploys.

---

## 🖥️ Using with GitHub Desktop
Since you utilize **GitHub Desktop**, your workflow is simplified:
1. **Sync**: Click **Fetch Origin** to get latest changes.
2. **Changes**: Modify code in your IDE.
3. **Commit**: GitHub Desktop lists all changes. Write your summary and click **Commit to main**.
4. **Deploy**: Click **Push Origin**. This push will automatically trigger the GitHub Actions CI/CD pipeline on the remote server.

---
*Created for the NexLogis MLOps Project.*
