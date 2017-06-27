## Modules

<dl>
<dt><a href="#module_almost-equals">almost-equals</a></dt>
<dd><p>Almost Equals.
Function that checks if two numbers are almost equal.</p>
</dd>
<dt><a href="#module_ellipse">ellipse</a></dt>
<dd><p>Ellipse.
Draw an ellipse (but don&#39;t actually perform the stroke or fill) on a
Canvas element.
Unlike the native JS ellipse ellipse function,
this is compatible with Firefox.</p>
</dd>
<dt><a href="#module_fspl-microlensing-event-animation">fspl-microlensing-event-animation</a></dt>
<dd><p>Animation module.
Handles animated playback of microlensing event.</p>
</dd>
<dt><a href="#module_fspl-microlensing-event-finite-source-table">fspl-microlensing-event-finite-source-table</a></dt>
<dd><p>Finite Source Table module.
Handles calculations of finite source effects.
Holds z and B0 columns for calculating finite source magnifaction factor.</p>
</dd>
<dt><a href="#module_fspl-microlensing-event-finite-source">fspl-microlensing-event-finite-source</a></dt>
<dd><p>Finite Source module.
Handles calculations of finite source effects.</p>
</dd>
<dt><a href="#module_fspl-microlensing-event-lens-plane">fspl-microlensing-event-lens-plane</a></dt>
<dd><p>Lens Plane Module.
Handles calculation and drawing of the lens plane plot for the microlensing
event.</p>
<p>Depicts the source&#39;s path across the sky when the lenses are held fixed.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
<dt><a href="#module_fspl-microlensing-event">fspl-microlensing-event</a></dt>
<dd><p>Event module.
Handles calculation and drawing lightcurve plot for the microlensing.
event.</p>
<p>Depicts magnification vs. time curve for microlensing event.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
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
<dt><a href="#show-or-hide.module_js">js</a></dt>
<dd><p>Show/Hide finite source options module.</p>
</dd>
<dt><a href="#module_utils">utils</a></dt>
<dd><p>Uitilities module.
Miscellaneous helper functions.</p>
</dd>
</dl>

<a name="module_almost-equals"></a>

## almost-equals
Almost Equals.Function that checks if two numbers are almost equal.

<a name="module_ellipse"></a>

## ellipse
Ellipse.Draw an ellipse (but don't actually perform the stroke or fill) on aCanvas element.Unlike the native JS ellipse ellipse function,this is compatible with Firefox.

<a name="module_fspl-microlensing-event-animation"></a>

## fspl-microlensing-event-animation
Animation module.Handles animated playback of microlensing event.


* [fspl-microlensing-event-animation](#module_fspl-microlensing-event-animation)
    * [~init()](#module_fspl-microlensing-event-animation..init)
    * [~updateMinAndMaxTimes()](#module_fspl-microlensing-event-animation..updateMinAndMaxTimes)
    * [~initListeners()](#module_fspl-microlensing-event-animation..initListeners)
    * [~run()](#module_fspl-microlensing-event-animation..run)
    * [~updateTime()](#module_fspl-microlensing-event-animation..updateTime)
    * [~animateFrame()](#module_fspl-microlensing-event-animation..animateFrame)
    * [~animateFrameSource()](#module_fspl-microlensing-event-animation..animateFrameSource)
    * [~updatePlayback()](#module_fspl-microlensing-event-animation..updatePlayback)

<a name="module_fspl-microlensing-event-animation..init"></a>

### fspl-microlensing-event-animation~init()
init

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..updateMinAndMaxTimes"></a>

### fspl-microlensing-event-animation~updateMinAndMaxTimes()
updateMinAndMaxTimes

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..initListeners"></a>

### fspl-microlensing-event-animation~initListeners()
initListeners

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..run"></a>

### fspl-microlensing-event-animation~run()
run

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..updateTime"></a>

### fspl-microlensing-event-animation~updateTime()
updateTime

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..animateFrame"></a>

### fspl-microlensing-event-animation~animateFrame()
animateFrame

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..animateFrameSource"></a>

### fspl-microlensing-event-animation~animateFrameSource()
animateFrameSource

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-animation..updatePlayback"></a>

### fspl-microlensing-event-animation~updatePlayback()
updatePlayback

**Kind**: inner method of [<code>fspl-microlensing-event-animation</code>](#module_fspl-microlensing-event-animation)  
<a name="module_fspl-microlensing-event-finite-source-table"></a>

## fspl-microlensing-event-finite-source-table
Finite Source Table module.Handles calculations of finite source effects.Holds z and B0 columns for calculating finite source magnifaction factor.

<a name="module_fspl-microlensing-event-finite-source"></a>

## fspl-microlensing-event-finite-source
Finite Source module.Handles calculations of finite source effects.

<a name="module_fspl-microlensing-event-finite-source..getFiniteSourceFactor"></a>

### fspl-microlensing-event-finite-source~getFiniteSourceFactor()
getFiniteSourceFactor

**Kind**: inner method of [<code>fspl-microlensing-event-finite-source</code>](#module_fspl-microlensing-event-finite-source)  
<a name="module_fspl-microlensing-event-lens-plane"></a>

## fspl-microlensing-event-lens-plane
Lens Plane Module.Handles calculation and drawing of the lens plane plot for the microlensingevent.Depicts the source's path across the sky when the lenses are held fixed.Also listens for events from related UI buttons/sliders.


* [fspl-microlensing-event-lens-plane](#module_fspl-microlensing-event-lens-plane)
    * [~drawing](#module_fspl-microlensing-event-lens-plane..drawing)
    * [~init()](#module_fspl-microlensing-event-lens-plane..init)
    * [~initListeners()](#module_fspl-microlensing-event-lens-plane..initListeners)
    * [~initCheckboxes()](#module_fspl-microlensing-event-lens-plane..initCheckboxes)
    * [~initSliders()](#module_fspl-microlensing-event-lens-plane..initSliders)
    * [~initLenses()](#module_fspl-microlensing-event-lens-plane..initLenses)
    * [~initSourceRadius()](#module_fspl-microlensing-event-lens-plane..initSourceRadius)
    * [~updateSourceRadiusSlider()](#module_fspl-microlensing-event-lens-plane..updateSourceRadiusSlider)
    * [~updateSourceRadius()](#module_fspl-microlensing-event-lens-plane..updateSourceRadius)
    * [~initSourcePos()](#module_fspl-microlensing-event-lens-plane..initSourcePos)
    * [~redraw()](#module_fspl-microlensing-event-lens-plane..redraw)
    * [~updateScaleAndRangeValues()](#module_fspl-microlensing-event-lens-plane..updateScaleAndRangeValues)
    * [~updateDrawingValues()](#module_fspl-microlensing-event-lens-plane..updateDrawingValues)
    * [~thetaXtoPixel()](#module_fspl-microlensing-event-lens-plane..thetaXtoPixel)
    * [~xDayToPixel()](#module_fspl-microlensing-event-lens-plane..xDayToPixel)
    * [~thetaYtoPixel()](#module_fspl-microlensing-event-lens-plane..thetaYtoPixel)
    * [~getThetaX()](#module_fspl-microlensing-event-lens-plane..getThetaX)
    * [~getThetaYpathValue()](#module_fspl-microlensing-event-lens-plane..getThetaYpathValue)
    * [~getCircleOutline()](#module_fspl-microlensing-event-lens-plane..getCircleOutline)
    * [~addExtraPoints()](#module_fspl-microlensing-event-lens-plane..addExtraPoints)
    * [~getCircleOutlineWithRecursion()](#module_fspl-microlensing-event-lens-plane..getCircleOutlineWithRecursion)
    * [~getLensedImages()](#module_fspl-microlensing-event-lens-plane..getLensedImages)
    * [~getLensedImageOutlines()](#module_fspl-microlensing-event-lens-plane..getLensedImageOutlines)
    * [~updateGridRange()](#module_fspl-microlensing-event-lens-plane..updateGridRange)
    * [~xDayToThetaX()](#module_fspl-microlensing-event-lens-plane..xDayToThetaX)

<a name="module_fspl-microlensing-event-lens-plane..drawing"></a>

### fspl-microlensing-event-lens-plane~drawing
drawing

**Kind**: inner property of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..init"></a>

### fspl-microlensing-event-lens-plane~init()
init

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initListeners"></a>

### fspl-microlensing-event-lens-plane~initListeners()
initListeners

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initCheckboxes"></a>

### fspl-microlensing-event-lens-plane~initCheckboxes()
initCheckboxes()

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initSliders"></a>

### fspl-microlensing-event-lens-plane~initSliders()
initSliders

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initLenses"></a>

### fspl-microlensing-event-lens-plane~initLenses()
initLenses

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initSourceRadius"></a>

### fspl-microlensing-event-lens-plane~initSourceRadius()
initSourceRadius

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..updateSourceRadiusSlider"></a>

### fspl-microlensing-event-lens-plane~updateSourceRadiusSlider()
updateSourceRadiusSlider

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..updateSourceRadius"></a>

### fspl-microlensing-event-lens-plane~updateSourceRadius()
updateSourceRadius

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..initSourcePos"></a>

### fspl-microlensing-event-lens-plane~initSourcePos()
initSourcePos

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..redraw"></a>

### fspl-microlensing-event-lens-plane~redraw()
redraw

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..updateScaleAndRangeValues"></a>

### fspl-microlensing-event-lens-plane~updateScaleAndRangeValues()
updateScaleAndRangeValues

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..updateDrawingValues"></a>

### fspl-microlensing-event-lens-plane~updateDrawingValues()
updateDrawingValues

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..thetaXtoPixel"></a>

### fspl-microlensing-event-lens-plane~thetaXtoPixel()
thetaXtoPixel

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..xDayToPixel"></a>

### fspl-microlensing-event-lens-plane~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..thetaYtoPixel"></a>

### fspl-microlensing-event-lens-plane~thetaYtoPixel()
thetaYtoPixel

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getThetaX"></a>

### fspl-microlensing-event-lens-plane~getThetaX()
getThetaX

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getThetaYpathValue"></a>

### fspl-microlensing-event-lens-plane~getThetaYpathValue()
getThetaYpathValue

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getCircleOutline"></a>

### fspl-microlensing-event-lens-plane~getCircleOutline()
getCircleOutline

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..addExtraPoints"></a>

### fspl-microlensing-event-lens-plane~addExtraPoints()
addExtraPoints

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getCircleOutlineWithRecursion"></a>

### fspl-microlensing-event-lens-plane~getCircleOutlineWithRecursion()
getCircleOutlineWithRecursion

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getLensedImages"></a>

### fspl-microlensing-event-lens-plane~getLensedImages()
getLensedImages

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..getLensedImageOutlines"></a>

### fspl-microlensing-event-lens-plane~getLensedImageOutlines()
getLensedImageOutlines

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..updateGridRange"></a>

### fspl-microlensing-event-lens-plane~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event-lens-plane..xDayToThetaX"></a>

### fspl-microlensing-event-lens-plane~xDayToThetaX()
xDayToThetaX

**Kind**: inner method of [<code>fspl-microlensing-event-lens-plane</code>](#module_fspl-microlensing-event-lens-plane)  
<a name="module_fspl-microlensing-event"></a>

## fspl-microlensing-event
Event module.Handles calculation and drawing lightcurve plot for the microlensing.event.Depicts magnification vs. time curve for microlensing event.Also listens for events from related UI buttons/sliders.


* [fspl-microlensing-event](#module_fspl-microlensing-event)
    * [~init()](#module_fspl-microlensing-event..init)
    * [~initListeners()](#module_fspl-microlensing-event..initListeners)
    * [~initParams()](#module_fspl-microlensing-event..initParams)
    * [~updateDerivedQuantities()](#module_fspl-microlensing-event..updateDerivedQuantities)
    * [~updateU0()](#module_fspl-microlensing-event..updateU0)
    * [~updateThetaY()](#module_fspl-microlensing-event..updateThetaY)
    * [~updateDrel()](#module_fspl-microlensing-event..updateDrel)
    * [~updateThetaE()](#module_fspl-microlensing-event..updateThetaE)
    * [~calculateThetaE()](#module_fspl-microlensing-event..calculateThetaE)
    * [~updateTE()](#module_fspl-microlensing-event..updateTE)
    * [~updateSliderReadout()](#module_fspl-microlensing-event..updateSliderReadout)
    * [~updateSliders()](#module_fspl-microlensing-event..updateSliders)
    * [~resetParams()](#module_fspl-microlensing-event..resetParams)
    * [~updateParam()](#module_fspl-microlensing-event..updateParam)
    * [~redrawCanvases()](#module_fspl-microlensing-event..redrawCanvases)
    * [~updateGraph()](#module_fspl-microlensing-event..updateGraph)
    * [~updateGridRange()](#module_fspl-microlensing-event..updateGridRange)
    * [~clearGraph()](#module_fspl-microlensing-event..clearGraph)
    * [~xDayToPixel()](#module_fspl-microlensing-event..xDayToPixel)
    * [~yMagnifToPixel()](#module_fspl-microlensing-event..yMagnifToPixel)
    * [~drawAxes()](#module_fspl-microlensing-event..drawAxes)
    * [~drawAxisLabels()](#module_fspl-microlensing-event..drawAxisLabels)
    * [~updatePlotScaleAndRange()](#module_fspl-microlensing-event..updatePlotScaleAndRange)
    * [~initPlot()](#module_fspl-microlensing-event..initPlot)
    * [~plotLightcurve()](#module_fspl-microlensing-event..plotLightcurve)
    * [~plotLightcurveAlone()](#module_fspl-microlensing-event..plotLightcurveAlone)
    * [~getThetaX()](#module_fspl-microlensing-event..getThetaX)
    * [~updateCurveData()](#module_fspl-microlensing-event..updateCurveData)
    * [~toggleFiniteSource()](#module_fspl-microlensing-event..toggleFiniteSource)
    * [~getTimeTerm()](#module_fspl-microlensing-event..getTimeTerm)
    * [~getU()](#module_fspl-microlensing-event..getU)
    * [~getMagnifFromU()](#module_fspl-microlensing-event..getMagnifFromU)
    * [~getMagnif()](#module_fspl-microlensing-event..getMagnif)

<a name="module_fspl-microlensing-event..init"></a>

### fspl-microlensing-event~init()
init

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..initListeners"></a>

### fspl-microlensing-event~initListeners()
initListeners

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..initParams"></a>

### fspl-microlensing-event~initParams()
initParams

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateDerivedQuantities"></a>

### fspl-microlensing-event~updateDerivedQuantities()
updateDerivedQuantities

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateU0"></a>

### fspl-microlensing-event~updateU0()
updateU0

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateThetaY"></a>

### fspl-microlensing-event~updateThetaY()
updateThetaY

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateDrel"></a>

### fspl-microlensing-event~updateDrel()
updateDrel

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateThetaE"></a>

### fspl-microlensing-event~updateThetaE()
updateThetaE

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..calculateThetaE"></a>

### fspl-microlensing-event~calculateThetaE()
calculateThetaE

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateTE"></a>

### fspl-microlensing-event~updateTE()
updateTE

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateSliderReadout"></a>

### fspl-microlensing-event~updateSliderReadout()
updateSliderReadout

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateSliders"></a>

### fspl-microlensing-event~updateSliders()
updateSliders

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..resetParams"></a>

### fspl-microlensing-event~resetParams()
resetParams

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateParam"></a>

### fspl-microlensing-event~updateParam()
updateParam

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..redrawCanvases"></a>

### fspl-microlensing-event~redrawCanvases()
redrawCanvases

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateGraph"></a>

### fspl-microlensing-event~updateGraph()
updateGraph

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateGridRange"></a>

### fspl-microlensing-event~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..clearGraph"></a>

### fspl-microlensing-event~clearGraph()
clearGraph

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..xDayToPixel"></a>

### fspl-microlensing-event~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..yMagnifToPixel"></a>

### fspl-microlensing-event~yMagnifToPixel()
yMagnifToPixel

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..drawAxes"></a>

### fspl-microlensing-event~drawAxes()
drawAxes

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..drawAxisLabels"></a>

### fspl-microlensing-event~drawAxisLabels()
drawAxisLabels

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updatePlotScaleAndRange"></a>

### fspl-microlensing-event~updatePlotScaleAndRange()
updatePlotScaleAndRange

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..initPlot"></a>

### fspl-microlensing-event~initPlot()
initPlot

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..plotLightcurve"></a>

### fspl-microlensing-event~plotLightcurve()
plotLightcurve

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..plotLightcurveAlone"></a>

### fspl-microlensing-event~plotLightcurveAlone()
plotLightcurveAlone

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..getThetaX"></a>

### fspl-microlensing-event~getThetaX()
getThetaX

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..updateCurveData"></a>

### fspl-microlensing-event~updateCurveData()
updateCurveData

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..toggleFiniteSource"></a>

### fspl-microlensing-event~toggleFiniteSource()
toggleFiniteSource

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..getTimeTerm"></a>

### fspl-microlensing-event~getTimeTerm()
getTimeTerm

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..getU"></a>

### fspl-microlensing-event~getU()
getU

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..getMagnifFromU"></a>

### fspl-microlensing-event~getMagnifFromU()
getMagnifFromU

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
<a name="module_fspl-microlensing-event..getMagnif"></a>

### fspl-microlensing-event~getMagnif()
getMagnif

**Kind**: inner method of [<code>fspl-microlensing-event</code>](#module_fspl-microlensing-event)  
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
<a name="show-or-hide.module_js"></a>

## js
Show/Hide finite source options module.

<a name="module_utils"></a>

## utils
Uitilities module.Miscellaneous helper functions.

