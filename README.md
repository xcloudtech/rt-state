# rt-state

> A reactive state management library for React and React Native that eliminates the mental burden of React Hooks while providing fine-grained reactivity and automatic dependency tracking.

[![npm version](https://badge.fury.io/js/rt-state.svg)](https://badge.fury.io/js/rt-state)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## 🚀 Why rt-state?

Traditional React development often involves:
- Mental burden of dependency arrays in `useEffect`, `useMemo`, `useCallback`
- Unnecessary re-renders when state changes
- Complex patterns for sharing state between components
- Repetitive initialization of state and functions on every render

**rt-state solves these problems by:**
- ✅ **Automatic dependency tracking** - No more dependency arrays
- ✅ **Fine-grained reactivity** - Only components that use changed data re-render
- ✅ **Closure-based state** - Define state and functions once, use them everywhere
- ✅ **Unified state management** - No distinction between local and global state
- ✅ **React Hooks compatibility** - Works alongside existing React patterns

## 📦 Installation

```bash
npm install rt-state
# or
yarn add rt-state
# or
pnpm add rt-state
```

## 🎯 Quick Start

### Basic Counter Example

```tsx
import { create, state } from 'rt-state';

const Counter = create<{ title: string }>((ctx) => {
  // State is created once, persists across re-renders
  const data = state({ count: 0 });
  
  // Functions are created once, no need for useCallback
  const increment = () => data.count++;
  const decrement = () => data.count--;
  
  // Return the render function
  return (props) => (
    <div>
      <h2>{props.title}</h2>
      <p>Count: {data.count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
});

// Usage
<Counter title="My Counter" />
```


## 📚 Core Concepts

### 1. State Management

#### `state(initialValue)` - Object State
For objects where you want to track field-level changes:

```tsx
const data = state({ name: 'John', age: 25, city: 'NYC' });

// Only components using `name` will re-render
data.name = 'Jane';

// For nested objects, change the reference
data.address = { ...data.address, street: 'New Street' };
```

#### `stateS(initialValue)` - Single Value State
For primitive values or when you want to track the entire value:

```tsx
const count = stateS(0);
const message = stateS('Hello');
const items = stateS([1, 2, 3]);

// Update the value
count.value = 10;
message.value = 'World';
items.value = [...items.value, 4];

// Force update without changing value
count.forceUpdate();
```

#### `stateArray(initialValue)` - Optimized Long Arrays
For large arrays where you want item-level reactivity:

```tsx
const longList = stateArray([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  // ... many items
]);

// Only the specific item component re-renders
longList.getItem(0).name = 'Updated Item 1';
```

### 2. Component Creation

#### `create(setup)` - Main Component Creator
```tsx
const MyComponent = create<Props>((ctx) => {
  // Setup phase - runs once
  const localState = state({ data: 'initial' });

  // Lifecycle hooks
  ctx.onDispose(() => {
    console.log('Component unmounting');
  });
  
  // Watch state changes
  watch(
    () => console.log('State changed:', localState.data),
    () => [localState.data]
  );
  
  // Return render function
  return (props) => (
    <div>
      <p>{props.title}</p>
      <p>{localState.data}</p>
    </div>
  );
});
```

#### `createS(render)` - Simplified Components
For simple components without setup logic:

```tsx
const SimpleComponent = createS<Props>((props) => {
  // Use React hooks normally or rt-state hooks
  const localState = useRState({ count: 0 });
  
  return (
    <div>
      <p>Count: {localState.count}</p>
      <button onClick={() => localState.count++}>+</button>
    </div>
  );
});
```

### 3. Advanced Features

#### Computed Values with `link`
```tsx
const firstName = stateS('John');
const lastName = stateS('Doe');

const fullName = link(
  () => `${firstName.value} ${lastName.value}`, // getter
  (value: string) => {  // setter
    const [first, last] = value.split(' ');
    firstName.value = first;
    lastName.value = last;
  }
);

// Use like a regular state
console.log(fullName.value); // "John Doe"
fullName.value = "Jane Smith"; // Updates both firstName and lastName
```

#### Watching State Changes
```tsx
const data = state({ count: 0, name: 'test' });

// Watch specific dependencies
const watcher = watch(
  () => console.log('Count changed:', data.count),
  () => [data.count], // Only triggers when count changes
  { compare: true } // Compare old vs new values
);

// Global watchers (outside components)
watch(
  () => console.log('Global state changed'),
  () => [globalState.value],
  { global: true }
);
```

#### Provider Pattern
```tsx
// Create a provider
const DataProvider = createProvider<{ user: User }>();

// Use in parent component
const ParentComponent = create((ctx) => {
  const userData = state({ user: currentUser });
  
  return (props) => (
    <DataProvider.Provider value={userData}>
      <ChildComponent />
    </DataProvider.Provider>
  );
});

// Access in child components
const ChildComponent = create((ctx) => {
  const parentData = DataProvider.use(); // Accesses parent's userData
  
  return () => <div>User: {parentData.user.name}</div>;
});
```

### 4. React Hooks Integration

Use existing React hooks within rt-state components:

```tsx
const MyComponent = create((ctx) => {
  // Wrap React hooks in the hooks() function
  const [reactState, setReactState] = hooks(() => 
    React.useState('initial')
  );
  
  const effectRef = hooks(() => {
    React.useEffect(() => {
      console.log('Effect ran');
    }, []);
  });
  
  return () => <div>{reactState}</div>;
});
```

### 5. Fine-Grained Reactivity with `view`

For ultra-fine control over what re-renders:

```tsx
const data = state({ x: 1, y: 2, z: 3 });

const Component = createS(() => (
  <div>
    {/* Only re-renders when data.x changes */}
    {view(() => <span>X: {data.x}</span>)}
    
    {/* Only re-renders when data.y changes */}
    {view(() => <span>Y: {data.y}</span>)}
    
    {/* This div never re-renders unless props change */}
    <div>Static content</div>
  </div>
));
```

## 🛠️ API Reference

### State APIs
- `state<T>(initialValue: T): State<T>` - Creates reactive object state
- `stateS<T>(initialValue: T): StateS<T>` - Creates reactive single value state  
- `stateArray<T>(initialValue: T[]): StateArray<T>` - Creates optimized array state
- `extract(state): T` - Extracts plain value from state
- `setState(state, newValue)` - Batch update state

### Component APIs
- `create<T>(setup: (ctx: Context<T>) => RenderFunction): React.FC<T>`
- `createS<T>(render: (props: T) => JSX.Element, config?): React.FC<T>`
- `view(render: () => JSX.Element): JSX.Element` - Fine-grained reactivity

### Reactivity APIs
- `watch(callback, deps, options?)` - Watch state changes
- `link(getter, setter?, options?)` - Create computed values
- `hooks(callback)` - Integrate React hooks

### Provider APIs
- `createProvider<T>(): Provider<T>` - Create context provider
- `provider.use(): T` - Access provider data

### Utility APIs
- `useRState(initial)` - React hook version of `state`
- `useRStateS(initial)` - React hook version of `stateS`
- `useRStateArray(initial)` - React hook version of `stateArray`
- `useOnce(callback)` - Run callback only once

## 🎭 Migration Guide

### From useState to rt-state
```tsx
// Before (useState)
const [count, setCount] = useState(0);
const increment = useCallback(() => setCount(c => c + 1), []);

// After (rt-state)
const count = stateS(0);
const increment = () => count.value++;
```

### From useContext to rt-state
```tsx
// Before (useContext)
const ThemeContext = createContext();
const theme = useContext(ThemeContext);

// After (rt-state)
const ThemeProvider = createProvider<{ theme: string }>();
const theme = ThemeProvider.use();
```

### From useEffect to rt-state
```tsx
// Before (useEffect)
useEffect(() => {
  console.log('Count changed:', count);
}, [count]);

// After (rt-state)
watch(
  () => console.log('Count changed:', count.value),
  () => [count.value]
);
```

## 🚀 Performance Tips

1. **Use `state` for objects**, `stateS` for primitives and arrays
2. **Use `stateArray` for large lists** (> 100 items)
3. **Use `view` for fine-grained reactivity** in large components
4. **Prefer `link` over manual computed values** for better caching
5. **Use `React.memo` sparingly** - rt-state handles most optimizations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [xvv](https://github.com/xcloudtech)

## 🔗 Links

- [GitHub](https://github.com/xcloudtech/rt-state)
- [npm](https://www.npmjs.com/package/rt-state)
- [Issues](https://github.com/xcloudtech/rt-state/issues)

---

**Happy coding with rt-state! 🎉**
