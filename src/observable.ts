// Minimal INotifyPropertyChanged analog. Change notification keyed by
// property NAME, driven by subclass getters/setters that call
// `RaisePropertyChanged`. No dependency-property machinery — the shared
// base for both mural's MuralBase and TODL-generated entity classes, so a
// realized TODL node and a mural visual share one `Observable` identity.
export type PropertyChangeCallback = (
  owner: Observable,
  property: string,
  old_value: any,
  new_value: any,
) => void

export class Observable {
  // Lazily allocated on first subscribe: property NAME → callbacks. An
  // Observable that is never subscribed to allocates nothing beyond its own
  // fields.
  private _listeners?: Map<string, PropertyChangeCallback[]>

  public AddPropertyChangedListener(name: string, callback: PropertyChangeCallback): void {
    const listeners = (this._listeners ??= new Map())
    let arr = listeners.get(name)
    if (arr === undefined) {
      arr = []
      listeners.set(name, arr)
    }
    arr.push(callback)
  }

  public RemovePropertyChangedListener(name: string, callback: PropertyChangeCallback): void {
    const arr = this._listeners?.get(name)
    if (arr === undefined) return
    const i = arr.indexOf(callback)
    if (i >= 0) arr.splice(i, 1)
  }

  // Subclass setters call this AFTER writing the backing field, only on a
  // real change. Fires (owner, name, old, new) — the callback arity mural's
  // binding engine consumes.
  protected RaisePropertyChanged(name: string, oldValue: unknown, newValue: unknown): void {
    const cbs = this._listeners?.get(name)
    if (cbs) for (const cb of [...cbs]) cb(this, name, oldValue, newValue)
  }
}
