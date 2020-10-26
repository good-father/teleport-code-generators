export const unicode2Chinese = (input: string) => {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, $1: string) => {
    const v = parseInt($1, 16).toString(10)
    // @ts-ignore
    return String.fromCharCode(v)
  })
}
