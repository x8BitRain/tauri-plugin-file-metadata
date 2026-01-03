import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cwd } from 'node:process'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

const pkg = JSON.parse(readFileSync(join(cwd(), 'package.json'), 'utf8'))

const pluginJsName = pkg.name
  .replace('tauri-plugin-', '')
  .replace(/-./g, (x) => x[1].toUpperCase())
const iifeVarName = `__TAURI_PLUGIN_${pkg.name
  .replace('tauri-plugin-', '')
  .replace(/-/g, '_')
  .toUpperCase()}__`

export default [
  {
    input: 'guest-js/index.ts',
    output: [
      {
        file: pkg.exports.import,
        format: 'esm'
      },
      {
        file: pkg.exports.require,
        format: 'cjs'
      }
    ],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: dirname(pkg.exports.import)
      })
    ],
    external: [
      /^@tauri-apps\/api/,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    onwarn: (warning) => {
      throw Object.assign(new Error(), warning)
    }
  },

  {
    input: 'guest-js/index.ts',
    output: {
      format: 'iife',
      name: iifeVarName,
      banner: "if ('__TAURI__' in window) {",
      footer: `Object.defineProperty(window.__TAURI__, '${pluginJsName}', { value: ${iifeVarName} }) }`,
      file: 'api-iife.js'
    },
    plugins: [
      typescript({
        declaration: false
      }),
      terser(),
      nodeResolve()
    ],
    onwarn: (warning) => {
      throw Object.assign(new Error(), warning)
    }
  }
]
