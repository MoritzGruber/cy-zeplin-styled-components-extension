import Layer from 'zeplin-extension-style-kit/elements/layer'
import Color from 'zeplin-extension-style-kit/values/color'
import genTextStylesFromContext from './genTextStylesFromContext'

function getVariableMap(projectColors) {
  return projectColors.reduce((variableMap, color) => {
    variableMap[new Color(color).valueOf()] = 'var(--' + color.name + ')'
    return variableMap
  }, {})
}

function filterDeclarations(declarations, textStyleMatch) {
  return declarations.filter(d => {
    if (
      textStyleMatch &&
      (d.name === 'font-size' ||
        d.name === 'font-family' ||
        d.name === 'font-weight' ||
        d.name === 'letter-spacing' ||
        d.name === 'line-height')
    ) {
      return false
    }


    if ((d.name === 'height' || d.name === 'width')) {
      return false
    }

    return !(d.hasDefaultValue && d.hasDefaultValue())
  })
}

function joinRules(rules) {
  return 'export const SBox = styled.div`\n' + rules.join('\n') + '\n`'
}

function declarationsToString(declarations, variableMap, textStyleMatch) {
  const filteredDeclarations = filterDeclarations(declarations, textStyleMatch)
  const textStyleMixins = textStyleMatch ? ['  ${' + `CSS${textStyleMatch.name}` + '}'] : []
  const rules = [
    ...textStyleMixins,
    ...filteredDeclarations.map(
      d => `  ${d.name}: ${d.getValue({ densityDivisor: 1 }, variableMap)};`
    )
  ]

  return joinRules(rules)
}

const findTextStyleMatch = (defaultTextStyle, fontTheme) => {
  const curr = {
    fontSize: defaultTextStyle.fontSize,
    fontFamily: defaultTextStyle.fontFamily,
    weightText: defaultTextStyle.weightText,
    letterSpacing: defaultTextStyle.letterSpacing,
    lineHeight: Math.trunc(defaultTextStyle.lineHeight),
  }
  const res = fontTheme.find(tf => {
    return (tf.fontSize === curr.fontSize && tf.fontFamily === curr.fontFamily && tf.weightText === curr.weightText && tf.lineHeight === curr.lineHeight && tf.letterSpacing === curr.letterSpacing);
  })

  if (!res) {
    return undefined
  }

  return {
    name: `${res && res.name}`
  }

}

let fontTheme = undefined;
export default function layer(context, selectedLayer) {
  // return `${JSON.stringify({ context, selectedLayer })}`
  const project = (context.project || context._project)
  if (!fontTheme) {
    fontTheme = genTextStylesFromContext(context)
  }
  const l = new Layer(selectedLayer)
  const layerRuleSet = l.style
  const { defaultTextStyle } = selectedLayer
  const isText = selectedLayer.type === 'text' && defaultTextStyle
  const textStyleMatch = findTextStyleMatch(defaultTextStyle, fontTheme)

  if (isText) {
    const declarations = l.getLayerTextStyleDeclarations(defaultTextStyle)
    declarations.forEach(p => layerRuleSet.addDeclaration(p))
  }

  const variableMap = getVariableMap(project.colors.length > 0 ? project.colors : ((project.colors && project.colors.length > 0 && project.colors ) || (project.linkedStyleguide && project.linkedStyleguide.colors)))
  const code = declarationsToString(layerRuleSet.declarations, variableMap, textStyleMatch)

  return {
    code: code,
    language: 'js'
  }
}
