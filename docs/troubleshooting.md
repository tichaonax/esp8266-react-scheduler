# 🐛 Troubleshooting Guide

## ESP8266 React Scheduler - Problem Resolution

This guide provides comprehensive troubleshooting steps for common issues and system diagnostics.

---

## 🚨 Quick Diagnostic Dashboard

### System Health Check

```
┌─────────────────────────────────────────────────────────┐
│ 🏥 System Health Diagnostic                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Overall Status: 🟡 WARNING (3 issues detected)         │
│                                                         │
│ 🟢 Hardware: ✅ All components functional               │
│ 🟢 Network: ✅ Connected (192.168.1.105)               │
│ 🟡 Scheduling: ⚠️ Channel 2 not running as expected    │
│ 🟢 Power: ✅ Stable supply (4.95V)                     │
│ 🔴 Storage: ❌ Flash memory 95% full                   │
│                                                         │
│ 🔍 Detected Issues:                                     │
│ 1. Channel 2: Schedule not executing                   │
│ 2. Storage: Critical space remaining                   │
│ 3. Network: Intermittent signal drops                  │
│                                                         │
│ 🛠️ Recommended Actions:                                 │
│ • Clear system logs to free storage space              │
│ • Check Channel 2 configuration                        │
│ • Improve WiFi signal or move device                   │
│                                                         │
│ [🔧 Auto-Fix Issues] [📋 Detailed Report] [⚙️ Settings] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📶 Network & Connectivity Issues

### WiFi Connection Problems

```
┌─────────────────────────────────────────────────────────┐
│ 📶 WiFi Connection Troubleshooting                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔴 Problem: Cannot Connect to WiFi                     │
│                                                         │
│ 🔍 Diagnostic Steps:                                    │
│ 1. Check Network Availability                          │
│    Status: ❌ SSID "MyHomeWiFi" not found              │
│    Solution: Move closer to router or check SSID       │
│                                                         │
│ 2. Verify Password                                      │
│    Last Attempt: Authentication failed                 │
│    Solution: Re-enter WiFi password                    │
│                                                         │
│ 3. Signal Strength Test                                │
│    Current: ▁▁▁▁▁ -89dBm (Very Poor)                   │
│    Required: ▁▁▁▁▁ -70dBm (Minimum)                    │
│    Solution: Relocate device or add WiFi extender      │
│                                                         │
│ 4. Channel Interference                                 │
│    Router Channel: 6 (2.4GHz)                          │
│    Congestion: High (12 nearby networks)               │
│    Solution: Change router to channel 1 or 11          │
│                                                         │
│ 🛠️ Quick Fixes:                                         │
│ [📶 Rescan Networks] [🔑 Re-enter Password]             │
│ [🔄 Reset Network] [📡 Setup Hotspot Mode]             │
│                                                         │
│ 🆘 If Still Failing:                                   │
│ • Try connecting to phone hotspot                      │
│ • Check router MAC filtering                           │
│ • Verify router supports 2.4GHz                       │
│ • Factory reset and reconfigure                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Internet Connectivity Issues

```
┌─────────────────────────────────────────────────────────┐
│ 🌐 Internet Connectivity Diagnosis                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 Connection Test Results:                             │
│                                                         │
│ Local Network:                                          │
│ ├─ WiFi Connection: ✅ Connected to MyHomeWiFi         │
│ ├─ IP Address: ✅ 192.168.1.105 (DHCP)                 │
│ ├─ Gateway Ping: ✅ 192.168.1.1 (2ms)                  │
│ └─ Local DNS: ✅ Router responding                      │
│                                                         │
│ Internet Access:                                        │
│ ├─ DNS Resolution: ❌ Failed to resolve google.com      │
│ ├─ External Ping: ❌ No response from 8.8.8.8          │
│ ├─ HTTP Test: ❌ Cannot reach external servers          │
│ └─ NTP Sync: ❌ Time sync failing                       │
│                                                         │
│ 🔧 Possible Causes:                                     │
│ • Router has no internet connection                    │
│ • ISP service outage                                   │
│ • DNS servers not responding                           │
│ • Firewall blocking outbound connections               │
│                                                         │
│ 🛠️ Solutions:                                           │
│ 1. Check router internet LED status                    │
│ 2. Restart router and modem                            │
│ 3. Try alternative DNS (1.1.1.1, 8.8.8.8)             │
│ 4. Contact ISP if problem persists                     │
│                                                         │
│ [🔄 Retest Connection] [⚙️ Change DNS] [📞 ISP Support] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Hardware & Power Issues

### GPIO and Relay Problems

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Hardware Troubleshooting - GPIO & Relays             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 Channel 1 (GPIO 21) - Water Pump XP                 │
│                                                         │
│ Hardware Test Results:                                  │
│ ├─ GPIO Signal: ❌ No response to HIGH command          │
│ ├─ Pin Voltage: 0.1V (should be 3.3V when HIGH)        │
│ ├─ Current Draw: 0mA (relay not activating)            │
│ └─ Continuity: ❌ Open circuit detected                 │
│                                                         │
│ 🔧 Possible Issues:                                     │
│ • Loose wire connection                                │
│ • Damaged GPIO pin                                     │
│ • Faulty relay module                                  │
│ • Insufficient power supply                            │
│ • Short circuit protection activated                   │
│                                                         │
│ 🛠️ Step-by-Step Diagnosis:                              │
│                                                         │
│ Step 1: Visual Inspection                               │
│ □ Check all wire connections are secure                 │
│ □ Look for burned/damaged components                   │
│ □ Verify power LED on relay module                     │
│                                                         │
│ Step 2: Electrical Testing                             │
│ □ Measure voltage at GPIO pin                          │
│ □ Test relay coil resistance (should be 50-120Ω)       │
│ □ Check power supply voltage (should be 5V ±0.25V)     │
│                                                         │
│ Step 3: Isolation Testing                              │
│ □ Test GPIO with LED instead of relay                  │
│ □ Test relay with external 5V source                   │
│ □ Try different GPIO pin for this channel              │
│                                                         │
│ [🔧 Run GPIO Test] [📊 Power Analysis] [🔄 Try Alt Pin] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Power Supply Diagnostics

```
┌─────────────────────────────────────────────────────────┐
│ 🔋 Power Supply Analysis                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Current Power Status:                                │
│                                                         │
│ ESP32 Module:                                           │
│ ├─ Supply Voltage: 4.85V (⚠️ Below minimum 4.9V)       │
│ ├─ Current Draw: 180mA (Normal: 80-250mA)              │
│ ├─ Temperature: 45°C (Normal operating range)          │
│ └─ Brown-out Events: 3 in last 24 hours                │
│                                                         │
│ Relay Module:                                           │
│ ├─ Supply Voltage: 4.85V (Requires 5V ±5%)             │
│ ├─ Total Load: 320mA (4 relays)                        │
│ ├─ Voltage Drop: 0.15V under load                      │
│ └─ Status: ⚠️ Marginal operation                        │
│                                                         │
│ 🔴 Power Issues Detected:                               │
│ • Voltage below ESP32 minimum specification            │
│ • Relay module not getting adequate 5V supply          │
│ • Voltage drops significantly under load               │
│ • Brown-out resets occurring                           │
│                                                         │
│ 🛠️ Recommended Solutions:                               │
│ 1. Upgrade to higher current power supply (2A min)     │
│ 2. Use separate 5V supply for relay module             │
│ 3. Add bulk capacitors near ESP32 for stability        │
│ 4. Check all power connections for resistance          │
│                                                         │
│ ⚠️ Temporary Workaround:                                │
│ Reduce simultaneous relay operation to minimize load   │
│                                                         │
│ [🔋 Power Test] [📊 Load Analysis] [⚙️ Settings]        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⏰ Schedule & Timing Issues

### Schedule Not Running

```
┌─────────────────────────────────────────────────────────┐
│ ⏰ Schedule Troubleshooting - Channel 2                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 Schedule Configuration Analysis:                     │
│                                                         │
│ Channel 2: Garden Lights                               │
│ ├─ Status: ⚫ Should be running but isn't               │
│ ├─ Schedule Type: Time Span Mode                        │
│ ├─ Time Window: 18:00 - 06:00                          │
│ ├─ Current Time: 20:30 (within window)                 │
│ ├─ Active Days: Mon, Tue, Wed, Thu, Fri, Sat, Sun      │
│ ├─ Today: Tuesday (should be active)                   │
│ └─ Channel Enable: ✅ Enabled                           │
│                                                         │
│ 🔧 Diagnostic Results:                                  │
│                                                         │
│ ✅ Time Synchronization: NTP synced 5 minutes ago      │
│ ✅ Timezone: Correct (EST, UTC-5)                      │
│ ✅ Day Selection: Tuesday is selected                   │
│ ✅ Time Window: Currently within 18:00-06:00           │
│ ❌ Override Status: PAUSED by manual override          │
│                                                         │
│ 🎯 Root Cause Found:                                   │
│ Channel was manually paused and pause wasn't cleared   │
│                                                         │
│ 🛠️ Solution:                                            │
│ Clear the manual override to resume normal schedule    │
│                                                         │
│ [▶️ Resume Schedule] [⚙️ Edit Schedule] [📋 View History] │
│                                                         │
│ 💡 Prevention Tips:                                     │
│ • Set override timeouts to auto-clear                  │
│ • Review override status in daily checks               │
│ • Use notification alerts for stuck overrides          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Time Synchronization Problems

```
┌─────────────────────────────────────────────────────────┐
│ 🕒 Time Synchronization Issues                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 Time System Status:                                  │
│                                                         │
│ Current System Time: 2025-01-15 14:05:23               │
│ Expected Time: 2025-01-15 20:05:23                     │
│ Time Difference: -6 hours (Major drift detected!)      │
│                                                         │
│ NTP Synchronization:                                    │
│ ├─ Primary Server: pool.ntp.org                        │
│ ├─ Status: ❌ Connection timeout                        │
│ ├─ Last Sync: 3 days ago                               │
│ ├─ Sync Attempts: 15 failed in last 24h                │
│ └─ Backup Server: time.google.com                      │
│                                                         │
│ Internet Connectivity:                                  │
│ ├─ DNS Resolution: ❌ Cannot resolve NTP servers        │
│ ├─ Firewall: ⚠️ Port 123 may be blocked                │
│ └─ Router NTP: ✅ Router time is correct                │
│                                                         │
│ 🎯 Impact on Schedules:                                 │
│ • All time-based schedules running 6 hours early       │
│ • Garden lights turning on at noon instead of 6 PM    │
│ • Water pump cycles shifted by 6 hours                 │
│                                                         │
│ 🛠️ Immediate Solutions:                                 │
│ 1. Manual time set (temporary):                        │
│    [🕒 Set Time Manually]                               │
│                                                         │
│ 2. Alternative NTP server:                             │
│    [🌐 Try Different NTP Server]                        │
│                                                         │
│ 3. Router-based sync:                                  │
│    [🔄 Use Router as Time Source]                       │
│                                                         │
│ 🔧 Permanent Fixes:                                     │
│ • Configure router to allow NTP traffic                │
│ • Add local NTP server on network                      │
│ • Enable automatic timezone detection                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏠 Home Assistant Integration Issues

### MQTT Connection Problems

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Home Assistant MQTT Troubleshooting                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🔍 MQTT Connection Status:                              │
│                                                         │
│ Broker Connection:                                      │
│ ├─ Server: 192.168.1.100:1883                          │
│ ├─ Status: ❌ Connection Refused                        │
│ ├─ Username: homeassistant                              │
│ ├─ Password: [Hidden] (8 characters)                    │
│ ├─ Last Success: 2 hours ago                           │
│ └─ Retry Attempts: 25 failed                           │
│                                                         │
│ Network Connectivity:                                   │
│ ├─ Ping to Broker: ✅ 192.168.1.100 reachable (3ms)    │
│ ├─ Port 1883: ❌ Connection refused                     │
│ ├─ Port 8883 (SSL): ❌ Connection refused               │
│ └─ Firewall Test: ⚠️ May be blocking MQTT ports        │
│                                                         │
│ 🔧 Diagnostic Steps:                                    │
│                                                         │
│ 1. Check Home Assistant MQTT Broker:                   │
│    □ Verify MQTT broker addon is running               │
│    □ Check broker logs for connection errors           │
│    □ Confirm port 1883 is open                         │
│                                                         │
│ 2. Verify Credentials:                                  │
│    □ Username exists in MQTT user list                 │
│    □ Password is correct (case-sensitive)              │
│    □ User has publish/subscribe permissions            │
│                                                         │
│ 3. Network Configuration:                              │
│    □ Router firewall allows MQTT traffic               │
│    □ No VLANs blocking device communication            │
│    □ IP address hasn't changed                         │
│                                                         │
│ 🛠️ Quick Fixes:                                         │
│ [🔄 Test Connection] [🔑 Reset MQTT Password]           │
│ [📊 View MQTT Logs] [⚙️ Reconfigure Broker]            │
│                                                         │
│ 💡 Alternative Solutions:                               │
│ • Use Home Assistant's built-in Mosquitto broker       │
│ • Try external MQTT broker (CloudMQTT, etc.)          │
│ • Enable MQTT over WebSocket (port 9001)               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Entity Discovery Issues

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Home Assistant Entity Discovery Problems              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Discovery Status:                                    │
│                                                         │
│ MQTT Discovery:                                         │
│ ├─ Discovery Enabled: ✅ Yes                            │
│ ├─ Discovery Topic: homeassistant/                     │
│ ├─ Messages Sent: 8 discovery messages                 │
│ ├─ Topics Published: All channels + sensors            │
│ └─ Retain Flag: ✅ Set for persistence                  │
│                                                         │
│ Home Assistant Status:                                  │
│ ├─ MQTT Integration: ✅ Active                          │
│ ├─ Discovery Enabled: ❌ Disabled in configuration     │
│ ├─ Known Entities: 0 ESP8266 devices                   │
│ └─ Entity Registry: No scheduler entities found        │
│                                                         │
│ 🎯 Root Cause:                                          │
│ Home Assistant MQTT discovery is disabled              │
│                                                         │
│ 🛠️ Solution Steps:                                      │
│                                                         │
│ 1. Enable MQTT Discovery in Home Assistant:            │
│    ```yaml                                             │
│    mqtt:                                               │
│      discovery: true                                   │
│      discovery_prefix: homeassistant                   │
│    ```                                                 │
│                                                         │
│ 2. Restart Home Assistant after configuration change   │
│                                                         │
│ 3. Force device to resend discovery messages:          │
│    [📡 Resend Discovery] [🔄 Restart Device]            │
│                                                         │
│ 4. Check Home Assistant logs for discovery messages:   │
│    [📋 View HA Logs] [🔍 Search Discovery]              │
│                                                         │
│ 🔍 Manual Entity Creation:                              │
│ If auto-discovery fails, entities can be manually      │
│ configured in Home Assistant configuration.yaml        │
│                                                         │
│ [📝 Show Manual Config] [📊 Test Discovery] [⚙️ Settings] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 Storage & Memory Issues

### Flash Memory Problems

```
┌─────────────────────────────────────────────────────────┐
│ 💿 Flash Memory Storage Issues                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Storage Analysis:                                    │
│                                                         │
│ Flash Memory Usage:                                     │
│ ├─ Total Capacity: 4.0 MB                               │
│ ├─ Firmware: 892 KB (22%)                              │
│ ├─ File System: 3.1 MB (78%)                           │
│ ├─ Available: 128 KB (3%) ❌ CRITICAL                   │
│ └─ Status: 🔴 Nearly full                               │
│                                                         │
│ File System Breakdown:                                  │
│ ├─ System Logs: 2.1 MB (68%) ❌ Too large              │
│ ├─ Configuration: 45 KB (1%)                           │
│ ├─ Web Interface: 512 KB (16%)                         │
│ ├─ Temp Files: 256 KB (8%)                             │
│ └─ Reserved: 128 KB (4%)                               │
│                                                         │
│ 🚨 Critical Issues:                                     │
│ • System logs consuming 68% of storage                 │
│ • Less than 128KB free space remaining                 │
│ • Device may become unstable or crash                  │
│ • New configurations cannot be saved                   │
│ • Firmware updates will fail                           │
│                                                         │
│ 🛠️ Immediate Actions Required:                          │
│                                                         │
│ 1. Clear System Logs (Frees ~2MB):                     │
│    [🗑️ Clear All Logs] [📋 Export Before Clear]        │
│                                                         │
│ 2. Remove Temporary Files:                             │
│    [🧹 Cleanup Temp Files]                              │
│                                                         │
│ 3. Enable Log Rotation:                                │
│    [⚙️ Configure Auto-Cleanup]                          │
│                                                         │
│ 💡 Long-term Solutions:                                 │
│ • Enable automatic log rotation (max 100KB)            │
│ • Reduce log verbosity level                           │
│ • Schedule weekly cleanup maintenance                  │
│ • Consider external logging via MQTT                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Memory Leak Detection

```
┌─────────────────────────────────────────────────────────┐
│ 🧠 Memory Leak Analysis                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Memory Usage Over Time:                              │
│                                                         │
│ RAM Usage Trend (Last 24 Hours):                       │
│ Hour 00: ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 125KB (39%)        │
│ Hour 06: ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 132KB (41%)        │
│ Hour 12: ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 148KB (46%)        │
│ Hour 18: ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 165KB (52%)        │
│ Hour 24: ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 187KB (58%)        │
│                                                         │
│ 🚨 Memory Leak Detected:                                │
│ • Memory usage increasing 2.5KB/hour                   │
│ • Pattern indicates gradual leak                       │
│ • At current rate: System crash in ~72 hours           │
│                                                         │
│ 🔍 Leak Source Analysis:                                │
│ Suspected Components:                                   │
│ ├─ Web Server: ⚠️ Connection handles not released      │
│ ├─ MQTT Client: ✅ Normal cleanup behavior             │
│ ├─ Schedule Engine: ⚠️ Growing data structures         │
│ ├─ GPIO Handler: ✅ Static memory usage                │
│ └─ Network Stack: ⚠️ Buffer accumulation               │
│                                                         │
│ 🛠️ Mitigation Steps:                                    │
│                                                         │
│ 1. Immediate Relief:                                    │
│    [🔄 Restart System] (Frees all leaked memory)       │
│                                                         │
│ 2. Reduce Leak Rate:                                   │
│    □ Limit web interface connections                   │
│    □ Reduce MQTT message frequency                     │
│    □ Clear schedule history more frequently            │
│                                                         │
│ 3. Monitor Improvement:                                 │
│    [📊 Enable Memory Monitoring]                       │
│                                                         │
│ 💡 Long-term Fix:                                       │
│ • Update to firmware v1.4.0 (includes memory fixes)   │
│ • Schedule automatic daily restarts                    │
│ • Enable memory usage alerts                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Advanced Diagnostics

### System Performance Analysis

```
┌─────────────────────────────────────────────────────────┐
│ 📊 System Performance Deep Analysis                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🖥️ CPU Performance Metrics:                             │
│                                                         │
│ CPU Usage Distribution:                                 │
│ ├─ Idle: 73% (Good)                                    │
│ ├─ Network I/O: 12% (Normal)                           │
│ ├─ Schedule Processing: 8% (Normal)                    │
│ ├─ Web Interface: 4% (Low load)                        │
│ ├─ MQTT Processing: 2% (Efficient)                     │
│ └─ System Tasks: 1% (Minimal)                          │
│                                                         │
│ ⚡ Task Response Times:                                  │
│ ├─ GPIO Operations: 0.1ms (Excellent)                  │
│ ├─ Schedule Checks: 2.3ms (Good)                       │
│ ├─ Web Requests: 45ms (Acceptable)                     │
│ ├─ MQTT Messages: 8ms (Good)                           │
│ └─ File Operations: 125ms (Slow - SSD recommended)     │
│                                                         │
│ 🌡️ Thermal Performance:                                 │
│ ├─ Current Temp: 47°C (Within normal range)            │
│ ├─ Max Temp (24h): 52°C (Acceptable)                   │
│ ├─ Throttling Events: 0 (No thermal issues)            │
│ └─ Cooling: Passive (adequate for current load)        │
│                                                         │
│ 📊 Performance Score: 87/100 (Good)                    │
│                                                         │
│ 🎯 Optimization Recommendations:                        │
│ • File system operations are bottleneck               │
│ • Consider reducing log write frequency                │
│ • Web interface caching could improve response        │
│ • MQTT batching could reduce CPU usage                │
│                                                         │
│ [📊 Detailed Report] [⚙️ Apply Optimizations] [📈 Monitor] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Emergency Recovery Mode

```
┌─────────────────────────────────────────────────────────┐
│ 🆘 Emergency Recovery & Safe Mode                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🚨 System Recovery Options:                             │
│                                                         │
│ When to Use Emergency Recovery:                         │
│ • Device not responding to normal interface             │
│ • Corrupted configuration preventing startup           │
│ • Continuous crashes or boot loops                     │
│ • Network configuration prevents access                │
│ • Hardware issues requiring safe diagnosis             │
│                                                         │
│ 🔧 Recovery Methods:                                    │
│                                                         │
│ Method 1: Safe Mode Boot                               │
│ 1. Power off device                                    │
│ 2. Hold GPIO0 button while powering on                │
│ 3. Release after 10 seconds                           │
│ 4. Device boots with minimal services                 │
│ 5. Access basic interface at 192.168.4.1              │
│                                                         │
│ Method 2: Factory Reset (Hardware)                     │
│ 1. Power off device                                    │
│ 2. Hold both GPIO0 and EN buttons                     │
│ 3. Release EN, continue holding GPIO0                 │
│ 4. Hold for 30 seconds, then release                  │
│ 5. Complete factory reset performed                   │
│                                                         │
│ Method 3: Serial Recovery                              │
│ 1. Connect USB-to-Serial adapter                      │
│ 2. Use PlatformIO to flash recovery firmware          │
│ 3. Boot into recovery mode                            │
│ 4. Restore from backup or reconfigure                 │
│                                                         │
│ 🛟 Safe Mode Features:                                  │
│ • Minimal web interface (configuration only)          │
│ • No schedule execution                               │
│ • All relays disabled                                 │
│ • Basic network configuration                         │
│ • Configuration backup/restore                        │
│ • Hardware diagnostics                                │
│                                                         │
│ ⚠️ Important Notes:                                     │
│ • Safe mode disables all automation                   │
│ • Manual control still available                      │
│ • Create backup before making changes                 │
│ • Exit safe mode after repairs are complete           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📞 Getting Help & Support

### Support Resources

```
┌─────────────────────────────────────────────────────────┐
│ 📞 Support & Community Resources                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📚 Documentation & Guides:                             │
│ • Getting Started Guide: Step-by-step setup           │
│ • Channel Configuration: Detailed scheduling help     │
│ • Home Assistant Integration: MQTT setup guide        │
│ • Use Cases & Examples: Real-world applications       │
│ • API Documentation: Developer reference              │
│                                                         │
│ 💬 Community Support:                                   │
│ • User Forum: Community discussions and tips          │
│ • Discord Server: Real-time help and chat             │
│ • Reddit: r/ESP8266Scheduler community                │
│ • Facebook Group: Share projects and solutions        │
│                                                         │
│ 🐛 Bug Reports & Feature Requests:                     │
│ • GitHub Issues: Bug reports and feature requests     │
│ • Bug Report Template: Structured issue reporting     │
│ • Feature Voting: Vote on upcoming features           │
│                                                         │
│ 🎓 Learning Resources:                                  │
│ • Video Tutorials: YouTube channel with guides        │
│ • Webinars: Monthly live Q&A sessions                 │
│ • Blog: Tips, tricks, and advanced tutorials          │
│                                                         │
│ 🛠️ Professional Support:                               │
│ • Email Support: Direct technical assistance          │
│ • Remote Diagnostics: Authorized remote help          │
│ • Custom Development: Paid customization services     │
│                                                         │
│ Before Contacting Support:                             │
│ □ Check this troubleshooting guide                    │
│ □ Search community forums for similar issues          │
│ □ Try safe mode and basic diagnostics                 │
│ □ Gather system information and error logs            │
│ □ Note recent changes or events                       │
│                                                         │
│ [📧 Contact Support] [💬 Join Community] [📚 View Docs] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### System Information Export

```
┌─────────────────────────────────────────────────────────┐
│ 📋 System Information for Support                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ When contacting support, please include this info:     │
│                                                         │
│ 🖥️ Hardware Information:                                │
│ • Device: ESP32 DevKit v1                              │
│ • Chip: ESP32-D0WDQ6                                   │
│ • Flash: 4MB                                           │
│ • MAC: 24:0A:C4:12:34:56                               │
│                                                         │
│ 💾 Firmware Information:                                │
│ • Version: 1.3.0                                       │
│ • Build: 2025-01-15                                    │
│ • Compiler: GCC 8.4.0                                  │
│ • Framework: Arduino ESP32 v2.0.5                     │
│                                                         │
│ 🌐 Network Configuration:                               │
│ • WiFi: MyHomeWiFi (-45dBm)                            │
│ • IP: 192.168.1.105                                    │
│ • Gateway: 192.168.1.1                                │
│ • DNS: 8.8.8.8, 8.8.4.4                               │
│                                                         │
│ ⚙️ System Status:                                       │
│ • Uptime: 15 days, 6 hours                             │
│ • Memory: 187KB/320KB (58%)                            │
│ • Storage: 3.9MB/4MB (97%)                             │
│ • Temperature: 47°C                                    │
│                                                         │
│ 🔧 Active Configuration:                                │
│ • Channels: 4 configured, 2 active                     │
│ • MQTT: Enabled (192.168.1.100:1883)                  │
│ • NTP: pool.ntp.org                                    │
│ • Timezone: America/New_York (UTC-5)                   │
│                                                         │
│ [📄 Export Full Report] [📧 Email to Support] [💾 Save] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Documentation Complete! 🎉**

**Navigation:**
- [🚀 Getting Started](getting-started.md)
- [🖥️ Interface Guide](interface-guide.md) 
- [⚙️ Channel Configuration](channel-configuration.md)
- [🏠 Home Assistant Integration](home-assistant.md)
- [🔧 System Administration](system-administration.md)
- [📋 Use Cases & Examples](use-cases.md)
- [🐛 Troubleshooting Guide](troubleshooting.md) ← You are here