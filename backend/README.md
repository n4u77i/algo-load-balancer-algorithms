# How to Run Express Servers
1. Fire-up terminal for each server.
2. Create environment variable in each terminal with the name **PORT**.
---
### For Linux
3. `export PORT=3001` for server 1 and so.  on.

### For Windows
##### CMD:
3. `set PORT=3001`
##### Powershell:
3. `$env:PORT=3001`

---

4. Then run `npm run dev`.
5. Uncomment the number of server urls that you have started in **_/loadbalancer/.env_**.
6. Finally, start the loadbalancer.