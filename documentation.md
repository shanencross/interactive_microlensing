## Modules

<dl>
<dt><a href="#module_bin_ima">bin_ima</a></dt>
<dd><p>Binary image modules.
Calculates binary image parameters for a particular source position.</p>
</dd>
<dt><a href="#module_bin_len_faster">bin_len_faster</a></dt>
<dd><p>Binary lens module.
Calculates binary image parameters for a range of source positions.</p>
</dd>
<dt><a href="#module_show_or_hide">show_or_hide</a></dt>
<dd><p>Show/hide module.
Allows HTML block to be toggled between being shown/hiden.</p>
</dd>
<dt><a href="#module_errorHandler">errorHandler</a></dt>
<dd><p>Error handler module.
Handles exceptions.</p>
<p>Needed to handle exceptions raised when trying to load
a module that is not present.</p>
</dd>
<dt><a href="#module_main">main</a></dt>
<dd><p>Main module.
Main module for interactive microlensing simulator.</p>
</dd>
<dt><a href="#module_PSPL_binary_microlensing_event">PSPL_binary_microlensing_event</a></dt>
<dd><p>Event module.
Handles calculation and drawing lightcurve plot for the microlensing.
event.</p>
<p>Depicts magnification vs. time curve for microlensing event.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_PSPL_binary_microlensing_event_animation">PSPL_binary_microlensing_event_animation</a></dt>
<dd><p>Animation module.
Handles animated playback of microlensing event.</p>
</dd>
<dt><a href="#module_PSPL_binary_microlensing_event_lens_plane">PSPL_binary_microlensing_event_lens_plane</a></dt>
<dd><p>Lens Plane Module.
Handles calculation and drawing of the lens plane plot for the microlensing
event.</p>
<p>Depicts the source&#39;s path across the sky when the lenses are held fixed.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
</dl>

<a name="module_bin_ima"></a>

## bin_ima
Binary image modules.Calculates binary image parameters for a particular source position.


* [bin_ima](#module_bin_ima)
    * [~bin_ima()](#module_bin_ima..bin_ima)
    * [~almostEquals()](#module_bin_ima..almostEquals)
    * [~compareComplexNumToZero()](#module_bin_ima..compareComplexNumToZero)

<a name="module_bin_ima..bin_ima"></a>

### bin_ima~bin_ima()
bin_ima

**Kind**: inner method of [<code>bin_ima</code>](#module_bin_ima)  
<a name="module_bin_ima..almostEquals"></a>

### bin_ima~almostEquals()
almostEquals

**Kind**: inner method of [<code>bin_ima</code>](#module_bin_ima)  
<a name="module_bin_ima..compareComplexNumToZero"></a>

### bin_ima~compareComplexNumToZero()
compareComplexNumToZero

**Kind**: inner method of [<code>bin_ima</code>](#module_bin_ima)  
<a name="module_bin_len_faster"></a>

## bin_len_faster
Binary lens module.Calculates binary image parameters for a range of source positions.


* [bin_len_faster](#module_bin_len_faster)
    * [~plot_binary()](#module_bin_len_faster..plot_binary)
    * [~findCausticAndCritCurves()](#module_bin_len_faster..findCausticAndCritCurves)
    * [~almostEquals()](#module_bin_len_faster..almostEquals)

<a name="module_bin_len_faster..plot_binary"></a>

### bin_len_faster~plot_binary()
plot_binary

**Kind**: inner method of [<code>bin_len_faster</code>](#module_bin_len_faster)  
<a name="module_bin_len_faster..findCausticAndCritCurves"></a>

### bin_len_faster~findCausticAndCritCurves()
findCausticAndCritCurves

**Kind**: inner method of [<code>bin_len_faster</code>](#module_bin_len_faster)  
<a name="module_bin_len_faster..almostEquals"></a>

### bin_len_faster~almostEquals()
almostEquals

**Kind**: inner method of [<code>bin_len_faster</code>](#module_bin_len_faster)  
<a name="module_show_or_hide"></a>

## show_or_hide
Show/hide module.Allows HTML block to be toggled between being shown/hiden.

<a name="module_errorHandler"></a>

## errorHandler
Error handler module.Handles exceptions.Needed to handle exceptions raised when trying to loada module that is not present.

<a name="module_errorHandler..handle"></a>

### errorHandler~handle()
handle

**Kind**: inner method of [<code>errorHandler</code>](#module_errorHandler)  
<a name="module_main"></a>

## main
Main module.Main module for interactive microlensing simulator.

<a name="module_main..init"></a>

### main~init()
init

**Kind**: inner method of [<code>main</code>](#module_main)  
<a name="module_PSPL_binary_microlensing_event"></a>

## PSPL_binary_microlensing_event
Event module.Handles calculation and drawing lightcurve plot for the microlensing.event.Depicts magnification vs. time curve for microlensing event.Also listens for events from related UI buttons/sliders.


* [PSPL_binary_microlensing_event](#module_PSPL_binary_microlensing_event)
    * [~init()](#module_PSPL_binary_microlensing_event..init)
    * [~initListeners()](#module_PSPL_binary_microlensing_event..initListeners)
    * [~initParams()](#module_PSPL_binary_microlensing_event..initParams)
    * [~updateDerivedQuantities()](#module_PSPL_binary_microlensing_event..updateDerivedQuantities)
    * [~updateU0()](#module_PSPL_binary_microlensing_event..updateU0)
    * [~updateThetaY()](#module_PSPL_binary_microlensing_event..updateThetaY)
    * [~updateDrel()](#module_PSPL_binary_microlensing_event..updateDrel)
    * [~updateThetaE()](#module_PSPL_binary_microlensing_event..updateThetaE)
    * [~calculateThetaE()](#module_PSPL_binary_microlensing_event..calculateThetaE)
    * [~updateTE()](#module_PSPL_binary_microlensing_event..updateTE)
    * [~updateSliderReadout()](#module_PSPL_binary_microlensing_event..updateSliderReadout)
    * [~updateSliders()](#module_PSPL_binary_microlensing_event..updateSliders)
    * [~resetParams()](#module_PSPL_binary_microlensing_event..resetParams)
    * [~updateParam()](#module_PSPL_binary_microlensing_event..updateParam)
    * [~redrawCanvases()](#module_PSPL_binary_microlensing_event..redrawCanvases)
    * [~updateGraph()](#module_PSPL_binary_microlensing_event..updateGraph)
    * [~updateGridRange()](#module_PSPL_binary_microlensing_event..updateGridRange)
    * [~clearGraph()](#module_PSPL_binary_microlensing_event..clearGraph)
    * [~xDayToPixel()](#module_PSPL_binary_microlensing_event..xDayToPixel)
    * [~yMagnifToPixel()](#module_PSPL_binary_microlensing_event..yMagnifToPixel)
    * [~drawAxes()](#module_PSPL_binary_microlensing_event..drawAxes)
    * [~drawAxisLabels()](#module_PSPL_binary_microlensing_event..drawAxisLabels)
    * [~updatePlotScaleAndRange()](#module_PSPL_binary_microlensing_event..updatePlotScaleAndRange)
    * [~initPlot()](#module_PSPL_binary_microlensing_event..initPlot)
    * [~plotLightcurve()](#module_PSPL_binary_microlensing_event..plotLightcurve)
    * [~plotLightcurveAlone()](#module_PSPL_binary_microlensing_event..plotLightcurveAlone)
    * [~getThetaX()](#module_PSPL_binary_microlensing_event..getThetaX)
    * [~updateCurveData()](#module_PSPL_binary_microlensing_event..updateCurveData)
    * [~toggleFiniteSource()](#module_PSPL_binary_microlensing_event..toggleFiniteSource)
    * [~getTimeTerm()](#module_PSPL_binary_microlensing_event..getTimeTerm)
    * [~getU()](#module_PSPL_binary_microlensing_event..getU)
    * [~getMagnifFromU()](#module_PSPL_binary_microlensing_event..getMagnifFromU)
    * [~getMagnif()](#module_PSPL_binary_microlensing_event..getMagnif)

<a name="module_PSPL_binary_microlensing_event..init"></a>

### PSPL_binary_microlensing_event~init()
init

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..initListeners"></a>

### PSPL_binary_microlensing_event~initListeners()
initListeners

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..initParams"></a>

### PSPL_binary_microlensing_event~initParams()
initParams

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateDerivedQuantities"></a>

### PSPL_binary_microlensing_event~updateDerivedQuantities()
updateDerivedQuantities

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateU0"></a>

### PSPL_binary_microlensing_event~updateU0()
updateU0

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateThetaY"></a>

### PSPL_binary_microlensing_event~updateThetaY()
updateThetaY

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateDrel"></a>

### PSPL_binary_microlensing_event~updateDrel()
updateDrel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateThetaE"></a>

### PSPL_binary_microlensing_event~updateThetaE()
updateThetaE

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..calculateThetaE"></a>

### PSPL_binary_microlensing_event~calculateThetaE()
calculateThetaE

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateTE"></a>

### PSPL_binary_microlensing_event~updateTE()
updateTE

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateSliderReadout"></a>

### PSPL_binary_microlensing_event~updateSliderReadout()
updateSliderReadout

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateSliders"></a>

### PSPL_binary_microlensing_event~updateSliders()
updateSliders

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..resetParams"></a>

### PSPL_binary_microlensing_event~resetParams()
resetParams

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateParam"></a>

### PSPL_binary_microlensing_event~updateParam()
updateParam

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..redrawCanvases"></a>

### PSPL_binary_microlensing_event~redrawCanvases()
redrawCanvases

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateGraph"></a>

### PSPL_binary_microlensing_event~updateGraph()
updateGraph

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateGridRange"></a>

### PSPL_binary_microlensing_event~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..clearGraph"></a>

### PSPL_binary_microlensing_event~clearGraph()
clearGraph

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..xDayToPixel"></a>

### PSPL_binary_microlensing_event~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..yMagnifToPixel"></a>

### PSPL_binary_microlensing_event~yMagnifToPixel()
yMagnifToPixel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..drawAxes"></a>

### PSPL_binary_microlensing_event~drawAxes()
drawAxes

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..drawAxisLabels"></a>

### PSPL_binary_microlensing_event~drawAxisLabels()
drawAxisLabels

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updatePlotScaleAndRange"></a>

### PSPL_binary_microlensing_event~updatePlotScaleAndRange()
updatePlotScaleAndRange

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..initPlot"></a>

### PSPL_binary_microlensing_event~initPlot()
initPlot

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..plotLightcurve"></a>

### PSPL_binary_microlensing_event~plotLightcurve()
plotLightcurve

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..plotLightcurveAlone"></a>

### PSPL_binary_microlensing_event~plotLightcurveAlone()
plotLightcurveAlone

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..getThetaX"></a>

### PSPL_binary_microlensing_event~getThetaX()
getThetaX

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..updateCurveData"></a>

### PSPL_binary_microlensing_event~updateCurveData()
updateCurveData

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..toggleFiniteSource"></a>

### PSPL_binary_microlensing_event~toggleFiniteSource()
toggleFiniteSource

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..getTimeTerm"></a>

### PSPL_binary_microlensing_event~getTimeTerm()
getTimeTerm

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..getU"></a>

### PSPL_binary_microlensing_event~getU()
getU

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..getMagnifFromU"></a>

### PSPL_binary_microlensing_event~getMagnifFromU()
getMagnifFromU

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event..getMagnif"></a>

### PSPL_binary_microlensing_event~getMagnif()
getMagnif

**Kind**: inner method of [<code>PSPL_binary_microlensing_event</code>](#module_PSPL_binary_microlensing_event)  
<a name="module_PSPL_binary_microlensing_event_animation"></a>

## PSPL_binary_microlensing_event_animation
Animation module.Handles animated playback of microlensing event.


* [PSPL_binary_microlensing_event_animation](#module_PSPL_binary_microlensing_event_animation)
    * [~init()](#module_PSPL_binary_microlensing_event_animation..init)
    * [~updateMinAndMaxTimes()](#module_PSPL_binary_microlensing_event_animation..updateMinAndMaxTimes)
    * [~initListeners()](#module_PSPL_binary_microlensing_event_animation..initListeners)
    * [~run()](#module_PSPL_binary_microlensing_event_animation..run)
    * [~almostEquals()](#module_PSPL_binary_microlensing_event_animation..almostEquals)
    * [~updateTime()](#module_PSPL_binary_microlensing_event_animation..updateTime)
    * [~animateFrame()](#module_PSPL_binary_microlensing_event_animation..animateFrame)
    * [~animateFrameSource()](#module_PSPL_binary_microlensing_event_animation..animateFrameSource)
    * [~updatePlayback()](#module_PSPL_binary_microlensing_event_animation..updatePlayback)

<a name="module_PSPL_binary_microlensing_event_animation..init"></a>

### PSPL_binary_microlensing_event_animation~init()
init

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..updateMinAndMaxTimes"></a>

### PSPL_binary_microlensing_event_animation~updateMinAndMaxTimes()
updateMinAndMaxTimes

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..initListeners"></a>

### PSPL_binary_microlensing_event_animation~initListeners()
initListeners

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..run"></a>

### PSPL_binary_microlensing_event_animation~run()
run

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..almostEquals"></a>

### PSPL_binary_microlensing_event_animation~almostEquals()
almostEquals

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..updateTime"></a>

### PSPL_binary_microlensing_event_animation~updateTime()
updateTime

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..animateFrame"></a>

### PSPL_binary_microlensing_event_animation~animateFrame()
animateFrame

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..animateFrameSource"></a>

### PSPL_binary_microlensing_event_animation~animateFrameSource()
animateFrameSource

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_animation..updatePlayback"></a>

### PSPL_binary_microlensing_event_animation~updatePlayback()
updatePlayback

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_animation</code>](#module_PSPL_binary_microlensing_event_animation)  
<a name="module_PSPL_binary_microlensing_event_lens_plane"></a>

## PSPL_binary_microlensing_event_lens_plane
Lens Plane Module.Handles calculation and drawing of the lens plane plot for the microlensingevent.Depicts the source's path across the sky when the lenses are held fixed.Also listens for events from related UI buttons/sliders.


* [PSPL_binary_microlensing_event_lens_plane](#module_PSPL_binary_microlensing_event_lens_plane)
    * [~Lens](#module_PSPL_binary_microlensing_event_lens_plane..Lens)
        * [new Lens()](#new_module_PSPL_binary_microlensing_event_lens_plane..Lens_new)
    * [~drawing](#module_PSPL_binary_microlensing_event_lens_plane..drawing)
    * [~init()](#module_PSPL_binary_microlensing_event_lens_plane..init)
    * [~initListeners()](#module_PSPL_binary_microlensing_event_lens_plane..initListeners)
    * [~initLenses()](#module_PSPL_binary_microlensing_event_lens_plane..initLenses)
    * [~initSourceRadius()](#module_PSPL_binary_microlensing_event_lens_plane..initSourceRadius)
    * [~updateSourceRadiusSlider()](#module_PSPL_binary_microlensing_event_lens_plane..updateSourceRadiusSlider)
    * [~updateSourceRadius()](#module_PSPL_binary_microlensing_event_lens_plane..updateSourceRadius)
    * [~initSourcePos()](#module_PSPL_binary_microlensing_event_lens_plane..initSourcePos)
    * [~redraw()](#module_PSPL_binary_microlensing_event_lens_plane..redraw)
    * [~updateScaleAndRangeValues()](#module_PSPL_binary_microlensing_event_lens_plane..updateScaleAndRangeValues)
    * [~updateDrawingValues()](#module_PSPL_binary_microlensing_event_lens_plane..updateDrawingValues)
    * [~thetaXtoPixel()](#module_PSPL_binary_microlensing_event_lens_plane..thetaXtoPixel)
    * [~xDayToPixel()](#module_PSPL_binary_microlensing_event_lens_plane..xDayToPixel)
    * [~thetaYtoPixel()](#module_PSPL_binary_microlensing_event_lens_plane..thetaYtoPixel)
    * [~getThetaX()](#module_PSPL_binary_microlensing_event_lens_plane..getThetaX)
    * [~getThetaYpathValue()](#module_PSPL_binary_microlensing_event_lens_plane..getThetaYpathValue)
    * [~almostEquals()](#module_PSPL_binary_microlensing_event_lens_plane..almostEquals)
    * [~getCircleOutline()](#module_PSPL_binary_microlensing_event_lens_plane..getCircleOutline)
    * [~addExtraPoints()](#module_PSPL_binary_microlensing_event_lens_plane..addExtraPoints)
    * [~getCircleOutlineWithRecursion()](#module_PSPL_binary_microlensing_event_lens_plane..getCircleOutlineWithRecursion)
    * [~getLensedImages()](#module_PSPL_binary_microlensing_event_lens_plane..getLensedImages)
    * [~getLensedImageOutlines()](#module_PSPL_binary_microlensing_event_lens_plane..getLensedImageOutlines)
    * [~updateGridRange()](#module_PSPL_binary_microlensing_event_lens_plane..updateGridRange)
    * [~xDayToThetaX()](#module_PSPL_binary_microlensing_event_lens_plane..xDayToThetaX)

<a name="module_PSPL_binary_microlensing_event_lens_plane..Lens"></a>

### PSPL_binary_microlensing_event_lens_plane~Lens
**Kind**: inner class of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="new_module_PSPL_binary_microlensing_event_lens_plane..Lens_new"></a>

#### new Lens()
A lens -- one of the two binary lenses.

<a name="module_PSPL_binary_microlensing_event_lens_plane..drawing"></a>

### PSPL_binary_microlensing_event_lens_plane~drawing
drawing

**Kind**: inner property of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..init"></a>

### PSPL_binary_microlensing_event_lens_plane~init()
init

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..initListeners"></a>

### PSPL_binary_microlensing_event_lens_plane~initListeners()
initListeners

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..initLenses"></a>

### PSPL_binary_microlensing_event_lens_plane~initLenses()
initLenses

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..initSourceRadius"></a>

### PSPL_binary_microlensing_event_lens_plane~initSourceRadius()
initSourceRadius

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..updateSourceRadiusSlider"></a>

### PSPL_binary_microlensing_event_lens_plane~updateSourceRadiusSlider()
updateSourceRadiusSlider

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..updateSourceRadius"></a>

### PSPL_binary_microlensing_event_lens_plane~updateSourceRadius()
updateSourceRadius

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..initSourcePos"></a>

### PSPL_binary_microlensing_event_lens_plane~initSourcePos()
initSourcePos

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..redraw"></a>

### PSPL_binary_microlensing_event_lens_plane~redraw()
redraw

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..updateScaleAndRangeValues"></a>

### PSPL_binary_microlensing_event_lens_plane~updateScaleAndRangeValues()
updateScaleAndRangeValues

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..updateDrawingValues"></a>

### PSPL_binary_microlensing_event_lens_plane~updateDrawingValues()
updateDrawingValues

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..thetaXtoPixel"></a>

### PSPL_binary_microlensing_event_lens_plane~thetaXtoPixel()
thetaXtoPixel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..xDayToPixel"></a>

### PSPL_binary_microlensing_event_lens_plane~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..thetaYtoPixel"></a>

### PSPL_binary_microlensing_event_lens_plane~thetaYtoPixel()
thetaYtoPixel

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getThetaX"></a>

### PSPL_binary_microlensing_event_lens_plane~getThetaX()
getThetaX

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getThetaYpathValue"></a>

### PSPL_binary_microlensing_event_lens_plane~getThetaYpathValue()
getThetaYpathValue

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..almostEquals"></a>

### PSPL_binary_microlensing_event_lens_plane~almostEquals()
almostEquals

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getCircleOutline"></a>

### PSPL_binary_microlensing_event_lens_plane~getCircleOutline()
getCircleOutlineNot used for binary (I think)

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..addExtraPoints"></a>

### PSPL_binary_microlensing_event_lens_plane~addExtraPoints()
addExtraPointsNot used for binary (I think)

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getCircleOutlineWithRecursion"></a>

### PSPL_binary_microlensing_event_lens_plane~getCircleOutlineWithRecursion()
getCircleOutlineWithRecursionNot used for binary (I think)

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getLensedImages"></a>

### PSPL_binary_microlensing_event_lens_plane~getLensedImages()
getLensedImagesNot used for binary (I think)

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..getLensedImageOutlines"></a>

### PSPL_binary_microlensing_event_lens_plane~getLensedImageOutlines()
getLensedImageOutlinesNot used for binary (I think)

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..updateGridRange"></a>

### PSPL_binary_microlensing_event_lens_plane~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
<a name="module_PSPL_binary_microlensing_event_lens_plane..xDayToThetaX"></a>

### PSPL_binary_microlensing_event_lens_plane~xDayToThetaX()
xDayToThetaX

**Kind**: inner method of [<code>PSPL_binary_microlensing_event_lens_plane</code>](#module_PSPL_binary_microlensing_event_lens_plane)  
