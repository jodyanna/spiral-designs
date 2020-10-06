# Spiral Designs v1.2
Create pixelated spirals with this mesmerizing web application.

Live Demo: https://spiral-designs.netlify.app/

# Features
- Adjust spiral dimensions, color, and background color using designated range inputs
- Fullscreen visual display for desktop and mobile devices
- Non-intrusive toolbar for desktop users and discrete button for mobile users

# Technologies
- JavaScript
- CSS 3
- HTML 5

# How It's Made
Spiral animation rendered using the Canvas API at 10 fps (frames per second),
adjusted from the default 60fps by keeping an ongoing count of frames and 
using a modulus division conditional expression.

Each frame, spiral coordinates are calculated using the following equations:

```
x = (width * theta) * cos(theta - frameCount) + offsetX
y = (width * theta) * sin(theta - frameCount) + offsetY  
```

- width: an adjustable parameter for spiral radius
- theta: incremented value limited by spiral length parameter, a.k.a. each point of the spiral
- frameCount: the current frame of animation, makes the spiral spin
- offsetX/Y: offset value for turning canvas into Cartesian plane, depends on user device dimensions

Coordinates are stored in a multidimensional array structure [[x,y], [x1,y2], ...] 
to be iterated over for rendering. This data structure was choose to preserve
order of coordinates (0th element is center, last is tail end) and to keep coordinate
pairs together. 

All toolbar settings are updated before each point is rendered allowing for fluid
adjustment of each parameter in real time.

And that's pretty all there is to it!


# TODO
- Option to animate pen and/or background colors
- Option to change pen shapes (circle, etc...)
- Spiral invert toggle option (+ frameCount to -)
- Random presets on load


# License
MIT License

Copyright (c) 2020 Joseph D'Anna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.