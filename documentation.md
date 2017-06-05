## Modules

<dl>
<dt><a href="#module_microlensing_simulation/binary_calculation/bin_ima">microlensing_simulation/binary_calculation/bin_ima</a></dt>
<dd><p>Binary image modules.
Calculates binary image parameters for a particular source position.</p>
</dd>
<dt><a href="#module_bin_len_faster">bin_len_faster</a></dt>
<dd><p>Binary lens module.
Calculates binary image parameters for a range of source positions.</p>
</dd>
<dt><a href="#module_handle-error">handle-error</a></dt>
<dd><p>Error handler module.
Handles exceptions.</p>
<p>Needed to handle exceptions raised when trying to load
a module that is not present.</p>
</dd>
<dt><a href="#module_main">main</a></dt>
<dd><p>Main module.
Main module for interactive microlensing simulator.</p>
</dd>
<dt><a href="#module_PSBL_microlensing_event_animation">PSBL_microlensing_event_animation</a></dt>
<dd><p>Animation module.
Handles animated playback of microlensing event.</p>
</dd>
<dt><a href="#module_PSBL_microlensing_event_lens_plane">PSBL_microlensing_event_lens_plane</a></dt>
<dd><p>Lens Plane Module.
Handles calculation and drawing of the lens plane plot for the microlensing
event.</p>
<p>Depicts the source&#39;s path across the sky when the lenses are held fixed.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#PSBL_microlensing_event">PSBL_microlensing_event</a> : <code>object</code></dt>
<dd><p>Event module.
Handles calculation and drawing lightcurve plot for the microlensing.
event.</p>
<p>Depicts magnification vs. time curve for microlensing event.</p>
<p>Also listens for events from related UI buttons/sliders.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#init">init()</a></dt>
<dd><p>init</p>
</dd>
<dt><a href="#initListeners">initListeners()</a></dt>
<dd><p>initListeners</p>
</dd>
<dt><a href="#initParams">initParams()</a></dt>
<dd><p>initParams</p>
</dd>
<dt><a href="#updateDerivedQuantities">updateDerivedQuantities()</a></dt>
<dd><p>updateDerivedQuantities</p>
</dd>
<dt><a href="#updateU0">updateU0()</a></dt>
<dd><p>updateU0</p>
</dd>
<dt><a href="#updateThetaY">updateThetaY()</a></dt>
<dd><p>updateThetaY</p>
</dd>
<dt><a href="#updateDrel">updateDrel()</a></dt>
<dd><p>updateDrel</p>
</dd>
<dt><a href="#updateThetaE">updateThetaE()</a></dt>
<dd><p>updateThetaE</p>
</dd>
<dt><a href="#calculateThetaE">calculateThetaE()</a></dt>
<dd><p>calculateThetaE</p>
</dd>
<dt><a href="#updateTE">updateTE()</a></dt>
<dd><p>updateTE</p>
</dd>
<dt><a href="#updateSliderReadout">updateSliderReadout()</a></dt>
<dd><p>updateSliderReadout</p>
</dd>
<dt><a href="#updateSliders">updateSliders()</a></dt>
<dd><p>updateSliders</p>
</dd>
<dt><a href="#resetParams">resetParams()</a></dt>
<dd><p>resetParams</p>
</dd>
<dt><a href="#updateParam">updateParam()</a></dt>
<dd><p>updateParam</p>
</dd>
<dt><a href="#redrawCanvases">redrawCanvases()</a></dt>
<dd><p>redrawCanvases</p>
</dd>
<dt><a href="#updateGraph">updateGraph()</a></dt>
<dd><p>updateGraph</p>
</dd>
<dt><a href="#updateGridRange">updateGridRange()</a></dt>
<dd><p>updateGridRange</p>
</dd>
<dt><a href="#clearGraph">clearGraph()</a></dt>
<dd><p>clearGraph</p>
</dd>
<dt><a href="#xDayToPixel">xDayToPixel()</a></dt>
<dd><p>xDayToPixel</p>
</dd>
<dt><a href="#yMagnifToPixel">yMagnifToPixel()</a></dt>
<dd><p>yMagnifToPixel</p>
</dd>
<dt><a href="#drawAxes">drawAxes()</a></dt>
<dd><p>drawAxes</p>
</dd>
<dt><a href="#drawAxisLabels">drawAxisLabels()</a></dt>
<dd><p>drawAxisLabels</p>
</dd>
<dt><a href="#updatePlotScaleAndRange">updatePlotScaleAndRange()</a></dt>
<dd><p>updatePlotScaleAndRange</p>
</dd>
<dt><a href="#initPlot">initPlot()</a></dt>
<dd><p>initPlot</p>
</dd>
<dt><a href="#plotLightcurve">plotLightcurve()</a></dt>
<dd><p>plotLightcurve</p>
</dd>
<dt><a href="#plotLightcurveAlone">plotLightcurveAlone()</a></dt>
<dd><p>plotLightcurveAlone</p>
</dd>
<dt><a href="#getThetaX">getThetaX()</a></dt>
<dd><p>getThetaX</p>
</dd>
<dt><a href="#updateCurveData">updateCurveData()</a></dt>
<dd><p>updateCurveData</p>
</dd>
<dt><a href="#getTimeTerm">getTimeTerm()</a></dt>
<dd><p>getTimeTerm</p>
</dd>
<dt><a href="#getU">getU()</a></dt>
<dd><p>getU</p>
</dd>
<dt><a href="#getMagnifFromU">getMagnifFromU()</a></dt>
<dd><p>getMagnifFromU</p>
</dd>
<dt><a href="#getMagnif">getMagnif()</a></dt>
<dd><p>getMagnif</p>
</dd>
</dl>

<a name="module_microlensing_simulation/binary_calculation/bin_ima"></a>

## microlensing_simulation/binary_calculation/bin_ima
Binary image modules.Calculates binary image parameters for a particular source position.


* [microlensing_simulation/binary_calculation/bin_ima](#module_microlensing_simulation/binary_calculation/bin_ima)
    * [~bin_ima()](#module_microlensing_simulation/binary_calculation/bin_ima..bin_ima)
    * [~compareComplexNumToZero()](#module_microlensing_simulation/binary_calculation/bin_ima..compareComplexNumToZero)

<a name="module_microlensing_simulation/binary_calculation/bin_ima..bin_ima"></a>

### microlensing_simulation/binary_calculation/bin_ima~bin_ima()
bin_ima

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_ima</code>](#module_microlensing_simulation/binary_calculation/bin_ima)  
<a name="module_microlensing_simulation/binary_calculation/bin_ima..compareComplexNumToZero"></a>

### microlensing_simulation/binary_calculation/bin_ima~compareComplexNumToZero()
compareComplexNumToZero

**Kind**: inner method of [<code>microlensing_simulation/binary_calculation/bin_ima</code>](#module_microlensing_simulation/binary_calculation/bin_ima)  
<a name="module_bin_len_faster"></a>

## bin_len_faster
Binary lens module.Calculates binary image parameters for a range of source positions.


* [bin_len_faster](#module_bin_len_faster)
    * [~plot_binary()](#module_bin_len_faster..plot_binary)
    * [~findCausticAndCritCurves()](#module_bin_len_faster..findCausticAndCritCurves)

<a name="module_bin_len_faster..plot_binary"></a>

### bin_len_faster~plot_binary()
plot_binary

**Kind**: inner method of [<code>bin_len_faster</code>](#module_bin_len_faster)  
<a name="module_bin_len_faster..findCausticAndCritCurves"></a>

### bin_len_faster~findCausticAndCritCurves()
findCausticAndCritCurves

**Kind**: inner method of [<code>bin_len_faster</code>](#module_bin_len_faster)  
<a name="module_handle-error"></a>

## handle-error
Error handler module.Handles exceptions.Needed to handle exceptions raised when trying to loada module that is not present.

<a name="exp_module_handle-error--module.exports"></a>

### module.exports() ⏏
handle

**Kind**: Exported function  
<a name="module_main"></a>

## main
Main module.Main module for interactive microlensing simulator.

<a name="module_main..init"></a>

### main~init()
init

**Kind**: inner method of [<code>main</code>](#module_main)  
<a name="module_PSBL_microlensing_event_animation"></a>

## PSBL_microlensing_event_animation
Animation module.Handles animated playback of microlensing event.


* [PSBL_microlensing_event_animation](#module_PSBL_microlensing_event_animation)
    * [~init()](#module_PSBL_microlensing_event_animation..init)
    * [~updateMinAndMaxTimes()](#module_PSBL_microlensing_event_animation..updateMinAndMaxTimes)
    * [~initListeners()](#module_PSBL_microlensing_event_animation..initListeners)
    * [~run()](#module_PSBL_microlensing_event_animation..run)
    * [~updateTime()](#module_PSBL_microlensing_event_animation..updateTime)
    * [~animateFrame()](#module_PSBL_microlensing_event_animation..animateFrame)
    * [~animateFrameSource()](#module_PSBL_microlensing_event_animation..animateFrameSource)
    * [~updatePlayback()](#module_PSBL_microlensing_event_animation..updatePlayback)

<a name="module_PSBL_microlensing_event_animation..init"></a>

### PSBL_microlensing_event_animation~init()
init

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..updateMinAndMaxTimes"></a>

### PSBL_microlensing_event_animation~updateMinAndMaxTimes()
updateMinAndMaxTimes

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..initListeners"></a>

### PSBL_microlensing_event_animation~initListeners()
initListeners

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..run"></a>

### PSBL_microlensing_event_animation~run()
run

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..updateTime"></a>

### PSBL_microlensing_event_animation~updateTime()
updateTime

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..animateFrame"></a>

### PSBL_microlensing_event_animation~animateFrame()
animateFrame

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..animateFrameSource"></a>

### PSBL_microlensing_event_animation~animateFrameSource()
animateFrameSource

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_animation..updatePlayback"></a>

### PSBL_microlensing_event_animation~updatePlayback()
updatePlayback

**Kind**: inner method of [<code>PSBL_microlensing_event_animation</code>](#module_PSBL_microlensing_event_animation)  
<a name="module_PSBL_microlensing_event_lens_plane"></a>

## PSBL_microlensing_event_lens_plane
Lens Plane Module.Handles calculation and drawing of the lens plane plot for the microlensingevent.Depicts the source's path across the sky when the lenses are held fixed.Also listens for events from related UI buttons/sliders.


* [PSBL_microlensing_event_lens_plane](#module_PSBL_microlensing_event_lens_plane)
    * [~Lens](#module_PSBL_microlensing_event_lens_plane..Lens)
        * [new Lens()](#new_module_PSBL_microlensing_event_lens_plane..Lens_new)
    * [~drawing](#module_PSBL_microlensing_event_lens_plane..drawing)
    * [~init()](#module_PSBL_microlensing_event_lens_plane..init)
    * [~initListeners()](#module_PSBL_microlensing_event_lens_plane..initListeners)
    * [~initLenses()](#module_PSBL_microlensing_event_lens_plane..initLenses)
    * [~initSourceRadius()](#module_PSBL_microlensing_event_lens_plane..initSourceRadius)
    * [~updateSourceRadiusSlider()](#module_PSBL_microlensing_event_lens_plane..updateSourceRadiusSlider)
    * [~updateSourceRadius()](#module_PSBL_microlensing_event_lens_plane..updateSourceRadius)
    * [~initSourcePos()](#module_PSBL_microlensing_event_lens_plane..initSourcePos)
    * [~redraw()](#module_PSBL_microlensing_event_lens_plane..redraw)
    * [~updateScaleAndRangeValues()](#module_PSBL_microlensing_event_lens_plane..updateScaleAndRangeValues)
    * [~updateDrawingValues()](#module_PSBL_microlensing_event_lens_plane..updateDrawingValues)
    * [~thetaXtoPixel()](#module_PSBL_microlensing_event_lens_plane..thetaXtoPixel)
    * [~xDayToPixel()](#module_PSBL_microlensing_event_lens_plane..xDayToPixel)
    * [~thetaYtoPixel()](#module_PSBL_microlensing_event_lens_plane..thetaYtoPixel)
    * [~getThetaX()](#module_PSBL_microlensing_event_lens_plane..getThetaX)
    * [~getThetaYpathValue()](#module_PSBL_microlensing_event_lens_plane..getThetaYpathValue)
    * [~updateGridRange()](#module_PSBL_microlensing_event_lens_plane..updateGridRange)
    * [~xDayToThetaX()](#module_PSBL_microlensing_event_lens_plane..xDayToThetaX)

<a name="module_PSBL_microlensing_event_lens_plane..Lens"></a>

### PSBL_microlensing_event_lens_plane~Lens
**Kind**: inner class of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="new_module_PSBL_microlensing_event_lens_plane..Lens_new"></a>

#### new Lens()
A lens -- one of the two binary lenses.

<a name="module_PSBL_microlensing_event_lens_plane..drawing"></a>

### PSBL_microlensing_event_lens_plane~drawing
drawing

**Kind**: inner property of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..init"></a>

### PSBL_microlensing_event_lens_plane~init()
init

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..initListeners"></a>

### PSBL_microlensing_event_lens_plane~initListeners()
initListeners

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..initLenses"></a>

### PSBL_microlensing_event_lens_plane~initLenses()
initLenses

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..initSourceRadius"></a>

### PSBL_microlensing_event_lens_plane~initSourceRadius()
initSourceRadius

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..updateSourceRadiusSlider"></a>

### PSBL_microlensing_event_lens_plane~updateSourceRadiusSlider()
updateSourceRadiusSlider

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..updateSourceRadius"></a>

### PSBL_microlensing_event_lens_plane~updateSourceRadius()
updateSourceRadius

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..initSourcePos"></a>

### PSBL_microlensing_event_lens_plane~initSourcePos()
initSourcePos

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..redraw"></a>

### PSBL_microlensing_event_lens_plane~redraw()
redraw

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..updateScaleAndRangeValues"></a>

### PSBL_microlensing_event_lens_plane~updateScaleAndRangeValues()
updateScaleAndRangeValues

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..updateDrawingValues"></a>

### PSBL_microlensing_event_lens_plane~updateDrawingValues()
updateDrawingValues

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..thetaXtoPixel"></a>

### PSBL_microlensing_event_lens_plane~thetaXtoPixel()
thetaXtoPixel

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..xDayToPixel"></a>

### PSBL_microlensing_event_lens_plane~xDayToPixel()
xDayToPixel

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..thetaYtoPixel"></a>

### PSBL_microlensing_event_lens_plane~thetaYtoPixel()
thetaYtoPixel

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..getThetaX"></a>

### PSBL_microlensing_event_lens_plane~getThetaX()
getThetaX

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..getThetaYpathValue"></a>

### PSBL_microlensing_event_lens_plane~getThetaYpathValue()
getThetaYpathValue

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..updateGridRange"></a>

### PSBL_microlensing_event_lens_plane~updateGridRange()
updateGridRange

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="module_PSBL_microlensing_event_lens_plane..xDayToThetaX"></a>

### PSBL_microlensing_event_lens_plane~xDayToThetaX()
xDayToThetaX

**Kind**: inner method of [<code>PSBL_microlensing_event_lens_plane</code>](#module_PSBL_microlensing_event_lens_plane)  
<a name="PSBL_microlensing_event"></a>

## PSBL_microlensing_event : <code>object</code>
Event module.Handles calculation and drawing lightcurve plot for the microlensing.event.Depicts magnification vs. time curve for microlensing event.Also listens for events from related UI buttons/sliders.

**Kind**: global namespace  
<a name="init"></a>

## init()
init

**Kind**: global function  
<a name="initListeners"></a>

## initListeners()
initListeners

**Kind**: global function  
<a name="initParams"></a>

## initParams()
initParams

**Kind**: global function  
<a name="updateDerivedQuantities"></a>

## updateDerivedQuantities()
updateDerivedQuantities

**Kind**: global function  
<a name="updateU0"></a>

## updateU0()
updateU0

**Kind**: global function  
<a name="updateThetaY"></a>

## updateThetaY()
updateThetaY

**Kind**: global function  
<a name="updateDrel"></a>

## updateDrel()
updateDrel

**Kind**: global function  
<a name="updateThetaE"></a>

## updateThetaE()
updateThetaE

**Kind**: global function  
<a name="calculateThetaE"></a>

## calculateThetaE()
calculateThetaE

**Kind**: global function  
<a name="updateTE"></a>

## updateTE()
updateTE

**Kind**: global function  
<a name="updateSliderReadout"></a>

## updateSliderReadout()
updateSliderReadout

**Kind**: global function  
<a name="updateSliders"></a>

## updateSliders()
updateSliders

**Kind**: global function  
<a name="resetParams"></a>

## resetParams()
resetParams

**Kind**: global function  
<a name="updateParam"></a>

## updateParam()
updateParam

**Kind**: global function  
<a name="redrawCanvases"></a>

## redrawCanvases()
redrawCanvases

**Kind**: global function  
<a name="updateGraph"></a>

## updateGraph()
updateGraph

**Kind**: global function  
<a name="updateGridRange"></a>

## updateGridRange()
updateGridRange

**Kind**: global function  
<a name="clearGraph"></a>

## clearGraph()
clearGraph

**Kind**: global function  
<a name="xDayToPixel"></a>

## xDayToPixel()
xDayToPixel

**Kind**: global function  
<a name="yMagnifToPixel"></a>

## yMagnifToPixel()
yMagnifToPixel

**Kind**: global function  
<a name="drawAxes"></a>

## drawAxes()
drawAxes

**Kind**: global function  
<a name="drawAxisLabels"></a>

## drawAxisLabels()
drawAxisLabels

**Kind**: global function  
<a name="updatePlotScaleAndRange"></a>

## updatePlotScaleAndRange()
updatePlotScaleAndRange

**Kind**: global function  
<a name="initPlot"></a>

## initPlot()
initPlot

**Kind**: global function  
<a name="plotLightcurve"></a>

## plotLightcurve()
plotLightcurve

**Kind**: global function  
<a name="plotLightcurveAlone"></a>

## plotLightcurveAlone()
plotLightcurveAlone

**Kind**: global function  
<a name="getThetaX"></a>

## getThetaX()
getThetaX

**Kind**: global function  
<a name="updateCurveData"></a>

## updateCurveData()
updateCurveData

**Kind**: global function  
<a name="getTimeTerm"></a>

## getTimeTerm()
getTimeTerm

**Kind**: global function  
<a name="getU"></a>

## getU()
getU

**Kind**: global function  
<a name="getMagnifFromU"></a>

## getMagnifFromU()
getMagnifFromU

**Kind**: global function  
<a name="getMagnif"></a>

## getMagnif()
getMagnif

**Kind**: global function  
