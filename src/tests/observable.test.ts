import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Observable } from '../index.js'

class Loc extends Observable {
  #label = ''
  get label(): string {
    return this.#label
  }
  set label(v: string) {
    const o = this.#label
    if (o === v) return
    this.#label = v
    // RaisePropertyChanged is protected; a subclass may call it.
    ;(this as unknown as { RaisePropertyChanged(n: string, o: unknown, v: unknown): void }).RaisePropertyChanged(
      'label',
      o,
      v,
    )
  }
}

test('notifies by name on setter change', () => {
  const l = new Loc()
  const seen: Array<[string, unknown]> = []
  l.AddPropertyChangedListener('label', (_o, name, _old, nv) => seen.push([name, nv]))
  l.label = 'Azure'
  assert.equal(l.label, 'Azure')
  assert.deepEqual(seen, [['label', 'Azure']])
})

test('equal-value set fires nothing', () => {
  const l = new Loc()
  let fired = 0
  l.AddPropertyChangedListener('label', () => {
    fired++
  })
  l.label = ''
  assert.equal(fired, 0)
})

test('unsubscribed instance allocates no listener map', () => {
  const l = new Loc()
  assert.equal((l as unknown as { _listeners?: unknown })._listeners, undefined)
})

test('RemovePropertyChangedListener stops delivery', () => {
  const l = new Loc()
  let fired = 0
  const cb = (): void => {
    fired++
  }
  l.AddPropertyChangedListener('label', cb)
  l.RemovePropertyChangedListener('label', cb)
  l.label = 'x'
  assert.equal(fired, 0)
})
