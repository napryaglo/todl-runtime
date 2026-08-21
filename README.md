# @pragmatic-lab/todl-runtime

The runtime base for TODL-generated entity classes.

It provides `Observable` — a minimal name/setter `INotifyPropertyChanged`
analog with zero dependency-property overhead. TODL's js-module emitter emits
`class <Concept> extends Observable`, and mural's `MuralBase extends Observable`,
so a generated entity and mural's own visuals share **one** `Observable` class
identity — which is what lets mural's data binding and `DataTemplate` dispatch
treat a realized TODL node as a first-class bindable source.

Zero dependencies by design: neither mural nor the `@pragmatic-lab/todl`
compiler is pulled in.
