# PixelDiffusion
 2D pixel diffusion using global automaton on the GPU

# Feature
## Drawing
We would like to support GPU drawing selecting from multiple field (1-3?). Teh drawing should work as in the CPU prototype:
- Clicking the mouse on a not already occupied pixel should trigget adding the pixels which are within radius from the mouse position.
- Clicling the mouse on an already occupied pixel in the current field to behave like drawing, but instead we will not be erasing.
- Dragging should keep drawing/erasing circles, but adding the line interpolation as from the GODOT and shader toy example would be very cool.
- The active drawing field should be selected by clicking on their corresponding button (drop down menu?).
- I have a special treatment of the boundaries when PBC is not turned on, where the state of the boudnary is guaranteed to stay unchanged during the simulation. Meaning if a boundary pixel is drawn to be set, it will remain set throughout the simulation. And if it is false it can never be filled during the simulation.

## Simulation Control
We would like to set certain parameters for the simulation:
- Since we will be using a gaussian blur for now we should be able to set its range (the N*N pixels) as well as the sigma (smoothing factor)
- Set the global temperature
- Set the self interaction strength for each field independently
- Set the cross field interaction strength for each field independently
- PBC (toggle periodic boundary conditions, snake2 and packman asteroids you get the idea, go out on one side come in on the other)
- Gravity (a fun addition but currently very unphysical)
- Apply Blur (single step in simulation) --> renders the blur
- Add random rolls (single step simulation) --> renders the blur+random rolls
- Calculate Cross interactions (single step simulation) --> renders the effective fields
- Discretize (single step simulation) --> renders the discretized fields
- Simulte fulls step (single step simulation) --> renders the discretized fields

## Simulation
The goal of the simulation is to perform a sort of game of life automaton simulation. However, the update step goes as follows:
1) Record the current N drawn pixels in the relative fields (the amount of particles per field).
2) Blur each field independently using the gaussian smearing. The gaussian smearing should be normalized so the summed field value after blurring is N.
   - Currently gravity is a dirty hack which biases the gaussian smearing downwards in a linear fashion.  
4) Add random noise (0-1)*Temperature to each effective field.
5) Calculate field interactions. We combine the blurred fields using some weighted average. Assuming 2 fields this can be expressed as: 
```
selfinteractionA\*blurredFieldA + crossinteractionAB\*blurredFieldB = effectiveFieldA (we can optionally noramlize the field by dividing by selfinteractionA+crossinteractionAB)
selfinteractionB\*blurredFieldB + crossinteractionBA\*blurredFieldA = effectiveFieldB (we can optionally noramlize the field by dividing by selfinteractionB+crossinteractionBA)
```
Normalization is optional for it doesnt matter for the sorting, however, it might help with the rendering logic if we make sure our floats in the buffers are always between 0 and 1.

5) Discretize the field by sorting them on the GPU and picking the N respective highest pixel positions for each field.
6) Render the discretized fields (in the cpu example I render the blurred fields, but we can choose this depending on what looks better).
