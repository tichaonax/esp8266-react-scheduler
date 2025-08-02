# 🚀 Getting Started Guide

## ESP8266 React Scheduler - Quick Setup

Welcome to your ESP8266 React Scheduler! This guide will walk you through the initial setup process with visual representations of each step.

---

## 📦 What You'll Need

- ESP32/ESP8266 device with the scheduler firmware
- WiFi network with internet access
- Computer or mobile device with web browser
- (Optional) Home Assistant for advanced integration

---

## 🔌 First Boot Experience

### Initial Power-On Screen

When you first power on your device, you'll see the startup sequence:

```
┌─────────────────────────────────────────────────────────┐
│ 🚀 ESP8266 React Scheduler                             │
│    Starting up...                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ████████████████████████████████████████████████░░ 95% │
│                                                         │
│ • Hardware initialization... ✅                         │
│ • Memory check... ✅                                    │
│ • File system mount... ✅                               │
│ • Network scanning... 🔍                               │
│                                                         │
│ Version: 1.3.0                                         │
│ Build: 2025-01-15                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### WiFi Setup Required Screen

If no WiFi is configured, you'll see the setup prompt:

```
┌─────────────────────────────────────────────────────────┐
│ 📶 WiFi Configuration Required                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ No WiFi network configured.                            │
│                                                         │
│ 🔧 Setup Options:                                       │
│                                                         │
│ 1️⃣ Connect to setup network:                           │
│    Network: "ESP-Scheduler-Setup"                      │
│    Password: (none)                                     │
│                                                         │
│ 2️⃣ Or visit: http://192.168.4.1                        │
│                                                         │
│ 📱 From your phone/computer:                            │
│ • Connect to the ESP-Scheduler-Setup network           │
│ • Open browser to http://192.168.4.1                   │
│ • Follow the setup wizard                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ WiFi Configuration Wizard

### Step 1: Connect to Setup Network

```
┌─────────────────────────────────────────────────────────┐
│ 📶 WiFi Setup - Network Selection                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Available Networks:                                     │
│                                                         │
│ ● MyHomeWiFi              ████▁ -45dBm [🔒]            │
│ ● NeighborNetwork         ███▁▁ -65dBm [🔒]            │
│ ● GuestNetwork            ██▁▁▁ -75dBm [🔒]            │
│ ● PublicWiFi              █▁▁▁▁ -85dBm [📖]            │
│                                                         │
│ Selected: MyHomeWiFi                                    │
│                                                         │
│ Password: [••••••••••••••••••••]                       │
│                                                         │
│ ☐ Show password                                         │
│ ☐ Remember this network                                 │
│                                                         │
│ [🔙 Back]              [🔍 Scan Again] [➡️ Connect]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Connection Progress

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Connecting to WiFi Network                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Network: MyHomeWiFi                                     │
│                                                         │
│ Status: Connecting...                                   │
│ ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░ 60%    │
│                                                         │
│ Steps:                                                  │
│ ✅ Network found                                        │
│ ✅ Authentication successful                            │
│ 🔄 Obtaining IP address...                             │
│ ⏳ Testing internet connection...                       │
│ ⏳ Synchronizing time...                                │
│                                                         │
│ Please wait, this may take up to 30 seconds...         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Connection Success

```
┌─────────────────────────────────────────────────────────┐
│ ✅ WiFi Connection Successful!                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Network: MyHomeWiFi                                     │
│ IP Address: 192.168.1.105                              │
│ Gateway: 192.168.1.1                                   │
│ DNS: 8.8.8.8                                           │
│                                                         │
│ Signal Strength: ████▁ -45dBm (Excellent)              │
│                                                         │
│ 🌐 Internet: ✅ Connected                               │
│ 🕒 Time Sync: ✅ Synchronized                           │
│                                                         │
│ Your device is now online!                             │
│ The setup network will be disabled.                    │
│                                                         │
│ 📱 Access your scheduler at:                            │
│ http://192.168.1.105                                   │
│                                                         │
│ [🏠 Go to Main Interface]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎛️ Initial Device Configuration

### Welcome Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🎉 Welcome to ESP8266 React Scheduler!                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Your device is connected and ready to configure.       │
│                                                         │
│ 📋 Quick Setup Checklist:                              │
│                                                         │
│ ✅ WiFi Connected (192.168.1.105)                      │
│ ✅ Internet Access                                      │
│ ✅ Time Synchronized                                    │
│ ⏳ Channels Configuration                               │
│ ⏳ Home Assistant Integration                           │
│                                                         │
│ 🚀 Choose your setup path:                             │
│                                                         │
│ [⚡ Quick Setup]  [🔧 Advanced Setup]  [📖 Guide]      │
│                                                         │
│ Quick Setup: Get running in 5 minutes                  │
│ Advanced Setup: Full customization options             │
│ Guide: Step-by-step walkthrough                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Quick Setup - Channel Configuration

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ Quick Setup - Channel 1                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Let's configure your first channel:                    │
│                                                         │
│ Device Name: [Water Pump                          ]    │
│                                                         │
│ What type of device is this?                           │
│ ● 🚰 Water Pump/Irrigation                             │
│ ○ 💡 Lighting System                                   │
│ ○ 🌪️  Ventilation/Fan                                  │
│ ○ 🔌 Generic Appliance                                 │
│                                                         │
│ Control Pin: [GPIO 21 ▼]                               │
│                                                         │
│ Basic Schedule:                                         │
│ Run every: [30 minutes ▼]                              │
│ For duration: [5 minutes ▼]                            │
│                                                         │
│ Active days: [Mo] [Tu] [We] [Th] [Fr] [Sa] [Su]        │
│              ●    ●    ●    ●    ●    ○    ○            │
│                                                         │
│ [🔙 Back]                            [➡️ Continue]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Setup Complete Screen

```
┌─────────────────────────────────────────────────────────┐
│ 🎉 Setup Complete!                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Your ESP8266 React Scheduler is ready to use!          │
│                                                         │
│ 📊 Configuration Summary:                               │
│                                                         │
│ Device: 192.168.1.105                                  │
│ Channels Configured: 1                                 │
│                                                         │
│ 🚰 Channel 1: Water Pump                               │
│ • Schedule: Every 30 min for 5 min                     │
│ • Days: Monday - Friday                                │
│ • Status: ✅ Ready                                      │
│                                                         │
│ 🔗 Next Steps:                                          │
│                                                         │
│ • [📊 View Status Dashboard]                            │
│ • [⚙️ Configure More Channels]                          │
│ • [🏠 Setup Home Assistant]                             │
│ • [📖 Read Full Documentation]                          │
│                                                         │
│ 💡 Tip: Bookmark http://192.168.1.105 for easy access  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Hardware Setup Guide

### GPIO Pin Configuration

```
┌─────────────────────────────────────────────────────────┐
│ 🔌 Hardware Connection Guide                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ESP32 Pinout (DevKit):                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  3V3 ●─────────────────────────────────────────● GND │ │
│ │  EN  ●─────────────────────────────────────────● D23 │ │
│ │  D36 ●─────────────────────────────────────────● D22 │ │  
│ │  D39 ●─────────────────────────────────────────● D21 │ │ ← Channel 1
│ │  D34 ●─────────────────────────────────────────● D19 │ │ ← Channel 2  
│ │  D35 ●─────────────────────────────────────────● D18 │ │ ← Channel 3
│ │  D32 ●─────────────────────────────────────────● D5  │ │ ← Channel 4
│ │  D33 ●─────────────────────────────────────────● D17 │ │
│ │  D25 ●─────────────────────────────────────────● D16 │ │
│ │  D26 ●─────────────────────────────────────────● D4  │ │
│ │  D27 ●─────────────────────────────────────────● D2  │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Recommended Pins for Relays:                           │
│ • Channel 1: GPIO 21 (default)                         │
│ • Channel 2: GPIO 19                                   │
│ • Channel 3: GPIO 18                                   │
│ • Channel 4: GPIO 5                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Relay Connection Example

```
┌─────────────────────────────────────────────────────────┐
│ 🔗 Relay Module Connection                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ESP32 → 4-Channel Relay Module                         │
│                                                         │
│     ESP32        │    Relay Module                      │
│ ┌─────────────┐  │  ┌─────────────────┐                │
│ │         3V3 ●──┼──● VCC             │                │
│ │         GND ●──┼──● GND             │                │
│ │        GPIO21●──┼──● IN1 (Channel 1) │                │
│ │        GPIO19●──┼──● IN2 (Channel 2) │                │
│ │        GPIO18●──┼──● IN3 (Channel 3) │                │
│ │         GPIO5●──┼──● IN4 (Channel 4) │                │
│ └─────────────┘  │  └─────────────────┘                │
│                                                         │
│ Relay Module → Load (Pump, Light, etc.)                │
│                                                         │
│ ⚠️ Safety Notes:                                        │
│ • Use appropriate voltage ratings                       │
│ • Ensure proper isolation for high voltage             │
│ • Test connections before applying power               │
│ • Follow local electrical codes                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📱 First Time User Experience

### Mobile Setup Flow

```
┌─────────────────┐
│ 📱 Mobile Setup │
├─────────────────┤
│                 │
│ 1️⃣ WiFi Setup    │
│ [Scan Networks] │
│                 │
│ 2️⃣ Quick Config  │
│ [Device Setup]  │
│                 │
│ 3️⃣ Test Run     │
│ [Manual Test]   │
│                 │
│ 4️⃣ Dashboard     │
│ [View Status]   │
│                 │
│ ✅ Complete!     │
│                 │
└─────────────────┘
```

---

## 🏁 Quick Start Checklist

### ✅ Pre-Setup Requirements
- [ ] ESP32/ESP8266 device powered and accessible
- [ ] WiFi network name and password ready
- [ ] Computer/phone connected to same network
- [ ] (Optional) Relay modules connected to GPIO pins

### ⚡ 5-Minute Quick Setup
1. [ ] Power on device and wait for setup network
2. [ ] Connect to "ESP-Scheduler-Setup" network
3. [ ] Navigate to http://192.168.4.1
4. [ ] Configure WiFi connection
5. [ ] Set up first channel with Quick Setup
6. [ ] Test manual operation
7. [ ] Access main interface at device IP

### 🔧 Advanced Setup (Optional)
- [ ] Configure all 4 channels
- [ ] Set up complex schedules
- [ ] Integrate with Home Assistant
- [ ] Configure MQTT settings
- [ ] Set up remote access

### 📊 Verification Steps
- [ ] Device appears online in status dashboard
- [ ] Manual control works for all channels
- [ ] Scheduled operations execute correctly
- [ ] (Optional) Home Assistant entities discovered

---

## 🆘 Need Help?

### Common Setup Issues

#### WiFi Connection Problems
```
🔧 Can't connect to WiFi?
┌─────────────────────────────────────┐
│ Status: 🔴 Connection Failed        │
│ Error: Authentication failed        │
│                                     │
│ Quick Fixes:                        │
│ • Double-check password             │
│ • Verify network name (case-sens.) │
│ • Move closer to router             │
│ • Restart device and try again     │
│                                     │
│ Still having issues?                │
│ → See Troubleshooting Guide        │
└─────────────────────────────────────┘
```

### Support Resources
- 📖 **Full Documentation**: Complete feature guide
- 🐛 **Troubleshooting**: Common issues and solutions  
- 💬 **Community Forum**: User discussions and tips
- 🔧 **GitHub Issues**: Bug reports and feature requests

---

**Next: [📊 Main Interface Guide](interface-guide.md)**