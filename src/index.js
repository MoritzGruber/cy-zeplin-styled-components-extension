import layer from './layer'
import genTextStylesFromContext from './genTextStylesFromContext'

const Extension = {
  layer,
  textStyles: (a) => {
    return {
      code: genTextStylesFromContext(a).map(e => e.code).join(''),
      language: 'js'
    }
  },
}

export default Extension;

