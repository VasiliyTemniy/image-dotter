# Image Dotter Usage Guide

## Overview

Image Dotter is a utility tool designed to create styled site logos from images, similar to the Prettier logo style. It transforms regular images into a grid of colored dots/cells that can be customized, animated, and exported for web use.

![BothImages](https://i.imghippo.com/files/CX5901RbA.png)

## Getting Started

### Loading Your Image

1. Click the "Select file" button in the side menu
2. Choose an image file from your computer
3. The image will be displayed in two preview canvases:
   - Input canvas: shows your original image
   - Output canvas: shows the grid preview

[INSERT IMAGE: UI showing file selection and both canvases]

### Basic Layout Controls

You can adjust how the preview areas are displayed using these options:
- Stretch canvas width if image is greater than screen width
- Add horizontal scrollbar if image is wider than screen width
- Fit both canvas in one row
- Shift main area with menu navbar

## Core Parameters

### Grid Base Parameters

These settings determine the fundamental structure of your dot grid:

1. **Rows Count**: Number of horizontal cell rows
2. **Columns Count**: Number of vertical cell columns
3. **Aspect Ratio Mode**:
   - Image: Maintains original image proportions
   - Square: Forces equal rows and columns
   - None: Allows independent row/column adjustment

### Visual Parameters

Customize the appearance of your grid cells:

1. **Border Radius**: Rounds the corners of each cell
2. **Horizontal/Vertical Gap**: Space between cells
3. **Angle**: Rotation angle of cells
4. **Stroke**: Optional border around cells
5. **Ignore Color**: Exclude specific colors from the grid

[INSERT IMAGE: Examples showing different visual parameter combinations]

## Advanced Features

### Generator Parameters

The seed-based generator can transform your grid in various ways:

1. **Cell Span**: Combines adjacent cells
2. **Main Palette**: Applies a custom color palette
3. **Surrounding Cells**: Adds decorative cells around the main grid
   - Height/Depth/Span controls
   - Color variations
   - Alpha (transparency) variations

[INSERT IMAGE: Examples of generator effects]

### Animation Parameters

Add movement to your grid with these options:

1. **Animation Types**:
   - Slide: Cells slide in from sides
   - Appear: Cells fade in
2. **Direction Controls**
3. **Timing Settings**:
   - Duration
   - Delay (min/max)
   - Easing functions

[INSERT ANIMATION: Examples of animation effects]

## Exporting Your Work

You can export your grid in multiple formats:

1. **JSON**: Complete grid data for later use
2. **HTML**: Ready-to-use HTML markup
3. **CSS**: Example stylesheet for grid animations

## Tips and Best Practices

1. Start with a simple image for better results
2. Experiment with the generator seed to find interesting patterns
3. Use preview background options to test against different backgrounds
4. Adjust cell spans for more organic-looking results

[INSERT IMAGE: Examples of good source images and results]

## Troubleshooting

Common issues and solutions:

1. **Image appears distorted**: Check aspect ratio mode
2. **Grid too dense/sparse**: Adjust rows/columns count
3. **Animation not smooth**: Reduce grid complexity or adjust timing
4. **Colors not matching**: Check ignore color settings and color variations