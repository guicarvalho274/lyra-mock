// scripts/inline-css.js
import { readFileSync, writeFileSync } from 'node:fs'

const css = readFileSync('src/styles/main.css', 'utf-8')
const out = `export const styles = ${JSON.stringify(css)}\n`
writeFileSync('src/styles/main.generated.ts', out)