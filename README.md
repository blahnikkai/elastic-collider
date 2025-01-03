# Elastic Collider

To draw a rectangle, left-click, move your mouse, and left-click again to finish drawing the rectangle.
Right-click to cancel the drawing action
Right-clicking an existing rectangle will delete it

Use the 4 radio buttons to select what type of rectangle will be drawn.
1. Wall will draw a solid wall that bodies will bounce off of.
2. Spawn bodies will spawn a set of bodies within the bounds of the rectangle you draw. A dropdown will allow you to select the parameters of the bodies.
3. Delete bodies will delete any bodies within the bounds of the rectangle you draw.
4. Measure statistics will draw a persistent measurement zone. The number of bodies within the measurement zone, and the total and mean kinetic energies of those bodies, will be displayed on the right panel.

You can click the 'Generate Brownian Motion' or 'Generate 2nd law of thermodynamics' buttons to generate a pre-built scenario, or add your own walls and bodies to create your own experiments!

## Scientific explanation of the two pre-built scenarios

Brownian Motion is the motion of a particle suspended in a liquid or gas. The atoms or molecules of the gas move freely only changing velocity in collisions with other particles. The larger particle, for example a grain of pollen, will undergo seemingly random movement and vibration as the atoms of the gas - too small to see - collide with the pollen. A higher mean velocity of the gas particles, which is proportional to a higher temperature, will result in more rapid vibration. Experiments with Brownian motion allowed physicists to confirm the atomic model without directly observing them.

The Second Law of Thermodynamics states that the entropy of a closed system will never spontaneously decrease over time. Put simply, this means states will tend toward thermodynamic equilibrium, so thermal energy will flow from hot regions to cool regions, and never the other way around. In our simulation, we can observe that the right chamber, with high velocity particles (high temperature), and the left chamber, with low velocity particles (low temperature), will slowly tend toward an equilibrium with equal mean kinetic energy in both chambers (equal temperatures).

## To run the source code on your own machine

`npm run dev`

## To update the gh-pages

`npm run deploy`
