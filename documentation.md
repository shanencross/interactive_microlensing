## Modules

<dl>
<dt><a href="#module_almost-equals">almost-equals</a></dt>
<dd><p>Almost Equals.
Function that checks if two numbers are almost equal.</p>
</dd>
<dt><a href="#module_bin-ima">bin-ima</a></dt>
<dd><p>Binary image modules.
Calculates binary image parameters for a particular source position.</p>
</dd>
<dt><a href="#module_bin-len-faster">bin-len-faster</a></dt>
<dd><p>Binary lens module.
Calculates binary image parameters for a range of source positions.</p>
</dd>
<dt><a href="#module_ellipse">ellipse</a></dt>
<dd><p>Ellipse.
Draw an ellipse (but don&#39;t actually perform the stroke or fill) on a
Canvas element.
Unlike the native JS ellipse ellipse function,
this is compatible with Firefox.</p>
</dd>
<dt><a href="#module_handle-error">handle-error</a></dt>
<dd><p>Error handler module.
Handles exceptions.</p>
<p>Needed to handle exceptions raised when trying to load
a module that is not present.</p>
</dd>
<dt><a href="#module_Lens">Lens</a></dt>
<dd><p>Module containing Lens class
Class represents lens object, including pixel location and radius, and
ring radius</p>
</dd>
<dt><a href="#module_main">main</a></dt>
<dd><p>Main module.
Main module for interactive microlensing simulator.</p>
</dd>
<dt><a href="#module_psbl-microlensing-event">psbl-microlensing-event</a></dt>
<dd><p>Event module.
Handles calculation and drawing lightcurve plot for the microlensing.
event.</p>
<p>Depicts magnification vs. time curve for microlensing event.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_psbl-microlensing-event-animation">psbl-microlensing-event-animation</a></dt>
<dd><p>Animation module.
Handles animated playback of microlensing event.</p>
</dd>
<dt><a href="#module_psbl-microlensing-event-lens-plane">psbl-microlensing-event-lens-plane</a></dt>
<dd><p>Lens Plane Module.
Handles calculation and drawing of the lens plane plot for the microlensing
event.</p>
<p>Depicts the source&#39;s path across the sky when the lenses are held fixed.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_utils">utils</a></dt>
<dd><p>Uitilities module.
Miscellaneous helper functions.</p>
</dd>
</dl>

<a name="module_almost-equals"></a>

## almost-equals
Almost Equals.Function that checks if two numbers are almost equal.

<a name="module_bin-ima"></a>

## bin-ima
Binary image modules.Calculates binary image parameters for a particular source position.


* [bin-ima](#module_bin-ima)
    * [~bin_ima()](#module_bin-ima..bin_ima)
    * [~compareComplexNumToZero()](#module_bin-ima..compareComplexNumToZero)

<a name="module_bin-ima..bin_ima"></a>

### bin-ima~bin_ima()
bin_ima

**Kind**: inner method of [<code>bin-ima</code>](#module_bin-ima)  
<a name="module_bin-ima..compareComplexNumToZero"></a>

### bin-ima~compareComplexNumToZero()
compareComplexNumToZero

**Kind**: inner method of [<code>bin-ima</code>](#module_bin-ima)  
<a name="module_bin-len-faster"></a>

## bin-len-faster
Binary lens module.Calculates binary image parameters for a range of source positions.


* [bin-len-faster](#module_bin-len-faster)
    * [~plot_binary()](#module_bin-len-faster..plot_binary)
    * [~findCausticAndCritCurves()](#module_bin-len-faster..findCausticAndCritCurves)

<a name="module_bin-len-faster..plot_binary"></a>

### bin-len-faster~plot_binary()
plot_binary

**Kind**: inner method of [<code>bin-len-faster</code>](#module_bin-len-faster)  
<a name="module_bin-len-faster..findCausticAndCritCurves"></a>

### bin-len-faster~findCausticAndCritCurves()
findCausticAndCritCurves

**Kind**: inner method of [<code>bin-len-faster</code>](#module_bin-len-faster)  
<a name="module_ellipse"></a>

## ellipse
Ellipse.Draw an ellipse (but don't actually perform the stroke or fill) on aCanvas element.Unlike the native JS ellipse ellipse function,this is compatible with Firefox.

<a name="module_handle-error"></a>

## handle-error
Error handler module.Handles exceptions.Needed to handle exceptions raised when trying to loada module that is not present.

<a name="exp_module_handle-error--module.exports"></a>

### module.exports() ⏏
handle

**Kind**: Exported function  
<a name="module_Lens"></a>

## Lens
Module containing Lens classClass represents lens object, including pixel location and radius, andring radius


* [Lens](#module_Lens)
    * [~Lens](#module_Lens..Lens)
        * [new Lens()](#new_module_Lens..Lens_new)

<a name="module_Lens..Lens"></a>

### Lens~Lens
**Kind**: inner class of [<code>Lens</code>](#module_Lens)  
<a name="new_module_Lens..Lens_new"></a>

#### new Lens()
Lens classRepresents lens object, including pixel location and radius, and ring radius

<a name="module_main"></a>

## main
Main module.Main module for interactive microlensing simulator.

<a name="module_main..init"></a>

### main~init()
init

**Kind**: inner method of [<code>main</code>](#module_main)  
<a name="module_psbl-microlensing-event"></a>

## psbl-microlensing-event
Event module.Handles calculation and drawing lightcurve plot for the microlensing.event.Depicts magnification vs. time curve for microlensing event.Also listens for events from related UI buttons/sliders.


* [psbl-microlensing-event](#module_psbl-microlensing-event)
    * [~init()](#module_psbl-microlensing-event..init)
    * [~initListeners()](#module_psbl-microlensing-event..initListeners)
    * [~initParams()](#module_psbl-microlensing-event..initParams)
    * [~updateDerivedQuantities()](#module_psbl-microlensing-event..updateDerivedQuantities)
    * [~updateU0()](#module_psbl-microlensing-event..updateU0)
    * [~updateThetaY()](#module_psbl-microlensing-event..updateThetaY)
    * [~updateDrel()](#module_psbl-microlensing-event..updateDrel)
    * [~updateThetaE()](#module_psbl-microlensing-event..updateThetaE)
    * [~calculateThetaE()](#module_psbl-microlensing-event..calculateThetaE)
    * [~updateTE()](#module_psbl-microlensing-event..updateTE)
    * [~updateSliderReadout()](#module_psbl-microlensing-event..updateSliderReadout)
    * [~updateSliders()](#module_psbl-microlensing-event..updateSliders)
    * [~resetParams()](#module_psbl-microlensing-event..resetParams)
    * [~updateParam()](#module_psbl-microlensing-event..updateParam)
    * [~redrawCanvases()](#module_psbl-microlensing-event..redrawCanvases)
    * [~updateGraph()](#module_psbl-microlensing-event..updateGraph)
    * [~updateGridRange()](#module_psbl-microlensing-event..updateGridRange)
    * [~clearGraph()](#module_psbl-microlensing-event..clearGraph)
    * [~xDayToPixel()](#module_psbl-microlensing-event..xDayToPixel)
    * [~yMagnifToPixel()](#module_psbl-microlensing-event..yMagnifToPixel)
    * [~drawAxes()](#module_psbl-microlensing-event..drawAxes)
    * [~drawAxisLabels()](#module_psbl-microlensing-event..drawAxisLabels)
    * [~updatePlotScaleAndRange()](#module_psbl-microlensing-event..updatePlotScaleAndRange)
    * [~initPlot()](#module_psbl-microlensing-event..initPlot)
    * [~plotLightcurve()](#module_psbl-microlensing-event..plotLightcurve)
    * [~plotLightcurveAlone()](#module_psbl-microlensing-event..plotLightcurveAlone)
    * [~getThetaX()](#module_psbl-microlensing-event..getThetaX)
    * [~updateCurveData()](#module_psbl-microlensing-event..updateCurveData)
    * [~getTimeTerm()](#module_psbl-microlensing-event..getTimeTerm)
    * [~getU()](#module_psbl-microlensing-event..getU)
    * [~getMagnifFromU()](#module_psbl-microlensing-event..getMagnifFromU)
    * [~getMagnif()](#module_psbl-microlensing-event..getMagnif)

<a name="module_psbl-microlensing-event..init"></a>

### psbl-microlensing-event~init()
init

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..initListeners"></a>

### psbl-microlensing-event~initListeners()
initListeners

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..initParams"></a>

### psbl-microlensing-event~initParams()
initParams

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateDerivedQuantities"></a>

### psbl-microlensing-event~updateDerivedQuantities()
updateDerivedQuantities

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateU0"></a>

### psbl-microlensing-event~updateU0()
updateU0

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateThetaY"></a>

### psbl-microlensing-event~updateThetaY()
updateThetaY

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateDrel"></a>

### psbl-microlensing-event~updateDrel()
updateDrel

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateThetaE"></a>

### psbl-microlensing-event~updateThetaE()
updateThetaE

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..calculateThetaE"></a>

### psbl-microlensing-event~calculateThetaE()
calculateThetaE

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateTE"></a>

### psbl-microlensing-event~updateTE()
updateTE

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateSliderReadout"></a>

### psbl-microlensing-event~updateSliderReadout()
updateSliderReadout

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateSliders"></a>

### psbl-microlensing-event~updateSliders()
updateSliders

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..resetParams"></a>

### psbl-microlensing-event~resetParams()
resetParams

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateParam"></a>

### psbl-microlensing-event~updateParam()
updateParam

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..redrawCanvases"></a>

### psbl-microlensing-event~redrawCanvases()
redrawCanvases

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateGraph"></a>

### psbl-microlensing-event~updateGraph()
updateGraph

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateGridRange"></a>

### psbl-microlensing-event~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..clearGraph"></a>

### psbl-microlensing-event~clearGraph()
clearGraph

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..xDayToPixel"></a>

### psbl-microlensing-event~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..yMagnifToPixel"></a>

### psbl-microlensing-event~yMagnifToPixel()
yMagnifToPixel

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..drawAxes"></a>

### psbl-microlensing-event~drawAxes()
drawAxes

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..drawAxisLabels"></a>

### psbl-microlensing-event~drawAxisLabels()
drawAxisLabels

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updatePlotScaleAndRange"></a>

### psbl-microlensing-event~updatePlotScaleAndRange()
updatePlotScaleAndRange

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..initPlot"></a>

### psbl-microlensing-event~initPlot()
initPlot

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..plotLightcurve"></a>

### psbl-microlensing-event~plotLightcurve()
plotLightcurve

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..plotLightcurveAlone"></a>

### psbl-microlensing-event~plotLightcurveAlone()
plotLightcurveAlone

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..getThetaX"></a>

### psbl-microlensing-event~getThetaX()
getThetaX

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..updateCurveData"></a>

### psbl-microlensing-event~updateCurveData()
updateCurveData

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..getTimeTerm"></a>

### psbl-microlensing-event~getTimeTerm()
getTimeTerm

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..getU"></a>

### psbl-microlensing-event~getU()
getU

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..getMagnifFromU"></a>

### psbl-microlensing-event~getMagnifFromU()
getMagnifFromU

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event..getMagnif"></a>

### psbl-microlensing-event~getMagnif()
getMagnif

**Kind**: inner method of [<code>psbl-microlensing-event</code>](#module_psbl-microlensing-event)  
<a name="module_psbl-microlensing-event-animation"></a>

## psbl-microlensing-event-animation
Animation module.Handles animated playback of microlensing event.


* [psbl-microlensing-event-animation](#module_psbl-microlensing-event-animation)
    * [~init()](#module_psbl-microlensing-event-animation..init)
    * [~updateMinAndMaxTimes()](#module_psbl-microlensing-event-animation..updateMinAndMaxTimes)
    * [~initListeners()](#module_psbl-microlensing-event-animation..initListeners)
    * [~run()](#module_psbl-microlensing-event-animation..run)
    * [~updateTime()](#module_psbl-microlensing-event-animation..updateTime)
    * [~animateFrame()](#module_psbl-microlensing-event-animation..animateFrame)
    * [~animateFrameSource()](#module_psbl-microlensing-event-animation..animateFrameSource)
    * [~updatePlayback()](#module_psbl-microlensing-event-animation..updatePlayback)

<a name="module_psbl-microlensing-event-animation..init"></a>

### psbl-microlensing-event-animation~init()
init

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..updateMinAndMaxTimes"></a>

### psbl-microlensing-event-animation~updateMinAndMaxTimes()
updateMinAndMaxTimes

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..initListeners"></a>

### psbl-microlensing-event-animation~initListeners()
initListeners

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..run"></a>

### psbl-microlensing-event-animation~run()
run

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..updateTime"></a>

### psbl-microlensing-event-animation~updateTime()
updateTime

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..animateFrame"></a>

### psbl-microlensing-event-animation~animateFrame()
animateFrame

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..animateFrameSource"></a>

### psbl-microlensing-event-animation~animateFrameSource()
animateFrameSource

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-animation..updatePlayback"></a>

### psbl-microlensing-event-animation~updatePlayback()
updatePlayback

**Kind**: inner method of [<code>psbl-microlensing-event-animation</code>](#module_psbl-microlensing-event-animation)  
<a name="module_psbl-microlensing-event-lens-plane"></a>

## psbl-microlensing-event-lens-plane
Lens Plane Module.Handles calculation and drawing of the lens plane plot for the microlensingevent.Depicts the source's path across the sky when the lenses are held fixed.Also listens for events from related UI buttons/sliders.


* [psbl-microlensing-event-lens-plane](#module_psbl-microlensing-event-lens-plane)
    * [~drawing](#module_psbl-microlensing-event-lens-plane..drawing)
    * [~init()](#module_psbl-microlensing-event-lens-plane..init)
    * [~initListeners()](#module_psbl-microlensing-event-lens-plane..initListeners)
    * [~initCheckboxes()](#module_psbl-microlensing-event-lens-plane..initCheckboxes)
    * [~initSliders()](#module_psbl-microlensing-event-lens-plane..initSliders)
    * [~initLenses()](#module_psbl-microlensing-event-lens-plane..initLenses)
    * [~initSourceRadius()](#module_psbl-microlensing-event-lens-plane..initSourceRadius)
    * [~updateSourceRadiusSlider()](#module_psbl-microlensing-event-lens-plane..updateSourceRadiusSlider)
    * [~updateSourceRadius()](#module_psbl-microlensing-event-lens-plane..updateSourceRadius)
    * [~initSourcePos()](#module_psbl-microlensing-event-lens-plane..initSourcePos)
    * [~redraw()](#module_psbl-microlensing-event-lens-plane..redraw)
    * [~updateScaleAndRangeValues()](#module_psbl-microlensing-event-lens-plane..updateScaleAndRangeValues)
    * [~updateDrawingValues()](#module_psbl-microlensing-event-lens-plane..updateDrawingValues)
    * [~thetaXtoPixel()](#module_psbl-microlensing-event-lens-plane..thetaXtoPixel)
    * [~xDayToPixel()](#module_psbl-microlensing-event-lens-plane..xDayToPixel)
    * [~thetaYtoPixel()](#module_psbl-microlensing-event-lens-plane..thetaYtoPixel)
    * [~getThetaX()](#module_psbl-microlensing-event-lens-plane..getThetaX)
    * [~getThetaYpathValue()](#module_psbl-microlensing-event-lens-plane..getThetaYpathValue)
    * [~updateGridRange()](#module_psbl-microlensing-event-lens-plane..updateGridRange)
    * [~xDayToThetaX()](#module_psbl-microlensing-event-lens-plane..xDayToThetaX)

<a name="module_psbl-microlensing-event-lens-plane..drawing"></a>

### psbl-microlensing-event-lens-plane~drawing
drawing

**Kind**: inner property of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..init"></a>

### psbl-microlensing-event-lens-plane~init()
init

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initListeners"></a>

### psbl-microlensing-event-lens-plane~initListeners()
initListeners

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initCheckboxes"></a>

### psbl-microlensing-event-lens-plane~initCheckboxes()
initCheckboxes()

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initSliders"></a>

### psbl-microlensing-event-lens-plane~initSliders()
initSliders

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initLenses"></a>

### psbl-microlensing-event-lens-plane~initLenses()
initLenses

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initSourceRadius"></a>

### psbl-microlensing-event-lens-plane~initSourceRadius()
initSourceRadius

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..updateSourceRadiusSlider"></a>

### psbl-microlensing-event-lens-plane~updateSourceRadiusSlider()
updateSourceRadiusSlider

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..updateSourceRadius"></a>

### psbl-microlensing-event-lens-plane~updateSourceRadius()
updateSourceRadius

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..initSourcePos"></a>

### psbl-microlensing-event-lens-plane~initSourcePos()
initSourcePos

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..redraw"></a>

### psbl-microlensing-event-lens-plane~redraw()
redraw

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..updateScaleAndRangeValues"></a>

### psbl-microlensing-event-lens-plane~updateScaleAndRangeValues()
updateScaleAndRangeValues

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..updateDrawingValues"></a>

### psbl-microlensing-event-lens-plane~updateDrawingValues()
updateDrawingValues

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..thetaXtoPixel"></a>

### psbl-microlensing-event-lens-plane~thetaXtoPixel()
thetaXtoPixel

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..xDayToPixel"></a>

### psbl-microlensing-event-lens-plane~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..thetaYtoPixel"></a>

### psbl-microlensing-event-lens-plane~thetaYtoPixel()
thetaYtoPixel

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..getThetaX"></a>

### psbl-microlensing-event-lens-plane~getThetaX()
getThetaX

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..getThetaYpathValue"></a>

### psbl-microlensing-event-lens-plane~getThetaYpathValue()
getThetaYpathValue

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..updateGridRange"></a>

### psbl-microlensing-event-lens-plane~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_psbl-microlensing-event-lens-plane..xDayToThetaX"></a>

### psbl-microlensing-event-lens-plane~xDayToThetaX()
xDayToThetaX

**Kind**: inner method of [<code>psbl-microlensing-event-lens-plane</code>](#module_psbl-microlensing-event-lens-plane)  
<a name="module_utils"></a>

## utils
Uitilities module.Miscellaneous helper functions.

