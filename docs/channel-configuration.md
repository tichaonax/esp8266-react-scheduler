# ⚙️ Channel Configuration Guide

## ESP8266 React Scheduler - Complete Channel Setup

This comprehensive guide covers every aspect of channel configuration with detailed visual representations of all configuration screens and options.

---

## 🎛️ Channel Configuration Overview

### Configuration Interface Layout

The channel configuration uses a modern, sectioned card layout for intuitive organization:

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️  Water Pump XP Schedule Configuration               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Channel Name: [Water Pump XP                      ]    │
│                                                         │
│ Schedule Enabled: ●──○ ON                              │
│                                      [💾 Save Schedule] │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🏠 Home Assistant MQTT Integration                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Topic Type:     [Switch        ▼]                      │
│ HA Icon:        [🚰 water-pump  ▼]                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔀 Operation Mode & Advanced Options                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ☐ Enable Time Span Mode                                │
│ ☐ Enable Randomization                                 │
│ ☐ Enable Minimum Run Time                              │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📅 Weekly Schedule - Active Days                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [SU] [MO] [TU] [WE] [TH] [FR] [SA]                     │
│  ●    ●    ●    ○    ●    ●    ●                       │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔄 Schedule Timing & Intervals                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Run Every:  [5 seconds        ▼]                       │
│ Off After:  [2 seconds        ▼]                       │
│                                                         │
│ ⚠️ Off After (2 sec) must be less than Run Every (5 sec)│
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🕒 Daily Time Range Control                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Start Hour:   [01 ▼]    Start Minute: [15 ▼]          │
│ End Hour:     [23 ▼]    End Minute:   [45 ▼]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Basic Settings Section

### Channel Identification

```
┌─────────────────────────────────────────────────────────┐
│ ⚙️  Channel Configuration - Basic Settings              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Channel Name: [Water Pump XP                      ]    │
│ ├─ Requirements: 3-50 characters                       │
│ ├─ Allowed: Letters, numbers, spaces                   │
│ └─ Examples: "Garden Pump", "Pool Filter", "LED Strip" │
│                                                         │
│ Schedule Status:                                        │
│ ●──○ Schedule Enabled                                  │
│ │                                                       │
│ ├─ ON: Channel follows configured schedule             │
│ └─ OFF: Manual control only                            │
│                                                         │
│ [💾 Save Schedule]                                      │
│ ├─ Saves all configuration changes                     │
│ ├─ Validates settings before saving                    │
│ └─ Shows confirmation message                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Save Button States

```
Save Button States:
┌─────────────────────────────────────────────────────────┐
│ Normal State:    [💾 Save Schedule]                     │
│ Saving State:    [⏳ Saving...]                         │
│ Success State:   [✅ Saved Successfully!]               │
│ Error State:     [❌ Save Failed - Retry]               │
└─────────────────────────────────────────────────────────┘
```

---

## 🏠 Home Assistant Integration

### MQTT Configuration

```
┌─────────────────────────────────────────────────────────┐
│ 🏠 Home Assistant MQTT Integration                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Topic Type: [Switch ▼]                                 │
│ ├─ Switch: Binary on/off control                       │
│ └─ Light: Lighting entity with dimming support         │
│                                                         │
│ Home Assistant Icon: [🚰 water-pump ▼]                 │
│ ├─ 🚰 water-pump      (pumps, irrigation)              │
│ ├─ 💡 lightbulb       (lighting, LED strips)           │
│ ├─ 🌪️  fan             (ventilation, cooling)           │
│ ├─ 🔌 power           (generic appliances)             │
│ ├─ 📷 camera          (security cameras)               │
│ ├─ 🏠 garage          (garage doors)                   │
│ ├─ 🔊 speaker         (audio equipment)                │
│ └─ ... (15+ icons available)                           │
│                                                         │
│ Auto-Discovery: ✅ Enabled                              │
│ ├─ Automatically appears in Home Assistant             │
│ ├─ Creates MQTT entities                               │
│ └─ Configures device information                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Icon Selection Preview

```
Home Assistant Icon Options:
┌─────────────────────────────────────────────────────────┐
│ Device Type          │ Icon              │ Use Cases     │
├─────────────────────────────────────────────────────────┤
│ 🚰 water-pump        │ Blue water icon   │ Irrigation    │
│ 💡 lightbulb         │ Yellow bulb       │ Lighting      │
│ 🌪️  fan              │ Spinning fan      │ Ventilation   │
│ 🔌 power             │ Power plug        │ Appliances    │
│ 📷 camera            │ Camera lens       │ Security      │
│ 🏠 garage            │ Garage door       │ Access        │
│ ❄️  air-conditioner  │ AC unit          │ Climate       │
│ 🔊 speaker           │ Audio speaker     │ Media         │
│ 📺 television        │ TV screen         │ Entertainment │
│ 🖨️  printer          │ Printer           │ Office        │
│ 🍞 toaster           │ Kitchen appliance │ Kitchen       │
│ ❄️  fridge           │ Refrigerator      │ Kitchen       │
│ 🏭 microwave         │ Microwave oven    │ Kitchen       │
│ 🌡️  ceiling-fan-light│ Ceiling fan       │ Climate       │
│ 🔥 toaster-oven      │ Toaster oven      │ Kitchen       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔀 Operation Modes

### Mode Selection Interface

```
┌─────────────────────────────────────────────────────────┐
│ 🔀 Operation Mode & Advanced Options                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ☑️ Enable Time Span Mode                                │
│ ├─ When enabled: Device operates only between          │
│ │  start and end times (e.g., 6PM - 6AM)               │
│ ├─ When disabled: Interval scheduling (every X min)    │
│ └─ Cannot use with interval scheduling                  │
│                                                         │
│ ☐ Enable Randomization                                 │
│ ├─ Adds natural variation to timing                    │
│ ├─ Prevents predictable patterns                       │
│ ├─ Disabled when Time Span Mode is active              │
│ └─ Useful for irrigation and security                  │
│                                                         │
│ ☐ Enable Minimum Run Time                              │
│ ├─ Only available with Randomization                   │
│ ├─ Ensures minimum operation duration                  │
│ ├─ Prevents very short random cycles                   │
│ └─ Improves pump/motor longevity                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Mode Compatibility Matrix

```
Operation Mode Compatibility:
┌─────────────────────────────────────────────────────────┐
│ Mode Combination          │ Compatible │ Description    │
├─────────────────────────────────────────────────────────┤
│ Interval Only             │     ✅     │ Basic timing   │
│ Time Span Only            │     ✅     │ Window control │
│ Interval + Randomization  │     ✅     │ Natural timing │
│ Time Span + Randomization │     ❌     │ Not allowed    │
│ Randomization + Min Time  │     ✅     │ Smart random   │
│ Time Span + Min Time      │     ❌     │ Not applicable │
└─────────────────────────────────────────────────────────┘
```

### Mode Behavior Examples

#### Interval Mode
```
Interval Mode (Every 30 min for 5 min):
┌─────────────────────────────────────────────────────────┐
│ Timeline (24 hours):                                    │
│ 00:00 ████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 00:30               │
│ 00:30 ████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 01:00               │
│ 01:00 ████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 01:30               │
│ ... (continues every 30 minutes)                       │
│                                                         │
│ Legend: ████ = ON (5 min)  ▁▁▁ = OFF (25 min)          │
└─────────────────────────────────────────────────────────┘
```

#### Time Span Mode
```
Time Span Mode (18:00 - 06:00):
┌─────────────────────────────────────────────────────────┐
│ Timeline (24 hours):                                    │
│ 00:00 ████████████████████████████████████████████ 06:00│
│ 06:00 ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 18:00│
│ 18:00 ████████████████████████████████████████████ 24:00│
│                                                         │
│ Legend: ████ = ON  ▁▁▁ = OFF                            │
└─────────────────────────────────────────────────────────┘
```

#### Randomized Mode
```
Randomized Mode (Every 30±10 min for 5±2 min):
┌─────────────────────────────────────────────────────────┐
│ Timeline (4 hours):                                     │
│ 00:00 ███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 00:23                       │
│ 00:23 ███████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 00:55               │
│ 00:55 ████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 01:32             │
│ 01:32 ██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 02:08             │
│                                                         │
│ Legend: Variable timing creates natural patterns        │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Weekly Schedule Configuration

### Day Selection Interface

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Weekly Schedule - Active Days                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Select the days when this channel should be active:    │
│                                                         │
│ Desktop View:                                           │
│ [SU] [MO] [TU] [WE] [TH] [FR] [SA]                     │
│  ●    ●    ●    ○    ●    ●    ●                       │
│                                                         │
│ Mobile View:                                            │
│ [SU] [MO] [TU] [WE]                                    │
│  ●    ●    ●    ○                                      │
│ [TH] [FR] [SA]                                         │
│  ●    ●    ●                                           │
│                                                         │
│ Selected Days: Monday, Tuesday, Wednesday, Friday,      │
│                Saturday, Sunday                         │
│                                                         │
│ Quick Presets:                                          │
│ [Weekdays] [Weekends] [Daily] [Custom] [Clear All]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Day Selection States

```
Day Selection States:
┌─────────────────────────────────────────────────────────┐
│ Active Day:      [MO]  (Blue background, white text)   │
│ Inactive Day:    [TU]  (Gray border, gray text)        │
│ Hover State:     [WE]  (Light blue border)             │
│ Pressed State:   [TH]  (Dark blue background)          │
└─────────────────────────────────────────────────────────┘
```

### Quick Preset Options

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Day Selection Presets                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Weekdays]  → Monday through Friday                    │
│             [MO] [TU] [WE] [TH] [FR] ⬜ ⬜              │
│                                                         │
│ [Weekends]  → Saturday and Sunday                      │
│             ⬜ ⬜ ⬜ ⬜ ⬜ [SA] [SU]                      │
│                                                         │
│ [Daily]     → All seven days                           │
│             [MO] [TU] [WE] [TH] [FR] [SA] [SU]         │
│                                                         │
│ [Custom]    → Manual selection                         │
│             [Select individual days]                    │
│                                                         │
│ [Clear All] → No days selected                         │
│             ⬜ ⬜ ⬜ ⬜ ⬜ ⬜ ⬜                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Schedule Timing & Intervals

### Interval Configuration

```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Schedule Timing & Intervals                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Run Every: [5 seconds        ▼]                        │
│ ├─ Available options:                                   │
│ │  • 2-6 seconds (sub-second precision)                │
│ │  • 10 seconds - 30 seconds                           │
│ │  • 1 minute - 60 minutes                             │
│ │  • 2 hours - 24 hours                                │
│ └─ Selected: 5 seconds (0.083 minutes)                 │
│                                                         │
│ Off After: [2 seconds        ▼]                        │
│ ├─ Must be less than "Run Every" value                 │
│ ├─ Filtered options based on Run Every                 │
│ └─ Selected: 2 seconds (0.033 minutes)                 │
│                                                         │
│ ✅ Validation: Off After (2 sec) < Run Every (5 sec)    │
│                                                         │
│ 💡 Result: Device runs for 2 seconds every 5 seconds   │
│    (40% duty cycle)                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Timing Options Available

#### Run Every Options
```
┌─────────────────────────────────────────────────────────┐
│ 🔄 Run Every - Complete Options List                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Sub-Second Precision:                                   │
│ • 02 seconds (0.033 min)  • 03 seconds (0.050 min)     │
│ • 04 seconds (0.066 min)  • 05 seconds (0.083 min)     │
│ • 06 seconds (0.100 min)                               │
│                                                         │
│ Seconds Range:                                          │
│ • 10 seconds (0.166 min)  • 12 seconds (0.200 min)     │
│ • 15 seconds (0.250 min)  • 20 seconds (0.333 min)     │
│ • 30 seconds (0.500 min)                               │
│                                                         │
│ Minutes Range:                                          │
│ • 1-6 minutes            • 8, 10-13 minutes            │
│ • 15, 17, 20 minutes     • 30, 40 minutes              │
│                                                         │
│ Hours Range:                                            │
│ • 1, 2, 3, 4 hours       • 6, 8, 12 hours              │
│ • 24 hours (daily)                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Off After Options (Filtered)
```
┌─────────────────────────────────────────────────────────┐
│ ⏹️  Off After - Filtered by Run Every Selection         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ When Run Every = 5 seconds:                            │
│ Available Off After options:                            │
│ • 01 second (0.016 min)   • 02 seconds (0.033 min)     │
│ • 03 seconds (0.050 min)  • 04 seconds (0.066 min)     │
│                                                         │
│ When Run Every = 30 minutes:                           │
│ Available Off After options:                            │
│ • 1-29 minutes           • All second intervals        │
│ • Up to 29 minutes       • Excluding 30+ minutes       │
│                                                         │
│ When Run Every = 2 hours:                              │
│ Available Off After options:                            │
│ • All options up to 119 minutes                        │
│ • Seconds, minutes ranges                              │
│ • Up to 1 hour 59 minutes                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Smart Validation

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  Timing Validation & Smart Adjustments               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Real-time Validation:                                   │
│ ✅ Valid: Off After (2 sec) < Run Every (5 sec)         │
│ ❌ Invalid: Off After (30 min) ≥ Run Every (20 min)     │
│                                                         │
│ Auto-Adjustment Example:                                │
│ 1. User selects Run Every: 10 minutes                  │
│ 2. Current Off After: 15 minutes (invalid)             │
│ 3. System auto-adjusts Off After to: 8 minutes         │
│ 4. Shows notification: "Off After auto-adjusted"       │
│                                                         │
│ Constraint Messages:                                    │
│ ⚠️ "Off After (15 min) must be less than Run Every     │
│    (10 min). Auto-adjusted to 8 minutes."              │
│                                                         │
│ ✅ "Configuration valid. Device will run for 8 minutes │
│    every 10 minutes (80% duty cycle)."                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🕒 Daily Time Range Control

### Time Range Configuration

```
┌─────────────────────────────────────────────────────────┐
│ 🕒 Daily Time Range Control                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Start Time:                                             │
│ Hour:   [01 ▼]    Minute: [15 ▼]                       │
│ Result: 01:15 (1:15 AM)                                │
│                                                         │
│ End Time:                                               │
│ Hour:   [23 ▼]    Minute: [45 ▼]                       │
│ Result: 23:45 (11:45 PM)                               │
│                                                         │
│ 📊 Schedule Summary:                                    │
│ ├─ Active Window: 01:15 - 23:45 (22h 30m daily)        │
│ ├─ Inactive Window: 23:45 - 01:15 (1h 30m daily)       │
│ └─ Mode: Normal time range (start < end)               │
│                                                         │
│ 📅 Daily Pattern:                                       │
│ 00:00 ▁▁▁▁▁████████████████████████████████████▁▁▁ 24:00│
│       ^1:15                                    ^23:45  │
│                                                         │
│ Legend: ████ = Active  ▁▁▁ = Inactive                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Overnight Time Range

```
┌─────────────────────────────────────────────────────────┐
│ 🌙 Overnight Time Range Example                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Start Time: 22:00 (10:00 PM)                           │
│ End Time:   06:00 (6:00 AM)                            │
│                                                         │
│ 📊 Schedule Summary:                                    │
│ ├─ Active Window: 22:00 - 06:00 (8 hours overnight)    │
│ ├─ Inactive Window: 06:00 - 22:00 (16 hours daily)     │
│ └─ Mode: Overnight range (start > end)                 │
│                                                         │
│ 📅 Daily Pattern:                                       │
│ 00:00 ████████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████████ 24:00│
│             ^6:00                        ^22:00        │
│                                                         │
│ 💡 Perfect for: Security lighting, pool pumps,         │
│    overnight ventilation, heating systems              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Time Selection Interface

```
Hour Selection Dropdown:
┌─────────────────────────────────────────────────────────┐
│ Hour: [01 ▼]                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 00 (12:00 AM)    01 (1:00 AM) ✓   02 (2:00 AM)     │ │
│ │ 03 (3:00 AM)     04 (4:00 AM)     05 (5:00 AM)     │ │
│ │ 06 (6:00 AM)     07 (7:00 AM)     08 (8:00 AM)     │ │
│ │ 09 (9:00 AM)     10 (10:00 AM)    11 (11:00 AM)    │ │
│ │ 12 (12:00 PM)    13 (1:00 PM)     14 (2:00 PM)     │ │
│ │ 15 (3:00 PM)     16 (4:00 PM)     17 (5:00 PM)     │ │
│ │ 18 (6:00 PM)     19 (7:00 PM)     20 (8:00 PM)     │ │
│ │ 21 (9:00 PM)     22 (10:00 PM)    23 (11:00 PM)    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Minute Selection Dropdown:
┌─────────────────────────────────────────────────────────┐
│ Minute: [15 ▼]                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 00    01    02    03    04    05    06    07    08  │ │
│ │ 09    10    11    12    13    14    15 ✓   16    17  │ │
│ │ 18    19    20    21    22    23    24    25    26  │ │
│ │ ... (continues through 59)                          │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🌡️ Hot Time Configuration

### Hot Time Slider Interface

```
┌─────────────────────────────────────────────────────────┐
│ 🌡️ Hot Time Hours Configuration (Max 4)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Only available when Randomization is enabled.          │
│                                                         │
│ Hot Time Duration: 2 hours                             │
│                                                         │
│ 0h ●───────●───────●───────● 4h                        │
│    │       │       │       │                           │
│    0       1       2 ✓     3                           │
│                                                         │
│ Slider marks at: 0h, 1h, 2h, 3h, 4h                   │
│ Current selection: 2 hours                             │
│                                                         │
│ 📋 Hot Time Behavior:                                   │
│ ├─ During hot time: Reduced randomization              │
│ ├─ More frequent cycles                                 │
│ ├─ Ideal for peak demand periods                       │
│ └─ Automatically calculated timing                      │
│                                                         │
│ 💡 Example: With 2-hour hot time starting at 2 PM     │
│    14:00-16:00: Increased activity period              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Hot Time Behavior Visualization

```
┌─────────────────────────────────────────────────────────┐
│ 🌡️ Hot Time Effect on Randomized Schedule              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Normal Period (Random intervals):                      │
│ 12:00 ███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 12:35                      │
│ 12:35 ████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 13:15                   │
│                                                         │
│ Hot Time Period (More frequent):                       │
│ 14:00 ████▁▁▁▁▁▁▁▁▁▁ 14:15                              │
│ 14:15 ███▁▁▁▁▁▁▁▁▁▁▁ 14:28                              │
│ 14:28 ████▁▁▁▁▁▁▁▁▁▁ 14:42                              │
│ 14:42 ███▁▁▁▁▁▁▁▁▁▁▁ 14:55                              │
│ 14:55 ████▁▁▁▁▁▁▁▁▁▁ 15:10                              │
│ ... (continues until 16:00)                            │
│                                                         │
│ Back to Normal Period:                                  │
│ 16:00 ███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ 16:40                    │
│                                                         │
│ 📊 Effect: 3x more activity during hot time            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📅 Date Range Control

### Date Range Enable/Disable

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Optional Date Range Control                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ☑️ Enable Date Range                                    │
│ ├─ When enabled: Schedule only active during date range│
│ ├─ When disabled: Schedule active year-round           │
│ └─ Useful for seasonal schedules                       │
│                                                         │
│ ☐ Active Outside Date Range                            │
│ ├─ Only available when Date Range is enabled           │
│ ├─ Inverts the date range logic                        │
│ └─ Active EXCEPT during specified dates                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Date Range Picker

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Date Range Selection                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Date Range Picker (Summer Irrigation Season):          │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │     March 2024           -         September 2024   │ │
│ │ ┌─────────────────┐       ┌─────────────────────┐   │ │
│ │ │ S  M  T  W  T  F  S │       │ S  M  T  W  T  F  S │   │ │
│ │ │ 1  2  3  4  5  6  7 │       │ 1  2  3  4  5  6  7 │   │ │
│ │ │ 8  9 10 11 12 13 14 │       │ 8  9 10 11 12 13 14 │   │ │
│ │ │15 16 17 18 19 20 21 │       │15 16 17 18 19 20 21 │   │ │
│ │ │22 23 24 25 26 27 28 │       │22 23 24 25 26 27 28 │   │ │
│ │ │29 30 31    [15] ✓   │       │29 30    [30] ✓       │   │ │
│ │ └─────────────────┘       └─────────────────────┘   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Selected Range: March 15, 2024 - September 30, 2024    │
│ Duration: 199 days (6.5 months)                        │
│                                                         │
│ Quick Presets:                                          │
│ [Spring] [Summer] [Fall] [Winter] [Custom] [Year-Round] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Date Range Examples

```
┌─────────────────────────────────────────────────────────┐
│ 📅 Common Date Range Scenarios                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Summer Irrigation:                                      │
│ ├─ Range: May 1 - September 30                         │
│ ├─ Active: During summer months only                   │
│ └─ Use: Lawn sprinklers, garden irrigation             │
│                                                         │
│ Winter Heating:                                         │
│ ├─ Range: October 15 - April 15                        │
│ ├─ Active: During cold season                          │
│ └─ Use: Greenhouse heaters, pipe freeze protection     │
│                                                         │
│ Holiday Lighting:                                       │
│ ├─ Range: November 25 - January 10                     │
│ ├─ Active: Holiday season only                         │
│ └─ Use: Christmas lights, decorative displays          │
│                                                         │
│ Vacation Mode (Inverted):                              │
│ ├─ Range: July 1 - July 14                            │
│ ├─ Active Outside Range: ✅ Enabled                     │
│ ├─ Result: Disabled ONLY during vacation               │
│ └─ Use: Security systems, plant watering               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ⏰ Manual Override Time Control

### Override Time Configuration

```
┌─────────────────────────────────────────────────────────┐
│ ⏰ Manual Override Time Control                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Override Time: [15 minutes ▼]                          │
│ ├─ Duration for manual override operations             │
│ ├─ Applied when using manual Start/Stop controls       │
│ └─ Returns to normal schedule after timeout            │
│                                                         │
│ Available Options:                                      │
│ • None (immediate return to schedule)                  │
│ • 2-30 seconds (quick tests)                           │
│ • 1-60 minutes (normal overrides)                      │
│ • 1-4 hours (extended overrides)                       │
│                                                         │
│ Selected: 15 minutes                                    │
│ ├─ Manual controls active for 15 minutes               │
│ ├─ After 15 minutes: Resume normal schedule            │
│ └─ Can be cancelled early by user                      │
│                                                         │
│ 💡 Use Cases:                                           │
│ • Testing new installations                             │
│ • Emergency manual operation                           │
│ • Maintenance and troubleshooting                      │
│ • Guest overrides for lighting/comfort                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Override Options List

```
┌─────────────────────────────────────────────────────────┐
│ ⏰ Override Time - Complete Options                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ No Override:                                            │
│ • none - Immediate return to schedule                  │
│                                                         │
│ Quick Test (Seconds):                                   │
│ • 02-06 seconds  • 10-30 seconds                       │
│                                                         │
│ Standard Override (Minutes):                            │
│ • 1-6 minutes    • 8, 10-13 minutes                    │
│ • 15, 17, 20 min • 30, 40 minutes                      │
│ • 1 hour (60 minutes)                                  │
│                                                         │
│ Extended Override (Hours):                              │
│ • 2 hours        • 2.5 hours                           │
│ • 3 hours        • 3.5 hours                           │
│ • 4 hours        • Maximum duration                    │
│                                                         │
│ 📊 Usage Statistics:                                    │
│ Most common: 15 minutes (42% of users)                 │
│ Quick test: 30 seconds (28% of users)                  │
│ Extended: 1 hour (18% of users)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 Hardware GPIO Pin Configuration

### GPIO Pin Selection

```
┌─────────────────────────────────────────────────────────┐
│ 🔌 Hardware GPIO Pin Configuration                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Control Pin: [GPIO 21 ▼]                               │
│ ├─ Physical output pin for relay/device control        │
│ ├─ Cannot be changed while schedule is enabled         │
│ └─ Disable schedule first to change pin                │
│                                                         │
│ Available GPIO Pins:                                    │
│ • GPIO 0  (Boot button - use with caution)             │
│ • GPIO 4  (Safe for general use)                       │
│ • GPIO 5  (Safe for general use) ✓ Recommended         │
│ • GPIO 12 (Safe for general use)                       │
│ • GPIO 13 (Safe for general use)                       │
│ • GPIO 14 (Safe for general use)                       │
│ • GPIO 18 (Safe for general use) ✓ Recommended         │
│ • GPIO 19 (Safe for general use) ✓ Recommended         │
│ • GPIO 21 (Safe for general use) ✓ Default             │
│                                                         │
│ ⚠️  Pin Usage Warnings:                                 │
│ ├─ GPIO 0: Used for boot mode selection                │
│ ├─ GPIO 2: Built-in LED (may conflict)                 │
│ ├─ GPIO 15: Bootstrap pin (avoid if possible)          │
│ └─ GPIO 16: Special function (RTC wake)                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Pin Configuration States

```
┌─────────────────────────────────────────────────────────┐
│ 🔌 GPIO Pin States & Restrictions                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Schedule Enabled (Pin selection disabled):              │
│ Control Pin: [GPIO 21] 🔒                              │
│ "Disable schedule to change pin assignment"            │
│                                                         │
│ Schedule Disabled (Pin selection enabled):              │
│ Control Pin: [GPIO 21 ▼] 🔓                            │
│ "Pin can be changed safely"                            │
│                                                         │
│ Pin Conflict Warning:                                   │
│ Control Pin: [GPIO 21 ▼] ⚠️                            │
│ "Warning: GPIO 21 is used by Channel 2"               │
│ "Select a different pin to avoid conflicts"            │
│                                                         │
│ Pin Assignment Success:                                 │
│ Control Pin: [GPIO 19 ▼] ✅                            │
│ "GPIO 19 assigned successfully"                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 💾 Configuration Management

### Save and Validation Process

```
┌─────────────────────────────────────────────────────────┐
│ 💾 Configuration Save Process                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Pre-Save Validation:                                    │
│ ✅ Channel name provided (3-50 characters)              │
│ ✅ GPIO pin selected and available                      │
│ ✅ Schedule timing constraints met                      │
│ ✅ Date range valid (if enabled)                       │
│ ✅ At least one day selected                           │
│                                                         │
│ Save Process:                                           │
│ 1. [💾 Save Schedule] ← Click button                    │
│ 2. [⏳ Saving...] ← Validation in progress              │
│ 3. [📡 Uploading...] ← Sending to device               │
│ 4. [✅ Saved Successfully!] ← Confirmation              │
│                                                         │
│ Success Actions:                                        │
│ • Configuration stored to device                       │
│ • Schedule activated (if enabled)                      │
│ • Return to status dashboard                           │
│ • Show success notification                            │
│                                                         │
│ Error Handling:                                         │
│ • [❌ Save Failed - Retry] ← Button state on error     │
│ • Display specific error message                       │
│ • Maintain form data for correction                    │
│ • Highlight problematic fields                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Common Validation Errors

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️  Common Configuration Errors                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Timing Constraint Violation:                           │
│ ❌ "Off After (30 min) must be less than Run Every     │
│    (20 min). Please adjust timing values."             │
│                                                         │
│ No Active Days Selected:                               │
│ ❌ "Please select at least one active day for the      │
│    schedule to function."                              │
│                                                         │
│ Invalid Date Range:                                     │
│ ❌ "End date must be after start date. Please check    │
│    your date range selection."                         │
│                                                         │
│ GPIO Pin Conflict:                                      │
│ ❌ "GPIO 21 is already used by Channel 2. Please       │
│    select a different pin."                            │
│                                                         │
│ Network Communication Error:                            │
│ ❌ "Unable to save configuration. Check device          │
│    connection and try again."                          │
│                                                         │
│ Channel Name Requirements:                              │
│ ❌ "Channel name must be 3-50 characters long and      │
│    contain only letters, numbers, and spaces."         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Configuration Summary

### Summary View Before Save

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Configuration Summary - Water Pump XP               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 📋 Basic Settings:                                      │
│ ├─ Name: Water Pump XP                                 │
│ ├─ Schedule: ✅ Enabled                                 │
│ └─ GPIO Pin: 21                                        │
│                                                         │
│ 🏠 Home Assistant:                                      │
│ ├─ Entity: switch.water_pump_xp                        │
│ ├─ Icon: 🚰 water-pump                                 │
│ └─ Auto-Discovery: ✅ Enabled                           │
│                                                         │
│ 🔄 Schedule Configuration:                              │
│ ├─ Mode: Interval Scheduling                           │
│ ├─ Frequency: Every 5 seconds                          │
│ ├─ Duration: 2 seconds per cycle                       │
│ ├─ Duty Cycle: 40% (2s on, 3s off)                    │
│ └─ Daily Cycles: ~17,280 cycles                        │
│                                                         │
│ 📅 Active Schedule:                                     │
│ ├─ Days: Mon, Tue, Wed, Fri, Sat, Sun (6 days)        │
│ ├─ Time Window: 01:15 - 23:45 (22h 30m daily)         │
│ ├─ Date Range: Year-round                              │
│ └─ Override Time: 15 minutes                           │
│                                                         │
│ ⚙️  Advanced Options:                                   │
│ ├─ Randomization: ❌ Disabled                           │
│ ├─ Time Span Mode: ❌ Disabled                          │
│ └─ Minimum Run Time: ❌ Not applicable                  │
│                                                         │
│ [🔙 Edit Configuration]              [💾 Save & Apply] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Next: [🏠 Home Assistant Integration](home-assistant.md)**