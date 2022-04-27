import { useEffect, useRef, useState } from 'react'
import dicomParser from 'dicom-parser'
import cornerstone from 'cornerstone-core'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import cornerstoneMath from 'cornerstone-math'
import cornerstoneTools from 'cornerstone-tools'
import Hammer from 'hammerjs'
import CornerstoneViewport from 'react-cornerstone-viewport'
import axios from 'axios'

function initCornerstone() {
  // Cornerstone Tools
  cornerstoneTools.external.cornerstone = cornerstone
  cornerstoneTools.external.Hammer = Hammer
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath

  const fontFamily = 'Helvetica, Arial, Lucida Grande, sans-serif'
  cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`)
  cornerstoneTools.toolStyle.setToolWidth(2)
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)')
  cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)')
  cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 })

  cornerstoneTools.init()

  // Image Loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  })
}

initCornerstone()

const view = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '100%',
        height: '100%',
        color: 'white',
      }}
    >
      ??
    </div>
  )
}

function App() {
  const toolsInit = [
    // Mouse
    'FreehandRoi',
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 },
    },
    'Length',
    'Angle',
    'Bidirectional',
    'Eraser',
    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' },
  ]
  const imageIdsInit = [
    'wadouri:/dicomWeb/instances/0d745ca2-bb00b8c2-c72747ab-220ed216-d30d792e/file',
    'dicomweb://s3.amazonaws.com/lury/PTCTStudy/1.3.6.1.4.1.25403.52237031786.3872.20100510032220.12.dcm',
  ]
  const [tools, setTools] = useState(toolsInit)
  const [imageIds, setImageIds] = useState(imageIdsInit)


  const onImageRendered = (e) => {
    const eventData = e.detail
    console.log(eventData, cornerstone)

    // set the canvas context to the image coordinate system
    cornerstone.setToPixelCoordinateSystem(
      eventData.enabledElement,
      eventData.canvasContext
    )
    const context = eventData.canvasContext
    context.beginPath()
    context.strokeStyle = 'white'
    context.lineWidth = 2.5

    context.rect(50, 300, 400, 1000)
    context.stroke()
    context.fillStyle = 'tomato'
    context.font = '100px Arial'
    context.fillText('Tumor Here', 128, 85)

    context.beginPath()
    context.arc(1280, 1280, 20, 0, 2 * Math.PI, false)
    context.fillStyle = 'green'
    context.lineWidth = -1
    context.strokeStyle = 'tomato'
    context.stroke()
  }

  return (
    <div className="CornerstoneViewport">
      <CornerstoneViewport
        tools={tools}
        imageIds={imageIds}
        eventListeners={[
          {
            target: 'element',
            eventName: 'cornerstoneimagerendered',
            handler: onImageRendered,
          },
        ]}
        // activeTool={'FreehandRoi'}
        viewportOverlayComponent={view}
        style={{ width: '512px', height: '512px', flex: '1' }}
      />
    </div>
  )
}

export default App
