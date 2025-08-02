# 🔧 System Administration Guide

## ESP8266 React Scheduler - Complete Admin Documentation

This guide covers all system administration functions, settings, and maintenance procedures for your ESP8266 React Scheduler.

---

## 🖥️ System Information Dashboard

### Main System Status Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🔧 System Information & Status                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Hardware Information:                                │
│ ├─ Device: ESP32 DevKit v1                             │
│ ├─ Chip: ESP32-D0WDQ6 (240MHz)                         │
│ ├─ Flash: 4MB (1.2MB used, 2.8MB free)                │
│ ├─ RAM: 320KB (125KB used, 195KB free)                 │
│ └─ Temperature: 42°C (Normal)                           │
│                                                         │
│ 💾 Firmware Information:                                │
│ ├─ Version: 1.3.0                                      │
│ ├─ Build Date: 2025-01-15                              │
│ ├─ Compiler: GCC 8.4.0                                 │
│ ├─ Framework: Arduino ESP32 v2.0.5                     │
│ └─ Libraries: ArduinoJson 6.21, AsyncTCP               │
│                                                         │
│ ⏱️ System Uptime:                                       │
│ ├─ Current: 15 days, 6 hours, 42 minutes              │
│ ├─ Last Restart: 2025-01-01 08:15:33                  │
│ ├─ Restart Reason: Software reset                      │
│ └─ Boot Count: 127 (since flash)                       │
│                                                         │
│ 🌐 Network Status:                                      │
│ ├─ WiFi SSID: MyHomeWiFi                               │
│ ├─ IP Address: 192.168.1.105                          │
│ ├─ MAC Address: 24:0A:C4:12:34:56                     │
│ ├─ Signal Strength: ████▁ -45dBm (Excellent)          │
│ ├─ Gateway: 192.168.1.1 ✅                             │
│ ├─ DNS: 8.8.8.8, 8.8.4.4 ✅                           │
│ └─ Internet: ✅ Connected                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Performance Metrics Panel

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Real-Time Performance Monitoring                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🖥️ CPU Usage (Last 5 minutes):                          │
│ Current: 15% │ Peak: 28% │ Average: 12%                │
│ ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 15%             │
│                                                         │
│ 💾 Memory Usage:                                        │
│ Current: 125KB / 320KB (39%)                           │
│ Peak: 178KB (56%) │ Available: 195KB                   │
│ ████████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 39%                    │
│                                                         │
│ 💿 Flash Storage:                                       │
│ Firmware: 892KB │ SPIFFS: 256KB │ Free: 2.8MB          │
│ ███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 30%                 │
│                                                         │
│ 📶 Network Activity (Last hour):                        │
│ ↑ Transmitted: 2.1MB (avg 0.6 KB/s)                   │
│ ↓ Received: 850KB (avg 0.2 KB/s)                      │
│ Packets Lost: 0 (0.0%)                                │
│                                                         │
│ 🏠 MQTT Statistics:                                     │
│ ↑ Published: 1,234 messages                           │
│ ↓ Received: 567 messages                              │
│ Connection Quality: ✅ Excellent (0ms latency)         │
│                                                         │
│ ⚡ GPIO Activity:                                       │
│ Pin 21 (Ch1): ████████████████████████████░░░░ 85%    │
│ Pin 19 (Ch2): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%      │
│ Pin 18 (Ch3): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%      │
│ Pin 5  (Ch4): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📶 WiFi Network Management

### WiFi Settings Screen

```
┌─────────────────────────────────────────────────────────┐
│ 📶 WiFi Network Configuration                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Current Connection:                                  │
│ ├─ Network: MyHomeWiFi                                 │
│ ├─ Status: 🟢 Connected                                │
│ ├─ IP Address: 192.168.1.105 (DHCP)                   │
│ ├─ Signal: ████▁ -45dBm (Excellent)                    │
│ ├─ Channel: 6 (2.4GHz)                                 │
│ ├─ Encryption: WPA2-PSK                                │
│ └─ Connected Since: 15 days, 6 hours ago               │
│                                                         │
│ 📡 Available Networks:                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ● MyHomeWiFi           ████▁ -45dBm [🔒 WPA2]      │ │
│ │ ○ NeighborNetwork      ███▁▁ -65dBm [🔒 WPA2]      │ │
│ │ ○ GuestWiFi            ██▁▁▁ -75dBm [📖 Open]      │ │
│ │ ○ ExtenderNetwork      █▁▁▁▁ -85dBm [🔒 WPA2]      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ⚙️ Advanced Settings:                                   │
│ ├─ Auto-Reconnect: ✅ Enabled                          │
│ ├─ Power Save Mode: ○ Disabled (for stability)        │
│ ├─ Static IP: ○ Use DHCP                               │
│ └─ Fallback AP: ✅ Enable on connection loss           │
│                                                         │
│ 🔧 Connection Tools:                                    │
│ [🔍 Scan Networks] [📊 Signal Test] [🔄 Reconnect]     │
│ [📋 Export Config] [⚙️ Advanced] [🔧 Diagnostics]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### WiFi Diagnostics Panel

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 WiFi Connection Diagnostics                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Connection Quality Test Results:                     │
│                                                         │
│ Ping Test to Gateway (192.168.1.1):                   │
│ ├─ Average: 2ms                                        │
│ ├─ Min: 1ms │ Max: 5ms                                 │
│ ├─ Packet Loss: 0% (0/100 packets)                    │
│ └─ Status: ✅ Excellent                                │
│                                                         │
│ Internet Connectivity Test:                             │
│ ├─ DNS Resolution: ✅ Success (12ms)                   │
│ ├─ HTTP Test: ✅ Success (google.com, 45ms)            │
│ ├─ NTP Sync: ✅ Success (pool.ntp.org, 23ms)          │
│ └─ Overall: ✅ Fully Connected                         │
│                                                         │
│ Signal Quality Analysis:                                │
│ ├─ RSSI: -45dBm (Excellent: > -50dBm)                 │
│ ├─ SNR: 35dB (Good: > 25dB)                           │
│ ├─ Noise Floor: -80dBm                                 │
│ └─ Link Quality: 95% (Excellent)                       │
│                                                         │
│ 📈 Connection History (Last 24h):                      │
│ Disconnections: 0                                       │
│ Reconnection Time: N/A                                  │
│ Uptime: 100%                                           │
│ ████████████████████████████████████████████████ 100%  │
│                                                         │
│ [📊 Detailed Report] [📄 Export Log] [🔄 Run Test]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🕒 Time & NTP Configuration

### Time Settings Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🕒 Time & Date Configuration                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ⏰ Current Time Information:                             │
│ ├─ Local Time: 2025-01-15 14:05:23 EST                │
│ ├─ UTC Time: 2025-01-15 19:05:23                       │
│ ├─ Timezone: America/New_York (UTC-5)                  │
│ ├─ DST Status: ○ Not in effect (Standard Time)        │
│ └─ Uptime: 15 days, 6 hours, 42 minutes               │
│                                                         │
│ 🌐 NTP (Network Time Protocol):                         │
│ ├─ Status: ✅ Synchronized                             │
│ ├─ Primary Server: pool.ntp.org                        │
│ ├─ Secondary Server: time.google.com                   │
│ ├─ Last Sync: 12 minutes ago                          │
│ ├─ Sync Interval: 1 hour                              │
│ ├─ Accuracy: ±15ms                                     │
│ └─ Next Sync: in 48 minutes                            │
│                                                         │
│ ⚙️ Timezone Settings:                                   │
│ Region: [Americas          ▼]                          │
│ Location: [New York        ▼]                          │
│ ☑️ Auto DST adjustment                                  │
│ ☐ 24-hour format                                       │
│                                                         │
│ 🔧 Advanced NTP Settings:                              │
│ Primary: [pool.ntp.org              ]                  │
│ Backup: [time.google.com            ]                  │
│ Sync Interval: [60 minutes ▼]                         │
│ ☑️ Auto sync on boot                                   │
│                                                         │
│ [🔄 Sync Now] [⚙️ Advanced] [📊 Time Stats] [💾 Save]   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Time Synchronization Status

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Time Synchronization History                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🕒 Sync Events (Last 24 hours):                        │
│                                                         │
│ 14:05 ✅ Successful sync with pool.ntp.org (-15ms)     │
│ 13:05 ✅ Successful sync with pool.ntp.org (+8ms)      │
│ 12:05 ✅ Successful sync with pool.ntp.org (-3ms)      │
│ 11:05 ✅ Successful sync with pool.ntp.org (+12ms)     │
│ 10:05 ⚠️ Timeout, used backup server (+5ms)            │
│ 09:05 ✅ Successful sync with pool.ntp.org (-7ms)      │
│                                                         │
│ 📈 Accuracy Statistics:                                 │
│ ├─ Average Drift: +2.3ms/hour                         │
│ ├─ Max Drift: +45ms                                    │
│ ├─ Sync Success Rate: 95% (19/20)                     │
│ └─ Clock Stability: ✅ Excellent                       │
│                                                         │
│ 🔧 Clock Adjustment History:                           │
│ Large adjustments (>1 second): None                    │
│ Small adjustments: 24 (normal)                         │
│ Step adjustments: 0                                     │
│                                                         │
│ 🌍 World Clock:                                         │
│ NYC: 14:05 EST │ UTC: 19:05 │ LA: 11:05 PST          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security & Access Control

### Security Settings Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🔐 Security & Access Control                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 👤 Administrator Account:                               │
│ ├─ Username: admin                                     │
│ ├─ Status: ✅ Active                                   │
│ ├─ Last Login: Today, 08:30 (192.168.1.50)           │
│ ├─ Failed Attempts: 0                                  │
│ └─ Session Timeout: 24 hours                           │
│                                                         │
│ 🔑 Authentication Settings:                             │
│ ├─ Password Policy: ✅ Strong (8+ chars, mixed case)   │
│ ├─ Auto-Logout: ✅ 30 minutes idle                     │
│ ├─ Remember Login: ☐ Disabled (recommended)            │
│ └─ Two-Factor: ○ Not configured                        │
│                                                         │
│ 🌐 Network Security:                                    │
│ ├─ HTTPS: ✅ Enabled (self-signed cert)                │
│ ├─ HTTP Redirect: ✅ Force HTTPS                       │
│ ├─ CORS Policy: ✅ Restricted origins                  │
│ └─ Rate Limiting: ✅ 100 requests/minute               │
│                                                         │
│ 🛡️ Access Control:                                      │
│ ├─ Local Network: ✅ Allowed (192.168.1.0/24)         │
│ ├─ Guest Network: ○ Blocked                            │
│ ├─ Internet Access: ○ Blocked (local only)            │
│ └─ API Access: ✅ Authenticated users only             │
│                                                         │
│ 📊 Security Events (Last 7 days):                      │
│ ├─ Login Attempts: 15 success, 0 failed               │
│ ├─ API Calls: 2,450 authorized, 3 rejected            │
│ ├─ Network Scans: 2 detected, 2 blocked               │
│ └─ Certificate Warnings: 0                             │
│                                                         │
│ [🔑 Change Password] [🛡️ Security Audit] [📜 View Logs] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Security Audit Results

```
┌─────────────────────────────────────────────────────────┐
│ 🛡️ Security Audit Report                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Overall Security Score: 85/100 (Good)                  │
│ ████████████████████████████████████▁▁▁▁▁▁▁▁ 85%       │
│                                                         │
│ ✅ Strengths:                                           │
│ • Strong admin password configured                     │
│ • HTTPS encryption enabled                             │
│ • Network access properly restricted                   │
│ • No unauthorized access attempts                      │
│ • Firmware is up to date                              │
│                                                         │
│ ⚠️ Recommendations:                                     │
│ • Consider enabling two-factor authentication          │
│ • Generate proper SSL certificate                      │
│ • Enable security event notifications                  │
│ • Regular security updates recommended                 │
│                                                         │
│ 🔍 Security Checklist:                                 │
│ ✅ Default passwords changed                           │
│ ✅ Unnecessary services disabled                       │
│ ✅ Firewall rules configured                           │
│ ✅ Access logging enabled                              │
│ ⚠️ SSL certificate self-signed                         │
│ ○ Two-factor authentication                            │
│ ○ Intrusion detection                                  │
│                                                         │
│ 📅 Next Audit: Recommended in 30 days                  │
│                                                         │
│ [📄 Full Report] [🔧 Fix Issues] [⚙️ Security Settings] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Firmware Update Management

### Firmware Update Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Firmware Update Center                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📦 Current Installation:                                │
│ ├─ Version: 1.3.0                                      │
│ ├─ Build Date: 2025-01-15                              │
│ ├─ Release Type: Stable                                │
│ └─ Last Updated: 15 days ago                            │
│                                                         │
│ 🆕 Available Updates:                                   │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Version 1.4.0 - Stable Release                     │ │
│ │ Released: 2025-01-30                               │ │
│ │ Size: 2.1 MB                                       │ │
│ │                                                     │ │
│ │ 📋 What's New:                                      │ │
│ │ • Improved schedule precision                       │ │
│ │ • Enhanced mobile interface                         │ │
│ │ • New MQTT discovery features                       │ │
│ │ • Performance optimizations                         │ │
│ │ • Security updates                                  │ │
│ │ • Bug fixes and stability improvements              │ │
│ │                                                     │ │
│ │ Security Level: 🟢 High Priority                   │ │
│ │ Compatibility: ✅ Fully compatible                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ⚙️ Update Options:                                      │
│ ● Download and install automatically                    │
│ ○ Download now, install later                          │
│ ○ Manual download and install                          │
│                                                         │
│ [📥 Start Update] [📋 Release Notes] [⚙️ Settings]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Update Progress Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Firmware Update in Progress                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Current Phase: Installing firmware...                   │
│                                                         │
│ Overall Progress:                                       │
│ ████████████████████████████████████████░░░░░░ 85%     │
│                                                         │
│ Step Progress:                                          │
│ ✅ 1. Downloading firmware (2.1 MB)                    │
│ ✅ 2. Verifying digital signature                      │
│ ✅ 3. Backing up current firmware                      │
│ ✅ 4. Preparing flash memory                           │
│ 🔄 5. Installing new firmware...                       │
│ ⏳ 6. Verifying installation                           │
│ ⏳ 7. Restarting system                                │
│                                                         │
│ Installation Details:                                   │
│ ├─ Time Elapsed: 2 minutes 15 seconds                 │
│ ├─ Estimated Remaining: 30 seconds                     │
│ ├─ Speed: 45 KB/s                                      │
│ └─ Status: Installing partition 2/3                     │
│                                                         │
│ ⚠️ IMPORTANT WARNINGS:                                  │
│ • Do NOT power off the device during update            │
│ • Do NOT disconnect from network                       │
│ • Process will complete automatically                  │
│ • Device will restart when finished                    │
│                                                         │
│ [❌ Cancel Update] [📊 Details] [📋 View Log]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Update Completion Screen

```
┌─────────────────────────────────────────────────────────┐
│ ✅ Firmware Update Completed Successfully               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎉 Update Summary:                                      │
│ ├─ Previous Version: 1.3.0                             │
│ ├─ New Version: 1.4.0                                  │
│ ├─ Update Time: 3 minutes 42 seconds                   │
│ ├─ Status: ✅ Success                                   │
│ └─ System Status: ✅ All systems operational           │
│                                                         │
│ 🔍 Post-Update Verification:                            │
│ ✅ Firmware integrity verified                          │
│ ✅ Configuration preserved                              │
│ ✅ All channels operational                             │
│ ✅ Network connectivity restored                        │
│ ✅ MQTT connection established                          │
│ ✅ Time synchronization active                          │
│                                                         │
│ 📋 New Features Available:                              │
│ • Enhanced schedule precision (sub-second timing)      │
│ • Improved mobile interface with touch gestures        │
│ • Advanced MQTT auto-discovery                         │
│ • Performance monitoring dashboard                      │
│ • Enhanced security features                           │
│                                                         │
│ 🔄 System will restart in 10 seconds to complete...    │
│                                                         │
│ [📊 View Changes] [🏠 Go to Dashboard] [📋 Release Notes] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 System Logs & Diagnostics

### System Log Viewer

```
┌─────────────────────────────────────────────────────────┐
│ 📋 System Logs - Real Time View                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Log Level: [All Levels ▼] │ Filter: [           ] 🔍    │
│                                                         │
│ 2025-01-15 14:05:23 [INFO ] Water Pump XP: Started 5m cycle │
│ 2025-01-15 14:05:22 [DEBUG] GPIO21: HIGH signal sent          │
│ 2025-01-15 14:05:22 [INFO ] Schedule triggered for Channel 1  │
│ 2025-01-15 14:00:45 [INFO ] NTP sync successful (+8ms)        │
│ 2025-01-15 14:00:23 [INFO ] MQTT: Published status update     │
│ 2025-01-15 13:35:23 [INFO ] Water Pump XP: Completed cycle    │
│ 2025-01-15 13:35:22 [DEBUG] GPIO21: LOW signal sent           │
│ 2025-01-15 13:30:23 [INFO ] Water Pump XP: Started 5m cycle   │
│ 2025-01-15 13:30:22 [DEBUG] GPIO21: HIGH signal sent          │
│ 2025-01-15 13:30:22 [INFO ] Schedule triggered for Channel 1  │
│ 2025-01-15 13:15:45 [WARN ] WiFi signal strength dropped      │
│ 2025-01-15 13:15:44 [DEBUG] RSSI: -67dBm (was -45dBm)         │
│ 2025-01-15 13:00:23 [INFO ] MQTT: Connection keepalive        │
│ 2025-01-15 12:45:12 [INFO ] System: Memory usage 39%          │
│                                                         │
│ 📊 Log Statistics:                                      │
│ Total Entries: 15,234 │ Errors: 0 │ Warnings: 3        │
│                                                         │
│ [📄 Export Logs] [🗑️ Clear] [⏸️ Pause] [📊 Analysis]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Diagnostic Tools Panel

```
┌─────────────────────────────────────────────────────────┐
│ 🔧 System Diagnostics & Health Check                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🏥 System Health Status:                               │
│ ├─ Overall Health: ✅ Excellent (95/100)               │
│ ├─ CPU Temperature: 42°C (Normal)                      │
│ ├─ Memory Health: ✅ Good (no leaks detected)          │
│ ├─ Flash Health: ✅ Good (12,450 write cycles)         │
│ └─ Network Stability: ✅ Excellent                     │
│                                                         │
│ 🔍 Available Diagnostic Tests:                          │
│                                                         │
│ Hardware Tests:                                         │
│ [🔧 GPIO Pin Test] [💾 Memory Test] [💿 Flash Test]     │
│                                                         │
│ Network Tests:                                          │
│ [📶 WiFi Analysis] [🌐 Internet Test] [📡 MQTT Test]    │
│                                                         │
│ Channel Tests:                                          │
│ [⚡ Relay Test] [⏰ Schedule Test] [🔄 Override Test]    │
│                                                         │
│ System Tests:                                           │
│ [🕒 Time Sync] [🔐 Security Scan] [📊 Performance]      │
│                                                         │
│ 📋 Quick Diagnostics Results:                          │
│ Last Run: 2 hours ago                                  │
│ ✅ All hardware responding correctly                    │
│ ✅ Network connectivity stable                         │
│ ✅ No memory leaks detected                            │
│ ✅ All channels operating normally                     │
│ ⚠️ Minor: WiFi signal fluctuation detected             │
│                                                         │
│ [🚀 Run Full Diagnostic] [📄 Export Report] [⚙️ Settings] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 System Maintenance

### Maintenance Schedule

```
┌─────────────────────────────────────────────────────────┐
│ 🔧 System Maintenance & Tasks                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📅 Scheduled Maintenance Tasks:                         │
│                                                         │
│ ✅ Daily Tasks:                                         │
│ ├─ Log rotation and cleanup                            │
│ ├─ Memory usage monitoring                             │
│ ├─ Network connectivity check                          │
│ └─ Next run: Tonight at 00:00                          │
│                                                         │
│ ✅ Weekly Tasks:                                        │
│ ├─ System health diagnostic                            │
│ ├─ Configuration backup                                │
│ ├─ Performance analysis                                │
│ └─ Next run: Sunday at 02:00                           │
│                                                         │
│ ⏳ Monthly Tasks:                                       │
│ ├─ Flash memory optimization                           │
│ ├─ Security audit                                      │
│ ├─ Update check                                        │
│ └─ Next run: 1st of next month                         │
│                                                         │
│ 🛠️ Manual Maintenance Options:                          │
│                                                         │
│ System Cleanup:                                         │
│ [🗑️ Clear Logs] [💾 Optimize Memory] [🧹 Clean Cache]  │
│                                                         │
│ Backup & Restore:                                       │
│ [💾 Backup Config] [📥 Restore] [📤 Export Settings]    │
│                                                         │
│ Reset Options:                                          │
│ [🔄 Soft Reset] [⚠️ Factory Reset] [🔧 Reset Network]   │
│                                                         │
│ 📊 Maintenance History:                                 │
│ ├─ Last Backup: 3 days ago ✅                         │
│ ├─ Last Diagnostic: 2 hours ago ✅                     │
│ ├─ Last Update Check: 1 day ago ✅                     │
│ └─ Last Factory Reset: Never                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### System Reset Options

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ System Reset Options                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Choose the appropriate reset level for your needs:     │
│                                                         │
│ 🔄 Soft Reset (Recommended):                           │
│ ├─ Restarts the system without losing settings        │
│ ├─ Preserves all configuration and schedules          │
│ ├─ Fixes most software-related issues                 │
│ ├─ Downtime: ~30 seconds                              │
│ └─ [🔄 Perform Soft Reset]                             │
│                                                         │
│ 🌐 Network Reset:                                       │
│ ├─ Resets WiFi and network settings only              │
│ ├─ Preserves channels and schedules                   │
│ ├─ Requires WiFi reconfiguration                      │
│ ├─ Downtime: ~2 minutes                               │
│ └─ [📶 Reset Network Settings]                         │
│                                                         │
│ ⚙️ Configuration Reset:                                │
│ ├─ Resets all settings to defaults                    │
│ ├─ Preserves firmware and network settings            │
│ ├─ Requires complete reconfiguration                  │
│ ├─ Downtime: ~1 minute                                │
│ └─ [⚙️ Reset Configuration]                            │
│                                                         │
│ ⚠️ Factory Reset (Use with caution):                   │
│ ├─ Completely erases all settings and data            │
│ ├─ Returns device to initial state                    │
│ ├─ Requires complete setup from scratch               │
│ ├─ Downtime: ~5 minutes                               │
│ └─ [🏭 Factory Reset]                                  │
│                                                         │
│ 💾 Backup Recommendation:                              │
│ Create a backup before performing any reset operation. │
│ [💾 Create Backup Now]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎛️ Advanced System Settings

### Advanced Configuration Panel

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️ Advanced System Configuration                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🖥️ System Behavior:                                     │
│ ├─ Boot Delay: [5 seconds    ▼]                        │
│ ├─ Watchdog Timer: ✅ Enabled (30 seconds)             │
│ ├─ Crash Recovery: ✅ Auto-restart on failure         │
│ ├─ Safe Mode: ○ Disabled                               │
│ └─ Debug Mode: ○ Disabled                              │
│                                                         │
│ 📊 Performance Tuning:                                  │
│ ├─ CPU Frequency: [240MHz ▼] (240/160/80MHz)          │
│ ├─ Flash Speed: [80MHz ▼] (80/40MHz)                   │
│ ├─ Memory Allocation: ✅ Dynamic                       │
│ ├─ Task Priority: [Normal ▼]                           │
│ └─ Power Management: ○ Disabled (recommended)          │
│                                                         │
│ 🌐 Network Advanced:                                    │
│ ├─ Connection Timeout: [30 seconds ▼]                  │
│ ├─ Retry Attempts: [5 attempts ▼]                      │
│ ├─ Keep-Alive Interval: [60 seconds ▼]                 │
│ ├─ Buffer Size: [8KB ▼]                                │
│ └─ DNS Cache: ✅ Enabled                               │
│                                                         │
│ 🔧 GPIO Configuration:                                  │
│ ├─ Pull-up Resistors: ✅ Enabled                       │
│ ├─ Pin Drive Strength: [Normal ▼]                      │
│ ├─ Interrupt Priority: [Medium ▼]                      │
│ └─ Pin State on Boot: [Last State ▼]                   │
│                                                         │
│ 📋 Logging & Debug:                                     │
│ ├─ Log Level: [INFO ▼] (DEBUG/INFO/WARN/ERROR)        │
│ ├─ Log Rotation: ✅ Enabled (100KB max)               │
│ ├─ Remote Logging: ○ Disabled                          │
│ └─ Serial Output: ✅ Enabled                           │
│                                                         │
│ [💾 Save Changes] [🔄 Reset to Defaults] [📋 Export]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Next: [📋 Use Cases & Examples Guide](use-cases.md)**