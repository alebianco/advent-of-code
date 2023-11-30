export class Deferred extends Promise {
  resolver
  rejecter

  constructor (executor) {
    let resolver
    let rejecter
    super((resolve, reject) => {
      resolver = resolve
      rejecter = reject
      if (executor !== undefined) {
        executor(resolve, reject)
      }
    })
    this.resolver = resolver
    this.rejecter = rejecter
  }

  resolve (value) {
    this.resolver(value)
  }

  reject (reason) {
    this.rejecter(reason)
  }
}
