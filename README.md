# Load Balancer Setup Guide

This project implements a load balancer with support for multiple algorithms, including **Round Robin**, **Least Connection**, **Least Response Time**, and **Source IP Hash**. The load balancer forwards client requests to backend servers based on the chosen algorithm and tracks server metrics for analysis.

---

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure you have Node.js (v14 or later) installed.
- **npm**: Installed alongside Node.js.
- **Apache Benchmark** (optional): For testing and tracking performance.

---

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/load-balancer.git
   cd load-balancer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

---

### Usage

#### Start Backend Servers

1. Navigate to the directory `cd backend/`
2. Launch the backend servers on desired ports:

```bash
npm run dev 3001
npm run dev 3002
npm run dev 3003
npm run dev 3004
npm run dev 3005
```

#### Run the Load Balancer

1. Navigate to the directory `cd loadbalancer/`
2. Start the load balancer and specify a port:

```bash
npm run dev 8080
```

#### Send Requests to the Load Balancer

Use the `/algo` query parameter to specify the algorithm (default: `RoundRobin`).

Example:

```bash
curl http://localhost:8080?algo=RoundRobin
curl http://localhost:8080?algo=LeastConnection
curl http://localhost:8080?algo=SourceIpHash
```

---

### Track Metrics

- **View metrics for backend server performance**:

  ```bash
  curl http://localhost:8080/metrics
  ```

- **Reset metrics**:

  ```bash
  curl http://localhost:8080/reset-metrics
  ```

- **Health Check**: Verify the health of the load balancer:
  ```bash
  curl http://localhost:8080/health
  ```

---

### Load Testing with Apache Benchmark

You can test the load balancer using Apache Benchmark:

```bash
ab -n 1000 -c 10 "http://localhost:8080?algo=RoundRobin"
```

- `-n`: Number of requests to send.
- `-c`: Number of concurrent requests.

---

### Key Features

- **Algorithm Selection**: Pass the desired algorithm via the `algo` query parameter.
- **Dynamic Port**: Start the load balancer on any port using:

  ```bash
  npm run dev <PORT>
  ```

  Example:

  ```bash
  npm run dev 3001
  ```

- **Server Metrics**:
  - Tracks total requests and average response time for each backend server.
  - Provides a `/metrics` endpoint for easy analysis.

---

### Algorithms Supported

| **Algorithm**           | **Description**                                                       |
| ----------------------- | --------------------------------------------------------------------- |
| **Round Robin**         | Distributes requests sequentially across all backend servers.         |
| **Least Connection**    | Routes requests to the server with the fewest active connections.     |
| **Least Response Time** | Directs traffic to the server with the fastest average response time. |
| **Source IP Hash**      | Hashes client IP to consistently route requests to the same server.   |

---

### Example Queries

- **Round Robin**:

  ```bash
  curl http://localhost:8080/?algo=RoundRobin
  ```

- **Least Connection**:

  ```bash
  curl http://localhost:8080/?algo=LeastConnection
  ```

- **Least Response Time**:

  ```bash
  curl http://localhost:8080/?algo=LeastResponseTime
  ```

- **Source IP Hash**:
  ```bash
  curl http://localhost:8080/?algo=SourceIpHash
  ```

---

### Metrics Example

Metrics provide insights into backend performance:

```json
{
  "Server 1": {
    "totalRequests": 100,
    "avgResponseTime": 0.12
  },
  "Server 2": {
    "totalRequests": 150,
    "avgResponseTime": 0.15
  }
}
```
