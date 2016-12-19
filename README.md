# Sideral JS

[![Stories in Ready](https://badge.waffle.io/js-republic/sideral.png?label=ready&title=Ready)](https://waffle.io/js-republic/sideral) [![Build Status](https://travis-ci.org/js-republic/sideral.svg?branch=master)](https://travis-ci.org/js-republic/sideral) [![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badge/) [![License: GPL v3](https://img.shields.io/badge/license-GPL--V3-blue.svg)](https://www.gnu.org/licenses/quick-guide-gplv3.fr.html) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

:rocket::construction: Project in construction :construction::rocket:

Sideral JS is the next generation of video-game framework with JavaScript. This framework is made to create a more complexe 2D game with all features needed like HUD, Event Manager, Map Editor, Quest manager, etc.
It also provide complete library to make your game online.

## What is inside this framework ?

 - A fast and lightweight library to build easily a complete game. It will embark all feature needed like HUD, Event, Map, Character, Input, etc.
 - A complete map editor to create a platform or a RPG game with a complete event system
 - A big feature to transform your game into a complete MMO with server calculation, data prediction, etc.
 - A new way to build your game with ES6
 
## How does it works ?

More than just a framework, Sideral is a complete workspace with HUB and many features to improve your game development.
It is separate into 3 features :
 - the **library** with all you need to develop your game
 - A second **library** for server side and transform your game into a complete MMO
 - A **map editor** to build your map in WYSIWYG
 - A **hub** which list all your games, and give quick access to all features listed above

## Installation

At this time, it's preferable to use git and clone this repository like this :
```
git clone https://github.com/js-republic/sideral sideral
```
Your folder will be your workspaces to create project.

## Usage

### Core library
This is all the src you need to create your game. The library has theses classes :

#### Scene
A **Scene** is typically a canvas. A game can have multiple **Scenes** and *it must have multiple **Scenes***.

#### Entity
An **Entity** is an object to be render in a **Scene**.

#### Engine
**Engine** is a singleton instance. The aim of this object is to loop and give information about **FPS**

#### Element
an **Element** is the superclass of this library. It provide lifecycle of each element such as **initialize**, **update** and **render** functions.

#### Component
a **Component** is a class which is not inherited from **Element** class because it doesnot have static lifecycle. A component must be composed by an **Element** and add additional instructions into **Element**'s function such as **update** for example.

### HUB

The **HUB** will be your best friend to develop your game. To run it, go into your workspace project and run :
```
yarn start
```
Now you can access to your main hub page at *http://localhost:3000*

With the HUB, you can :
 - See all your games stocked into the **public/games** folder
 - Create an empty game. It will be stocked into the **public/games** folder
 - Access to other features of **Sideral**
 
## Contributing
 
See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute to this project.

## License

SGR project is a licensed under [GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
