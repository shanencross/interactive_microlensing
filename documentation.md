## Modules

<dl>
<dt><a href="#module_main">main</a></dt>
<dd><p>Main module.
Main module for interactive microlensing simulator.</p>
</dd>
<dt><a href="#module_microlensing_simulation/PSBL_microlensing_event">microlensing_simulation/PSBL_microlensing_event</a></dt>
<dd><p>Event module.
Handles calculation and drawing lightcurve plot for the microlensing.
event.</p>
<p>Depicts magnification vs. time curve for microlensing event.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_microlensing_simulation/PSBL_microlensing_event_animation">microlensing_simulation/PSBL_microlensing_event_animation</a></dt>
<dd><p>Animation module.
Handles animated playback of microlensing event.</p>
</dd>
<dt><a href="#module_microlensing_simulation/PSBL_microlensing_event_lens_plane">microlensing_simulation/PSBL_microlensing_event_lens_plane</a></dt>
<dd><p>Lens Plane Module.
Handles calculation and drawing of the lens plane plot for the microlensing
event.</p>
<p>Depicts the source&#39;s path across the sky when the lenses are held fixed.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_utils/errorHandler">utils/errorHandler</a></dt>
<dd><p>Error handler module.
Handles exceptions.</p>
<p>Needed to handle exceptions raised when trying to load
a module that is not present.</p>
</dd>
<dt><a href="#module_microlensing_simulation/binary_calculation/bin_ima">microlensing_simulation/binary_calculation/bin_ima</a></dt>
<dd><p>Binary image modules.
Calculates binary image parameters for a particular source position.</p>
</dd>
<dt><a href="#module_microlensing_simulation/binary_calculation/bin_len_faster">microlensing_simulation/binary_calculation/bin_len_faster</a></dt>
<dd><p>Binary lens module.
Calculates binary image parameters for a range of source positions.</p>
</dd>
</dl>

<a name="module_main"></a>

## main
Main module.Main module for interactive microlensing simulator.

<a name="module_main..init"></a>

### main~init()
init

**Kind**: inner method of [<code>main</code>](#module_main)  
<a name="module_microlensing_simulation/PSBL_microlensing_event"></a>

## microlensing_simulation/PSBL_microlensing_event
Event module.Handles calculation and drawing lightcurve plot for the microlensing.event.Depicts magnification vs. time curve for microlensing event.Also listens for events from related UI buttons/sliders.


* [microlensing_simulation/PSBL_microlensing_event](#module_microlensing_simulation/PSBL_microlensing_event)
    * [~init()](#module_microlensing_simulation/PSBL_microlensing_event..init)
    * [~initListeners()](#module_microlensing_simulation/PSBL_microlensing_event..initListeners)
    * [~initParams()](#module_microlensing_simulation/PSBL_microlensing_event..initParams)
    * [~updateDerivedQuantities()](#module_microlensing_simulation/PSBL_microlensing_event..updateDerivedQuantities)
    * [~updateU0()](#module_microlensing_simulation/PSBL_microlensing_event..updateU0)
    * [~updateThetaY()](#module_microlensing_simulation/PSBL_microlensing_event..updateThetaY)
    * [~updateDrel()](#module_microlensing_simulation/PSBL_microlensing_event..updateDrel)
    * [~updateThetaE()](#module_microlensing_simulation/PSBL_microlensing_event..updateThetaE)
    * [~calculateThetaE()](#module_microlensing_simulation/PSBL_microlensing_event..calculateThetaE)
    * [~updateTE()](#module_microlensing_simulation/PSBL_microlensing_event..updateTE)
    * [~updateSliderReadout()](#module_microlensing_simulation/PSBL_microlensing_event..updateSliderReadout)
    * [~updateSliders()](#module_microlensing_simulation/PSBL_microlensing_event..updateSliders)
    * [~resetParams()](#module_microlensing_simulation/PSBL_microlensing_event..resetParams)
    * [~updateParam()](#module_microlensing_simulation/PSBL_microlensing_event..updateParam)
    * [~redrawCanvases()](#module_microlensing_simulation/PSBL_microlensing_event..redrawCanvases)
    * [~updateGraph()](#module_microlensing_simulation/PSBL_microlensing_event..updateGraph)
    * [~updateGridRange()](#module_microlensing_simulation/PSBL_microlensing_event..updateGridRange)
    * [~clearGraph()](#module_microlensing_simulation/PSBL_microlensing_event..clearGraph)
    * [~xDayToPixel()](#module_microlensing_simulation/PSBL_microlensing_event..xDayToPixel)
    * [~yMagnifToPixel()](#module_microlensing_simulation/PSBL_microlensing_event..yMagnifToPixel)
    * [~drawAxes()](#module_microlensing_simulation/PSBL_microlensing_event..drawAxes)
    * [~drawAxisLabels()](#module_microlensing_simulation/PSBL_microlensing_event..drawAxisLabels)
    * [~updatePlotScaleAndRange()](#module_microlensing_simulation/PSBL_microlensing_event..updatePlotScaleAndRange)
    * [~initPlot()](#module_microlensing_simulation/PSBL_microlensing_event..initPlot)
    * [~plotLightcurve()](#module_microlensing_simulation/PSBL_microlensing_event..plotLightcurve)
    * [~plotLightcurveAlone()](#module_microlensing_simulation/PSBL_microlensing_event..plotLightcurveAlone)
    * [~getThetaX()](#module_microlensing_simulation/PSBL_microlensing_event..getThetaX)
    * [~updateCurveData()](#module_microlensing_simulation/PSBL_microlensing_event..updateCurveData)
    * [~getTimeTerm()](#module_microlensing_simulation/PSBL_microlensing_event..getTimeTerm)
    * [~getU()](#module_microlensing_simulation/PSBL_microlensing_event..getU)
    * [~getMagnifFromU()](#module_microlensing_simulation/PSBL_microlensing_event..getMagnifFromU)
    * [~getMagnif()](#module_microlensing_simulation/PSBL_microlensing_event..getMagnif)

<a name="module_microlensing_simulation/PSBL_microlensing_event..init"></a>

### microlensing_simulation/PSBL_microlensing_event~init()
init

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..initListeners"></a>

### microlensing_simulation/PSBL_microlensing_event~initListeners()
initListeners

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..initParams"></a>

### microlensing_simulation/PSBL_microlensing_event~initParams()
initParams

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateDerivedQuantities"></a>

### microlensing_simulation/PSBL_microlensing_event~updateDerivedQuantities()
updateDerivedQuantities

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateU0"></a>

### microlensing_simulation/PSBL_microlensing_event~updateU0()
updateU0

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateThetaY"></a>

### microlensing_simulation/PSBL_microlensing_event~updateThetaY()
updateThetaY

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateDrel"></a>

### microlensing_simulation/PSBL_microlensing_event~updateDrel()
updateDrel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateThetaE"></a>

### microlensing_simulation/PSBL_microlensing_event~updateThetaE()
updateThetaE

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..calculateThetaE"></a>

### microlensing_simulation/PSBL_microlensing_event~calculateThetaE()
calculateThetaE

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateTE"></a>

### microlensing_simulation/PSBL_microlensing_event~updateTE()
updateTE

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateSliderReadout"></a>

### microlensing_simulation/PSBL_microlensing_event~updateSliderReadout()
updateSliderReadout

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateSliders"></a>

### microlensing_simulation/PSBL_microlensing_event~updateSliders()
updateSliders

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..resetParams"></a>

### microlensing_simulation/PSBL_microlensing_event~resetParams()
resetParams

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateParam"></a>

### microlensing_simulation/PSBL_microlensing_event~updateParam()
updateParam

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..redrawCanvases"></a>

### microlensing_simulation/PSBL_microlensing_event~redrawCanvases()
redrawCanvases

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateGraph"></a>

### microlensing_simulation/PSBL_microlensing_event~updateGraph()
updateGraph

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateGridRange"></a>

### microlensing_simulation/PSBL_microlensing_event~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..clearGraph"></a>

### microlensing_simulation/PSBL_microlensing_event~clearGraph()
clearGraph

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..xDayToPixel"></a>

### microlensing_simulation/PSBL_microlensing_event~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..yMagnifToPixel"></a>

### microlensing_simulation/PSBL_microlensing_event~yMagnifToPixel()
yMagnifToPixel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..drawAxes"></a>

### microlensing_simulation/PSBL_microlensing_event~drawAxes()
drawAxes

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..drawAxisLabels"></a>

### microlensing_simulation/PSBL_microlensing_event~drawAxisLabels()
drawAxisLabels

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updatePlotScaleAndRange"></a>

### microlensing_simulation/PSBL_microlensing_event~updatePlotScaleAndRange()
updatePlotScaleAndRange

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..initPlot"></a>

### microlensing_simulation/PSBL_microlensing_event~initPlot()
initPlot

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..plotLightcurve"></a>

### microlensing_simulation/PSBL_microlensing_event~plotLightcurve()
plotLightcurve

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..plotLightcurveAlone"></a>

### microlensing_simulation/PSBL_microlensing_event~plotLightcurveAlone()
plotLightcurveAlone

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..getThetaX"></a>

### microlensing_simulation/PSBL_microlensing_event~getThetaX()
getThetaX

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..updateCurveData"></a>

### microlensing_simulation/PSBL_microlensing_event~updateCurveData()
updateCurveData

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..getTimeTerm"></a>

### microlensing_simulation/PSBL_microlensing_event~getTimeTerm()
getTimeTerm

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..getU"></a>

### microlensing_simulation/PSBL_microlensing_event~getU()
getU

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..getMagnifFromU"></a>

### microlensing_simulation/PSBL_microlensing_event~getMagnifFromU()
getMagnifFromU

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event..getMagnif"></a>

### microlensing_simulation/PSBL_microlensing_event~getMagnif()
getMagnif

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event</code>](#module_microlensing_simulation/PSBL_microlensing_event)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation"></a>

## microlensing_simulation/PSBL_microlensing_event_animation
Animation module.Handles animated playback of microlensing event.


* [microlensing_simulation/PSBL_microlensing_event_animation](#module_microlensing_simulation/PSBL_microlensing_event_animation)
    * [~init()](#module_microlensing_simulation/PSBL_microlensing_event_animation..init)
    * [~updateMinAndMaxTimes()](#module_microlensing_simulation/PSBL_microlensing_event_animation..updateMinAndMaxTimes)
    * [~initListeners()](#module_microlensing_simulation/PSBL_microlensing_event_animation..initListeners)
    * [~run()](#module_microlensing_simulation/PSBL_microlensing_event_animation..run)
    * [~almostEquals()](#module_microlensing_simulation/PSBL_microlensing_event_animation..almostEquals)
    * [~updateTime()](#module_microlensing_simulation/PSBL_microlensing_event_animation..updateTime)
    * [~animateFrame()](#module_microlensing_simulation/PSBL_microlensing_event_animation..animateFrame)
    * [~animateFrameSource()](#module_microlensing_simulation/PSBL_microlensing_event_animation..animateFrameSource)
    * [~updatePlayback()](#module_microlensing_simulation/PSBL_microlensing_event_animation..updatePlayback)

<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..init"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~init()
init

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..updateMinAndMaxTimes"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~updateMinAndMaxTimes()
updateMinAndMaxTimes

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..initListeners"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~initListeners()
initListeners

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..run"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~run()
run

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..almostEquals"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~almostEquals()
almostEquals

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..updateTime"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~updateTime()
updateTime

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..animateFrame"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~animateFrame()
animateFrame

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..animateFrameSource"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~animateFrameSource()
animateFrameSource

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_animation..updatePlayback"></a>

### microlensing_simulation/PSBL_microlensing_event_animation~updatePlayback()
updatePlayback

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_animation</code>](#module_microlensing_simulation/PSBL_microlensing_event_animation)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane"></a>

## microlensing_simulation/PSBL_microlensing_event_lens_plane
Lens Plane Module.Handles calculation and drawing of the lens plane plot for the microlensingevent.Depicts the source's path across the sky when the lenses are held fixed.Also listens for events from related UI buttons/sliders.


* [microlensing_simulation/PSBL_microlensing_event_lens_plane](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)
    * [~Lens](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..Lens)
        * [new Lens()](#new_module_microlensing_simulation/PSBL_microlensing_event_lens_plane..Lens_new)
    * [~drawing](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..drawing)
    * [~init()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..init)
    * [~initListeners()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initListeners)
    * [~initLenses()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initLenses)
    * [~initSourceRadius()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initSourceRadius)
    * [~updateSourceRadiusSlider()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateSourceRadiusSlider)
    * [~updateSourceRadius()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateSourceRadius)
    * [~initSourcePos()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initSourcePos)
    * [~redraw()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..redraw)
    * [~updateScaleAndRangeValues()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateScaleAndRangeValues)
    * [~updateDrawingValues()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateDrawingValues)
    * [~thetaXtoPixel()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..thetaXtoPixel)
    * [~xDayToPixel()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..xDayToPixel)
    * [~thetaYtoPixel()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..thetaYtoPixel)
    * [~getThetaX()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..getThetaX)
    * [~getThetaYpathValue()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..getThetaYpathValue)
    * [~almostEquals()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..almostEquals)
    * [~updateGridRange()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateGridRange)
    * [~xDayToThetaX()](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane..xDayToThetaX)

<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..Lens"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~Lens
**Kind**: inner class of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="new_module_microlensing_simulation/PSBL_microlensing_event_lens_plane..Lens_new"></a>

#### new Lens()
A lens -- one of the two binary lenses.

<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..drawing"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~drawing
drawing

**Kind**: inner property of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..init"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~init()
init

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initListeners"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~initListeners()
initListeners

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initLenses"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~initLenses()
initLenses

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initSourceRadius"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~initSourceRadius()
initSourceRadius

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateSourceRadiusSlider"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~updateSourceRadiusSlider()
updateSourceRadiusSlider

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateSourceRadius"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~updateSourceRadius()
updateSourceRadius

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..initSourcePos"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~initSourcePos()
initSourcePos

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..redraw"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~redraw()
redraw

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateScaleAndRangeValues"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~updateScaleAndRangeValues()
updateScaleAndRangeValues

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateDrawingValues"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~updateDrawingValues()
updateDrawingValues

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..thetaXtoPixel"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~thetaXtoPixel()
thetaXtoPixel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..xDayToPixel"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..thetaYtoPixel"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~thetaYtoPixel()
thetaYtoPixel

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..getThetaX"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~getThetaX()
getThetaX

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..getThetaYpathValue"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~getThetaYpathValue()
getThetaYpathValue

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..almostEquals"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~almostEquals()
almostEquals

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..updateGridRange"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_microlensing_simulation/PSBL_microlensing_event_lens_plane..xDayToThetaX"></a>

### microlensing_simulation/PSBL_microlensing_event_lens_plane~xDayToThetaX()
xDayToThetaX

**Kind**: inner method of [<code>microlensing_simulation/PSBL_microlensing_event_lens_plane</code>](#module_microlensing_simulation/PSBL_microlensing_event_lens_plane)  
<a name="module_utils/errorHandler"></a>

## utils/errorHandler
Error handler module.Handles exceptions.Needed to handle exceptions raised when trying to loada module that is not present.

<a name="module_utils/errorHandler..handle"></a>

### utils/errorHandler~handle()
handle

**Kind**: inner method of [<code>utils/errorHandler</code>](#module_utils/errorHandler)  
<a name="module_microlensing_simulation/binary_calculation/bin_ima"></a>

## microlensing_simulation/binary_calculation/bin_ima
Binary image modules.Calculates binary image parameters for a particular source position.


* [microlensing_simulation/binary_calculation/bin_ima](#module_microlensing_simulation/binary_calculation/bin_ima)
    * [~bin_ima()](#module_microlensing_simulation/binary_calculation/bin_ima..bin_ima)
    * [~almostEquals()](#module_microlensing_simulation/binary_calculation/bin_ima..almostEquals)
    * [~compareComplexNumToZero()](#module_microlensing_simulation/binary_calculation/bin_ima..compareComplexNumToZero)

<a name="module_microlensing_simulation/binary_calculation/bin_ima..bin_ima"></a>

### microlensing_simulation/binary_calculation/bin_ima~bin_ima()
bin_ima

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_ima</code>](#module_microlensing_simulation/binary_calculation/bin_ima)  
<a name="module_microlensing_simulation/binary_calculation/bin_ima..almostEquals"></a>

### microlensing_simulation/binary_calculation/bin_ima~almostEquals()
almostEquals

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_ima</code>](#module_microlensing_simulation/binary_calculation/bin_ima)  
<a name="module_microlensing_simulation/binary_calculation/bin_ima..compareComplexNumToZero"></a>

### microlensing_simulation/binary_calculation/bin_ima~compareComplexNumToZero()
compareComplexNumToZero

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_ima</code>](#module_microlensing_simulation/binary_calculation/bin_ima)  
<a name="module_microlensing_simulation/binary_calculation/bin_len_faster"></a>

## microlensing_simulation/binary_calculation/bin_len_faster
Binary lens module.Calculates binary image parameters for a range of source positions.


* [microlensing_simulation/binary_calculation/bin_len_faster](#module_microlensing_simulation/binary_calculation/bin_len_faster)
    * [~plot_binary()](#module_microlensing_simulation/binary_calculation/bin_len_faster..plot_binary)
    * [~findCausticAndCritCurves()](#module_microlensing_simulation/binary_calculation/bin_len_faster..findCausticAndCritCurves)
    * [~almostEquals()](#module_microlensing_simulation/binary_calculation/bin_len_faster..almostEquals)

<a name="module_microlensing_simulation/binary_calculation/bin_len_faster..plot_binary"></a>

### microlensing_simulation/binary_calculation/bin_len_faster~plot_binary()
plot_binary

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_len_faster</code>](#module_microlensing_simulation/binary_calculation/bin_len_faster)  
<a name="module_microlensing_simulation/binary_calculation/bin_len_faster..findCausticAndCritCurves"></a>

### microlensing_simulation/binary_calculation/bin_len_faster~findCausticAndCritCurves()
findCausticAndCritCurves

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_len_faster</code>](#module_microlensing_simulation/binary_calculation/bin_len_faster)  
<a name="module_microlensing_simulation/binary_calculation/bin_len_faster..almostEquals"></a>

### microlensing_simulation/binary_calculation/bin_len_faster~almostEquals()
almostEquals

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_len_faster</code>](#module_microlensing_simulation/binary_calculation/bin_len_faster)  
