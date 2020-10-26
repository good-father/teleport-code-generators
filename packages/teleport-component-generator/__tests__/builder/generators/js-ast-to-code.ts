import { generator } from '../../../src/builder/generators/js-ast-to-code'
import astForm from './ast-form.json'
import prettierJSX from '@teleporthq/teleport-postprocessor-prettier-jsx'

describe('generator', () => {
  it('generator code with ast', () => {
    // @ts-ignore
    const codeStr = generator(astForm)

    expect(prettierJSX({ js: codeStr }).js).toBe(
      prettierJSX({
        js: `const Form = () => {
        return <div><Helmet><title>表单页示例
            </title></Helmet><HtForm buttons={["submit"]} fields={[{
            "field": "name",
            "title": "姓名",
            "v-if": "<%:= true %>",
            "colProps": {},
            "disabled": false
          }]}></HtForm>
        </div>;
      };`,
      }).js
    )
  })
})
