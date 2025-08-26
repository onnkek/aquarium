<h1 align="center">
  <br>
  <a href="https://github.com/onnkek/aquarium"><img src="https://i.imgur.com/TIpY3Ut.jpeg" alt="Aquarium"></a>
  <br>
  Aquarium
  <br>
</h1>

<h4 align="center">Sensor readings, Equipment states, Fully control.</h4>

<p align="center">
  <a href="#overview">Overview</a>
  •
  <a href="#installation">Installation</a>
</p>

# Overview

Aquarium - web-based management of a smart aquarium. Allows you to fully control all aquarium systems in real time. The main module (Dashboard) is built on the basis of widgets. Each piece of equipment has its own widget

This is the UI/UX of the smart aquarium. The server part on ESP32 is in the [repository](https://github.com/onnkek/aquarium-backend).

**The default set of modules includes:**

- Dashboard (Live display, managment and settings)
- Log viewing system (system, relay, doser)
- Archive viewing system (system readings, sensor readings, equipment states)

**The default set of widgets:**

- System
- Temp: COOL and HEAT relays and PID control
- Relays: CO2, O2, Filter and Light
- ARGB
- Doser: 4 pumps

**The following platforms are supported this UI/UX:**

- Desktop
- Mobile (IOS)

# Installation

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
