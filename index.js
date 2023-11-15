const maxApi = require('max-api')
const fs = require('fs')


maxApi.post('---> Script started')
loadConfiguration()

let variation = 0
const configPath = './config.json';
const variations = [
  [1,3,4,6,7],
  [2,3,5],
  [1,6,7],
  [1,2,7],
  [1,4,7],
  [1,3,5,7],
  [1, 2, 3, 4, 5, 6, 7],
]

function loadConfiguration(){
  if(fs.existsSync(configPath)){
    variations = fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })
    // todo send a signal to a led of successful loading
  }
}

function getVariation(variationNumber) {
  const variationArr = variations[variationNumber]
  // maxApi.post('---> variationArr ', variationArr)
  return variationArr
}

function mapControlChangeToWhammy(midiValue, steps, mapArray) {
  let pointer = 0
  const sectorSize = 127 / steps
  for (let i = 0; i <= steps; i++) {
    if (midiValue >= sectorSize * i && midiValue <= sectorSize * (i + 1)) {
      pointer = i
    }
  }

  return mapArray[pointer]
}

///////////////////=-HANDLERS-=/////////////////////

// main logic
maxApi.addHandler('midi', (ccNum, ccVal) => {
  ccVal = 127 - ccVal
  // maxApi.post('---> midiValue pre ', ccNum, ccVal)

  if (ccNum !== 123) { // prevenr Ableton's sending CC-123 when a track stops
    maxApi.outlet(mapControlChangeToWhammy(ccVal, variations[variation].length, getVariation(variation)))
  }
})

// handle the 'variation' knob
maxApi.addHandler('variation', (variationVal) => {
  // maxApi.post('---> varValue in ', variationVal)
  variation = variationVal
})
