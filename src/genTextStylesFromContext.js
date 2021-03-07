
const genTextStylesFromContext = (a) => {
    const all = a._project.linkedStyleguide.textStyles.map(e => {
        const lines = [];
        lines.push(`font-size: ${e.fontSize}px;\n`)
        lines.push(`font-family: ${e.fontFamily};\n`)
        if (e.lineHeight) {
            lines.push(`line-height: ${Math.trunc(e.lineHeight)}px;\n`)
        }
        if (e.letterSpacing) {
            lines.push(`letter-spacing: ${e.letterSpacing};\n`)
        }
        if (e.weightText) {
            switch (`${e.weightText}`.toLowerCase()) {
                case 'light':
                    lines.push(`font-weight: 300;\n`)
                    break;
                case 'normal':
                    lines.push(`font-weight: 400;\n`)
                    break;
                case 'regular':
                    lines.push(`font-weight: 400;\n`)
                    break;
                case 'medium':
                    lines.push(`font-weight: 500;\n`)
                    break;
                case 'semibold' || (`${e.weightText}`.toLowerCase().includes('bold') && `${e.weightText}`.toLowerCase().includes('semi')):
                    lines.push(`font-weight: 600;\n`)
                    break;
                case 'bold':
                    lines.push(`font-weight: 700;\n`)
                    break;
                default:
                    lines.push(`font-weight: ${`${e.weightText}`.toLowerCase()};\n`)
                    break;
            }
        }
        const name = e.name.replace("/", '').replace("/", '');
        const code = `const CSS${name} = css\`\n${lines.join('')}\`;\n\n`
        return {
            weightText: e.weightText,
            letterSpacing: e.letterSpacing,
            lineHeight: Math.trunc(e.lineHeight),
            fontSize: e.fontSize,
            fontFamily: e.fontFamily,
            name,
            code
        }
    }).sort((a, b) => a.name - b.name);
    return all
}

export default genTextStylesFromContext;