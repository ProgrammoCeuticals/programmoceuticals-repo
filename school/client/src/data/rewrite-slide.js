const fs = require('fs');
const path = '/Users/macbookpro/Desktop/ProgrammoCeuticals/school/client/src/data/networkingSlidesData.js';
let content = fs.readFileSync(path, 'utf8');
const insertPoint = content.lastIndexOf('];');

const newSlides = `
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
      "body": "A DDoS (Distributed Denial of Service) attack floods a target with traffic from thousands of compromised machines, overwhelming its capacity to serve legitimate users. DDoS attacks are one of the most common and disruptive threats on the internet.\\n\\n## Types of DDoS Attacks\\n\\n**Volumetric attacks** — flood the target with massive traffic to saturate bandwidth. Measured in Gbps. The largest attacks exceed 1 Tbps. Examples: UDP flood, ICMP flood, DNS amplification.\\n\\n**Protocol attacks** — exploit weaknesses in network protocols to exhaust server resources. Examples: SYN flood (fills TCP connection table), Ping of Death.\\n\\n**Application layer attacks (Layer 7)** — send seemingly legitimate HTTP requests that are expensive to process. Harder to detect because traffic looks normal. Examples: HTTP flood, Slowloris.\\n\\n## DDoS Amplification\\n\\nAttackers exploit protocols that respond with much more data than the request. DNS amplification: a 60-byte query generates a 3,000-byte response — 50x amplification. The attacker spoofs the victim's IP so all responses flood the victim.\\n\\n## Mitigation Strategies\\n\\n**Upstream scrubbing** — traffic routed through a scrubbing centre that filters attack traffic. Used by Cloudflare, Akamai, AWS Shield.\\n\\n**Anycast diffusion** — distribute attack across many PoPs so no single location is overwhelmed.\\n\\n**Rate limiting** — limit requests per IP per second at the edge.\\n\\n**BGP blackholing** — announce victim IP as unreachable (last resort — takes target offline).",
      "diagram": "flowchart TD\\n    A[\\\"DDoS Types\\\"] --> B[\\\"Volumetric\\nUDP ICMP flood\\nsaturate bandwidth\\\"]\\n    A --> C[\\\"Protocol\\nSYN flood\\nexhaust state\\\"]\\n    A --> D[\\\"Application L7\\nHTTP flood\\nlooks legitimate\\\"]\\n    E[\\\"Mitigation\\\"] --> F[\\\"Scrubbing centre\\\"]\\n    E --> G[\\\"Anycast diffusion\\\"]\\n    E --> H[\\\"Rate limiting\\\"]\\n    style A fill:#3776ab,color:#fff,stroke:#3776ab\\n    style B fill:#fee2e2,stroke:#dc2626,color:#991b1b\\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Three DDoS types target bandwidth, protocol state, and application resources — each needs different mitigation",
      "code": "# DDoS detection and mitigation\\n\\n# Monitor for SYN flood:\\nss -s\\n# High orphan count = possible SYN flood\\n\\n# Check connections per IP:\\nss -tn | awk '{print $5}' | grep -oE '[0-9.]+' | sort | uniq -c | sort -rn | head\\n\\n# Rate limit new connections (iptables):\\nsudo iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT\\nsudo iptables -A INPUT -p tcp --dport 80 -j DROP\\n\\n# SYN cookies (kernel protection against SYN flood):\\nsudo sysctl -w net.ipv4.tcp_syncookies=1\\n\\n# Cloudflare DDoS protection (free tier):\\n# Automatic L3/L4/L7 DDoS mitigation\\n# Under Attack Mode: JS challenge for all visitors\\n\\n# AWS Shield Standard (free):\\n# Automatic L3/L4 protection\\n# AWS Shield Advanced: L7 protection + DDoS response team\\n\\n# Detect DNS amplification:\\nsudo tcpdump -i eth0 -n 'udp src port 53' | wc -l\\n# High count = amplification attack targeting you",
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
      "body": "Security devices can be deployed in two fundamental modes: inline (in the traffic path) or passive (monitoring a copy of traffic). Each has different capabilities, risks, and use cases.\\n\\n## Inline Deployment\\n\\nThe security device sits directly in the traffic path. All traffic passes through it. The device can inspect, modify, block, or drop traffic in real time.\\n\\nAdvantages: can block attacks immediately, no traffic bypasses the device.\\nDisadvantages: single point of failure (if the device fails, traffic stops), adds latency, requires high availability configuration.\\n\\nUsed for: IPS, next-generation firewalls, WAFs, SSL inspection appliances.\\n\\n## Passive Deployment (Out-of-Band)\\n\\nThe security device receives a copy of traffic via a network tap or SPAN (Switched Port Analyser) port. It cannot block traffic — only observe and alert.\\n\\nAdvantages: no impact on traffic if the device fails, no added latency, can be added without network changes.\\nDisadvantages: cannot block attacks, only detects and alerts.\\n\\nUsed for: IDS, network forensics, traffic analysis, compliance monitoring.\\n\\n## Hybrid Approach\\n\\nMany deployments use both: passive IDS for broad visibility across the network, inline IPS at critical chokepoints (internet edge, DMZ boundary). This balances coverage with the risk of inline device failure.",
      "diagram": "flowchart TD\\n    A[\\\"Traffic\\\"] --> B[\\\"Inline Device\\nIPS NGFW WAF\\\"]\\n    B --> C[\\\"Destination\\\"]\\n    B -->|\\\"block\\\"|D[\\\"Dropped\\\"]\\n    E[\\\"Traffic\\\"] --> F[\\\"Network Tap\\\"]\\n    F --> G[\\\"Destination\\\"]\\n    F -->|\\\"copy\\\"|H[\\\"Passive IDS\\nalert only\\\"]\\n    style B fill:#3776ab,color:#fff,stroke:#3776ab\\n    style H fill:#ffd43b,stroke:#ca8a04,color:#1a1a1a\\n    style D fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Inline: blocks traffic but is a single point of failure. Passive: alert-only but no traffic impact",
      "code": "# Inline vs passive deployment\\n\\n# Passive IDS with Suricata (SPAN/tap port):\\nsudo suricata -c /etc/suricata/suricata.yaml -i eth1\\n# eth1 receives mirrored traffic from switch SPAN port\\n# Suricata analyses and alerts but cannot block\\n\\n# Inline IPS with Suricata (nfqueue):\\nsudo iptables -I FORWARD -j NFQUEUE --queue-num 0\\nsudo suricata -c /etc/suricata/suricata.yaml -q 0\\n# All forwarded traffic goes through Suricata\\n# Suricata can drop packets\\n\\n# Configure SPAN port on Linux bridge:\\n# Mirror eth0 traffic to eth1 for passive monitoring:\\nsudo tc qdisc add dev eth0 ingress\\nsudo tc filter add dev eth0 parent ffff: \\\\\\n  protocol all u32 match u32 0 0 \\\\\\n  action mirred egress mirror dev eth1\\n\\n# High availability for inline devices:\\n# Use fail-open mode: if device fails, traffic passes through\\n# Or: redundant inline devices with failover\\n\\n# Check if Suricata is dropping packets:\\nsuricatasc -c stats | grep drop",
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
      "body": "Security incidents are often caused by a small set of recurring mistakes. Knowing these patterns helps you avoid them and audit existing configurations effectively.\\n\\n## Mistake 1: Flat Networks\\n\\nAll servers on the same subnet with no segmentation. A compromised web server can directly attack the database. Fix: implement micro-segmentation with firewall rules between tiers.\\n\\n## Mistake 2: No MFA\\n\\nSSH and VPN access protected only by passwords. Passwords get phished, leaked, or brute-forced. Fix: require SSH keys and MFA for all remote access.\\n\\n## Mistake 3: Overly Permissive Security Groups\\n\\nSecurity groups with 0.0.0.0/0 on ports that should be restricted. SSH open to the world, databases accessible from any IP. Fix: restrict to specific source IPs or security groups.\\n\\n## Mistake 4: No Logging\\n\\nNo centralised logging means breaches go undetected for months. Fix: ship all logs to a SIEM (Splunk, Elastic, CloudWatch Logs). Alert on anomalies.\\n\\n## Mistake 5: Unpatched Systems\\n\\nKnown vulnerabilities exploited because patches were not applied. Fix: automated patch management, regular vulnerability scanning.\\n\\n## Mistake 6: Default Credentials\\n\\nNetwork devices, databases, and applications left with default passwords. Fix: change all default credentials immediately after deployment. Use a password manager.\\n\\n## Mistake 7: No Incident Response Plan\\n\\nWhen a breach occurs, no one knows what to do. Fix: document and practice an incident response plan before you need it.",
      "diagram": "flowchart TD\\n    A[\\\"Common Mistakes\\\"] --> B[\\\"Flat network\\nno segmentation\\\"]\\n    A --> C[\\\"No MFA\\npasswords only\\\"]\\n    A --> D[\\\"Permissive SGs\\n0.0.0.0/0 everywhere\\\"]\\n    A --> E[\\\"No logging\\nbreaches undetected\\\"]\\n    A --> F[\\\"Unpatched systems\\nknown vulns\\\"]\\n    A --> G[\\\"Default credentials\\\"]\\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b",
      "diagramCaption": "Seven common security mistakes — each one is a known pattern with a known fix",
      "code": "# Security audit checklist\\n\\n# 1. Check for flat network (all on same subnet):\\nip route show\\n# If only one subnet: implement segmentation\\n\\n# 2. Check SSH authentication:\\ngrep 'PasswordAuthentication' /etc/ssh/sshd_config\\n# Should be: PasswordAuthentication no\\n\\n# 3. Check for open ports:\\nnmap -p 1-65535 <your-public-ip>\\n# Only expected ports should be open\\n\\n# 4. Check logging:\\nsystemctl status rsyslog\\nls -la /var/log/auth.log\\n# Should exist and be recent\\n\\n# 5. Check for updates:\\nsudo apt list --upgradable 2>/dev/null | wc -l\\n# Should be 0\\n\\n# 6. Check for default credentials:\\n# Common defaults to check:\\n# admin/admin, root/root, admin/password\\n# Check: ssh admin@<device-ip>\\n\\n# 7. Check for world-readable sensitive files:\\nfind /etc -name '*.conf' -perm -o+r 2>/dev/null | head\\n\\n# 8. Check for SUID binaries (privilege escalation risk):\\nfind / -perm -4000 -type f 2>/dev/null | head",
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
      "body": "Modern security architecture has evolved from perimeter-based models to layered, identity-centric approaches. Understanding the current best practices helps you design systems that are secure by default.\\n\\n## The Evolution\\n\\n**Perimeter model (1990s-2000s)** — trust everything inside the firewall, block everything outside. Failed because attackers bypass perimeters and insiders are threats.\\n\\n**Defence in depth (2000s-2010s)** — multiple security layers. Better, but still perimeter-centric.\\n\\n**Zero Trust (2010s-present)** — never trust, always verify. Identity is the new perimeter.\\n\\n## Current Best Practices\\n\\n**Identity-first security** — every access request is authenticated and authorised based on identity, not network location. MFA everywhere. Privileged access management (PAM) for admin access.\\n\\n**Secure by default** — new systems start locked down. Explicitly open what is needed. Infrastructure as code (Terraform, CloudFormation) enforces consistent security configuration.\\n\\n**Shift left** — security integrated into development, not bolted on at deployment. SAST, DAST, dependency scanning in CI/CD pipelines.\\n\\n**Observability** — comprehensive logging, metrics, and tracing. Security information and event management (SIEM). Anomaly detection. Mean time to detect (MTTD) and mean time to respond (MTTR) as key metrics.",
      "diagram": "flowchart TD\\n    A[\\\"Perimeter model\\ntrust inside\\\"] --> B[\\\"Defence in depth\\nmultiple layers\\\"]\\n    B --> C[\\\"Zero Trust\\nidentity is perimeter\\\"]\\n    C --> D[\\\"Identity-first\\nMFA PAM\\\"]\\n    C --> E[\\\"Secure by default\\nIaC enforcement\\\"]\\n    C --> F[\\\"Shift left\\nsecurity in CI/CD\\\"]\\n    C --> G[\\\"Observability\\nSIEM anomaly detection\\\"]\\n    style A fill:#fee2e2,stroke:#dc2626,color:#991b1b\\n    style C fill:#3776ab,color:#fff,stroke:#3776ab\\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534",
      "diagramCaption": "Security architecture evolution: perimeter → defence in depth → Zero Trust with identity-first",
      "code": "# Modern security architecture tools\\n\\n# Infrastructure as Code security scanning:\\n# tfsec — Terraform security scanner:\\n# brew install tfsec\\n# tfsec .\\n\\n# checkov — multi-framework IaC scanner:\\n# pip install checkov\\n# checkov -d .\\n\\n# SAST — static application security testing:\\n# semgrep — fast, open source:\\n# pip install semgrep\\n# semgrep --config auto .\\n\\n# Dependency scanning:\\n# npm audit\\n# pip-audit\\n# trivy fs .  (container and filesystem scanning)\\n\\n# SIEM — centralised logging:\\n# Ship logs to Elastic/OpenSearch:\\n# filebeat -e -c filebeat.yml\\n\\n# Anomaly detection — fail2ban for SSH:\\nsudo apt install fail2ban\\nsudo systemctl enable --now fail2ban\\nfail2ban-client status sshd\\n\\n# Check MTTD — how long before you detect a breach:\\n# Review /var/log/auth.log for failed attempts\\n# How long before you would notice unusual activity?",
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
      "body": "This module covered advanced network security — the concepts and tools that protect modern networks beyond basic firewalls. Security is a continuous process, not a one-time configuration.\\n\\n## What You Learned\\n\\n**IDS/IPS** — IDS detects and alerts; IPS blocks. Signature-based (known attacks) and anomaly-based (unknown attacks). Suricata is the modern open-source choice.\\n\\n**Zero Trust** — never trust, always verify. Verify identity, check device health, assess context, grant least privilege, monitor continuously.\\n\\n**Micro-segmentation** — divide network into zones, require explicit authorisation between zones. Stops lateral movement after a breach.\\n\\n**DDoS** — volumetric, protocol, and application layer attacks. Scrubbing centres, anycast diffusion, rate limiting, BGP blackholing.\\n\\n**Inline vs passive** — inline blocks but is a single point of failure; passive alerts only but has no traffic impact.\\n\\n**Common mistakes** — flat networks, no MFA, permissive security groups, no logging, unpatched systems, default credentials.\\n\\n**Modern architecture** — Zero Trust, identity-first, secure by default, shift left, observability.\\n\\n## Course Complete\\n\\nYou have completed the networking course. From packets and protocols to Zero Trust and DDoS mitigation — you now have the foundational knowledge to build, operate, and secure modern networks.",
      "diagram": "flowchart TD\\n    A[\\\"✅ IDS/IPS\\ndetect block\\\"] --> B[\\\"✅ Zero Trust\\nnever trust verify\\\"]\\n    B --> C[\\\"✅ Micro-segmentation\\nlateral movement\\\"]\\n    C --> D[\\\"✅ DDoS\\nmitigation\\\"]\\n    D --> E[\\\"✅ Common mistakes\\nand fixes\\\"]\\n    E --> F[\\\"✅ Modern architecture\\nidentity-first\\\"]\\n    F --> G[\\\"🎓 Course Complete\\\"]\\n    style A fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style B fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style C fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style D fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style E fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style F fill:#dcfce7,stroke:#16a34a,color:#166534\\n    style G fill:#3776ab,color:#fff,stroke:#3776ab",
      "diagramCaption": "Module 14 complete — advanced security from IDS/IPS to Zero Trust and modern architecture",
      "code": "# Module 14 command reference\\n\\n# IDS/IPS:\\nsudo suricata-update\\nsudo suricata -c /etc/suricata/suricata.yaml -i eth0\\ntail -f /var/log/suricata/fast.log\\n\\n# Zero Trust — SSH hardening:\\ngrep 'PasswordAuthentication' /etc/ssh/sshd_config\\n# Should be: no\\n\\n# Micro-segmentation:\\nsudo iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.3.0/24 -j DROP\\nsudo iptables -A FORWARD -j LOG --log-prefix 'BLOCKED: '\\n\\n# DDoS — SYN cookies:\\nsudo sysctl net.ipv4.tcp_syncookies\\n# Should be: 1\\n\\n# Security audit:\\nnmap -p 1-1000 <your-public-ip>\\ngrep 'Failed password' /var/log/auth.log | wc -l\\nsudo apt list --upgradable 2>/dev/null | wc -l\\n\\n# Modern security:\\nsudo systemctl status fail2ban\\nfail2ban-client status sshd",
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

`;

content = content.slice(0, insertPoint) + newSlides + content.slice(insertPoint);
fs.writeFileSync(path, content);
console.log('done');
