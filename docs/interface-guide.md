# 🖥️ Main Interface Guide

## ESP8266 React Scheduler - Complete Interface Documentation

This guide covers all screens and interfaces of your ESP8266 React Scheduler with detailed visual representations and explanations.

---

## 🏠 Main Dashboard

### Status Overview Screen

The main dashboard provides a comprehensive overview of all your channels and system status.

```
┌─────────────────────────────────────────────────────────┐
│ 📊 ESP8266 React Scheduler - Status Dashboard          │
├─────────────────────────────────────────────────────────┤
│                                               🌐 Online │
│ Last Update: Just now                    IP: 192.168.1.105 │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🚰 Channel 1: Water Pump XP           🟢 RUNNING   │ │
│ │ ├─ Status: ● Active (3 min remaining)              │ │  
│ │ ├─ Schedule: Every 30 min for 5 min                │ │
│ │ ├─ Next Run: Today 14:30 (in 25 min)               │ │
│ │ ├─ Override: None                                   │ │
│ │ └─ Controls: [🔴 Stop Now] [⏸️ Pause] [⚙️ Config]   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 💡 Channel 2: Garden Lights          🟡 SCHEDULED  │ │
│ │ ├─ Status: ○ Off (starts at sunset)                │ │
│ │ ├─ Mode: Time Span (18:00 - 06:00)                 │ │
│ │ ├─ Next Run: Today 18:30 (in 4h 25m)               │ │
│ │ ├─ Override: None                                   │ │
│ │ └─ Controls: [🟢 Start] [⏸️ Disable] [⚙️ Config]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🌪️  Channel 3: Exhaust Fan            ⚫ DISABLED   │ │
│ │ ├─ Status: ○ Disabled                               │ │
│ │ ├─ Schedule: Not configured                         │ │
│ │ ├─ Next Run: None                                   │ │
│ │ ├─ Override: None                                   │ │
│ │ └─ Controls: [⚙️ Configure Channel]                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🔌 Channel 4: Spare Outlet           ⚫ DISABLED   │ │
│ │ ├─ Status: ○ Disabled                               │ │
│ │ ├─ Schedule: Not configured                         │ │
│ │ ├─ Next Run: None                                   │ │
│ │ ├─ Override: None                                   │ │
│ │ └─ Controls: [⚙️ Configure Channel]                  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ System Status: ✅ All systems operational              │
│ Uptime: 15 days, 6 hours                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Channel Status Indicators

| Status | Icon | Description | Available Actions |
|--------|------|-------------|------------------|
| **🟢 RUNNING** | ● | Channel actively operating | Stop, Pause, Configure |
| **🟡 SCHEDULED** | ○ | Waiting for next scheduled run | Start Override, Disable, Configure |
| **🟠 OVERRIDE** | ◐ | Manual override active | Stop Override, Configure |
| **⚫ DISABLED** | ○ | Channel not enabled | Configure, Enable |
| **🔴 ERROR** | ⚠️ | System error detected | View Error, Reset, Configure |

---

## 🧭 Navigation Menu

### Desktop Navigation Sidebar

```
┌─────────────────────────────────────┐
│ ☰ ESP8266 React Scheduler          │
├─────────────────────────────────────┤
│                                     │
│ 📊 Dashboard                        │
│ │                                   │
│ ⚙️  Channels                         │
│ ├─ 🚰 Channel 1: Water Pump         │
│ ├─ 💡 Channel 2: Garden Lights      │
│ ├─ 🌪️  Channel 3: Exhaust Fan        │
│ └─ 🔌 Channel 4: Spare Outlet       │
│                                     │
│ 📡 System                           │
│ ├─ 📶 WiFi Settings                 │
│ ├─ 🕒 Time & NTP                    │
│ ├─ 🔐 Security                      │
│ ├─ 🔄 Firmware Update               │
│ └─ 🔧 System Info                   │
│                                     │
│ 🏠 Home Assistant                   │
│ ├─ 🔗 MQTT Settings                 │
│ ├─ 🏷️  Entity Configuration         │
│ └─ 📊 Integration Status            │
│                                     │
│ 📋 Logs & Diagnostics              │
│ ├─ 📄 System Logs                  │
│ ├─ 🐛 Error Reports                │
│ └─ 📊 Performance                   │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ 👤 Admin                            │
│ └─ 🚪 Sign Out                      │
│                                     │
└─────────────────────────────────────┘
```

### Mobile Navigation Menu

```
┌─────────────────┐
│ ☰ Menu          │
├─────────────────┤
│                 │
│ 📊 Dashboard     │
│                 │
│ ⚙️  Channels      │
│ • 🚰 Channel 1   │
│ • 💡 Channel 2   │
│ • 🌪️  Channel 3   │
│ • 🔌 Channel 4   │
│                 │
│ 📡 System        │
│ • 📶 WiFi        │
│ • 🕒 Time        │
│ • 🔐 Security    │
│ • 🔄 Updates     │
│                 │
│ 🏠 Home Assist.  │
│ 📋 Logs          │
│                 │
│ 👤 Admin         │
│ 🚪 Sign Out      │
│                 │
└─────────────────┘
```

---

## 📊 Detailed Status Views

### Individual Channel Status

```
┌─────────────────────────────────────────────────────────┐
│ 🚰 Channel 1: Water Pump XP - Detailed Status          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Current Status: 🟢 RUNNING                              │
│ ████████████████████████████████████████░░░░░░░░ 85%    │
│ Time Remaining: 3 minutes 15 seconds                   │
│                                                         │
│ 📅 Schedule Information:                                │
│ ├─ Pattern: Interval Mode                              │
│ ├─ Frequency: Every 30 minutes                         │
│ ├─ Duration: 5 minutes per cycle                       │
│ ├─ Active Days: Mon, Tue, Wed, Thu, Fri               │
│ ├─ Time Window: 06:00 - 22:00                         │
│ └─ Next Run: Today 14:30 (in 25 minutes)              │
│                                                         │
│ 📊 Today's Activity:                                    │
│ ├─ Runs Completed: 12 of 16 scheduled                 │
│ ├─ Total Runtime: 1 hour 0 minutes                    │
│ ├─ Last Started: 13:30 (35 minutes ago)               │
│ └─ Success Rate: 100% (all runs completed)            │
│                                                         │
│ 🎛️  Manual Controls:                                    │
│ [🔴 Stop Now] [⏸️ Pause] [▶️ Extend +5min] [⚙️ Config] │
│                                                         │
│ 🔧 Advanced:                                            │
│ [📊 History] [🐛 Diagnostics] [📋 Export Logs]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### System Overview Panel

```
┌─────────────────────────────────────────────────────────┐
│ 🖥️  System Overview                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📊 Performance Metrics:                                 │
│ ├─ CPU Usage: ████▁▁▁▁▁▁ 15%                          │
│ ├─ Memory: ████████▁▁ 125KB / 320KB (39%)             │
│ ├─ Storage: ███▁▁▁▁▁▁▁ 1.2MB / 4MB (30%)              │
│ └─ Uptime: 15 days, 6 hours, 42 minutes               │
│                                                         │
│ 🌐 Network Status:                                      │
│ ├─ WiFi: ████▁ MyHomeWiFi (-45dBm)                     │
│ ├─ IP: 192.168.1.105                                   │
│ ├─ Gateway: 192.168.1.1 ✅                             │
│ └─ Internet: ✅ Connected                               │
│                                                         │
│ 🕒 Time & Sync:                                         │
│ ├─ Local Time: 2025-01-15 14:05:23                    │
│ ├─ Timezone: EST (UTC-5)                               │
│ ├─ NTP Server: pool.ntp.org ✅                         │
│ └─ Last Sync: 12 minutes ago                           │
│                                                         │
│ 🏠 Home Assistant:                                      │
│ ├─ MQTT: ✅ Connected (broker.home)                    │
│ ├─ Entities: 6 active                                  │
│ └─ Messages: 1,234 sent, 567 received                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎛️ Interactive Controls

### Quick Control Panel

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Quick Controls                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🚰 Water Pump XP:                                       │
│ [🟢 ON] [🔴 OFF] [⏸️ PAUSE] ⏰ 03:15 remaining          │
│                                                         │
│ 💡 Garden Lights:                                       │
│ [○ OFF] [🔴 OFF] [⏸️ PAUSE] ⏰ Starts in 4h 25m        │
│                                                         │
│ 🌪️  Exhaust Fan:                                        │
│ [⚫ DISABLED] [⚙️ Configure]                             │
│                                                         │
│ 🔌 Spare Outlet:                                        │
│ [⚫ DISABLED] [⚙️ Configure]                             │
│                                                         │
│ 🎛️  System Controls:                                    │
│ [🔄 Refresh] [⏸️ Pause All] [▶️ Resume All] [🔄 Restart] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Override Control Dialog

```
┌─────────────────────────────────────────────────────────┐
│ 🎛️  Manual Override - Water Pump XP                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Current Status: 🟢 Running (scheduled)                  │
│ Time Remaining: 3 minutes 15 seconds                   │
│                                                         │
│ Override Options:                                       │
│                                                         │
│ ● Stop Now                                              │
│   Immediately stop and resume normal schedule          │
│                                                         │
│ ● Extend Runtime                                        │
│   Continue for: [5 min ▼] [15 min] [30 min] [1 hour]   │
│                                                         │
│ ● Manual Control                                        │
│   Run for: [Duration: 10 minutes    ]                  │
│   ☐ Skip next scheduled run                             │
│                                                         │
│ ● Pause Schedule                                        │
│   Pause for: [1 hour ▼] [4 hours] [8 hours] [1 day]    │
│   ☐ Keep current state during pause                     │
│                                                         │
│ ⚠️  Warning: Manual overrides will affect the normal    │
│    schedule. The device will resume normal operation   │
│    after the override period expires.                  │
│                                                         │
│ [❌ Cancel]                            [✅ Apply Override] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Interface

### Mobile Dashboard View

```
┌─────────────────┐
│ 📊 Dashboard     │
├─────────────────┤
│                 │
│ 🚰 Water Pump   │
│ 🟢 RUNNING      │
│ ████████░░ 80%  │
│ 3:15 left       │
│ [🔴] [⏸️] [⚙️]   │
│                 │
│ 💡 Garden Light │
│ 🟡 SCHEDULED    │
│ Starts 18:30    │
│ in 4h 25m       │
│ [🟢] [⏸️] [⚙️]   │
│                 │
│ 🌪️  Exhaust Fan  │
│ ⚫ DISABLED     │
│ Not configured  │
│ [⚙️ Setup]       │
│                 │
│ 🔌 Spare Outlet │
│ ⚫ DISABLED     │
│ Not configured  │
│ [⚙️ Setup]       │
│                 │
│ System: ✅ OK    │
│ 15d 6h uptime   │
│                 │
└─────────────────┘
```

### Mobile Quick Actions

```
┌─────────────────┐
│ ⚡ Quick Actions │
├─────────────────┤
│                 │
│ All Channels:   │
│ [⏸️ Pause All]   │
│ [▶️ Resume All] │
│ [🔄 Restart]    │
│                 │
│ Emergency:      │
│ [🛑 STOP ALL]   │
│                 │
│ Status:         │
│ [🔄 Refresh]    │
│ [📊 Details]    │
│                 │
└─────────────────┘
```

---

## 🔔 Notifications & Alerts

### Status Notification Bar

```
┌─────────────────────────────────────────────────────────┐
│ 🔔 Notifications                                (3 new) │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✅ 14:00 - Water Pump XP completed 5-minute cycle      │
│ 📊 13:45 - System status: All channels operational     │
│ ⚠️  13:30 - Garden Lights: Schedule starts in 5 hours  │
│                                                         │
│ 📋 View All Notifications                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Alert Types

| Type | Icon | Description | Action Required |
|------|------|-------------|----------------|
| **✅ Success** | ✅ | Normal operation completed | None |
| **ℹ️ Info** | ℹ️ | Status update or schedule change | None |
| **⚠️ Warning** | ⚠️ | Potential issue or upcoming event | Monitor |
| **🔴 Error** | 🚠 | System error or failure | Immediate action |
| **🔧 Maintenance** | 🔧 | System maintenance required | Schedule action |

### Error Alert Dialog

```
┌─────────────────────────────────────────────────────────┐
│ 🚨 System Alert - Immediate Attention Required          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Alert Type: 🔴 CRITICAL ERROR                           │
│ Time: 2025-01-15 14:05:23                              │
│ Channel: Water Pump XP (Channel 1)                     │
│                                                         │
│ 📋 Error Details:                                       │
│ GPIO Pin 21 not responding to control signals          │
│ Possible hardware failure or connection issue          │
│                                                         │
│ 🔧 Suggested Actions:                                   │
│ 1. Check physical connections to relay module          │
│ 2. Verify power supply to relay board                  │
│ 3. Test with manual GPIO control                       │
│ 4. Replace relay module if necessary                   │
│                                                         │
│ 🛡️  Safety Status:                                      │
│ Channel has been automatically disabled                 │
│ All other channels operating normally                   │
│                                                         │
│ [🔧 Diagnose] [📋 Export Log] [✅ Acknowledge] [❌ Dismiss] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⚙️ Settings Quick Access

### Settings Overview

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️  Quick Settings                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🌐 Network: MyHomeWiFi ████▁ (-45dBm)                  │
│ 🕒 Time: 2025-01-15 14:05:23 EST                       │
│ 🏠 MQTT: ✅ Connected to broker.home                    │
│ 🔔 Notifications: ✅ Enabled (3 unread)                │
│                                                         │
│ 🎛️  Quick Toggles:                                      │
│ │                                                       │
│ │ Auto-Schedule: ●──○ ON                               │
│ │ Notifications: ●──○ ON                              │
│ │ Home Assistant: ●──○ ON                             │
│ │ Debug Logging: ○──● OFF                             │
│                                                         │
│ [⚙️ Advanced Settings] [📊 System Info] [🔄 Restart]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Performance Monitoring

### Real-Time Performance Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ 📊 System Performance - Real Time                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🖥️  CPU Usage (Last 5 minutes):                         │
│ ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 15%     │
│                                                         │
│ 💾 Memory Usage:                                        │
│ ████████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 125KB/320KB     │
│                                                         │
│ 📶 Network Activity:                                    │
│ ↑ Sent: 1.2MB (12 KB/s)                               │
│ ↓ Received: 456KB (4 KB/s)                            │
│                                                         │
│ 🏠 MQTT Messages:                                       │
│ ↑ Published: 1,234 (2/min avg)                        │
│ ↓ Received: 567 (1/min avg)                           │
│                                                         │
│ ⚡ GPIO Activity:                                        │
│ Pin 21 (Ch1): ████████████████████████████░░░░ 85%     │
│ Pin 19 (Ch2): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%       │
│ Pin 18 (Ch3): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%       │
│ Pin 5  (Ch4): ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 0%       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Next: [⚙️ Channel Configuration Guide](channel-configuration.md)**