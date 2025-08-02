# 🏠 Home Assistant Integration

## ESP8266 React Scheduler - Complete Home Assistant Setup

This guide covers the complete integration between your ESP8266 React Scheduler and Home Assistant, including MQTT setup, device discovery, entity configuration, and automation examples.

---

## 🚀 Quick Integration Overview

### What You'll Get

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Home Assistant Integration Benefits                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✅ Automatic Device Discovery                            │
│ ├─ Zero-configuration setup                            │
│ ├─ All channels appear automatically                   │
│ └─ Device information included                          │
│                                                         │
│ 🎛️  Complete Control                                    │
│ ├─ On/Off switches for each channel                    │
│ ├─ Real-time status updates                            │
│ └─ Manual override capabilities                        │
│                                                         │
│ 📊 Rich Device Information                              │
│ ├─ IP address, version, uptime                         │
│ ├─ Schedule status and next run times                  │
│ └─ Error states and diagnostics                        │
│                                                         │
│ 🤖 Automation Ready                                     │
│ ├─ Use in scenes and automations                       │
│ ├─ Trigger on schedule events                          │
│ └─ Integrate with other devices                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📡 MQTT Broker Setup

### Prerequisites

Before starting, ensure you have:
- Home Assistant with MQTT integration enabled
- MQTT broker (built-in or external like Mosquitto)
- ESP8266 device on the same network as Home Assistant

### MQTT Broker Configuration

#### Built-in MQTT Broker Setup

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Home Assistant - MQTT Broker Setup                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Configuration → Add-ons → MQTT (Mosquitto broker)       │
│                                                         │
│ Installation:                                           │
│ 1. Click "Install"                                      │
│ 2. Toggle "Start on boot"                              │
│ 3. Click "Start"                                       │
│                                                         │
│ Configuration Tab:                                      │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ logins:                                             │ │
│ │   - username: homeassistant                         │ │
│ │     password: your_secure_password                  │ │
│ │                                                     │ │
│ │ anonymous: false                                    │ │
│ │ customize:                                          │ │
│ │   active: false                                     │ │
│ │   folder: mosquitto                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 4. Click "Save" and restart the add-on                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### MQTT Integration Setup

```
┌─────────────────────────────────────────────────────────┐
│ 🔗 Home Assistant - MQTT Integration                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Configuration → Integrations → Add Integration          │
│                                                         │
│ Search: "MQTT"                                          │
│                                                         │
│ Configuration:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Broker: 192.168.1.100 (or core-mosquitto)           │ │
│ │ Port: 1883                                          │ │
│ │ Username: homeassistant                             │ │
│ │ Password: your_secure_password                      │ │
│ │                                                     │ │
│ │ ☑️ Enable discovery                                  │ │
│ │ Discovery prefix: homeassistant                     │ │
│ │                                                     │ │
│ │ Advanced Options:                                   │ │
│ │ Keep alive: 60                                      │ │
│ │ QoS: 0                                             │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Click "Submit" to complete setup                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 ESP8266 MQTT Configuration

### MQTT Settings Interface

```
┌─────────────────────────────────────────────────────────┐
│ 📡 ESP8266 - MQTT Settings Configuration                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MQTT Broker Settings:                                   │
│                                                         │
│ Broker Host: [192.168.1.100              ]             │
│ Port:        [1883    ]                                 │
│ Username:    [homeassistant               ]             │
│ Password:    [••••••••••••••••••••••••••••]             │
│                                                         │
│ Client Settings:                                        │
│ Client ID:   [esp-scheduler-7821848d563c  ]             │
│ Keep Alive:  [60      ] seconds                         │
│ Clean Session: ☑️ Enabled                               │
│                                                         │
│ Home Assistant Discovery:                               │
│ Enable Discovery: ☑️ Enabled                            │
│ Discovery Prefix: [homeassistant         ]             │
│ Entity Prefix:    [ESP Scheduler          ]             │
│                                                         │
│ Connection Status: 🟢 Connected                         │
│ Last Message: 2 seconds ago                            │
│                                                         │
│ [🔄 Test Connection] [💾 Save Settings] [📊 View Stats] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Connection Test Results

```
┌─────────────────────────────────────────────────────────┐
│ 🧪 MQTT Connection Test Results                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Testing connection to 192.168.1.100:1883...            │
│                                                         │
│ ✅ DNS Resolution: 192.168.1.100                        │
│ ✅ TCP Connection: Established                          │
│ ✅ MQTT Handshake: Success                              │
│ ✅ Authentication: Credentials accepted                 │
│ ✅ Topic Subscription: homeassistant/+/+/set           │
│ ✅ Message Publish: Test message sent                   │
│ ✅ Discovery Message: Device registration sent          │
│                                                         │
│ Connection Quality:                                     │
│ ├─ Latency: 12ms (Excellent)                           │
│ ├─ Signal: ████▁ -45dBm (Strong)                       │
│ └─ Stability: 100% uptime (last 24h)                   │
│                                                         │
│ ✅ All tests passed! Integration ready.                 │
│                                                         │
│ [✅ Close] [📋 Export Report] [🔄 Test Again]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Device Discovery Process

### Automatic Discovery in Home Assistant

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Home Assistant - New Device Discovered               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🎉 New Device Found!                                    │
│                                                         │
│ Device: ESP8266 React Scheduler                         │
│ IP Address: 192.168.1.105                              │
│ Version: 1.3.0                                         │
│ MAC: 78:21:84:8D:56:3C                                 │
│                                                         │
│ 📊 Discovered Entities:                                 │
│                                                         │
│ 🚰 switch.water_pump_xp                                │
│ ├─ Name: Water Pump XP                                 │
│ ├─ Icon: mdi:water-pump                                │
│ └─ State: Currently OFF                                │
│                                                         │
│ 💡 switch.garden_lights                                │
│ ├─ Name: Garden Lights                                 │
│ ├─ Icon: mdi:lightbulb                                 │
│ └─ State: Currently OFF                                │
│                                                         │
│ 🌪️  switch.exhaust_fan                                 │
│ ├─ Name: Exhaust Fan                                   │
│ ├─ Icon: mdi:fan                                       │
│ └─ State: Disabled                                     │
│                                                         │
│ 🔌 switch.spare_outlet                                 │
│ ├─ Name: Spare Outlet                                  │
│ ├─ Icon: mdi:power                                     │
│ └─ State: Disabled                                     │
│                                                         │
│ [➕ Add to Home Assistant] [⚙️ Configure] [❌ Ignore]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Device Information Panel

```
┌─────────────────────────────────────────────────────────┐
│ 📋 Device Information - ESP8266 React Scheduler         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 🖥️  Hardware Information:                               │
│ ├─ Model: ESP32 DevKit                                 │
│ ├─ Chip: ESP32-D0WDQ6 (revision 1)                    │
│ ├─ MAC Address: 78:21:84:8D:56:3C                      │
│ └─ Flash Size: 4MB                                     │
│                                                         │
│ 🌐 Network Information:                                │
│ ├─ IP Address: 192.168.1.105                           │
│ ├─ Hostname: esp-scheduler                             │
│ ├─ WiFi SSID: MyHomeWiFi                               │
│ └─ Signal Strength: -45dBm                             │
│                                                         │
│ 💻 Software Information:                               │
│ ├─ Firmware Version: 1.3.0                            │
│ ├─ Build Date: 2025-01-15                             │
│ ├─ Arduino Core: 2.0.11                               │
│ └─ Free Memory: 125KB / 320KB                          │
│                                                         │
│ 📡 MQTT Information:                                   │
│ ├─ Broker: 192.168.1.100:1883                         │
│ ├─ Client ID: esp-scheduler-7821848d563c               │
│ ├─ Discovery Prefix: homeassistant                    │
│ └─ Messages: 1,234 sent, 567 received                 │
│                                                         │
│ 🔗 Device Links:                                       │
│ [🌐 Web Interface] [⚙️ Configuration] [📊 Diagnostics] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎛️ Entity Configuration

### Switch Entity Configuration

```
┌─────────────────────────────────────────────────────────┐
│ 🎛️  Entity Settings - Water Pump XP                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📋 Basic Information:                                   │
│ Entity ID: [switch.water_pump_xp                ]      │
│ Name:      [Water Pump XP                       ]      │
│ Icon:      [mdi:water-pump ▼]                          │
│ Entity Category: [None ▼]                              │
│                                                         │
│ 🏷️  Labels and Areas:                                   │
│ Area:      [Garden ▼]                                  │
│ Labels:    [irrigation] [outdoor] [automation]         │
│                                                         │
│ ⚙️  Advanced Settings:                                  │
│ Device Class: [switch]                                 │
│ Unit of Measurement: [None]                            │
│ State Class: [None]                                    │
│                                                         │
│ 📊 Entity Attributes:                                   │
│ ├─ Current State: OFF                                  │
│ ├─ Last Updated: 2025-01-15 14:30:25                  │
│ ├─ Schedule Status: Active                             │
│ ├─ Next Run: Today 15:00                              │
│ ├─ Override Active: No                                 │
│ ├─ IP Address: 192.168.1.105                          │
│ ├─ Version: 1.3.0                                     │
│ └─ Uptime: 15 days, 6 hours                           │
│                                                         │
│ [💾 Save] [🔄 Reload] [🗑️ Delete] [📊 History]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Available Icon Options

```
┌─────────────────────────────────────────────────────────┐
│ 🎨 Material Design Icons - Popular Choices              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Water & Irrigation:                                     │
│ 🚰 mdi:water-pump        🚿 mdi:shower                  │
│ 💧 mdi:water             🌊 mdi:waves                   │
│ 🏊 mdi:pool              🚱 mdi:water-off               │
│                                                         │
│ Lighting:                                               │
│ 💡 mdi:lightbulb         💡 mdi:lightbulb-on            │
│ 🌟 mdi:lightbulb-multiple 🔦 mdi:flashlight            │
│ 💡 mdi:ceiling-light     🌙 mdi:lightbulb-night        │
│                                                         │
│ HVAC & Fans:                                            │
│ 🌪️  mdi:fan              ❄️  mdi:air-conditioner       │
│ 🌡️  mdi:thermostat       🌪️  mdi:ceiling-fan           │
│ 🔥 mdi:radiator          ❄️  mdi:snowflake             │
│                                                         │
│ Appliances:                                             │
│ 🔌 mdi:power             📺 mdi:television              │
│ 🔊 mdi:speaker           📷 mdi:camera                  │
│ 🖨️  mdi:printer          ☕ mdi:coffee                  │
│                                                         │
│ Security & Access:                                      │
│ 🏠 mdi:garage            🚪 mdi:door                    │
│ 🔒 mdi:lock              👁️  mdi:eye                    │
│ 🚨 mdi:alarm-light       🔔 mdi:bell                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🏠 Home Assistant Dashboard Integration

### Adding to Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Dashboard - Add ESP8266 Scheduler                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Dashboard: Overview                                     │
│ View: Garden Control                                    │
│                                                         │
│ Card Type: Entities Card                               │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🏠 Garden Automation                                │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │                                                     │ │
│ │ 🚰 Water Pump XP              ●──○ ON              │ │
│ │    Next run: Today 15:00                           │ │
│ │                                                     │ │
│ │ 💡 Garden Lights              ○──● OFF             │ │
│ │    Starts at sunset                                │ │
│ │                                                     │ │
│ │ 🌪️  Exhaust Fan                ○──● DISABLED        │ │
│ │    Configure to enable                             │ │
│ │                                                     │ │
│ │ 🔌 Spare Outlet               ○──● DISABLED        │ │
│ │    Configure to enable                             │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Card Configuration:                                     │
│ ├─ Title: Garden Automation                            │
│ ├─ Show header toggle: Yes                             │
│ ├─ Show state color: Yes                               │
│ └─ State color mode: Default                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Individual Entity Cards

```
┌─────────────────────────────────────────────────────────┐
│ 💡 Individual Entity Card - Water Pump XP              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Card Type: Button Card                                  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                🚰                                   │ │
│ │           Water Pump XP                             │ │
│ │                                                     │ │
│ │         ●──○ RUNNING                                │ │
│ │                                                     │ │
│ │      3 minutes remaining                            │ │
│ │      Next run: 15:00                               │ │
│ │                                                     │ │
│ │     [Manual Control] [Configure]                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Configuration:                                          │
│ ├─ Entity: switch.water_pump_xp                        │
│ ├─ Name: Water Pump XP                                 │
│ ├─ Icon: mdi:water-pump                                │
│ ├─ Show name: Yes                                      │
│ ├─ Show icon: Yes                                      │
│ ├─ Show state: Yes                                     │
│ ├─ Tap action: toggle                                  │
│ ├─ Hold action: more-info                              │
│ └─ Show last changed: Yes                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Status Overview Card

```
┌─────────────────────────────────────────────────────────┐
│ 📊 System Status Overview Card                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Card Type: Picture Elements Card                       │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🖥️  ESP8266 React Scheduler                         │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │                                                     │ │
│ │ Status: 🟢 Online    IP: 192.168.1.105             │ │
│ │ Uptime: 15d 6h       Version: 1.3.0                │ │
│ │                                                     │ │
│ │ Active Channels: 2/4                               │ │
│ │ ████████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 2 running          │ │
│ │                                                     │ │
│ │ MQTT: ✅ Connected   Memory: 39% used               │ │
│ │ WiFi: ████▁ -45dBm   CPU: 15% avg                  │ │
│ │                                                     │ │
│ │ [🌐 Web Interface] [⚙️ Configure] [📊 Diagnostics] │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Elements:                                               │
│ ├─ Status indicator (state icon)                       │
│ ├─ Progress bars (template sensors)                    │
│ ├─ Action buttons (service calls)                      │
│ └─ Dynamic text (attribute templates)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 Automation Examples

### Basic On/Off Automation

```yaml
┌─────────────────────────────────────────────────────────┐
│ 🤖 Automation Example - Sunset Garden Lights           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ automation:                                             │
│   - alias: "Garden Lights - Sunset Control"            │
│     description: "Turn on garden lights at sunset"     │
│     trigger:                                            │
│       - platform: sun                                  │
│         event: sunset                                   │
│         offset: "-00:30:00"  # 30 min before sunset    │
│     condition:                                          │
│       - condition: state                               │
│         entity_id: binary_sensor.someone_home          │
│         state: "on"                                     │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id: switch.garden_lights              │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           message: "🌅 Garden lights activated"        │
│                                                         │
│   - alias: "Garden Lights - Sunrise Control"           │
│     description: "Turn off garden lights at sunrise"   │
│     trigger:                                            │
│       - platform: sun                                  │
│         event: sunrise                                  │
│         offset: "01:00:00"   # 1 hour after sunrise    │
│     action:                                             │
│       - service: switch.turn_off                       │
│         target:                                         │
│           entity_id: switch.garden_lights              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Weather-Based Irrigation

```yaml
┌─────────────────────────────────────────────────────────┐
│ 🌧️  Weather-Based Irrigation Automation                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ automation:                                             │
│   - alias: "Smart Irrigation - Weather Check"          │
│     description: "Skip irrigation if it rained"        │
│     trigger:                                            │
│       - platform: time                                 │
│         at: "06:00:00"  # Daily check                  │
│     condition:                                          │
│       - condition: numeric_state                       │
│         entity_id: sensor.rainfall_today               │
│         below: 5  # mm of rain                         │
│       - condition: numeric_state                       │
│         entity_id: sensor.temperature                  │
│         above: 15  # Celsius                           │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id: switch.water_pump_xp              │
│         data:                                           │
│           duration: 900  # 15 minutes                  │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           title: "🚰 Irrigation Active"                │
│           message: "Garden watering started (15 min)"  │
│                                                         │
│   - alias: "Irrigation - Rain Detected"                │
│     description: "Stop irrigation if rain starts"      │
│     trigger:                                            │
│       - platform: state                                │
│         entity_id: binary_sensor.rain_detected         │
│         to: "on"                                        │
│     condition:                                          │
│       - condition: state                               │
│         entity_id: switch.water_pump_xp                │
│         state: "on"                                     │
│     action:                                             │
│       - service: switch.turn_off                       │
│         target:                                         │
│           entity_id: switch.water_pump_xp              │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           message: "🌧️ Irrigation stopped - rain detected" │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Security Integration

```yaml
┌─────────────────────────────────────────────────────────┐
│ 🔒 Security Integration Automation                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ automation:                                             │
│   - alias: "Security - Away Mode Lighting"             │
│     description: "Random lighting when away"           │
│     trigger:                                            │
│       - platform: state                                │
│         entity_id: alarm_control_panel.home_alarm      │
│         to: "armed_away"                                │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id:                                    │
│             - switch.garden_lights                     │
│             - switch.spare_outlet  # Indoor lights     │
│         data:                                           │
│           randomize: true                               │
│           schedule_override: "security_mode"            │
│                                                         │
│   - alias: "Security - Motion Activated Lighting"      │
│     description: "Turn on lights on motion"            │
│     trigger:                                            │
│       - platform: state                                │
│         entity_id: binary_sensor.motion_detector       │
│         to: "on"                                        │
│     condition:                                          │
│       - condition: sun                                 │
│         after: sunset                                   │
│         before: sunrise                                 │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id: switch.garden_lights              │
│         data:                                           │
│           override_duration: 600  # 10 minutes         │
│       - delay: "00:10:00"                              │
│       - service: switch.turn_off                       │
│         target:                                         │
│           entity_id: switch.garden_lights              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Energy Management

```yaml
┌─────────────────────────────────────────────────────────┐
│ ⚡ Energy Management Automation                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ automation:                                             │
│   - alias: "Energy - Off-Peak Operation"               │
│     description: "Run high-power devices off-peak"     │
│     trigger:                                            │
│       - platform: time                                 │
│         at: "23:00:00"  # Off-peak hours start         │
│     condition:                                          │
│       - condition: numeric_state                       │
│         entity_id: sensor.electricity_price            │
│         below: 0.15  # Price per kWh                   │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id:                                    │
│             - switch.water_pump_xp                     │
│             - switch.exhaust_fan                       │
│         data:                                           │
│           schedule_mode: "energy_saver"                 │
│                                                         │
│   - alias: "Energy - Solar Production Peak"            │
│     description: "Use excess solar power"              │
│     trigger:                                            │
│       - platform: numeric_state                        │
│         entity_id: sensor.solar_power_excess           │
│         above: 1000  # Watts                           │
│         for: "00:05:00"                                │
│     action:                                             │
│       - service: switch.turn_on                        │
│         target:                                         │
│           entity_id: switch.water_pump_xp              │
│         data:                                           │
│           duration: 1800  # 30 minutes                 │
│           priority: "solar_excess"                      │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           message: "☀️ Using excess solar for irrigation" │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Monitoring and Alerts

### Status Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ 📊 ESP8266 Scheduler - Monitoring Dashboard             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Device Status:                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🟢 Online    │ 15d 6h uptime │ 192.168.1.105       │ │
│ │ ✅ Healthy   │ 1.3.0 version │ 39% memory used     │ │
│ │ 📡 Connected │ MQTT active   │ -45dBm WiFi         │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Channel Activity (Last 24h):                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🚰 Water Pump:    ████████████████████████▁▁▁▁ 85%  │ │
│ │ 💡 Garden Lights: ████████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 50%  │ │
│ │ 🌪️  Exhaust Fan:   ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  0%  │ │
│ │ 🔌 Spare Outlet:  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  0%  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ MQTT Statistics:                                        │
│ ├─ Messages Sent: 1,234 (2/min avg)                    │
│ ├─ Messages Received: 567 (1/min avg)                  │
│ ├─ Connection Uptime: 100% (24h)                       │
│ └─ Last Disconnect: 3 days ago (30s)                   │
│                                                         │
│ Alerts & Notifications:                                 │
│ ├─ 🟢 All systems operational                           │
│ ├─ 📊 24 successful operations today                    │
│ └─ ⚠️  No alerts in last 7 days                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Alert Configuration

```yaml
┌─────────────────────────────────────────────────────────┐
│ 🚨 Alert Automation Configuration                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ automation:                                             │
│   - alias: "ESP8266 - Device Offline Alert"            │
│     description: "Alert when device goes offline"      │
│     trigger:                                            │
│       - platform: state                                │
│         entity_id: switch.water_pump_xp                │
│         to: "unavailable"                               │
│         for: "00:05:00"                                │
│     action:                                             │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           title: "⚠️ ESP8266 Scheduler Offline"        │
│           message: "Device at 192.168.1.105 is offline" │
│           data:                                         │
│             priority: high                              │
│             tag: "esp8266_offline"                      │
│                                                         │
│   - alias: "ESP8266 - Schedule Failure Alert"          │
│     description: "Alert on schedule failures"          │
│     trigger:                                            │
│       - platform: state                                │
│         entity_id: binary_sensor.schedule_error        │
│         to: "on"                                        │
│     action:                                             │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           title: "🔧 Schedule Error Detected"          │
│           message: "Check ESP8266 configuration"       │
│           data:                                         │
│             actions:                                    │
│               - action: "open_device"                   │
│                 title: "Open Device"                    │
│               - action: "dismiss"                       │
│                 title: "Dismiss"                        │
│                                                         │
│   - alias: "ESP8266 - Low Memory Warning"              │
│     description: "Alert on low memory"                 │
│     trigger:                                            │
│       - platform: numeric_state                        │
│         entity_id: sensor.esp8266_free_memory          │
│         below: 50000  # 50KB                           │
│         for: "00:10:00"                                │
│     action:                                             │
│       - service: notify.mobile_app                     │
│         data:                                           │
│           message: "⚠️ ESP8266 memory low - consider restart" │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎛️ Advanced Integration Features

### Custom Sensors and Template Entities

```yaml
┌─────────────────────────────────────────────────────────┐
│ 📊 Custom Template Sensors                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ template:                                               │
│   - sensor:                                             │
│       - name: "Water Pump Runtime Today"               │
│         state: >                                        │
│           {% set pump = states('switch.water_pump_xp') %} │
│           {% if pump == 'on' %}                         │
│             {{ state_attr('switch.water_pump_xp',       │
│                'runtime_today') | default(0) }}        │
│           {% else %}                                    │
│             {{ state_attr('switch.water_pump_xp',       │
│                'runtime_today') | default(0) }}        │
│           {% endif %}                                   │
│         unit_of_measurement: "minutes"                  │
│         device_class: duration                          │
│         icon: mdi:clock-outline                         │
│                                                         │
│       - name: "Garden System Status"                   │
│         state: >                                        │
│           {% set pump = states('switch.water_pump_xp') %} │
│           {% set lights = states('switch.garden_lights') %} │
│           {% if pump == 'unavailable' or               │
│                 lights == 'unavailable' %}             │
│             offline                                     │
│           {% elif pump == 'on' or lights == 'on' %}    │
│             active                                      │
│           {% else %}                                    │
│             standby                                     │
│           {% endif %}                                   │
│         icon: >                                          │
│           {% set status = this.state %}                 │
│           {% if status == 'active' %}                   │
│             mdi:garden                                  │
│           {% elif status == 'standby' %}                │
│             mdi:garden-cart                             │
│           {% else %}                                    │
│             mdi:alert-circle                            │
│           {% endif %}                                   │
│                                                         │
│   - binary_sensor:                                      │
│       - name: "Irrigation Schedule Active"             │
│         state: >                                        │
│           {{ state_attr('switch.water_pump_xp',         │
│              'schedule_active') == true }}              │
│         device_class: running                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Service Calls for Advanced Control

```yaml
┌─────────────────────────────────────────────────────────┐
│ 🛠️  Custom Service Calls                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ # Override with specific duration                       │
│ service: mqtt.publish                                   │
│ data:                                                   │
│   topic: "homeassistant/switch/water_pump_xp/set"       │
│   payload: >                                            │
│     {                                                   │
│       "state": "ON",                                    │
│       "override_duration": 900,                         │
│       "override_reason": "manual_watering"              │
│     }                                                   │
│                                                         │
│ # Temporarily disable schedule                          │
│ service: mqtt.publish                                   │
│ data:                                                   │
│   topic: "homeassistant/switch/water_pump_xp/config"    │
│   payload: >                                            │
│     {                                                   │
│       "schedule_enabled": false,                        │
│       "disable_duration": 3600                          │
│     }                                                   │
│                                                         │
│ # Request device status update                          │
│ service: mqtt.publish                                   │
│ data:                                                   │
│   topic: "homeassistant/switch/water_pump_xp/command"   │
│   payload: "status_update"                              │
│                                                         │
│ # Restart device remotely                              │
│ service: mqtt.publish                                   │
│ data:                                                   │
│   topic: "homeassistant/switch/water_pump_xp/command"   │
│   payload: "restart"                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting Integration Issues

### Common Problems and Solutions

```
┌─────────────────────────────────────────────────────────┐
│ 🔧 Troubleshooting Common Integration Issues            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ❌ Device Not Discovered:                               │
│ ├─ Check MQTT broker connection                        │
│ ├─ Verify discovery prefix matches                     │
│ ├─ Restart Home Assistant MQTT integration             │
│ └─ Check ESP8266 MQTT logs                             │
│                                                         │
│ ❌ Entities Show "Unavailable":                         │
│ ├─ Verify ESP8266 is online (ping test)               │
│ ├─ Check MQTT broker logs                              │
│ ├─ Restart ESP8266 device                              │
│ └─ Verify MQTT credentials                             │
│                                                         │
│ ❌ Commands Not Working:                                │
│ ├─ Check command topic subscription                    │
│ ├─ Verify JSON payload format                          │
│ ├─ Test with MQTT client tool                          │
│ └─ Check ESP8266 command processing                    │
│                                                         │
│ ❌ Slow Response Times:                                 │
│ ├─ Check WiFi signal strength                          │
│ ├─ Reduce MQTT keepalive interval                      │
│ ├─ Verify network congestion                           │
│ └─ Consider QoS settings                               │
│                                                         │
│ ❌ Frequent Disconnections:                             │
│ ├─ Check power supply stability                        │
│ ├─ Increase MQTT keepalive time                        │
│ ├─ Verify WiFi stability                               │
│ └─ Check for interference sources                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Diagnostic Tools

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 Integration Diagnostic Tools                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ MQTT Client Testing:                                    │
│ # Subscribe to all device topics                       │
│ mosquitto_sub -h 192.168.1.100 -u homeassistant \     │
│   -P password -t "homeassistant/switch/+/+"            │
│                                                         │
│ # Publish test command                                  │
│ mosquitto_pub -h 192.168.1.100 -u homeassistant \     │
│   -P password -t "homeassistant/switch/water_pump_xp/set" \ │
│   -m '{"state":"ON"}'                                   │
│                                                         │
│ Home Assistant MQTT Debug:                             │
│ # Enable MQTT logging in configuration.yaml           │
│ logger:                                                 │
│   logs:                                                 │
│     homeassistant.components.mqtt: debug               │
│     paho.mqtt.client: debug                            │
│                                                         │
│ ESP8266 Debug Output:                                  │
│ # Check serial monitor for MQTT messages              │
│ # Look for connection status                           │
│ # Monitor command processing                           │
│                                                         │
│ Network Connectivity:                                   │
│ # Ping test from Home Assistant                        │
│ ping 192.168.1.105                                     │
│                                                         │
│ # Port connectivity test                               │
│ nc -zv 192.168.1.105 80                               │
│ nc -zv 192.168.1.100 1883                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Next: [🔧 System Administration](system-administration.md)**