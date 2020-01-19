# SpaceChanger

SpaceChanger is a WebAR utility to help with home renovation. Users can visualize wall, ceiling, and floor texture changes from their AR enabled smartphone.

## Source Code

SpaceChange is open source and hosted on GitHub:

React Native ARKit app for creating rooms (RN-AR branch)
WebXR App For Viewing rooms (master branch)

## Usage

1. Upon launch, users will add SpaceChanger Surfaces to their environment by placing 4 corners to define a surface. 
2. After placement, users can interact with any SpaceChanger Surface by selecting them. Users will be able to see texture/color/paint changes in real-time, and select from textures or paints provided by manufacturers.
3. If in need of inspiration, the color palette selector will allow users to choose from our recommended Color Schemes.
4. Furniture can also be placed in the space, allowing for a complete home renovation experience.
5. Designs can be saved and uploaded to our server for sharing, downloading, and viewing on other devices in XR.

## Development Story

We started by exploring different options for interacting with AR environments including A-Frame/WebXR, MagicScript/MagicLeap. After consulting a few WebXR mentors, we decided to commit to developing a MagicScript experience for the Magic Leap One - with hopes that the javascript and React.js based MagicScript would be a relatively easy-to-build solution.

* Day 1: our hopes were unfortunately dashed by a full day of development hell on Day 1. We spent the entire day trying to get the Hello World MagicScript example to build successfully to the ML headset. 

* Day 2: we discovered that there are 3 different flavors of MagicScript, and only one of them works with React. The majority of Day 2 was spent trying to understand the differences between Immersive, Landscape, and MagicScript Components. After several false starts, we eventually got going to a point where MagicScript could not support what we were trying to do, so we were compelled to abandon MagicScript and start afresh. 

* Day 3: we began afresh with A-Frame, and got a working prototype for placing surfaces and changing their texture. We'd call that a success!

## Development Team

The SpaceChange team includes: 

* 	Cosmo Kramer
* 	Jeffrey Lu
* 	Matt Thompson
* 	Vadim 

##

