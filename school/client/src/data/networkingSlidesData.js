export const networkingSlidesData = [
  // =========================
  // Networking Module 1: Introduction to Computer Networking
  // =========================

  {
    "id": 0,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Welcome to Computer Networking",
    "type": "lesson",
    "content": {
      "body": "This module is your entry point into computer networking — one of the most foundational skills in technology. Whether you are a developer, a security engineer, a systems administrator, or just getting started, understanding how networks work will make you better at everything you do.\n\n## What This Module Covers\n\nWe start from first principles: what a network actually is, why networking knowledge matters across every technical role, and how data physically moves from one device to another. By the end of this module you will understand the building blocks that every subsequent module builds on.\n\n## What You Will Be Able to Do\n\n- Explain what a computer network is and how devices communicate\n- Identify the different types of networks (PAN, LAN, MAN, WAN)\n- Name the key network components and what each one does\n- Describe the difference between client-server and peer-to-peer models\n- Explain bandwidth, latency, and throughput and why each matters\n- Identify common network topologies and their trade-offs\n\n## How to Approach This Course\n\nNetworking is a practical discipline. Every concept in this course has a corresponding command you can run on a real machine. Run the commands. Break things. Fix them. The engineers who truly understand networking are the ones who have spent time at the terminal watching packets move.",
      "diagram": "flowchart TD\n    A[\"Module 1\"] --> B[\"What is networking?\"]\n    A --> C[\"Network types\nPAN LAN MAN WAN\"]\n    A --> D[\"Components\nswitch router AP firewall\"]\n    A --> E[\"Data transmission\npackets bandwidth latency\"]\n    A --> F[\"Protocols\nrules for communication\"]\n    A --> G[\"Topologies\nstar mesh tree\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style G fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Module 1 covers the six foundational topics that every networking concept builds on",
      "code": "# Before we start — check your environment\n\n# Confirm networking tools are available:\nwhich ip ping traceroute ss nmap curl dig tcpdump\n\n# If any are missing, install them:\n# Debian/Ubuntu:\nsudo apt install iproute2 iputils-ping traceroute iproute2 nmap curl dnsutils tcpdump\n\n# macOS (most are pre-installed):\n# brew install nmap tcpdump\n\n# Quick network health check:\nip addr show          # your IP addresses\nip route show         # your routing table\nping -c 2 8.8.8.8     # internet reachability\ndig +short google.com # DNS resolution",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Set up a Linux VM for this course if you do not already have one. VirtualBox with Ubuntu is free and takes 15 minutes to set up. All the commands in this course are tested on Linux. macOS works for most commands. Windows Subsystem for Linux (WSL2) also works well."
      },
      "keyPoints": [
        "Networking is foundational for developers, security engineers, and operations — not just network specialists",
        "This module covers: network types, components, data transmission, protocols, and topologies",
        "Every concept has a corresponding terminal command — run them all",
        "A Linux VM or WSL2 is the best environment for this course",
        "Understanding networking reduces debugging time and improves system design decisions"
      ],
      "tryIt": "Run the quick network health check above. For each command, note what it tells you about your machine's network configuration. If any command is missing, install it before proceeding. This baseline check is something you will run automatically whenever you sit down at an unfamiliar machine."
    }
  },


  {
    "id": 1,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "What Is Computer Networking?",
    "type": "lesson",
    "content": {
      "body": "A computer network is two or more devices connected in a way that allows them to communicate and share resources. That definition sounds simple, but it describes everything from two laptops sharing a file over WiFi to the global infrastructure that delivers a webpage from a server in another country to your browser in milliseconds.\n\n## What Networks Enable\n\n**Communication** — email, messaging, video calls. Every message you send travels across a network.\n\n**Resource sharing** — printers, files, databases, and internet connections can all be shared across a network rather than duplicated on every device.\n\n**Distributed computing** — applications split work across multiple machines. A web app might have a frontend server, a database server, and a cache server all communicating over a network.\n\n**The internet** — the internet is not a single network. It is a network of networks — thousands of independently operated networks (ISPs, universities, companies, data centres) interconnected using common protocols.\n\n## How Devices Communicate\n\nDevices communicate by sending data in structured chunks called packets. Each packet contains the data being sent plus addressing information — where it came from and where it is going. Routers read this addressing information and forward packets toward their destination, hop by hop, until they arrive.\n\n## Why This Matters\n\nEvery application you build, use, or maintain depends on a network. Understanding how networks work makes you better at debugging, architecture, security, and performance — regardless of your role.",
      "diagram": "flowchart TD\n    A[\"Device A\"] -->|\"packets\"|B[\"Network\"]\n    B -->|\"packets\"|C[\"Device B\"]\n    D[\"What networks enable\"] --> E[\"Communication\nemail messaging video\"]\n    D --> F[\"Resource sharing\nfiles printers databases\"]\n    D --> G[\"The internet\nnetwork of networks\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Networks connect devices by sending data as packets — the internet is a network of thousands of interconnected networks",
      "code": "# Check your network interfaces and connections\n\n# List all network interfaces:\nip link show\n# eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n# lo:   <LOOPBACK,UP,LOWER_UP> mtu 65536\n\n# Show IP addresses:\nip addr show\n\n# Show active connections:\nss -tn\n# ESTAB  0  0  192.168.1.50:54321  93.184.216.34:443\n\n# Ping another device on your network:\nping -c 4 192.168.1.1\n\n# Trace the path to a remote server:\ntraceroute google.com\n# Each line is one hop — one router forwarding your packet closer to the destination",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The internet has no central controller. No single company, government, or organisation owns or operates it. It works because every network on the internet agrees to use the same protocols — primarily TCP/IP. This agreement is what makes global communication possible between devices made by different manufacturers, running different operating systems, in different countries."
      },
      "keyPoints": [
        "A network is two or more devices connected to communicate and share resources",
        "Data travels as packets — structured chunks with addressing information",
        "Routers forward packets hop by hop toward their destination",
        "The internet is a network of networks — thousands of independently operated networks using common protocols",
        "Networking knowledge applies to every technical role — development, security, operations, and architecture"
      ],
      "tryIt": "Run ip addr show and identify your network interfaces. Run ping -c 4 8.8.8.8 and note the round-trip time. Run traceroute 8.8.8.8 and count the hops between your machine and Google's DNS server. Each hop is a router forwarding your packet one step closer to the destination."
    }
  },

  {
    "id": 2,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Why Networking Matters",
    "type": "lesson",
    "content": {
      "body": "Networking is not a niche skill for network engineers. It is foundational knowledge for anyone who builds, operates, or secures software systems. The moment your code makes an HTTP request, opens a database connection, or sends a message — it is using a network.\n\n## For Developers\n\nEvery web application is a distributed system. The frontend talks to a backend API over HTTP. The backend talks to a database over TCP. The database replicates to a standby over a private network. Understanding how these connections work — latency, packet loss, connection pooling, DNS resolution — makes you a significantly better developer.\n\n## For Security Engineers\n\nAttacks happen over networks. SQL injection, XSS, man-in-the-middle, DDoS — all of these require understanding how data flows between systems. You cannot defend what you do not understand.\n\n## For Operations and DevOps\n\nDeployment pipelines, container orchestration, load balancers, service meshes — all of these are networking problems. Kubernetes networking alone is a deep topic. Understanding the fundamentals makes these systems less mysterious.\n\n## The Debugging Argument\n\nWhen something is slow or broken, the network is often the cause. Is it DNS? A firewall rule? Packet loss? A misconfigured load balancer? Engineers who understand networking can answer these questions in minutes. Engineers who do not spend hours guessing.",
      "diagram": "flowchart TD\n    A[\"Networking Knowledge\"] --> B[\"Development\nHTTP APIs databases\"]\n    A --> C[\"Security\nattack vectors defence\"]\n    A --> D[\"Operations\nload balancers Kubernetes\"]\n    A --> E[\"Debugging\nDNS firewall latency\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Networking knowledge applies across every technical discipline — development, security, operations, and debugging",
      "code": "# Networking shows up everywhere in software\n\n# A web request involves:\n# 1. DNS resolution (what IP is google.com?)\n# 2. TCP connection (three-way handshake)\n# 3. TLS handshake (encryption negotiation)\n# 4. HTTP request/response\n# 5. TCP teardown\n\n# Watch all of this happen:\ncurl -v https://google.com 2>&1 | head -40\n# * Trying 142.250.x.x:443...\n# * Connected\n# * SSL connection using TLSv1.3\n# > GET / HTTP/2\n# < HTTP/2 301\n\n# Check what your app is connecting to:\nss -tnp | grep your-app-name\n\n# See DNS resolution time:\ndig google.com | grep 'Query time'\n# Query time: 12 msec",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Run curl -v https://google.com and read the output carefully. You will see DNS resolution, TCP connection, TLS negotiation, and the HTTP exchange — all the networking layers working together for a single web request. This is what happens every time your browser loads a page."
      },
      "keyPoints": [
        "Every web application is a distributed system — networking is always involved",
        "Security engineers must understand networks to understand how attacks work",
        "Operations engineers deal with load balancers, DNS, and container networking daily",
        "Network knowledge dramatically reduces debugging time for slow or broken systems",
        "curl -v shows every networking layer involved in a single HTTP request"
      ],
      "tryIt": "Run curl -v https://example.com and identify each phase: DNS lookup, TCP connect, TLS handshake, HTTP request, HTTP response. Note the time each phase takes. Then run the same command again — notice the DNS lookup is faster the second time because it is cached."
    }
  },

  {
    "id": 3,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Types of Networks",
    "type": "lesson",
    "content": {
      "body": "Networks are classified by their geographic scope and ownership model. Understanding these categories helps you reason about latency, bandwidth, security boundaries, and who is responsible for what.\n\n## By Geographic Scope\n\n**PAN (Personal Area Network)** — the smallest network type. Connects devices within a person's immediate environment. Bluetooth between your phone and headphones is a PAN. Range: a few metres.\n\n**LAN (Local Area Network)** — connects devices within a single building or campus. Your home WiFi network is a LAN. Office networks are LANs. Typically owned and operated by the organisation using it. Range: up to a few hundred metres.\n\n**MAN (Metropolitan Area Network)** — spans a city or large campus. ISPs use MANs to connect neighbourhoods to their core network. Range: tens of kilometres.\n\n**WAN (Wide Area Network)** — spans large geographic distances. The internet is the largest WAN. Corporate WANs connect offices in different cities or countries using leased lines, MPLS, or VPNs. Range: unlimited.\n\n## By Ownership\n\n**Private network** — owned and controlled by one organisation. Your office LAN, a corporate WAN, a data centre network.\n\n**Public network** — accessible to anyone. The internet is the public network.\n\n## Why It Matters\n\nLAN traffic stays local — fast, low latency, under your control. WAN traffic crosses other organisations' infrastructure — slower, higher latency, subject to their policies and failures.",
      "diagram": "flowchart TD\n    A[\"PAN\nBluetooth\nfew metres\"] --> B[\"LAN\nHome office building\nhundreds of metres\"]\n    B --> C[\"MAN\nCity campus\ntens of km\"]\n    C --> D[\"WAN\nCountries continents\nunlimited range\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style D fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Network types by geographic scope — each level has different latency, bandwidth, and ownership characteristics",
      "code": "# Identify your network type and scope\n\n# Your LAN — devices on the same subnet:\nip addr show\n# inet 192.168.1.50/24 — your IP and subnet\n# /24 means 192.168.1.0 to 192.168.1.255 are on your LAN\n\n# Scan your LAN for other devices:\nnmap -sn 192.168.1.0/24\n# Lists all devices responding on your local network\n\n# Your default gateway (edge of your LAN, start of WAN):\nip route show | grep default\n# default via 192.168.1.1 — your router\n\n# Latency comparison — LAN vs WAN:\nping -c 4 192.168.1.1      # LAN — should be < 1ms\nping -c 4 8.8.8.8          # WAN — typically 5-50ms\nping -c 4 sydney.ntp.org   # WAN far — could be 200ms+\n\n# Traceroute shows LAN → WAN boundary:\ntraceroute 8.8.8.8\n# Hop 1: 192.168.1.1 (your router — LAN)\n# Hop 2: 10.x.x.x   (ISP network — WAN begins)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The boundary between your LAN and the WAN is your router. Everything on the same side as your router is LAN — fast, low latency, under your control. Everything beyond your router is WAN — you are dependent on your ISP and the internet infrastructure. This boundary is also a security boundary — your firewall sits here."
      },
      "keyPoints": [
        "PAN: personal devices, metres range (Bluetooth)",
        "LAN: single building or campus, hundreds of metres, typically privately owned",
        "MAN: city-scale, tens of kilometres, often ISP infrastructure",
        "WAN: unlimited range, the internet is the largest WAN",
        "Your router is the boundary between your LAN and the WAN — also a security boundary"
      ],
      "tryIt": "Run ping -c 4 <your-router-ip> and ping -c 4 8.8.8.8. Compare the latency. The router ping is LAN latency (sub-millisecond). The 8.8.8.8 ping is WAN latency. Run traceroute 8.8.8.8 and identify exactly which hop is the LAN/WAN boundary."
    }
  },


  {
    "id": 4,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Network Components",
    "type": "lesson",
    "content": {
      "body": "Every network is built from two categories of devices: end devices that generate and consume data, and network devices that move data between end devices. Understanding what each component does and where it sits in the network is the foundation of network design and troubleshooting.\n\n## End Devices\n\n**Clients** — devices that request services: laptops, phones, tablets, IoT sensors. A client initiates communication.\n\n**Servers** — devices that provide services: web servers, database servers, file servers, DNS servers. A server waits for and responds to requests.\n\nThe same physical machine can be both — a developer's laptop is a client when browsing the web and a server when running a local development server.\n\n## Network Devices\n\n**Switch** — connects devices on the same LAN. Operates at Layer 2 (MAC addresses). Forwards frames only to the port where the destination device is connected — unlike a hub, which broadcasts to all ports.\n\n**Router** — connects different networks. Operates at Layer 3 (IP addresses). Reads the destination IP of each packet and forwards it toward the destination network. Your home router connects your LAN to your ISP's network.\n\n**Access Point (AP)** — provides wireless connectivity. Bridges WiFi clients onto the wired LAN.\n\n**Firewall** — enforces security policy. Inspects traffic and allows or blocks it based on rules. Sits at network boundaries.",
      "diagram": "flowchart TD\n    A[\"End Devices\"] --> B[\"Clients\nlaptops phones IoT\"]\n    A --> C[\"Servers\nweb database DNS\"]\n    D[\"Network Devices\"] --> E[\"Switch\nLayer 2 MAC LAN\"]\n    D --> F[\"Router\nLayer 3 IP between networks\"]\n    D --> G[\"Access Point\nWiFi to wired LAN\"]\n    D --> H[\"Firewall\nsecurity policy\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "End devices generate and consume data; network devices move data between them",
      "code": "# Identify network devices on your network\n\n# Your default gateway (router):\nip route show | grep default\n# default via 192.168.1.1 dev eth0\n# 192.168.1.1 is your router\n\n# Check what type of device your gateway is:\nnmap -O 192.168.1.1\n# OS detection — often identifies router vendor\n\n# List all devices on your LAN (requires nmap):\nsudo nmap -sn 192.168.1.0/24\n# Shows all responding devices with MAC addresses\n\n# Check your own device type:\nip link show\n# eth0 = wired (connected to switch or router)\n# wlan0 = wireless (connected via access point)\n\n# See which switch port you are on (if managed switch):\n# Most home networks do not expose this\n# Enterprise: check switch CLI or SNMP\n\n# ARP table — devices your machine has talked to recently:\narp -n\n# 192.168.1.1  ether  aa:bb:cc:dd:ee:ff  eth0  (your router)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Home routers are actually four devices in one box: a router (connects LAN to WAN), a switch (connects wired devices on the LAN), an access point (provides WiFi), and a firewall (blocks unsolicited inbound traffic). Enterprise networks use separate dedicated devices for each function — more expensive but far more flexible and scalable."
      },
      "keyPoints": [
        "End devices: clients (request services) and servers (provide services)",
        "Switches connect devices on the same LAN at Layer 2 using MAC addresses",
        "Routers connect different networks at Layer 3 using IP addresses",
        "Access points bridge WiFi clients onto the wired LAN",
        "Home routers combine router, switch, AP, and firewall in one device"
      ],
      "tryIt": "Run arp -n to see the devices your machine has recently communicated with. Identify your router's MAC address. Run sudo nmap -sn <your-subnet>/24 to discover all devices on your LAN. Try to identify which are end devices (phones, laptops) and which are network devices (router, AP, smart TV)."
    }
  },

  {
    "id": 5,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Client–Server vs Peer-to-Peer",
    "type": "lesson",
    "content": {
      "body": "There are two fundamental models for how devices communicate on a network: client-server and peer-to-peer. Most of the internet runs on client-server. Understanding both models helps you design systems and understand their trade-offs.\n\n## Client–Server Model\n\nOne device (the server) provides a service. Other devices (clients) request that service. The server is always available, waiting for requests. The client initiates the connection.\n\nExamples: your browser (client) requests a webpage from nginx (server). Your email app (client) fetches messages from an IMAP server. Your app (client) queries a PostgreSQL database (server).\n\nAdvantages: centralised control, easy to manage, scalable (add more servers), consistent data (one source of truth).\n\nDisadvantages: single point of failure (if the server goes down, all clients lose access), server must be provisioned to handle peak load.\n\n## Peer-to-Peer Model\n\nEvery device is both a client and a server simultaneously. Devices communicate directly with each other without a central server.\n\nExamples: BitTorrent (each peer downloads from and uploads to other peers), WebRTC video calls (browsers connect directly), blockchain networks.\n\nAdvantages: no single point of failure, scales naturally as more peers join, no central infrastructure cost.\n\nDisadvantages: harder to manage, inconsistent availability (peers come and go), security is more complex.\n\n## Hybrid Models\n\nMost modern systems are hybrid. Spotify uses client-server for authentication and metadata but peer-to-peer for some audio delivery. WebRTC uses a central signalling server to establish connections, then switches to peer-to-peer for the actual media stream.",
      "diagram": "flowchart TD\n    A[\"Client-Server\"] --> B[\"Client\nbrowser app\"]\n    A --> C[\"Server\nnginx database\"]\n    B -->|\"request\"|C\n    C -->|\"response\"|B\n    D[\"Peer-to-Peer\"] --> E[\"Peer A\"]\n    D --> F[\"Peer B\"]\n    D --> G[\"Peer C\"]\n    E <-->|\"direct\"|F\n    F <-->|\"direct\"|G\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "Client-server: centralised, one server many clients. Peer-to-peer: decentralised, every node is both client and server",
      "code": "# See client-server in action\n\n# You are the client, example.com is the server:\ncurl -v https://example.com 2>&1 | grep -E 'Trying|Connected|HTTP'\n# * Trying 93.184.216.34:443...\n# * Connected to example.com\n# > GET / HTTP/2  (your request)\n# < HTTP/2 200   (server response)\n\n# See what servers are running on your machine:\nss -tlnp\n# LISTEN  0  128  0.0.0.0:80   (nginx listening — acting as server)\n# LISTEN  0  128  0.0.0.0:5432 (postgres listening — acting as server)\n\n# See what your machine is connecting to as a client:\nss -tnp | grep ESTAB\n# ESTAB  192.168.1.50:54321  93.184.216.34:443 (you → remote server)\n\n# P2P example — check BitTorrent connections:\n# ss -tnp | grep transmission\n# Multiple ESTAB connections to different IPs — each is a peer",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The client always initiates the connection. The server always listens and waits. This asymmetry is why firewalls can block inbound connections (protecting servers) while allowing outbound connections (allowing clients). If you run a server, you need to explicitly open a port. If you are a client, you can connect to any open port on any reachable server."
      },
      "keyPoints": [
        "Client-server: server provides service, client requests it — client always initiates",
        "Client-server advantages: centralised control, consistent data, scalable",
        "Peer-to-peer: every node is both client and server — no central point of failure",
        "P2P advantages: resilient, scales with participants, no central infrastructure",
        "Most modern systems are hybrid — central coordination with direct peer communication"
      ],
      "tryIt": "Run ss -tlnp to see what servers are running on your machine (what ports are listening). Then run ss -tnp to see what your machine is connecting to as a client. Identify at least one client connection and one server port. If nothing is listening, start a simple server with python3 -m http.server 8080 and run ss -tlnp again."
    }
  },

  {
    "id": 6,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "How Data Transmission Works",
    "type": "lesson",
    "content": {
      "body": "When you send data across a network — a file, a webpage, a video stream — it does not travel as one continuous block. It is broken into small chunks called packets, sent independently across the network, and reassembled at the destination. This packet-switching model is the foundation of how the internet works.\n\n## Why Packets?\n\nImagine sending a large file as a single continuous stream. If anything goes wrong mid-transfer, you have to start over. And while your file is being sent, no one else can use that network path.\n\nPackets solve both problems. Each packet travels independently — if one is lost, only that packet needs to be retransmitted. And packets from different sources can share the same network links, interleaved with each other.\n\n## The Packet Journey\n\n1. **Segmentation** — the sending application's data is broken into segments by the transport layer (TCP/UDP).\n2. **Encapsulation** — each segment gets wrapped with headers at each layer: IP header (addressing), Ethernet header (local delivery).\n3. **Transmission** — packets are sent onto the network one at a time.\n4. **Routing** — each router reads the IP header and forwards the packet toward the destination.\n5. **Reassembly** — the receiving device collects all packets and reassembles them in order.\n\n## Bandwidth vs Latency\n\n**Bandwidth** — how much data can be sent per second (Mbps, Gbps). A wide pipe.\n\n**Latency** — how long it takes for a packet to travel from source to destination (milliseconds). The speed of the pipe.\n\nHigh bandwidth does not mean low latency. A satellite link can have high bandwidth but 600ms latency. A fibre link can have low latency (1ms) but limited bandwidth.",
      "diagram": "flowchart LR\n    A[\"Data\"] -->|\"segment\"|B[\"Packets\"]\n    B -->|\"encapsulate\"|C[\"IP + Ethernet headers\"]\n    C -->|\"transmit\"|D[\"Network\"]\n    D -->|\"route hop by hop\"|E[\"Destination\"]\n    E -->|\"reassemble\"|F[\"Original Data\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Data is segmented into packets, encapsulated with headers, routed hop by hop, and reassembled at the destination",
      "code": "# Observe packet transmission\n\n# See packet sizes in a capture:\nsudo tcpdump -i eth0 -n -c 20\n# Each line is one packet\n# length 1514 = maximum Ethernet frame (MTU)\n# length 52   = small ACK packet\n\n# Check your MTU (maximum packet size):\nip link show eth0 | grep mtu\n# mtu 1500 — standard Ethernet MTU\n\n# Test if large packets get fragmented:\nping -c 1 -s 1472 -M do 8.8.8.8\n# -s 1472: payload (+ 28 byte header = 1500 total)\n# -M do: don't fragment\n# If this fails, your path MTU is less than 1500\n\n# Measure bandwidth:\niperf3 -c iperf.he.net\n# Connecting to iperf.he.net port 5201\n# [ 5] 0.00-10.00 sec  112 MBytes  94.1 Mbits/sec\n\n# Measure latency:\nping -c 10 8.8.8.8 | tail -2\n# rtt min/avg/max/mdev = 11.2/12.4/14.1/0.8 ms",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Bandwidth and latency are independent. A video call needs low latency (< 150ms) but moderate bandwidth. A file download needs high bandwidth but tolerates high latency. A database query needs low latency but very little bandwidth. Matching your application's requirements to the network's characteristics is a key part of system design."
      },
      "keyPoints": [
        "Data is broken into packets — each travels independently and is reassembled at the destination",
        "Packet switching allows multiple sources to share network links simultaneously",
        "Encapsulation adds headers at each layer: transport, IP, Ethernet",
        "Bandwidth is throughput (Mbps); latency is delay (ms) — they are independent",
        "MTU (Maximum Transmission Unit) is the largest packet size a link can carry — typically 1500 bytes on Ethernet"
      ],
      "tryIt": "Run sudo tcpdump -i eth0 -n -c 20 while browsing a website. Observe the different packet sizes — small ACK packets (52 bytes) vs large data packets (1514 bytes). Then run ping -c 10 8.8.8.8 and note the min/avg/max latency. Run the same ping to a server in another country and compare."
    }
  },

  {
    "id": 7,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Protocols: The Rules of Communication",
    "type": "lesson",
    "content": {
      "body": "A protocol is a set of rules that defines how devices communicate. Without protocols, a device made by Apple could not talk to a device made by Samsung, and a server in Australia could not serve a webpage to a browser in Germany. Protocols are what make interoperability possible.\n\n## What a Protocol Defines\n\n- **Message format** — what fields a message contains and in what order\n- **Message types** — what kinds of messages exist (request, response, error, acknowledgement)\n- **Sequencing** — what order messages must be sent in\n- **Error handling** — what to do when something goes wrong\n- **Addressing** — how to identify the sender and recipient\n\n## Protocol Layers\n\nProtocols are organised in layers. Each layer handles a specific concern and relies on the layer below it. You do not need to understand TCP to write an HTTP server — HTTP sits on top of TCP and uses it without caring how it works.\n\n## Key Protocols You Will Learn\n\n- **Ethernet** — Layer 2, local delivery using MAC addresses\n- **IP** — Layer 3, global addressing and routing\n- **TCP** — Layer 4, reliable ordered delivery\n- **UDP** — Layer 4, fast unreliable delivery\n- **DNS** — resolves names to IP addresses\n- **HTTP/HTTPS** — web communication\n- **TLS** — encryption\n\n## Standards Bodies\n\nProtocols are defined in documents called RFCs (Request for Comments), published by the IETF (Internet Engineering Task Force). HTTP/2 is RFC 7540. TLS 1.3 is RFC 8446. These documents are public and free to read.",
      "diagram": "flowchart TD\n    A[\"Application\nHTTP DNS SMTP\"] --> B[\"Transport\nTCP UDP\"]\n    B --> C[\"Network\nIP ICMP\"]\n    C --> D[\"Data Link\nEthernet WiFi\"]\n    D --> E[\"Physical\ncables radio waves\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Protocols are layered — each layer handles one concern and relies on the layer below",
      "code": "# See protocols in action\n\n# HTTP protocol — text-based, human readable:\ncurl -v http://example.com 2>&1 | grep -E '^>|^<'\n# > GET / HTTP/1.1          (request line)\n# > Host: example.com       (header)\n# < HTTP/1.1 200 OK         (response line)\n# < Content-Type: text/html (header)\n\n# DNS protocol — query and response:\ndig example.com\n# ;; QUESTION SECTION: example.com. IN A\n# ;; ANSWER SECTION: example.com. 3600 IN A 93.184.216.34\n\n# TCP protocol — see the handshake:\nsudo tcpdump -i eth0 -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' &\ncurl http://example.com\n# SYN → SYN-ACK → ACK (three-way handshake)\n\n# Read an RFC:\n# https://www.rfc-editor.org/rfc/rfc9110 (HTTP semantics)\n# https://www.rfc-editor.org/rfc/rfc791  (IP)\n# https://www.rfc-editor.org/rfc/rfc793  (TCP)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "RFCs are the source of truth for how protocols work. When you want to understand exactly how HTTP handles redirects, or exactly what fields a TCP header contains, the RFC is the definitive answer. They are written for implementers, not beginners — but once you have the fundamentals, reading RFCs is one of the best ways to go deep on any protocol."
      },
      "keyPoints": [
        "A protocol defines message format, types, sequencing, error handling, and addressing",
        "Protocols are layered — each layer handles one concern and relies on the layer below",
        "Key protocols: Ethernet (L2), IP (L3), TCP/UDP (L4), DNS, HTTP, TLS",
        "RFCs (Request for Comments) are the public documents that define internet protocols",
        "Layering means you can use HTTP without understanding TCP — but understanding both makes you better"
      ],
      "tryIt": "Run curl -v http://example.com and identify the HTTP protocol in action — the request line, headers, and response. Then run dig example.com and identify the DNS protocol — the question section and answer section. Finally, read the first page of RFC 791 (IP) at rfc-editor.org to see what a protocol specification looks like."
    }
  },


  {
    "id": 8,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Bandwidth, Latency, and Throughput",
    "type": "lesson",
    "content": {
      "body": "Three terms describe network performance and are constantly confused with each other. Understanding the difference is essential for diagnosing slow networks and designing systems that perform well.\n\n## Bandwidth\n\nBandwidth is the maximum capacity of a network link — how much data it can carry per second. Think of it as the width of a pipe. A 1 Gbps link can carry up to 1 gigabit per second. Bandwidth is a theoretical maximum, not a guarantee.\n\n## Latency\n\nLatency is the time it takes for a single packet to travel from source to destination. Measured in milliseconds. Think of it as the length of the pipe. A packet crossing the Atlantic has high latency regardless of bandwidth.\n\n**Sources of latency:**\n- **Propagation delay** — time for a signal to travel the physical distance (speed of light in cable)\n- **Transmission delay** — time to push all bits onto the wire\n- **Processing delay** — time routers take to examine and forward packets\n- **Queuing delay** — time waiting in a router's buffer when congested\n\n## Throughput\n\nThroughput is the actual data transfer rate achieved in practice. Always less than bandwidth due to protocol overhead, retransmissions, congestion, and latency. A 1 Gbps link might only achieve 800 Mbps throughput.\n\n## Which Metric Matters?\n\nA video call needs low latency (< 150ms). A file download needs high throughput. A live trading system needs both. Knowing which metric matters for your use case determines how you diagnose and fix performance problems.",
      "diagram": "flowchart LR\n    A[\"Bandwidth\n1 Gbps capacity\npipe width\"] --> D[\"Network Link\"]\n    B[\"Latency\n20ms delay\npipe length\"] --> D\n    C[\"Throughput\n800 Mbps actual\nwater flowing\"] --> D\n    D --> E[\"Destination\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Bandwidth is capacity, latency is delay, throughput is what you actually get — three independent metrics",
      "code": "# Measure bandwidth, latency, and throughput\n\n# Latency — round-trip time to a host:\nping -c 10 8.8.8.8\n# rtt min/avg/max/mdev = 11.2/12.4/14.1/0.8 ms\n\n# Latency to a distant server (expect higher):\nping -c 4 speedtest.net\n\n# Throughput — actual transfer speed:\n# Install iperf3:\nsudo apt install iperf3\n# Run against a public iperf server:\niperf3 -c iperf.he.net\n# [ 5] 0.00-10.00 sec  112 MBytes  94.1 Mbits/sec\n\n# Or use speedtest-cli:\nsudo apt install speedtest-cli\nspeedtest-cli\n# Download: 94.21 Mbit/s\n# Upload:   45.12 Mbit/s\n# Ping:     12.345 ms\n\n# Check your link's advertised bandwidth:\nip link show eth0 | grep -i speed\n# Or: ethtool eth0 | grep Speed\n# Speed: 1000Mb/s (1 Gbps link)\n\n# Compare bandwidth vs throughput:\n# Link speed: 1000 Mbps (bandwidth)\n# iperf3 result: 940 Mbps (throughput)\n# Difference = protocol overhead + CPU limits",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "High bandwidth does not fix high latency. A satellite internet connection can have 50 Mbps bandwidth but 600ms latency — web browsing feels sluggish because every request-response cycle takes over a second. Fibre to the home might have 100 Mbps bandwidth and 5ms latency — much faster in practice despite lower bandwidth on paper."
      },
      "keyPoints": [
        "Bandwidth is the maximum capacity of a link (Mbps/Gbps) — the width of the pipe",
        "Latency is the delay for a packet to travel source to destination (ms) — the length of the pipe",
        "Throughput is actual transfer rate in practice — always less than bandwidth",
        "Latency sources: propagation, transmission, processing, and queuing delay",
        "Match the metric to the use case: video calls need low latency, downloads need high throughput"
      ],
      "tryIt": "Run ping -c 10 8.8.8.8 and note the average latency. Then run ping -c 4 to a server on another continent and compare. Install iperf3 and measure your actual throughput with iperf3 -c iperf.he.net. Compare the throughput result to your link's advertised speed — the gap is protocol overhead."
    }
  },

  {
    "id": 9,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Network Topologies",
    "type": "lesson",
    "content": {
      "body": "Network topology describes how devices are physically or logically connected. The topology affects performance, fault tolerance, cost, and how failures propagate. Understanding topologies helps you design resilient networks and diagnose failures.\n\n## Star Topology\n\nAll devices connect to a central switch or hub. The most common topology in modern LANs. If one device fails, only that device is affected. If the central switch fails, the entire network goes down — the switch is a single point of failure.\n\n## Mesh Topology\n\nEvery device connects to every other device. Extremely fault-tolerant — multiple paths exist between any two nodes. Used in the internet's backbone and in wireless mesh networks. Full mesh is expensive; partial mesh (some redundant links) is more common.\n\n## Bus Topology\n\nAll devices share a single cable. Historical — used in early Ethernet (10BASE2). A break anywhere in the cable takes down the entire network. Rarely used today.\n\n## Ring Topology\n\nDevices connect in a circle. Data travels in one direction around the ring. Used in some industrial networks. A single break disrupts the ring unless dual-ring redundancy is used.\n\n## Tree (Hierarchical) Topology\n\nA hierarchy of star networks. Core switches connect to distribution switches, which connect to access switches, which connect to end devices. The standard design for enterprise networks — scalable and manageable.\n\n## Real Networks Are Hybrid\n\nMost real networks combine topologies — a tree of stars with mesh connections between core nodes for redundancy. The internet itself is a partial mesh of autonomous systems.",
      "diagram": "flowchart TD\n    A[\"Topologies\"] --> B[\"Star\nall to central switch\nmost common LAN\"]\n    A --> C[\"Mesh\nevery device connected\ninternet backbone\"]\n    A --> D[\"Bus\nshared cable\nhistorical only\"]\n    A --> E[\"Tree\nhierarchy of stars\nenterprise standard\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Star is the most common LAN topology; tree scales it to enterprise; mesh provides backbone resilience",
      "code": "# Explore your network topology\n\n# See your local star topology — devices connected to your switch:\nsudo nmap -sn 192.168.1.0/24\n# All devices on your LAN connect to a central switch/router\n\n# Trace the tree topology of the internet:\ntraceroute 8.8.8.8\n# Each hop is a router in the tree\n# Early hops: your ISP's access layer\n# Middle hops: ISP distribution/core\n# Later hops: Google's network\n\n# See redundant paths (mesh) in the internet:\n# Run traceroute multiple times — path may vary\ntraceroute 8.8.8.8\ntraceroute 8.8.8.8\n# Different intermediate hops = multiple paths exist\n\n# Check your switch's MAC address table (if managed switch):\n# On Cisco: show mac address-table\n# On Linux bridge:\nbridge fdb show\n# Each entry is a device connected to that switch port\n\n# Identify single points of failure:\n# Your home network: the router is a single point of failure\n# If it fails, all devices lose connectivity\n# Enterprise fix: redundant switches with spanning tree protocol",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The internet's resilience comes from its partial mesh topology at the core. When a major backbone link fails, BGP (Border Gateway Protocol) automatically reroutes traffic around the failure within minutes. This is why the internet does not go down when a single cable is cut — there are always alternative paths. Your home network has no such redundancy."
      },
      "keyPoints": [
        "Star: all devices connect to a central switch — most common LAN topology, switch is single point of failure",
        "Mesh: every device connected to every other — maximum resilience, used in internet backbone",
        "Bus: shared cable, historical only — a single break takes down the whole network",
        "Tree: hierarchy of stars — standard enterprise design, scalable and manageable",
        "Real networks are hybrid — tree of stars with mesh redundancy at the core"
      ],
      "tryIt": "Run traceroute 8.8.8.8 three times and compare the paths. Note whether the intermediate hops change — different paths indicate mesh redundancy in the internet backbone. Draw a rough diagram of your home network topology — identify the central switch/router and all connected devices. Where is the single point of failure?"
    }
  },

  {
    "id": 10,
    "moduleId": 1,
    "moduleTitle": "Introduction to Computer Networking",
    "title": "Module 1 Summary",
    "type": "lesson",
    "content": {
      "body": "This module established the foundations of computer networking. Every topic in the rest of this course builds on what you have learned here.\n\n## What You Learned\n\n**What networking is** — devices connected to communicate and share resources. Data travels as packets. The internet is a network of networks.\n\n**Why it matters** — networking knowledge applies to development, security, operations, and debugging. Every application you build uses a network.\n\n**Network types** — PAN (personal), LAN (local), MAN (city), WAN (global). Your router is the boundary between your LAN and the WAN.\n\n**Network components** — end devices (clients and servers) and network devices (switches, routers, access points, firewalls). Home routers combine all four.\n\n**Communication models** — client-server (centralised, client initiates) and peer-to-peer (decentralised, every node is both). Most modern systems are hybrid.\n\n**Data transmission** — packets, encapsulation, routing hop by hop, reassembly. Bandwidth is capacity, latency is delay, throughput is what you actually get.\n\n**Protocols** — rules that make interoperability possible. Layered so each layer handles one concern. Defined in public RFCs.\n\n**Topologies** — star (LAN), tree (enterprise), mesh (backbone). Real networks are hybrid.\n\n## What Is Coming Next\n\nModule 2 covers the OSI and TCP/IP models — the formal framework that organises all networking protocols into layers. Understanding the model makes every other networking topic easier to learn.",
      "diagram": "flowchart TD\n    A[\"✅ What is networking\npackets devices internet\"] --> B[\"✅ Network types\nPAN LAN MAN WAN\"]\n    B --> C[\"✅ Components\nswitch router AP firewall\"]\n    C --> D[\"✅ Client-server P2P\"]\n    D --> E[\"✅ Bandwidth latency throughput\"]\n    E --> F[\"✅ Protocols and topologies\"]\n    F --> G[\"➡️ OSI and TCP/IP models\nModule 2\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 1 complete — networking foundations from packets to protocols to topologies",
      "code": "# Module 1 command reference\n\n# Network interfaces:\nip link show\nip addr show\n\n# Routing:\nip route show\n\n# Connectivity:\nping -c 4 8.8.8.8\ntraceroute 8.8.8.8\n\n# LAN discovery:\nsudo nmap -sn 192.168.1.0/24\narp -n\n\n# Active connections:\nss -tnp\n\n# Servers listening:\nss -tlnp\n\n# Latency and throughput:\nping -c 10 8.8.8.8\niperf3 -c iperf.he.net\n\n# Protocol inspection:\ncurl -v https://example.com\ndig example.com\nsudo tcpdump -i eth0 -n -c 20",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The commands in this module are the ones you will use every day as a network engineer or developer. ip, ping, traceroute, ss, nmap, curl, dig, and tcpdump — learn these well. They work on every Linux system and most of them work on macOS too. They are your primary diagnostic tools for everything that follows."
      },
      "keyPoints": [
        "Networks connect devices to communicate — data travels as packets routed hop by hop",
        "LAN is local and fast; WAN is global and slower — your router is the boundary",
        "Switches (L2/MAC) connect LAN devices; routers (L3/IP) connect networks",
        "Bandwidth is capacity, latency is delay, throughput is actual performance",
        "Protocols are layered rules defined in public RFCs — the foundation of interoperability"
      ],
      "tryIt": "Run the full Module 1 command reference above on your machine. For each command, note what it shows and what it tells you about your network. If any command is not installed, install it. By the end of this exercise you should have a clear picture of your machine's network configuration, connections, and performance."
    }
  },

  // =========================
  // Networking Module 2: OSI Model & TCP/IP Model
  // =========================

  {
    "id": 11,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Welcome to the OSI and TCP/IP Models",
    "type": "lesson",
    "content": {
      "body": "This module gives you the mental framework that organises all of networking. The OSI and TCP/IP models are not just academic concepts — they are the vocabulary and troubleshooting methodology that every network engineer uses every day.\n\n## Why Models Matter\n\nBefore standardised models existed, every vendor had their own proprietary networking stack. IBM equipment could not talk to DEC equipment. The OSI model solved this by defining a common layered framework that any technology can be mapped to.\n\n## What This Module Covers\n\n- Why layered models exist and what problem they solve\n- All seven OSI layers and what each one does\n- PDUs — the names for data at each layer (bits, frames, packets, segments)\n- Encapsulation and de-encapsulation — how headers are added and stripped\n- The TCP/IP model and how it maps to OSI\n- TCP vs UDP — the two transport protocols and when to use each\n- Layer 3 IP addressing and routing fundamentals\n\n## The Most Important Skill This Module Builds\n\nTroubleshooting by layer. When something is broken, the OSI model gives you a systematic checklist: is it Layer 1 (physical), Layer 2 (switching), Layer 3 (routing), Layer 4 (transport), or Layer 7 (application)? This methodology works for every network problem you will ever encounter.",
      "diagram": "flowchart TD\n    A[\"Module 2\"] --> B[\"Why models exist\"]\n    A --> C[\"7 OSI layers\"]\n    A --> D[\"PDUs: bits frames\npackets segments\"]\n    A --> E[\"Encapsulation\"]\n    A --> F[\"TCP/IP model\"]\n    A --> G[\"TCP vs UDP\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style G fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Module 2 builds the layered mental model that organises every networking concept",
      "code": "# The OSI model in one troubleshooting session\n\n# Layer 1 — is the interface up?\nip link show eth0\n\n# Layer 2 — do we have a MAC/ARP entry?\narp -n\n\n# Layer 3 — do we have an IP and a route?\nip addr show && ip route show\n\n# Layer 3 reachability:\nping -c 2 8.8.8.8\n\n# Layer 4 — can we reach the port?\nnc -zv 8.8.8.8 53\n\n# Layer 7 — does the application respond?\ncurl -s -o /dev/null -w '%{http_code}' https://example.com",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Memorise the OSI layers bottom to top: Physical, Data Link, Network, Transport, Session, Presentation, Application. A common mnemonic: Please Do Not Throw Sausage Pizza Away. You will be asked about OSI layers throughout your career — knowing them instantly signals competence."
      },
      "keyPoints": [
        "The OSI model provides a common framework for troubleshooting, learning, and vendor communication",
        "Seven layers: Physical (1), Data Link (2), Network (3), Transport (4), Session (5), Presentation (6), Application (7)",
        "TCP/IP collapses OSI into four layers: Network Access, Internet, Transport, Application",
        "Troubleshoot bottom-up: always check lower layers before assuming the problem is at the application",
        "PDU names: Bits (L1), Frame (L2), Packet (L3), Segment/Datagram (L4), Data (L7)"
      ],
      "tryIt": "Run the full OSI troubleshooting sequence above on your machine. For each layer, identify what the command tells you and whether that layer is functioning correctly. This sequence — from ip link to curl — is the diagnostic workflow you will use for the rest of your career."
    }
  },


  {
    "id": 12,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Why Network Models Exist",
    "type": "lesson",
    "content": {
      "body": "Before standardised network models existed, networking was chaos. Each vendor — IBM, DEC, Xerox — had their own proprietary networking stack. IBM equipment could not talk to DEC equipment. A company that bought from multiple vendors had to run separate networks for each.\n\nThe OSI (Open Systems Interconnection) model was developed by the ISO in the 1980s to solve this. It defines a common framework that any networking technology can be mapped to — regardless of vendor, operating system, or hardware.\n\n## What a Layered Model Gives You\n\n**Standardisation** — vendors implement each layer independently. A network card manufacturer implements Layer 1 and 2. An OS developer implements Layer 3 and 4. An application developer implements Layer 7. They all interoperate because they follow the same model.\n\n**Abstraction** — each layer only needs to know about the layer directly above and below it. HTTP does not need to know whether it is running over WiFi or Ethernet. TCP does not need to know whether the application is a browser or an email client.\n\n**Troubleshooting** — when something breaks, the model tells you where to look. Cannot ping? Layer 3 problem. Can ping but cannot connect? Layer 4 problem. Can connect but application fails? Layer 7 problem.\n\n**Learning** — the model gives you a mental framework to organise every networking concept you will ever learn.",
      "diagram": "flowchart TD\n    A[\"Problem: vendor lock-in\nno interoperability\"] --> B[\"Solution: OSI Model\ncommon framework\"]\n    B --> C[\"Standardisation\nvendors implement layers independently\"]\n    B --> D[\"Abstraction\neach layer ignores others\"]\n    B --> E[\"Troubleshooting\nisolate which layer failed\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "The OSI model solves vendor lock-in by defining a common layered framework for all networking",
      "code": "# The OSI model in troubleshooting\n\n# Layer 1 problem — physical/interface down:\nip link show eth0\n# state DOWN — cable unplugged or interface disabled\n# Fix: ip link set eth0 up\n\n# Layer 2 problem — no MAC address resolution:\narp -n\n# No entry for gateway = ARP failing\n# Fix: check switch, VLAN config\n\n# Layer 3 problem — no IP or no route:\nip addr show && ip route show\n# No inet address or no default route\n# Fix: assign IP, add default route\n\n# Layer 4 problem — port not reachable:\nnc -zv 8.8.8.8 53\n# Connection refused = service not listening\n# Timeout = firewall blocking\n\n# Layer 7 problem — application error:\ncurl -v https://example.com\n# HTTP 500 = server-side application error\n# TLS error = certificate problem",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "When troubleshooting, always start at Layer 1 and work up. It is tempting to jump straight to the application layer, but a Layer 1 or Layer 3 problem will look like an application problem if you do not check the lower layers first. The OSI model is your checklist — work through it systematically."
      },
      "keyPoints": [
        "Before OSI, each vendor had proprietary networking — equipment from different vendors could not communicate",
        "OSI provides a common framework: standardisation, abstraction, and troubleshooting structure",
        "Each layer only interacts with the layers directly above and below it",
        "Troubleshooting: cannot ping = L3, can ping but no connection = L4, connection works but app fails = L7",
        "The model is a mental framework — every networking concept maps to a layer"
      ],
      "tryIt": "Deliberately break your network at each layer and practice diagnosing it: disable your interface (L1), delete your IP address (L3), block a port with iptables (L4). For each fault, use the OSI model to identify which layer is broken before fixing it."
    }
  },

  {
    "id": 13,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "The Seven OSI Layers",
    "type": "lesson",
    "content": {
      "body": "The OSI model has seven layers, each responsible for a specific aspect of network communication. Data flows down the stack on the sender and up the stack on the receiver. Each layer adds its own header (encapsulation) going down and strips it (de-encapsulation) going up.\n\n## Layer 7 — Application\nThe interface between the network and the application. Protocols: HTTP, HTTPS, DNS, SMTP, FTP, SSH. This is where user-facing services live.\n\n## Layer 6 — Presentation\nData formatting, encryption, and compression. TLS encryption happens here. Converts data between application format and network format. Often merged with Layer 7 in practice.\n\n## Layer 5 — Session\nEstablishes, manages, and terminates sessions between applications. TLS session management, RPC sessions. Often merged with Layer 7 in practice.\n\n## Layer 4 — Transport\nEnd-to-end communication between processes. TCP (reliable, ordered, connection-oriented) and UDP (fast, unreliable, connectionless). Ports identify which process receives the data.\n\n## Layer 3 — Network\nLogical addressing and routing. IP addresses identify devices globally. Routers operate at this layer, forwarding packets toward their destination.\n\n## Layer 2 — Data Link\nLocal delivery between directly connected devices. MAC addresses identify devices on the same network segment. Switches operate at this layer. Ethernet and WiFi are Layer 2 technologies.\n\n## Layer 1 — Physical\nThe actual transmission of bits — electrical signals on copper, light pulses on fibre, radio waves on WiFi. Cables, connectors, network cards.",
      "diagram": "flowchart TD\n    A[\"L7 Application\nHTTP DNS SMTP SSH\"] --> B[\"L6 Presentation\nTLS encryption format\"]\n    B --> C[\"L5 Session\nsession management\"]\n    C --> D[\"L4 Transport\nTCP UDP ports\"]\n    D --> E[\"L3 Network\nIP routing\"]\n    E --> F[\"L2 Data Link\nEthernet WiFi MAC\"]\n    F --> G[\"L1 Physical\ncables signals bits\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "The seven OSI layers — data flows down on the sender and up on the receiver",
      "code": "# Map real tools to OSI layers\n\n# Layer 1 — Physical:\nethtool eth0 | grep -E 'Speed|Duplex|Link'\n# Speed: 1000Mb/s, Duplex: Full, Link detected: yes\n\n# Layer 2 — Data Link (MAC addresses):\nip link show eth0\n# link/ether aa:bb:cc:dd:ee:ff\narp -n\n# 192.168.1.1 at 11:22:33:44:55:66 on eth0\n\n# Layer 3 — Network (IP addresses, routing):\nip addr show\nip route show\nping 8.8.8.8\n\n# Layer 4 — Transport (ports, connections):\nss -tnp\n# ESTAB 192.168.1.5:54321 8.8.8.8:443\n\n# Layer 7 — Application (HTTP, DNS):\ncurl -v https://example.com\ndig example.com\n\n# Wireshark shows all layers simultaneously:\n# sudo tcpdump -i eth0 -w capture.pcap\n# Open in Wireshark — click any packet to see all layers",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "A common memory aid for the OSI layers: 'Please Do Not Throw Sausage Pizza Away' (Physical, Data Link, Network, Transport, Session, Presentation, Application) going bottom to top. Or top to bottom: 'All People Seem To Need Data Processing'. Pick one and stick with it — you will be asked about OSI layers for the rest of your career."
      },
      "keyPoints": [
        "L7 Application: HTTP, DNS, SMTP — user-facing protocols",
        "L6/L5 Presentation/Session: TLS encryption, session management — often merged with L7",
        "L4 Transport: TCP/UDP, ports — end-to-end process communication",
        "L3 Network: IP addresses, routing — global logical addressing",
        "L2 Data Link: MAC addresses, Ethernet/WiFi — local delivery between adjacent devices",
        "L1 Physical: cables, signals, bits — actual transmission medium"
      ],
      "tryIt": "For each OSI layer, identify one tool or command that operates at that layer: ethtool (L1), arp (L2), ping/ip route (L3), ss/nc (L4), curl/dig (L7). Run each command and identify what layer-specific information it shows. This maps the abstract model to real tools you will use daily."
    }
  },

  {
    "id": 14,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "PDUs — Protocol Data Units",
    "type": "lesson",
    "content": {
      "body": "Each layer of the OSI model has a specific name for the unit of data it works with. These names — collectively called Protocol Data Units (PDUs) — appear constantly in networking documentation, Wireshark captures, and error messages. Knowing them makes you fluent in networking language.\n\n## PDU Names by Layer\n\n- Layer 7–5 (Application–Session): **Data** — the application payload\n- Layer 4 (Transport): **Segment** (TCP) or **Datagram** (UDP) — data + port numbers\n- Layer 3 (Network): **Packet** — segment + IP addresses\n- Layer 2 (Data Link): **Frame** — packet + MAC addresses + FCS error check\n- Layer 1 (Physical): **Bits** — electrical or optical signals\n\n## Encapsulation\n\nAs data travels down the stack from application to physical, each layer wraps the layer above's PDU in its own header. This is encapsulation. The layer above's PDU becomes the payload of the layer below.\n\nApplication data → TCP adds ports → Segment → IP adds addresses → Packet → Ethernet adds MACs → Frame → Physical converts to bits\n\n## De-encapsulation\n\nAt the receiving end, each layer strips its header, processes the information, and passes the payload up to the next layer. The application eventually receives the original data.\n\n## Why This Matters\n\nWhen you see packet loss in a ping, you are at Layer 3. When Wireshark shows a malformed frame, you are at Layer 2. When a firewall blocks a connection, it is inspecting Layer 4 segments. The PDU name tells you which layer has the problem.",
      "diagram": "flowchart TD\n    A[\"Application Data\"] -->|\"+ TCP header\"|B[\"Segment\ndata + ports\"]\n    B -->|\"+ IP header\"|C[\"Packet\nsegment + IPs\"]\n    C -->|\"+ MAC header + FCS\"|D[\"Frame\npacket + MACs\"]\n    D -->|\"convert\"|E[\"Bits\"]\n    E -->|\"receive\"|F[\"Frame — strip MAC\"]\n    F -->|\"de-encapsulate\"|G[\"Packet — strip IP\"]\n    G -->|\"de-encapsulate\"|H[\"Segment — strip TCP\"]\n    H -->|\"deliver\"|I[\"Application Data\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Encapsulation adds headers going down the stack; de-encapsulation strips them going up",
      "code": "# PDU names appear in real tools\n\n# Wireshark shows PDUs at each layer:\n# Frame 1: 74 bytes on wire\n#   Ethernet II (Frame — Layer 2)\n#     Src: 00:1a:2b:3c:4d:5e\n#     Dst: ff:ff:ff:ff:ff:ff\n#   Internet Protocol (Packet — Layer 3)\n#     Src: 192.168.1.100\n#     Dst: 8.8.8.8\n#   Transmission Control Protocol (Segment — Layer 4)\n#     Src Port: 54321, Dst Port: 443\n#   Application Data (Data — Layer 7)\n\n# ping — Layer 3 packets:\nping -c 4 8.8.8.8\n# 64 bytes from 8.8.8.8: icmp_seq=1 ttl=117\n# 'bytes' = ICMP packet payload\n\n# ss — Layer 4 segments/connections:\nss -tn\n# ESTAB  192.168.1.5:54321  8.8.8.8:443\n# Shows TCP segments (connections)\n\n# tcpdump — captures Layer 2 frames:\nsudo tcpdump -i eth0 -n -c 5\n# Each line = one frame captured off the wire",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The word 'packet' is used loosely in everyday speech to mean any unit of network data. Technically, a packet is specifically the Layer 3 PDU. Engineers say 'packet loss' when they mean Layer 3 loss, 'frame error' when they mean Layer 2, and 'segment retransmission' when they mean Layer 4. Using the correct term signals that you understand which layer has the problem."
      },
      "keyPoints": [
        "PDU names: Data (L7), Segment/Datagram (L4), Packet (L3), Frame (L2), Bits (L1)",
        "Encapsulation: each layer wraps the layer above's PDU in its own header going down",
        "De-encapsulation: each layer strips its header and passes the payload up",
        "The PDU name in an error message tells you which layer has the problem",
        "Packet is the L3 PDU — 'packet loss' means L3 loss, not a generic term"
      ],
      "tryIt": "Run sudo tcpdump -i eth0 -n -v -c 5 and identify the PDU at each layer in the output: the Ethernet frame (L2), the IP packet (L3), and the TCP segment or UDP datagram (L4). Open the same capture in Wireshark and click on a packet — the panel shows each layer's PDU separately."
    }
  },


  {
    "id": 15,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Encapsulation in Practice",
    "type": "lesson",
    "content": {
      "body": "Encapsulation is not just a theoretical concept — it is the mechanism that makes every network communication work. Tracing a real HTTP request through the encapsulation process makes the OSI model concrete and memorable.\n\n## A Real Example: Loading a Web Page\n\nWhen your browser requests https://example.com, here is what happens at each layer:\n\n**Layer 7 (Application)** — HTTP GET request sent to the web server.\n\n**Layer 6 (Presentation)** — TLS encrypts the HTTP data. Plaintext becomes ciphertext.\n\n**Layer 5 (Session)** — TLS session is established and maintained.\n\n**Layer 4 (Transport)** — TCP wraps the data in a segment with source port (e.g. 54321) and destination port (443). Sequence numbers added for ordering.\n\n**Layer 3 (Network)** — IP wraps the segment in a packet with source IP (your machine) and destination IP (example.com's server).\n\n**Layer 2 (Data Link)** — Ethernet wraps the packet in a frame with your MAC address and your **router's** MAC address — not the server's MAC.\n\n**Layer 1 (Physical)** — The frame is converted to electrical signals on the cable or radio waves on WiFi.\n\n## The Key Insight\n\nLayer 2 uses your router's MAC address, not the server's. The frame only travels to the next hop. At each router, the frame is stripped and rebuilt with new MAC addresses for the next hop. The IP packet travels end-to-end unchanged; the frame only travels hop-to-hop.",
      "diagram": "flowchart TD\n    A[\"Browser: GET / HTTP/1.1\"] --> B[\"L7: HTTP request\"]\n    B --> C[\"L6: TLS encrypt\"]\n    C --> D[\"L4: TCP segment\nsrc:54321 dst:443\"]\n    D --> E[\"L3: IP packet\nsrc:192.168.1.5 dst:93.184.216.34\"]\n    E --> F[\"L2: Ethernet frame\nsrc:your-MAC dst:router-MAC\"]\n    F --> G[\"L1: bits on wire\"]\n    G --> H[\"Router: strip frame\nbuild new frame\nfor next hop\"]\n    H --> I[\"IP packet travels\nend-to-end unchanged\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style I fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Frames are rebuilt at each hop with new MAC addresses; IP packets travel end-to-end unchanged",
      "code": "# Observe encapsulation with real tools\n\n# Step 1: Find your router's MAC address (next hop L2):\narp -n\n# 192.168.1.1 at aa:bb:cc:dd:ee:ff on eth0\n# This is the destination MAC in your outgoing frames\n\n# Step 2: Capture a packet to see all layers:\nsudo tcpdump -i eth0 -n -e host 8.8.8.8\n# -e shows Ethernet (L2) header\n# aa:bb:cc:dd:ee:ff > 11:22:33:44:55:66  (src MAC > dst MAC)\n# IP 192.168.1.5 > 8.8.8.8              (src IP > dst IP)\n\n# Key observation:\n# Destination MAC = your router (hop-to-hop)\n# Destination IP  = 8.8.8.8 (end-to-end)\n\n# Step 3: Verify IP packet is unchanged at each hop:\ntraceroute -n 8.8.8.8\n# Each hop is a router that stripped and rebuilt the frame\n# But the IP destination (8.8.8.8) never changed\n\n# Step 4: See TLS (L6) encryption:\nsudo tcpdump -i eth0 -n port 443 -A\n# Before TLS handshake: readable ClientHello\n# After handshake: encrypted gibberish — L6 working",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Run arp -n and note your router's MAC address. Then run sudo tcpdump -i eth0 -n -e -c 5 and look at the destination MAC of your outgoing packets. It will be your router's MAC — not the destination server's MAC. This proves that Layer 2 frames are hop-to-hop while Layer 3 packets are end-to-end."
      },
      "keyPoints": [
        "Each layer wraps the layer above's PDU in its own header — encapsulation going down",
        "The destination MAC in your frame is your router's MAC, not the final server's MAC",
        "Frames are hop-to-hop — rebuilt at each router with new MAC addresses",
        "IP packets are end-to-end — the source and destination IP never change in transit",
        "TLS (L6) encrypts the payload — tcpdump shows readable headers but encrypted data"
      ],
      "tryIt": "Run arp -n to get your router's MAC. Run sudo tcpdump -i eth0 -n -e -c 10 and confirm the destination MAC of outgoing packets matches your router's MAC. Then ping 8.8.8.8 and run the same capture — the destination IP is 8.8.8.8 (end-to-end) but the destination MAC is your router (hop-to-hop)."
    }
  },

  {
    "id": 16,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "The TCP/IP Model",
    "type": "lesson",
    "content": {
      "body": "The TCP/IP model is the practical model that the internet actually runs on. While the OSI model is a theoretical framework with seven layers, the TCP/IP model has four layers and maps directly to the protocols in use today.\n\n## The Four Layers\n\n**Application Layer** — combines OSI layers 5, 6, and 7. All application protocols live here: HTTP, HTTPS, DNS, SMTP, SSH, FTP. This is where developers spend most of their time.\n\n**Transport Layer** — same as OSI Layer 4. TCP and UDP. Provides end-to-end communication between processes using port numbers.\n\n**Internet Layer** — same as OSI Layer 3. IP (IPv4 and IPv6), ICMP. Provides logical addressing and routing across networks.\n\n**Network Access Layer** — combines OSI layers 1 and 2. Ethernet, WiFi, and the physical transmission medium. Handles local delivery and physical signalling.\n\n## Why Two Models?\n\nThe OSI model was designed first as a theoretical standard. TCP/IP was developed independently and became the dominant implementation. The OSI model is used for teaching and troubleshooting because its seven layers provide more granularity. The TCP/IP model reflects how protocols are actually implemented.\n\n## In Practice\n\nEngineers use both. When troubleshooting, the OSI model's seven layers give you more precise language. When discussing protocol stacks, the TCP/IP model's four layers are more practical. You need to be fluent in both.",
      "diagram": "flowchart LR\n    A[\"OSI\"] --> B[\"7 Application\"]\n    A --> C[\"6 Presentation\"]\n    A --> D[\"5 Session\"]\n    A --> E[\"4 Transport\"]\n    A --> F[\"3 Network\"]\n    A --> G[\"2 Data Link\"]\n    A --> H[\"1 Physical\"]\n    B --> I[\"Application\nHTTP DNS SMTP\"]\n    C --> I\n    D --> I\n    E --> J[\"Transport\nTCP UDP\"]\n    F --> K[\"Internet\nIP ICMP\"]\n    G --> L[\"Network Access\nEthernet WiFi\"]\n    H --> L\n    I --- M[\"TCP/IP\"]\n    J --- M\n    K --- M\n    L --- M\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style M fill:#ffd43b,color:#1a1a2e,stroke:#ffd43b",
      "diagramCaption": "TCP/IP collapses OSI's 7 layers into 4 — the model the internet actually runs on",
      "code": "# TCP/IP model in practice\n\n# Application layer — HTTP, DNS, SSH:\ncurl https://example.com\ndig example.com\nssh user@host\n\n# Transport layer — TCP connections, UDP datagrams:\nss -tnp          # TCP connections\nss -unp          # UDP sockets\nnc -zv host 443  # test TCP port\n\n# Internet layer — IP, routing, ICMP:\nip addr show     # IP addresses\nip route show    # routing table\nping 8.8.8.8     # ICMP echo\ntraceroute 8.8.8.8  # IP hop-by-hop\n\n# Network Access layer — Ethernet, WiFi:\nip link show     # interface state\narp -n           # MAC address table\nethtool eth0     # physical link info\n\n# See all four layers in one capture:\nsudo tcpdump -i eth0 -n -v -c 5\n# Network Access: Ethernet frame (MACs)\n# Internet:       IP packet (IPs, TTL)\n# Transport:      TCP segment (ports, flags)\n# Application:    payload (HTTP, DNS, etc)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The TCP/IP model is sometimes called the DoD model (Department of Defense) because it was developed under DARPA funding. The original ARPANET — the precursor to the internet — ran on TCP/IP. The OSI model came later as an attempt to create a vendor-neutral standard, but TCP/IP had already won in practice by the time OSI was finalised."
      },
      "keyPoints": [
        "TCP/IP has 4 layers: Application (L5-7), Transport (L4), Internet (L3), Network Access (L1-2)",
        "Application layer: HTTP, DNS, SMTP, SSH — where developers work",
        "Transport layer: TCP (reliable) and UDP (fast) — port numbers identify processes",
        "Internet layer: IP addressing and routing — ICMP for diagnostics",
        "Network Access: Ethernet/WiFi — local delivery and physical transmission"
      ],
      "tryIt": "For each TCP/IP layer, run one command that operates at that layer: curl (Application), ss -tnp (Transport), ping (Internet), ip link show (Network Access). For each command, identify what layer-specific information it reveals. This maps the TCP/IP model to the tools you use every day."
    }
  },

  {
    "id": 17,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "OSI vs TCP/IP: When to Use Each",
    "type": "lesson",
    "content": {
      "body": "Both models describe the same underlying reality — they just slice it differently. Knowing when to use each model makes you more effective in both learning and professional communication.\n\n## Use OSI When...\n\n**Troubleshooting** — OSI's seven layers give you a precise checklist. Is the problem at Layer 1 (physical), Layer 2 (switching), Layer 3 (routing), Layer 4 (transport), or Layer 7 (application)? The extra granularity helps isolate faults.\n\n**Learning** — OSI separates concerns that TCP/IP merges. Understanding that TLS is Layer 6 (presentation) and HTTP is Layer 7 (application) helps you understand why they are separate protocols that can be combined in different ways.\n\n**Vendor documentation** — network equipment vendors (Cisco, Juniper) use OSI layer numbers extensively. A Layer 3 switch, a Layer 7 load balancer, a Layer 2 VLAN — these terms come from OSI.\n\n## Use TCP/IP When...\n\n**Implementation** — TCP/IP maps directly to real protocols. When you are writing code, configuring a server, or reading RFC documentation, TCP/IP is the relevant model.\n\n**Protocol discussions** — talking about what runs over what. HTTP runs over TCP. TCP runs over IP. IP runs over Ethernet. This is TCP/IP stack language.\n\n## The Practical Rule\n\nUse OSI layer numbers for troubleshooting and vendor communication. Use TCP/IP layer names for protocol discussions and implementation. Be fluent in both — they describe the same thing from different angles.",
      "diagram": "flowchart TD\n    A[\"Which model?\"] --> B{\"Context\"}\n    B -->|\"Troubleshooting\nvendor docs\"|C[\"OSI\n7 layers\nprecise fault isolation\"]\n    B -->|\"Implementation\nprotocol discussion\"|D[\"TCP/IP\n4 layers\nmaps to real protocols\"]\n    C --> E[\"L3 switch\nL7 load balancer\nL2 VLAN\"]\n    D --> F[\"HTTP over TCP\nTCP over IP\nIP over Ethernet\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "OSI for troubleshooting and vendor communication; TCP/IP for implementation and protocol discussion",
      "code": "# OSI layer numbers in real vendor/tool output\n\n# 'Layer 3 switch' — switches that can route (L3 = IP):\n# ip route show\n# A managed switch with routing capability\n\n# 'Layer 7 load balancer' — routes based on HTTP content:\n# nginx, HAProxy, AWS ALB\n# Can route /api to one server, /static to another\n# Based on HTTP headers (L7) not just IP/port (L3/L4)\n\n# 'Layer 4 firewall' — filters by IP and port:\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\n# Inspects L4 (TCP port) — does not read HTTP content\n\n# 'Layer 7 firewall' (WAF) — filters by HTTP content:\n# Blocks SQL injection in HTTP body\n# Requires reading L7 application data\n\n# TCP/IP stack language:\n# 'HTTP runs over TCP' = Application over Transport\n# 'TCP runs over IP'   = Transport over Internet\n# 'IP runs over Ethernet' = Internet over Network Access\n\n# See the stack in a curl request:\ncurl -v https://example.com 2>&1 | grep -E 'Trying|SSL|HTTP'\n# Trying = TCP (Transport) connecting\n# SSL = TLS (Presentation/Application) handshake\n# HTTP = Application layer request",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "When a job posting says 'strong understanding of OSI model' they mean: can you troubleshoot at each layer? Can you tell the difference between a Layer 2 problem (ARP failure, VLAN misconfiguration) and a Layer 3 problem (routing, IP addressing)? The model is a communication tool — it gives engineers a shared vocabulary for describing where in the stack a problem lives."
      },
      "keyPoints": [
        "OSI: use for troubleshooting (7-layer checklist) and vendor communication (L3 switch, L7 LB)",
        "TCP/IP: use for implementation and protocol stack discussions (HTTP over TCP over IP)",
        "Both models describe the same reality — different granularity for different purposes",
        "Layer 3 switch routes at IP; Layer 7 load balancer routes at HTTP; Layer 4 firewall filters by port",
        "Be fluent in both — engineers use OSI layer numbers and TCP/IP layer names interchangeably"
      ],
      "tryIt": "Look up the documentation for any load balancer (nginx, HAProxy, or AWS ALB). Identify whether it is described as a Layer 4 or Layer 7 load balancer and what that means for what it can do. Then look up iptables — identify which OSI layer its rules operate at and what that means for what it can and cannot inspect."
    }
  },

  {
    "id": 18,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Layer 4: Transport in Depth — TCP vs UDP",
    "type": "lesson",
    "content": {
      "body": "Layer 4 is where the choice between reliability and speed is made. TCP and UDP are the two transport protocols, and choosing between them is one of the most fundamental decisions in network application design.\n\n## TCP — Transmission Control Protocol\n\nTCP provides reliable, ordered, connection-oriented delivery. Before any data is sent, a three-way handshake establishes the connection: SYN → SYN-ACK → ACK. Every segment is acknowledged. Lost segments are retransmitted. Data arrives in order.\n\nTCP is used when data integrity matters: HTTP/HTTPS, SSH, SMTP, database connections. You cannot afford to lose a byte of a web page or a database query.\n\n## UDP — User Datagram Protocol\n\nUDP provides fast, connectionless, unreliable delivery. No handshake. No acknowledgements. No retransmission. Packets may arrive out of order or not at all.\n\nUDP is used when speed matters more than reliability: DNS queries (fast lookup, retry if lost), video streaming (a dropped frame is better than a stall), VoIP, online gaming, QUIC/HTTP3.\n\n## Port Numbers\n\nBoth TCP and UDP use port numbers to identify which process on a device should receive the data. Well-known ports: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25. Ports 0–1023 are reserved for well-known services. Ports 1024–65535 are available for applications.\n\n## The Three-Way Handshake\n\nTCP connection establishment: Client sends SYN. Server responds SYN-ACK. Client sends ACK. Connection is established. This adds one round-trip of latency before any data can be sent — a cost that QUIC (HTTP/3) was designed to eliminate.",
      "diagram": "flowchart TD\n    A[\"Transport Layer 4\"] --> B[\"TCP\nreliable ordered\nconnection-oriented\"]\n    A --> C[\"UDP\nfast unreliable\nconnectionless\"]\n    B --> D[\"HTTP HTTPS SSH\nSMTP databases\"]\n    C --> E[\"DNS video VoIP\ngaming QUIC\"]\n    B --> F[\"SYN → SYN-ACK → ACK\nthree-way handshake\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "TCP trades speed for reliability; UDP trades reliability for speed — choose based on your application's needs",
      "code": "# TCP vs UDP in practice\n\n# See TCP connections (established, listening):\nss -tnp\n# ESTAB  192.168.1.5:54321  93.184.216.34:443  (HTTPS)\n# LISTEN 0.0.0.0:22                              (SSH)\n\n# See UDP sockets:\nss -unp\n# UNCONN 0.0.0.0:68   (DHCP client)\n# UNCONN 0.0.0.0:123  (NTP)\n\n# Capture TCP three-way handshake:\nsudo tcpdump -i eth0 -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' &\ncurl https://example.com\n# SYN      (client → server, SYN flag)\n# SYN-ACK  (server → client, SYN+ACK flags)\n# ACK      (client → server, ACK flag)\n\n# Test TCP port reachability:\nnc -zv example.com 443\n# Connection to example.com 443 port [tcp/https] succeeded\n\n# Test UDP port:\nnc -uzv 8.8.8.8 53\n# DNS uses UDP port 53\n\n# See port numbers for common services:\ncat /etc/services | grep -E '^(http|https|ssh|smtp|dns)\s'",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "TCP's reliability comes at a cost: the three-way handshake adds one round-trip before data flows, and head-of-line blocking means a lost packet stalls all subsequent data. QUIC (used by HTTP/3) solves both problems — it runs over UDP and implements its own reliability, connection establishment, and multiplexing without head-of-line blocking."
      },
      "keyPoints": [
        "TCP: reliable, ordered, connection-oriented — three-way handshake before data flows",
        "UDP: fast, connectionless, unreliable — no handshake, no retransmission",
        "TCP for: HTTP, SSH, SMTP, databases — data integrity required",
        "UDP for: DNS, video, VoIP, gaming, QUIC — speed more important than reliability",
        "Port numbers identify which process receives the data — well-known ports 0–1023"
      ],
      "tryIt": "Run ss -tnp and ss -unp to see all TCP and UDP sockets on your machine. Identify which services are using TCP and which are using UDP. Capture a TCP three-way handshake with tcpdump while running curl https://example.com. Count the SYN, SYN-ACK, and ACK packets."
    }
  },


  {
    "id": 19,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Layer 3: IP Addressing and Routing",
    "type": "lesson",
    "content": {
      "body": "Layer 3 is the network layer — responsible for logical addressing and routing packets across multiple networks. IP (Internet Protocol) is the Layer 3 protocol that makes the internet possible.\n\n## IP Addresses\n\nEvery device on a network has an IP address — a logical identifier that is independent of the hardware. Unlike MAC addresses (which are burned into hardware), IP addresses are assigned by configuration and can change.\n\n**IPv4** — 32-bit address written as four octets: 192.168.1.50. About 4.3 billion possible addresses — exhausted in 2011.\n\n**IPv6** — 128-bit address written in hexadecimal: 2001:db8::1. 340 undecillion addresses — effectively unlimited.\n\n## Routing\n\nRouters operate at Layer 3. When a packet arrives, the router reads the destination IP address and looks it up in its routing table. The routing table maps destination networks to next-hop addresses. The router forwards the packet to the next hop, which repeats the process until the packet reaches its destination.\n\n## TTL — Time to Live\n\nEvery IP packet has a TTL field — a counter that starts at 64 or 128 and decrements by 1 at each router. When TTL reaches 0, the router discards the packet and sends an ICMP Time Exceeded message back to the sender. This prevents packets from looping forever. Traceroute exploits TTL to map the path to a destination.\n\n## ICMP\n\nICMP (Internet Control Message Protocol) is a Layer 3 protocol used for diagnostics and error reporting. Ping uses ICMP echo request/reply. Traceroute uses ICMP Time Exceeded. Path MTU Discovery uses ICMP Fragmentation Needed.",
      "diagram": "flowchart LR\n    A[\"Source\n192.168.1.5\"] -->|\"packet\"|B[\"Router 1\ncheck routing table\"]\n    B -->|\"next hop\"|C[\"Router 2\ncheck routing table\"]\n    C -->|\"next hop\"|D[\"Destination\n93.184.216.34\"]\n    B -.- E[\"Routing Table\n0.0.0.0/0 via ISP\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Routers forward packets hop by hop using routing tables — each router knows the next hop, not the full path",
      "code": "# Layer 3 tools\n\n# View IP addresses:\nip addr show\n# inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0\n\n# View routing table:\nip route show\n# default via 192.168.1.1 dev eth0  (default route)\n# 192.168.1.0/24 dev eth0           (local subnet)\n\n# Test Layer 3 reachability (ICMP):\nping -c 4 8.8.8.8\n\n# Trace the routing path (exploits TTL):\ntraceroute -n 8.8.8.8\n# 1  192.168.1.1   0.5ms  (your router)\n# 2  10.x.x.x     5ms    (ISP)\n# 3  ...\n\n# Check TTL of incoming packets:\nsudo tcpdump -i eth0 -n -v icmp\n# ttl 117 — Google's packets start at 128, 11 hops away\n\n# Add a static route:\nsudo ip route add 10.0.2.0/24 via 192.168.1.254\n\n# Delete a route:\nsudo ip route del 10.0.2.0/24",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Routers do not know the full path to a destination — they only know the next hop. This is called hop-by-hop routing. Each router makes an independent forwarding decision based on its own routing table. This is why the internet is resilient: if one path fails, routers can route around it using alternative next hops."
      },
      "keyPoints": [
        "IP addresses are logical identifiers assigned by configuration — unlike MAC addresses burned into hardware",
        "IPv4: 32-bit, 4.3 billion addresses (exhausted); IPv6: 128-bit, effectively unlimited",
        "Routers forward packets hop by hop using routing tables — each router knows only the next hop",
        "TTL decrements at each router — prevents infinite loops, exploited by traceroute",
        "ICMP is the Layer 3 diagnostic protocol — ping, traceroute, and Path MTU Discovery all use it"
      ],
      "tryIt": "Run ip route show and identify your default route and local subnet route. Run traceroute -n 8.8.8.8 and count the hops. Run sudo tcpdump -i eth0 -n -v icmp while pinging 8.8.8.8 — note the TTL value in the replies. Calculate how many hops away Google is by subtracting the received TTL from the starting TTL (typically 64 or 128)."
    }
  },

  {
    "id": 20,
    "moduleId": 2,
    "moduleTitle": "OSI Model & TCP/IP Model",
    "title": "Module 2 Summary",
    "type": "lesson",
    "content": {
      "body": "This module gave you the mental framework that organises all of networking. The OSI and TCP/IP models are not just academic concepts — they are the vocabulary and troubleshooting methodology that every network engineer uses daily.\n\n## What You Learned\n\n**Why models exist** — standardisation, abstraction, and troubleshooting structure. Before OSI, vendor lock-in made interoperability impossible.\n\n**The seven OSI layers** — Physical (L1), Data Link (L2), Network (L3), Transport (L4), Session (L5), Presentation (L6), Application (L7). Each handles one concern.\n\n**PDUs** — Bits (L1), Frame (L2), Packet (L3), Segment/Datagram (L4), Data (L7). The PDU name tells you which layer has the problem.\n\n**Encapsulation** — headers added going down the stack, stripped going up. Frames are hop-to-hop; packets are end-to-end.\n\n**TCP/IP model** — four layers: Network Access, Internet, Transport, Application. The model the internet actually runs on.\n\n**TCP vs UDP** — TCP: reliable, ordered, connection-oriented. UDP: fast, connectionless. Choose based on whether your application needs reliability or speed.\n\n**Layer 3 routing** — IP addresses, routing tables, TTL, ICMP. Routers forward packets hop by hop.\n\n## What Is Coming Next\n\nModule 3 covers IP addressing in depth — IPv4, IPv6, subnetting, and CIDR notation. You will learn to calculate subnets, understand why IPv6 exists, and configure IP addresses correctly.",
      "diagram": "flowchart TD\n    A[\"✅ Why models exist\nstandardisation abstraction\"] --> B[\"✅ 7 OSI layers\nL1 through L7\"]\n    B --> C[\"✅ PDUs\nBits Frame Packet Segment Data\"]\n    C --> D[\"✅ Encapsulation\nhop-to-hop vs end-to-end\"]\n    D --> E[\"✅ TCP/IP model\n4 layers\"]\n    E --> F[\"✅ TCP vs UDP\nreliable vs fast\"]\n    F --> G[\"➡️ IP Addressing\nModule 3\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 2 complete — the OSI and TCP/IP models as a framework for all networking",
      "code": "# Module 2 command reference\n\n# Layer 1 — Physical:\nethtool eth0 | grep -E 'Speed|Link'\n\n# Layer 2 — Data Link:\nip link show\narp -n\n\n# Layer 3 — Network:\nip addr show\nip route show\nping -c 4 8.8.8.8\ntraceroute -n 8.8.8.8\n\n# Layer 4 — Transport:\nss -tnp   # TCP\nss -unp   # UDP\nnc -zv host 443\n\n# Layer 7 — Application:\ncurl -v https://example.com\ndig example.com\n\n# All layers at once:\nsudo tcpdump -i eth0 -n -v -c 5",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The OSI model is most valuable as a troubleshooting checklist. When something is broken, start at Layer 1 and work up: is the interface up? Does it have an IP? Can it reach the gateway? Can it reach the destination IP? Can it reach the destination port? Does the application respond? The first layer that fails is where the problem is."
      },
      "keyPoints": [
        "OSI 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application",
        "TCP/IP 4 layers: Network Access, Internet, Transport, Application",
        "Encapsulation: frames hop-to-hop (MAC changes at each router), packets end-to-end (IP unchanged)",
        "TCP: reliable ordered delivery with handshake; UDP: fast connectionless delivery",
        "Troubleshoot bottom-up: L1 → L2 → L3 → L4 → L7"
      ],
      "tryIt": "Run the full Module 2 command reference above. For each command, identify which OSI layer it operates at and what it tells you. Then deliberately break your network at Layer 3 (delete your default route with ip route del default) and practice diagnosing it using the bottom-up methodology before restoring it."
    }
  },

  // =========================
  // Networking Module 3: IP Addressing, IPv4, IPv6 & Subnetting
  // =========================

  {
    "id": 21,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "Welcome to IP Addressing and Subnetting",
    "type": "lesson",
    "content": {
      "body": "IP addressing is the system that makes global routing possible. Every device that communicates on the internet needs an IP address — a logical identifier that routers use to deliver packets to the right destination. This module takes you from the basics of IPv4 all the way through subnetting, VLSM, DHCP, and IPv6.\n\n## What This Module Covers\n\n- IPv4 address structure — network and host portions, special addresses\n- Public vs private addresses — RFC 1918 ranges and NAT\n- CIDR notation and subnet masks — how to read and calculate them\n- Subnetting — dividing networks for security, performance, and organisation\n- VLSM — variable length subnet masking for efficient address allocation\n- DHCP — how devices get IP addresses automatically\n- IPv6 — why it exists, how it works, and how it differs from IPv4\n\n## The Skill That Separates Beginners from Professionals\n\nSubnetting. Every network engineer is expected to calculate subnets mentally. Given a network address and prefix length, you should be able to instantly identify the network address, broadcast address, host range, and number of usable hosts. This module builds that skill from the ground up.",
      "diagram": "flowchart TD\n    A[\"Module 3\"] --> B[\"IPv4 structure\n32-bit dotted decimal\"]\n    A --> C[\"Public vs private\nRFC 1918 NAT\"]\n    A --> D[\"CIDR subnetting\nprefix host calculation\"]\n    A --> E[\"VLSM\nvariable length subnets\"]\n    A --> F[\"DHCP\nDORA auto-configuration\"]\n    A --> G[\"IPv6\n128-bit no NAT SLAAC\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style G fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Module 3 covers IP addressing from IPv4 basics through subnetting, DHCP, and IPv6",
      "code": "# IP addressing quick reference\n\n# View your IP address and subnet:\nip addr show\n# inet 192.168.1.50/24 — /24 means 254 usable hosts\n\n# Your public IP (as seen by the internet):\ncurl -s ifconfig.me\n\n# Calculate subnet details:\n# Install ipcalc if not present: sudo apt install ipcalc\nipcalc 192.168.1.50/24\n\n# Check for DHCP lease:\ncat /var/lib/dhcp/dhclient.leases 2>/dev/null | head -10\n\n# Check IPv6:\nip -6 addr show",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Install ipcalc before starting this module — sudo apt install ipcalc. It instantly calculates network address, broadcast, host range, and host count for any subnet. Use it to verify your manual calculations throughout the module."
      },
      "keyPoints": [
        "IPv4 is 32-bit — ~4.3 billion addresses, exhausted in 2011",
        "Private ranges (RFC 1918): 10/8, 172.16/12, 192.168/16 — not routed on the internet",
        "CIDR /prefix-length: hosts = 2^(32-prefix) - 2",
        "DHCP DORA assigns IP, gateway, DNS automatically — 169.254.x.x means DHCP failed",
        "IPv6 is 128-bit — 340 undecillion addresses, no NAT required"
      ],
      "tryIt": "Run ip addr show and identify your IP address and subnet prefix. Run ipcalc on your IP/prefix to see the full subnet details. Run curl -s ifconfig.me to see your public IP. Note the difference — that gap is NAT."
    }
  },


  {
    "id": 22,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "IPv4: Structure and Address Space",
    "type": "lesson",
    "content": {
      "body": "IPv4 (Internet Protocol version 4) is the addressing system that has powered the internet since 1983. Every device that communicates on the internet needs an IP address — a unique identifier that routers use to deliver packets to the right destination.\n\n## IPv4 Address Structure\n\nAn IPv4 address is 32 bits long, written as four decimal numbers (octets) separated by dots: 192.168.1.50. Each octet is 8 bits, ranging from 0 to 255.\n\n32 bits = 2³² = approximately 4.3 billion possible addresses. This seemed enormous in 1983. By 2011, the global pool of unallocated IPv4 addresses was exhausted.\n\n## Network and Host Portions\n\nAn IP address has two parts: the network portion (identifies which network the device is on) and the host portion (identifies which device on that network). The subnet mask determines where the split is.\n\nFor 192.168.1.50/24:\n- Network: 192.168.1.0 (first 24 bits)\n- Host: .50 (last 8 bits)\n- Valid hosts: 192.168.1.1 to 192.168.1.254\n- Broadcast: 192.168.1.255\n\n## Special Addresses\n\n- **Network address** — all host bits zero (192.168.1.0) — identifies the network, not assignable\n- **Broadcast address** — all host bits one (192.168.1.255) — sends to all hosts on the network\n- **Loopback** — 127.0.0.1 — always refers to the local machine\n- **Default route** — 0.0.0.0/0 — matches all destinations",
      "diagram": "flowchart TD\n    A[\"192.168.1.50/24\"] --> B[\"Network: 192.168.1.0\nfirst 24 bits\"]\n    A --> C[\"Host: .50\nlast 8 bits\"]\n    B --> D[\"Valid hosts\n.1 to .254\"]\n    B --> E[\"Network addr: .0\nBroadcast: .255\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "IPv4 address split into network and host portions by the subnet mask",
      "code": "# IPv4 address inspection\n\n# View your IP address and subnet:\nip addr show eth0\n# inet 192.168.1.50/24 brd 192.168.1.255\n# /24 = subnet mask, brd = broadcast address\n\n# Calculate network details with ipcalc:\nipcalc 192.168.1.50/24\n# Address:   192.168.1.50\n# Netmask:   255.255.255.0 = 24\n# Network:   192.168.1.0/24\n# HostMin:   192.168.1.1\n# HostMax:   192.168.1.254\n# Broadcast: 192.168.1.255\n# Hosts/Net: 254\n\n# Test loopback:\nping -c 2 127.0.0.1\n# Always works — loopback never leaves the machine\n\n# See all IP addresses on all interfaces:\nip addr show\n\n# Check broadcast address:\nip addr show eth0 | grep brd",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The /24 in 192.168.1.50/24 means the first 24 bits are the network portion. This leaves 8 bits for hosts: 2⁸ = 256 addresses, minus 2 (network and broadcast) = 254 usable host addresses. Install ipcalc (sudo apt install ipcalc) — it is the fastest way to verify subnet calculations."
      },
      "keyPoints": [
        "IPv4 is 32 bits — four octets in dotted decimal notation (e.g. 192.168.1.50)",
        "32 bits = ~4.3 billion addresses — exhausted globally in 2011",
        "Network portion identifies the network; host portion identifies the device",
        "Network address (all host bits 0) and broadcast (all host bits 1) are not assignable",
        "Loopback 127.0.0.1 always refers to the local machine — never leaves the host"
      ],
      "tryIt": "Run ip addr show and identify your IP address and subnet mask. Install ipcalc and run ipcalc <your-ip>/<prefix>. Identify the network address, broadcast address, and number of usable hosts. Then ping 127.0.0.1 and confirm it always succeeds regardless of network connectivity."
    }
  },

  {
    "id": 23,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "Public vs Private IP Addresses",
    "type": "lesson",
    "content": {
      "body": "Not all IPv4 addresses are equal. The internet uses a split between public addresses (globally routable, unique on the internet) and private addresses (only valid within a private network, not routed on the internet).\n\n## Private Address Ranges (RFC 1918)\n\nThree blocks are reserved for private use:\n- **10.0.0.0/8** — 10.x.x.x — 16.7 million addresses. Used by large enterprises and cloud providers.\n- **172.16.0.0/12** — 172.16.x.x to 172.31.x.x — 1 million addresses. Less common.\n- **192.168.0.0/16** — 192.168.x.x — 65,536 addresses. Used by almost every home router.\n\nPrivate addresses can be reused in different networks — your 192.168.1.1 and your neighbour's 192.168.1.1 are completely separate. This is what made IPv4 last as long as it did.\n\n## NAT — Network Address Translation\n\nPrivate addresses cannot be routed on the internet. NAT (Network Address Translation) solves this: your router translates your private IP to its public IP when sending traffic to the internet, and translates back when replies arrive. From the internet's perspective, all devices on your home network share one public IP.\n\n## Special Ranges\n\n- **169.254.0.0/16** — APIPA (Automatic Private IP Addressing). Assigned when DHCP fails. If you see a 169.254.x.x address, DHCP is broken.\n- **100.64.0.0/10** — Carrier-grade NAT (CGNAT). Used by ISPs to share one public IP among many customers.",
      "diagram": "flowchart LR\n    A[\"Private\n192.168.1.x\"] -->|\"NAT\"|B[\"Router\nPublic IP\"]\n    B -->|\"internet\"|C[\"Server\n93.184.216.34\"]\n    D[\"Private ranges\"] --> E[\"10.0.0.0/8\"]\n    D --> F[\"172.16.0.0/12\"]\n    D --> G[\"192.168.0.0/16\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Private addresses are translated to a public IP by NAT at the router — the internet only sees the public IP",
      "code": "# Identify public vs private addresses\n\n# Your private IP:\nip addr show | grep 'inet '\n# inet 192.168.1.50/24 — private (RFC 1918)\n\n# Your public IP (as seen by the internet):\ncurl -s ifconfig.me\n# 203.0.113.45 — your router's public IP\n\n# Check if an IP is private:\n# Private ranges:\n# 10.0.0.0    - 10.255.255.255  (/8)\n# 172.16.0.0  - 172.31.255.255  (/12)\n# 192.168.0.0 - 192.168.255.255 (/16)\n\n# APIPA — DHCP failure indicator:\n# If you see 169.254.x.x, DHCP is not working\nip addr show | grep '169.254'\n# If this returns anything, fix your DHCP\n\n# See NAT in action — your private IP vs public IP:\necho \"Private: $(ip route get 8.8.8.8 | grep src | awk '{print $7}')\"\necho \"Public:  $(curl -s ifconfig.me)\"\n# Private: 192.168.1.50\n# Public:  203.0.113.45",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "If your machine has a 169.254.x.x address, DHCP has failed — your machine assigned itself an APIPA address. This means it cannot reach the internet or other network services. Check your DHCP server, network cable, and WiFi connection. Run sudo dhclient -r eth0 && sudo dhclient eth0 to force a DHCP renewal."
      },
      "keyPoints": [
        "Private ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 — not routed on internet",
        "NAT translates private IPs to a public IP at the router — all home devices share one public IP",
        "Private addresses can be reused across different networks — this extended IPv4's lifespan",
        "169.254.x.x (APIPA) means DHCP failed — the device assigned itself an address",
        "100.64.0.0/10 is CGNAT — ISPs use this to share one public IP among many customers"
      ],
      "tryIt": "Run ip addr show to find your private IP. Run curl -s ifconfig.me to find your public IP. Confirm they are different — that difference is NAT in action. Check whether your private IP falls in one of the three RFC 1918 ranges. If you have multiple devices on your network, confirm they all share the same public IP."
    }
  },

  {
    "id": 24,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "CIDR Notation and Subnet Masks",
    "type": "lesson",
    "content": {
      "body": "CIDR (Classless Inter-Domain Routing) notation is the standard way to express IP addresses and their subnet masks together. Understanding CIDR is essential for configuring networks, reading routing tables, and writing firewall rules.\n\n## CIDR Notation\n\nCIDR notation appends a prefix length to the IP address: 192.168.1.0/24. The prefix length (the number after the slash) indicates how many bits are the network portion. The remaining bits are the host portion.\n\n- /24 = 24 network bits, 8 host bits = 256 addresses (254 usable)\n- /25 = 25 network bits, 7 host bits = 128 addresses (126 usable)\n- /16 = 16 network bits, 16 host bits = 65,536 addresses\n- /8  = 8 network bits, 24 host bits = 16.7 million addresses\n- /32 = 32 network bits, 0 host bits = single host address\n\n## Subnet Mask\n\nThe subnet mask is the dotted-decimal equivalent of the prefix length. /24 = 255.255.255.0. /25 = 255.255.255.128. The mask has 1s in the network bits and 0s in the host bits.\n\n## Calculating Hosts\n\nHosts per subnet = 2^(host bits) - 2 (subtract network and broadcast addresses).\n- /24: 2^8 - 2 = 254 hosts\n- /25: 2^7 - 2 = 126 hosts\n- /30: 2^2 - 2 = 2 hosts (point-to-point links)\n- /31: 2^1 - 0 = 2 hosts (RFC 3021, no broadcast)\n- /32: single host (loopback, firewall rules)",
      "diagram": "flowchart TD\n    A[\"192.168.1.0/24\"] --> B[\"Prefix /24\n24 network bits\"]\n    A --> C[\"8 host bits\n2^8 = 256 addresses\"]\n    C --> D[\"254 usable hosts\n.1 to .254\"]\n    E[\"Common prefixes\"] --> F[\"/8  16.7M hosts\"]\n    E --> G[\"/16  65534 hosts\"]\n    E --> H[\"/24  254 hosts\"]\n    E --> I[\"/30  2 hosts\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "CIDR prefix length determines network vs host bits — more network bits means fewer hosts per subnet",
      "code": "# CIDR and subnet mask calculations\n\n# ipcalc — fastest way to check any subnet:\nipcalc 10.0.0.0/8\n# Netmask: 255.0.0.0\n# Hosts:   16777214\n\nipcalc 192.168.1.0/25\n# Network:   192.168.1.0/25\n# HostMin:   192.168.1.1\n# HostMax:   192.168.1.126\n# Broadcast: 192.168.1.127\n# Hosts:     126\n\n# Common CIDR reference:\n# /8  = 255.0.0.0       = 16,777,214 hosts\n# /16 = 255.255.0.0     = 65,534 hosts\n# /24 = 255.255.255.0   = 254 hosts\n# /25 = 255.255.255.128 = 126 hosts\n# /26 = 255.255.255.192 = 62 hosts\n# /27 = 255.255.255.224 = 30 hosts\n# /28 = 255.255.255.240 = 14 hosts\n# /30 = 255.255.255.252 = 2 hosts\n# /32 = 255.255.255.255 = 1 host\n\n# Check if an IP is in a subnet:\n# python3\n# import ipaddress\n# ipaddress.ip_address('192.168.1.50') in ipaddress.ip_network('192.168.1.0/24')\n# True\n\n# List all IPs in a /29 subnet:\n# import ipaddress\n# list(ipaddress.ip_network('192.168.1.0/29').hosts())\n# [192.168.1.1 ... 192.168.1.6]",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Memorise the host counts for the most common prefixes: /24=254, /25=126, /26=62, /27=30, /28=14, /30=2. These come up constantly in network design and firewall rules. The formula is always 2^(32-prefix) - 2. For /30: 2^(32-30) - 2 = 2^2 - 2 = 2 hosts — used for point-to-point links between routers."
      },
      "keyPoints": [
        "CIDR notation: IP/prefix-length — the prefix length is how many bits are the network portion",
        "Subnet mask is the dotted-decimal equivalent: /24 = 255.255.255.0",
        "Hosts per subnet = 2^(host bits) - 2 (subtract network and broadcast)",
        "/32 = single host, /30 = 2 hosts (point-to-point), /24 = 254 hosts, /8 = 16.7M hosts",
        "ipcalc is the fastest tool for subnet calculations — install it and use it"
      ],
      "tryIt": "Without using ipcalc, calculate the network address, broadcast address, and number of usable hosts for 172.16.5.200/27. Then verify with ipcalc 172.16.5.200/27. Repeat for 10.0.0.0/22. The formula: network = IP AND mask, broadcast = network OR (NOT mask), hosts = 2^(32-prefix) - 2."
    }
  },


  {
    "id": 25,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "Subnetting: Dividing Networks",
    "type": "lesson",
    "content": {
      "body": "Subnetting is the process of dividing a larger network into smaller sub-networks. It is one of the most practical skills in networking — used in every network design, cloud VPC configuration, and firewall rule.\n\n## Why Subnet?\n\n**Security** — separate departments or services into different subnets. A firewall can control traffic between subnets. Servers in one subnet cannot directly reach clients in another without going through the firewall.\n\n**Performance** — broadcast traffic stays within a subnet. A large flat network with 1000 devices generates enormous broadcast traffic. Subnetting limits broadcast domains.\n\n**Organisation** — logical grouping of devices. All servers in 10.0.1.0/24, all workstations in 10.0.2.0/24, all printers in 10.0.3.0/24.\n\n**IP address efficiency** — allocate only as many addresses as needed. A point-to-point link between two routers needs only 2 addresses — use a /30, not a /24.\n\n## Subnetting a /24\n\nStarting with 192.168.1.0/24 (254 hosts), split into four /26 subnets (62 hosts each):\n\n- 192.168.1.0/26 — hosts .1 to .62, broadcast .63\n- 192.168.1.64/26 — hosts .65 to .126, broadcast .127\n- 192.168.1.128/26 — hosts .129 to .190, broadcast .191\n- 192.168.1.192/26 — hosts .193 to .254, broadcast .255\n\nEach /26 borrows 2 bits from the host portion: 2² = 4 subnets, each with 2⁶ - 2 = 62 hosts.",
      "diagram": "flowchart TD\n    A[\"192.168.1.0/24\n254 hosts\"] --> B[\"192.168.1.0/26\n62 hosts — Servers\"]\n    A --> C[\"192.168.1.64/26\n62 hosts — Workstations\"]\n    A --> D[\"192.168.1.128/26\n62 hosts — WiFi\"]\n    A --> E[\"192.168.1.192/26\n62 hosts — DMZ\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Subnetting a /24 into four /26s — each subnet has 62 usable hosts and its own broadcast domain",
      "code": "# Subnetting practice\n\n# Verify subnet calculations with ipcalc:\nipcalc 192.168.1.0/26\n# Network:   192.168.1.0/26\n# HostMin:   192.168.1.1\n# HostMax:   192.168.1.62\n# Broadcast: 192.168.1.63\n# Hosts:     62\n\nipcalc 192.168.1.64/26\n# Network:   192.168.1.64/26\n# HostMin:   192.168.1.65\n# HostMax:   192.168.1.126\n# Broadcast: 192.168.1.127\n\n# Configure a subnetted interface:\nsudo ip addr add 192.168.1.10/26 dev eth0\n# This device is in the 192.168.1.0/26 subnet\n# It can reach .1 to .62 directly\n# It needs a router to reach .64/26 or .128/26\n\n# Verify subnet membership:\nip route show\n# 192.168.1.0/26 dev eth0 — local subnet\n# default via 192.168.1.1 — everything else via router\n\n# Quick subnet math:\n# /26: block size = 256 - 192 = 64\n# Subnets: 0, 64, 128, 192\n# /27: block size = 256 - 224 = 32\n# Subnets: 0, 32, 64, 96, 128, 160, 192, 224",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The block size shortcut: subtract the last non-zero octet of the subnet mask from 256. For /26 (mask 255.255.255.192): 256 - 192 = 64. Subnets start at multiples of 64: 0, 64, 128, 192. For /27 (mask 255.255.255.224): 256 - 224 = 32. Subnets: 0, 32, 64, 96... This is faster than binary conversion for quick mental calculations."
      },
      "keyPoints": [
        "Subnetting divides a large network into smaller ones — for security, performance, and organisation",
        "Borrowing n bits from the host portion creates 2^n subnets, each with 2^(remaining host bits) - 2 hosts",
        "Block size = 256 - last non-zero subnet mask octet — subnets start at multiples of block size",
        "Point-to-point links use /30 (2 hosts) or /31 (2 hosts, no broadcast per RFC 3021)",
        "ipcalc verifies subnet calculations instantly — use it to check your work"
      ],
      "tryIt": "Subnet 10.0.0.0/24 into 8 equal subnets. Calculate the prefix length, block size, network address, broadcast, and host range for each subnet without using ipcalc. Then verify all 8 with ipcalc. Design a subnet scheme for a small office: servers, workstations, WiFi, and a DMZ — each in its own subnet."
    }
  },

  {
    "id": 26,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "VLSM: Variable Length Subnet Masking",
    "type": "lesson",
    "content": {
      "body": "VLSM (Variable Length Subnet Masking) allows different subnets within the same network to have different prefix lengths. This is how real networks are designed — allocating exactly the right number of addresses for each segment rather than wasting addresses with uniform subnet sizes.\n\n## The Problem VLSM Solves\n\nWith fixed-length subnetting, every subnet is the same size. If you split 192.168.1.0/24 into /26s, you get four subnets of 62 hosts each. But what if you need one subnet with 50 hosts, one with 20, one with 10, and one with 2 (a point-to-point link)? Fixed subnetting wastes addresses.\n\n## VLSM in Practice\n\nStarting with 10.0.0.0/24, allocate subnets by size (largest first):\n\n1. **50 hosts needed** → /26 (62 hosts) → 10.0.0.0/26 (uses .0–.63)\n2. **20 hosts needed** → /27 (30 hosts) → 10.0.0.64/27 (uses .64–.95)\n3. **10 hosts needed** → /28 (14 hosts) → 10.0.0.96/28 (uses .96–.111)\n4. **2 hosts needed** → /30 (2 hosts) → 10.0.0.112/30 (uses .112–.115)\n\nTotal used: 116 addresses out of 256. Without VLSM, four /26s would use all 256 addresses for only 248 usable hosts.\n\n## The Rule: Allocate Largest First\n\nAlways allocate the largest subnet first. This ensures subnets align on natural boundaries and avoids overlap.",
      "diagram": "flowchart TD\n    A[\"10.0.0.0/24\"] --> B[\"10.0.0.0/26\n62 hosts — LAN A\"]\n    A --> C[\"10.0.0.64/27\n30 hosts — LAN B\"]\n    A --> D[\"10.0.0.96/28\n14 hosts — LAN C\"]\n    A --> E[\"10.0.0.112/30\n2 hosts — WAN link\"]\n    A --> F[\"10.0.0.116/24 remainder\nunallocated\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "VLSM allocates different prefix lengths to different subnets — largest first to avoid overlap",
      "code": "# VLSM design and verification\n\n# Verify each VLSM subnet with ipcalc:\nipcalc 10.0.0.0/26\n# HostMin: 10.0.0.1, HostMax: 10.0.0.62, Broadcast: 10.0.0.63\n\nipcalc 10.0.0.64/27\n# HostMin: 10.0.0.65, HostMax: 10.0.0.94, Broadcast: 10.0.0.95\n\nipcalc 10.0.0.96/28\n# HostMin: 10.0.0.97, HostMax: 10.0.0.110, Broadcast: 10.0.0.111\n\nipcalc 10.0.0.112/30\n# HostMin: 10.0.0.113, HostMax: 10.0.0.114, Broadcast: 10.0.0.115\n\n# Check for overlap — subnets must not overlap:\n# /26 ends at .63, /27 starts at .64 — no overlap\n# /27 ends at .95, /28 starts at .96 — no overlap\n# /28 ends at .111, /30 starts at .112 — no overlap\n\n# Real-world VLSM example — AWS VPC:\n# VPC: 10.0.0.0/16\n# Public subnet A:  10.0.1.0/24  (254 hosts)\n# Public subnet B:  10.0.2.0/24  (254 hosts)\n# Private subnet A: 10.0.10.0/24 (254 hosts)\n# Private subnet B: 10.0.11.0/24 (254 hosts)\n# DB subnet:        10.0.20.0/28 (14 hosts)\n# Management:       10.0.30.0/30 (2 hosts)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "VLSM is how every cloud provider designs VPCs. AWS, GCP, and Azure all use VLSM — you allocate a large CIDR block to the VPC (e.g. 10.0.0.0/16) and then carve it into subnets of different sizes for different purposes. Understanding VLSM makes cloud networking configuration intuitive rather than mysterious."
      },
      "keyPoints": [
        "VLSM allows different subnets to have different prefix lengths — allocate exactly what is needed",
        "Always allocate largest subnets first to ensure natural boundary alignment",
        "VLSM eliminates address waste compared to fixed-length subnetting",
        "Check for overlap: each subnet's broadcast address must be less than the next subnet's network address",
        "Cloud VPCs use VLSM — understanding it makes AWS/GCP/Azure networking intuitive"
      ],
      "tryIt": "Design a VLSM scheme for 172.16.0.0/24 with these requirements: one subnet for 100 hosts, one for 50 hosts, one for 25 hosts, two point-to-point links. Allocate largest first, verify with ipcalc, and confirm no subnets overlap. Calculate how many addresses are wasted vs a fixed /25 scheme."
    }
  },

  {
    "id": 27,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "DHCP: How Devices Get IP Addresses",
    "type": "lesson",
    "content": {
      "body": "Manually configuring IP addresses on every device is impractical at scale. DHCP (Dynamic Host Configuration Protocol) automates IP address assignment — when a device connects to a network, it requests an IP address and the DHCP server assigns one automatically.\n\n## The DORA Process\n\nDHCP uses a four-step handshake:\n\n1. **Discover** — client broadcasts: I need an IP address. Source: 0.0.0.0, destination: 255.255.255.255.\n2. **Offer** — DHCP server responds with an available IP, subnet mask, gateway, DNS servers, and lease time.\n3. **Request** — client broadcasts its acceptance of the offer.\n4. **Acknowledge** — server confirms the lease. Client configures its interface.\n\n## What DHCP Provides\n\nBeyond just an IP address, DHCP delivers a complete network configuration:\n- IP address and subnet mask\n- Default gateway\n- DNS server addresses\n- Lease duration\n- Optional: NTP servers, domain name, TFTP server (for PXE boot)\n\n## Static vs Dynamic\n\nServers and network devices typically use static (manually configured) IP addresses — you need to know where they are. Client devices (laptops, phones) use DHCP — their address can change between connections.\n\n## DHCP Relay\n\nDHCP uses broadcasts, which do not cross router boundaries. A DHCP relay agent forwards DHCP broadcasts to a centralised server on another subnet.",
      "diagram": "flowchart LR\n    A[\"Client\n0.0.0.0\"] -->|\"1 DISCOVER broadcast\"|B[\"DHCP Server\"]\n    B -->|\"2 OFFER 192.168.1.50\"|A\n    A -->|\"3 REQUEST broadcast\"|B\n    B -->|\"4 ACK lease confirmed\"|A\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style B fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "DORA: Discover → Offer → Request → Acknowledge — four steps to get an IP address",
      "code": "# DHCP diagnostics\n\n# View current DHCP lease:\ncat /var/lib/dhcp/dhclient.leases\n# lease {\n#   fixed-address 192.168.1.50;\n#   option subnet-mask 255.255.255.0;\n#   option routers 192.168.1.1;\n#   option domain-name-servers 8.8.8.8;\n#   expire 1 2024/01/15 12:00:00;\n# }\n\n# Release and renew DHCP lease:\nsudo dhclient -r eth0   # release\nsudo dhclient eth0      # renew\n\n# Capture DHCP handshake:\nsudo tcpdump -i eth0 -n port 67 or port 68\n# Watch for: DISCOVER, OFFER, REQUEST, ACK\n\n# Check if DHCP is working:\nip addr show eth0 | grep inet\n# inet 192.168.1.50/24 — DHCP assigned\n# inet 169.254.x.x/16 — DHCP FAILED (APIPA)\n\n# systemd-networkd systems:\nnetworkctl status eth0\n# Address: 192.168.1.50 (DHCP)\n# Gateway: 192.168.1.1",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "If your device has a 169.254.x.x address, DHCP has failed. The device assigned itself an APIPA address and cannot reach the internet or network services. Check: is the DHCP server running? Is the network cable connected? Is the interface up (ip link show)? Run sudo dhclient -r eth0 && sudo dhclient eth0 to force a fresh DHCP request."
      },
      "keyPoints": [
        "DHCP automates IP configuration — DORA: Discover, Offer, Request, Acknowledge",
        "DHCP provides IP, subnet mask, gateway, DNS, and lease duration",
        "Servers use static IPs; client devices use DHCP",
        "169.254.x.x (APIPA) means DHCP failed — the device self-assigned an address",
        "DHCP relay forwards broadcasts across router boundaries to a centralised server"
      ],
      "tryIt": "Capture a DHCP handshake: run sudo tcpdump -i eth0 port 67 or port 68 in one terminal, then sudo dhclient -r eth0 && sudo dhclient eth0 in another. Identify the four DORA packets. Note what IP, gateway, and DNS servers were offered. Check the lease expiry time in /var/lib/dhcp/dhclient.leases."
    }
  },

  {
    "id": 28,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "IPv6: The Modern Addressing Standard",
    "type": "lesson",
    "content": {
      "body": "IPv4's 4.3 billion addresses were exhausted in 2011. IPv6 was designed to solve this permanently — with 340 undecillion addresses (3.4 × 10³⁸), it will never run out.\n\n## IPv6 Address Format\n\nIPv6 addresses are 128 bits, written as eight groups of four hexadecimal digits separated by colons:\n2001:0db8:0000:0000:0000:0000:0000:0001\n\nTwo shortening rules:\n1. Leading zeros in each group can be omitted: 2001:db8:0:0:0:0:0:1\n2. One consecutive run of all-zero groups can be replaced with ::: 2001:db8::1\n\n## Key Differences from IPv4\n\n**No NAT** — every device gets a globally unique public address. NAT was a workaround for IPv4 scarcity; IPv6 eliminates the need for it.\n\n**No broadcast** — IPv6 uses multicast instead. This reduces unnecessary traffic.\n\n**SLAAC** — Stateless Address Autoconfiguration. Devices can configure their own IPv6 address without DHCP, using the router's prefix advertisement and their own MAC address.\n\n**Mandatory IPsec support** — IPv6 was designed with security in mind.\n\n**Larger headers** — IPv6 headers are simpler but larger (40 bytes vs 20 bytes for IPv4).\n\n## Common IPv6 Addresses\n\n- **::1** — loopback (equivalent to 127.0.0.1)\n- **fe80::/10** — link-local addresses (auto-configured, not routed)\n- **2001:db8::/32** — documentation/examples (like 192.168.x.x for IPv4)\n- **::/0** — default route (equivalent to 0.0.0.0/0)",
      "diagram": "flowchart TD\n    A[\"IPv4 Problems\"] --> B[\"4.3B addresses\nexhausted 2011\"]\n    A --> C[\"NAT complexity\"]\n    A --> D[\"No end-to-end\nconnectivity\"]\n    E[\"IPv6 Solutions\"] --> F[\"340 undecillion\naddresses\"]\n    E --> G[\"No NAT needed\nglobal addresses\"]\n    E --> H[\"SLAAC\nauto-configuration\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "IPv6 solves IPv4's address exhaustion and NAT complexity with a vastly larger address space",
      "code": "# IPv6 diagnostics\n\n# View IPv6 addresses:\nip -6 addr show\n# inet6 ::1/128 scope host (loopback)\n# inet6 fe80::1/64 scope link (link-local, auto-configured)\n# inet6 2001:db8::50/64 scope global (public IPv6)\n\n# Ping IPv6 (use ping6 or ping -6):\nping6 -c 4 ::1              # loopback\nping6 -c 4 2001:4860:4860::8888  # Google IPv6 DNS\n\n# Check IPv6 routing table:\nip -6 route show\n# ::1 dev lo (loopback)\n# fe80::/64 dev eth0 (link-local)\n# default via 2001:db8::1 (IPv6 default route)\n\n# Test if a site supports IPv6:\ndig AAAA google.com\n# google.com. 300 IN AAAA 2607:f8b0:4004:c09::64\n\n# curl over IPv6:\ncurl -6 https://ipv6.google.com\n\n# Check your public IPv6 address:\ncurl -6 ifconfig.me\n\n# Expand a compressed IPv6 address:\n# python3\n# import ipaddress\n# ipaddress.ip_address('2001:db8::1').exploded\n# '2001:0db8:0000:0000:0000:0000:0000:0001'",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Link-local addresses (fe80::/10) are automatically configured on every IPv6 interface — they do not require DHCP or manual configuration. They are only valid on the local link (not routed). You will always see a fe80:: address on any IPv6-enabled interface. They are used for neighbour discovery and router advertisements."
      },
      "keyPoints": [
        "IPv6 is 128 bits — 340 undecillion addresses, will never be exhausted",
        "Written as eight hex groups: 2001:db8::1 (:: replaces consecutive zero groups)",
        "No NAT — every device gets a globally unique public address",
        "SLAAC: devices auto-configure IPv6 addresses from router prefix + MAC address",
        "fe80::/10 link-local addresses are auto-configured on every IPv6 interface"
      ],
      "tryIt": "Run ip -6 addr show and identify your link-local (fe80::) address. Run ping6 ::1 to test IPv6 loopback. Run dig AAAA google.com to check if Google has an IPv6 address. Run curl -6 ifconfig.me to see your public IPv6 address (if your ISP supports IPv6). If no IPv6 is available, set up a tunnel via Hurricane Electric (tunnelbroker.net)."
    }
  },


  {
    "id": 29,
    "moduleId": 3,
    "moduleTitle": "IP Addressing, IPv4, IPv6 & Subnetting",
    "title": "Module 3 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered the addressing system that makes global routing possible. IP addressing is the foundation of everything that follows — routing, NAT, firewalls, DNS, and cloud networking all depend on understanding addresses and subnets.\n\n## What You Learned\n\n**IPv4 structure** — 32-bit addresses in dotted decimal. Network and host portions split by the subnet mask. Network address and broadcast not assignable.\n\n**Public vs private** — RFC 1918 private ranges (10/8, 172.16/12, 192.168/16) are not routed on the internet. NAT translates private to public at the router. 169.254.x.x means DHCP failed.\n\n**CIDR notation** — /prefix-length specifies how many bits are the network portion. Hosts = 2^(host bits) - 2. ipcalc verifies calculations instantly.\n\n**Subnetting** — divide a network into smaller subnets for security, performance, and organisation. Block size = 256 - last mask octet.\n\n**VLSM** — different subnets can have different prefix lengths. Allocate largest first. Used in every cloud VPC design.\n\n**DHCP** — DORA handshake assigns IP, gateway, DNS automatically. 169.254.x.x means DHCP failed.\n\n**IPv6** — 128-bit addresses, 340 undecillion total. No NAT. SLAAC auto-configuration. fe80:: link-local always present.\n\n## What Is Coming Next\n\nModule 4 covers MAC addresses, ARP, and Layer 2 communication — how devices find each other on the same network segment.",
      "diagram": "flowchart TD\n    A[\"✅ IPv4 structure\n32-bit network/host\"] --> B[\"✅ Public vs private\nRFC 1918 NAT\"]\n    B --> C[\"✅ CIDR subnetting\nprefix host calculation\"]\n    C --> D[\"✅ VLSM\nvariable length subnets\"]\n    D --> E[\"✅ DHCP\nDORA auto-configuration\"]\n    E --> F[\"✅ IPv6\n128-bit no NAT SLAAC\"]\n    F --> G[\"➡️ MAC and ARP\nModule 4\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 3 complete — IP addressing from IPv4 basics to IPv6 and subnetting",
      "code": "# Module 3 command reference\n\n# View IP address and subnet:\nip addr show\n\n# Calculate subnet details:\nipcalc 192.168.1.0/24\nipcalc 10.0.0.0/26\n\n# Your public IP:\ncurl -s ifconfig.me\n\n# DHCP release and renew:\nsudo dhclient -r eth0 && sudo dhclient eth0\n\n# Check for APIPA (DHCP failure):\nip addr show | grep '169.254'\n\n# IPv6 addresses:\nip -6 addr show\n\n# Test IPv6 connectivity:\nping6 -c 4 2001:4860:4860::8888\n\n# Check if a domain has IPv6:\ndig AAAA google.com\n\n# Subnet math quick reference:\n# /24 = 254 hosts\n# /25 = 126 hosts\n# /26 = 62 hosts\n# /27 = 30 hosts\n# /28 = 14 hosts\n# /30 = 2 hosts",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Subnetting is a skill that improves with practice. Do not just read about it — open ipcalc and work through subnet calculations until they feel automatic. Design a subnet scheme for a small network from scratch: pick a /24, divide it into subnets for servers, workstations, WiFi, and a DMZ using VLSM. This is exactly what you will do in real network design."
      },
      "keyPoints": [
        "IPv4: 32-bit, 4.3B addresses, exhausted — private ranges extend its life via NAT",
        "CIDR /prefix-length: hosts = 2^(32-prefix) - 2, block size = 256 - last mask octet",
        "VLSM: different prefix lengths per subnet, allocate largest first",
        "DHCP DORA assigns full network config automatically — 169.254.x.x means it failed",
        "IPv6: 128-bit, no NAT, SLAAC auto-config, fe80:: link-local always present"
      ],
      "tryIt": "Design a complete IP addressing scheme for a small office: 10.0.0.0/22 total space, divided into subnets for servers (30 hosts), workstations (100 hosts), WiFi (50 hosts), DMZ (14 hosts), and two router links (2 hosts each). Use VLSM, allocate largest first, verify with ipcalc, and confirm no overlaps."
    }
  },

  // =========================
  // Networking Module 4: MAC Addresses, ARP & Local Network Communication
  // =========================

  {
    "id": 30,
    "moduleId": 4,
    "moduleTitle": "MAC Addresses, ARP & Local Network Communication",
    "title": "Welcome to Layer 2 — MAC Addresses and ARP",
    "type": "lesson",
    "content": {
      "body": "IP addresses tell routers where to send packets globally. But on the local network segment, delivery is handled by Layer 2 — using MAC addresses and ARP. This module explains how devices find each other on the same network, how Ethernet frames are structured, and how switches use MAC tables to forward traffic efficiently.\n\n## What This Module Covers\n\n- MAC addresses — what they are, how they are structured, and how they differ from IP addresses\n- ARP — how a device resolves an IP address to a MAC address on the local segment\n- Ethernet frame structure — the headers that wrap every IP packet on a wired network\n- Switches and MAC tables — how switches learn which device is on which port\n- VLANs — how to segment a physical switch into multiple isolated logical networks\n\n## The Key Insight of This Module\n\nFrames are hop-to-hop. Packets are end-to-end. When you send a packet to a server on the other side of the internet, the destination IP never changes — but the destination MAC address changes at every single router hop. Understanding this distinction is what separates engineers who truly understand networking from those who only know the surface.",
      "diagram": "flowchart TD\n    A[\"Module 4\"] --> B[\"MAC addresses\n48-bit hardware ID\"]\n    A --> C[\"ARP\nIP to MAC resolution\"]\n    A --> D[\"Ethernet frames\nL2 structure\"]\n    A --> E[\"Switches\nMAC tables forwarding\"]\n    A --> F[\"VLANs\nlogical segmentation\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Module 4 covers Layer 2 — the local delivery layer that operates beneath IP",
      "code": "# Layer 2 quick reference\n\n# Your MAC address:\nip link show eth0 | grep 'link/ether'\n\n# ARP cache — IP to MAC mappings:\nip neigh show\n\n# Capture ARP traffic:\nsudo tcpdump -i eth0 -n arp\n\n# Capture Ethernet frames with headers:\nsudo tcpdump -i eth0 -e -n -c 5\n\n# Check MTU:\nip link show eth0 | grep mtu",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The key distinction to keep in mind throughout this module: MAC addresses are Layer 2 (local segment only, hardware-based), IP addresses are Layer 3 (global, logical). Switches use MAC addresses. Routers use IP addresses. A Layer 3 switch does both."
      },
      "keyPoints": [
        "MAC addresses are 48-bit hardware identifiers — Layer 2, local segment only",
        "ARP resolves IP addresses to MAC addresses — broadcast request, unicast reply",
        "Ethernet frames wrap IP packets with source/destination MACs and an FCS checksum",
        "Switches forward frames using MAC tables — they learn which MAC is on which port",
        "VLANs create isolated broadcast domains on a single physical switch"
      ],
      "tryIt": "Run ip neigh show to see your ARP cache. Run sudo tcpdump -i eth0 -e -n -c 10 and examine the Ethernet headers — note the source and destination MAC addresses. Confirm the destination MAC of outgoing packets is your router's MAC, not the final destination's MAC."
    }
  },


  {
    "id": 31,
    "moduleId": 4,
    "moduleTitle": "MAC Addresses, ARP & Local Network Communication",
    "title": "MAC Addresses: Layer 2 Identity",
    "type": "lesson",
    "content": {
      "body": "Every network interface — wired or wireless — has a MAC address (Media Access Control address). It is the Layer 2 identifier that enables local delivery on the same network segment. While IP addresses are logical and can change, MAC addresses are burned into the hardware at manufacture.\n\n## MAC Address Format\n\nA MAC address is 48 bits (6 bytes), written as six pairs of hexadecimal digits: aa:bb:cc:dd:ee:ff\n\nThe first three bytes (OUI — Organizationally Unique Identifier) identify the manufacturer. The last three bytes are assigned by the manufacturer to uniquely identify the device.\n\n- aa:bb:cc = OUI (e.g. 00:1A:2B = Cisco, 00:50:56 = VMware)\n- dd:ee:ff = device-specific identifier\n\n## MAC vs IP\n\n| | MAC | IP |\n|---|---|---|\n| Layer | 2 (Data Link) | 3 (Network) |\n| Scope | Local segment only | Global |\n| Assignment | Hardware (permanent) | Configuration (changeable) |\n| Format | 48-bit hex | 32-bit (IPv4) or 128-bit (IPv6) |\n| Used by | Switches | Routers |\n\n## Special MAC Addresses\n\n- **ff:ff:ff:ff:ff:ff** — broadcast, sent to all devices on the segment\n- **01:xx:xx:xx:xx:xx** — multicast (first bit of first byte = 1)\n- **00:xx:xx:xx:xx:xx** — unicast (first bit = 0)",
      "diagram": "flowchart TD\n    A[\"MAC Address\naa:bb:cc:dd:ee:ff\"] --> B[\"OUI: aa:bb:cc\nManufacturer ID\"]\n    A --> C[\"Device: dd:ee:ff\nUnique identifier\"]\n    D[\"MAC vs IP\"] --> E[\"MAC: Layer 2\nlocal segment\nhardware\"]\n    D --> F[\"IP: Layer 3\nglobal routing\nconfigurable\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "MAC addresses identify hardware at Layer 2; IP addresses identify logical endpoints at Layer 3",
      "code": "# MAC address commands\n\n# View your MAC address (Linux):\nip link show eth0\n# link/ether aa:bb:cc:dd:ee:ff brd ff:ff:ff:ff:ff:ff\n\n# View all interfaces and MACs:\nip link show\n\n# macOS:\nifconfig en0 | grep ether\n# ether aa:bb:cc:dd:ee:ff\n\n# Windows:\n# ipconfig /all | findstr 'Physical'\n\n# Look up MAC vendor (OUI):\n# First 3 bytes identify the manufacturer\n# Online: https://macvendors.com\n# Or: sudo apt install arp-scan\nsudo arp-scan --localnet | head -10\n# 192.168.1.1  aa:bb:cc:dd:ee:ff  Cisco Systems\n# 192.168.1.5  11:22:33:44:55:66  Apple Inc\n\n# MAC address spoofing (change your MAC):\nsudo ip link set eth0 down\nsudo ip link set eth0 address 02:00:00:00:00:01\nsudo ip link set eth0 up\n# Note: 02:xx = locally administered (not manufacturer assigned)\n\n# Restore original MAC:\nsudo ip link set eth0 down\nsudo ip link set eth0 address aa:bb:cc:dd:ee:ff\nsudo ip link set eth0 up",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "MAC addresses are supposed to be globally unique and permanent, but they can be changed in software — this is called MAC spoofing. It is used legitimately for privacy (iOS and Android randomise MAC addresses on WiFi) and maliciously to bypass MAC-based access controls. Never rely on MAC addresses alone for security."
      },
      "keyPoints": [
        "MAC addresses are 48-bit hardware identifiers — first 3 bytes are the manufacturer OUI",
        "MAC addresses are Layer 2 (local segment only); IP addresses are Layer 3 (global)",
        "ff:ff:ff:ff:ff:ff is the broadcast MAC — sent to all devices on the segment",
        "Switches use MAC addresses to forward frames; routers use IP addresses to route packets",
        "MAC addresses can be changed in software (spoofing) — never rely on them for security"
      ],
      "tryIt": "Run ip link show and find your MAC address. Look up the OUI (first 3 bytes) at macvendors.com to identify the manufacturer. Run sudo arp-scan --localnet to discover all devices on your LAN with their MAC addresses and manufacturers. Identify which devices are phones, laptops, and network equipment."
    }
  },

  {
    "id": 32,
    "moduleId": 4,
    "moduleTitle": "MAC Addresses, ARP & Local Network Communication",
    "title": "ARP: Address Resolution Protocol",
    "type": "lesson",
    "content": {
      "body": "IP knows where to send a packet globally, but to actually deliver it on the local network, it needs the destination's MAC address. ARP (Address Resolution Protocol) bridges this gap — it resolves an IP address to a MAC address on the local segment.\n\n## How ARP Works\n\n1. Device A wants to send a packet to 192.168.1.20\n2. A checks its ARP cache — is there already a MAC for 192.168.1.20?\n3. If not, A broadcasts an ARP request: Who has 192.168.1.20? Tell 192.168.1.5\n4. Every device on the segment receives the broadcast\n5. Device B (192.168.1.20) replies: 192.168.1.20 is at aa:bb:cc:dd:ee:ff\n6. A caches the result and sends the packet\n\n## ARP Cache\n\nARP results are cached to avoid broadcasting for every packet. Entries expire after a few minutes (typically 20 minutes on Linux). The cache is stored in memory — it is lost on reboot.\n\n## Gratuitous ARP\n\nA device can send an unsolicited ARP reply announcing its own IP-to-MAC mapping. Used when an interface comes up, when an IP address changes, or by load balancers during failover.\n\n## ARP and Routing\n\nARP only works on the local segment. When sending to a remote IP, the device ARPs for the **router's** MAC address, not the destination's. The router then handles forwarding the packet toward the destination.",
      "diagram": "flowchart LR\n    A[\"Device A\n192.168.1.5\"] -->|\"ARP broadcast\nWho has .20?\"|B[\"All devices\"]\n    B -->|\"ARP reply\n.20 is at MAC\"|A\n    A -->|\"Frame to MAC\npacket delivered\"|C[\"Device B\n192.168.1.20\"]\n    A -.- D[\"ARP Cache\n.20 → aa:bb:cc\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "ARP broadcasts to find the MAC for an IP — the result is cached to avoid repeated broadcasts",
      "code": "# ARP commands\n\n# View ARP cache:\narp -n\n# Address          HWtype  HWaddress           Flags Iface\n# 192.168.1.1      ether   aa:bb:cc:dd:ee:ff   C     eth0\n# 192.168.1.20     ether   11:22:33:44:55:66   C     eth0\n\n# Modern equivalent:\nip neigh show\n# 192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE\n# 192.168.1.20 dev eth0 lladdr 11:22:33:44:55:66 STALE\n\n# Force ARP resolution (ping to populate cache):\nping -c 1 192.168.1.20\narp -n | grep 192.168.1.20\n\n# Delete an ARP entry:\nsudo arp -d 192.168.1.20\n# or:\nsudo ip neigh del 192.168.1.20 dev eth0\n\n# Capture ARP traffic:\nsudo tcpdump -i eth0 -n arp\n# ARP, Request who-has 192.168.1.20 tell 192.168.1.5\n# ARP, Reply 192.168.1.20 is-at aa:bb:cc:dd:ee:ff\n\n# Send a gratuitous ARP (announce your own IP):\n# sudo arping -A -I eth0 192.168.1.5\n# Useful after IP change or failover",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "ARP has no authentication — any device can reply to an ARP request claiming any IP address. ARP spoofing (or ARP poisoning) exploits this: an attacker sends fake ARP replies to redirect traffic through their machine. This is a classic man-in-the-middle attack on local networks. Defence: Dynamic ARP Inspection (DAI) on managed switches, or use IPv6 with SEND (Secure Neighbour Discovery)."
      },
      "keyPoints": [
        "ARP resolves IP addresses to MAC addresses on the local segment",
        "ARP request is broadcast; ARP reply is unicast back to the requester",
        "ARP cache stores results to avoid repeated broadcasts — entries expire after ~20 minutes",
        "For remote destinations, ARP resolves the router's MAC, not the destination's",
        "ARP has no authentication — ARP spoofing is a common LAN attack"
      ],
      "tryIt": "Run ip neigh show to see your ARP cache. Delete an entry with sudo ip neigh del <ip> dev eth0, then ping that IP and watch the ARP cache repopulate. Run sudo tcpdump -i eth0 -n arp in one terminal while pinging a new host in another — capture the ARP request and reply."
    }
  },

  {
    "id": 33,
    "moduleId": 4,
    "moduleTitle": "MAC Addresses, ARP & Local Network Communication",
    "title": "Ethernet Frame Structure",
    "type": "lesson",
    "content": {
      "body": "Every packet that travels on an Ethernet network is wrapped in an Ethernet frame. Understanding the frame structure explains how Layer 2 works, why MAC addresses matter, and how switches make forwarding decisions.\n\n## Ethernet II Frame Structure\n\n- **Preamble (8 bytes)** — alternating 1s and 0s that synchronise the receiver's clock. The last byte signals the start of the frame.\n- **Destination MAC (6 bytes)** — the MAC address of the next hop.\n- **Source MAC (6 bytes)** — the MAC address of the sending interface.\n- **EtherType (2 bytes)** — identifies the Layer 3 protocol: 0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6, 0x8100 = VLAN tagged.\n- **Payload (46–1500 bytes)** — the IP packet or ARP message. Minimum 46 bytes — padding added if smaller.\n- **FCS (4 bytes)** — Frame Check Sequence. CRC checksum for error detection. Frames with FCS errors are silently discarded.\n\n## MTU — Maximum Transmission Unit\n\nThe maximum payload is 1500 bytes — the standard Ethernet MTU. Larger packets must be fragmented at Layer 3. Jumbo frames (up to 9000 bytes) are supported on some networks for better throughput on high-speed links.\n\n## Total Frame Size\n\nMinimum: 64 bytes (8 preamble + 14 header + 46 min payload + 4 FCS)\nMaximum: 1518 bytes (8 preamble + 14 header + 1500 payload + 4 FCS)",
      "diagram": "flowchart LR\n    A[\"Preamble\n8 bytes\nsync\"] --> B[\"Dest MAC\n6 bytes\"]\n    B --> C[\"Src MAC\n6 bytes\"]\n    C --> D[\"EtherType\n2 bytes\"]\n    D --> E[\"Payload\n46-1500 bytes\nIP packet\"]\n    E --> F[\"FCS\n4 bytes\nerror check\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Ethernet frame: preamble + MACs + EtherType + payload + FCS — 26 bytes of overhead per frame",
      "code": "# Examining Ethernet frames\n\n# Capture frames with Ethernet header (-e flag):\nsudo tcpdump -i eth0 -e -n -c 5\n# aa:bb:cc:dd:ee:ff > 11:22:33:44:55:66\n# ethertype IPv4 (0x0800), length 74\n# 192.168.1.5 > 8.8.8.8: ICMP echo request\n\n# Common EtherType values:\n# 0x0800 = IPv4\n# 0x0806 = ARP\n# 0x86DD = IPv6\n# 0x8100 = VLAN tagged (802.1Q)\n\n# Check MTU:\nip link show eth0 | grep mtu\n# mtu 1500\n\n# Test MTU with ping:\nping -c 1 -s 1472 -M do 8.8.8.8\n# -s 1472 + 28 byte IP/ICMP header = 1500 byte MTU\n# If this fails, path MTU is less than 1500\n\n# Check for FCS errors (physical layer problems):\nsudo ethtool -S eth0 | grep -i error\n# rx_crc_errors: 0  (FCS errors = cable/NIC problem)\n\n# See frame size distribution in Wireshark:\n# Statistics → Packet Lengths\n# Most frames should be near 1514 bytes (full MTU)\n# Many small frames = lots of ACKs or control traffic",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The 1500-byte MTU is a historical artefact from 10 Mbps Ethernet in the 1980s. At 10 Gbps, sending 1500-byte frames means the CPU handles millions of interrupts per second. Jumbo frames (9000 bytes) reduce CPU overhead by sending larger chunks — but every device on the path must support the same MTU, or fragmentation occurs."
      },
      "keyPoints": [
        "Ethernet frame: Preamble + Dest MAC + Src MAC + EtherType + Payload + FCS",
        "EtherType identifies the Layer 3 protocol: 0x0800=IPv4, 0x0806=ARP, 0x86DD=IPv6",
        "MTU is 1500 bytes — the maximum payload size for standard Ethernet",
        "FCS is a CRC checksum — frames with errors are silently discarded",
        "Jumbo frames (9000 bytes) reduce CPU overhead on high-speed links"
      ],
      "tryIt": "Run sudo tcpdump -i eth0 -e -n -c 20 and examine the Ethernet headers. Identify the EtherType for each frame — you should see 0x0800 (IPv4) and possibly 0x0806 (ARP). Note the frame lengths. Run ping -c 1 -s 1472 -M do 8.8.8.8 to test your path MTU."
    }
  },

  // =========================
  // Networking Module 5: Routing, Routers & Default Gateways
  // =========================

  {
    "id": 58,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Welcome to Routing",
    "type": "lesson",
    "content": {
      "body": "Routing is how packets travel from one network to another. Without routing, your home network could not reach the internet, and the internet itself could not exist. This module covers how routers work, what routing tables are, how default gateways function, and how the internet's routing protocols keep billions of devices connected.\n\n## What This Module Covers\n\n- Why routing is needed and what problem it solves\n- What a router does and how it differs from a switch\n- Default gateways — the exit point from your local network\n- Routing tables — how routers decide where to send packets\n- Static vs dynamic routing\n- Common routing protocols: RIP, OSPF, EIGRP, BGP\n- BGP — the protocol that holds the internet together\n\n## The Core Concept\n\nA switch connects devices on the same network. A router connects different networks. When a packet needs to leave your LAN, it goes to the default gateway — your router — which reads the destination IP and forwards the packet toward its destination, one hop at a time.",
      "diagram": "flowchart LR\n    A[\"Your device\n192.168.1.50\"] -->|\"to internet\"|B[\"Default Gateway\n192.168.1.1\"]\n    B -->|\"routing decision\"|C[\"ISP Router\"]\n    C -->|\"routing decision\"|D[\"Internet\"]\n    D -->|\"destination\"|E[\"8.8.8.8\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Packets leave your LAN via the default gateway and are routed hop by hop to the destination",
      "code": "# Routing quick reference\n\n# View your routing table:\nip route show\n# default via 192.168.1.1 dev eth0  (default gateway)\n# 192.168.1.0/24 dev eth0           (local subnet)\n\n# Your default gateway:\nip route show | grep default\n\n# Trace the routing path:\ntraceroute -n 8.8.8.8\n\n# Add a static route:\nsudo ip route add 10.0.2.0/24 via 192.168.1.254\n\n# Delete a route:\nsudo ip route del 10.0.2.0/24",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Run ip route show right now and find your default route. The IP after 'via' is your default gateway — the router that handles all traffic destined for networks not in your routing table. This is the most important entry in your routing table."
      },
      "keyPoints": [
        "Routing moves packets between different networks — switches only work within one network",
        "The default gateway is the router your device sends all non-local traffic to",
        "Routers read the destination IP and forward packets hop by hop toward the destination",
        "Routing tables map destination networks to next-hop addresses",
        "BGP is the protocol that routes traffic between organisations on the internet"
      ],
      "tryIt": "Run ip route show and identify your default gateway. Run traceroute -n 8.8.8.8 and count the hops. The first hop is your default gateway. Each subsequent hop is a router forwarding your packet one step closer to Google's DNS server."
    }
  },

  {
    "id": 59,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "How Routers Work",
    "type": "lesson",
    "content": {
      "body": "A router is a network device that forwards packets between different networks. It operates at Layer 3 (the Network layer) and makes forwarding decisions based on destination IP addresses. Understanding how a router processes a packet explains why the internet works the way it does.\n\n## What a Router Does\n\nWhen a packet arrives on a router interface, the router:\n1. Reads the destination IP address from the IP header\n2. Looks up the destination in its routing table\n3. Finds the best matching route (longest prefix match)\n4. Forwards the packet out the appropriate interface toward the next hop\n5. Decrements the TTL by 1 — if TTL reaches 0, discards the packet and sends ICMP Time Exceeded\n\n## Router vs Switch\n\n| | Switch | Router |\n|---|---|---|\n| Layer | 2 (Data Link) | 3 (Network) |\n| Addresses | MAC addresses | IP addresses |\n| Scope | Same network | Between networks |\n| Forwards | Frames | Packets |\n\n## Longest Prefix Match\n\nWhen multiple routes match a destination, the router picks the most specific one — the route with the longest prefix. A /28 route beats a /24 route beats a /0 (default) route. This is how routers can have both specific routes and a catch-all default route.",
      "diagram": "flowchart TD\n    A[\"Packet arrives\ndst: 8.8.8.8\"] --> B[\"Read destination IP\"]\n    B --> C[\"Look up routing table\"]\n    C --> D{\"Match found?\"}\n    D -->|\"yes\"|E[\"Forward to next hop\nDecrement TTL\"]\n    D -->|\"no\"|F[\"Use default route\"]\n    F --> E\n    E --> G[\"Packet leaves\nout correct interface\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Router packet processing: read destination IP, look up routing table, forward to next hop",
      "code": "# Router behaviour in practice\n\n# See your routing table (you are acting like a router):\nip route show\n# default via 192.168.1.1 dev eth0 proto dhcp\n# 192.168.1.0/24 dev eth0 proto kernel scope link\n\n# Longest prefix match example:\n# Destination: 192.168.1.50\n# Route 1: 192.168.0.0/16 via 10.0.0.1\n# Route 2: 192.168.1.0/24 via 10.0.0.2  ← wins (more specific)\n# Route 3: 0.0.0.0/0 via 10.0.0.3\n\n# Check which route a packet would take:\nip route get 8.8.8.8\n# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.50\n\nip route get 192.168.1.20\n# 192.168.1.20 dev eth0 src 192.168.1.50  (local — no router needed)\n\n# TTL in action:\nsudo tcpdump -i eth0 -n -v icmp\n# ttl 117 — packet started at 128, 11 hops away",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "ip route get <destination> is one of the most useful diagnostic commands in networking. It tells you exactly which route your system would use to reach a given IP — including the next hop and outgoing interface. Use it whenever you are unsure whether traffic is taking the expected path."
      },
      "keyPoints": [
        "Routers operate at Layer 3 — they read IP addresses, not MAC addresses",
        "Packet processing: read destination IP → look up routing table → forward to next hop → decrement TTL",
        "Longest prefix match: the most specific route wins (/28 beats /24 beats /0)",
        "ip route get <ip> shows exactly which route your system would use",
        "TTL decrements at each router hop — prevents packets from looping forever"
      ],
      "tryIt": "Run ip route get 8.8.8.8 and ip route get 192.168.1.1. Note the difference — the first goes via your gateway (routed), the second is direct (local). Then run ip route get for an IP in a completely different subnet and confirm it uses the default route."
    }
  },

  {
    "id": 60,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Routing Tables and Default Gateways",
    "type": "lesson",
    "content": {
      "body": "The routing table is the data structure a router uses to decide where to send each packet. Every device with an IP stack has a routing table — not just routers. Your laptop has one. Understanding routing tables is essential for diagnosing connectivity problems.\n\n## Routing Table Structure\n\nEach entry in a routing table has:\n- **Destination network** — the network this route applies to (e.g. 192.168.1.0/24)\n- **Next hop** — the IP address of the next router to send the packet to\n- **Interface** — which network interface to send the packet out\n- **Metric** — the cost of this route (lower is preferred when multiple routes match)\n\n## Types of Routes\n\n**Connected routes** — automatically added when an interface is configured with an IP. The device can reach that subnet directly.\n\n**Static routes** — manually configured by an administrator. Used for simple, predictable topologies.\n\n**Dynamic routes** — learned automatically from other routers via routing protocols (OSPF, BGP, etc.).\n\n**Default route** — 0.0.0.0/0 — matches everything. Used when no more specific route exists. Points to the default gateway.\n\n## The Default Gateway\n\nThe default gateway is the router your device sends all traffic to when it has no more specific route. For a home device, this is your router (192.168.1.1). For a router, this is the next router upstream toward the internet.",
      "diagram": "flowchart TD\n    A[\"Routing Table\"] --> B[\"192.168.1.0/24\ndirect — eth0\"]\n    A --> C[\"10.0.2.0/24\nvia 192.168.1.254\"]\n    A --> D[\"0.0.0.0/0\ndefault\nvia 192.168.1.1\"]\n    E[\"Packet to 8.8.8.8\"] -->|\"no specific match\"|D\n    F[\"Packet to 192.168.1.20\"] -->|\"direct match\"|B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Routing table entries: connected routes, static routes, and the default route (0.0.0.0/0)",
      "code": "# Routing table management\n\n# View full routing table:\nip route show\n# default via 192.168.1.1 dev eth0\n# 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50\n\n# Add a static route:\nsudo ip route add 10.0.2.0/24 via 192.168.1.254 dev eth0\n\n# Add a default route (default gateway):\nsudo ip route add default via 192.168.1.1\n\n# Delete a route:\nsudo ip route del 10.0.2.0/24\n\n# Delete default route (breaks internet — test only):\nsudo ip route del default\n# Restore:\nsudo ip route add default via 192.168.1.1\n\n# Persistent routes (survive reboot) — /etc/network/interfaces or netplan:\n# up ip route add 10.0.2.0/24 via 192.168.1.254\n\n# Check which route wins for a destination:\nip route get 10.0.2.5\n# 10.0.2.5 via 192.168.1.254 dev eth0",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Deleting your default route (sudo ip route del default) immediately breaks internet connectivity. This is a useful diagnostic technique — if connectivity is restored after re-adding the default route, the problem was a missing or incorrect default gateway. Always have console access before experimenting with routing tables on a remote server."
      },
      "keyPoints": [
        "Every IP device has a routing table — not just routers",
        "Route types: connected (automatic), static (manual), dynamic (learned), default (catch-all)",
        "Default route 0.0.0.0/0 matches all destinations — points to the default gateway",
        "Longest prefix match: most specific route wins",
        "ip route add/del manages routes; ip route get shows which route would be used"
      ],
      "tryIt": "Run ip route show and identify each route type: which are connected (kernel scope link), which is the default route, and whether any static routes exist. Delete the default route with sudo ip route del default, confirm internet is broken with ping 8.8.8.8, then restore it. This makes the default gateway concept concrete."
    }
  },

  {
    "id": 61,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Static vs Dynamic Routing",
    "type": "lesson",
    "content": {
      "body": "Routing tables can be populated in two ways: manually by an administrator (static routing) or automatically by routing protocols (dynamic routing). Each approach has trade-offs that determine when to use which.\n\n## Static Routing\n\nAn administrator manually adds routes to each router. Simple, predictable, and requires no routing protocol overhead. But it does not adapt to failures — if a link goes down, traffic does not automatically reroute.\n\nBest for: small networks, stub networks with one exit point, specific traffic engineering requirements.\n\n## Dynamic Routing\n\nRouters exchange routing information with each other using routing protocols. When the network topology changes (a link fails, a new network is added), routers automatically update their routing tables.\n\n## Interior vs Exterior Gateway Protocols\n\n**IGP (Interior Gateway Protocol)** — routes within a single organisation (Autonomous System):\n- **RIP** — simple distance-vector protocol, max 15 hops, slow convergence. Legacy.\n- **OSPF** — link-state protocol, fast convergence, scales well. Most common IGP.\n- **EIGRP** — Cisco proprietary, hybrid protocol, fast convergence.\n\n**EGP (Exterior Gateway Protocol)** — routes between organisations:\n- **BGP** — the only EGP in use. Routes between Autonomous Systems on the internet.\n\n## Convergence\n\nConvergence is the time it takes for all routers to agree on the network topology after a change. Fast convergence (OSPF: seconds) means brief outages. Slow convergence (RIP: minutes) means extended outages after failures.",
      "diagram": "flowchart TD\n    A[\"Routing\"] --> B[\"Static\nmanual admin\npredictable\"]\n    A --> C[\"Dynamic\nauto-learned\nadaptive\"]\n    C --> D[\"IGP\nwithin one org\"]\n    C --> E[\"EGP\nbetween orgs\"]\n    D --> F[\"OSPF\nlink-state fast\"]\n    D --> G[\"RIP\ndistance-vector legacy\"]\n    E --> H[\"BGP\ninternet routing\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Static routing is manual and predictable; dynamic routing adapts automatically using IGP or EGP protocols",
      "code": "# Static vs dynamic routing in practice\n\n# Static route — manually added:\nsudo ip route add 10.0.2.0/24 via 192.168.1.254\n# Survives until deleted or reboot\n\n# Check if a dynamic routing daemon is running:\nsystemctl status ospfd 2>/dev/null || echo 'OSPF not running'\nsystemctl status bgpd  2>/dev/null || echo 'BGP not running'\n\n# Install FRRouting (open source routing suite):\n# sudo apt install frr\n# Supports OSPF, BGP, RIP, IS-IS, and more\n\n# View OSPF neighbours (if running):\n# vtysh -c 'show ip ospf neighbor'\n\n# View BGP summary (if running):\n# vtysh -c 'show bgp summary'\n\n# Route source in routing table:\nip route show\n# proto kernel = connected (automatic)\n# proto static = manually added\n# proto ospf   = learned via OSPF\n# proto bgp    = learned via BGP",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "OSPF is the most important routing protocol to understand for enterprise networking. It uses Dijkstra's shortest path algorithm to calculate the best route to every destination. When a link fails, OSPF reconverges in seconds. FRRouting (frr) is a free, open-source implementation you can run on any Linux machine to experiment with OSPF and BGP."
      },
      "keyPoints": [
        "Static routing: manually configured, predictable, no failover — best for small/simple networks",
        "Dynamic routing: automatically learned, adapts to failures — required for large networks",
        "IGP routes within one organisation: OSPF (most common), RIP (legacy), EIGRP (Cisco)",
        "EGP routes between organisations: BGP is the only EGP in use on the internet",
        "Convergence time: how fast routers agree after a topology change — OSPF seconds, RIP minutes"
      ],
      "tryIt": "Install FRRouting (sudo apt install frr) on a Linux VM. Enable OSPF in /etc/frr/daemons and configure a basic OSPF area. Run vtysh -c 'show ip ospf neighbor' to see OSPF adjacencies. This gives you hands-on experience with dynamic routing without needing physical routers."
    }
  },


  {
    "id": 62,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "OSPF: Link-State Routing",
    "type": "lesson",
    "content": {
      "body": "OSPF (Open Shortest Path First) is the most widely used interior gateway protocol in enterprise networks. Unlike RIP which counts hops, OSPF builds a complete map of the network and calculates the shortest path to every destination using Dijkstra's algorithm.\n\n## How OSPF Works\n\n1. **Hello packets** — OSPF routers send hello packets to discover neighbours. Routers that agree on hello/dead timers and are on the same subnet become neighbours.\n2. **Adjacency** — neighbours exchange their link-state databases (LSDB) to build a complete topology map.\n3. **SPF calculation** — each router runs Dijkstra's algorithm on its LSDB to calculate the shortest path tree to every destination.\n4. **Route installation** — best paths are installed in the routing table.\n\n## OSPF Areas\n\nLarge OSPF networks are divided into areas to limit the scope of topology updates. Area 0 (the backbone area) connects all other areas. All inter-area traffic must pass through Area 0.\n\n## OSPF Cost\n\nOSPF uses cost as its metric — lower cost is preferred. Cost is calculated as 100 Mbps / interface bandwidth. A 1 Gbps link has cost 1. A 100 Mbps link has cost 1. A 10 Mbps link has cost 10. You can manually set cost to influence path selection.\n\n## Fast Convergence\n\nOSPF converges in seconds after a topology change. When a link fails, the router floods a Link State Update to all OSPF routers, which recalculate their SPF trees immediately.",
      "diagram": "flowchart TD\n    A[\"Router A\"] -->|\"Hello\"|B[\"Router B\"]\n    B -->|\"Hello\"|A\n    A <-->|\"LSDB exchange\"|B\n    A --> C[\"SPF calculation\nDijkstra\"]\n    C --> D[\"Routing table\nbest paths installed\"]\n    E[\"Link fails\"] --> F[\"LSU flooded\"]\n    F --> G[\"All routers\nrecalculate SPF\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "OSPF: hello → adjacency → LSDB exchange → SPF calculation → routing table",
      "code": "# OSPF with FRRouting\n\n# Install FRRouting:\nsudo apt install frr\n\n# Enable OSPF daemon:\nsudo sed -i 's/ospfd=no/ospfd=yes/' /etc/frr/daemons\nsudo systemctl restart frr\n\n# Configure OSPF (vtysh):\nsudo vtysh\n# conf t\n# router ospf\n#   network 192.168.1.0/24 area 0\n#   network 10.0.0.0/8 area 0\n# end\n# write\n\n# View OSPF status:\nsudo vtysh -c 'show ip ospf'\nsudo vtysh -c 'show ip ospf neighbor'\nsudo vtysh -c 'show ip ospf database'\nsudo vtysh -c 'show ip route ospf'\n\n# OSPF cost on an interface:\n# interface eth0\n#   ip ospf cost 10",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "OSPF is the routing protocol you are most likely to encounter in enterprise environments. Understanding it deeply — hello packets, adjacency, LSDB, SPF — makes you significantly more effective at diagnosing routing problems. FRRouting lets you run OSPF on any Linux VM for free, making it easy to experiment."
      },
      "keyPoints": [
        "OSPF builds a complete topology map (LSDB) and runs Dijkstra's SPF algorithm",
        "Hello packets discover neighbours; adjacency forms when neighbours exchange LSDBs",
        "OSPF areas limit topology update scope — Area 0 is the backbone",
        "Cost metric: 100 Mbps / interface bandwidth — lower cost preferred",
        "OSPF converges in seconds — link failure triggers immediate LSU flood and SPF recalculation"
      ],
      "tryIt": "Install FRRouting on two Linux VMs connected on the same subnet. Enable OSPF on both and configure them in Area 0. Run show ip ospf neighbor to confirm adjacency forms. Add a loopback network on one router and verify it appears in the other router's routing table via OSPF."
    }
  },

  {
    "id": 63,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "BGP: How the Internet Routes Between Networks",
    "type": "lesson",
    "content": {
      "body": "BGP (Border Gateway Protocol) is the routing protocol that holds the internet together. While OSPF routes traffic within a single organisation, BGP routes traffic between organisations — between ISPs, between cloud providers, between continents.\n\n## Autonomous Systems\n\nThe internet is divided into Autonomous Systems (AS) — networks under a single administrative control. Each AS has a unique AS number (ASN). Your ISP is an AS. Google is AS15169. AWS is AS16509. BGP routes between ASes.\n\n## How BGP Works\n\nBGP is a path vector protocol. Each BGP router advertises the IP prefixes it can reach and the AS path to get there. Neighbours (called peers) exchange these advertisements and use them to build a routing table.\n\n## eBGP vs iBGP\n\n**eBGP** — runs between routers in different ASes. How ISPs exchange routes.\n**iBGP** — runs between routers within the same AS. Distributes external routes internally.\n\n## BGP is Policy-Driven\n\nUnlike OSPF which always picks the shortest path, BGP allows policy-based routing. An ISP can prefer one path over another for business reasons — traffic engineering, cost, peering agreements. This is why internet traffic sometimes takes unexpected paths.\n\n## BGP Failures\n\nBGP misconfigurations have caused major internet outages. Facebook's 2021 outage was caused by a BGP misconfiguration that withdrew all of Facebook's prefixes from the internet. Cloudflare's 2019 outage was caused by a BGP route leak from a small ISP.",
      "diagram": "flowchart LR\n    A[\"AS 64500\nYour ISP\"] -->|\"eBGP\"|B[\"AS 15169\nGoogle\"]\n    A -->|\"eBGP\"|C[\"AS 16509\nAWS\"]\n    B -->|\"eBGP\"|C\n    D[\"AS 64501\nYour Company\"] -->|\"eBGP upstream\"|A\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "BGP connects Autonomous Systems — each AS advertises its prefixes to BGP peers",
      "code": "# BGP — observing from the outside\n\n# Trace AS path to a destination (-A shows AS numbers):\ntraceroute -A 8.8.8.8\n# 1  192.168.1.1 [*]\n# 2  10.0.0.1 [AS12345]   (your ISP)\n# 3  72.14.232.1 [AS15169] (Google)\n\n# Look up an AS number:\nwhois AS15169\n# or: https://bgp.he.net/AS15169\n\n# Check BGP routing for a prefix:\n# https://bgp.he.net/ip/8.8.8.8\n# Shows: owning AS, all paths, route history\n\n# BGP looking glass (see BGP from an ISP):\n# https://lg.he.net/\n# show bgp 8.8.8.8\n\n# BGP route example:\n# Network:  8.8.8.0/24\n# AS Path:  12345 15169\n# Next Hop: 72.14.232.1\n\n# BGP hijacking (what to watch for):\n# Normal:  8.8.8.0/24 owned by AS15169 (Google)\n# Hijack:  8.8.8.0/24 advertised by AS99999 (attacker)\n# Result:  traffic for Google goes to attacker",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "BGP has no built-in authentication for route advertisements — any AS can advertise any prefix. BGP hijacking exploits this: an attacker advertises a more specific prefix for a victim's IP range, attracting traffic to themselves. RPKI (Resource Public Key Infrastructure) is the modern solution — it cryptographically validates that an AS is authorised to advertise a prefix."
      },
      "keyPoints": [
        "BGP routes between Autonomous Systems — the only EGP in use on the internet",
        "Each AS has a unique ASN — your ISP, Google, AWS are all separate ASes",
        "BGP is path vector — advertises prefixes with the AS path to reach them",
        "eBGP: between different ASes; iBGP: within the same AS",
        "BGP is policy-driven — business decisions influence routing, not just shortest path"
      ],
      "tryIt": "Run traceroute -A 8.8.8.8 and identify the AS numbers at each hop. Look up the AS numbers at bgp.he.net to identify which organisations own each hop. Visit bgp.he.net/ip/8.8.8.8 to see the full BGP routing table entry for Google's DNS server."
    }
  },

  {
    "id": 64,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Packet Flow: End to End",
    "type": "lesson",
    "content": {
      "body": "Tracing a packet from your browser to a web server and back makes every routing concept concrete. This walkthrough follows a single HTTP request through every routing decision from source to destination.\n\n## The Scenario\n\nYour laptop (192.168.1.50) requests https://example.com (93.184.216.34).\n\n## Step by Step\n\n1. **DNS resolution** — your laptop queries DNS to resolve example.com to 93.184.216.34\n2. **Routing decision** — your laptop checks its routing table. 93.184.216.34 is not on the local subnet, so it uses the default route: send to 192.168.1.1 (your router)\n3. **ARP** — your laptop ARPs for 192.168.1.1's MAC address to build the Ethernet frame\n4. **Frame sent** — packet wrapped in Ethernet frame, sent to router's MAC\n5. **Router receives** — router strips the Ethernet frame, reads destination IP 93.184.216.34\n6. **Router routing decision** — router checks its table, forwards to ISP next hop\n7. **Hop by hop** — each router along the path makes the same decision: read destination IP, look up table, forward\n8. **Destination reached** — packet arrives at example.com's server\n9. **Reply** — server sends reply back, following the reverse path\n\n## What Changes at Each Hop\n\n- **MAC addresses change** at every hop (Layer 2 is hop-to-hop)\n- **IP addresses never change** in transit (Layer 3 is end-to-end)\n- **TTL decrements** by 1 at each router",
      "diagram": "flowchart LR\n    A[\"Laptop\n192.168.1.50\"] -->|\"dst MAC: router\"|B[\"Home Router\n192.168.1.1\"]\n    B -->|\"dst MAC: ISP router\"|C[\"ISP Router\"]\n    C -->|\"dst MAC: next hop\"|D[\"Internet...\"]\n    D -->|\"dst MAC: server\"|E[\"example.com\n93.184.216.34\"]\n    A -.- F[\"dst IP: 93.184.216.34\nnever changes\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "MAC addresses change at every hop; destination IP stays the same end-to-end",
      "code": "# Trace a packet end to end\n\n# Step 1: DNS resolution\ndig +short example.com\n# 93.184.216.34\n\n# Step 2: Check routing decision\nip route get 93.184.216.34\n# 93.184.216.34 via 192.168.1.1 dev eth0 src 192.168.1.50\n# → uses default gateway 192.168.1.1\n\n# Step 3: ARP for gateway MAC\narp -n | grep 192.168.1.1\n# 192.168.1.1  ether  aa:bb:cc:dd:ee:ff\n\n# Step 4: Trace the full path\ntraceroute -n 93.184.216.34\n# 1  192.168.1.1   0.5ms   (home router)\n# 2  10.x.x.x      5ms    (ISP)\n# 3  ...\n# 11 93.184.216.34 12ms   (destination)\n\n# Step 5: Capture the packet flow\nsudo tcpdump -i eth0 -n host 93.184.216.34\n# See: ARP, TCP SYN, SYN-ACK, ACK, HTTP data",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Run all five commands above while making a request to example.com. This gives you a complete picture of the routing process: DNS resolution, routing decision, ARP, hop-by-hop path, and the actual packet exchange. Doing this once makes the entire routing module click into place."
      },
      "keyPoints": [
        "Every packet follows: DNS → routing decision → ARP → frame → hop-by-hop routing → destination",
        "Destination IP never changes in transit — it is the end-to-end identifier",
        "Destination MAC changes at every hop — it always points to the next router",
        "ip route get shows the routing decision your system would make for any destination",
        "traceroute reveals every router hop between you and the destination"
      ],
      "tryIt": "Run all five commands above while making a request to example.com. For each command, note what layer it operates at and what it reveals about the packet's journey. Then repeat for a destination on your local network (e.g. your router) and compare — note that ip route get shows a direct route with no gateway."
    }
  },

  {
    "id": 65,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Common Routing Problems and Fixes",
    "type": "lesson",
    "content": {
      "body": "Most routing problems fall into a small number of categories. Knowing the patterns lets you diagnose and fix them quickly without guessing.\n\n## Problem 1: No Default Route\n\nSymptom: can ping local devices but cannot reach the internet.\nDiagnosis: ip route show — no default route entry.\nFix: sudo ip route add default via <gateway-ip>\n\n## Problem 2: Wrong Default Gateway\n\nSymptom: can ping the gateway but cannot reach the internet.\nDiagnosis: ip route show — default route points to wrong IP.\nFix: delete wrong route, add correct one.\n\n## Problem 3: Missing Route to a Subnet\n\nSymptom: can reach some networks but not others.\nDiagnosis: ip route get <destination> — shows wrong next hop or no route.\nFix: add the missing static route.\n\n## Problem 4: Asymmetric Routing\n\nSymptom: ping requests arrive but no replies return. tcpdump shows requests on destination but no replies on source.\nDiagnosis: routing table on destination has no route back to source.\nFix: add return route on destination.\n\n## Problem 5: Routing Loop\n\nSymptom: traceroute shows the same hops repeating. Packets never arrive.\nDiagnosis: two routers each think the other is the next hop for the same destination.\nFix: correct the routing tables to eliminate the loop. TTL prevents infinite loops.",
      "diagram": "flowchart TD\n    A[\"Cannot reach internet\"] --> B{\"Can ping gateway?\"}\n    B -->|\"no\"|C[\"Check default route\nip route show\"]\n    B -->|\"yes\"|D{\"Can ping 8.8.8.8?\"}\n    D -->|\"no\"|E[\"Gateway routing problem\ncheck ISP/upstream\"]\n    D -->|\"yes\"|F[\"DNS problem\ncheck /etc/resolv.conf\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Routing problem decision tree — work through each layer systematically",
      "code": "# Routing problem diagnosis\n\n# Check 1: do we have a default route?\nip route show | grep default\n# If empty: no default route — add it\nsudo ip route add default via 192.168.1.1\n\n# Check 2: can we reach the gateway?\nping -c 2 192.168.1.1\n# Fail = Layer 2 problem or wrong gateway IP\n\n# Check 3: can we reach internet by IP?\nping -c 2 8.8.8.8\n# Fail = routing problem beyond gateway\n# Pass = DNS problem (not routing)\n\n# Check 4: asymmetric routing diagnosis\n# On source: ping -c 4 10.0.2.10\n# On destination: sudo tcpdump -i eth0 icmp\n# If requests arrive but no replies: missing return route\n# Fix on destination:\nsudo ip route add 192.168.1.0/24 via 10.0.2.1\n\n# Check 5: routing loop\ntraceroute -n 8.8.8.8\n# If same IPs repeat: routing loop\n# Check routing tables on both routers",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The fastest routing diagnostic: ping 8.8.8.8 (tests IP routing) then ping google.com (tests DNS). If 8.8.8.8 works but google.com fails, the problem is DNS not routing. If 8.8.8.8 fails, check your default route. This two-step test eliminates half the possible causes immediately."
      },
      "keyPoints": [
        "No default route: ip route show shows no default — add with ip route add default via <gw>",
        "Asymmetric routing: requests arrive but replies don't — missing return route on destination",
        "Routing loop: traceroute shows repeating hops — two routers pointing at each other",
        "ping 8.8.8.8 tests routing; ping google.com tests DNS — different problems, different fixes",
        "ip route get <ip> shows exactly which route would be used — fastest routing diagnostic"
      ],
      "tryIt": "Deliberately create each routing problem on a test VM and practice diagnosing it: delete the default route, add a route pointing to the wrong gateway, and set up asymmetric routing between two VMs. Time yourself diagnosing and fixing each one using only the commands above."
    }
  },

  {
    "id": 66,
    "moduleId": 5,
    "moduleTitle": "Routing, Routers & Default Gateways",
    "title": "Module 5 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered routing — how packets travel between networks. Routing is the mechanism that makes the internet possible, and understanding it deeply makes you significantly better at diagnosing connectivity problems.\n\n## What You Learned\n\n**How routers work** — read destination IP, look up routing table, forward to next hop, decrement TTL. Longest prefix match determines which route wins.\n\n**Routing tables** — connected routes (automatic), static routes (manual), dynamic routes (learned), default route (catch-all 0.0.0.0/0).\n\n**Default gateway** — the router your device sends all non-local traffic to. The most important entry in your routing table.\n\n**Static vs dynamic routing** — static is manual and predictable; dynamic adapts automatically using routing protocols.\n\n**OSPF** — link-state IGP, builds complete topology map, runs Dijkstra's SPF, converges in seconds.\n\n**BGP** — path vector EGP, routes between Autonomous Systems, policy-driven, holds the internet together.\n\n**Packet flow** — DNS → routing decision → ARP → frame → hop-by-hop → destination. IP never changes; MAC changes at every hop.\n\n## What Is Coming Next\n\nModule 6 covers NAT — how private IP addresses are translated to public IPs, enabling billions of devices to share a limited pool of public addresses.",
      "diagram": "flowchart TD\n    A[\"✅ How routers work\nL3 longest prefix match\"] --> B[\"✅ Routing tables\nconnected static dynamic default\"]\n    B --> C[\"✅ Static vs dynamic\nOSPF BGP\"]\n    C --> D[\"✅ Packet flow\nDNS ARP hop-by-hop\"]\n    D --> E[\"✅ Common problems\nno route asymmetric loop\"]\n    E --> F[\"➡️ NAT\nModule 6\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 5 complete — routing from basic packet forwarding to BGP and the internet",
      "code": "# Module 5 command reference\n\n# View routing table:\nip route show\n\n# Check which route a packet would take:\nip route get 8.8.8.8\nip route get 192.168.1.1\n\n# Add/delete routes:\nsudo ip route add 10.0.2.0/24 via 192.168.1.254\nsudo ip route del 10.0.2.0/24\nsudo ip route add default via 192.168.1.1\n\n# Trace routing path:\ntraceroute -n 8.8.8.8\ntraceroute -A 8.8.8.8  # show AS numbers\n\n# Quick routing diagnostic:\nping -c 2 192.168.1.1  # gateway reachable?\nping -c 2 8.8.8.8      # internet reachable?\nping -c 2 google.com   # DNS working?\n\n# BGP lookup:\n# https://bgp.he.net/ip/8.8.8.8",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The two most important routing commands to memorise: ip route show (see your routing table) and ip route get <ip> (see which route would be used for a specific destination). These two commands answer 80% of routing questions."
      },
      "keyPoints": [
        "Routers forward packets hop by hop using routing tables — longest prefix match wins",
        "Default route 0.0.0.0/0 is the catch-all — points to the default gateway",
        "OSPF is the standard enterprise IGP — link-state, fast convergence",
        "BGP routes between Autonomous Systems — the protocol that runs the internet",
        "IP never changes in transit; MAC changes at every hop"
      ],
      "tryIt": "Run the full Module 5 command reference above. For each command, note what it tells you about your network's routing. Then set up a two-VM lab: configure static routes between them, verify connectivity, then install FRRouting and replace the static routes with OSPF. Confirm the same connectivity works with dynamic routing."
    }
  },

  // =========================
  // Networking Module 6: NAT, Public vs Private IP & Internet Access
  // =========================

  {
    "id": 67,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "Welcome to NAT",
    "type": "lesson",
    "content": {
      "body": "IPv4 has approximately 4.3 billion addresses. The internet has far more than 4.3 billion devices. NAT (Network Address Translation) is the mechanism that bridges this gap — allowing billions of devices with private IP addresses to share a small pool of public IP addresses.\n\n## What This Module Covers\n\n- Why NAT exists and the problem it solves\n- How NAT works — the translation table and port mapping\n- Types of NAT: static, dynamic, PAT (Port Address Translation)\n- Port forwarding — how to make a service behind NAT reachable from the internet\n- NAT and security — what NAT does and does not protect\n- CGNAT — carrier-grade NAT and why it breaks certain applications\n- NAT traversal — how applications punch through NAT\n\n## The Core Concept\n\nYour home router has one public IP address. Every device on your home network has a private IP address. When any device sends traffic to the internet, the router replaces the private source IP with its public IP and records the mapping. When the reply arrives, the router reverses the translation and delivers it to the correct device.",
      "diagram": "flowchart LR\n    A[\"Phone\n192.168.1.10\"] --> R[\"Router\nNAT table\"]\n    B[\"Laptop\n192.168.1.50\"] --> R\n    C[\"TV\n192.168.1.30\"] --> R\n    R -->|\"one public IP\n203.0.113.1\"|D[\"Internet\"]\n    style R fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "NAT allows many private IP devices to share one public IP address",
      "code": "# NAT quick reference\n\n# Your private IP:\nip addr show | grep 'inet '\n\n# Your public IP (after NAT):\ncurl -s ifconfig.me\n\n# See the difference — that gap is NAT\n\n# Check if behind CGNAT (router WAN IP in 100.64.0.0/10):\n# Log into router admin panel and check WAN IP\n# If WAN IP != public IP → double NAT or CGNAT\n\n# View NAT table on Linux (if acting as router):\nsudo conntrack -L\n# tcp 6 src=192.168.1.50 dst=8.8.8.8 sport=54321 dport=53\n#     src=8.8.8.8 dst=203.0.113.1 sport=53 dport=54321",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "NAT was designed as a temporary fix for IPv4 address exhaustion. IPv6 eliminates the need for NAT entirely — every device gets a globally unique public address. Despite this, NAT is so deeply embedded in network infrastructure that it will remain in use for decades even as IPv6 adoption grows."
      },
      "keyPoints": [
        "NAT translates private IP addresses to a public IP — many devices share one public address",
        "The router maintains a NAT translation table mapping private IP:port to public IP:port",
        "NAT was a temporary fix for IPv4 exhaustion — IPv6 eliminates the need for it",
        "Your private IP (192.168.x.x) is never visible on the internet — only the public IP is",
        "CGNAT adds a second NAT layer at the ISP — breaks port forwarding and server hosting"
      ],
      "tryIt": "Run ip addr show to find your private IP. Run curl -s ifconfig.me to find your public IP. Confirm they are different — that difference is NAT. Then log into your router's admin panel and find the WAN IP. If the WAN IP matches your public IP, you have standard NAT. If they differ, you are behind CGNAT."
    }
  },

  {
    "id": 68,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "How NAT Works",
    "type": "lesson",
    "content": {
      "body": "NAT works by maintaining a translation table that maps private IP:port combinations to public IP:port combinations. Understanding this table explains why NAT works for outbound traffic but requires extra configuration for inbound traffic.\n\n## Outbound NAT (Source NAT / MASQUERADE)\n\nWhen a device on your LAN sends a packet to the internet:\n1. Device sends packet: src=192.168.1.50:54321, dst=8.8.8.8:443\n2. Router rewrites source: src=203.0.113.1:41234, dst=8.8.8.8:443\n3. Router records the mapping in its NAT table\n4. Packet sent to internet\n\nWhen the reply arrives:\n1. Reply arrives: src=8.8.8.8:443, dst=203.0.113.1:41234\n2. Router looks up 41234 in NAT table → maps to 192.168.1.50:54321\n3. Router rewrites destination: src=8.8.8.8:443, dst=192.168.1.50:54321\n4. Packet delivered to device\n\n## PAT — Port Address Translation\n\nMost home NAT is actually PAT (also called NAPT or NAT overload). Multiple devices share one public IP by using different port numbers. Device A uses public port 41234, Device B uses 41235, Device C uses 41236 — all mapped to the same public IP.\n\n## Inbound Traffic\n\nNAT blocks unsolicited inbound connections by default — there is no NAT table entry for traffic that was not initiated from inside. This provides a basic firewall effect. To allow inbound connections, you must configure port forwarding.",
      "diagram": "flowchart LR\n    A[\"192.168.1.50:54321\"] -->|\"outbound\"|B[\"NAT Table\n.50:54321 → .1:41234\"]\n    B -->|\"rewritten\"|C[\"203.0.113.1:41234\"]\n    C -->|\"internet\"|D[\"8.8.8.8:443\"]\n    D -->|\"reply\"|C\n    C -->|\"lookup table\"|B\n    B -->|\"rewritten\"|A\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "NAT table maps private IP:port to public IP:port — outbound creates entries, inbound looks them up",
      "code": "# NAT in practice\n\n# View active NAT connections (requires conntrack):\nsudo apt install conntrack\nsudo conntrack -L\n# tcp 6 ESTABLISHED\n#   src=192.168.1.50 dst=8.8.8.8 sport=54321 dport=443\n#   src=8.8.8.8 dst=203.0.113.1 sport=443 dport=41234\n\n# Configure NAT on Linux (acting as a router):\n# Enable IP forwarding:\nsudo sysctl -w net.ipv4.ip_forward=1\n\n# Add NAT rule (MASQUERADE = dynamic source NAT):\nsudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\n\n# View NAT rules:\nsudo iptables -t nat -L -n -v\n\n# Port forwarding (inbound NAT):\n# Forward external port 8080 to internal 192.168.1.10:80\nsudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80\nsudo iptables -A FORWARD -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "PAT (Port Address Translation) is what almost all home routers do — it is often called NAT but is technically more specific. One public IP can support ~65,000 simultaneous connections (one per port number). In practice, a home router handles hundreds of connections across all devices using this mechanism."
      },
      "keyPoints": [
        "NAT table maps private IP:port to public IP:port — created on outbound, looked up on inbound",
        "PAT (NAT overload) uses different port numbers to multiplex many devices onto one public IP",
        "Outbound traffic automatically creates NAT table entries — no configuration needed",
        "Inbound traffic has no table entry by default — blocked unless port forwarding is configured",
        "MASQUERADE is the iptables rule for dynamic source NAT on Linux routers"
      ],
      "tryIt": "Install conntrack (sudo apt install conntrack) and run sudo conntrack -L while browsing the web. Observe the NAT table entries — note the private IP:port on one side and the public IP:port on the other. Each entry represents one active connection being translated."
    }
  },

  {
    "id": 69,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "Port Forwarding",
    "type": "lesson",
    "content": {
      "body": "Port forwarding is the configuration that allows inbound connections from the internet to reach a specific device behind NAT. Without port forwarding, NAT blocks all unsolicited inbound traffic. With port forwarding, you tell the router: when traffic arrives on port X, send it to device Y on port Z.\n\n## How Port Forwarding Works\n\n1. External client sends packet to your public IP on port 8080\n2. Router checks port forwarding rules — finds a rule for port 8080\n3. Router rewrites destination: public IP:8080 → 192.168.1.10:80\n4. Packet delivered to the internal server\n5. Server replies to 192.168.1.10 → router translates back → external client\n\n## Common Use Cases\n\n- **Web server** — forward port 80/443 to an internal web server\n- **SSH access** — forward port 22 (or a custom port) to a specific machine\n- **Game servers** — forward game-specific ports to a gaming PC\n- **Home automation** — forward ports to a home assistant or NAS\n\n## Security Considerations\n\nEvery open port is an attack surface. Only forward ports you actually need. Use non-standard ports where possible (e.g. SSH on 2222 instead of 22) to reduce automated scanning noise. Always use strong authentication on any service exposed to the internet.\n\n## Dynamic DNS\n\nMost home connections have a dynamic public IP that changes periodically. Dynamic DNS (DDNS) services (No-IP, DuckDNS, Cloudflare) automatically update a DNS record when your IP changes, keeping your domain pointing to your current IP.",
      "diagram": "flowchart LR\n    A[\"Internet client\"] -->|\"dst: 203.0.113.1:8080\"|B[\"Router\nport forward rule\"]\n    B -->|\"rewritten\ndst: 192.168.1.10:80\"|C[\"Internal server\"]\n    C -->|\"reply\"|B\n    B -->|\"reply to client\"|A\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Port forwarding rewrites the destination of inbound packets to reach an internal server",
      "code": "# Port forwarding with iptables\n\n# Forward external port 8080 to internal server 192.168.1.10:80:\nsudo iptables -t nat -A PREROUTING \\\n  -i eth0 -p tcp --dport 8080 \\\n  -j DNAT --to-destination 192.168.1.10:80\n\n# Allow the forwarded traffic through:\nsudo iptables -A FORWARD \\\n  -p tcp -d 192.168.1.10 --dport 80 -j ACCEPT\n\n# Forward SSH (external 2222 → internal 22):\nsudo iptables -t nat -A PREROUTING \\\n  -i eth0 -p tcp --dport 2222 \\\n  -j DNAT --to-destination 192.168.1.50:22\n\n# View all port forwarding rules:\nsudo iptables -t nat -L PREROUTING -n -v\n\n# Test port forwarding from outside:\n# nc -zv <your-public-ip> 8080\n# curl http://<your-public-ip>:8080\n\n# Dynamic DNS with ddclient:\nsudo apt install ddclient\n# Configure /etc/ddclient.conf with your DDNS provider",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Never expose SSH on port 22 directly to the internet without additional protection. Automated scanners will attempt brute-force attacks within minutes of the port being opened. Use a non-standard port, disable password authentication (use SSH keys only), and consider fail2ban to block repeated failed attempts."
      },
      "keyPoints": [
        "Port forwarding maps an external port on the public IP to an internal IP:port",
        "Without port forwarding, NAT blocks all unsolicited inbound connections",
        "Every open port is an attack surface — only forward what you need",
        "Use non-standard ports and strong authentication for any internet-exposed service",
        "Dynamic DNS keeps a domain pointing to your home IP even when it changes"
      ],
      "tryIt": "Set up port forwarding on your home router to forward an external port to a simple HTTP server running on your machine (python3 -m http.server 8080). Test it from your phone on mobile data (not WiFi) by accessing your public IP and port. This confirms the port forwarding is working end-to-end."
    }
  },

  {
    "id": 70,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "CGNAT and NAT Traversal",
    "type": "lesson",
    "content": {
      "body": "As IPv4 addresses became scarce, ISPs began using Carrier-Grade NAT (CGNAT) — NAT applied at the ISP level before traffic even reaches your home router. This creates a double-NAT situation that breaks certain applications and makes hosting services from home impossible.\n\n## Carrier-Grade NAT (CGNAT)\n\nIn standard home networking, your router has a public IP and performs NAT for your devices. With CGNAT, your router gets a private IP from the ISP (in the 100.64.0.0/10 range — the shared address space). The ISP then performs NAT to translate your router's private IP to a real public IP shared among many customers.\n\nYour device → Your router → ISP CGNAT → Internet\n192.168.1.5 → 100.64.1.50 → 203.0.113.1 → 8.8.8.8\n\n## Problems with CGNAT\n\n- Port forwarding breaks — you cannot forward ports through two layers of NAT\n- Hosting servers is impossible without a VPN or tunnel\n- P2P applications (gaming, VoIP, torrents) may have connectivity issues\n- IP-based geolocation is inaccurate since many users share one IP\n\n## NAT Traversal\n\nApplications that need direct connections (VoIP, gaming, WebRTC) use NAT traversal to punch through NAT:\n\n**STUN** — discovers your public IP and port mapping\n**TURN** — relays traffic through a server when direct connection fails\n**ICE** — tries multiple connection methods and picks the best one\n\n## Detecting CGNAT\n\nIf your router's WAN IP is in 100.64.0.0/10, you are behind CGNAT. Contact your ISP to request a dedicated public IP (often available for a fee) or use IPv6.",
      "diagram": "flowchart LR\n    A[\"Your device\n192.168.1.5\"] -->|\"NAT 1\nyour router\"|B[\"100.64.1.50\nISP private\"]\n    B -->|\"NAT 2\nISP CGNAT\"|C[\"203.0.113.1\nShared public IP\"]\n    C --> D[\"Internet\"]\n    E[\"Port forwarding\nbroken\"] -.- B\n    style B fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "CGNAT adds a second NAT layer at the ISP — breaks port forwarding and server hosting",
      "code": "# Detecting and dealing with CGNAT\n\n# Step 1: find your public IP:\ncurl -s ifconfig.me\n# e.g. 203.0.113.1\n\n# Step 2: find your router's WAN IP:\n# Log into router admin panel → WAN/Internet status\n# If WAN IP is in 100.64.0.0/10 → CGNAT confirmed\n# If WAN IP != public IP → double NAT or CGNAT\n\n# CGNAT range: 100.64.0.0 - 100.127.255.255\n\n# Solutions:\n# 1. Request dedicated public IP from ISP\n# 2. Use IPv6 (no NAT needed)\n# 3. Use a VPN with port forwarding\n# 4. Use Cloudflare Tunnel (free, no open ports needed):\n#    curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared\n#    chmod +x cloudflared\n#    ./cloudflared tunnel --url http://localhost:8080\n\n# NAT traversal test (WebRTC):\n# Visit: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/\n# Add STUN server: stun:stun.l.google.com:19302\n# Run ICE gathering — see if you get server-reflexive candidates",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Cloudflare Tunnel (cloudflared) is the modern solution for exposing local services without port forwarding or a public IP. It creates an outbound tunnel from your machine to Cloudflare's network. Traffic arrives at a Cloudflare URL and is forwarded through the tunnel to your local service. Works even behind CGNAT, no open ports required."
      },
      "keyPoints": [
        "CGNAT: ISP assigns your router a private IP in 100.64.0.0/10 — double NAT situation",
        "CGNAT breaks port forwarding, server hosting, and some P2P applications",
        "Detect CGNAT: router WAN IP in 100.64.0.0/10 or WAN IP != public IP",
        "NAT traversal: STUN discovers public IP, TURN relays traffic, ICE tries all methods",
        "Cloudflare Tunnel exposes local services without port forwarding — works behind CGNAT"
      ],
      "tryIt": "Check if you are behind CGNAT: compare your router's WAN IP (from admin panel) with curl -s ifconfig.me. If they differ, you are behind CGNAT. Install cloudflared and create a tunnel to a local HTTP server — confirm you can access it from your phone on mobile data without any port forwarding."
    }
  },


  {
    "id": 71,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "NAT and Security",
    "type": "lesson",
    "content": {
      "body": "NAT is often described as a security feature because it hides internal IP addresses and blocks unsolicited inbound connections. This is partially true but frequently overstated. Understanding what NAT actually does and does not protect against is important for designing secure networks.\n\n## What NAT Does Provide\n\n**Hides internal topology** — external hosts cannot see your internal IP addresses or how many devices you have. They only see your public IP.\n\n**Blocks unsolicited inbound connections** — without a port forwarding rule, no external host can initiate a connection to an internal device. This prevents many opportunistic attacks.\n\n**Reduces attack surface** — internal devices are not directly reachable from the internet, so they cannot be directly targeted by port scans or exploit attempts.\n\n## What NAT Does NOT Provide\n\n**Not a firewall** — NAT does not inspect traffic content. Malware on an internal device can freely make outbound connections. A proper firewall with outbound rules is needed.\n\n**Not protection against phishing or malware** — a user clicking a malicious link bypasses NAT entirely because the connection is outbound.\n\n**Not protection against compromised devices** — once a device inside the NAT is compromised, it can communicate freely with the attacker's server.\n\n**Not a substitute for patching** — internal devices still need to be kept up to date.\n\n## The Right Mental Model\n\nNAT provides incidental security as a side effect of address translation. A real firewall provides intentional security through explicit policy. Use both.",
      "diagram": "flowchart TD\n    A[\"NAT provides\"] --> B[\"Hides internal IPs\"]\n    A --> C[\"Blocks unsolicited\ninbound connections\"]\n    D[\"NAT does NOT provide\"] --> E[\"Outbound traffic\ncontrol\"]\n    D --> F[\"Malware protection\"]\n    D --> G[\"Content inspection\"]\n    D --> H[\"Substitute for\npatching\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "NAT provides incidental security — it is not a substitute for a proper firewall",
      "code": "# NAT security in practice\n\n# Test: can external hosts reach your internal devices?\n# From outside your network:\nnmap -p 80,443,22 <your-public-ip>\n# Closed/filtered = NAT blocking inbound (good)\n# Open = port forwarding rule exists\n\n# Test: can internal malware reach out?\n# NAT does NOT block this:\ncurl https://malicious-server.example.com\n# This works fine through NAT — outbound is unrestricted\n\n# Proper outbound firewall (iptables):\n# Block all outbound except HTTP/HTTPS/DNS:\nsudo iptables -P FORWARD DROP\nsudo iptables -A FORWARD -p tcp --dport 80 -j ACCEPT\nsudo iptables -A FORWARD -p tcp --dport 443 -j ACCEPT\nsudo iptables -A FORWARD -p udp --dport 53 -j ACCEPT\nsudo iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT\n\n# Check what ports are open on your public IP:\n# https://www.shodan.io/host/<your-public-ip>\n# Shows what the internet can see",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Never rely on NAT as your only security layer. A compromised device inside your NAT can freely communicate with attacker infrastructure, exfiltrate data, and participate in botnets — all through outbound connections that NAT allows. A proper firewall with outbound rules, network segmentation, and endpoint security are all needed."
      },
      "keyPoints": [
        "NAT hides internal IPs and blocks unsolicited inbound — incidental security benefits",
        "NAT does NOT control outbound traffic — malware can freely connect out",
        "NAT is not a firewall — it does not inspect traffic content or enforce policy",
        "A compromised internal device can communicate freely with attackers through NAT",
        "Use NAT and a proper firewall together — they serve different purposes"
      ],
      "tryIt": "Run nmap -p 1-1000 <your-public-ip> from a machine outside your network (use a VPS or phone on mobile data). Note which ports are open — these are your port forwarding rules. Then verify that outbound traffic is unrestricted by running curl from an internal machine to an external server."
    }
  },

  {
    "id": 72,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "NAT and IPv6",
    "type": "lesson",
    "content": {
      "body": "IPv6 was designed to eliminate NAT entirely. With 340 undecillion addresses, every device can have a globally unique public address — no translation needed. Understanding how IPv6 changes the NAT picture is important as IPv6 adoption continues to grow.\n\n## Why IPv6 Eliminates NAT\n\nNAT exists because IPv4 has too few addresses. IPv6 has enough addresses to give every device on earth a unique public address with addresses to spare. There is no need to share addresses, so there is no need for translation.\n\n## End-to-End Connectivity Restored\n\nWith IPv6, every device has a globally routable address. This restores the original internet design principle of end-to-end connectivity — any device can directly communicate with any other device without NAT in the middle.\n\nThis enables:\n- Direct peer-to-peer connections without NAT traversal hacks\n- Simpler application design (no STUN/TURN needed)\n- Better performance (no translation overhead)\n- Easier hosting (no port forwarding needed)\n\n## IPv6 and Firewalls\n\nWithout NAT, IPv6 devices are directly reachable from the internet. This makes a proper firewall more important, not less. Most IPv6 deployments use a stateful firewall that blocks unsolicited inbound connections — providing the same protection NAT gave, but explicitly through policy rather than as a side effect.\n\n## Dual Stack\n\nMost modern networks run dual stack — both IPv4 (with NAT) and IPv6 (without NAT) simultaneously. Your device likely has both a private IPv4 address and a public IPv6 address right now.",
      "diagram": "flowchart TD\n    A[\"IPv4 + NAT\"] --> B[\"Private IPs\n192.168.x.x\"]\n    B --> C[\"NAT translation\nat router\"]\n    C --> D[\"One public IP\"]\n    E[\"IPv6 no NAT\"] --> F[\"Public IPv6\n2001:db8::x\"]\n    F --> G[\"Direct routing\nno translation\"]\n    G --> H[\"Firewall\nexplicit policy\"]\n    style A fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "IPv6 eliminates NAT — every device gets a public address, firewall provides explicit security policy",
      "code": "# IPv6 and NAT\n\n# Check if you have IPv6:\nip -6 addr show | grep 'scope global'\n# inet6 2001:db8::50/64 scope global — public IPv6\n# inet6 fe80::1/64 scope link — link-local only\n\n# Test IPv6 connectivity:\nping6 -c 4 2001:4860:4860::8888\ncurl -6 https://ipv6.google.com\n\n# Check your public IPv6 address:\ncurl -6 ifconfig.me\n\n# Dual stack — both IPv4 and IPv6:\ncurl -4 ifconfig.me  # IPv4 (goes through NAT)\ncurl -6 ifconfig.me  # IPv6 (direct, no NAT)\n\n# IPv6 firewall (ip6tables):\n# Block unsolicited inbound on IPv6:\nsudo ip6tables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\nsudo ip6tables -A INPUT -p icmpv6 -j ACCEPT\nsudo ip6tables -A INPUT -p tcp --dport 22 -j ACCEPT\nsudo ip6tables -P INPUT DROP\n\n# Check if a site supports IPv6:\ndig AAAA google.com",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "If your ISP provides IPv6, your devices likely already have public IPv6 addresses — check with ip -6 addr show. This means they are directly reachable from the internet on IPv6. Confirm your firewall (ip6tables or nftables) is blocking unsolicited inbound IPv6 connections, since there is no NAT to do it for you."
      },
      "keyPoints": [
        "IPv6 eliminates NAT — every device gets a globally unique public address",
        "End-to-end connectivity is restored — direct peer-to-peer without NAT traversal",
        "Without NAT, a proper IPv6 firewall is essential — no NAT to block inbound by default",
        "Dual stack: most modern networks run IPv4+NAT and IPv6 simultaneously",
        "Check ip6tables/nftables rules if you have IPv6 — your devices may be directly reachable"
      ],
      "tryIt": "Run ip -6 addr show and check if you have a global scope IPv6 address. If yes, run curl -6 ifconfig.me to confirm it is publicly routable. Then check your ip6tables rules with sudo ip6tables -L -n — confirm inbound connections are being filtered. If no rules exist, your IPv6 devices may be fully exposed."
    }
  },

  {
    "id": 73,
    "moduleId": 6,
    "moduleTitle": "NAT, Public vs Private IP & Internet Access",
    "title": "Module 6 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered NAT — the mechanism that allows billions of devices with private IP addresses to share a limited pool of public IPv4 addresses. NAT is one of the most important concepts in practical networking.\n\n## What You Learned\n\n**Why NAT exists** — IPv4 address exhaustion. Private ranges (RFC 1918) are not routed on the internet. NAT translates between private and public.\n\n**How NAT works** — translation table maps private IP:port to public IP:port. PAT multiplexes many devices onto one public IP using different port numbers.\n\n**Port forwarding** — maps an external port to an internal IP:port. Required for any inbound connection. Every open port is an attack surface.\n\n**CGNAT** — ISP-level NAT using 100.64.0.0/10. Creates double NAT. Breaks port forwarding and server hosting. Detect by comparing router WAN IP to public IP.\n\n**NAT traversal** — STUN, TURN, ICE allow applications to punch through NAT for direct connections.\n\n**NAT and security** — NAT blocks unsolicited inbound (good) but does not control outbound (not a firewall). Use both NAT and a proper firewall.\n\n**IPv6 and NAT** — IPv6 eliminates NAT entirely. Every device gets a public address. Firewall becomes more important, not less.\n\n## What Is Coming Next\n\nModule 7 covers the transport layer — TCP, UDP, ports, and how applications communicate end-to-end.",
      "diagram": "flowchart TD\n    A[\"✅ Why NAT exists\nIPv4 exhaustion\"] --> B[\"✅ How NAT works\ntranslation table PAT\"]\n    B --> C[\"✅ Port forwarding\ninbound access\"]\n    C --> D[\"✅ CGNAT\ndouble NAT 100.64/10\"]\n    D --> E[\"✅ NAT security\nnot a firewall\"]\n    E --> F[\"✅ IPv6\nno NAT needed\"]\n    F --> G[\"➡️ Transport Layer\nModule 7\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 6 complete — NAT from address translation to CGNAT and IPv6",
      "code": "# Module 6 command reference\n\n# Your private IP:\nip addr show | grep 'inet '\n\n# Your public IP:\ncurl -s ifconfig.me\n\n# Active NAT connections:\nsudo conntrack -L\n\n# Configure NAT on Linux router:\nsudo sysctl -w net.ipv4.ip_forward=1\nsudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\n\n# Port forwarding:\nsudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.10:80\n\n# View NAT rules:\nsudo iptables -t nat -L -n -v\n\n# Check for CGNAT:\n# Compare router WAN IP to: curl -s ifconfig.me\n\n# IPv6 check:\nip -6 addr show | grep 'scope global'\ncurl -6 ifconfig.me",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most important NAT concept to internalise: NAT is stateful for outbound traffic (automatically creates table entries) and stateless for inbound traffic (blocks everything without a port forwarding rule). This asymmetry is why NAT provides incidental security — and why it breaks any application that needs inbound connections."
      },
      "keyPoints": [
        "NAT translates private IP:port to public IP:port — PAT multiplexes many devices onto one IP",
        "Port forwarding is required for any inbound connection through NAT",
        "CGNAT (100.64.0.0/10) creates double NAT — breaks port forwarding and hosting",
        "NAT blocks inbound but not outbound — not a substitute for a proper firewall",
        "IPv6 eliminates NAT — every device gets a public address, firewall policy becomes explicit"
      ],
      "tryIt": "Complete a NAT lab: set up a Linux VM as a NAT router (ip_forward + iptables MASQUERADE), connect a second VM behind it, and verify the second VM can reach the internet through NAT. Then add a port forwarding rule and verify inbound access. Finally, check the NAT table with conntrack -L while traffic flows."
    }
  },

  // =========================
  // Networking Module 7: TCP vs UDP, Ports & Transport Layer Concepts
  // =========================

  {
    "id": 74,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "Welcome to the Transport Layer",
    "type": "lesson",
    "content": {
      "body": "The transport layer (Layer 4) is where end-to-end communication between applications happens. IP gets packets to the right machine. The transport layer gets data to the right application on that machine — and decides whether delivery should be reliable or fast.\n\n## What This Module Covers\n\n- What the transport layer does and why it exists\n- Ports — how applications are identified on a device\n- TCP — reliable, ordered, connection-oriented delivery\n- The TCP three-way handshake and connection teardown\n- TCP flow control and congestion control\n- UDP — fast, connectionless, unreliable delivery\n- When to use TCP vs UDP\n- QUIC and HTTP/3 — the modern replacement for TCP on the web\n\n## The Core Choice\n\nEvery networked application must choose between TCP and UDP. TCP guarantees delivery and order at the cost of latency and overhead. UDP sacrifices reliability for speed. The right choice depends entirely on what your application needs — and getting it wrong has real consequences.",
      "diagram": "flowchart TD\n    A[\"Transport Layer 4\"] --> B[\"TCP\nreliable ordered\nconnection-oriented\"]\n    A --> C[\"UDP\nfast unreliable\nconnectionless\"]\n    B --> D[\"HTTP HTTPS SSH\nSMTP databases\"]\n    C --> E[\"DNS video VoIP\ngaming QUIC\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Transport layer choice: TCP for reliability, UDP for speed — the decision shapes your application's behaviour",
      "code": "# Transport layer quick reference\n\n# See all TCP connections:\nss -tnp\n# ESTAB  192.168.1.50:54321  93.184.216.34:443\n\n# See all UDP sockets:\nss -unp\n# UNCONN 0.0.0.0:68   (DHCP)\n# UNCONN 0.0.0.0:123  (NTP)\n\n# See all listening ports:\nss -tlnp  # TCP\nss -ulnp  # UDP\n\n# Test TCP port reachability:\nnc -zv example.com 443\n\n# Test UDP port:\nnc -uzv 8.8.8.8 53",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "ss (socket statistics) is the modern replacement for netstat. It is faster, more detailed, and available on all modern Linux systems. Learn ss -tnp (TCP connections with process names) and ss -tlnp (listening TCP ports) — you will use these commands every day."
      },
      "keyPoints": [
        "Transport layer delivers data to the right application using port numbers",
        "TCP: reliable, ordered, connection-oriented — three-way handshake before data flows",
        "UDP: fast, connectionless, unreliable — no handshake, no retransmission",
        "Port numbers 0-1023 are well-known (HTTP=80, HTTPS=443, SSH=22, DNS=53)",
        "ss -tnp shows active TCP connections; ss -tlnp shows listening ports"
      ],
      "tryIt": "Run ss -tnp to see all active TCP connections on your machine. Identify which processes own each connection. Run ss -tlnp to see what ports are listening. Then run ss -unp to see UDP sockets. This gives you a complete picture of your machine's transport layer activity."
    }
  },

  {
    "id": 75,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "TCP: Reliable Ordered Delivery",
    "type": "lesson",
    "content": {
      "body": "TCP (Transmission Control Protocol) provides reliable, ordered, error-checked delivery of data between applications. It is the foundation of HTTP, SSH, SMTP, and most other application protocols where data integrity matters.\n\n## The Three-Way Handshake\n\nBefore any data is sent, TCP establishes a connection:\n1. **SYN** — client sends SYN (synchronise) with its initial sequence number\n2. **SYN-ACK** — server responds with SYN-ACK, acknowledging the client's SYN and sending its own\n3. **ACK** — client acknowledges the server's SYN. Connection established.\n\nThis takes one round-trip before data can flow — a cost that QUIC was designed to eliminate.\n\n## Reliability Mechanisms\n\n**Sequence numbers** — every byte is numbered. The receiver can detect missing data and request retransmission.\n\n**Acknowledgements** — receiver sends ACK for every segment received. Sender retransmits if no ACK arrives within the timeout.\n\n**Checksums** — detects data corruption in transit.\n\n**Ordered delivery** — segments are reassembled in order regardless of arrival order.\n\n## Connection Teardown\n\nTCP uses a four-way handshake to close connections: FIN → ACK → FIN → ACK. Either side can initiate. The TIME_WAIT state keeps the connection entry for 2×MSL (Maximum Segment Lifetime) to handle delayed packets.",
      "diagram": "flowchart LR\n    A[\"Client\"] -->|\"SYN\"|B[\"Server\"]\n    B -->|\"SYN-ACK\"|A\n    A -->|\"ACK\"|B\n    A -->|\"DATA\"|B\n    B -->|\"ACK\"|A\n    A -->|\"FIN\"|B\n    B -->|\"ACK\"|A\n    B -->|\"FIN\"|A\n    A -->|\"ACK\"|B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "TCP: three-way handshake to open, data exchange with ACKs, four-way handshake to close",
      "code": "# TCP handshake in practice\n\n# Capture a TCP three-way handshake:\nsudo tcpdump -i eth0 -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' &\ncurl https://example.com\n# SYN      (S flag)\n# SYN-ACK  (S and A flags)\n# ACK      (A flag)\n\n# See TCP connection states:\nss -tn\n# ESTAB      = established, data flowing\n# TIME-WAIT  = closing, waiting for delayed packets\n# CLOSE-WAIT = remote closed, local still open\n# SYN-SENT   = handshake in progress\n\n# TCP flags in tcpdump output:\n# [S]   = SYN\n# [S.]  = SYN-ACK\n# [.]   = ACK\n# [P.]  = PSH-ACK (data)\n# [F.]  = FIN-ACK\n# [R]   = RST (reset — abrupt close)\n\n# Count TCP connections by state:\nss -tn | awk '{print $1}' | sort | uniq -c | sort -rn",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "A RST (reset) packet abruptly terminates a TCP connection without the normal four-way teardown. You will see RST packets when a server receives a packet for a port that is not listening, when a firewall blocks a connection, or when an application crashes. In tcpdump, RST appears as [R] in the flags field."
      },
      "keyPoints": [
        "Three-way handshake: SYN → SYN-ACK → ACK — one round-trip before data flows",
        "Sequence numbers track every byte — receiver detects gaps and requests retransmission",
        "ACKs confirm receipt — sender retransmits if no ACK arrives within timeout",
        "Four-way teardown: FIN → ACK → FIN → ACK — TIME_WAIT handles delayed packets",
        "RST abruptly terminates a connection — seen when port is closed or firewall blocks"
      ],
      "tryIt": "Capture a TCP handshake with sudo tcpdump -i eth0 -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' while running curl https://example.com. Identify the SYN, SYN-ACK, and ACK packets. Note the sequence numbers — confirm the SYN-ACK acknowledges the client's sequence number."
    }
  },

  {
    "id": 76,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "TCP Flow Control and Congestion Control",
    "type": "lesson",
    "content": {
      "body": "TCP does not just guarantee delivery — it also prevents the sender from overwhelming the receiver and prevents the network from becoming congested. These two mechanisms are what make TCP reliable at scale.\n\n## Flow Control — Protecting the Receiver\n\nThe receiver advertises a receive window — how many bytes it can accept before its buffer fills. The sender must not send more than this window allows. If the receiver's buffer fills (window = 0), the sender pauses until the receiver signals it can accept more.\n\n## Congestion Control — Protecting the Network\n\n**Slow Start** — begins with a small congestion window (cwnd) and doubles it each RTT until a threshold is reached or packet loss occurs.\n\n**Congestion Avoidance** — after the threshold, increases cwnd by 1 MSS per RTT (linear growth).\n\n**Fast Retransmit** — if the sender receives 3 duplicate ACKs, it retransmits the lost segment immediately without waiting for a timeout.\n\n**Fast Recovery** — after fast retransmit, reduces cwnd by half instead of resetting to 1.\n\n## Why This Matters\n\nTCP congestion control is why the internet does not collapse under load. When a link becomes congested, TCP senders automatically back off. Without this, congestion would cause more retransmissions, which would cause more congestion — a death spiral. BBR (Bottleneck Bandwidth and RTT) is Google's modern congestion control algorithm, now the default on many systems.",
      "diagram": "flowchart TD\n    A[\"TCP Sender\"] --> B[\"Slow Start\ncwnd doubles each RTT\"]\n    B --> C{\"Threshold?\"}\n    C -->|\"No\"|B\n    C -->|\"Yes\"|D[\"Congestion Avoidance\n+1 MSS per RTT\"]\n    D --> E{\"Packet loss?\"}\n    E -->|\"Timeout\"|F[\"Reset cwnd=1\"]\n    E -->|\"3 dup ACKs\"|G[\"Fast Retransmit\ncwnd halved\"]\n    G --> D\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "TCP grows the window exponentially then linearly — backs off on loss to prevent network collapse",
      "code": "# TCP flow and congestion control\n\n# Check TCP buffer sizes:\ncat /proc/sys/net/ipv4/tcp_rmem\n# min  default  max (bytes)\n# 4096  131072  6291456\n\n# See TCP window and congestion info:\nss -tin dst 8.8.8.8\n# cwnd:10 ssthresh:2147483647\n# rcv_space:14600 rcv_ssthresh:64088\n\n# Current congestion control algorithm:\ncat /proc/sys/net/ipv4/tcp_congestion_control\n# cubic\n\n# Available algorithms:\nsysctl net.ipv4.tcp_available_congestion_control\n# cubic bbr reno\n\n# Switch to BBR (Google's modern algorithm):\nsudo sysctl -w net.ipv4.tcp_congestion_control=bbr\n\n# See window size in tcpdump:\nsudo tcpdump -i eth0 -n tcp -v | grep -i 'win '\n# win 65535  (initial)\n# win 502    (reduced — congestion)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "BBR (Bottleneck Bandwidth and RTT) is Google's modern TCP congestion control algorithm. Unlike CUBIC which reacts to packet loss, BBR models the network's bandwidth and RTT to keep the pipe full without causing congestion. It significantly improves throughput on high-bandwidth, high-latency links (satellite, intercontinental). Enable it with sysctl net.ipv4.tcp_congestion_control=bbr."
      },
      "keyPoints": [
        "Flow control: receiver advertises window size — sender cannot exceed it",
        "Slow Start: cwnd doubles each RTT until threshold — then linear growth",
        "Fast Retransmit: 3 duplicate ACKs triggers immediate retransmit without timeout",
        "Congestion control prevents network collapse — senders back off when loss detected",
        "BBR is Google's modern algorithm — models bandwidth/RTT rather than reacting to loss"
      ],
      "tryIt": "Run ss -tin while downloading a large file and watch the cwnd (congestion window) value grow. Check your current congestion control algorithm with cat /proc/sys/net/ipv4/tcp_congestion_control. Switch to BBR and run an iperf3 throughput test — compare the result to CUBIC."
    }
  },

  {
    "id": 77,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "UDP: Fast Connectionless Delivery",
    "type": "lesson",
    "content": {
      "body": "UDP (User Datagram Protocol) is the minimal transport protocol. It adds port numbers and a checksum to IP — nothing else. No connection, no acknowledgements, no retransmission, no ordering. What it lacks in reliability it makes up for in speed and simplicity.\n\n## What UDP Provides\n\n- **Port numbers** — identifies which application receives the data\n- **Checksum** — detects corruption (optional in IPv4, mandatory in IPv6)\n- **That is it** — no connection state, no reliability, no ordering\n\n## Why UDP Exists\n\nFor many applications, TCP's reliability mechanisms are unnecessary overhead or actively harmful:\n\n**DNS** — a query is one packet, the response is one packet. If it is lost, just retry. TCP's handshake would double the latency for every lookup.\n\n**Video streaming** — a dropped frame is better than a stall. TCP's retransmission would cause buffering. UDP lets the application decide how to handle loss.\n\n**VoIP and gaming** — real-time applications cannot wait for retransmission. A late packet is worse than a lost one. UDP delivers immediately or not at all.\n\n**QUIC** — implements its own reliability on top of UDP, avoiding TCP's head-of-line blocking.\n\n## UDP Header\n\nThe UDP header is just 8 bytes: source port (2), destination port (2), length (2), checksum (2). Compare to TCP's 20-byte minimum header.",
      "diagram": "flowchart TD\n    A[\"UDP Use Cases\"] --> B[\"DNS\none query one response\"]\n    A --> C[\"Video streaming\ndropped frame OK\"]\n    A --> D[\"VoIP gaming\nreal-time no wait\"]\n    A --> E[\"QUIC\nown reliability on UDP\"]\n    F[\"UDP Header 8 bytes\"] --> G[\"Src port 2B\"]\n    F --> H[\"Dst port 2B\"]\n    F --> I[\"Length 2B\"]\n    F --> J[\"Checksum 2B\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "UDP: 8-byte header, no connection state — ideal for DNS, streaming, VoIP, and QUIC",
      "code": "# UDP in practice\n\n# See UDP sockets:\nss -unp\n# UNCONN 0.0.0.0:68    (DHCP client)\n# UNCONN 0.0.0.0:123   (NTP)\n# UNCONN 0.0.0.0:5353  (mDNS)\n\n# DNS uses UDP port 53:\ndig google.com\n# Query sent via UDP, response received\n\n# Capture UDP DNS traffic:\nsudo tcpdump -i eth0 -n udp port 53\n# 12:00:01 IP 192.168.1.50.54321 > 8.8.8.8.53: A? google.com\n# 12:00:01 IP 8.8.8.8.53 > 192.168.1.50.54321: A 142.250.x.x\n\n# Send a UDP packet with netcat:\necho 'hello' | nc -u 192.168.1.1 9999\n\n# Listen for UDP on a port:\nnc -ul 9999\n\n# UDP throughput test:\niperf3 -c iperf.he.net -u -b 100M\n# -u = UDP, -b = target bandwidth\n# Reports: bandwidth, jitter, packet loss",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "UDP has no congestion control — a UDP sender can flood the network at full speed regardless of congestion. This is why UDP-based applications (video streaming, gaming) must implement their own rate limiting and congestion awareness. QUIC implements congestion control on top of UDP, making it responsible even though it uses UDP."
      },
      "keyPoints": [
        "UDP header is 8 bytes: source port, destination port, length, checksum — nothing else",
        "No connection, no ACKs, no retransmission, no ordering — fire and forget",
        "DNS uses UDP: one query, one response — TCP handshake would double latency",
        "Real-time apps (VoIP, gaming) prefer UDP: late packets are worse than lost ones",
        "UDP has no congestion control — applications must implement their own rate limiting"
      ],
      "tryIt": "Capture DNS traffic with sudo tcpdump -i eth0 -n udp port 53 while running dig google.com. Observe the single query and single response — no handshake, no ACK. Then run iperf3 -c iperf.he.net -u -b 100M and note the jitter and packet loss statistics — metrics that only matter for UDP."
    }
  },


  {
    "id": 78,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "Ports and Sockets",
    "type": "lesson",
    "content": {
      "body": "Port numbers are how the transport layer identifies which application on a device should receive incoming data. A socket is the combination of IP address and port number that uniquely identifies one end of a connection.\n\n## Port Numbers\n\nPorts are 16-bit numbers (0–65535):\n\n- **Well-known ports (0–1023)** — reserved for standard services. Require root/admin to bind. HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, FTP=21.\n- **Registered ports (1024–49151)** — assigned by IANA for specific applications. PostgreSQL=5432, MySQL=3306, Redis=6379.\n- **Ephemeral ports (49152–65535)** — used by clients for outbound connections. Assigned automatically by the OS.\n\n## Sockets\n\nA socket is an IP address + port number. A TCP connection is identified by a four-tuple: source IP, source port, destination IP, destination port. This means a server can handle thousands of simultaneous connections on port 443 — each connection has a different source IP:port.\n\n## Common Port Numbers\n\n| Port | Protocol | Service |\n|------|----------|---------|\n| 22 | TCP | SSH |\n| 25 | TCP | SMTP |\n| 53 | UDP/TCP | DNS |\n| 80 | TCP | HTTP |\n| 443 | TCP | HTTPS |\n| 3306 | TCP | MySQL |\n| 5432 | TCP | PostgreSQL |\n| 6379 | TCP | Redis |",
      "diagram": "flowchart TD\n    A[\"Server 192.168.1.10\"] --> B[\"Port 22\nSSH\"]\n    A --> C[\"Port 80\nHTTP\"]\n    A --> D[\"Port 443\nHTTPS\"]\n    E[\"Client connection\"] --> F[\"Socket\n192.168.1.50:54321\"]\n    F -->|\"connects to\"|D\n    G[\"Four-tuple\"] --> H[\"src: 192.168.1.50:54321\ndst: 192.168.1.10:443\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style G fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Ports identify applications; sockets identify connections — four-tuple uniquely identifies each TCP connection",
      "code": "# Ports and sockets in practice\n\n# See all listening ports:\nss -tlnp  # TCP\nss -ulnp  # UDP\n\n# See all established connections with process names:\nss -tnp\n# ESTAB  192.168.1.50:54321  93.184.216.34:443  users:((curl,pid=1234))\n\n# Check what is listening on a specific port:\nss -tlnp | grep :443\n\n# Check if a port is open on a remote host:\nnc -zv example.com 443\nnc -zv example.com 22\n\n# Scan common ports on a host:\nnmap -p 22,80,443,3306,5432 192.168.1.10\n\n# See ephemeral port range:\ncat /proc/sys/net/ipv4/ip_local_port_range\n# 32768  60999\n\n# Check /etc/services for port assignments:\ngrep -E '^(ssh|http|https|smtp|dns)\s' /etc/services",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "ss -tlnp is the fastest way to see what is listening on your machine. The -t flag shows TCP, -l shows listening sockets, -n shows numeric ports (no DNS lookup), -p shows the process name. Run this whenever you need to know what services are running or why a port is in use."
      },
      "keyPoints": [
        "Well-known ports 0-1023: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25",
        "Registered ports 1024-49151: PostgreSQL=5432, MySQL=3306, Redis=6379",
        "Ephemeral ports 49152-65535: assigned by OS for outbound client connections",
        "A socket is IP + port; a TCP connection is a four-tuple (src IP:port, dst IP:port)",
        "ss -tlnp shows all listening TCP ports with process names"
      ],
      "tryIt": "Run ss -tlnp and identify every service listening on your machine. For each port, look it up in /etc/services or online to identify the service. Then run nmap -p 1-1024 localhost to scan your own machine and compare the results to ss output."
    }
  },

  {
    "id": 79,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "QUIC and HTTP/3",
    "type": "lesson",
    "content": {
      "body": "QUIC is a transport protocol developed by Google and standardised by the IETF (RFC 9000). It is the foundation of HTTP/3 and addresses fundamental limitations of TCP that have existed for decades.\n\n## The Problems QUIC Solves\n\n**Head-of-line blocking** — in HTTP/2 over TCP, all streams share one TCP connection. If one packet is lost, all streams stall waiting for retransmission. QUIC multiplexes streams independently — a lost packet only blocks the stream it belongs to.\n\n**Connection establishment latency** — TCP requires a 3-way handshake (1 RTT) before TLS can start (1 more RTT). QUIC combines transport and TLS handshakes — 1 RTT for new connections, 0 RTT for resumed connections.\n\n**Connection migration** — TCP connections are tied to an IP:port. Switch from WiFi to mobile data and your TCP connection breaks. QUIC uses connection IDs — connections survive IP address changes.\n\n## QUIC Architecture\n\nQUIC runs over UDP. It implements its own reliability, ordering, and congestion control on top of UDP. This allows it to be updated without OS kernel changes — unlike TCP which requires kernel updates.\n\n## HTTP/3\n\nHTTP/3 is HTTP over QUIC. Supported by all major browsers. Used by Google, Cloudflare, Facebook, and most major CDNs. Approximately 25% of web traffic uses HTTP/3.",
      "diagram": "flowchart TD\n    A[\"HTTP/1.1\nTCP + TLS\n3 RTT setup\"] --> D[\"Comparison\"]\n    B[\"HTTP/2\nTCP + TLS\n2 RTT\nhead-of-line blocking\"] --> D\n    C[\"HTTP/3\nQUIC UDP\n1 RTT\nno blocking\nconnection migration\"] --> D\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "HTTP/3 over QUIC: 1 RTT setup, no head-of-line blocking, connection migration",
      "code": "# Detecting and testing QUIC/HTTP3\n\n# Check if a site advertises HTTP/3:\ncurl -sI https://www.cloudflare.com | grep alt-svc\n# alt-svc: h3=:443; ma=86400 (HTTP/3 on port 443)\n\n# QUIC uses UDP port 443 — capture it:\nsudo tcpdump -i eth0 -n udp port 443\n\n# Check browser HTTP/3 support:\n# Chrome: chrome://net-internals/#quic\n# Firefox: about:networking#http3\n\n# Test HTTP/3 performance:\n# https://http3check.net/\n# https://cloudflare-quic.com/\n\n# Protocol comparison:\n# HTTP/1.1: 1 request per connection\n# HTTP/2:   multiple streams, 1 TCP, head-of-line blocking\n# HTTP/3:   multiple streams, QUIC/UDP, no head-of-line blocking",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "QUIC connection migration is particularly valuable on mobile. When you switch from WiFi to mobile data, your IP changes. TCP connections break and must restart. QUIC connections continue seamlessly because they use a connection ID, not an IP:port tuple. This is why video calls and streaming work better on mobile with HTTP/3."
      },
      "keyPoints": [
        "QUIC runs over UDP with its own reliability, ordering, and congestion control",
        "Head-of-line blocking: TCP stalls all streams on one lost packet; QUIC only stalls the affected stream",
        "QUIC setup: 1 RTT vs 2-3 for TCP+TLS; 0 RTT for resumed connections",
        "Connection migration: QUIC connections survive IP changes (WiFi to mobile)",
        "HTTP/3 is HTTP over QUIC — 25% of web traffic, supported by all major browsers"
      ],
      "tryIt": "Check if your browser is using HTTP/3: in Chrome open chrome://net-internals/#quic and look for active QUIC sessions. Run curl -sI https://www.cloudflare.com | grep alt-svc to see HTTP/3 advertisement. Capture UDP port 443 traffic with tcpdump while browsing to observe QUIC packets."
    }
  },

  {
    "id": 80,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "Choosing TCP vs UDP",
    "type": "lesson",
    "content": {
      "body": "Choosing between TCP and UDP is one of the most fundamental decisions in network application design. The wrong choice causes real problems — unnecessary latency, buffering, or data loss. The right choice depends on what your application actually needs.\n\n## Use TCP When\n\n- **Data integrity is required** — every byte must arrive correctly and in order. HTTP, SSH, database connections, file transfers.\n- **You cannot handle loss** — missing data would corrupt the result. SQL queries, API responses, email.\n- **The application does not have its own reliability** — you are not implementing retransmission yourself.\n\n## Use UDP When\n\n- **Speed matters more than reliability** — a dropped packet is acceptable. DNS, video streaming, gaming.\n- **Real-time delivery is required** — late data is worse than lost data. VoIP, live video, gaming.\n- **You are implementing your own reliability** — QUIC, DTLS, custom game protocols.\n- **Broadcast or multicast** — UDP supports sending to multiple destinations; TCP does not.\n\n## The Hybrid Approach\n\nMany modern protocols implement reliability on top of UDP to get the best of both worlds:\n- **QUIC** — reliable, ordered, multiplexed streams over UDP\n- **WebRTC** — uses DTLS (Datagram TLS) over UDP for real-time media\n- **Game engines** — often implement selective reliability (reliable for game state, unreliable for position updates)",
      "diagram": "flowchart TD\n    A{\"Need reliability?\"}\n    A -->|\"Yes\"|B{\"Real-time?\"}\n    A -->|\"No\"|C[\"UDP\"]\n    B -->|\"No\"|D[\"TCP\"]\n    B -->|\"Yes\"|E{\"Own reliability?\"}\n    E -->|\"Yes\"|F[\"UDP + custom\nQUIC WebRTC\"]\n    E -->|\"No\"|D\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "TCP vs UDP decision tree — reliability, real-time requirements, and custom reliability determine the choice",
      "code": "# TCP vs UDP in real applications\n\n# TCP applications:\nss -tnp | grep -E 'ssh|http|postgres|mysql'\n# All use TCP — data integrity required\n\n# UDP applications:\nss -unp\n# DNS (53), NTP (123), DHCP (67/68) — all UDP\n\n# DNS uses UDP by default, TCP for large responses:\ndig google.com          # UDP\ndig google.com +tcp     # force TCP\n\n# Check if a service uses TCP or UDP:\ngrep -E '^(http|https|ssh|dns|ntp|dhcp)\s' /etc/services\n# http   80/tcp\n# domain 53/tcp\n# domain 53/udp   ← DNS uses both\n# ntp    123/udp\n\n# Measure TCP vs UDP throughput:\n# TCP:\niperf3 -c iperf.he.net -t 10\n# UDP (100 Mbps target):\niperf3 -c iperf.he.net -u -b 100M -t 10\n# Compare: TCP adapts to congestion; UDP sends at fixed rate",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "DNS is a perfect example of the TCP vs UDP trade-off. DNS uses UDP by default because a query and response fit in one packet each — TCP's handshake would double the latency for every lookup. But DNS falls back to TCP for responses larger than 512 bytes (DNSSEC, large zone transfers). This is why DNS listens on both UDP/53 and TCP/53."
      },
      "keyPoints": [
        "TCP: use when data integrity is required and loss is unacceptable",
        "UDP: use when speed matters more than reliability or real-time delivery is needed",
        "QUIC/WebRTC: implement reliability on top of UDP for real-time + reliable delivery",
        "DNS uses UDP by default (one packet each way) but falls back to TCP for large responses",
        "Gaming engines often use selective reliability: reliable for game state, unreliable for position"
      ],
      "tryIt": "Run dig google.com (UDP) and dig google.com +tcp (TCP) and compare the query times. The UDP version should be faster. Then run iperf3 in both TCP and UDP modes and compare throughput and behaviour under load. Note how TCP adapts to congestion while UDP sends at a fixed rate regardless."
    }
  },

  {
    "id": 81,
    "moduleId": 7,
    "moduleTitle": "TCP vs UDP, Ports & Transport Layer Concepts",
    "title": "Module 7 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered the transport layer — the layer that delivers data to the right application and decides whether delivery should be reliable or fast. Every networked application you build will use TCP or UDP, and understanding both deeply makes you a better developer and engineer.\n\n## What You Learned\n\n**Transport layer** — delivers data to the right application using port numbers. TCP or UDP.\n\n**TCP** — three-way handshake, sequence numbers, ACKs, retransmission, ordered delivery. Reliable but adds latency.\n\n**TCP flow and congestion control** — receive window prevents overwhelming the receiver; slow start and congestion avoidance prevent network collapse. BBR is the modern algorithm.\n\n**UDP** — 8-byte header, no connection, no ACKs, no retransmission. Fast but unreliable. DNS, VoIP, gaming, streaming.\n\n**Ports and sockets** — well-known (0-1023), registered (1024-49151), ephemeral (49152-65535). Four-tuple identifies each TCP connection.\n\n**QUIC/HTTP3** — UDP-based, 1 RTT setup, no head-of-line blocking, connection migration. ~25% of web traffic.\n\n**TCP vs UDP choice** — reliability vs speed. QUIC bridges the gap for real-time reliable applications.\n\n## What Is Coming Next\n\nModule 8 covers DNS — how domain names are resolved to IP addresses, the DNS hierarchy, record types, and DNS security.",
      "diagram": "flowchart TD\n    A[\"✅ Transport layer\nports applications\"] --> B[\"✅ TCP\nhandshake ACK reliable\"]\n    B --> C[\"✅ Flow congestion\nwindow BBR\"]\n    C --> D[\"✅ UDP\nfast connectionless\"]\n    D --> E[\"✅ Ports sockets\nfour-tuple\"]\n    E --> F[\"✅ QUIC HTTP3\nUDP reliable fast\"]\n    F --> G[\"➡️ DNS\nModule 8\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 7 complete — transport layer from TCP handshake to QUIC and HTTP/3",
      "code": "# Module 7 command reference\n\n# Active TCP connections:\nss -tnp\n\n# Listening ports:\nss -tlnp  # TCP\nss -ulnp  # UDP\n\n# Capture TCP handshake:\nsudo tcpdump -i eth0 -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0'\n\n# Capture DNS (UDP):\nsudo tcpdump -i eth0 -n udp port 53\n\n# Test port reachability:\nnc -zv example.com 443\nnc -uzv 8.8.8.8 53\n\n# TCP congestion algorithm:\ncat /proc/sys/net/ipv4/tcp_congestion_control\n\n# Throughput test:\niperf3 -c iperf.he.net          # TCP\niperf3 -c iperf.he.net -u -b 100M  # UDP\n\n# HTTP/3 check:\ncurl -sI https://cloudflare.com | grep alt-svc",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most important transport layer insight: TCP and UDP are not better or worse than each other — they are tools for different jobs. TCP is the right choice when you cannot afford to lose data. UDP is the right choice when you cannot afford to wait. QUIC is the right choice when you need both."
      },
      "keyPoints": [
        "TCP: three-way handshake, ACKs, retransmission, ordered — reliable but adds latency",
        "UDP: 8-byte header, no connection, no ACKs — fast but unreliable",
        "TCP congestion control prevents network collapse — BBR is the modern algorithm",
        "Ports 0-1023 well-known, 1024-49151 registered, 49152-65535 ephemeral",
        "QUIC runs over UDP with its own reliability — 1 RTT, no head-of-line blocking"
      ],
      "tryIt": "Complete a transport layer audit: run ss -tlnp and ss -ulnp to see all listening ports. Capture a TCP handshake and a DNS UDP exchange with tcpdump. Run iperf3 in both TCP and UDP modes. Check if your browser is using HTTP/3 with chrome://net-internals/#quic. Document what you find."
    }
  },

  // =========================
  // Networking Module 8: DNS, Name Resolution & How the Internet Finds Servers
  // =========================

  {
    "id": 82,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "Welcome to DNS",
    "type": "lesson",
    "content": {
      "body": "DNS (Domain Name System) is the phonebook of the internet. It translates human-readable domain names like google.com into IP addresses like 142.250.80.46. Without DNS, you would need to memorise IP addresses for every website you visit.\n\n## What This Module Covers\n\n- Why DNS exists and what problem it solves\n- The DNS hierarchy — root servers, TLDs, authoritative nameservers\n- How DNS resolution works step by step\n- DNS record types — A, AAAA, CNAME, MX, TXT, NS, PTR\n- DNS caching and TTL\n- DNS security — DNSSEC, DNS over HTTPS, DNS over TLS\n\n## Why DNS Matters Beyond Browsing\n\nDNS is involved in almost every network operation. When your app connects to a database, it resolves a hostname. When email is delivered, DNS MX records route it. When TLS certificates are issued, DNS TXT records prove domain ownership. DNS failures are catastrophic — and DNS misconfigurations are one of the most common causes of outages.",
      "diagram": "flowchart LR\n    A[\"Browser\ngoogle.com\"] --> B[\"DNS Resolver\"]\n    B --> C[\"Root Server\"]\n    C --> D[\".com TLD Server\"]\n    D --> E[\"google.com\nNameserver\"]\n    E --> F[\"142.250.80.46\"]\n    F --> A\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "DNS resolution: browser asks resolver, resolver walks the hierarchy to find the answer",
      "code": "# DNS quick reference\n\n# Basic DNS lookup:\ndig google.com\ndig google.com A      # IPv4 address\ndig google.com AAAA   # IPv6 address\ndig google.com MX     # mail servers\ndig google.com TXT    # text records (SPF, DKIM)\n\n# Quick answer only:\ndig +short google.com\n# 142.250.80.46\n\n# Query a specific DNS server:\ndig @8.8.8.8 google.com\ndig @1.1.1.1 google.com\n\n# Reverse DNS lookup:\ndig -x 8.8.8.8\n# 8.8.8.8.in-addr.arpa → dns.google",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "dig is the essential DNS diagnostic tool. Learn dig +short (quick answer), dig @server (query specific server), and dig +trace (full resolution path). These three forms cover 90% of DNS troubleshooting scenarios."
      },
      "keyPoints": [
        "DNS translates domain names to IP addresses — the phonebook of the internet",
        "DNS is involved in almost every network operation, not just web browsing",
        "DNS failures are catastrophic — understanding DNS makes you faster at diagnosing outages",
        "dig is the primary DNS diagnostic tool — learn it well",
        "DNS record types: A (IPv4), AAAA (IPv6), MX (mail), TXT (verification), CNAME (alias)"
      ],
      "tryIt": "Run dig google.com and read the full output — identify the QUESTION section, ANSWER section, and AUTHORITY section. Note the TTL value. Run dig +short google.com for a quick answer. Run dig @1.1.1.1 google.com and compare the response to dig @8.8.8.8 google.com."
    }
  },

  {
    "id": 83,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "The DNS Hierarchy",
    "type": "lesson",
    "content": {
      "body": "DNS is a distributed, hierarchical database. No single server knows all domain names. Instead, the responsibility is delegated down a tree — from root servers at the top, through top-level domain servers, down to authoritative nameservers for individual domains.\n\n## The Three Levels\n\n**Root servers** — the top of the DNS hierarchy. There are 13 root server addresses (A through M), operated by different organisations worldwide. They do not know the IP for google.com, but they know which servers are authoritative for .com.\n\n**TLD (Top-Level Domain) servers** — responsible for a specific TLD (.com, .org, .net, .uk). They know which nameservers are authoritative for each domain within their TLD. The .com TLD servers know that google.com's nameservers are ns1.google.com and ns2.google.com.\n\n**Authoritative nameservers** — the final authority for a specific domain. They hold the actual DNS records. When you register a domain, you configure which nameservers are authoritative for it.\n\n## Recursive Resolvers\n\nYour device does not query root servers directly. It sends queries to a recursive resolver (usually provided by your ISP or a public service like 8.8.8.8 or 1.1.1.1). The resolver does the work of walking the hierarchy and returns the final answer.",
      "diagram": "flowchart TD\n    A[\"Root Servers\n13 addresses\nknow TLD servers\"] --> B[\".com TLD Servers\nknow google.com NS\"]\n    B --> C[\"google.com\nAuthoritative NS\nholds actual records\"]\n    D[\"Your device\"] -->|\"query\"|E[\"Recursive Resolver\n8.8.8.8 or 1.1.1.1\"]\n    E -->|\"walks hierarchy\"|A\n    E -->|\"final answer\"|D\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "DNS hierarchy: root → TLD → authoritative nameserver — recursive resolver walks the tree for you",
      "code": "# Explore the DNS hierarchy\n\n# Trace the full resolution path:\ndig +trace google.com\n# . (root) → .com (TLD) → google.com (authoritative)\n# Each step shows which server answered\n\n# Query root servers directly:\ndig @a.root-servers.net google.com\n# Returns referral to .com TLD servers\n\n# Query .com TLD servers:\ndig @a.gtld-servers.net google.com\n# Returns referral to google.com nameservers\n\n# Query google.com authoritative nameservers:\ndig @ns1.google.com google.com\n# Returns the actual A record\n\n# Find authoritative nameservers for a domain:\ndig NS google.com\n# google.com. 21599 IN NS ns1.google.com.\n# google.com. 21599 IN NS ns2.google.com.\n\n# Check who operates a nameserver:\nwhois ns1.google.com",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The 13 root server addresses are not 13 physical machines — they are 13 IP addresses, each served by hundreds of servers worldwide using anycast routing. The closest server to you responds. This is why root server queries are fast despite the servers being conceptually at the top of the hierarchy."
      },
      "keyPoints": [
        "Root servers know TLD servers; TLD servers know authoritative nameservers; authoritative servers hold records",
        "13 root server addresses (A-M) — each served by hundreds of anycast servers worldwide",
        "Recursive resolvers (8.8.8.8, 1.1.1.1) walk the hierarchy so your device does not have to",
        "dig +trace shows the full resolution path from root to authoritative answer",
        "Authoritative nameservers are configured when you register a domain"
      ],
      "tryIt": "Run dig +trace google.com and read each step. Identify the root server response, the .com TLD referral, and the final authoritative answer. Note which organisations operate each level. Then run dig NS google.com to see which nameservers are authoritative for google.com."
    }
  },

  {
    "id": 84,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "DNS Record Types",
    "type": "lesson",
    "content": {
      "body": "DNS stores different types of records for different purposes. Understanding record types is essential for configuring domains, diagnosing email problems, and setting up TLS certificates.\n\n## Core Record Types\n\n**A** — maps a hostname to an IPv4 address. The most common record type.\nexample.com → 93.184.216.34\n\n**AAAA** — maps a hostname to an IPv6 address.\nexample.com → 2606:2800:220:1:248:1893:25c8:1946\n\n**CNAME** — canonical name alias. Points one hostname to another.\nwww.example.com → example.com\n\n**MX** — mail exchanger. Specifies which servers receive email for a domain. Has a priority value — lower is preferred.\nexample.com MX 10 mail.example.com\n\n**TXT** — arbitrary text. Used for SPF, DKIM, DMARC, domain verification.\nexample.com TXT v=spf1 include:_spf.google.com -all\n\n**NS** — nameserver. Specifies which servers are authoritative for a domain.\n\n**PTR** — pointer record. Used for reverse DNS — maps an IP to a hostname.\n\n**SOA** — Start of Authority. Contains zone metadata: primary nameserver, admin email, serial number, refresh intervals.\n\n## CNAME Restrictions\n\nA CNAME cannot coexist with other records at the same name. You cannot have a CNAME at the zone apex (example.com) — only at subdomains (www.example.com). This is why CDNs use ALIAS or ANAME records at the apex.",
      "diagram": "flowchart TD\n    A[\"DNS Record Types\"] --> B[\"A\nHostname → IPv4\"]\n    A --> C[\"AAAA\nHostname → IPv6\"]\n    A --> D[\"CNAME\nAlias → hostname\"]\n    A --> E[\"MX\nDomain → mail server\"]\n    A --> F[\"TXT\nSPF DKIM DMARC\"]\n    A --> G[\"NS\nDomain → nameservers\"]\n    A --> H[\"PTR\nIP → hostname\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "DNS record types — each serves a specific purpose from IP mapping to email routing to security",
      "code": "# Query different DNS record types\n\n# A record (IPv4):\ndig A example.com +short\n# 93.184.216.34\n\n# AAAA record (IPv6):\ndig AAAA google.com +short\n# 2607:f8b0:4004:c09::64\n\n# MX records (mail servers):\ndig MX gmail.com +short\n# 5 gmail-smtp-in.l.google.com.\n# 10 alt1.gmail-smtp-in.l.google.com.\n\n# TXT records (SPF, DKIM, verification):\ndig TXT google.com +short\n# v=spf1 include:_spf.google.com ~all\n\n# CNAME record:\ndig CNAME www.github.com +short\n# github.com.\n\n# NS records (nameservers):\ndig NS google.com +short\n# ns1.google.com.\n# ns2.google.com.\n\n# PTR record (reverse DNS):\ndig -x 8.8.8.8 +short\n# dns.google.\n\n# SOA record (zone metadata):\ndig SOA google.com +short\n# ns1.google.com. dns-admin.google.com. 123456 900 900 1800 60",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "MX record priority is counterintuitive — lower numbers have higher priority. MX 10 is preferred over MX 20. If the MX 10 server is unavailable, the sender tries MX 20. This allows you to configure a primary and backup mail server. Always check MX records first when diagnosing email delivery problems."
      },
      "keyPoints": [
        "A: hostname to IPv4; AAAA: hostname to IPv6; CNAME: alias to another hostname",
        "MX: mail server for a domain — lower priority number = higher preference",
        "TXT: arbitrary text — used for SPF, DKIM, DMARC, and domain verification",
        "PTR: reverse DNS — maps IP to hostname, used by mail servers to verify senders",
        "CNAME cannot coexist with other records at the same name — not allowed at zone apex"
      ],
      "tryIt": "Query all record types for a domain you own or manage: A, AAAA, MX, TXT, NS, SOA. For each record, identify its purpose. Check the MX records for gmail.com and note the priority values. Run dig -x on your public IP to see if reverse DNS is configured."
    }
  },

  {
    "id": 85,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "DNS Resolution: Step by Step",
    "type": "lesson",
    "content": {
      "body": "Understanding exactly how a DNS query is resolved — from your browser to the final answer — makes DNS problems much easier to diagnose. The process involves up to four servers and multiple caches.\n\n## The Full Resolution Process\n\n1. **Browser cache** — browser checks its own DNS cache. If found and not expired, done.\n2. **OS cache** — browser asks the OS resolver. OS checks its cache (/etc/hosts first, then cache).\n3. **Recursive resolver** — OS sends query to the configured DNS server (8.8.8.8, 1.1.1.1, or your ISP's resolver). Resolver checks its cache.\n4. **Root server** — if not cached, resolver queries a root server. Root returns referral to the TLD server.\n5. **TLD server** — resolver queries the TLD server (.com). TLD returns referral to the authoritative nameserver.\n6. **Authoritative nameserver** — resolver queries the authoritative nameserver. Gets the actual record.\n7. **Response** — resolver caches the answer (for the TTL duration) and returns it to the OS, which returns it to the browser.\n\n## Recursive vs Iterative\n\n**Recursive query** — your device asks the resolver to do all the work and return the final answer. This is what your device does.\n\n**Iterative query** — the resolver asks each server in turn, getting referrals until it reaches the authoritative answer. This is what the resolver does internally.",
      "diagram": "flowchart TD\n    A[\"1. Browser cache\"] --> B[\"2. OS cache\n/etc/hosts\"]\n    B --> C[\"3. Recursive resolver\n8.8.8.8 cache\"]\n    C --> D[\"4. Root server\nreferral to TLD\"]\n    D --> E[\"5. TLD server\nreferral to NS\"]\n    E --> F[\"6. Authoritative NS\nactual record\"]\n    F -->|\"answer + TTL\"|C\n    C -->|\"cached answer\"|A\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "DNS resolution walks up to four servers — caches at each level reduce the number of queries needed",
      "code": "# DNS resolution diagnostics\n\n# Trace the full resolution path:\ndig +trace google.com\n\n# Check OS DNS cache (systemd-resolved):\nresolvectl statistics\n# Current Transactions: 0\n# Total Transactions: 1234\n# Current Cache Size: 45\n# Cache Hits: 890\n# Cache Misses: 344\n\n# Flush DNS cache:\n# systemd-resolved:\nsudo resolvectl flush-caches\n# macOS:\nsudo dscacheutil -flushcache\n\n# Check /etc/hosts (checked before DNS):\ncat /etc/hosts\n# 127.0.0.1 localhost\n# Add custom entries to override DNS:\n# 192.168.1.10 myserver.local\n\n# Check configured DNS servers:\ncat /etc/resolv.conf\n# nameserver 8.8.8.8\n# nameserver 1.1.1.1\n\n# Measure DNS resolution time:\ntime dig google.com > /dev/null\n# First query: ~20ms (cache miss)\ntime dig google.com > /dev/null\n# Second query: ~1ms (cache hit)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "/etc/hosts is checked before DNS on every Linux and macOS system. You can add entries to override DNS for specific hostnames — useful for local development (pointing myapp.local to 127.0.0.1) or for blocking domains (pointing ads.example.com to 0.0.0.0). This is how ad-blocking hosts files work."
      },
      "keyPoints": [
        "Resolution order: browser cache → OS cache → recursive resolver → root → TLD → authoritative",
        "Recursive query: your device asks resolver to do all the work",
        "Iterative query: resolver queries each server in turn, getting referrals",
        "/etc/hosts is checked before DNS — can override any domain locally",
        "Caching at each level reduces queries — TTL controls how long answers are cached"
      ],
      "tryIt": "Run time dig google.com twice and compare the times — the second should be much faster due to caching. Run dig +trace google.com to see the full resolution path. Add an entry to /etc/hosts pointing test.local to 127.0.0.1 and verify it resolves with dig test.local."
    }
  },


  {
    "id": 86,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "DNS Caching and TTL",
    "type": "lesson",
    "content": {
      "body": "DNS caching is what makes the internet fast. Without caching, every DNS query would walk the full hierarchy from root to authoritative nameserver — adding hundreds of milliseconds to every connection. TTL (Time to Live) controls how long cached answers are kept.\n\n## How TTL Works\n\nEvery DNS record has a TTL value in seconds. When a resolver caches a record, it stores the TTL. Each second, the TTL counts down. When it reaches zero, the cached entry expires and the next query triggers a fresh lookup.\n\nCommon TTL values:\n- 300 (5 minutes) — frequently changing records, fast failover\n- 3600 (1 hour) — standard for most records\n- 86400 (24 hours) — stable records, reduces DNS load\n- 1 — emergency, near-instant propagation\n\n## TTL and DNS Changes\n\nWhen you change a DNS record, the old value stays cached until the TTL expires. If your A record has TTL 86400 and you change the IP, some users will still get the old IP for up to 24 hours.\n\n**Best practice**: lower the TTL to 300 before making a DNS change. Wait for the old TTL to expire. Make the change. After confirming it works, raise the TTL back.\n\n## Negative Caching\n\nNXDOMAIN responses (domain does not exist) are also cached — for the SOA minimum TTL. This prevents repeated queries for non-existent domains.",
      "diagram": "flowchart TD\n    A[\"DNS Record\nTTL: 3600\"] --> B[\"Resolver caches\nfor 3600 seconds\"]\n    B --> C[\"TTL counts down\"]\n    C --> D{\"TTL = 0?\"}\n    D -->|\"No\"|E[\"Serve from cache\"]\n    D -->|\"Yes\"|F[\"Fresh lookup\nfrom authoritative\"]\n    F --> B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "TTL controls cache lifetime — lower TTL means faster propagation but more DNS queries",
      "code": "# TTL and DNS caching\n\n# Check TTL of a record:\ndig google.com A\n# google.com. 299 IN A 142.250.80.46\n#             ^^^  TTL in seconds (counting down)\n\n# Query multiple times to watch TTL count down:\ndig +nocmd +noall +answer google.com\ndig +nocmd +noall +answer google.com\n# TTL decreases each time\n\n# Check TTL of your own domain's records:\ndig +nocmd +noall +answer yourdomain.com\n\n# Flush resolver cache to force fresh lookup:\nsudo resolvectl flush-caches  # systemd\nsudo dscacheutil -flushcache   # macOS\n\n# Check negative cache (NXDOMAIN):\ndig nonexistent.example.com\n# status: NXDOMAIN\n# SOA record shows minimum TTL for negative caching\n\n# Lower TTL before a DNS change (in your DNS provider):\n# Current: yourdomain.com A 86400 → 1.2.3.4\n# Step 1: change TTL to 300, wait 24 hours\n# Step 2: change IP to 5.6.7.8\n# Step 3: after confirming, raise TTL back to 3600",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "The most common DNS migration mistake: changing the IP without lowering the TTL first. If your A record has TTL 86400 and you change the IP, users with the old cached value will be unable to reach your site for up to 24 hours. Always lower TTL to 300 at least one TTL period before making any DNS change."
      },
      "keyPoints": [
        "TTL controls how long DNS answers are cached — lower TTL means faster propagation",
        "Common TTLs: 300 (5 min, fast failover), 3600 (1 hour, standard), 86400 (24 hours, stable)",
        "DNS changes take up to one TTL period to propagate — plan accordingly",
        "Best practice: lower TTL to 300 before changes, raise back after confirming",
        "Negative caching: NXDOMAIN responses are also cached for the SOA minimum TTL"
      ],
      "tryIt": "Run dig google.com A twice and note the TTL counting down between queries. Find a domain you control and check its current TTL. If you are planning a DNS change, lower the TTL to 300 now and wait for the old TTL to expire before making the change."
    }
  },

  {
    "id": 87,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "DNSSEC, DoH, and DoT",
    "type": "lesson",
    "content": {
      "body": "Standard DNS has a critical weakness: responses are not authenticated and not encrypted. An attacker who can intercept DNS traffic can return false answers — redirecting users to malicious servers. Three technologies address this: DNSSEC, DNS over HTTPS, and DNS over TLS.\n\n## DNSSEC — DNS Security Extensions\n\nDNSSEC adds cryptographic signatures to DNS records. Each DNS zone signs its records with a private key. Resolvers verify the signature using the corresponding public key. If the signature does not match, the resolver rejects the response.\n\nDNSSEC creates a chain of trust from the root zone down to individual domains. It prevents DNS spoofing and cache poisoning — but it does not encrypt DNS traffic.\n\n## DNS over HTTPS (DoH)\n\nDoH sends DNS queries inside HTTPS requests to port 443. This encrypts DNS traffic and hides it from network observers. It also bypasses DNS-based content filtering — which makes it controversial in enterprise environments.\n\n## DNS over TLS (DoT)\n\nDoT encrypts DNS traffic using TLS on port 853. Unlike DoH, it uses a dedicated port — making it easier for network admins to monitor or block. Provides privacy without hiding the fact that DNS queries are being made.\n\n## Which to Use\n\n- DNSSEC — validates authenticity, does not encrypt\n- DoH — encrypts and hides DNS traffic, harder to manage\n- DoT — encrypts DNS traffic, visible to network admins",
      "diagram": "flowchart TD\n    A[\"DNS Security\"] --> B[\"DNSSEC\ncryptographic signatures\nprevents spoofing\ndoes NOT encrypt\"]\n    A --> C[\"DoH port 443\nencrypts + hides\nbypasses filtering\"]\n    A --> D[\"DoT port 853\nencrypts queries\nvisible to admins\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "DNSSEC validates authenticity; DoH and DoT encrypt DNS traffic — they solve different problems",
      "code": "# Testing DNSSEC, DoH, and DoT\n\n# Check if a domain has DNSSEC:\ndig +dnssec cloudflare.com\n# Look for: flags: ad (authenticated data)\n# RRSIG records in the answer section\n\n# Verify DNSSEC chain of trust:\ndig +trace +dnssec cloudflare.com\n\n# Test DoH with curl:\ncurl -H 'accept: application/dns-json' \\\n  'https://cloudflare-dns.com/dns-query?name=example.com&type=A'\n\n# Configure DoT on Linux (systemd-resolved):\n# /etc/systemd/resolved.conf:\n# [Resolve]\n# DNS=1.1.1.1\n# DNSOverTLS=yes\nsudo systemctl restart systemd-resolved\n\n# Verify DoT is active:\nresolvectl status | grep 'DNS over TLS'\n\n# Check if your DNS is encrypted:\n# https://1.1.1.1/help\n# Shows: Using DNS over HTTPS: Yes/No",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "DNSSEC and DoH/DoT solve different problems. DNSSEC ensures the answer has not been tampered with — it validates authenticity. DoH/DoT ensure no one can see what you are querying — they provide privacy. A fully secure DNS setup uses all three: DNSSEC for integrity, DoT or DoH for privacy."
      },
      "keyPoints": [
        "DNSSEC adds cryptographic signatures — prevents spoofing and cache poisoning, does not encrypt",
        "DoH: DNS over HTTPS port 443 — encrypts and hides queries, bypasses filtering",
        "DoT: DNS over TLS port 853 — encrypts queries, visible to network admins",
        "DNSSEC = integrity; DoH/DoT = privacy — they solve different problems",
        "dig +dnssec shows RRSIG records; the ad flag confirms DNSSEC validation"
      ],
      "tryIt": "Run dig +dnssec cloudflare.com and look for the ad (authenticated data) flag and RRSIG records. Run dig +dnssec example.com and compare — not all domains have DNSSEC. Configure systemd-resolved to use DoT with Cloudflare (1.1.1.1) and verify with resolvectl status."
    }
  },

  {
    "id": 88,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "Common DNS Problems and Fixes",
    "type": "lesson",
    "content": {
      "body": "DNS problems are among the most common causes of connectivity failures. They are also among the easiest to diagnose once you know the right commands. Most DNS problems fall into a small number of categories.\n\n## Problem 1: Wrong DNS Server\n\nSymptom: some domains resolve, others do not. Or resolution is slow.\nDiagnosis: cat /etc/resolv.conf — check which DNS server is configured.\nFix: change to a reliable public resolver (8.8.8.8 or 1.1.1.1).\n\n## Problem 2: Stale Cache\n\nSymptom: you changed a DNS record but still get the old answer.\nDiagnosis: dig @8.8.8.8 yourdomain.com — query a public resolver directly to bypass local cache.\nFix: sudo resolvectl flush-caches or wait for TTL to expire.\n\n## Problem 3: NXDOMAIN for a Valid Domain\n\nSymptom: dig returns NXDOMAIN for a domain that should exist.\nDiagnosis: dig +trace yourdomain.com — walk the hierarchy to find where it fails.\nFix: check NS records, check domain registration, check authoritative nameserver configuration.\n\n## Problem 4: DNS Hijacking\n\nSymptom: you get an IP address but it is not the correct server.\nDiagnosis: compare dig @8.8.8.8 yourdomain.com with dig @your-isp-dns yourdomain.com.\nFix: use a trusted public resolver; enable DoH or DoT.\n\n## Problem 5: Slow DNS Resolution\n\nSymptom: connections are slow but fast once established.\nDiagnosis: time dig google.com — measure resolution time.\nFix: switch to a faster resolver (1.1.1.1 is typically fastest).",
      "diagram": "flowchart TD\n    A[\"DNS problem\"] --> B{\"NXDOMAIN?\"}\n    B -->|\"Yes\"|C[\"dig +trace\nfind where it fails\"]\n    B -->|\"No\"|D{\"Wrong IP?\"}\n    D -->|\"Yes\"|E[\"Compare resolvers\ncheck for hijacking\"]\n    D -->|\"No\"|F{\"Slow?\"}\n    F -->|\"Yes\"|G[\"time dig\nswitch resolver\"]\n    F -->|\"No\"|H[\"Stale cache\nflush and retry\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "DNS problem decision tree — NXDOMAIN, wrong IP, slow, or stale cache each have different fixes",
      "code": "# DNS problem diagnosis\n\n# Check configured DNS server:\ncat /etc/resolv.conf\nresolvectl status | grep DNS\n\n# Query a specific resolver (bypass local cache):\ndig @8.8.8.8 yourdomain.com\ndig @1.1.1.1 yourdomain.com\n\n# Trace resolution to find where it fails:\ndig +trace yourdomain.com\n\n# Flush local DNS cache:\nsudo resolvectl flush-caches  # systemd\nsudo dscacheutil -flushcache   # macOS\n\n# Measure DNS resolution time:\ntime dig google.com > /dev/null\n# real 0m0.012s  (fast — cached)\n# real 0m0.250s  (slow — check resolver)\n\n# Compare resolver speed:\ntime dig @8.8.8.8 google.com > /dev/null\ntime dig @1.1.1.1 google.com > /dev/null\ntime dig @9.9.9.9 google.com > /dev/null\n\n# Check for DNS hijacking:\n# Compare results from public vs ISP resolver\ndig @8.8.8.8 google.com +short\ndig @your-isp-resolver google.com +short\n# If different IPs: possible hijacking",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "When diagnosing DNS problems, always query a public resolver directly (dig @8.8.8.8) to bypass your local cache and ISP resolver. If the public resolver returns the correct answer but your local resolver does not, the problem is your local cache or ISP resolver. If both return wrong answers, the problem is at the authoritative nameserver."
      },
      "keyPoints": [
        "Query @8.8.8.8 directly to bypass local cache and ISP resolver",
        "dig +trace walks the full hierarchy — shows exactly where resolution fails",
        "Stale cache: flush with resolvectl flush-caches or wait for TTL",
        "DNS hijacking: compare results from different resolvers",
        "Slow DNS: time dig to measure, switch to 1.1.1.1 for typically fastest resolution"
      ],
      "tryIt": "Run time dig google.com three times and compare the times. Then test three public resolvers (8.8.8.8, 1.1.1.1, 9.9.9.9) individually and identify which is fastest from your location. Flush your DNS cache and run the timing test again — confirm the first query is slower than subsequent cached queries."
    }
  },

  {
    "id": 89,
    "moduleId": 8,
    "moduleTitle": "DNS, Name Resolution & How the Internet Finds Servers",
    "title": "Module 8 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered DNS — the system that translates domain names to IP addresses and underpins almost every network operation. DNS is invisible when it works and catastrophic when it fails.\n\n## What You Learned\n\n**DNS hierarchy** — root servers → TLD servers → authoritative nameservers. Recursive resolvers walk the hierarchy for you.\n\n**DNS record types** — A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), TXT (SPF/DKIM/verification), NS (nameservers), PTR (reverse DNS).\n\n**DNS resolution** — browser cache → OS cache → recursive resolver → root → TLD → authoritative. /etc/hosts checked first.\n\n**TTL and caching** — TTL controls cache lifetime. Lower TTL before DNS changes. Wait one TTL period for propagation.\n\n**DNS security** — DNSSEC validates authenticity (prevents spoofing). DoH/DoT encrypt queries (privacy). Use both for full protection.\n\n**Common problems** — wrong resolver, stale cache, NXDOMAIN, hijacking, slow resolution. dig @8.8.8.8 and dig +trace diagnose most issues.\n\n## What Is Coming Next\n\nModule 9 covers HTTP and HTTPS — how web communication works, request/response structure, TLS, and proxies.",
      "diagram": "flowchart TD\n    A[\"✅ DNS hierarchy\nroot TLD authoritative\"] --> B[\"✅ Record types\nA AAAA MX TXT CNAME\"]\n    B --> C[\"✅ Resolution\ncache hierarchy\"]\n    C --> D[\"✅ TTL caching\npropagate changes\"]\n    D --> E[\"✅ DNSSEC DoH DoT\nsecurity privacy\"]\n    E --> F[\"✅ Troubleshooting\ndig trace flush\"]\n    F --> G[\"➡️ HTTP/HTTPS\nModule 9\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 8 complete — DNS from hierarchy and record types to security and troubleshooting",
      "code": "# Module 8 command reference\n\n# Basic lookups:\ndig google.com +short\ndig google.com A\ndig google.com MX\ndig google.com TXT\ndig -x 8.8.8.8 +short\n\n# Full resolution trace:\ndig +trace google.com\n\n# Query specific resolver:\ndig @8.8.8.8 google.com\ndig @1.1.1.1 google.com\n\n# Check TTL:\ndig +nocmd +noall +answer google.com\n\n# Flush cache:\nsudo resolvectl flush-caches\n\n# DNSSEC check:\ndig +dnssec cloudflare.com | grep -E 'flags|RRSIG'\n\n# Measure resolution time:\ntime dig google.com > /dev/null\n\n# Check DNS config:\ncat /etc/resolv.conf\nresolvectl status",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The two most important DNS commands: dig +short <domain> (quick answer) and dig +trace <domain> (full resolution path). Between these two, you can diagnose almost any DNS problem. Add dig @8.8.8.8 to bypass local cache and you have a complete DNS diagnostic toolkit."
      },
      "keyPoints": [
        "DNS hierarchy: root → TLD → authoritative — recursive resolvers walk it for you",
        "Record types: A, AAAA, CNAME, MX, TXT, NS, PTR — each serves a specific purpose",
        "TTL controls cache lifetime — lower before changes, wait one TTL for propagation",
        "DNSSEC = integrity (prevents spoofing); DoH/DoT = privacy (encrypts queries)",
        "dig @8.8.8.8 and dig +trace diagnose most DNS problems"
      ],
      "tryIt": "Complete a DNS audit for a domain you own or manage: check all record types, verify TTL values are appropriate, confirm DNSSEC is enabled (or note that it is not), and test resolution time from multiple public resolvers. Document any issues you find and fix them."
    }
  },

  // =========================
  // Networking Module 9: HTTP, HTTPS & Web Communication Fundamentals
  // =========================

  {
    "id": 90,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "Welcome to HTTP and HTTPS",
    "type": "lesson",
    "content": {
      "body": "HTTP (HyperText Transfer Protocol) is the foundation of the web. Every time you load a webpage, call an API, or submit a form, you are using HTTP. Understanding how it works makes you a better developer, a better debugger, and a better security engineer.\n\n## What This Module Covers\n\n- HTTP request and response structure\n- HTTP methods — GET, POST, PUT, DELETE, PATCH\n- HTTP status codes — what each range means\n- HTTPS — how TLS secures HTTP traffic\n- The TLS handshake — what happens before the first byte of data\n- HTTP/2 — multiplexing and header compression\n- WebSockets — persistent bidirectional connections\n- Proxies — forward and reverse\n\n## Why HTTP Matters Beyond the Browser\n\nHTTP is not just for browsers. REST APIs, webhooks, health checks, microservice communication, CDN cache invalidation — all of these use HTTP. Every backend developer, DevOps engineer, and security professional works with HTTP daily.",
      "diagram": "flowchart LR\n    A[\"Client\nbrowser app\"] -->|\"HTTP request\"|B[\"Server\nnginx API\"]\n    B -->|\"HTTP response\"|A\n    C[\"HTTPS\"] --> D[\"HTTP + TLS\nencrypted\"]\n    E[\"HTTP/2\"] --> F[\"multiplexed\nbinary\"]\n    G[\"WebSocket\"] --> H[\"persistent\nbidirectional\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "HTTP is the foundation of web communication — HTTPS, HTTP/2, and WebSockets build on top of it",
      "code": "# HTTP quick reference\n\n# Make an HTTP request:\ncurl https://example.com\n\n# See request and response headers:\ncurl -v https://example.com 2>&1 | grep -E '^[<>]'\n\n# See only response headers:\ncurl -sI https://example.com\n\n# Make a POST request with JSON:\ncurl -X POST https://api.example.com/users \\\n  -H 'Content-Type: application/json' \\\n  -d '{name: Alice}'\n\n# Follow redirects:\ncurl -L https://example.com\n\n# Show HTTP version:\ncurl -sI --http2 https://example.com | head -1\n# HTTP/2 200",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "curl -v is the most useful HTTP debugging tool. It shows the full request (lines starting with >) and full response (lines starting with <) including all headers. Add -s to suppress the progress bar. This is the first tool to reach for when an HTTP request is not behaving as expected."
      },
      "keyPoints": [
        "HTTP is the foundation of the web — every API call, form submission, and page load uses it",
        "HTTP is a request-response protocol — client sends request, server sends response",
        "HTTPS = HTTP + TLS — encrypts the connection between client and server",
        "HTTP/2 adds multiplexing and header compression over a single connection",
        "curl -v shows the full HTTP exchange including all headers"
      ],
      "tryIt": "Run curl -v https://example.com 2>&1 | grep -E '^[<>]' and read the full request and response. Identify the request line, request headers, response status line, and response headers. Then run curl -sI https://example.com to see just the response headers."
    }
  },

  {
    "id": 91,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "HTTP Requests and Responses",
    "type": "lesson",
    "content": {
      "body": "Every HTTP interaction consists of a request from the client and a response from the server. Understanding the structure of both is essential for building and debugging web applications.\n\n## HTTP Request Structure\n\n1. **Request line** — method, path, HTTP version: GET /index.html HTTP/1.1\n2. **Headers** — key-value pairs with metadata: Host, Content-Type, Authorization, Accept\n3. **Blank line** — separates headers from body\n4. **Body** — optional, used for POST/PUT requests with data\n\n## HTTP Methods\n\n- **GET** — retrieve a resource. No body. Should be idempotent and safe.\n- **POST** — create a resource or submit data. Has a body. Not idempotent.\n- **PUT** — replace a resource entirely. Idempotent.\n- **PATCH** — partially update a resource. Not necessarily idempotent.\n- **DELETE** — remove a resource. Idempotent.\n- **HEAD** — like GET but returns only headers, no body. Used to check if a resource exists.\n- **OPTIONS** — returns allowed methods. Used in CORS preflight requests.\n\n## HTTP Response Structure\n\n1. **Status line** — HTTP version, status code, reason phrase: HTTP/1.1 200 OK\n2. **Headers** — Content-Type, Content-Length, Cache-Control, Set-Cookie\n3. **Blank line**\n4. **Body** — the response content (HTML, JSON, binary data)",
      "diagram": "flowchart LR\n    A[\"Request\nGET /api/users HTTP/2\nHost: api.example.com\nAuthorization: Bearer token\"] -->|\"send\"|B[\"Server\"]\n    B -->|\"respond\"|C[\"Response\nHTTP/2 200 OK\nContent-Type: application/json\n\n{users: [...]}\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "HTTP request: method + path + headers + body. HTTP response: status + headers + body",
      "code": "# HTTP request and response structure\n\n# See full request and response:\ncurl -v https://httpbin.org/get 2>&1\n# > GET /get HTTP/2          (request line)\n# > Host: httpbin.org        (request header)\n# > User-Agent: curl/7.x     (request header)\n# >                          (blank line)\n# < HTTP/2 200               (response status)\n# < content-type: application/json  (response header)\n# <                          (blank line)\n# { ... }                    (response body)\n\n# POST with JSON body:\ncurl -v -X POST https://httpbin.org/post \\\n  -H 'Content-Type: application/json' \\\n  -d '{key: value}'\n\n# HEAD request (headers only, no body):\ncurl -I https://example.com\n\n# OPTIONS request (CORS preflight):\ncurl -X OPTIONS https://api.example.com \\\n  -H 'Origin: https://app.example.com' \\\n  -H 'Access-Control-Request-Method: POST' -v\n\n# Different HTTP methods:\ncurl -X GET    https://httpbin.org/get\ncurl -X POST   https://httpbin.org/post -d 'data'\ncurl -X PUT    https://httpbin.org/put  -d 'data'\ncurl -X DELETE https://httpbin.org/delete",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Idempotency matters for API design. GET, PUT, and DELETE are idempotent — calling them multiple times has the same effect as calling once. POST is not idempotent — submitting a form twice creates two records. This distinction affects how clients handle retries and how servers handle duplicate requests."
      },
      "keyPoints": [
        "Request: method + path + HTTP version, headers, blank line, optional body",
        "Response: status line, headers, blank line, body",
        "GET retrieves, POST creates, PUT replaces, PATCH updates, DELETE removes",
        "GET/PUT/DELETE are idempotent — safe to retry; POST is not",
        "HEAD returns only headers — useful for checking resource existence without downloading body"
      ],
      "tryIt": "Use curl -v to make GET, POST, PUT, and DELETE requests to httpbin.org (a free HTTP testing service). For each method, read the request and response structure. Note which methods have a request body and which do not. Try curl -I https://example.com and compare the response to a full GET request."
    }
  },

  {
    "id": 92,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "HTTP Status Codes",
    "type": "lesson",
    "content": {
      "body": "HTTP status codes tell the client what happened with its request. They are three-digit numbers grouped into five classes. Knowing the common codes and their meanings is essential for debugging APIs and web applications.\n\n## Status Code Classes\n\n**1xx — Informational** — request received, processing continues. Rarely seen in practice. 100 Continue, 101 Switching Protocols (WebSocket upgrade).\n\n**2xx — Success** — request was received, understood, and accepted.\n- 200 OK — standard success\n- 201 Created — resource was created (POST)\n- 204 No Content — success but no body (DELETE)\n\n**3xx — Redirection** — further action needed.\n- 301 Moved Permanently — resource has a new URL, update your links\n- 302 Found — temporary redirect\n- 304 Not Modified — cached version is still valid\n\n**4xx — Client Error** — the request has an error.\n- 400 Bad Request — malformed request\n- 401 Unauthorized — authentication required\n- 403 Forbidden — authenticated but not authorised\n- 404 Not Found — resource does not exist\n- 429 Too Many Requests — rate limited\n\n**5xx — Server Error** — the server failed to fulfil a valid request.\n- 500 Internal Server Error — generic server error\n- 502 Bad Gateway — upstream server returned invalid response\n- 503 Service Unavailable — server overloaded or down\n- 504 Gateway Timeout — upstream server timed out",
      "diagram": "flowchart TD\n    A[\"Status Codes\"] --> B[\"2xx Success\n200 201 204\"]\n    A --> C[\"3xx Redirect\n301 302 304\"]\n    A --> D[\"4xx Client Error\n400 401 403 404 429\"]\n    A --> E[\"5xx Server Error\n500 502 503 504\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "HTTP status code classes — 2xx success, 3xx redirect, 4xx client error, 5xx server error",
      "code": "# HTTP status codes in practice\n\n# See status code of a request:\ncurl -sI https://example.com | head -1\n# HTTP/2 200\n\n# Get only the status code:\ncurl -s -o /dev/null -w '%{http_code}' https://example.com\n# 200\n\n# Test different status codes with httpbin:\ncurl -s -o /dev/null -w '%{http_code}' https://httpbin.org/status/200\ncurl -s -o /dev/null -w '%{http_code}' https://httpbin.org/status/404\ncurl -s -o /dev/null -w '%{http_code}' https://httpbin.org/status/500\n\n# Follow redirects and see the chain:\ncurl -v -L https://httpbin.org/redirect/3 2>&1 | grep -E 'HTTP|Location'\n# HTTP/2 302\n# location: /relative-redirect/2\n# HTTP/2 302\n# location: /relative-redirect/1\n# HTTP/2 302\n# location: /get\n# HTTP/2 200\n\n# Check for 401 vs 403:\n# 401 = not authenticated (no credentials)\n# 403 = authenticated but not authorised (wrong permissions)\ncurl -s -o /dev/null -w '%{http_code}' https://httpbin.org/status/401\ncurl -s -o /dev/null -w '%{http_code}' https://httpbin.org/status/403",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The most important distinction: 401 vs 403. A 401 means the client is not authenticated — it needs to provide credentials. A 403 means the client is authenticated but does not have permission. If you are logged in and get a 403, the problem is authorisation (permissions), not authentication (identity). This distinction is critical for debugging access control issues."
      },
      "keyPoints": [
        "2xx: success — 200 OK, 201 Created, 204 No Content",
        "3xx: redirect — 301 permanent, 302 temporary, 304 not modified (use cache)",
        "4xx: client error — 400 bad request, 401 unauthenticated, 403 unauthorised, 404 not found",
        "5xx: server error — 500 generic, 502 bad gateway, 503 unavailable, 504 timeout",
        "401 = not authenticated; 403 = authenticated but not authorised — different problems"
      ],
      "tryIt": "Use curl -s -o /dev/null -w '%{http_code}' to check the status code of 10 different URLs. Include some that redirect (301/302), some that require auth (401), and some that do not exist (404). Then use curl -L to follow a redirect chain and observe each step."
    }
  },

  {
    "id": 93,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "HTTPS and TLS",
    "type": "lesson",
    "content": {
      "body": "HTTPS is HTTP over TLS (Transport Layer Security). It provides three things: encryption (no one can read the traffic), authentication (you are talking to the real server), and integrity (the data has not been tampered with). Every website should use HTTPS — HTTP is insecure.\n\n## The TLS Handshake\n\nBefore any HTTP data is sent, TLS negotiates the connection:\n\n1. **ClientHello** — client sends supported TLS versions, cipher suites, and a random value\n2. **ServerHello** — server selects TLS version and cipher suite, sends its certificate\n3. **Certificate verification** — client verifies the server's certificate against trusted CAs\n4. **Key exchange** — client and server derive a shared session key (using ECDHE or similar)\n5. **Finished** — both sides confirm the handshake is complete\n6. **Application data** — HTTP traffic flows, encrypted with the session key\n\nTLS 1.3 (the current version) completes this in 1 RTT. TLS 1.2 takes 2 RTTs.\n\n## Certificates\n\nA TLS certificate proves the server's identity. It contains the domain name, public key, issuer (CA), and validity period. Browsers trust certificates signed by known CAs (Let's Encrypt, DigiCert, etc.).\n\n## HSTS\n\nHTTP Strict Transport Security tells browsers to always use HTTPS for a domain — even if the user types http://. Prevents downgrade attacks.",
      "diagram": "flowchart LR\n    A[\"Client\"] -->|\"1 ClientHello\"|B[\"Server\"]\n    B -->|\"2 ServerHello + Certificate\"|A\n    A -->|\"3 Verify cert\"|A\n    A -->|\"4 Key exchange\"|B\n    B -->|\"5 Finished\"|A\n    A -->|\"6 HTTP data encrypted\"|B\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "TLS handshake: negotiate cipher, verify certificate, exchange keys, then encrypted HTTP flows",
      "code": "# HTTPS and TLS diagnostics\n\n# See TLS handshake details:\ncurl -v https://example.com 2>&1 | grep -E 'SSL|TLS|cert|issuer'\n# * SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384\n# * Server certificate:\n# *  subject: CN=example.com\n# *  issuer: DigiCert Inc\n# *  expire date: Jan 1 2025\n\n# Connect with openssl and inspect certificate:\nopenssl s_client -connect example.com:443 -servername example.com\n# Shows: certificate chain, cipher, TLS version\n\n# Check certificate expiry:\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates\n# notBefore=Jan  1 00:00:00 2024 GMT\n# notAfter=Jan   1 00:00:00 2025 GMT\n\n# Check TLS version supported:\ncurl --tlsv1.3 https://example.com  # require TLS 1.3\ncurl --tlsv1.2 https://example.com  # require TLS 1.2\n\n# Check HSTS header:\ncurl -sI https://example.com | grep -i strict\n# strict-transport-security: max-age=31536000; includeSubDomains\n\n# Test SSL/TLS configuration:\n# https://www.ssllabs.com/ssltest/",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Never ignore TLS certificate errors. A certificate error means either the certificate is expired, the domain does not match, or the certificate is not signed by a trusted CA. In all cases, you cannot verify you are talking to the real server — a man-in-the-middle attack is possible. curl -k (insecure) bypasses certificate verification and should never be used in production."
      },
      "keyPoints": [
        "HTTPS = HTTP + TLS — provides encryption, authentication, and integrity",
        "TLS handshake: ClientHello → ServerHello + cert → verify → key exchange → encrypted data",
        "TLS 1.3 completes in 1 RTT; TLS 1.2 takes 2 RTTs",
        "Certificates prove server identity — signed by trusted CAs (Let's Encrypt, DigiCert)",
        "HSTS forces browsers to always use HTTPS — prevents downgrade attacks"
      ],
      "tryIt": "Run openssl s_client -connect example.com:443 and read the certificate details — note the subject, issuer, and expiry date. Check the TLS version and cipher suite. Run curl -sI https://example.com | grep -i strict to check for HSTS. Test a site's TLS configuration at ssllabs.com/ssltest."
    }
  },


  {
    "id": 94,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "HTTP/2: Multiplexing and Performance",
    "type": "lesson",
    "content": {
      "body": "HTTP/1.1 has a fundamental performance problem: each request blocks the connection until the response is received. Loading a page with 50 resources requires either 50 sequential requests or multiple parallel connections. HTTP/2 solves this with multiplexing.\n\n## HTTP/2 Key Features\n\n**Multiplexing** — multiple requests and responses can be in flight simultaneously over a single TCP connection. No more head-of-line blocking at the HTTP level.\n\n**Header compression (HPACK)** — HTTP headers are repetitive. HPACK compresses them using a shared dictionary. A typical request goes from 500 bytes of headers to 50 bytes.\n\n**Server push** — the server can proactively send resources the client will need before the client asks. When you request index.html, the server can push style.css immediately.\n\n**Binary framing** — HTTP/2 uses binary encoding instead of text. More efficient to parse.\n\n**Stream prioritisation** — clients can assign priorities to streams. Critical CSS can be prioritised over images.\n\n## HTTP/2 Requirements\n\nHTTP/2 requires HTTPS in practice — all browsers only implement HTTP/2 over TLS. It is supported by all modern browsers and approximately 65% of websites.",
      "diagram": "flowchart LR\n    A[\"HTTP/1.1\nRequest 1 then Response 1\nRequest 2 then Response 2\nsequential\"] --> C[\"Comparison\"]\n    B[\"HTTP/2\nRequest 1 + 2 + 3\nsimultaneously\nmultiplexed\"] --> C\n    C --> D[\"HTTP/2 loads pages\n2-3x faster on\nhigh-latency links\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "HTTP/2 multiplexing sends all requests simultaneously over one connection — major performance improvement",
      "code": "# Testing HTTP/2\n\n# Check if a site uses HTTP/2:\ncurl -sI --http2 https://www.google.com | head -1\n# HTTP/2 200\n\n# Force HTTP/1.1 for comparison:\ncurl -sI --http1.1 https://www.google.com | head -1\n# HTTP/1.1 200\n\n# See HTTP/2 in verbose output:\ncurl -v --http2 https://www.google.com 2>&1 | grep -E 'HTTP|h2'\n# * Using HTTP2, server supports multiplexing\n# * h2 [:status: 200]\n\n# Check HTTP version in browser:\n# Chrome DevTools: Network tab, Protocol column\n# h2 = HTTP/2, http/1.1 = HTTP/1.1, h3 = HTTP/3\n\n# Check if nginx is configured for HTTP/2:\n# /etc/nginx/sites-available/default:\n# listen 443 ssl http2;\n\n# HTTP/2 header compression:\n# First request: ~500 bytes of headers\n# Subsequent requests: ~50 bytes (only changed headers sent)",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "HTTP/2 server push is being deprecated in favour of the Link preload header. Instead of the server pushing resources, the server sends a Link header telling the browser to preload specific resources. This is simpler and avoids the problem of pushing resources the browser already has cached."
      },
      "keyPoints": [
        "HTTP/2 multiplexing: multiple requests/responses simultaneously over one TCP connection",
        "HPACK header compression reduces header size from ~500 bytes to ~50 bytes",
        "HTTP/2 requires HTTPS in practice — all browsers only implement it over TLS",
        "Binary framing replaces HTTP/1.1 text format — more efficient to parse",
        "HTTP/3 (QUIC) solves the remaining TCP head-of-line blocking that HTTP/2 cannot"
      ],
      "tryIt": "Run curl -sI --http2 https://www.google.com | head -1 and confirm HTTP/2 is in use. Then run curl -sI --http1.1 https://www.google.com | head -1 to force HTTP/1.1. Open Chrome DevTools Network tab and check the Protocol column for a few requests — identify which use h2 (HTTP/2) and which use h3 (HTTP/3)."
    }
  },

  {
    "id": 95,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "WebSockets and Real-Time Communication",
    "type": "lesson",
    "content": {
      "body": "HTTP is a request-response protocol — the client asks, the server answers. For real-time applications (chat, live updates, gaming, collaborative editing), this model is inefficient. WebSockets provide a persistent, bidirectional connection over a single TCP connection.\n\n## The Problem with HTTP Polling\n\nBefore WebSockets, real-time apps used polling: the client sends a request every second asking for updates. This wastes bandwidth, adds latency, and scales poorly. Long polling improved this — the server holds the request open until it has data — but still creates a new connection for each update.\n\n## WebSocket Handshake\n\nWebSockets start as an HTTP request and upgrade to the WebSocket protocol. The client sends an Upgrade: websocket header. The server responds with 101 Switching Protocols. After that, both sides can send messages at any time without a new request.\n\n## WebSocket vs HTTP\n\n- HTTP: request-response, new connection per request, headers on every message\n- WebSocket: bidirectional, persistent connection, minimal framing overhead\n\n## Server-Sent Events (SSE)\n\nFor one-way real-time updates (server to client only), SSE is simpler than WebSockets. The client makes one HTTP request and the server streams data indefinitely. Used for live feeds, notifications, and streaming AI responses.",
      "diagram": "flowchart TD\n    A[\"HTTP Polling\nclient asks every second\nwasteful\"] --> D[\"Real-time options\"]\n    B[\"WebSocket\npersistent bidirectional\nboth sides send anytime\"] --> D\n    C[\"SSE\nserver to client only\nsimpler than WebSocket\"] --> D\n    D --> E[\"Bidirectional? WebSocket\nServer-only? SSE\nSimple? Polling\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "WebSockets for bidirectional real-time; SSE for server-to-client streams; polling as last resort",
      "code": "# WebSocket testing\n\n# Install wscat (WebSocket client):\nnpm install -g wscat\n\n# Connect to a WebSocket echo server:\nwscat -c wss://echo.websocket.org\n# Connected (press CTRL+C to quit)\n# > Hello\n# < Hello\n\n# WebSocket handshake in curl (shows upgrade):\ncurl -v --no-buffer \\\n  -H 'Upgrade: websocket' \\\n  -H 'Connection: Upgrade' \\\n  -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZQ==' \\\n  -H 'Sec-WebSocket-Version: 13' \\\n  https://echo.websocket.org 2>&1 | head -20\n# HTTP/1.1 101 Switching Protocols\n# Upgrade: websocket\n# Connection: Upgrade\n\n# Capture WebSocket traffic:\nsudo tcpdump -i eth0 -n port 443\n# After TLS handshake, look for HTTP 101 upgrade\n\n# SSE test:\ncurl -N https://httpbin.org/sse/3\n# data: {event: 1}\n# data: {event: 2}\n# data: {event: 3}",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "ChatGPT's streaming responses use Server-Sent Events (SSE). When you see text appearing word by word, the server is streaming an SSE response — one HTTP connection, data flowing continuously from server to client. You can see this in Chrome DevTools: Network tab, filter by EventStream, and watch the data arrive in real time."
      },
      "keyPoints": [
        "WebSockets upgrade from HTTP — 101 Switching Protocols, then bidirectional persistent connection",
        "HTTP polling wastes bandwidth; WebSockets eliminate the overhead of repeated requests",
        "SSE: one HTTP request, server streams data indefinitely — simpler than WebSockets for one-way",
        "Use WebSockets for bidirectional (chat, gaming); SSE for server-to-client (feeds, AI streaming)",
        "WebSocket URL scheme: ws:// (plain) or wss:// (TLS)"
      ],
      "tryIt": "Install wscat and connect to wss://echo.websocket.org. Send a few messages and observe the echo responses. Then open Chrome DevTools, go to the Network tab, filter by WS, and visit a site that uses WebSockets (like a chat app). Watch the WebSocket frames in real time."
    }
  },

  {
    "id": 96,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "Proxies: Forward and Reverse",
    "type": "lesson",
    "content": {
      "body": "A proxy is an intermediary that sits between a client and a server. Proxies are used for caching, load balancing, security filtering, anonymity, and SSL termination. Understanding the difference between forward and reverse proxies is essential for network and application architecture.\n\n## Forward Proxy\n\nA forward proxy sits between clients and the internet. Clients send requests to the proxy, which forwards them to the destination server. The server sees the proxy's IP, not the client's.\n\nUse cases:\n- Corporate web filtering — block access to certain sites\n- Anonymity — hide client IP from servers\n- Caching — cache responses for multiple clients\n- Bypassing geo-restrictions\n\n## Reverse Proxy\n\nA reverse proxy sits in front of servers. Clients send requests to the proxy, which forwards them to one of the backend servers. Clients see only the proxy's IP.\n\nUse cases:\n- Load balancing — distribute requests across multiple servers\n- SSL termination — handle TLS at the proxy, plain HTTP to backends\n- Caching — cache responses before they reach the backend\n- Security — hide backend server details, WAF integration\n- Path-based routing — /api to one server, /static to another\n\nNginx, HAProxy, Caddy, and AWS ALB are all reverse proxies.",
      "diagram": "flowchart LR\n    A[\"Client\"] -->|\"request\"|B[\"Forward Proxy\"]\n    B -->|\"forwarded\"|C[\"Internet\"]\n    D[\"Client\"] -->|\"request\"|E[\"Reverse Proxy\nnginx HAProxy\"]\n    E -->|\"backend 1\"|F[\"Server A\"]\n    E -->|\"backend 2\"|G[\"Server B\"]\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style E fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Forward proxy: client-side intermediary. Reverse proxy: server-side intermediary for load balancing and SSL termination",
      "code": "# Proxy configuration\n\n# Use a forward proxy with curl:\ncurl -x http://proxy.example.com:8080 https://example.com\n\n# Set proxy via environment variable:\nexport http_proxy=http://proxy.example.com:8080\nexport https_proxy=http://proxy.example.com:8080\ncurl https://example.com\n\n# Basic nginx reverse proxy config:\n# /etc/nginx/sites-available/default:\n# server {\n#   listen 80;\n#   server_name example.com;\n#\n#   location / {\n#     proxy_pass http://localhost:3000;\n#     proxy_set_header Host $host;\n#     proxy_set_header X-Real-IP $remote_addr;\n#   }\n# }\n\n# nginx load balancer:\n# upstream backend {\n#   server 192.168.1.10:3000;\n#   server 192.168.1.11:3000;\n#   server 192.168.1.12:3000;\n# }\n# location / { proxy_pass http://backend; }\n\n# Check if a site uses a reverse proxy:\ncurl -sI https://example.com | grep -i 'server|via|x-powered'\n# server: nginx  (reverse proxy identified)",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "SSL termination at the reverse proxy is the standard pattern for production deployments. The proxy handles TLS (certificate management, cipher negotiation) and communicates with backends over plain HTTP on the internal network. This simplifies backend configuration and centralises certificate management. Let's Encrypt with Certbot or Caddy automates this entirely."
      },
      "keyPoints": [
        "Forward proxy: sits in front of clients — web filtering, anonymity, caching",
        "Reverse proxy: sits in front of servers — load balancing, SSL termination, caching, security",
        "SSL termination: proxy handles TLS, backends receive plain HTTP on internal network",
        "nginx, HAProxy, Caddy, and AWS ALB are all reverse proxies",
        "X-Real-IP and X-Forwarded-For headers pass the original client IP to backends"
      ],
      "tryIt": "Configure nginx as a reverse proxy on a Linux VM: install nginx, create a simple backend (python3 -m http.server 3000), and configure nginx to proxy requests from port 80 to port 3000. Verify with curl http://localhost. Then add a second backend on port 3001 and configure nginx as a load balancer."
    }
  },

  {
    "id": 97,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "HTTP Headers Deep Dive",
    "type": "lesson",
    "content": {
      "body": "HTTP headers carry metadata about requests and responses. Understanding the most important headers makes you better at debugging, security, caching, and API design.\n\n## Request Headers\n\n**Host** — the domain being requested. Required in HTTP/1.1. Enables virtual hosting (multiple sites on one IP).\n\n**Authorization** — credentials for authentication. Bearer tokens, Basic auth.\n\n**Content-Type** — the format of the request body. application/json, multipart/form-data, text/plain.\n\n**Accept** — what response formats the client accepts. application/json, text/html.\n\n**User-Agent** — identifies the client software. Browsers, curl, mobile apps.\n\n**Cookie** — sends stored cookies to the server.\n\n## Response Headers\n\n**Content-Type** — the format of the response body.\n\n**Cache-Control** — caching instructions. max-age=3600, no-cache, no-store, private.\n\n**Set-Cookie** — instructs the browser to store a cookie.\n\n**Location** — used with 3xx redirects to specify the new URL.\n\n**Strict-Transport-Security** — HSTS, forces HTTPS.\n\n**Access-Control-Allow-Origin** — CORS header, controls cross-origin access.\n\n**X-Frame-Options** — prevents clickjacking by controlling iframe embedding.",
      "diagram": "flowchart TD\n    A[\"Request Headers\"] --> B[\"Host\nAuthorization\nContent-Type\nAccept\nCookie\"]\n    C[\"Response Headers\"] --> D[\"Content-Type\nCache-Control\nSet-Cookie\nLocation\nHSTS CORS\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Key HTTP headers — request headers describe the request, response headers describe the response and control behaviour",
      "code": "# HTTP headers in practice\n\n# See all response headers:\ncurl -sI https://example.com\n\n# Send custom request headers:\ncurl -H 'Authorization: Bearer mytoken' \\\n     -H 'Accept: application/json' \\\n     https://api.example.com/users\n\n# Check cache headers:\ncurl -sI https://example.com | grep -i cache\n# cache-control: max-age=86400\n# etag: abc123\n\n# Check security headers:\ncurl -sI https://example.com | grep -i -E 'strict|frame|content-security|x-content'\n# strict-transport-security: max-age=31536000\n# x-frame-options: DENY\n# x-content-type-options: nosniff\n\n# Check CORS headers:\ncurl -H 'Origin: https://other.com' -sI https://api.example.com\n# access-control-allow-origin: *\n\n# Decode a JWT token (Authorization: Bearer):\n# JWT has three parts: header.payload.signature\n# Decode payload (base64):\necho 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSJ9.xxx' | cut -d. -f2 | base64 -d 2>/dev/null",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Missing security headers are a common web vulnerability. Every production site should have: Strict-Transport-Security (HSTS), X-Frame-Options (prevent clickjacking), X-Content-Type-Options: nosniff (prevent MIME sniffing), and Content-Security-Policy (prevent XSS). Check your site at securityheaders.com."
      },
      "keyPoints": [
        "Host header enables virtual hosting — multiple sites on one IP address",
        "Authorization header carries credentials — Bearer tokens, Basic auth",
        "Cache-Control controls caching — max-age, no-cache, no-store, private",
        "HSTS (Strict-Transport-Security) forces HTTPS — prevents downgrade attacks",
        "Security headers (X-Frame-Options, CSP, nosniff) prevent common web attacks"
      ],
      "tryIt": "Run curl -sI https://example.com and identify every response header. For each header, look up its purpose. Then check your own site or a site you manage at securityheaders.com — identify any missing security headers and add them to your web server configuration."
    }
  },

  {
    "id": 98,
    "moduleId": 9,
    "moduleTitle": "HTTP, HTTPS & Web Communication Fundamentals",
    "title": "Module 9 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered HTTP and HTTPS — the protocols that power the web and most modern APIs. Every web developer, backend engineer, and security professional works with these protocols daily.\n\n## What You Learned\n\n**HTTP structure** — request line + headers + body. Response status + headers + body.\n\n**HTTP methods** — GET (retrieve), POST (create), PUT (replace), PATCH (update), DELETE (remove). GET/PUT/DELETE are idempotent.\n\n**Status codes** — 2xx success, 3xx redirect, 4xx client error, 5xx server error. 401 = unauthenticated, 403 = unauthorised.\n\n**HTTPS/TLS** — encryption, authentication, integrity. TLS handshake negotiates cipher and verifies certificate. TLS 1.3 = 1 RTT.\n\n**HTTP/2** — multiplexing, HPACK compression, binary framing. Requires HTTPS. 2-3x faster than HTTP/1.1 on high-latency links.\n\n**WebSockets** — persistent bidirectional connection. Upgrade from HTTP via 101. SSE for server-to-client only.\n\n**Proxies** — forward proxy (client-side), reverse proxy (server-side, load balancing, SSL termination).\n\n**Headers** — Host, Authorization, Content-Type, Cache-Control, HSTS, CORS, security headers.\n\n## What Is Coming Next\n\nModule 10 covers firewalls and network security — packet filtering, stateful inspection, and defence in depth.",
      "diagram": "flowchart TD\n    A[\"✅ HTTP structure\nrequest response methods\"] --> B[\"✅ Status codes\n2xx 3xx 4xx 5xx\"]\n    B --> C[\"✅ HTTPS TLS\nhandshake certificates\"]\n    C --> D[\"✅ HTTP/2\nmultiplexing compression\"]\n    D --> E[\"✅ WebSockets SSE\nreal-time\"]\n    E --> F[\"✅ Proxies\nforward reverse\"]\n    F --> G[\"➡️ Firewalls\nModule 10\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 9 complete — HTTP from basic request/response to TLS, HTTP/2, WebSockets, and proxies",
      "code": "# Module 9 command reference\n\n# Basic HTTP request:\ncurl https://example.com\ncurl -v https://example.com  # verbose\ncurl -sI https://example.com  # headers only\n\n# HTTP methods:\ncurl -X POST https://httpbin.org/post -d 'data'\ncurl -X DELETE https://httpbin.org/delete\n\n# Status code only:\ncurl -s -o /dev/null -w '%{http_code}' https://example.com\n\n# TLS inspection:\nopenssl s_client -connect example.com:443\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates\n\n# HTTP/2 check:\ncurl -sI --http2 https://example.com | head -1\n\n# Security headers:\ncurl -sI https://example.com | grep -i -E 'strict|frame|csp|x-content'\n\n# Follow redirects:\ncurl -L https://example.com",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most important HTTP debugging workflow: curl -v for full request/response, curl -sI for headers only, curl -s -o /dev/null -w '%{http_code}' for status code only. These three forms cover almost every HTTP debugging scenario you will encounter."
      },
      "keyPoints": [
        "HTTP: request (method + path + headers + body) → response (status + headers + body)",
        "Status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error",
        "HTTPS = HTTP + TLS — encryption, authentication, integrity",
        "HTTP/2: multiplexing over one connection, HPACK compression, requires HTTPS",
        "Reverse proxy: load balancing, SSL termination, caching — nginx, HAProxy, Caddy"
      ],
      "tryIt": "Complete an HTTP audit: use curl -v to inspect a full request/response, check TLS certificate details with openssl s_client, verify HTTP/2 is in use, check security headers, and configure nginx as a reverse proxy. Document what you find and fix any missing security headers."
    }
  },

  // =========================
  // Networking Module 10: Firewalls, Network Security Basics & Traffic Filtering
  // =========================

  {
    "id": 99,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Welcome to Firewalls and Network Security",
    "type": "lesson",
    "content": {
      "body": "A firewall is a network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules. It establishes a barrier between trusted internal networks and untrusted external networks. Understanding firewalls is foundational to network security.\n\n## What This Module Covers\n\n- What firewalls are and why they exist\n- Packet filtering — stateless and stateful\n- Application-layer firewalls and deep packet inspection\n- Inbound vs outbound rules\n- Defence in depth — layering security controls\n- WAF (Web Application Firewall) and DMZ architecture\n\n## Why Firewalls Matter\n\nWithout a firewall, every service running on a machine is potentially reachable from the internet. A firewall enforces the principle of least privilege at the network level — only explicitly allowed traffic gets through. Everything else is blocked by default.",
      "diagram": "flowchart LR\n    A[\"Internet\nunstrusted\"] -->|\"traffic\"|B[\"Firewall\nallow/deny rules\"]\n    B -->|\"allowed\"|C[\"Internal Network\ntrusted\"]\n    B -->|\"blocked\"|D[\"Dropped\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Firewall sits between untrusted and trusted networks — allows permitted traffic, drops everything else",
      "code": "# Firewall quick reference\n\n# View current iptables rules:\nsudo iptables -L -n -v\n\n# View nftables rules:\nsudo nft list ruleset\n\n# Check what ports are open on your machine:\nss -tlnp  # listening TCP ports\nss -ulnp  # listening UDP ports\n\n# Check what is reachable from outside:\nnmap -p 1-1000 <your-public-ip>\n\n# Quick firewall status check:\nsudo ufw status verbose  # Ubuntu UFW\nsudo firewall-cmd --list-all  # RHEL/CentOS firewalld",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The default posture for any firewall should be deny-all, then explicitly allow what is needed. Starting with allow-all and trying to block specific threats is a losing strategy — you will always miss something. Start locked down and open only what is required."
      },
      "keyPoints": [
        "Firewalls control traffic based on rules — default deny is the correct starting posture",
        "Firewalls enforce least privilege at the network level",
        "Every open port is an attack surface — only expose what is necessary",
        "Linux firewalls: iptables (classic), nftables (modern), UFW (simplified frontend)",
        "nmap from outside shows what the internet can actually reach on your machine"
      ],
      "tryIt": "Run ss -tlnp to see all listening ports on your machine. For each port, ask: does this need to be reachable from the internet? Run sudo iptables -L -n -v to see your current firewall rules. If there are no rules, your machine is relying entirely on the router's NAT for protection."
    }
  },

  {
    "id": 100,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Packet Filtering: Stateless and Stateful",
    "type": "lesson",
    "content": {
      "body": "Packet filtering is the most fundamental firewall technique. It examines each packet and decides whether to allow or drop it based on rules. There are two types: stateless (examines each packet independently) and stateful (tracks connection state).\n\n## Stateless Packet Filtering\n\nStateless firewalls examine each packet in isolation — source IP, destination IP, source port, destination port, protocol. They have no memory of previous packets.\n\nProblem: to allow a reply to an outbound connection, you must explicitly allow inbound traffic on the reply port. This means either opening a wide range of ports or writing complex rules.\n\n## Stateful Packet Filtering\n\nStateful firewalls track the state of network connections. They maintain a connection table. When an outbound connection is established, the firewall automatically allows the reply traffic — no explicit inbound rule needed.\n\nConnection states:\n- **NEW** — first packet of a new connection\n- **ESTABLISHED** — part of an existing connection\n- **RELATED** — related to an existing connection (e.g. FTP data channel)\n- **INVALID** — does not match any known connection\n\nThe ESTABLISHED,RELATED rule is the most important rule in any stateful firewall — it allows all reply traffic for connections initiated from inside.",
      "diagram": "flowchart TD\n    A[\"Stateless\neach packet independent\"] --> B[\"Must explicitly allow\nreply traffic\"]\n    C[\"Stateful\ntracks connections\"] --> D[\"Connection table\"]\n    D --> E[\"NEW: first packet\"]\n    D --> F[\"ESTABLISHED: reply\"]\n    D --> G[\"RELATED: associated\"]\n    C --> H[\"Automatically allows\nreply traffic\"]\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534\n    style A fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "Stateful firewalls track connection state — ESTABLISHED/RELATED automatically allows reply traffic",
      "code": "# Stateful firewall with iptables\n\n# The essential stateful rule — allow established connections:\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# Allow loopback:\nsudo iptables -A INPUT -i lo -j ACCEPT\n\n# Allow specific inbound services:\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # SSH\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # HTTP\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT  # HTTPS\nsudo iptables -A INPUT -p icmp -j ACCEPT             # ping\n\n# Default deny (must come AFTER allow rules):\nsudo iptables -P INPUT DROP\n\n# View connection tracking table:\nsudo conntrack -L\n# tcp 6 ESTABLISHED src=192.168.1.50 dst=8.8.8.8 sport=54321 dport=443\n\n# nftables equivalent:\nsudo nft add table inet filter\nsudo nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }\nsudo nft add rule inet filter input ct state established,related accept\nsudo nft add rule inet filter input tcp dport { 22, 80, 443 } accept",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Always add the ESTABLISHED,RELATED rule before setting the default policy to DROP — and always allow SSH before dropping everything else. If you set the default policy to DROP without allowing SSH first, you will lock yourself out of the machine. If this happens on a remote server, you need console access to recover."
      },
      "keyPoints": [
        "Stateless: examines each packet independently — must explicitly allow reply traffic",
        "Stateful: tracks connection state — automatically allows ESTABLISHED and RELATED traffic",
        "Connection states: NEW, ESTABLISHED, RELATED, INVALID",
        "ESTABLISHED,RELATED rule is the most important rule in any stateful firewall",
        "Always allow SSH and ESTABLISHED before setting default policy to DROP"
      ],
      "tryIt": "Configure a stateful iptables firewall: add ESTABLISHED,RELATED, allow loopback, allow SSH, allow HTTP/HTTPS, then set default DROP. Verify SSH still works, HTTP is allowed, and a random port like 8080 is blocked with nc -zv localhost 8080. Then translate the same rules to nftables."
    }
  },

  {
    "id": 101,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Application-Layer Firewalls and Deep Packet Inspection",
    "type": "lesson",
    "content": {
      "body": "Traditional packet filtering operates at Layers 3 and 4 — it sees IP addresses and port numbers but not the content of the traffic. Application-layer firewalls go deeper, inspecting the actual content of packets to make more intelligent filtering decisions.\n\n## Deep Packet Inspection (DPI)\n\nDPI examines the payload of packets, not just the headers. It can:\n- Identify the application protocol regardless of port (e.g. detect HTTP on port 8080)\n- Block specific content within allowed protocols\n- Detect malware signatures in traffic\n- Enforce application-specific policies\n\n## Next-Generation Firewalls (NGFW)\n\nNGFWs combine traditional packet filtering with DPI, intrusion prevention, SSL inspection, and application awareness. They can identify and control specific applications (block Facebook but allow LinkedIn) rather than just ports.\n\n## SSL/TLS Inspection\n\nMost traffic is now encrypted. To inspect HTTPS traffic, NGFWs perform SSL inspection (also called SSL interception or man-in-the-middle): they terminate the TLS connection, inspect the plaintext, then re-encrypt to the destination. This requires installing the firewall's CA certificate on client devices.\n\n## WAF — Web Application Firewall\n\nA WAF operates at Layer 7 specifically for HTTP/HTTPS. It blocks web-specific attacks: SQL injection, XSS, path traversal, and rate limiting. WAFs can be deployed as hardware, software (ModSecurity), or cloud services (Cloudflare, AWS WAF).",
      "diagram": "flowchart TD\n    A[\"Traffic\"] --> B[\"L3/L4 Firewall\nIP port protocol\"]\n    B --> C[\"DPI\npayload inspection\"]\n    C --> D[\"Application ID\nHTTP BitTorrent SSH\"]\n    C --> E[\"Content filtering\nmalware signatures\"]\n    C --> F[\"WAF\nSQL injection XSS\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style B fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Application-layer firewalls inspect packet content — DPI identifies applications, WAF blocks web attacks",
      "code": "# Application-layer filtering\n\n# iptables Layer 7 matching (requires l7-filter):\n# Match HTTP traffic regardless of port:\n# iptables -A FORWARD -m layer7 --l7proto http -j ACCEPT\n\n# nftables with string matching:\n# Block requests containing SQL injection pattern:\nsudo nft add rule inet filter input \\\n  tcp dport 80 \\\n  @th,160,160 0x53454c454354 drop\n# (matches SELECT in hex)\n\n# ModSecurity WAF (nginx):\n# Install: sudo apt install libnginx-mod-security2\n# Enable in nginx.conf:\n# modsecurity on;\n# modsecurity_rules_file /etc/nginx/modsecurity/main.conf;\n\n# Test WAF is blocking SQL injection (your own server only):\ncurl 'http://localhost/?id=1+OR+1=1'\n# Should return 403 if WAF is active\n\n# Cloudflare WAF (free tier):\n# Add site to Cloudflare → Security → WAF\n# Enable OWASP Core Rule Set\n# Monitor blocked requests in Firewall Events",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "SSL inspection is controversial. It breaks end-to-end encryption and requires clients to trust the firewall's CA certificate. It can expose sensitive data (passwords, banking details) to the firewall operator. In enterprise environments it is common for corporate devices. On personal devices or in privacy-sensitive contexts, it is a significant concern."
      },
      "keyPoints": [
        "DPI inspects packet payload — identifies applications regardless of port number",
        "NGFWs combine packet filtering, DPI, IPS, SSL inspection, and application awareness",
        "SSL inspection terminates TLS to inspect encrypted traffic — requires CA cert on clients",
        "WAF operates at Layer 7 for HTTP — blocks SQL injection, XSS, path traversal",
        "Cloudflare WAF (free tier) provides OWASP rule set protection with no infrastructure"
      ],
      "tryIt": "Enable ModSecurity on an nginx server and test it by sending a request with a SQL injection pattern in the URL. Confirm it returns 403. Then sign up for Cloudflare's free tier, add a test domain, and enable the WAF. Check the Firewall Events dashboard after sending some test requests."
    }
  },

  {
    "id": 102,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "WAF and DMZ Architecture",
    "type": "lesson",
    "content": {
      "body": "A WAF (Web Application Firewall) and DMZ (Demilitarised Zone) are two complementary security controls that protect web-facing infrastructure. Together they implement defence in depth — multiple layers of security so that compromising one layer does not give an attacker access to everything.\n\n## WAF in Practice\n\nA WAF sits in front of web servers and inspects every HTTP request. It blocks:\n- SQL injection — malicious SQL in form fields or URL parameters\n- XSS (Cross-Site Scripting) — malicious JavaScript in inputs\n- Path traversal — attempts to access files outside the web root\n- Rate limiting — too many requests from one IP (DDoS mitigation)\n\n## DMZ Architecture\n\nA DMZ is a network segment between the internet and the internal network. Public-facing servers (web, email, DNS) live in the DMZ. The internal network (databases, file servers, workstations) is behind a second firewall.\n\nInternet → Firewall 1 → DMZ (web servers) → Firewall 2 → Internal network\n\nIf an attacker compromises a web server in the DMZ, they still face Firewall 2 before reaching the internal network. The DMZ limits the blast radius of a breach.\n\n## Defence in Depth\n\nNo single security control is perfect. Layering multiple controls — WAF + DMZ + network firewall + host firewall + IDS/IPS — means an attacker must bypass all of them. Each layer buys time and increases the chance of detection.",
      "diagram": "flowchart LR\n    A[\"Internet\"] -->|\"HTTP/HTTPS\"|B[\"WAF\nSQL injection\nXSS rate limiting\"]\n    B --> C[\"DMZ\nWeb servers\nEmail DNS\"]\n    C -->|\"Firewall 2\nstrict rules\"|D[\"Internal\nDatabases\nWorkstations\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "WAF filters application attacks; DMZ isolates public servers; Firewall 2 protects the internal network",
      "code": "# DMZ firewall rules (iptables conceptual)\n\n# Firewall 1 — Internet to DMZ:\n# Allow web traffic to web server:\nsudo iptables -A FORWARD -p tcp -d 10.0.1.10 --dport 80 -j ACCEPT\nsudo iptables -A FORWARD -p tcp -d 10.0.1.10 --dport 443 -j ACCEPT\n# Allow email to mail server:\nsudo iptables -A FORWARD -p tcp -d 10.0.1.20 --dport 25 -j ACCEPT\n# Block everything else to DMZ:\nsudo iptables -A FORWARD -d 10.0.1.0/24 -j DROP\n\n# Firewall 2 — DMZ to Internal:\n# Allow web server to reach database only:\nsudo iptables -A FORWARD -p tcp -s 10.0.1.10 -d 10.0.2.10 --dport 5432 -j ACCEPT\n# Block all other DMZ to internal traffic:\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.2.0/24 -j DROP\n\n# Verify DMZ isolation:\n# From web server in DMZ, try to reach internal workstation:\n# ping 10.0.2.50  → should fail (blocked by Firewall 2)\n# psql -h 10.0.2.10 -U app  → should work (explicitly allowed)",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The minimum viable DMZ for a small web application: put the web server in a separate subnet, allow only ports 80/443 inbound from the internet, and allow only the specific database port from the web server to the database. Block everything else. This simple architecture stops most lateral movement attacks."
      },
      "keyPoints": [
        "WAF blocks application-layer attacks: SQL injection, XSS, path traversal, rate limiting",
        "DMZ isolates public-facing servers from the internal network using two firewalls",
        "If DMZ server is compromised, Firewall 2 prevents lateral movement to internal network",
        "Defence in depth: WAF + DMZ + network firewall + host firewall — each layer adds protection",
        "Firewall 2 should only allow specific ports from DMZ to internal (e.g. DB port only)"
      ],
      "tryIt": "Design a DMZ architecture for a web application with a web server and a database. Define the firewall rules for both Firewall 1 (internet to DMZ) and Firewall 2 (DMZ to internal). Implement it in a three-VM lab and verify: web traffic reaches the web server, the web server can reach the database, but the web server cannot reach any other internal resource."
    }
  },


  {
    "id": 103,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Inbound vs Outbound Rules",
    "type": "lesson",
    "content": {
      "body": "Firewall rules apply to traffic in two directions: inbound (traffic coming into your network or machine) and outbound (traffic leaving). Most people focus on inbound rules, but outbound rules are equally important for security.\n\n## Inbound Rules\n\nInbound rules control what external traffic can reach your services. The default posture should be deny-all inbound, then explicitly allow:\n- SSH (port 22) from trusted IPs only\n- HTTP/HTTPS (80/443) from anywhere if running a web server\n- Application-specific ports from specific sources\n\n## Outbound Rules\n\nOutbound rules control what your machine can connect to. Most firewalls allow all outbound by default — this is a security risk. Malware on a compromised machine can freely exfiltrate data or connect to command-and-control servers.\n\nStrict outbound rules:\n- Allow DNS (UDP 53) to specific resolvers\n- Allow HTTP/HTTPS (80/443) to the internet\n- Allow specific application ports to specific destinations\n- Block everything else\n\n## The FORWARD Chain\n\nFor machines acting as routers or firewalls, the FORWARD chain controls traffic passing through the machine (not destined for the machine itself). This is where you implement DMZ rules and inter-subnet filtering.\n\n## Rule Order\n\nFirewall rules are evaluated in order — the first matching rule wins. Put more specific rules before more general ones. The default policy (ACCEPT or DROP) applies when no rule matches.",
      "diagram": "flowchart TD\n    A[\"Inbound\nfrom internet\"] --> B[\"INPUT chain\ncontrols what reaches\nthis machine\"]\n    C[\"Outbound\nto internet\"] --> D[\"OUTPUT chain\ncontrols what this\nmachine sends\"]\n    E[\"Through traffic\"] --> F[\"FORWARD chain\ncontrols routed traffic\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Three chains: INPUT (inbound to machine), OUTPUT (outbound from machine), FORWARD (routed through machine)",
      "code": "# Inbound and outbound firewall rules\n\n# --- Inbound rules (INPUT chain) ---\n# Allow established connections first:\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -i lo -j ACCEPT\n\n# Allow SSH from specific IP only:\nsudo iptables -A INPUT -p tcp -s 203.0.113.10 --dport 22 -j ACCEPT\n\n# Allow web traffic from anywhere:\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\n\n# Default deny inbound:\nsudo iptables -P INPUT DROP\n\n# --- Outbound rules (OUTPUT chain) ---\n# Allow established connections:\nsudo iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\n\n# Allow DNS:\nsudo iptables -A OUTPUT -p udp --dport 53 -j ACCEPT\n\n# Allow HTTP/HTTPS:\nsudo iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT\n\n# Default deny outbound (strict):\nsudo iptables -P OUTPUT DROP\n\n# Test outbound restriction:\ncurl https://example.com  # should work (port 443 allowed)\nnc -zv example.com 8080   # should fail (port 8080 blocked)",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Setting a default DROP policy on the OUTPUT chain will break many things — NTP, DNS, package updates, and any service that makes outbound connections. Always add ESTABLISHED,RELATED before setting OUTPUT to DROP, and test thoroughly. On servers, strict outbound rules are worth the effort. On developer workstations, they are usually too restrictive."
      },
      "keyPoints": [
        "INPUT chain: controls inbound traffic to the machine — default deny, allow specific services",
        "OUTPUT chain: controls outbound traffic from the machine — often left open, should be restricted",
        "FORWARD chain: controls traffic routed through the machine — used for DMZ and inter-subnet rules",
        "Rules are evaluated in order — first match wins, default policy applies if no match",
        "Outbound restrictions prevent compromised machines from exfiltrating data or calling home"
      ],
      "tryIt": "Add strict outbound rules to a test VM: allow DNS, HTTP, HTTPS, and ESTABLISHED, then set OUTPUT to DROP. Verify curl https://example.com works but nc -zv example.com 8080 fails. Then try to ping 8.8.8.8 — it should fail because ICMP outbound is not allowed. Add an ICMP rule to fix it."
    }
  },

  {
    "id": 104,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Defence in Depth",
    "type": "lesson",
    "content": {
      "body": "Defence in depth is the security principle of layering multiple independent security controls so that the failure of any single control does not result in a complete breach. No single security measure is perfect — defence in depth assumes that every control will eventually be bypassed and plans accordingly.\n\n## The Layers\n\n**Perimeter firewall** — blocks unwanted traffic at the network boundary. First line of defence.\n\n**DMZ** — isolates public-facing servers. Limits blast radius if a server is compromised.\n\n**Host-based firewall** — iptables/nftables on each server. Protects even if the perimeter firewall is bypassed.\n\n**WAF** — blocks application-layer attacks that network firewalls cannot see.\n\n**IDS/IPS** — detects and blocks attack patterns in traffic.\n\n**Patch management** — keeps software up to date to eliminate known vulnerabilities.\n\n**Least privilege** — services run with minimum required permissions. A compromised service cannot access what it does not need.\n\n**Monitoring and alerting** — detects breaches that bypass all other controls.\n\n## Why Each Layer Matters\n\nAn attacker who bypasses the perimeter firewall still faces the host firewall. An attacker who exploits a web vulnerability still faces the WAF. An attacker who compromises a DMZ server still faces Firewall 2. Each layer buys time and increases the chance of detection.",
      "diagram": "flowchart TD\n    A[\"Internet\"] --> B[\"Perimeter Firewall\"]\n    B --> C[\"WAF\"]\n    C --> D[\"DMZ\"]\n    D --> E[\"Internal Firewall\"]\n    E --> F[\"Host Firewall\"]\n    F --> G[\"Application\"]\n    G --> H[\"Monitoring\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Defence in depth: each layer is independent — bypassing one does not give access to everything",
      "code": "# Defence in depth checklist\n\n# 1. Perimeter firewall — check open ports:\nnmap -p 1-65535 <your-public-ip>\n# Only expected ports should be open\n\n# 2. Host firewall — check rules:\nsudo iptables -L -n -v\n# Should have explicit allow rules and default DROP\n\n# 3. Service exposure — check what is listening:\nss -tlnp\n# Services should only listen on necessary interfaces\n# Bad:  0.0.0.0:5432 (PostgreSQL exposed to all interfaces)\n# Good: 127.0.0.1:5432 (PostgreSQL only on localhost)\n\n# 4. Patch status:\nsudo apt list --upgradable 2>/dev/null | wc -l\n# Should be 0 or close to 0\n\n# 5. Running services — disable unnecessary ones:\nsystemctl list-units --type=service --state=running\n# Disable anything not needed:\nsudo systemctl disable --now <service>\n\n# 6. File permissions:\nfind /etc -perm -o+w 2>/dev/null\n# World-writable files in /etc are a security risk\n\n# 7. Monitoring:\ntail -f /var/log/auth.log | grep 'Failed password'\n# Watch for brute-force attempts",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most commonly overlooked defence in depth layer: services binding to 0.0.0.0 instead of 127.0.0.1. A database that listens on all interfaces is reachable from the network even if the firewall blocks the port — because the firewall might have a gap. Always configure services to listen only on the interfaces they need."
      },
      "keyPoints": [
        "Defence in depth: multiple independent layers — failure of one does not mean total breach",
        "Layers: perimeter firewall, DMZ, host firewall, WAF, IDS/IPS, patching, least privilege, monitoring",
        "Each layer buys time and increases detection probability",
        "Services should bind to 127.0.0.1 not 0.0.0.0 unless they need to be network-accessible",
        "Monitoring is the last line of defence — detects breaches that bypass all other controls"
      ],
      "tryIt": "Run the defence in depth checklist above on a Linux VM. For each item, note what you find and whether it represents a security gap. Fix at least two issues you discover. Pay particular attention to services binding to 0.0.0.0 — change any that do not need network access to bind to 127.0.0.1 instead."
    }
  },

  {
    "id": 105,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Common Firewall Mistakes",
    "type": "lesson",
    "content": {
      "body": "Firewall misconfigurations are one of the most common causes of security incidents. Knowing the patterns helps you avoid them and audit existing configurations effectively.\n\n## Mistake 1: Allow-All Default Policy\n\nStarting with ACCEPT as the default policy and trying to block specific threats. You will always miss something. Always start with DROP and explicitly allow what is needed.\n\n## Mistake 2: Blocking ICMP Entirely\n\nBlocking all ICMP breaks Path MTU Discovery (ICMP type 3 code 4) and makes troubleshooting impossible. Allow ICMP echo (ping) and always allow ICMP type 3 (Destination Unreachable).\n\n## Mistake 3: Overly Broad Rules\n\nAllowing 0.0.0.0/0 on port 22 (SSH) instead of restricting to known IPs. Every open SSH port gets brute-forced within minutes. Restrict SSH to specific source IPs or use a VPN.\n\n## Mistake 4: No Outbound Filtering\n\nAllowing all outbound traffic. A compromised machine can freely exfiltrate data or connect to command-and-control servers. Restrict outbound to what is actually needed.\n\n## Mistake 5: Rules Not Persisted\n\niptables rules are lost on reboot unless saved. Use iptables-save/iptables-restore or a tool like UFW or firewalld that persists rules automatically.\n\n## Mistake 6: Not Testing Rules\n\nAdding rules without verifying they work as intended. Always test from outside the machine using nmap or nc.",
      "diagram": "flowchart TD\n    A[\"Common Mistakes\"] --> B[\"Allow-all default\nshould be DROP\"]\n    A --> C[\"Block all ICMP\nbreaks PMTUD\"]\n    A --> D[\"SSH open to world\nrestrict to known IPs\"]\n    A --> E[\"No outbound rules\nmalware calls home\"]\n    A --> F[\"Rules not persisted\nlost on reboot\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Common firewall mistakes — each one creates a security gap that attackers can exploit",
      "code": "# Firewall mistake fixes\n\n# Fix 1: Set default DROP (not ACCEPT):\nsudo iptables -P INPUT DROP\nsudo iptables -P FORWARD DROP\n# Keep OUTPUT as ACCEPT unless you need strict outbound\n\n# Fix 2: Allow necessary ICMP (not block all):\nsudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT\nsudo iptables -A INPUT -p icmp --icmp-type destination-unreachable -j ACCEPT\nsudo iptables -A INPUT -p icmp --icmp-type time-exceeded -j ACCEPT\n\n# Fix 3: Restrict SSH to specific IP:\nsudo iptables -A INPUT -p tcp -s 203.0.113.10 --dport 22 -j ACCEPT\n# Not: -A INPUT -p tcp --dport 22 -j ACCEPT (open to world)\n\n# Fix 4: Rate-limit SSH to reduce brute force:\nsudo iptables -A INPUT -p tcp --dport 22 -m recent --set --name SSH\nsudo iptables -A INPUT -p tcp --dport 22 -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP\n\n# Fix 5: Persist iptables rules:\nsudo apt install iptables-persistent\nsudo netfilter-persistent save\n# Rules saved to /etc/iptables/rules.v4\n\n# Fix 6: Test rules from outside:\nnmap -p 22,80,443,8080 <your-ip>\n# Verify only expected ports are open",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Install fail2ban to automatically block IPs that repeatedly fail SSH authentication. It reads /var/log/auth.log and adds iptables DROP rules for offending IPs. sudo apt install fail2ban && sudo systemctl enable fail2ban. This is the single most effective measure against SSH brute-force attacks."
      },
      "keyPoints": [
        "Default policy should be DROP — never ACCEPT — then explicitly allow what is needed",
        "Never block all ICMP — allow echo, destination-unreachable, and time-exceeded",
        "Restrict SSH to known source IPs — open SSH to the world gets brute-forced immediately",
        "Persist iptables rules with iptables-persistent or use UFW/firewalld",
        "Always test rules from outside using nmap — rules that look correct may not work as expected"
      ],
      "tryIt": "Audit an existing firewall configuration for all six mistakes above. Fix each one you find. Install fail2ban and verify it is blocking repeated SSH failures. Run nmap from outside the machine to confirm only expected ports are open."
    }
  },

  {
    "id": 106,
    "moduleId": 10,
    "moduleTitle": "Firewalls, Network Security Basics & Traffic Filtering",
    "title": "Module 10 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered firewalls and network security — the controls that enforce security policy at the network level. Firewalls are the most fundamental network security tool, and understanding them deeply makes you significantly more effective at both building and auditing secure systems.\n\n## What You Learned\n\n**Packet filtering** — stateless (each packet independent) and stateful (tracks connection state). ESTABLISHED,RELATED is the key stateful rule.\n\n**Application-layer firewalls** — DPI inspects payload, NGFWs add application awareness, WAFs block web-specific attacks.\n\n**WAF and DMZ** — WAF filters HTTP attacks; DMZ isolates public servers with two firewalls; defence in depth layers multiple controls.\n\n**Inbound vs outbound** — INPUT (to machine), OUTPUT (from machine), FORWARD (through machine). Outbound filtering prevents data exfiltration.\n\n**Defence in depth** — perimeter firewall, DMZ, host firewall, WAF, IDS/IPS, patching, least privilege, monitoring.\n\n**Common mistakes** — allow-all default, blocking all ICMP, SSH open to world, no outbound rules, rules not persisted.\n\n## What Is Coming Next\n\nModule 11 covers VPNs — how secure tunnels work, VPN protocols, and when to use site-to-site vs remote-access VPNs.",
      "diagram": "flowchart TD\n    A[\"✅ Packet filtering\nstateless stateful\"] --> B[\"✅ Application layer\nDPI NGFW WAF\"]\n    B --> C[\"✅ WAF DMZ\ndefence in depth\"]\n    C --> D[\"✅ Inbound outbound\nINPUT OUTPUT FORWARD\"]\n    D --> E[\"✅ Common mistakes\nand fixes\"]\n    E --> F[\"➡️ VPNs\nModule 11\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 10 complete — firewalls from packet filtering to defence in depth",
      "code": "# Module 10 command reference\n\n# View firewall rules:\nsudo iptables -L -n -v\nsudo nft list ruleset\n\n# Essential stateful ruleset:\nsudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT\nsudo iptables -A INPUT -i lo -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT\nsudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT\nsudo iptables -P INPUT DROP\n\n# Persist rules:\nsudo netfilter-persistent save\n\n# Test from outside:\nnmap -p 22,80,443,8080 <your-ip>\n\n# Check services binding to all interfaces:\nss -tlnp | grep '0.0.0.0'\n\n# Install fail2ban:\nsudo apt install fail2ban && sudo systemctl enable --now fail2ban",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The minimum viable firewall for any internet-facing Linux server: allow ESTABLISHED/RELATED, allow loopback, allow SSH from specific IPs, allow your application ports, allow necessary ICMP, set default DROP. Install fail2ban. Save rules with netfilter-persistent. This takes 10 minutes and eliminates the vast majority of opportunistic attacks."
      },
      "keyPoints": [
        "Stateful firewall: ESTABLISHED,RELATED allows replies — always add this rule first",
        "Default policy: DROP for INPUT and FORWARD, carefully consider OUTPUT",
        "WAF + DMZ + host firewall = defence in depth for web applications",
        "Restrict SSH to known IPs, install fail2ban, persist rules with netfilter-persistent",
        "Test rules from outside with nmap — never assume rules work without verifying"
      ],
      "tryIt": "Build the minimum viable firewall above on a Linux VM. Verify each rule works: SSH connects, HTTP/HTTPS are accessible, port 8080 is blocked, ping works. Save the rules. Install fail2ban. Then run nmap from another machine to confirm the firewall is working as expected from an external perspective."
    }
  },

  // =========================
  // Networking Module 11: VPNs, Secure Tunneling & Remote Access
  // =========================

  {
    "id": 107,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "Welcome to VPNs",
    "type": "lesson",
    "content": {
      "body": "A VPN (Virtual Private Network) creates an encrypted tunnel between two endpoints over an untrusted network. It allows remote devices to communicate as if they were on the same private network, and it encrypts all traffic so that network observers cannot read it.\n\n## What This Module Covers\n\n- What VPNs are and what problem they solve\n- How VPN tunneling works\n- VPN protocols: IPsec, OpenVPN, WireGuard\n- Site-to-site vs remote-access VPNs\n- Split tunneling vs full tunneling\n- WireGuard — the modern VPN protocol\n\n## Why VPNs Matter\n\nVPNs are used in three main contexts:\n\n**Remote access** — employees connect to the corporate network from home or while travelling. All traffic is encrypted and routed through the corporate network.\n\n**Site-to-site** — two office networks are connected over the internet as if they were one network. Branch offices can reach headquarters resources directly.\n\n**Privacy** — individuals use VPNs to encrypt traffic on untrusted networks (public WiFi) or to hide their IP address from websites.",
      "diagram": "flowchart LR\n    A[\"Remote device\"] -->|\"encrypted tunnel\"|B[\"VPN Server\"]\n    B -->|\"decrypted\"|C[\"Private Network\"]\n    D[\"Public WiFi\nuntrusted\"] -.- A\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "VPN creates an encrypted tunnel — traffic is protected from the untrusted network between endpoints",
      "code": "# VPN quick reference\n\n# Check if a VPN is active:\nip addr show | grep tun\n# tun0: <POINTOPOINT,UP> — OpenVPN tunnel\nip addr show | grep wg\n# wg0: <NOARP,UP> — WireGuard tunnel\n\n# Check your IP with and without VPN:\ncurl -s ifconfig.me\n# Without VPN: your real public IP\n# With VPN: VPN server's IP\n\n# Check routing through VPN:\nip route show\n# 0.0.0.0/0 via 10.8.0.1 dev tun0 — all traffic through VPN\n\n# Check VPN connection status:\nsudo wg show          # WireGuard\nsudo openvpn --status  # OpenVPN",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "A VPN does not make you anonymous — it shifts trust from your ISP to your VPN provider. Your VPN provider can see all your traffic. Choose a VPN provider with a verified no-logs policy, or run your own VPN server. For corporate use, the company's VPN server sees all employee traffic — this is intentional for security monitoring."
      },
      "keyPoints": [
        "VPN creates an encrypted tunnel over an untrusted network",
        "Three use cases: remote access (employees), site-to-site (offices), privacy (individuals)",
        "VPN shifts trust from ISP to VPN provider — choose carefully or run your own",
        "Active VPN tunnels appear as tun0 (OpenVPN) or wg0 (WireGuard) interfaces",
        "Full tunnel VPN routes all traffic through the VPN; split tunnel routes only specific traffic"
      ],
      "tryIt": "Check if you have any VPN interfaces with ip addr show | grep -E 'tun|wg'. If you have a VPN, connect to it and run curl -s ifconfig.me before and after — confirm your public IP changes. Run ip route show to see how the routing table changes when the VPN is active."
    }
  },

  {
    "id": 108,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "How VPN Tunneling Works",
    "type": "lesson",
    "content": {
      "body": "VPN tunneling works by encapsulating one network protocol inside another. The original packet (with its private source and destination addresses) is encrypted and wrapped inside a new packet addressed to the VPN server. The VPN server unwraps it, decrypts it, and forwards the original packet to its destination.\n\n## Encapsulation\n\nWhen you send a packet through a VPN:\n1. Original packet: src=192.168.1.50, dst=8.8.8.8 (your private IP to Google)\n2. VPN client encrypts the original packet\n3. VPN client wraps it in a new packet: src=your-public-ip, dst=vpn-server-ip\n4. New packet travels across the internet to the VPN server\n5. VPN server decrypts the inner packet\n6. VPN server forwards the original packet to 8.8.8.8 on your behalf\n7. Reply comes back to VPN server, gets encrypted, sent back to you\n\n## Virtual Network Interface\n\nThe VPN client creates a virtual network interface (tun0 or wg0). The OS routing table sends traffic through this interface. The VPN software reads packets from the interface, encrypts them, and sends them to the VPN server over the real network interface.\n\n## Layer 2 vs Layer 3 VPNs\n\n**Layer 3 (tun)** — routes IP packets. Most common. Each end has its own IP on the VPN subnet.\n\n**Layer 2 (tap)** — bridges Ethernet frames. Allows broadcast traffic. Used when you need devices to appear on the same LAN segment.",
      "diagram": "flowchart TD\n    A[\"Original packet\nsrc: 192.168.1.50\ndst: 8.8.8.8\"] --> B[\"VPN client\nencrypt + encapsulate\"]\n    B --> C[\"Outer packet\nsrc: your-public-ip\ndst: vpn-server-ip\"]\n    C -->|\"internet\"|D[\"VPN Server\ndecapsulate + decrypt\"]\n    D --> E[\"Original packet\nforwarded to 8.8.8.8\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "VPN encapsulates the original packet inside an encrypted outer packet — VPN server unwraps and forwards",
      "code": "# VPN tunneling in practice\n\n# See the virtual tunnel interface:\nip addr show tun0\n# tun0: <POINTOPOINT,UP,LOWER_UP>\n# inet 10.8.0.2/24 peer 10.8.0.1/32\n\n# See how routing changes with VPN:\n# Without VPN:\nip route show\n# default via 192.168.1.1 dev eth0\n\n# With full-tunnel VPN:\nip route show\n# 0.0.0.0/0 via 10.8.0.1 dev tun0  (all traffic through VPN)\n# vpn-server-ip via 192.168.1.1 dev eth0  (VPN server via real interface)\n\n# Capture VPN traffic (encrypted outer packets):\nsudo tcpdump -i eth0 -n host vpn-server-ip\n# UDP packets to VPN server — encrypted, unreadable\n\n# Capture decrypted traffic inside VPN:\nsudo tcpdump -i tun0 -n\n# Readable packets — this is what the VPN server sees\n\n# Check MTU (VPN adds overhead, reduces effective MTU):\nip link show tun0 | grep mtu\n# mtu 1500 — but effective MTU is lower due to VPN overhead",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "VPN overhead reduces the effective MTU. A standard Ethernet MTU is 1500 bytes. OpenVPN adds ~50 bytes of overhead, leaving ~1450 bytes for the inner packet. WireGuard adds ~60 bytes. If you see mysterious connection hangs with a VPN, check the MTU — you may need to set the VPN interface MTU to 1420 or lower."
      },
      "keyPoints": [
        "VPN encapsulates the original packet inside an encrypted outer packet addressed to the VPN server",
        "VPN creates a virtual interface (tun0/wg0) — OS routes traffic through it",
        "Layer 3 (tun): routes IP packets — most common. Layer 2 (tap): bridges Ethernet frames",
        "Full tunnel: all traffic through VPN. Split tunnel: only specific traffic through VPN",
        "VPN adds overhead — reduces effective MTU, may cause connection issues if not accounted for"
      ],
      "tryIt": "Connect to a VPN and run ip route show. Identify the VPN tunnel interface and the routes that were added. Run sudo tcpdump -i eth0 -n host <vpn-server-ip> to see the encrypted outer packets. Then run sudo tcpdump -i tun0 -n to see the decrypted inner traffic. Compare the two captures."
    }
  },

  {
    "id": 109,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "VPN Protocols: IPsec, OpenVPN, WireGuard",
    "type": "lesson",
    "content": {
      "body": "Several VPN protocols exist, each with different trade-offs in security, performance, and complexity. Understanding the differences helps you choose the right protocol for each use case.\n\n## IPsec\n\nIPsec (Internet Protocol Security) is a suite of protocols that operates at Layer 3. It is built into the IP stack and supported natively by all major operating systems and network equipment. Used extensively for site-to-site VPNs between routers and firewalls.\n\nIPsec has two modes: Transport (encrypts payload only) and Tunnel (encrypts entire packet). It uses IKE (Internet Key Exchange) for key negotiation.\n\nStrengths: native OS support, hardware acceleration, widely supported by network equipment.\nWeaknesses: complex to configure correctly, many options and modes.\n\n## OpenVPN\n\nOpenVPN is an open-source VPN that runs in userspace and uses TLS for key exchange. Highly configurable, works on all platforms, can run over TCP or UDP. The most widely deployed VPN for remote access.\n\nStrengths: flexible, battle-tested, works through firewalls (can use TCP 443).\nWeaknesses: ~70,000 lines of code, slower than WireGuard, complex configuration.\n\n## WireGuard\n\nWireGuard is a modern VPN protocol with ~4,000 lines of code, built into the Linux kernel since 5.6. Uses modern cryptography (Curve25519, ChaCha20, Poly1305). Significantly faster than OpenVPN and simpler to configure.\n\nStrengths: fast, simple, small codebase, kernel-level performance.\nWeaknesses: UDP only (may be blocked by some firewalls), no obfuscation.",
      "diagram": "flowchart TD\n    A[\"VPN Protocols\"] --> B[\"IPsec\nLayer 3 native\nsite-to-site\"]\n    A --> C[\"OpenVPN\nuserspace TLS\nremote access\"]\n    A --> D[\"WireGuard\nkernel UDP\nmodern fast\"]\n    B --> E[\"Complex config\nhardware support\"]\n    C --> F[\"Flexible\nworks through firewalls\"]\n    D --> G[\"Simple\n4000 lines of code\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "IPsec for site-to-site, OpenVPN for flexible remote access, WireGuard for modern high-performance VPNs",
      "code": "# VPN protocol comparison\n\n# IPsec — check if running:\nsystemctl status strongswan 2>/dev/null || systemctl status ipsec 2>/dev/null\n\n# OpenVPN — connect to a server:\nsudo openvpn --config client.ovpn\n# Or as a service:\nsudo systemctl start openvpn@client\n\n# WireGuard — check status:\nsudo wg show\n\n# Performance comparison (rough):\n# WireGuard:  ~1 Gbps throughput on modern hardware\n# OpenVPN:    ~200-400 Mbps\n# IPsec:      ~500 Mbps - 1 Gbps (with hardware offload)\n\n# Protocol ports:\n# IPsec:    UDP 500 (IKE), UDP 4500 (NAT traversal), ESP protocol 50\n# OpenVPN:  UDP 1194 (default), or TCP 443 (firewall bypass)\n# WireGuard: UDP 51820 (default, configurable)\n\n# Check which VPN ports are open:\nss -ulnp | grep -E '500|4500|1194|51820'",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "For new deployments, WireGuard is the recommended choice for most use cases. It is faster, simpler, and has a much smaller attack surface than OpenVPN or IPsec. The main exception is site-to-site VPNs between enterprise routers and firewalls — these typically use IPsec because it is natively supported by the hardware."
      },
      "keyPoints": [
        "IPsec: Layer 3, native OS support, hardware acceleration — best for site-to-site between routers",
        "OpenVPN: userspace, TLS-based, flexible — can use TCP 443 to bypass firewalls",
        "WireGuard: kernel-level, ~4000 lines, modern crypto — fastest and simplest for new deployments",
        "WireGuard is UDP only — may be blocked by strict firewalls; OpenVPN can use TCP 443",
        "For new remote access VPNs: WireGuard. For enterprise site-to-site: IPsec"
      ],
      "tryIt": "Install WireGuard (sudo apt install wireguard) and generate a key pair with wg genkey | tee privatekey | wg pubkey > publickey. Set up a WireGuard tunnel between two VMs and verify connectivity. Compare the configuration complexity to an equivalent OpenVPN setup."
    }
  },

  {
    "id": 110,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "WireGuard: Modern VPN Protocol",
    "type": "lesson",
    "content": {
      "body": "WireGuard is the modern standard for VPN deployments. It was merged into the Linux kernel in 2020 and is now the default protocol for many commercial VPN services. Its simplicity and performance make it the best choice for most new VPN deployments.\n\n## Key Design Principles\n\n**Minimal codebase** — ~4,000 lines of code vs ~70,000 for OpenVPN. Small enough to be audited by a single security researcher.\n\n**Modern cryptography** — Curve25519 (key exchange), ChaCha20 (encryption), Poly1305 (authentication), BLAKE2 (hashing). No cipher negotiation — one fixed set of algorithms.\n\n**Stateless** — no handshake negotiation. Peers are configured with each other's public keys. A packet from a known peer is simply decrypted and forwarded.\n\n**Roaming** — connections survive IP address changes. When you switch from WiFi to mobile data, the WireGuard tunnel continues without reconnection.\n\n## Configuration\n\nWireGuard configuration is minimal: each peer has a private key, a VPN IP address, and a list of allowed IP ranges. The server has a list of peers (clients) with their public keys and allowed IPs.",
      "diagram": "flowchart LR\n    A[\"Peer A\nprivate: priv_a\npublic: pub_a\"] -->|\"encrypted\nwith pub_b\"|B[\"WireGuard Tunnel\"]\n    B -->|\"decrypted\nwith priv_b\"|C[\"Peer B\nprivate: priv_b\npublic: pub_b\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "WireGuard uses public key cryptography — no handshake, no certificates, just key pairs",
      "code": "# WireGuard setup\n\n# Install:\nsudo apt install wireguard\n\n# Generate key pair:\nwg genkey | tee privatekey | wg pubkey > publickey\ncat privatekey   # keep secret\ncat publickey    # share with peers\n\n# Server config (/etc/wireguard/wg0.conf):\n# [Interface]\n# Address = 10.0.0.1/24\n# ListenPort = 51820\n# PrivateKey = <server-private-key>\n# PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\n# PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n#\n# [Peer]\n# PublicKey = <client-public-key>\n# AllowedIPs = 10.0.0.2/32\n\n# Client config:\n# [Interface]\n# Address = 10.0.0.2/24\n# PrivateKey = <client-private-key>\n# DNS = 1.1.1.1\n#\n# [Peer]\n# PublicKey = <server-public-key>\n# Endpoint = server-ip:51820\n# AllowedIPs = 0.0.0.0/0\n# PersistentKeepalive = 25\n\n# Start and enable:\nsudo wg-quick up wg0\nsudo systemctl enable wg-quick@wg0\n\n# Check status:\nsudo wg show",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "PersistentKeepalive = 25 in the client config sends a keepalive packet every 25 seconds. This keeps the NAT mapping alive on the client's router so the server can send packets back. Without it, the server cannot initiate traffic to the client after the NAT mapping expires. Always set this on clients behind NAT."
      },
      "keyPoints": [
        "WireGuard: ~4000 lines of code, kernel-level, modern crypto — fastest and simplest VPN",
        "No cipher negotiation — fixed modern algorithms (Curve25519, ChaCha20, Poly1305)",
        "Stateless — no handshake, peers identified by public key",
        "Roaming — connections survive IP changes (WiFi to mobile)",
        "PersistentKeepalive keeps NAT mappings alive so server can reach clients behind NAT"
      ],
      "tryIt": "Set up a WireGuard VPN between two Linux VMs: generate key pairs on both, configure server and client, start with wg-quick up wg0, and verify with sudo wg show. Ping across the tunnel. Then test roaming: change the client's IP address and confirm the tunnel reconnects automatically."
    }
  },


  {
    "id": 111,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "Site-to-Site vs Remote-Access VPNs",
    "type": "lesson",
    "content": {
      "body": "VPNs are deployed in two fundamentally different configurations: site-to-site (connecting two networks) and remote-access (connecting individual devices to a network). Each serves a different purpose and has different configuration requirements.\n\n## Site-to-Site VPN\n\nA site-to-site VPN connects two entire networks over the internet. Both ends have a VPN gateway (router or firewall). All traffic between the two networks is automatically encrypted and routed through the tunnel.\n\nUse case: connecting a branch office to headquarters. Employees at the branch can access headquarters resources (file servers, printers, internal applications) as if they were on the same LAN.\n\nTypically uses IPsec between dedicated VPN gateways. The tunnel is always-on — no user action required.\n\n## Remote-Access VPN\n\nA remote-access VPN connects individual devices to a network. Each user runs a VPN client that connects to a VPN server. The user's device gets a virtual IP on the corporate network.\n\nUse case: employees working from home or travelling. They connect to the corporate VPN to access internal resources.\n\nTypically uses OpenVPN or WireGuard. The user initiates the connection manually or it connects automatically.\n\n## Split Tunneling vs Full Tunneling\n\n**Full tunnel** — all traffic goes through the VPN. The VPN server sees everything. Corporate can monitor all employee internet traffic.\n\n**Split tunnel** — only traffic destined for the corporate network goes through the VPN. Internet traffic goes directly. Reduces VPN server load and gives employees privacy for personal browsing.",
      "diagram": "flowchart TD\n    A[\"Site-to-Site\"] --> B[\"Branch Office\n192.168.2.0/24\"]\n    A --> C[\"HQ\n192.168.1.0/24\"]\n    B <-->|\"IPsec tunnel\nalways-on\"|C\n    D[\"Remote Access\"] --> E[\"Employee laptop\n10.8.0.5\"]\n    D --> F[\"VPN Server\n10.8.0.1\"]\n    E <-->|\"WireGuard/OpenVPN\nuser-initiated\"|F\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Site-to-site connects networks permanently; remote-access connects individual devices on demand",
      "code": "# Site-to-site vs remote-access VPN\n\n# Site-to-site: routing between two subnets\n# Branch: 192.168.2.0/24, HQ: 192.168.1.0/24\n# WireGuard site-to-site config:\n\n# Branch gateway wg0.conf:\n# [Interface]\n# Address = 10.0.0.1/30\n# PrivateKey = <branch-private-key>\n#\n# [Peer]  # HQ gateway\n# PublicKey = <hq-public-key>\n# Endpoint = hq-public-ip:51820\n# AllowedIPs = 192.168.1.0/24, 10.0.0.0/30\n\n# Remote access: split tunnel config\n# Client wg0.conf:\n# [Peer]\n# AllowedIPs = 192.168.1.0/24  (split tunnel — only corporate traffic)\n# vs\n# AllowedIPs = 0.0.0.0/0       (full tunnel — all traffic)\n\n# Check which traffic goes through VPN:\nip route show\n# Split tunnel: only 192.168.1.0/24 via tun0\n# Full tunnel:  0.0.0.0/0 via tun0\n\n# Verify split tunnel is working:\ncurl -s ifconfig.me\n# Should show your real IP (not VPN IP) with split tunnel",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Split tunneling is a security trade-off. It reduces VPN server load and gives employees privacy, but it means corporate devices are simultaneously connected to the corporate network and the internet without corporate security controls on the internet traffic. A compromised device on split tunnel can be used to attack the corporate network from inside."
      },
      "keyPoints": [
        "Site-to-site: connects two networks permanently — IPsec between gateways, always-on",
        "Remote-access: connects individual devices on demand — OpenVPN or WireGuard, user-initiated",
        "Full tunnel: all traffic through VPN — corporate sees everything, maximum security",
        "Split tunnel: only corporate traffic through VPN — reduces load, gives privacy, security trade-off",
        "AllowedIPs = 0.0.0.0/0 = full tunnel; AllowedIPs = specific subnet = split tunnel"
      ],
      "tryIt": "Configure a WireGuard remote-access VPN with split tunneling: set AllowedIPs to only 10.0.0.0/24 (the VPN subnet). Verify with ip route show that only VPN traffic goes through the tunnel. Then change to full tunnel (AllowedIPs = 0.0.0.0/0) and confirm all traffic routes through the VPN with curl -s ifconfig.me."
    }
  },

  {
    "id": 112,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "VPN Authentication and Security",
    "type": "lesson",
    "content": {
      "body": "A VPN is only as secure as its authentication mechanism. Weak authentication undermines all the encryption. Understanding VPN authentication methods helps you choose and configure VPNs securely.\n\n## Authentication Methods\n\n**Pre-shared keys (PSK)** — a shared secret configured on both ends. Simple but weak — if the key is compromised, all past and future traffic is at risk. Used in simple IPsec setups.\n\n**Certificates (PKI)** — each peer has a certificate signed by a CA. The VPN verifies the certificate before allowing connection. More secure than PSK — compromising one certificate does not affect others. Used in enterprise OpenVPN and IPsec deployments.\n\n**Public key pairs (WireGuard)** — each peer has a public/private key pair. The server is configured with each client's public key. No CA required — simpler than PKI but requires manual key distribution.\n\n**Username/password + MFA** — used in remote-access VPNs for user authentication. Combined with certificates for two-factor: something you have (certificate) + something you know (password).\n\n## Perfect Forward Secrecy (PFS)\n\nPFS ensures that session keys are not derived from a long-term secret. Even if the long-term key is compromised, past sessions cannot be decrypted. WireGuard and modern OpenVPN configurations use PFS by default.\n\n## Common Security Mistakes\n\n- Using PSK instead of certificates for site-to-site VPNs\n- Not enabling MFA for remote-access VPNs\n- Using weak or default PSKs\n- Not rotating certificates or keys regularly",
      "diagram": "flowchart TD\n    A[\"VPN Authentication\"] --> B[\"PSK\nshared secret\nsimple but weak\"]\n    A --> C[\"Certificates PKI\nCA-signed\nenterprise standard\"]\n    A --> D[\"Public key pairs\nWireGuard\nno CA needed\"]\n    A --> E[\"Username + MFA\nremote access\nuser authentication\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "VPN authentication methods — certificates and public keys are more secure than pre-shared keys",
      "code": "# VPN authentication\n\n# WireGuard — generate and manage key pairs:\nwg genkey | tee privatekey | wg pubkey > publickey\n\n# Rotate WireGuard keys (generate new pair, update config):\nwg genkey | tee new-privatekey | wg pubkey > new-publickey\n# Update [Interface] PrivateKey on client\n# Update [Peer] PublicKey on server\nsudo wg-quick down wg0 && sudo wg-quick up wg0\n\n# OpenVPN — generate CA and certificates:\n# Using easy-rsa:\nsudo apt install easy-rsa\nmake-cadir ~/openvpn-ca\ncd ~/openvpn-ca\n./easyrsa init-pki\n./easyrsa build-ca\n./easyrsa gen-req server nopass\n./easyrsa sign-req server server\n./easyrsa gen-req client1 nopass\n./easyrsa sign-req client client1\n\n# Check certificate expiry:\nopenssl x509 -in client1.crt -noout -dates\n# notAfter=Jan 1 00:00:00 2026 GMT\n\n# Verify certificate chain:\nopenssl verify -CAfile ca.crt client1.crt\n# client1.crt: OK",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Remote-access VPNs without MFA are a major security risk. If an employee's VPN credentials are phished or leaked, an attacker gets full access to the corporate network. Always require MFA for remote-access VPNs — hardware tokens (YubiKey), TOTP apps (Authy, Google Authenticator), or certificate-based authentication."
      },
      "keyPoints": [
        "PSK: simple but weak — one compromised key affects all connections",
        "Certificates (PKI): CA-signed, enterprise standard — compromising one cert does not affect others",
        "WireGuard public keys: no CA needed, simple distribution, strong security",
        "MFA is essential for remote-access VPNs — credentials alone are not sufficient",
        "Perfect Forward Secrecy: session keys not derived from long-term secret — past sessions safe"
      ],
      "tryIt": "Generate a WireGuard key pair and examine the key format. Set up an OpenVPN CA using easy-rsa and issue a client certificate. Check the certificate expiry date with openssl x509. Verify the certificate chain. This gives you hands-on experience with both key-based and certificate-based VPN authentication."
    }
  },

  {
    "id": 113,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "VPN Performance and Troubleshooting",
    "type": "lesson",
    "content": {
      "body": "VPN performance problems are common and often misdiagnosed. Understanding the causes of VPN slowness and the tools to diagnose them makes you much faster at resolving issues.\n\n## Why VPNs Are Slow\n\n**Encryption overhead** — encrypting and decrypting every packet takes CPU time. WireGuard is significantly faster than OpenVPN due to kernel-level processing and modern algorithms.\n\n**MTU issues** — VPN adds overhead to each packet, reducing the effective MTU. If the inner packet is too large, fragmentation occurs — dramatically reducing throughput.\n\n**Server location** — a VPN server on the other side of the world adds latency. Choose a server geographically close to your destination.\n\n**Bandwidth bottleneck** — the VPN server's bandwidth may be the limiting factor, not your connection.\n\n**Protocol choice** — OpenVPN over TCP is slower than UDP due to double TCP retransmission. Always use UDP for OpenVPN when possible.\n\n## Common Problems\n\n**Cannot connect** — firewall blocking VPN port, wrong server address, authentication failure.\n\n**Connected but no traffic** — routing problem, DNS not configured, split tunnel misconfiguration.\n\n**Slow speeds** — MTU issue, server overload, wrong protocol, encryption overhead.\n\n**Disconnects frequently** — keepalive not configured, NAT timeout, unstable network.",
      "diagram": "flowchart TD\n    A[\"VPN slow\"] --> B{\"MTU issue?\"}\n    B -->|\"Yes\"|C[\"Set MTU 1420\nping -M do -s 1400\"]\n    B -->|\"No\"|D{\"Server location?\"}\n    D -->|\"Far\"|E[\"Choose closer server\"]\n    D -->|\"Close\"|F{\"Protocol?\"}\n    F -->|\"TCP\"|G[\"Switch to UDP\"]\n    F -->|\"UDP\"|H[\"Check server load\nswitch protocol\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "VPN performance troubleshooting — MTU, server location, and protocol choice are the main factors",
      "code": "# VPN performance and troubleshooting\n\n# Test MTU through VPN (find largest packet that works):\nping -M do -s 1400 8.8.8.8  # try 1400 byte payload\nping -M do -s 1420 8.8.8.8  # try 1420\n# If 1400 works but 1420 fails, MTU is between 1428-1448\n\n# Set WireGuard MTU:\n# In [Interface] section:\n# MTU = 1420\n\n# Set OpenVPN MTU:\n# In client config:\n# tun-mtu 1420\n# mssfix 1380\n\n# Measure VPN throughput:\niperf3 -c iperf.he.net  # without VPN\n# Connect VPN\niperf3 -c iperf.he.net  # with VPN\n# Compare results\n\n# Debug WireGuard connection:\nsudo wg show\n# Check: latest handshake (should be recent)\n# Check: transfer (should be increasing)\n# Check: endpoint (correct server IP:port)\n\n# Debug OpenVPN:\nsudo journalctl -u openvpn@client -f\n# Look for: TLS handshake failed, AUTH_FAILED, route errors\n\n# Test DNS through VPN:\ndig google.com\n# Should use VPN DNS server if full tunnel",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "MTU misconfiguration is the most common cause of mysterious VPN slowness. The symptom: small packets work fine but large transfers (file downloads, video streaming) are slow or fail. The fix: set MTU to 1420 in the VPN config. This accounts for WireGuard's ~60-byte overhead on a standard 1500-byte Ethernet MTU."
      },
      "keyPoints": [
        "MTU issues cause mysterious slowness — set VPN MTU to 1420 for WireGuard, 1400 for OpenVPN",
        "OpenVPN over TCP is slower than UDP — always use UDP when possible",
        "WireGuard is significantly faster than OpenVPN due to kernel processing",
        "Connected but no traffic: check routing table and DNS configuration",
        "Frequent disconnects: add PersistentKeepalive = 25 to WireGuard client config"
      ],
      "tryIt": "Measure your VPN throughput with iperf3 before and after connecting to a VPN. Note the difference. Then test MTU: ping -M do -s 1420 8.8.8.8 through the VPN. If it fails, reduce the size until it works — that is your effective MTU. Set the VPN MTU accordingly and re-run the iperf3 test."
    }
  },

  {
    "id": 114,
    "moduleId": 11,
    "moduleTitle": "VPNs, Secure Tunneling & Remote Access",
    "title": "Module 11 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered VPNs — the technology that creates secure encrypted tunnels over untrusted networks. VPNs are fundamental infrastructure for remote work, connecting distributed offices, and securing traffic on untrusted networks.\n\n## What You Learned\n\n**VPN fundamentals** — encrypted tunnel over untrusted network. Shifts trust from ISP to VPN provider.\n\n**Tunneling** — encapsulates original packet inside encrypted outer packet. Virtual interface (tun0/wg0). Layer 3 (tun) vs Layer 2 (tap).\n\n**VPN protocols** — IPsec (site-to-site, hardware support), OpenVPN (flexible, TCP/UDP), WireGuard (modern, fast, simple).\n\n**WireGuard** — ~4000 lines, kernel-level, modern crypto, stateless, roaming support. Best choice for new deployments.\n\n**Site-to-site vs remote-access** — site-to-site connects networks permanently; remote-access connects individual devices on demand.\n\n**Split vs full tunnel** — full tunnel routes all traffic through VPN; split tunnel routes only corporate traffic.\n\n**Authentication** — PSK (weak), certificates (enterprise), public keys (WireGuard), MFA (required for remote access).\n\n**Performance** — MTU issues, protocol choice, server location. Set MTU 1420 for WireGuard.\n\n## What Is Coming Next\n\nModule 12 covers network monitoring and troubleshooting — the tools and methodology for diagnosing network problems systematically.",
      "diagram": "flowchart TD\n    A[\"✅ VPN fundamentals\nencrypted tunnel\"] --> B[\"✅ Tunneling\nencapsulation tun wg\"]\n    B --> C[\"✅ Protocols\nIPsec OpenVPN WireGuard\"]\n    C --> D[\"✅ Site-to-site\nvs remote-access\"]\n    D --> E[\"✅ Authentication\ncerts keys MFA\"]\n    E --> F[\"✅ Performance\nMTU protocol\"]\n    F --> G[\"➡️ Monitoring\nModule 12\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 11 complete — VPNs from tunneling fundamentals to WireGuard and performance",
      "code": "# Module 11 command reference\n\n# Check VPN interfaces:\nip addr show | grep -E 'tun|wg'\n\n# WireGuard status:\nsudo wg show\n\n# Generate WireGuard keys:\nwg genkey | tee privatekey | wg pubkey > publickey\n\n# Start/stop WireGuard:\nsudo wg-quick up wg0\nsudo wg-quick down wg0\n\n# Check routing through VPN:\nip route show\n\n# Verify public IP (check if VPN is active):\ncurl -s ifconfig.me\n\n# Test MTU through VPN:\nping -M do -s 1420 8.8.8.8\n\n# Measure VPN throughput:\niperf3 -c iperf.he.net\n\n# OpenVPN logs:\nsudo journalctl -u openvpn@client -f",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "For a personal VPN server, WireGuard on a cheap VPS (5 USD/month) gives you a private VPN with no logs, full control, and excellent performance. The setup takes about 30 minutes. This is far more trustworthy than a commercial VPN service whose logging policies you cannot verify."
      },
      "keyPoints": [
        "VPN creates encrypted tunnel — traffic protected from network observers",
        "WireGuard: best choice for new deployments — fast, simple, kernel-level",
        "Site-to-site: always-on between networks; remote-access: on-demand for individuals",
        "Full tunnel: all traffic through VPN; split tunnel: only corporate traffic",
        "MTU 1420 for WireGuard, MFA required for remote-access VPNs"
      ],
      "tryIt": "Set up a complete WireGuard VPN: server on a VPS or second VM, client on your machine. Configure full tunnel (AllowedIPs = 0.0.0.0/0), verify your public IP changes, measure throughput with iperf3, and confirm MTU is set correctly. Then switch to split tunnel and verify only VPN subnet traffic goes through the tunnel."
    }
  },

  // =========================
  // Networking Module 12: Network Monitoring, Troubleshooting & Diagnostic Tools
  // =========================

  {
    "id": 115,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Welcome to Network Monitoring and Troubleshooting",
    "type": "lesson",
    "content": {
      "body": "Network troubleshooting is the skill that separates engineers who can diagnose problems in minutes from those who spend hours guessing. It requires a systematic methodology, knowledge of the right tools, and the discipline to work through layers rather than jumping to conclusions.\n\n## What This Module Covers\n\n- The troubleshooting mindset — systematic, layer-by-layer diagnosis\n- Physical and Layer 2 checks\n- Layer 3 troubleshooting — IP, routing, ICMP\n- Transport and application layer checks\n- Key diagnostic tools: ping, traceroute, dig, ss, nc, tcpdump, Wireshark\n- MTU and bandwidth testing\n- Network monitoring — the difference between reactive troubleshooting and proactive monitoring\n\n## The Core Principle\n\nAlways work bottom-up. A Layer 7 problem looks identical to a Layer 3 problem if you do not check the lower layers first. The OSI model is your checklist — work through it systematically and you will find the problem.",
      "diagram": "flowchart TD\n    A[\"Problem reported\"] --> B[\"L1: Interface up?\"]\n    B --> C[\"L2: MAC/ARP OK?\"]\n    C --> D[\"L3: IP route OK?\"]\n    D --> E[\"L3: Can ping gateway?\"]\n    E --> F[\"L3: Can ping 8.8.8.8?\"]\n    F --> G[\"L4: Port reachable?\"]\n    G --> H[\"L7: App responds?\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Bottom-up troubleshooting — work through each layer systematically until the fault is found",
      "code": "# Quick network diagnostic script\n\necho '=== Layer 1: Interface ===' && ip link show\necho '=== Layer 2: ARP ===' && arp -n\necho '=== Layer 3: IP ===' && ip addr show\necho '=== Layer 3: Routes ===' && ip route show\necho '=== Gateway ping ===' && ping -c 2 $(ip route | grep default | awk '{print $3}')\necho '=== Internet ping ===' && ping -c 2 8.8.8.8\necho '=== DNS ===' && dig +short google.com\necho '=== Listening ports ===' && ss -tlnp",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Save the quick diagnostic script above as a shell script and run it whenever you sit down at an unfamiliar machine or start troubleshooting a network problem. It gives you a complete picture of the machine's network state in under 5 seconds and immediately reveals the most common problems."
      },
      "keyPoints": [
        "Always troubleshoot bottom-up — Layer 1 before Layer 7",
        "The OSI model is your troubleshooting checklist",
        "A Layer 7 problem can look like a Layer 3 problem if you skip lower layers",
        "The quick diagnostic script covers all layers in one run",
        "Systematic methodology beats guessing every time"
      ],
      "tryIt": "Run the quick diagnostic script above on your machine. For each section, note what it tells you. Then deliberately break the network at one layer (delete the default route, disable the interface, or block a port) and run the script again — identify which section reveals the fault."
    }
  },

  {
    "id": 116,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Layer 1 and Layer 2 Diagnostics",
    "type": "lesson",
    "content": {
      "body": "Physical and data link layer problems are the most basic — and the most commonly overlooked. Before spending time on routing tables and DNS, confirm the physical connection is working and the Layer 2 addressing is correct.\n\n## Layer 1 Checks\n\n**Interface state** — is the interface up? ip link show shows UP or DOWN. A DOWN interface means no physical connection or the interface is administratively disabled.\n\n**Link speed and duplex** — ethtool shows the negotiated speed and duplex. A 10 Mbps half-duplex negotiation on a Gigabit link indicates a cable or NIC problem.\n\n**Error counters** — ethtool -S shows hardware counters. High rx_crc_errors indicate cable problems. High tx_errors indicate NIC problems.\n\n## Layer 2 Checks\n\n**ARP table** — ip neigh show lists IP-to-MAC mappings. If the gateway is missing or in FAILED state, Layer 2 communication is broken.\n\n**MAC address** — ip link show shows the interface MAC. Verify it is correct and not accidentally spoofed.\n\n**VLAN** — if the machine is on a managed switch, verify the correct VLAN is configured on the switch port.\n\n**Duplicate IP** — if two devices have the same IP, ARP conflicts cause intermittent connectivity. arping detects this.",
      "diagram": "flowchart TD\n    A[\"Layer 1 checks\"] --> B[\"ip link show\ninterface UP/DOWN\"]\n    A --> C[\"ethtool eth0\nspeed duplex\"]\n    A --> D[\"ethtool -S eth0\nerror counters\"]\n    E[\"Layer 2 checks\"] --> F[\"ip neigh show\nARP table\"]\n    E --> G[\"arping\nduplicate IP\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Layer 1: interface state, speed, errors. Layer 2: ARP table, duplicate IPs",
      "code": "# Layer 1 and Layer 2 diagnostics\n\n# Layer 1 — interface state:\nip link show\n# eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n# UP = interface enabled, LOWER_UP = physical link detected\n\n# Bring interface up if down:\nsudo ip link set eth0 up\n\n# Check link speed and duplex:\nethtool eth0\n# Speed: 1000Mb/s\n# Duplex: Full\n# Link detected: yes\n\n# Check error counters:\nsudo ethtool -S eth0 | grep -E 'error|drop|miss'\n# rx_crc_errors: 0    (cable errors)\n# rx_dropped: 0       (buffer overflow)\n# tx_errors: 0        (NIC errors)\n\n# Layer 2 — ARP table:\nip neigh show\n# 192.168.1.1 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE\n# 192.168.1.1 dev eth0  FAILED  ← Layer 2 problem!\n\n# Force ARP resolution:\nping -c 1 192.168.1.1\nip neigh show | grep 192.168.1.1\n\n# Detect duplicate IP:\nsudo arping -D -I eth0 192.168.1.50\n# If you get a reply: duplicate IP detected!\n\n# Capture ARP traffic:\nsudo tcpdump -i eth0 -n arp",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "LOWER_UP in ip link show output means the physical link is detected (cable connected, switch port active). If you see UP but not LOWER_UP, the interface is enabled but there is no physical connection — check the cable. If you see neither UP nor LOWER_UP, the interface is administratively down — run sudo ip link set eth0 up."
      },
      "keyPoints": [
        "ip link show: UP = enabled, LOWER_UP = physical link detected",
        "ethtool shows speed and duplex — wrong negotiation indicates cable or NIC problem",
        "ethtool -S shows error counters — rx_crc_errors indicate cable problems",
        "ip neigh show: FAILED state means ARP is not resolving — Layer 2 broken",
        "arping -D detects duplicate IP addresses on the network"
      ],
      "tryIt": "Run ip link show and identify the state of each interface. Run ethtool eth0 and note the speed and duplex. Run ip neigh show and check the state of your gateway entry. Run sudo arping -D -I eth0 <your-ip> to check for duplicate IPs. Run sudo ethtool -S eth0 | grep error to check for hardware errors."
    }
  },

  {
    "id": 117,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Layer 3 and Layer 4 Diagnostics",
    "type": "lesson",
    "content": {
      "body": "Layer 3 and Layer 4 problems are the most common network issues. IP addressing, routing, and port reachability cover the vast majority of connectivity failures.\n\n## Layer 3 Diagnostics\n\n**IP address** — ip addr show. Verify the correct IP and subnet mask. 169.254.x.x means DHCP failed.\n\n**Routing table** — ip route show. Verify the default route exists and points to the correct gateway.\n\n**Route selection** — ip route get <destination> shows exactly which route would be used.\n\n**Ping** — tests Layer 3 reachability. Ping the gateway first (tests local routing), then 8.8.8.8 (tests internet routing), then a hostname (tests DNS).\n\n**Traceroute** — maps the path to a destination. Shows where packets stop — the last responding hop before the problem.\n\n## Layer 4 Diagnostics\n\n**ss** — shows active connections and listening ports. ss -tnp for TCP, ss -unp for UDP.\n\n**nc (netcat)** — tests TCP/UDP port reachability. nc -zv host port tests if a port is open.\n\n**nmap** — scans ports on a remote host. nmap -p 22,80,443 host shows which ports are open.\n\n**telnet** — old but still useful for testing TCP connectivity to a specific port.",
      "diagram": "flowchart TD\n    A[\"Layer 3 checks\"] --> B[\"ip addr show\nIP and subnet\"]\n    A --> C[\"ip route show\ndefault route\"]\n    A --> D[\"ping gateway\nping 8.8.8.8\"]\n    A --> E[\"traceroute\npath mapping\"]\n    F[\"Layer 4 checks\"] --> G[\"ss -tnp\nconnections\"]\n    F --> H[\"nc -zv host port\nport reachable?\"]\n    F --> I[\"nmap\nport scan\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Layer 3: IP, routing, ping, traceroute. Layer 4: connections, port reachability, port scanning",
      "code": "# Layer 3 and Layer 4 diagnostics\n\n# Layer 3 — IP address:\nip addr show\n# inet 192.168.1.50/24 — correct\n# inet 169.254.x.x/16  — DHCP failed!\n\n# Layer 3 — routing:\nip route show\n# default via 192.168.1.1 dev eth0  — default route present\n# (empty) — no default route! Add: sudo ip route add default via 192.168.1.1\n\n# Layer 3 — route selection:\nip route get 8.8.8.8\n# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.50\n\n# Layer 3 — reachability:\nping -c 2 192.168.1.1   # gateway\nping -c 2 8.8.8.8       # internet (bypasses DNS)\nping -c 2 google.com    # DNS + internet\n\n# Layer 3 — path mapping:\ntraceroute -n 8.8.8.8\n# Last responding hop before * * * = where packets stop\n\n# Layer 4 — active connections:\nss -tnp\n\n# Layer 4 — listening ports:\nss -tlnp\n\n# Layer 4 — port reachability:\nnc -zv example.com 443\n# Connection to example.com 443 port succeeded\nnc -zv example.com 8080\n# nc: connect to example.com port 8080 failed: Connection refused\n\n# Layer 4 — port scan:\nnmap -p 22,80,443 192.168.1.10",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The two-ping test is the fastest way to isolate routing vs DNS problems: ping 8.8.8.8 (tests routing, bypasses DNS) then ping google.com (tests DNS). If 8.8.8.8 works but google.com fails, the problem is DNS. If 8.8.8.8 fails, the problem is routing. This single test eliminates half the possible causes immediately."
      },
      "keyPoints": [
        "169.254.x.x means DHCP failed — check DHCP server and network connection",
        "ip route get <ip> shows exactly which route would be used for a destination",
        "ping 8.8.8.8 tests routing; ping google.com tests DNS — different problems",
        "traceroute shows where packets stop — last responding hop before the problem",
        "nc -zv host port tests TCP reachability without needing a full application"
      ],
      "tryIt": "Run the full Layer 3 and Layer 4 diagnostic sequence above. For each command, note what it tells you. Then deliberately create a Layer 3 problem (delete the default route) and a Layer 4 problem (block port 443 with iptables). Practice diagnosing each one using only the commands above."
    }
  },

  {
    "id": 118,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Packet Capture with tcpdump and Wireshark",
    "type": "lesson",
    "content": {
      "body": "Packet capture is the most powerful network diagnostic tool. When you cannot figure out what is happening from higher-level tools, capturing raw packets shows you exactly what is on the wire. tcpdump is the command-line tool; Wireshark is the GUI analyser.\n\n## tcpdump Essentials\n\ntcpdump captures packets on a network interface and displays them in real time or saves them to a file. Key options:\n- -i eth0 — capture on interface eth0\n- -n — do not resolve hostnames (faster, avoids DNS queries polluting capture)\n- -v — verbose (show TTL, window size, etc.)\n- -w file.pcap — save to file for Wireshark\n- -r file.pcap — read from file\n- -c 100 — capture only 100 packets\n\n## Filter Expressions\n\ntcpdump uses BPF (Berkeley Packet Filter) expressions:\n- host 8.8.8.8 — traffic to/from 8.8.8.8\n- port 443 — traffic on port 443\n- tcp — TCP only\n- udp port 53 — UDP DNS\n- not port 22 — exclude SSH\n\n## Wireshark\n\nWireshark opens .pcap files and provides GUI analysis: colour-coded protocols, follow TCP stream (reconstructs the full conversation), statistics, and expert analysis. Essential for deep protocol analysis.",
      "diagram": "flowchart TD\n    A[\"Start capture\ntcpdump -i eth0 -w cap.pcap\"] --> B[\"Generate traffic\ncurl ping ssh\"]\n    B --> C[\"Stop capture\nCtrl+C\"]\n    C --> D[\"Analyse\ntcpdump -r cap.pcap\nor Wireshark\"]\n    D --> E[\"Filter\nhost port protocol\"]\n    E --> F[\"Follow stream\nread conversation\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Packet capture workflow — capture, filter, and follow the stream to understand what happened",
      "code": "# tcpdump essentials\n\n# Basic capture:\nsudo tcpdump -i eth0 -n\n\n# Save to file:\nsudo tcpdump -i eth0 -n -w capture.pcap\n\n# Read saved capture:\ntcpdump -r capture.pcap\n\n# Filter by host:\nsudo tcpdump -i eth0 -n host 8.8.8.8\n\n# Filter by port:\nsudo tcpdump -i eth0 -n port 443\n\n# Filter DNS (UDP 53):\nsudo tcpdump -i eth0 -n udp port 53\n\n# Capture TCP SYN packets (new connections):\nsudo tcpdump -i eth0 -n 'tcp[tcpflags] & tcp-syn != 0'\n\n# Capture with Ethernet headers:\nsudo tcpdump -i eth0 -n -e\n\n# Verbose (show TTL, window size):\nsudo tcpdump -i eth0 -n -v port 80\n\n# Show packet payload as ASCII:\nsudo tcpdump -i eth0 -n -A port 80\n\n# Capture a DNS lookup:\nsudo tcpdump -i eth0 -n udp port 53 &\ndig google.com\n# A? google.com → A 142.250.x.x",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Always use -n with tcpdump to disable hostname resolution. Without -n, tcpdump makes DNS queries for every IP it sees — these queries appear in your capture and slow down the display. Use -n for clean, fast captures. If you need hostnames, resolve them separately after the capture."
      },
      "keyPoints": [
        "tcpdump -i eth0 -n -w file.pcap captures to file — open in Wireshark for GUI analysis",
        "BPF filters: host, port, tcp, udp, not — combine with and/or",
        "Always use -n to disable hostname resolution — keeps captures clean and fast",
        "Wireshark Follow TCP Stream reconstructs the full application conversation",
        "Capture on the tun0/wg0 interface to see decrypted VPN traffic"
      ],
      "tryIt": "Capture traffic while running curl https://example.com. Open the .pcap in Wireshark and find: the DNS query, the TCP three-way handshake, and the TLS ClientHello. Use Follow TCP Stream on the TLS connection. Then capture on a different interface (lo for loopback) and observe local traffic."
    }
  },


  {
    "id": 119,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "MTU, Fragmentation, and Bandwidth Testing",
    "type": "lesson",
    "content": {
      "body": "MTU mismatches cause mysterious connectivity problems — connections that work for small packets but fail for large ones. Bandwidth testing reveals actual throughput vs theoretical capacity. Both are essential troubleshooting skills.\n\n## MTU and Fragmentation\n\nThe standard Ethernet MTU is 1500 bytes. If a packet is larger than the MTU of a link and the DF (Don't Fragment) bit is set, the router drops the packet and sends back an ICMP Fragmentation Needed message. If this ICMP message is blocked by a firewall, the sender never knows to reduce its packet size — this is an MTU black hole.\n\n**Symptoms of MTU problems**: small packets work (ping, SSH login) but large transfers fail (file downloads, web pages with images). The connection appears to work but hangs on large data.\n\n**VPN MTU**: VPN tunnels add overhead. WireGuard adds ~60 bytes, OpenVPN adds ~100 bytes. If the VPN MTU is not reduced, packets exceed the physical MTU and get silently dropped.\n\n## Bandwidth Testing with iperf3\n\niperf3 measures actual TCP/UDP throughput between two hosts. It reveals the real capacity of a link — not just the theoretical maximum. Run iperf3 -s on the server and iperf3 -c server-ip on the client.",
      "diagram": "flowchart TD\n    A[\"Large packet\n1500 bytes + DF bit\"] --> B{\"Fits in MTU?\"}\n    B -->|\"Yes\"|C[\"Send as-is\"]\n    B -->|\"No\"|D[\"ICMP Fragmentation Needed\"]\n    D --> E{\"Firewall blocks ICMP?\"}\n    E -->|\"Yes\"|F[\"MTU Black Hole\npacket silently dropped\"]\n    E -->|\"No\"|G[\"Sender reduces\npacket size\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style G fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "MTU black holes occur when ICMP fragmentation-needed messages are blocked by firewalls",
      "code": "# MTU troubleshooting and bandwidth testing\n\n# Check interface MTU:\nip link show eth0 | grep mtu\n# mtu 1500\n\n# Test for MTU black holes:\nping -M do -s 1472 8.8.8.8   # 1472 + 28 header = 1500\nping -M do -s 1473 8.8.8.8   # should fail if MTU is 1500\n# If 1400 works but 1401 fails → MTU problem (VPN?)\n\n# Find path MTU:\ntracepath 8.8.8.8\n# Shows MTU at each hop\n# 1:  192.168.1.1  pmtu 1500\n# 2:  10.0.0.1     pmtu 1500\n\n# Fix VPN MTU (WireGuard):\n# Add to [Interface] section:\n# MTU = 1420\n\n# Bandwidth testing with iperf3:\n# On server:\niperf3 -s\n\n# On client:\niperf3 -c server-ip -t 10\n# [ 5] 0-10 sec  1.09 GBytes  938 Mbits/sec\n\n# UDP test (jitter and packet loss):\niperf3 -c server-ip -u -b 100M\n# Bandwidth: 100 Mbits/sec\n# Jitter: 0.123 ms\n# Lost/Total: 0/7143 (0%)\n\n# Public iperf3 servers:\niperf3 -c iperf.he.net",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Never block all ICMP at your firewall. ICMP type 3 code 4 (Fragmentation Needed) is essential for Path MTU Discovery. Blocking it creates MTU black holes — connections that appear to work but hang on large transfers. Always allow ICMP type 3 and type 11 (Time Exceeded, used by traceroute) through firewalls."
      },
      "keyPoints": [
        "MTU black hole: ICMP fragmentation-needed blocked by firewall — large packets silently dropped",
        "Symptom: small packets work, large transfers hang — classic MTU problem",
        "ping -M do -s 1472 tests if 1500-byte packets get through",
        "VPN MTU: set to 1420 for WireGuard, 1400 for OpenVPN",
        "iperf3 measures actual throughput — run server on one end, client on the other"
      ],
      "tryIt": "Run ping -M do -s 1472 8.8.8.8 to test your path MTU. If it fails, reduce the size until it succeeds — that is your actual path MTU. Install iperf3 and run a throughput test against iperf.he.net. Compare the result to your ISP's advertised speed. The gap is protocol overhead and network conditions."
    }
  },

  {
    "id": 120,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "DNS and Application Layer Diagnostics",
    "type": "lesson",
    "content": {
      "body": "Once you have confirmed Layer 3 connectivity (ping 8.8.8.8 works), the next step is DNS and application layer diagnostics. Many connectivity problems that appear to be network issues are actually DNS or application configuration problems.\n\n## DNS Diagnostics\n\n**dig** — the primary DNS diagnostic tool. dig @8.8.8.8 domain bypasses local cache and ISP resolver. dig +trace walks the full hierarchy.\n\n**nslookup** — simpler DNS tool, available on Windows. Less powerful than dig but widely available.\n\n**Check /etc/resolv.conf** — verify the configured DNS server is correct and reachable.\n\n**Flush DNS cache** — sudo resolvectl flush-caches clears the local cache.\n\n## Application Layer Diagnostics\n\n**curl -v** — shows the full HTTP exchange including TLS handshake, headers, and response. The most useful HTTP debugging tool.\n\n**openssl s_client** — tests TLS connections, shows certificate details, verifies certificate chain.\n\n**telnet/nc** — tests raw TCP connectivity to a port. Useful for SMTP, HTTP, and other text-based protocols.\n\n**wget** — downloads a URL and shows detailed progress. Useful for testing HTTP redirects and download speeds.",
      "diagram": "flowchart TD\n    A[\"ping 8.8.8.8 works\nbut site unreachable\"] --> B{\"DNS resolves?\"}\n    B -->|\"No\"|C[\"dig @8.8.8.8 domain\ncheck resolv.conf\"]\n    B -->|\"Yes\"|D{\"Port reachable?\"}\n    D -->|\"No\"|E[\"nc -zv host 443\ncheck firewall\"]\n    D -->|\"Yes\"|F{\"TLS OK?\"}\n    F -->|\"No\"|G[\"openssl s_client\ncheck cert\"]\n    F -->|\"Yes\"|H[\"curl -v\ncheck HTTP response\"]\n    style A fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "DNS and application layer diagnosis — work from DNS resolution through TLS to HTTP response",
      "code": "# DNS and application diagnostics\n\n# DNS — basic lookup:\ndig google.com +short\n\n# DNS — bypass local cache and ISP resolver:\ndig @8.8.8.8 google.com +short\n\n# DNS — trace full resolution:\ndig +trace google.com\n\n# DNS — check configured resolver:\ncat /etc/resolv.conf\nresolvectl status | grep DNS\n\n# DNS — flush cache:\nsudo resolvectl flush-caches\n\n# Application — full HTTP exchange:\ncurl -v https://example.com 2>&1 | head -40\n\n# Application — status code only:\ncurl -s -o /dev/null -w '%{http_code}' https://example.com\n\n# Application — TLS certificate check:\nopenssl s_client -connect example.com:443 -servername example.com\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates\n\n# Application — raw TCP test:\nnc -zv example.com 443\nnc -zv example.com 80\n\n# Application — SMTP test:\nnc -zv mail.example.com 25\nnc -zv mail.example.com 587",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "When curl fails with a TLS error, run openssl s_client -connect host:443 to see the full certificate chain and error details. Common TLS errors: certificate expired (check notAfter date), hostname mismatch (check Subject Alternative Names), untrusted CA (check issuer). Each has a different fix."
      },
      "keyPoints": [
        "dig @8.8.8.8 bypasses local cache and ISP resolver — essential for DNS diagnosis",
        "dig +trace walks the full DNS hierarchy — shows exactly where resolution fails",
        "curl -v shows the full HTTP exchange — TLS handshake, headers, response",
        "openssl s_client shows certificate details and chain — diagnoses TLS errors",
        "nc -zv host port tests TCP reachability without needing a full application"
      ],
      "tryIt": "Run the full DNS and application diagnostic sequence for a site that is not loading. Start with dig @8.8.8.8, then nc -zv, then openssl s_client, then curl -v. At each step, note what you learn. This sequence diagnoses DNS, port reachability, TLS, and HTTP in order."
    }
  },

  {
    "id": 121,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Network Monitoring vs Troubleshooting",
    "type": "lesson",
    "content": {
      "body": "Troubleshooting is reactive — you diagnose a problem after it has been reported. Monitoring is proactive — you detect problems before users notice them. Both are essential, but monitoring is what separates mature operations from reactive firefighting.\n\n## What to Monitor\n\n**Availability** — is the service reachable? Simple ping or HTTP health checks every 30 seconds. Alert when it fails.\n\n**Latency** — how long does it take to respond? Baseline normal latency and alert on deviations.\n\n**Bandwidth utilisation** — is a link approaching capacity? Alert at 80% utilisation.\n\n**Packet loss** — even 1% packet loss significantly degrades TCP performance. Monitor with continuous ping or iperf3.\n\n**Error rates** — interface error counters (ethtool -S), application error rates.\n\n## Monitoring Tools\n\n**Prometheus + Grafana** — the modern standard for metrics collection and visualisation. Node exporter collects system metrics including network interface statistics.\n\n**Nagios/Zabbix** — traditional monitoring platforms. Alert-focused, widely deployed in enterprise.\n\n**LibreNMS** — network-focused monitoring using SNMP. Discovers network devices automatically, graphs interface traffic.\n\n**Uptime Kuma** — simple self-hosted uptime monitoring. HTTP, TCP, ping checks with alerting.",
      "diagram": "flowchart TD\n    A[\"Monitoring\"] --> B[\"Availability\nping HTTP checks\"]\n    A --> C[\"Latency\nresponse time\"]\n    A --> D[\"Bandwidth\ninterface utilisation\"]\n    A --> E[\"Errors\npacket loss error rates\"]\n    F[\"Tools\"] --> G[\"Prometheus Grafana\nmetrics visualisation\"]\n    F --> H[\"LibreNMS\nSNMP network devices\"]\n    F --> I[\"Uptime Kuma\nsimple uptime checks\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a",
      "diagramCaption": "Monitor availability, latency, bandwidth, and errors — detect problems before users notice",
      "code": "# Network monitoring commands\n\n# Continuous ping (availability + latency):\nping -i 1 8.8.8.8\n# Watch for: packet loss, latency spikes\n\n# Interface statistics (bandwidth utilisation):\nwatch -n 1 'cat /proc/net/dev | grep eth0'\n# RX bytes and TX bytes increase each second\n\n# Real-time interface traffic:\nip -s link show eth0\n# RX: bytes 1234567  packets 8901  errors 0  dropped 0\n# TX: bytes 9876543  packets 6789  errors 0  dropped 0\n\n# Install and use nload (real-time bandwidth graph):\nsudo apt install nload\nnload eth0\n\n# Install and use iftop (per-connection bandwidth):\nsudo apt install iftop\nsudo iftop -i eth0\n\n# SNMP — query interface counters:\nsnmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.2.2.1.10.1\n# ifInOctets — bytes received on interface 1\n\n# Simple uptime check script:\nwhile true; do\n  if ! ping -c 1 -W 2 8.8.8.8 > /dev/null 2>&1; then\n    echo $(date): 8.8.8.8 unreachable\n  fi\n  sleep 30\ndone",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The minimum viable monitoring setup for any production service: Uptime Kuma (free, self-hosted) with HTTP checks every 60 seconds and alerting via email or Slack. This takes 30 minutes to set up and immediately tells you when a service goes down — before users report it. Add Prometheus + Grafana when you need metrics and dashboards."
      },
      "keyPoints": [
        "Monitoring is proactive; troubleshooting is reactive — monitoring prevents user-reported outages",
        "Monitor: availability (ping/HTTP), latency, bandwidth utilisation, packet loss, error rates",
        "Prometheus + Grafana: modern metrics stack. LibreNMS: SNMP network monitoring",
        "Uptime Kuma: simple self-hosted uptime monitoring — minimum viable monitoring",
        "Baseline normal metrics — alerts are only useful if you know what normal looks like"
      ],
      "tryIt": "Install Uptime Kuma (docker run -d -p 3001:3001 louislam/uptime-kuma) and add HTTP monitors for 5 services you care about. Set up email or Slack alerting. Then install nload and iftop and observe real-time bandwidth usage on your machine. Identify which processes are using the most bandwidth."
    }
  },

  {
    "id": 122,
    "moduleId": 12,
    "moduleTitle": "Network Monitoring, Troubleshooting & Diagnostic Tools",
    "title": "Module 12 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered network monitoring and troubleshooting — the skills that let you diagnose problems systematically and detect them proactively. These are the most practical skills in the entire course.\n\n## What You Learned\n\n**Troubleshooting methodology** — bottom-up, layer by layer. The OSI model as a checklist.\n\n**Layer 1/2 diagnostics** — ip link show, ethtool, ip neigh show, arping. Interface state, speed, errors, ARP.\n\n**Layer 3/4 diagnostics** — ip addr, ip route, ping, traceroute, ss, nc, nmap. IP, routing, reachability, ports.\n\n**Packet capture** — tcpdump -i eth0 -n -w file.pcap. BPF filters. Wireshark for GUI analysis.\n\n**MTU and bandwidth** — ping -M do tests path MTU. iperf3 measures actual throughput. VPN MTU = 1420.\n\n**DNS and application** — dig @8.8.8.8, dig +trace, curl -v, openssl s_client, nc -zv.\n\n**Monitoring** — availability, latency, bandwidth, errors. Prometheus, LibreNMS, Uptime Kuma.\n\n## What Is Coming Next\n\nModule 13 covers cloud networking — VPCs, subnets, security groups, load balancers, and how the networking concepts from this course apply in AWS, GCP, and Azure.",
      "diagram": "flowchart TD\n    A[\"✅ Methodology\nbottom-up OSI\"] --> B[\"✅ L1/L2\ninterface ARP\"]\n    B --> C[\"✅ L3/L4\nIP route ping ports\"]\n    C --> D[\"✅ Packet capture\ntcpdump Wireshark\"]\n    D --> E[\"✅ MTU bandwidth\niperf3\"]\n    E --> F[\"✅ DNS application\ndig curl openssl\"]\n    F --> G[\"➡️ Cloud Networking\nModule 13\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 12 complete — network troubleshooting from Layer 1 to application layer",
      "code": "# Module 12 — complete diagnostic toolkit\n\n# Layer 1/2:\nip link show && ethtool eth0 && ip neigh show\n\n# Layer 3:\nip addr show && ip route show\nping -c 2 $(ip route | grep default | awk '{print $3}')\nping -c 2 8.8.8.8\ntraceroute -n 8.8.8.8\n\n# Layer 4:\nss -tnp && ss -tlnp\nnc -zv example.com 443\n\n# DNS:\ndig @8.8.8.8 google.com +short\ndig +trace google.com\n\n# Application:\ncurl -v https://example.com 2>&1 | head -30\nopenssl s_client -connect example.com:443\n\n# Packet capture:\nsudo tcpdump -i eth0 -n -w capture.pcap\n\n# MTU test:\nping -M do -s 1472 8.8.8.8\n\n# Bandwidth:\niperf3 -c iperf.he.net",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The complete diagnostic toolkit above covers every layer from physical to application. Memorise the sequence: ip link → ip neigh → ip addr → ip route → ping gateway → ping 8.8.8.8 → dig → nc → curl. This sequence diagnoses 95% of network problems in under 2 minutes."
      },
      "keyPoints": [
        "Bottom-up methodology: L1 → L2 → L3 → L4 → DNS → Application",
        "tcpdump -i eth0 -n -w file.pcap captures everything — Wireshark analyses it",
        "ping -M do -s 1472 tests path MTU; iperf3 measures actual throughput",
        "dig @8.8.8.8 bypasses local cache; dig +trace walks the full hierarchy",
        "Monitoring detects problems before users — Uptime Kuma is the minimum viable setup"
      ],
      "tryIt": "Run the complete diagnostic toolkit above on your machine. For each command, note what it tells you. Then set up Uptime Kuma and add monitors for three services. Finally, deliberately break the network at each layer and practice diagnosing it using only the toolkit commands — aim to identify each fault in under 60 seconds."
    }
  },

  // =========================
  // Networking Module 13: Cloud Networking, Virtual Networks & Load Balancers
  // =========================

  {
    "id": 123,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Welcome to Cloud Networking",
    "type": "lesson",
    "content": {
      "body": "Cloud networking applies the same fundamental concepts you have learned throughout this course — IP addressing, routing, firewalls, DNS — but in a virtualised, software-defined environment. Understanding cloud networking makes you significantly more effective at deploying and operating applications on AWS, GCP, and Azure.\n\n## What This Module Covers\n\n- VPCs and virtual networks — the cloud equivalent of a private network\n- Subnets in the cloud — public vs private, availability zones\n- Internet gateways and NAT gateways\n- Routing in cloud networks\n- Security groups and network ACLs — cloud firewalls\n- Load balancers — Layer 4 and Layer 7\n- CDNs — content delivery networks\n\n## The Key Insight\n\nCloud networking is just networking with a software-defined control plane. A VPC is a virtual network. A security group is a stateful firewall. A NAT gateway is NAT. A load balancer is a reverse proxy. The concepts are identical — only the configuration interface is different.",
      "diagram": "flowchart TD\n    A[\"Cloud Networking\"] --> B[\"VPC\nvirtual private network\"]\n    A --> C[\"Subnets\npublic private\"]\n    A --> D[\"Security Groups\nstateful firewall\"]\n    A --> E[\"Load Balancer\nL4 L7\"]\n    A --> F[\"CDN\nedge caching\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Cloud networking applies familiar concepts — VPC, subnets, firewalls, load balancers — in a virtualised environment",
      "code": "# Cloud networking quick reference (AWS CLI)\n\n# List VPCs:\naws ec2 describe-vpcs --query 'Vpcs[*].{ID:VpcId,CIDR:CidrBlock}'\n\n# List subnets:\naws ec2 describe-subnets --query 'Subnets[*].{ID:SubnetId,CIDR:CidrBlock,AZ:AvailabilityZone}'\n\n# List security groups:\naws ec2 describe-security-groups --query 'SecurityGroups[*].{ID:GroupId,Name:GroupName}'\n\n# List load balancers:\naws elbv2 describe-load-balancers --query 'LoadBalancers[*].{Name:LoadBalancerName,DNS:DNSName}'\n\n# Check routing tables:\naws ec2 describe-route-tables --query 'RouteTables[*].{ID:RouteTableId,Routes:Routes}'",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Every cloud provider uses slightly different terminology but the concepts are identical. AWS calls it a VPC, Azure calls it a Virtual Network (VNet), GCP calls it a VPC Network. AWS uses Security Groups and Network ACLs, Azure uses Network Security Groups, GCP uses Firewall Rules. The underlying networking is the same."
      },
      "keyPoints": [
        "Cloud networking is software-defined networking — same concepts, different control plane",
        "VPC = virtual private network, Security Group = stateful firewall, NAT Gateway = NAT",
        "AWS, Azure, and GCP use different names for the same concepts",
        "Understanding traditional networking makes cloud networking intuitive",
        "AWS CLI, Azure CLI, and gcloud are the command-line tools for cloud networking"
      ],
      "tryIt": "If you have an AWS account, run aws ec2 describe-vpcs to see your VPCs. Identify the default VPC and its CIDR block. Run aws ec2 describe-subnets to see the subnets. Note which are public (have a route to an internet gateway) and which are private."
    }
  },

  {
    "id": 124,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "VPCs and Subnets",
    "type": "lesson",
    "content": {
      "body": "A VPC (Virtual Private Cloud) is an isolated virtual network in the cloud. It is the cloud equivalent of a private data centre network — you control the IP address range, subnets, routing, and security.\n\n## VPC Design\n\nA VPC has a CIDR block that defines its IP address space. Common choices: 10.0.0.0/16 (65,536 addresses), 172.16.0.0/12, 192.168.0.0/16. Choose a range that does not overlap with your on-premises network if you plan to connect them via VPN or Direct Connect.\n\n## Public vs Private Subnets\n\n**Public subnet** — has a route to an internet gateway. Resources in a public subnet can have public IP addresses and be directly reachable from the internet. Web servers, load balancers, and bastion hosts live here.\n\n**Private subnet** — no route to an internet gateway. Resources cannot be directly reached from the internet. Databases, application servers, and internal services live here. They can reach the internet via a NAT gateway in the public subnet.\n\n## Availability Zones\n\nCloud regions have multiple availability zones (AZs) — physically separate data centres. Best practice: deploy subnets in multiple AZs and distribute resources across them. If one AZ fails, resources in other AZs continue serving traffic.\n\n## Subnet Sizing\n\nCloud providers reserve 5 addresses per subnet (network, broadcast, and 3 provider-reserved). A /24 subnet has 256 - 5 = 251 usable addresses. Size subnets generously — you cannot easily resize them later.",
      "diagram": "flowchart TD\n    A[\"VPC 10.0.0.0/16\"] --> B[\"Public Subnet\n10.0.1.0/24 AZ-a\"]\n    A --> C[\"Public Subnet\n10.0.2.0/24 AZ-b\"]\n    A --> D[\"Private Subnet\n10.0.10.0/24 AZ-a\"]\n    A --> E[\"Private Subnet\n10.0.11.0/24 AZ-b\"]\n    B --> F[\"Internet Gateway\"]\n    D --> G[\"NAT Gateway\nin public subnet\"]\n    G --> F\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style E fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "VPC with public and private subnets across two AZs — private subnets reach internet via NAT gateway",
      "code": "# VPC and subnet management (AWS CLI)\n\n# Create a VPC:\naws ec2 create-vpc --cidr-block 10.0.0.0/16\n\n# Create public subnet:\naws ec2 create-subnet \\\n  --vpc-id vpc-12345678 \\\n  --cidr-block 10.0.1.0/24 \\\n  --availability-zone us-east-1a\n\n# Create private subnet:\naws ec2 create-subnet \\\n  --vpc-id vpc-12345678 \\\n  --cidr-block 10.0.10.0/24 \\\n  --availability-zone us-east-1a\n\n# Create internet gateway and attach to VPC:\naws ec2 create-internet-gateway\naws ec2 attach-internet-gateway \\\n  --internet-gateway-id igw-12345678 \\\n  --vpc-id vpc-12345678\n\n# Add route to internet gateway (makes subnet public):\naws ec2 create-route \\\n  --route-table-id rtb-12345678 \\\n  --destination-cidr-block 0.0.0.0/0 \\\n  --gateway-id igw-12345678\n\n# Check if subnet is public (has IGW route):\naws ec2 describe-route-tables \\\n  --filters Name=association.subnet-id,Values=subnet-12345678",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "The standard VPC design for production: /16 VPC, /24 public subnets (one per AZ), /24 private subnets (one per AZ), /24 database subnets (one per AZ). This gives you 251 addresses per subnet, clear separation of tiers, and multi-AZ redundancy. Use this as your starting template for every new VPC."
      },
      "keyPoints": [
        "VPC: isolated virtual network with your own CIDR block — choose non-overlapping with on-premises",
        "Public subnet: has route to internet gateway — resources can have public IPs",
        "Private subnet: no internet gateway route — resources reach internet via NAT gateway",
        "Deploy subnets across multiple AZs for high availability",
        "Cloud providers reserve 5 addresses per subnet — /24 gives 251 usable"
      ],
      "tryIt": "Design a VPC for a three-tier web application: public subnets for load balancers, private subnets for application servers, database subnets for RDS. Use 10.0.0.0/16 as the VPC CIDR. Allocate /24 subnets for each tier in two AZs. Verify no subnets overlap using ipcalc."
    }
  },

  {
    "id": 125,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Security Groups and Network ACLs",
    "type": "lesson",
    "content": {
      "body": "Cloud providers offer two layers of network security: security groups (stateful, attached to instances) and network ACLs (stateless, attached to subnets). Understanding both and when to use each is essential for cloud security.\n\n## Security Groups\n\nSecurity groups are stateful firewalls attached to individual instances (EC2, RDS, etc.). They work like iptables with ESTABLISHED,RELATED — if you allow inbound traffic, the reply is automatically allowed.\n\nKey characteristics:\n- Stateful — reply traffic automatically allowed\n- Allow rules only — no explicit deny rules\n- Applied at the instance level\n- Multiple security groups can be attached to one instance\n- Default: deny all inbound, allow all outbound\n\n## Network ACLs\n\nNetwork ACLs are stateless firewalls attached to subnets. Every packet is evaluated independently — you must explicitly allow both inbound and outbound traffic for each connection.\n\nKey characteristics:\n- Stateless — must explicitly allow reply traffic\n- Allow and deny rules\n- Applied at the subnet level — affects all instances in the subnet\n- Rules evaluated in order (lowest number first)\n- Default: allow all inbound and outbound\n\n## When to Use Each\n\nSecurity groups for instance-level control (which instances can talk to which). Network ACLs for subnet-level control (block entire IP ranges, add an extra layer of defence).",
      "diagram": "flowchart TD\n    A[\"Internet\"] --> B[\"Network ACL\nsubnet level\nstateless\"]\n    B --> C[\"Security Group\ninstance level\nstateful\"]\n    C --> D[\"EC2 Instance\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#fef9c3,stroke:#ca8a04,color:#713f12\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Two layers: Network ACL (subnet, stateless) and Security Group (instance, stateful)",
      "code": "# Security groups and NACLs (AWS CLI)\n\n# Create a security group:\naws ec2 create-security-group \\\n  --group-name web-sg \\\n  --description 'Web server security group' \\\n  --vpc-id vpc-12345678\n\n# Allow inbound HTTP and HTTPS:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-12345678 \\\n  --protocol tcp --port 80 --cidr 0.0.0.0/0\n\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-12345678 \\\n  --protocol tcp --port 443 --cidr 0.0.0.0/0\n\n# Allow SSH from specific IP only:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-12345678 \\\n  --protocol tcp --port 22 --cidr 203.0.113.10/32\n\n# Allow DB security group to accept from app security group:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-db-12345678 \\\n  --protocol tcp --port 5432 \\\n  --source-group sg-app-12345678\n\n# View security group rules:\naws ec2 describe-security-groups --group-ids sg-12345678",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Reference security groups in other security group rules instead of using IP addresses. Allow the app security group to access the DB security group on port 5432 — not a specific IP range. This way, when you add or remove app servers, the database access rules update automatically. This is the cloud-native way to manage inter-tier access."
      },
      "keyPoints": [
        "Security groups: stateful, instance-level, allow rules only — default deny inbound",
        "Network ACLs: stateless, subnet-level, allow and deny rules — must allow reply traffic",
        "Security groups for instance-to-instance control; NACLs for subnet-level blocking",
        "Reference security groups in rules instead of IP addresses — scales automatically",
        "Security group default: deny all inbound, allow all outbound"
      ],
      "tryIt": "Create a three-tier security group setup: web-sg (allow 80/443 from internet), app-sg (allow 8080 from web-sg only), db-sg (allow 5432 from app-sg only). Verify that the web tier cannot directly access the database. This implements least-privilege network access between tiers."
    }
  },

  {
    "id": 126,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Load Balancers in the Cloud",
    "type": "lesson",
    "content": {
      "body": "Load balancers distribute incoming traffic across multiple backend instances. They are essential for high availability, scalability, and zero-downtime deployments. Cloud providers offer managed load balancers that handle health checks, SSL termination, and traffic distribution automatically.\n\n## Layer 4 vs Layer 7 Load Balancers\n\n**Layer 4 (Network Load Balancer)** — routes based on IP and TCP/UDP port. Very fast, low latency. Does not inspect HTTP content. Used for non-HTTP protocols, extreme performance requirements, or when you need to preserve the client IP.\n\n**Layer 7 (Application Load Balancer)** — routes based on HTTP content: URL path, hostname, headers, query strings. Can route /api to one target group and /static to another. Supports WebSockets, HTTP/2, and sticky sessions. The most common choice for web applications.\n\n## Health Checks\n\nLoad balancers continuously check backend health. If a backend fails health checks, the load balancer stops sending traffic to it. When it recovers, traffic resumes. This enables zero-downtime deployments — deploy to one instance at a time while the load balancer routes around it.\n\n## SSL Termination\n\nLoad balancers handle TLS — clients connect to the load balancer over HTTPS, the load balancer communicates with backends over HTTP on the internal network. Centralises certificate management.\n\n## Target Groups\n\nAWS ALB routes to target groups — collections of instances, IPs, or Lambda functions. One ALB can route to multiple target groups based on rules.",
      "diagram": "flowchart LR\n    A[\"Internet\"] --> B[\"Load Balancer\nL4 or L7\"]\n    B -->|\"health check OK\"|C[\"Instance 1\"]\n    B -->|\"health check OK\"|D[\"Instance 2\"]\n    B -->|\"health check FAIL\"|E[\"Instance 3\nno traffic\"]\n    B -->|\"path /api\"|F[\"API servers\"]\n    B -->|\"path /static\"|G[\"Static servers\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Load balancer distributes traffic, skips unhealthy instances, and routes by path (L7)",
      "code": "# Load balancer management (AWS CLI)\n\n# Create an Application Load Balancer:\naws elbv2 create-load-balancer \\\n  --name my-alb \\\n  --subnets subnet-pub-1a subnet-pub-1b \\\n  --security-groups sg-alb-12345678\n\n# Create a target group:\naws elbv2 create-target-group \\\n  --name web-targets \\\n  --protocol HTTP --port 80 \\\n  --vpc-id vpc-12345678 \\\n  --health-check-path /health\n\n# Register instances with target group:\naws elbv2 register-targets \\\n  --target-group-arn arn:aws:... \\\n  --targets Id=i-12345678 Id=i-87654321\n\n# Create listener (HTTPS → target group):\naws elbv2 create-listener \\\n  --load-balancer-arn arn:aws:... \\\n  --protocol HTTPS --port 443 \\\n  --certificates CertificateArn=arn:aws:acm:... \\\n  --default-actions Type=forward,TargetGroupArn=arn:aws:...\n\n# Check target health:\naws elbv2 describe-target-health \\\n  --target-group-arn arn:aws:...\n# State: healthy / unhealthy / draining",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Always configure a /health endpoint on your application that returns 200 OK when the application is ready to serve traffic. The load balancer uses this for health checks. If your application is starting up, processing a migration, or overloaded, return a non-200 status to temporarily remove the instance from rotation."
      },
      "keyPoints": [
        "L4 (NLB): routes by IP/port, very fast, preserves client IP",
        "L7 (ALB): routes by HTTP content (path, hostname, headers), SSL termination, WebSockets",
        "Health checks remove unhealthy instances automatically — enables zero-downtime deployments",
        "SSL termination at the load balancer — backends receive plain HTTP on internal network",
        "Target groups: collections of instances/IPs — one ALB can route to multiple target groups"
      ],
      "tryIt": "Create an ALB in AWS with two EC2 instances in a target group. Configure a /health endpoint on each instance. Stop one instance and observe the load balancer removing it from rotation. Restart it and confirm traffic resumes. Add a path-based routing rule to route /api to a different target group."
    }
  },


  {
    "id": 127,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Internet Gateways and NAT Gateways",
    "type": "lesson",
    "content": {
      "body": "Cloud networks use two types of gateways to control internet connectivity: internet gateways for public subnets and NAT gateways for private subnets. Understanding the difference is essential for designing secure cloud architectures.\n\n## Internet Gateway\n\nAn internet gateway (IGW) allows resources in a public subnet to communicate directly with the internet. It performs NAT for instances with public IP addresses — translating between the instance's private IP and its public IP.\n\nTo make a subnet public: attach an IGW to the VPC and add a route 0.0.0.0/0 → IGW to the subnet's route table.\n\n## NAT Gateway\n\nA NAT gateway allows instances in private subnets to initiate outbound connections to the internet (for software updates, API calls, etc.) without being directly reachable from the internet.\n\nThe NAT gateway lives in a public subnet and has a public IP. Private subnet instances route internet traffic to the NAT gateway, which translates their private IPs to its public IP.\n\nNAT gateways are managed by the cloud provider — no maintenance required. They scale automatically and are highly available within an AZ.\n\n## Cost Consideration\n\nNAT gateways are not free — AWS charges per hour and per GB of data processed. For cost optimisation, consider: one NAT gateway per AZ (for HA), or a NAT instance (cheaper but requires management).",
      "diagram": "flowchart LR\n    A[\"Public Instance\n10.0.1.10\"] -->|\"direct\"|B[\"Internet Gateway\"]\n    B --> C[\"Internet\"]\n    D[\"Private Instance\n10.0.10.10\"] -->|\"outbound only\"|E[\"NAT Gateway\nin public subnet\"]\n    E --> B\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style E fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Internet gateway for public subnets (bidirectional); NAT gateway for private subnets (outbound only)",
      "code": "# Internet and NAT gateways (AWS CLI)\n\n# Create and attach internet gateway:\naws ec2 create-internet-gateway\naws ec2 attach-internet-gateway \\\n  --internet-gateway-id igw-12345678 \\\n  --vpc-id vpc-12345678\n\n# Add IGW route to public subnet route table:\naws ec2 create-route \\\n  --route-table-id rtb-public \\\n  --destination-cidr-block 0.0.0.0/0 \\\n  --gateway-id igw-12345678\n\n# Create NAT gateway in public subnet:\n# First allocate an Elastic IP:\naws ec2 allocate-address --domain vpc\n# Then create NAT gateway:\naws ec2 create-nat-gateway \\\n  --subnet-id subnet-public-1a \\\n  --allocation-id eipalloc-12345678\n\n# Add NAT gateway route to private subnet route table:\naws ec2 create-route \\\n  --route-table-id rtb-private \\\n  --destination-cidr-block 0.0.0.0/0 \\\n  --nat-gateway-id nat-12345678\n\n# Verify routing:\naws ec2 describe-route-tables \\\n  --route-table-ids rtb-public rtb-private",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "NAT gateways cost money even when idle — approximately 0.045 USD per hour plus data transfer charges. In a multi-AZ setup with one NAT gateway per AZ, this adds up quickly. For development environments, consider using a single NAT gateway (accepting the AZ dependency) or a NAT instance (t3.nano costs ~3 USD/month vs ~32 USD/month for a NAT gateway)."
      },
      "keyPoints": [
        "Internet gateway: bidirectional internet access for public subnets — attach to VPC, add route",
        "NAT gateway: outbound-only internet access for private subnets — lives in public subnet",
        "Public subnet = has route to IGW; private subnet = has route to NAT gateway",
        "NAT gateways are managed, auto-scaling, HA within an AZ",
        "NAT gateways cost money — one per AZ for HA, or one shared for cost savings"
      ],
      "tryIt": "In AWS, create a VPC with a public and private subnet. Attach an internet gateway and add a route to the public subnet. Create a NAT gateway in the public subnet and add a route to the private subnet. Launch an EC2 instance in the private subnet and verify it can reach the internet (curl ifconfig.me) but cannot be reached from the internet."
    }
  },

  {
    "id": 128,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "CDN: Content Delivery Networks",
    "type": "lesson",
    "content": {
      "body": "A CDN (Content Delivery Network) is a geographically distributed network of servers that caches content close to users. Instead of every user fetching content from a single origin server, they fetch it from the nearest CDN edge node — reducing latency and offloading traffic from the origin.\n\n## How CDNs Work\n\nWhen a user requests content, DNS resolves the CDN domain to the nearest edge node (using anycast or geolocation-based DNS). The edge node checks its cache:\n- Cache hit — serves content directly from cache (fast, no origin request)\n- Cache miss — fetches from origin, caches it, serves to user\n\nSubsequent users in the same region get the cached version.\n\n## CDN Benefits\n\n- Lower latency — content served from 50ms away instead of 200ms\n- Reduced origin load — 90%+ of requests served from cache\n- DDoS protection — CDN absorbs attack traffic before it reaches origin\n- Global availability — if one edge node fails, traffic routes to another\n\n## Cache Control\n\nCache-Control headers control what gets cached and for how long. Cache-Control: max-age=86400 caches for 24 hours. Cache-Control: no-store prevents caching entirely. Cache-Control: private prevents CDN caching (user-specific content).\n\n## Major CDN Providers\n\nCloudflare (free tier available), AWS CloudFront, Akamai, Fastly, Google Cloud CDN.",
      "diagram": "flowchart LR\n    A[\"User London\"] -->|\"nearest edge\"|B[\"CDN Edge London\"]\n    C[\"User Tokyo\"] -->|\"nearest edge\"|D[\"CDN Edge Tokyo\"]\n    E[\"User NYC\"] -->|\"nearest edge\"|F[\"CDN Edge NYC\"]\n    B -->|\"cache miss\"|G[\"Origin Server\"]\n    D -->|\"cache miss\"|G\n    F -->|\"cache miss\"|G\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "CDN edge nodes cache content globally — origin only serves cache misses",
      "code": "# CDN diagnostics\n\n# Check if a site uses a CDN:\ncurl -sI https://www.cloudflare.com | grep -i 'cf-ray\|server'\n# cf-ray: 7a1b2c3d-LHR  (Cloudflare, London edge)\n# server: cloudflare\n\ncurl -sI https://aws.amazon.com | grep -i 'x-cache\|via'\n# x-cache: Hit from cloudfront\n# via: 1.1 cloudfront.net\n\n# Check cache headers:\ncurl -sI https://example.com/style.css | grep -i 'cache\|etag'\n# cache-control: max-age=31536000, immutable\n# etag: abc123\n\n# Check Cloudflare cache status:\ncurl -sI https://example.com | grep -i cf-cache\n# CF-Cache-Status: HIT    (from cache)\n# CF-Cache-Status: MISS   (from origin)\n\n# Measure CDN vs origin latency:\ncurl -w 'Time: %{time_total}s\n' -o /dev/null -s https://example.com\n# Run from different locations to see CDN effect\n\n# Check CDN provider by response headers:\ncurl -sI https://example.com | grep -i 'server\|via\|x-cache\|cf-ray\|x-amz'",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "CDN cache invalidation is one of the hardest problems in web development. Once content is cached at hundreds of edge nodes globally, updating it requires purging all caches simultaneously. The solution: use content-addressed URLs (include a hash in the filename) so new content gets a new URL and old content expires naturally. This is why build tools generate filenames like app.a3f8b2c1.js."
      },
      "keyPoints": [
        "CDN caches content at edge nodes close to users — reduces latency and origin load",
        "DNS routes users to the nearest edge node using anycast or geolocation",
        "Cache-Control headers control what gets cached and for how long",
        "CDNs absorb DDoS traffic before it reaches the origin server",
        "Content-addressed URLs (with hashes) solve cache invalidation problems"
      ],
      "tryIt": "Check whether 5 major websites use a CDN by looking for CF-Ray, X-Cache, or Via headers with curl -sI. Check the Cache-Control headers on static assets. Measure the response time with curl -w '%{time_total}' from your location. Sign up for Cloudflare's free tier and add a test domain — observe the CDN headers appear."
    }
  },

  {
    "id": 129,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Cloud Networking Architecture Patterns",
    "type": "lesson",
    "content": {
      "body": "Cloud networking architecture follows established patterns that balance security, availability, and cost. Understanding these patterns lets you design cloud networks that are secure by default and resilient to failures.\n\n## Three-Tier Architecture\n\nThe standard pattern for web applications:\n- **Public tier** — load balancers in public subnets across multiple AZs\n- **Application tier** — app servers in private subnets, only reachable from load balancers\n- **Data tier** — databases in isolated subnets, only reachable from app servers\n\nEach tier has its own security group. Traffic flows only in one direction: internet → load balancer → app server → database.\n\n## Bastion Host\n\nA bastion host (jump server) is a hardened instance in a public subnet used for SSH access to private instances. Instead of opening SSH on every private instance, you SSH to the bastion and then SSH from there to private instances.\n\n## VPC Peering\n\nVPC peering connects two VPCs so their instances can communicate using private IPs. Used to connect production and staging VPCs, or to connect VPCs in different accounts.\n\n## Transit Gateway\n\nAWS Transit Gateway is a hub that connects multiple VPCs and on-premises networks. Instead of creating a mesh of VPC peering connections, all VPCs connect to the transit gateway.",
      "diagram": "flowchart TD\n    A[\"Internet\"] --> B[\"ALB\npublic subnet\"]\n    B --> C[\"App Servers\nprivate subnet\"]\n    C --> D[\"RDS Database\ndb subnet\"]\n    E[\"Bastion Host\npublic subnet\"] -->|\"SSH\"|C\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style B fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Three-tier cloud architecture: public load balancer, private app servers, isolated database",
      "code": "# Cloud architecture patterns (AWS CLI)\n\n# Create bastion host security group:\naws ec2 create-security-group \\\n  --group-name bastion-sg \\\n  --description 'Bastion host'\n\n# Allow SSH to bastion from your IP only:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-bastion \\\n  --protocol tcp --port 22 \\\n  --cidr 203.0.113.10/32\n\n# Allow SSH from bastion to app servers:\naws ec2 authorize-security-group-ingress \\\n  --group-id sg-app \\\n  --protocol tcp --port 22 \\\n  --source-group sg-bastion\n\n# SSH through bastion to private instance:\nssh -J ec2-user@bastion-public-ip ec2-user@private-instance-ip\n\n# VPC peering:\naws ec2 create-vpc-peering-connection \\\n  --vpc-id vpc-prod \\\n  --peer-vpc-id vpc-staging\n\n# Accept peering connection:\naws ec2 accept-vpc-peering-connection \\\n  --vpc-peering-connection-id pcx-12345678\n\n# Add routes for peered VPC:\naws ec2 create-route \\\n  --route-table-id rtb-prod \\\n  --destination-cidr-block 10.1.0.0/16 \\\n  --vpc-peering-connection-id pcx-12345678",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Use AWS Systems Manager Session Manager instead of a bastion host for SSH access to private instances. Session Manager requires no open SSH ports, no bastion host, and no key management — access is controlled by IAM policies. It logs all sessions to CloudWatch and S3. This is the modern, more secure alternative to bastion hosts."
      },
      "keyPoints": [
        "Three-tier: public load balancer → private app servers → isolated database",
        "Traffic flows one direction: internet → LB → app → DB — each tier only reachable from the tier above",
        "Bastion host: hardened public instance for SSH access to private instances",
        "VPC peering: connects two VPCs for private IP communication",
        "Transit Gateway: hub connecting multiple VPCs — replaces mesh of peering connections"
      ],
      "tryIt": "Design a three-tier architecture for a web application in AWS: ALB in public subnets, EC2 in private subnets, RDS in database subnets. Create the security groups with least-privilege rules. Verify that the database is not reachable from the internet but is reachable from the app servers."
    }
  },

  {
    "id": 130,
    "moduleId": 13,
    "moduleTitle": "Cloud Networking, Virtual Networks & Load Balancers",
    "title": "Module 13 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered cloud networking — how the fundamental networking concepts from this course apply in virtualised cloud environments. Cloud networking is just networking with a software-defined control plane.\n\n## What You Learned\n\n**VPCs and subnets** — VPC is your virtual private network. Public subnets have IGW routes; private subnets use NAT gateways. Deploy across multiple AZs for high availability.\n\n**Security groups and NACLs** — security groups are stateful instance-level firewalls; NACLs are stateless subnet-level firewalls. Reference security groups in rules instead of IP addresses.\n\n**Load balancers** — L4 (NLB) for speed and non-HTTP; L7 (ALB) for HTTP routing, SSL termination, and path-based routing. Health checks enable zero-downtime deployments.\n\n**Internet and NAT gateways** — IGW for public subnets (bidirectional); NAT gateway for private subnets (outbound only).\n\n**CDNs** — cache content at edge nodes globally. Cache-Control headers control caching. Content-addressed URLs solve invalidation.\n\n**Architecture patterns** — three-tier (LB → app → DB), bastion host, VPC peering, Transit Gateway.\n\n## What Is Coming Next\n\nModule 14 covers advanced network security — IDS/IPS, Zero Trust, and modern security architectures.",
      "diagram": "flowchart TD\n    A[\"✅ VPCs subnets\npublic private AZ\"] --> B[\"✅ Security groups\nNACLs stateful\"]\n    B --> C[\"✅ Load balancers\nL4 L7 health checks\"]\n    C --> D[\"✅ IGW NAT gateway\ninternet access\"]\n    D --> E[\"✅ CDN\nedge caching\"]\n    E --> F[\"✅ Architecture\nthree-tier bastion\"]\n    F --> G[\"➡️ Advanced Security\nModule 14\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 13 complete — cloud networking from VPCs to CDNs and architecture patterns",
      "code": "# Module 13 command reference (AWS CLI)\n\n# VPC and subnets:\naws ec2 describe-vpcs\naws ec2 describe-subnets\n\n# Security groups:\naws ec2 describe-security-groups\naws ec2 authorize-security-group-ingress --group-id sg-xxx --protocol tcp --port 443 --cidr 0.0.0.0/0\n\n# Load balancers:\naws elbv2 describe-load-balancers\naws elbv2 describe-target-health --target-group-arn arn:aws:...\n\n# Routing:\naws ec2 describe-route-tables\n\n# CDN check:\ncurl -sI https://example.com | grep -i 'cf-ray\|x-cache\|server'\n\n# Check cache headers:\ncurl -sI https://example.com/app.js | grep -i cache",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most important cloud networking principle: never put databases in public subnets. Databases should always be in private subnets, only reachable from application servers via security group rules. This single rule prevents the most common cloud security mistakes."
      },
      "keyPoints": [
        "VPC: your virtual private network — public subnets (IGW) and private subnets (NAT gateway)",
        "Security groups: stateful, instance-level — reference other SGs instead of IP ranges",
        "ALB: L7 load balancer with path routing, SSL termination, health checks",
        "Three-tier architecture: LB (public) → app (private) → DB (isolated)",
        "CDN: cache at edge nodes, Cache-Control headers, content-addressed URLs"
      ],
      "tryIt": "Build the complete three-tier architecture in AWS: VPC with public/private/DB subnets across two AZs, ALB in public subnets, EC2 in private subnets, RDS in DB subnets, security groups with least-privilege rules, NAT gateway for private subnet internet access. Verify each tier is only reachable from the tier above it."
    }
  },

  // =========================
  // Networking Module 14: Advanced Network Security, IDS/IPS & Zero Trust
  // =========================

  {
    "id": 131,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Welcome to Advanced Network Security",
    "type": "lesson",
    "content": {
      "body": "This module covers the advanced security concepts that protect modern networks: intrusion detection and prevention, Zero Trust architecture, DDoS mitigation, and the security principles that underpin enterprise network design.\n\n## What This Module Covers\n\n- IDS and IPS — detecting and blocking attack patterns in network traffic\n- Signature-based vs anomaly-based detection\n- Network-based vs host-based IDS/IPS\n- Zero Trust — never trust, always verify\n- Micro-segmentation — limiting lateral movement\n- DDoS attacks and mitigation\n- Modern security architecture\n\n## Why This Module Matters\n\nFirewalls and VPNs are necessary but not sufficient. A firewall blocks known-bad traffic. An IDS detects unknown-bad traffic. Zero Trust assumes the network is already compromised and verifies every request. DDoS mitigation keeps services available under attack. Together, these form a complete security posture.",
      "diagram": "flowchart TD\n    A[\"Advanced Security\"] --> B[\"IDS/IPS\ndetect block attacks\"]\n    A --> C[\"Zero Trust\nnever trust always verify\"]\n    A --> D[\"Micro-segmentation\nlimit lateral movement\"]\n    A --> E[\"DDoS mitigation\nstay available under attack\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style C fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style D fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style E fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f",
      "diagramCaption": "Advanced security: IDS/IPS, Zero Trust, micro-segmentation, and DDoS mitigation",
      "code": "# Advanced security quick reference\n\n# Check for IDS/IPS running:\nsystemctl status snort 2>/dev/null\nsystemctl status suricata 2>/dev/null\n\n# Check for suspicious connections:\nss -tnp | grep -v ESTABLISHED\n# Look for: SYN_SENT to unexpected IPs\n\n# Check for port scans in logs:\ngrep 'port scan\|nmap\|SYN flood' /var/log/syslog 2>/dev/null\n\n# Check connection count per IP (DDoS indicator):\nss -tn | awk '{print $5}' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq -c | sort -rn | head\n\n# Check for failed auth attempts:\ngrep 'Failed password' /var/log/auth.log | tail -20",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The security landscape has shifted from perimeter-based security (trust everything inside the firewall) to Zero Trust (trust nothing, verify everything). This shift was driven by the reality that attackers regularly bypass perimeters — through phishing, supply chain attacks, and compromised credentials. Zero Trust assumes breach and limits the damage."
      },
      "keyPoints": [
        "Firewalls block known-bad; IDS detects unknown-bad; Zero Trust assumes breach",
        "IDS: detects attacks and alerts. IPS: detects and blocks attacks automatically",
        "Zero Trust: never trust, always verify — every request authenticated and authorised",
        "Micro-segmentation limits lateral movement after a breach",
        "DDoS mitigation keeps services available when under volumetric attack"
      ],
      "tryIt": "Run ss -tnp and look for any unexpected outbound connections. Check /var/log/auth.log for failed SSH attempts. Run grep 'Failed password' /var/log/auth.log | wc -l to count brute-force attempts. This gives you a baseline of what normal looks like on your machine."
    }
  },

  {
    "id": 132,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "IDS and IPS: Intrusion Detection and Prevention",
    "type": "lesson",
    "content": {
      "body": "An IDS (Intrusion Detection System) monitors network traffic for suspicious patterns and generates alerts. An IPS (Intrusion Prevention System) does the same but also takes action — blocking the traffic automatically. Together they provide visibility into attacks that firewalls cannot detect.\n\n## How IDS/IPS Works\n\nIDS/IPS analyses network traffic against a database of known attack signatures and behavioural patterns:\n\n**Signature-based detection** — matches traffic against known attack patterns. Fast and accurate for known attacks. Cannot detect zero-day attacks (no signature exists yet).\n\n**Anomaly-based detection** — establishes a baseline of normal traffic and alerts on deviations. Can detect unknown attacks. Higher false positive rate.\n\n## Deployment Modes\n\n**Network-based (NIDS/NIPS)** — monitors traffic on a network segment. Deployed inline (IPS) or on a mirror/tap port (IDS). Sees all traffic on the segment.\n\n**Host-based (HIDS/HIPS)** — runs on individual hosts. Monitors system calls, file changes, and local network traffic. Can see encrypted traffic after decryption.\n\n## Popular Tools\n\n**Snort** — the original open-source NIDS/NIPS. Rule-based, widely deployed.\n\n**Suricata** — modern multi-threaded IDS/IPS/NSM. Compatible with Snort rules. Better performance on high-bandwidth links.\n\n**OSSEC/Wazuh** — host-based IDS. Monitors log files, file integrity, rootkits.",
      "diagram": "flowchart TD\n    A[\"Network Traffic\"] --> B[\"IDS/IPS Engine\"]\n    B --> C[\"Signature matching\nknown attacks\"]\n    B --> D[\"Anomaly detection\nbaseline deviation\"]\n    C -->|\"match\"|E[\"IDS: Alert\"]\n    C -->|\"match\"|F[\"IPS: Block + Alert\"]\n    D -->|\"deviation\"|E\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#fef9c3,stroke:#ca8a04,color:#713f12",
      "diagramCaption": "IDS alerts on suspicious traffic; IPS blocks it — both use signature and anomaly detection",
      "code": "# Suricata IDS/IPS setup\n\n# Install Suricata:\nsudo apt install suricata\n\n# Update rules:\nsudo suricata-update\n\n# Run in IDS mode (monitor only):\nsudo suricata -c /etc/suricata/suricata.yaml -i eth0\n\n# Run in IPS mode (inline, requires nfqueue):\nsudo iptables -I FORWARD -j NFQUEUE\nsudo suricata -c /etc/suricata/suricata.yaml -q 0\n\n# View alerts:\ntail -f /var/log/suricata/fast.log\n# 01/15/2024-12:00:01 [**] [1:2100498:7] GPL ATTACK_RESPONSE id check returned root [**]\n# Timestamp, rule ID, rule name\n\n# View detailed alerts (JSON):\ntail -f /var/log/suricata/eve.json | python3 -m json.tool\n\n# Test with a known attack signature:\n# curl http://testmyids.com\n# Should trigger: GPL ATTACK_RESPONSE id check returned root\n\n# Check Suricata stats:\nsuricatasc -c uptime\nsuricatasc -c stats",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Start with IDS mode (detection only) before switching to IPS mode (blocking). IPS mode can block legitimate traffic if rules are too aggressive — false positives cause outages. Run in IDS mode for a week, tune the rules to eliminate false positives, then switch to IPS mode. Never deploy IPS inline without testing first."
      },
      "keyPoints": [
        "IDS: detects and alerts. IPS: detects, blocks, and alerts",
        "Signature-based: fast, accurate for known attacks, misses zero-days",
        "Anomaly-based: detects unknown attacks, higher false positive rate",
        "NIDS/NIPS: network-level, sees all traffic. HIDS/HIPS: host-level, sees encrypted traffic",
        "Suricata is the modern choice — multi-threaded, high performance, Snort-compatible rules"
      ],
      "tryIt": "Install Suricata and run it in IDS mode on a test VM. Update the rules with suricata-update. Generate some test traffic and watch the alerts in /var/log/suricata/fast.log. Visit testmyids.com to trigger a known test signature. Review the alert format and identify the rule that fired."
    }
  },

  {
    "id": 133,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Zero Trust Architecture",
    "type": "lesson",
    "content": {
      "body": "Zero Trust is a security model based on the principle of never trust, always verify. Traditional security assumed that everything inside the network perimeter was trusted. Zero Trust assumes the network is already compromised and requires every request to be authenticated and authorised regardless of where it comes from.\n\n## Why Zero Trust\n\nThe traditional perimeter model fails because:\n- Attackers regularly bypass perimeters (phishing, supply chain, stolen credentials)\n- Remote work means users are no longer inside the perimeter\n- Cloud and SaaS mean resources are no longer inside the perimeter\n- Lateral movement: once inside, attackers move freely\n\n## Zero Trust Principles\n\n**Verify explicitly** — always authenticate and authorise based on all available data points: identity, location, device health, service, workload, data classification.\n\n**Use least privilege access** — limit user access with just-in-time and just-enough-access. Minimise blast radius.\n\n**Assume breach** — minimise blast radius, segment access, verify end-to-end encryption, use analytics to detect anomalies.\n\n## Zero Trust in Practice\n\n- **Identity verification** — MFA for every access request, not just VPN login\n- **Device health** — only allow access from compliant, managed devices\n- **Micro-segmentation** — divide the network into small zones, require authentication between zones\n- **Continuous monitoring** — log and analyse all access, detect anomalies in real time",
      "diagram": "flowchart TD\n    A[\"Request\"] --> B[\"Verify Identity\nMFA required\"]\n    B --> C[\"Check Device\nmanaged compliant\"]\n    C --> D[\"Check Context\nlocation time risk\"]\n    D --> E{\"Authorised?\"}\n    E -->|\"Yes\"|F[\"Grant least-privilege\ntime-limited access\"]\n    E -->|\"No\"|G[\"Deny + Alert\"]\n    F --> H[\"Monitor continuously\"]\n    style A fill:#dbeafe,stroke:#3b82f6,color:#1e3a5f\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Zero Trust: verify identity, check device, assess context, grant least-privilege, monitor continuously",
      "code": "# Zero Trust implementation tools\n\n# 1. Identity — enforce MFA everywhere:\n# Use an identity provider: Okta, Azure AD, Google Workspace\n# Require MFA for all applications, not just VPN\n\n# 2. Device health — check before granting access:\n# MDM solutions: Jamf (macOS), Intune (Windows)\n# Check: OS version, disk encryption, antivirus, screen lock\n\n# 3. Network micro-segmentation with iptables:\n# Allow only specific service-to-service communication:\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.2.0/24 -p tcp --dport 5432 -j ACCEPT\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.2.0/24 -j DROP\n\n# 4. Service mesh (Istio/Linkerd) for Zero Trust between microservices:\n# Mutual TLS (mTLS) between all services\n# Every service verifies the identity of every other service\n# kubectl apply -f istio-mtls-policy.yaml\n\n# 5. Continuous monitoring:\n# Log all access attempts:\ngrep 'Accepted\|Failed' /var/log/auth.log | tail -50\n\n# 6. Cloudflare Zero Trust (free tier):\n# Replace VPN with identity-aware access proxy\n# Users authenticate with SSO before accessing internal apps",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Cloudflare Zero Trust (formerly Cloudflare Access) is a free tool that implements Zero Trust for web applications. Instead of a VPN, users authenticate with their identity provider (Google, Okta, GitHub) before accessing internal applications. The application is never exposed to the internet — Cloudflare proxies authenticated requests. Free for up to 50 users."
      },
      "keyPoints": [
        "Zero Trust: never trust, always verify — assume the network is already compromised",
        "Three principles: verify explicitly, use least privilege, assume breach",
        "Traditional perimeter fails: phishing bypasses it, remote work is outside it",
        "Micro-segmentation: divide network into zones, require auth between zones",
        "Cloudflare Zero Trust: free identity-aware access proxy — replaces VPN for web apps"
      ],
      "tryIt": "Implement a basic Zero Trust principle on a Linux server: disable password authentication for SSH (require keys only), enable MFA with Google Authenticator (libpam-google-authenticator), and restrict SSH to specific source IPs. This implements verify explicitly and least privilege for SSH access."
    }
  },

  {
    "id": 134,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Micro-Segmentation",
    "type": "lesson",
    "content": {
      "body": "Micro-segmentation divides a network into small, isolated zones and requires explicit authorisation for traffic between zones. It is the network implementation of the Zero Trust principle — even if an attacker compromises one zone, they cannot move laterally to other zones without being detected and blocked.\n\n## The Problem: Lateral Movement\n\nIn a flat network, once an attacker compromises one machine, they can reach every other machine on the same network. This is called lateral movement. A compromised web server can directly attack the database, the file server, and every workstation.\n\n## Micro-Segmentation Solution\n\nMicro-segmentation creates security boundaries between workloads:\n- Web servers can only reach app servers on specific ports\n- App servers can only reach databases on specific ports\n- No workload can reach another workload it does not need to communicate with\n- All inter-zone traffic is logged\n\n## Implementation Approaches\n\n**Network-based** — VLANs and firewall rules between subnets. Traditional approach, coarse-grained.\n\n**Host-based** — iptables/nftables rules on each host. Fine-grained, works regardless of network topology.\n\n**Service mesh** — Istio, Linkerd. Mutual TLS between all services. Every service verifies the identity of every other service. The most granular approach for microservices.",
      "diagram": "flowchart TD\n    A[\"Flat Network\nattacker moves freely\"] --> B[\"Compromise web server\"]\n    B --> C[\"Access database\"]\n    B --> D[\"Access file server\"]\n    B --> E[\"Access workstations\"]\n    F[\"Micro-segmented\"] --> G[\"Compromise web server\"]\n    G -->|\"blocked\"|H[\"Cannot reach database\"]\n    G -->|\"blocked\"|I[\"Cannot reach file server\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style H fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Micro-segmentation stops lateral movement — compromising one zone does not give access to others",
      "code": "# Micro-segmentation with iptables\n\n# Scenario: web server, app server, database — each in own subnet\n# Web:  10.0.1.0/24\n# App:  10.0.2.0/24\n# DB:   10.0.3.0/24\n\n# On the router/firewall — FORWARD chain rules:\n\n# Allow web → app on port 8080 only:\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.2.0/24 -p tcp --dport 8080 -j ACCEPT\n\n# Allow app → DB on port 5432 only:\nsudo iptables -A FORWARD -s 10.0.2.0/24 -d 10.0.3.0/24 -p tcp --dport 5432 -j ACCEPT\n\n# Block all other inter-zone traffic:\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.3.0/24 -j DROP  # web cannot reach DB\nsudo iptables -A FORWARD -s 10.0.3.0/24 -d 10.0.1.0/24 -j DROP  # DB cannot reach web\n\n# Log blocked inter-zone traffic (detect lateral movement attempts):\nsudo iptables -A FORWARD -j LOG --log-prefix 'BLOCKED-FORWARD: '\n\n# Verify: from web server, try to reach database directly:\n# nc -zv 10.0.3.10 5432  → should fail\n# nc -zv 10.0.2.10 8080  → should succeed",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Log all blocked inter-zone traffic. When an attacker compromises a machine and attempts lateral movement, the blocked connection attempts appear in your logs. Without logging, you would never know the attempt happened. With logging, you get an early warning that a machine has been compromised and is probing the network."
      },
      "keyPoints": [
        "Lateral movement: attacker compromises one machine and moves to others on the same network",
        "Micro-segmentation creates security boundaries — explicit authorisation required between zones",
        "Network-based: VLANs and firewall rules. Host-based: iptables per host. Service mesh: mTLS",
        "Log all blocked inter-zone traffic — lateral movement attempts appear as blocked connections",
        "Micro-segmentation is the network implementation of Zero Trust least-privilege"
      ],
      "tryIt": "Set up micro-segmentation between three VMs (web, app, DB). Configure iptables FORWARD rules to allow only web→app on port 8080 and app→DB on port 5432. Verify web cannot reach DB directly. Enable logging for blocked traffic. Then simulate lateral movement from the web VM and observe the blocked attempts in the logs."
    }
  },


  // =========================
  // Networking Module 14 continued
  // =========================

  {
    "id": 135,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "DDoS Attacks and Mitigation",
    "type": "lesson",
    "content": {
      "body": "A DDoS (Distributed Denial of Service) attack floods a target with traffic from thousands of compromised machines, overwhelming its capacity to serve legitimate users. DDoS attacks are one of the most common and disruptive threats on the internet.\n\n## Types of DDoS Attacks\n\n**Volumetric attacks** — flood the target with massive traffic to saturate bandwidth. Measured in Gbps. The largest attacks exceed 1 Tbps. Examples: UDP flood, ICMP flood, DNS amplification.\n\n**Protocol attacks** — exploit weaknesses in network protocols to exhaust server resources. Examples: SYN flood (fills TCP connection table), Ping of Death.\n\n**Application layer attacks (Layer 7)** — send seemingly legitimate HTTP requests that are expensive to process. Harder to detect because traffic looks normal. Examples: HTTP flood, Slowloris.\n\n## DDoS Amplification\n\nAttackers exploit protocols that respond with much more data than the request. DNS amplification: a 60-byte query generates a 3,000-byte response — 50x amplification. The attacker spoofs the victim's IP so all responses flood the victim.\n\n## Mitigation Strategies\n\n**Upstream scrubbing** — traffic routed through a scrubbing centre that filters attack traffic. Used by Cloudflare, Akamai, AWS Shield.\n\n**Anycast diffusion** — distribute attack across many PoPs so no single location is overwhelmed.\n\n**Rate limiting** — limit requests per IP per second at the edge.\n\n**BGP blackholing** — announce victim IP as unreachable (last resort — takes target offline).",
      "diagram": "flowchart TD\n    A[\"DDoS Types\"] --> B[\"Volumetric\nUDP ICMP flood\nsaturate bandwidth\"]\n    A --> C[\"Protocol\nSYN flood\nexhaust state\"]\n    A --> D[\"Application L7\nHTTP flood\nlooks legitimate\"]\n    E[\"Mitigation\"] --> F[\"Scrubbing centre\"]\n    E --> G[\"Anycast diffusion\"]\n    E --> H[\"Rate limiting\"]\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Three DDoS types target bandwidth, protocol state, and application resources — each needs different mitigation",
      "code": "# DDoS detection and mitigation\n\n# Monitor for SYN flood:\nss -s\n# High orphan count = possible SYN flood\n\n# Check connections per IP:\nss -tn | awk '{print $5}' | grep -oE '[0-9.]+' | sort | uniq -c | sort -rn | head\n\n# Rate limit new connections (iptables):\nsudo iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT\nsudo iptables -A INPUT -p tcp --dport 80 -j DROP\n\n# SYN cookies (kernel protection against SYN flood):\nsudo sysctl -w net.ipv4.tcp_syncookies=1\n\n# Cloudflare DDoS protection (free tier):\n# Automatic L3/L4/L7 DDoS mitigation\n# Under Attack Mode: JS challenge for all visitors\n\n# AWS Shield Standard (free):\n# Automatic L3/L4 protection\n# AWS Shield Advanced: L7 protection + DDoS response team\n\n# Detect DNS amplification:\nsudo tcpdump -i eth0 -n 'udp src port 53' | wc -l\n# High count = amplification attack targeting you",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "DNS amplification attacks exploit open DNS resolvers — servers that respond to queries from any IP. If you run a DNS server, configure it to only respond to your own clients. This prevents your server from being used as an amplifier. Check if your DNS server is open at openresolver.com."
      },
      "keyPoints": [
        "Volumetric: saturate bandwidth. Protocol: exhaust server state. L7: expensive legitimate-looking requests",
        "DNS amplification: 60-byte query → 3000-byte response — 50x amplification",
        "Scrubbing centres filter attack traffic before it reaches the target",
        "SYN cookies protect against SYN floods — enable with sysctl tcp_syncookies=1",
        "Cloudflare free tier provides automatic DDoS mitigation for HTTP/HTTPS"
      ],
      "tryIt": "Enable SYN cookies on a Linux VM with sudo sysctl -w net.ipv4.tcp_syncookies=1. Check if your DNS server is an open resolver at openresolver.com. Sign up for Cloudflare's free tier and enable DDoS protection on a test domain. Check the Firewall Events dashboard after enabling."
    }
  },

  {
    "id": 136,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Inline vs Passive Deployment",
    "type": "lesson",
    "content": {
      "body": "Security devices can be deployed in two fundamental modes: inline (in the traffic path) or passive (monitoring a copy of traffic). Each has different capabilities, risks, and use cases.\n\n## Inline Deployment\n\nThe security device sits directly in the traffic path. All traffic passes through it. The device can inspect, modify, block, or drop traffic in real time.\n\nAdvantages: can block attacks immediately, no traffic bypasses the device.\nDisadvantages: single point of failure (if the device fails, traffic stops), adds latency, requires high availability configuration.\n\nUsed for: IPS, next-generation firewalls, WAFs, SSL inspection appliances.\n\n## Passive Deployment (Out-of-Band)\n\nThe security device receives a copy of traffic via a network tap or SPAN (Switched Port Analyser) port. It cannot block traffic — only observe and alert.\n\nAdvantages: no impact on traffic if the device fails, no added latency, can be added without network changes.\nDisadvantages: cannot block attacks, only detects and alerts.\n\nUsed for: IDS, network forensics, traffic analysis, compliance monitoring.\n\n## Hybrid Approach\n\nMany deployments use both: passive IDS for broad visibility across the network, inline IPS at critical chokepoints (internet edge, DMZ boundary). This balances coverage with the risk of inline device failure.",
      "diagram": "flowchart TD\n    A[\"Traffic\"] --> B[\"Inline Device\nIPS NGFW WAF\"]\n    B --> C[\"Destination\"]\n    B -->|\"block\"|D[\"Dropped\"]\n    E[\"Traffic\"] --> F[\"Network Tap\"]\n    F --> G[\"Destination\"]\n    F -->|\"copy\"|H[\"Passive IDS\nalert only\"]\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Inline: blocks traffic but is a single point of failure. Passive: alert-only but no traffic impact",
      "code": "# Inline vs passive deployment\n\n# Passive IDS with Suricata (SPAN/tap port):\nsudo suricata -c /etc/suricata/suricata.yaml -i eth1\n# eth1 receives mirrored traffic from switch SPAN port\n# Suricata analyses and alerts but cannot block\n\n# Inline IPS with Suricata (nfqueue):\nsudo iptables -I FORWARD -j NFQUEUE --queue-num 0\nsudo suricata -c /etc/suricata/suricata.yaml -q 0\n# All forwarded traffic goes through Suricata\n# Suricata can drop packets\n\n# Configure SPAN port on Linux bridge:\n# Mirror eth0 traffic to eth1 for passive monitoring:\nsudo tc qdisc add dev eth0 ingress\nsudo tc filter add dev eth0 parent ffff: \\\n  protocol all u32 match u32 0 0 \\\n  action mirred egress mirror dev eth1\n\n# High availability for inline devices:\n# Use fail-open mode: if device fails, traffic passes through\n# Or: redundant inline devices with failover\n\n# Check if Suricata is dropping packets:\nsuricatasc -c stats | grep drop",
      "language": "bash",
      "callout": {
        "type": "warning",
        "text": "Inline IPS devices must be configured for fail-open mode in production — if the device crashes or loses power, traffic should pass through rather than being blocked. A fail-closed inline device that crashes takes down the entire network segment. Always test failover behaviour before deploying inline security devices in production."
      },
      "keyPoints": [
        "Inline: traffic passes through device — can block attacks, but single point of failure",
        "Passive: receives traffic copy via tap/SPAN — alert only, no traffic impact if device fails",
        "IPS deployed inline; IDS deployed passively — or hybrid for both coverage and safety",
        "Fail-open mode: if inline device fails, traffic passes through — prevents outage",
        "SPAN port mirrors switch traffic to a monitoring device without affecting the original traffic"
      ],
      "tryIt": "Configure Suricata in passive mode on a VM receiving mirrored traffic. Generate some test traffic and verify alerts appear in /var/log/suricata/fast.log without any traffic being blocked. Then switch to inline mode with nfqueue and verify Suricata can drop packets matching a test rule."
    }
  },

  {
    "id": 137,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Common Security Mistakes",
    "type": "lesson",
    "content": {
      "body": "Security incidents are often caused by a small set of recurring mistakes. Knowing these patterns helps you avoid them and audit existing configurations effectively.\n\n## Mistake 1: Flat Networks\n\nAll servers on the same subnet with no segmentation. A compromised web server can directly attack the database. Fix: implement micro-segmentation with firewall rules between tiers.\n\n## Mistake 2: No MFA\n\nSSH and VPN access protected only by passwords. Passwords get phished, leaked, or brute-forced. Fix: require SSH keys and MFA for all remote access.\n\n## Mistake 3: Overly Permissive Security Groups\n\nSecurity groups with 0.0.0.0/0 on ports that should be restricted. SSH open to the world, databases accessible from any IP. Fix: restrict to specific source IPs or security groups.\n\n## Mistake 4: No Logging\n\nNo centralised logging means breaches go undetected for months. Fix: ship all logs to a SIEM (Splunk, Elastic, CloudWatch Logs). Alert on anomalies.\n\n## Mistake 5: Unpatched Systems\n\nKnown vulnerabilities exploited because patches were not applied. Fix: automated patch management, regular vulnerability scanning.\n\n## Mistake 6: Default Credentials\n\nNetwork devices, databases, and applications left with default passwords. Fix: change all default credentials immediately after deployment. Use a password manager.\n\n## Mistake 7: No Incident Response Plan\n\nWhen a breach occurs, no one knows what to do. Fix: document and practice an incident response plan before you need it.",
      "diagram": "flowchart TD\n    A[\"Common Mistakes\"] --> B[\"Flat network\nno segmentation\"]\n    A --> C[\"No MFA\npasswords only\"]\n    A --> D[\"Permissive SGs\n0.0.0.0/0 everywhere\"]\n    A --> E[\"No logging\nbreaches undetected\"]\n    A --> F[\"Unpatched systems\nknown vulns\"]\n    A --> G[\"Default credentials\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Seven common security mistakes — each one is a known pattern with a known fix",
      "code": "# Security audit checklist\n\n# 1. Check for flat network (all on same subnet):\nip route show\n# If only one subnet: implement segmentation\n\n# 2. Check SSH authentication:\ngrep 'PasswordAuthentication' /etc/ssh/sshd_config\n# Should be: PasswordAuthentication no\n\n# 3. Check for open ports:\nnmap -p 1-65535 <your-public-ip>\n# Only expected ports should be open\n\n# 4. Check logging:\nsystemctl status rsyslog\nls -la /var/log/auth.log\n# Should exist and be recent\n\n# 5. Check for updates:\nsudo apt list --upgradable 2>/dev/null | wc -l\n# Should be 0\n\n# 6. Check for default credentials:\n# Common defaults to check:\n# admin/admin, root/root, admin/password\n# Check: ssh admin@<device-ip>\n\n# 7. Check for world-readable sensitive files:\nfind /etc -name '*.conf' -perm -o+r 2>/dev/null | head\n\n# 8. Check for SUID binaries (privilege escalation risk):\nfind / -perm -4000 -type f 2>/dev/null | head",
      "language": "bash",
      "callout": {
        "type": "tip",
        "text": "Run the security audit checklist above on every new server before it goes into production. It takes 5 minutes and catches the most common misconfigurations. Automate it with a script that runs on first boot. The goal is to make secure configuration the default, not an afterthought."
      },
      "keyPoints": [
        "Flat networks enable lateral movement — implement micro-segmentation between tiers",
        "No MFA means one phished password = full access — require MFA for all remote access",
        "Overly permissive security groups are the most common cloud security mistake",
        "No logging means breaches go undetected — centralise logs and alert on anomalies",
        "Default credentials are trivially exploited — change them immediately after deployment"
      ],
      "tryIt": "Run the security audit checklist above on a Linux VM. For each item, note what you find and whether it represents a security gap. Fix at least three issues. Then run the checklist again to confirm the fixes are in place."
    }
  },

  {
    "id": 138,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Modern Security Architecture",
    "type": "lesson",
    "content": {
      "body": "Modern security architecture has evolved from perimeter-based models to layered, identity-centric approaches. Understanding the current best practices helps you design systems that are secure by default.\n\n## The Evolution\n\n**Perimeter model (1990s-2000s)** — trust everything inside the firewall, block everything outside. Failed because attackers bypass perimeters and insiders are threats.\n\n**Defence in depth (2000s-2010s)** — multiple security layers. Better, but still perimeter-centric.\n\n**Zero Trust (2010s-present)** — never trust, always verify. Identity is the new perimeter.\n\n## Current Best Practices\n\n**Identity-first security** — every access request is authenticated and authorised based on identity, not network location. MFA everywhere. Privileged access management (PAM) for admin access.\n\n**Secure by default** — new systems start locked down. Explicitly open what is needed. Infrastructure as code (Terraform, CloudFormation) enforces consistent security configuration.\n\n**Shift left** — security integrated into development, not bolted on at deployment. SAST, DAST, dependency scanning in CI/CD pipelines.\n\n**Observability** — comprehensive logging, metrics, and tracing. Security information and event management (SIEM). Anomaly detection. Mean time to detect (MTTD) and mean time to respond (MTTR) as key metrics.",
      "diagram": "flowchart TD\n    A[\"Perimeter model\ntrust inside\"] --> B[\"Defence in depth\nmultiple layers\"]\n    B --> C[\"Zero Trust\nidentity is perimeter\"]\n    C --> D[\"Identity-first\nMFA PAM\"]\n    C --> E[\"Secure by default\nIaC enforcement\"]\n    C --> F[\"Shift left\nsecurity in CI/CD\"]\n    C --> G[\"Observability\nSIEM anomaly detection\"]\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Security architecture evolution: perimeter → defence in depth → Zero Trust with identity-first",
      "code": "# Modern security architecture tools\n\n# Infrastructure as Code security scanning:\n# tfsec — Terraform security scanner:\n# brew install tfsec\n# tfsec .\n\n# checkov — multi-framework IaC scanner:\n# pip install checkov\n# checkov -d .\n\n# SAST — static application security testing:\n# semgrep — fast, open source:\n# pip install semgrep\n# semgrep --config auto .\n\n# Dependency scanning:\n# npm audit\n# pip-audit\n# trivy fs .  (container and filesystem scanning)\n\n# SIEM — centralised logging:\n# Ship logs to Elastic/OpenSearch:\n# filebeat -e -c filebeat.yml\n\n# Anomaly detection — fail2ban for SSH:\nsudo apt install fail2ban\nsudo systemctl enable --now fail2ban\nfail2ban-client status sshd\n\n# Check MTTD — how long before you detect a breach:\n# Review /var/log/auth.log for failed attempts\n# How long before you would notice unusual activity?",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "The most impactful security improvement for most organisations: enable MFA everywhere and centralise logging. MFA prevents credential-based attacks (the most common attack vector). Centralised logging enables detection of breaches that bypass all other controls. Both can be implemented in a day and dramatically improve security posture."
      },
      "keyPoints": [
        "Security evolution: perimeter → defence in depth → Zero Trust (identity is the new perimeter)",
        "Identity-first: MFA everywhere, PAM for admin access, identity-based authorisation",
        "Secure by default: IaC enforces consistent security, explicitly open what is needed",
        "Shift left: security in CI/CD — SAST, dependency scanning, IaC scanning",
        "Observability: SIEM, anomaly detection, MTTD and MTTR as key security metrics"
      ],
      "tryIt": "Install semgrep and run it against a code repository. Install tfsec or checkov and run it against a Terraform configuration. Install fail2ban and verify it is monitoring SSH. Check your MTTD: how long would it take you to notice if someone was brute-forcing SSH on your server right now?"
    }
  },

  {
    "id": 139,
    "moduleId": 14,
    "moduleTitle": "Advanced Network Security, IDS/IPS & Zero Trust",
    "title": "Module 14 Summary",
    "type": "lesson",
    "content": {
      "body": "This module covered advanced network security — the concepts and tools that protect modern networks beyond basic firewalls. Security is a continuous process, not a one-time configuration.\n\n## What You Learned\n\n**IDS/IPS** — IDS detects and alerts; IPS blocks. Signature-based (known attacks) and anomaly-based (unknown attacks). Suricata is the modern open-source choice.\n\n**Zero Trust** — never trust, always verify. Verify identity, check device health, assess context, grant least privilege, monitor continuously.\n\n**Micro-segmentation** — divide network into zones, require explicit authorisation between zones. Stops lateral movement after a breach.\n\n**DDoS** — volumetric, protocol, and application layer attacks. Scrubbing centres, anycast diffusion, rate limiting, BGP blackholing.\n\n**Inline vs passive** — inline blocks but is a single point of failure; passive alerts only but has no traffic impact.\n\n**Common mistakes** — flat networks, no MFA, permissive security groups, no logging, unpatched systems, default credentials.\n\n**Modern architecture** — Zero Trust, identity-first, secure by default, shift left, observability.\n\n## Course Complete\n\nYou have completed the networking course. From packets and protocols to Zero Trust and DDoS mitigation — you now have the foundational knowledge to build, operate, and secure modern networks.",
      "diagram": "flowchart TD\n    A[\"✅ IDS/IPS\ndetect block\"] --> B[\"✅ Zero Trust\nnever trust verify\"]\n    B --> C[\"✅ Micro-segmentation\nlateral movement\"]\n    C --> D[\"✅ DDoS\nmitigation\"]\n    D --> E[\"✅ Common mistakes\nand fixes\"]\n    E --> F[\"✅ Modern architecture\nidentity-first\"]\n    F --> G[\"🎓 Course Complete\"]\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 14 complete — advanced security from IDS/IPS to Zero Trust and modern architecture",
      "code": "# Module 14 command reference\n\n# IDS/IPS:\nsudo suricata-update\nsudo suricata -c /etc/suricata/suricata.yaml -i eth0\ntail -f /var/log/suricata/fast.log\n\n# Zero Trust — SSH hardening:\ngrep 'PasswordAuthentication' /etc/ssh/sshd_config\n# Should be: no\n\n# Micro-segmentation:\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.3.0/24 -j DROP\nsudo iptables -A FORWARD -j LOG --log-prefix 'BLOCKED: '\n\n# DDoS — SYN cookies:\nsudo sysctl net.ipv4.tcp_syncookies\n# Should be: 1\n\n# Security audit:\nnmap -p 1-1000 <your-public-ip>\ngrep 'Failed password' /var/log/auth.log | wc -l\nsudo apt list --upgradable 2>/dev/null | wc -l\n\n# Modern security:\nsudo systemctl status fail2ban\nfail2ban-client status sshd",
      "language": "bash",
      "callout": {
        "type": "note",
        "text": "Security is not a destination — it is a continuous process. Threats evolve, systems change, and new vulnerabilities are discovered constantly. The engineers who stay ahead are the ones who keep learning, keep auditing, and keep improving. The knowledge from this course is the foundation — build on it."
      },
      "keyPoints": [
        "IDS detects and alerts; IPS blocks — Suricata is the modern open-source choice",
        "Zero Trust: verify identity, check device, least privilege, assume breach, monitor",
        "Micro-segmentation stops lateral movement — log blocked inter-zone traffic",
        "DDoS: enable SYN cookies, use Cloudflare free tier, never block all ICMP",
        "Security is continuous — audit regularly, patch promptly, monitor always"
      ],
      "tryIt": "Complete a full security audit using the Module 14 checklist: check IDS/IPS status, verify SSH hardening, test micro-segmentation rules, confirm SYN cookies are enabled, run nmap from outside, check fail2ban status, and count failed auth attempts. Document your findings and fix every gap you find."
    }
  },

];
