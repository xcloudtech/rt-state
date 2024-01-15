# rt-state

> Another library for the state management in React and React Native. It can be used to replace React Hooks APIs. It can also be used together with React Hooks API, or calls any other library which depends on React Hooks API.

### Features

1. Automatically track the dependency between views and states, and only update the views depending on the changed state values.
2. Unify local state and global state management. So, don't need `useContext` or wrap the component with `Provider` anymore. (rt-state has its own provider, call `provider.use()` to get data from parent or create global state, and share between different components.)
3. Fine granularity of controlling when and how to update the view with `watch`/`link` functions.
4. An optimized `state` function for long Array.
5. React Hooks API integration. React Hooks API Calls can be wrapped by `hooks` within the `setup` function.


### Reasons

In react, there are class-based components and function-based components. In most cases, function components in react can be thought of very simply. However, Hooks API has mental burden, especially for new learners. Also, because there is no state within the function, we have to repeatedly initialize the state and even redefine local functions again and again before each re-rendering. 

Another issue is if we create a state in a root component, and use it in its children, when one of its children updates the state value, the whole root component will be re-rendered. There are many ways to optimize it. 
  
  - use `React.memo` or `useMemo`. However, `React.memo` is not default for each component.
  - even when `React.memo` is used, it is still not easy to optimize. For example, if you use a callback function as one of its parameters, the reference of the callback would be changed during each re-rendering of its parent component. So, you might need `useCallback` for callback and use `useRef` for caching local data. But `useCallback` needs a dependency list. Then you will be struggling to set the dependency list. As the project becomes large, such kind of code could be problematic, and hard to maintain.

I need a library, with which I can use function components happily! 

### Solution

In rt-state, it uses `create` function to create components, which takes a `setup` callback function as its parameter. The `setup` function is used to initialize states with `state`/`stateS`/`stateArray`, or call `watch`/`link` functions, or even create any local variables and user defined functions. Then, it returns a render function. The returned `render` function is used for re-rendering the component afterwards.

As you see, rt-state creates variables within the `closure` of `setup` callback. So, all of the variables are accessible to the `render` function. We don't have to redefine the local data or callback functions repeatedly, because the `closure` can keep the references of data or functions be the same as before. Now, you don't have to use `useCallback` or `useRef` any more. Just use the local variables and local functions directly.

Next question is how and when to update the components when data changes. The solution is use `reactive` data. `reactive` means when its value changes, it will trigger an update of whatever depending on it. rt-state is able to track the dependency between data and views automatically. When the data changes, rt-state only updates those components which depend on the data. So, the data is a `reactive` version of any local or global variables. In rt-state, such kind of data can be created by `state`/`stateS`/`stateLongArray` functions.

To sum up, the final solution is:
  
  * use `closure` to keep the reference of data and function.
  * use `reactive` data to trigger the update of the components when needed. the `reactive` feature is implemented by javascript Proxy API.
  

### How to Use

```
npm i rt-state@latest -S
```

```js
    const Demo = create<{ name: string }>((ctx) => {
        const data = state({ num: 666 });
        const addOne = () => data.num++;
    
        return (props) => {
            return (
                <div>
                    <span>
                        {props.name} {data.num}
                    </span>
                    <button onClick={addOne}>addOne</button>
                </div>
            );
        };
    });

render(<Demo name={'demo'} />, document.getElementById('root'));
```
More examples of code can be found in `/src/demo`.
or see [demo](https://duchiporexia.github.io/rt-state)


### rt-state Core APIs

   It contains state, create, watch and hooks integration APIs. All APIs are only-once functions, which means they can not be called in the `render` function.
   
   They should be used in two ways:
   
   * Use them Globally, such as creating components with `create`/`createS` functions or creating global reactive data with `state` function or use `watch` function out of any components to watch global shared states.
   * Use them within a `setup` function which is the parameter of the `create` function.

#### state APIs

  These APIs are used to create `reactive` data.
  
  `state` is used for watching any field value changes within an object, while, `stateS` is used for watching its own value change, commonly for primitive variables like `number` or `string`.

  However, both are reactive only when the reference of value changes, and just watch the field values of the data, which is quite straightforward and simple.
   
   Anyway, if you are desperate for all field values within a nested object to be reactive recursively, you can just wrap the value with another `state`/`stateS` functions. But it is unnecessary for most cases. Here is an example. 
   
   ```js
     const data = state({ v: state({ v: state({ v: 666 }) }) });
   ```
   To use `state`/`stateS` in `React` functional component, please use `useRState`/`useRStateS`, and in order to make the `dom` reactive, you should use `rst.view` to wrap the `dom`.

- [state](https://github.com/duchiporexia/rt-state#create)

  The variable returned by `state` is a `reactive` object, which contains several fields. Each field is reactive. For example, `data.v = 666` will trigger an update of the state dependants. WARNING: `data = newValue` will not trigger an update. So, keep in mind that only the fields are reactive, the data itself is not reactive. If you want to watch the data itself. Please use `stateS` function.
  
  Besides, the field of the field is not reactive as well. It means that `line 2` of the following code will not update its dependants. Because the reference of `data.v` is the same as before.

   ```js
   const data = state({v: {v1: 1, v2: 2}});
   data.v.v1 = 3; // This will not trigger an update of its dependants.
   data.v = {...data.v}; // Here, it will update its dependants. Because the reference of data.v has been changed.
   const content = extract(data); // `content` contains all fields of data.
   ```

   So, in this case, if you want to trigger an update, you need change the reference by `{...value}` for object, or `[...value]` for array. 
   
   Use it in React.FC, call `useRState`.
   
- [stateS](https://github.com/duchiporexia/rt-state#stateS)

  `stateS` is just a shorthand of `state({value: anything})`. So, `stateS` returns an object which only contains one field: `value`.
  
  Here, `anything` means anything. It includes `non-object` types like `number`, `string`, or `array`. It could also be used for `object` or even another state.

  `stateS` is used for watching the reference change of `anything` itself. There is no way in javascript to listen to such kind of change, so, I wrap the data into the `value` field of an object. When you want to trigger an update of `anything`'s dependants, you have to change the `value` field of the wrapped object. Here is an example.
  
  ```js
  const data = stateS(100);
  data.value = 101; // This will trigger an update of data's dependants.
  data.forceUpdate(); // This line can also trigger an update of data's dependants.
  ```
  
  Use it in React.FC, call `useRStateS`.
  
- [stateLongArray](https://github.com/duchiporexia/rt-state#stateLongArray)
  
  An optimized version for long array. Don't use it unless you could understand why you need it! 
  
  we can use `stateS` for array. For most cases, it is efficient enough. But there is a small issue. That is when you update one item value within the array, you have to create a new reference of the array by `[...oldArr]` in order to trigger an update. However, such kind of operation would trigger an update for all children of the root component. If all its children are created by `create` function. It is not bad, because `React.memo` will compare the new props with the old ones, and won't update the view if the props are not changed. But here is the problem:
  
    * Such comparison for child component prop values will always happen, and it is not efficient if there are many children within the root component like a long array.
    
    * It becomes even worse if some components are neither created by `create` function, nor by `React.memo`/`pure` components. In these cases, such kind of components will be re-rendered from top to bottom.
    
    So, the solution is that we can create a data structure which can only trigger an update for each item, not for the whole array at all. `stateLongArray` is implemented by two levels of data created by `stateS`. In this way, each item is able to watch the value change of its own.

#### create APIs

- [create](https://github.com/duchiporexia/rt-state#create)

  use `React.memo` by default, which means if the props of the component don't change, the component created by `create` function will not be re-rendered externally. Therefore, it's very efficient. 
  
  Of course, the component can be controlled and updated with the data created by `state`/`stateS` function. For example, a value change of such kind of data may trigger an update of its dependants. The dependants could be components, or the callback of `watch`/`link` functions. 

- [createS](https://github.com/duchiporexia/rt-state#createS)

  A simplified version of `create` function to create `reactive` components.
  
  There is no `setup` function, just a `render` function. If you want to create local states, please use `rst.useRState`/`rst.useRStateS` instead of `rst.state`/`rst.stateS`. Besides, it is reactive for the external states when they are used in the `render` function.

#### watch APIs

- [watch](https://github.com/duchiporexia/rt-state#watch)
  
  watch the state* value changes the `deps` function. And call `cb` function according to the options.
  -- see [WatchOptions](https://github.com/duchiporexia/rt-state#WatchOptions).

  Tip: If you want to call a function when the component is unmounted. Please use the `onDispose` function of [Context](https://github.com/duchiporexia/rt-state#Context).

- [link](https://github.com/duchiporexia/rt-state#link)

  `link` is a pair of getter and setter function.
  
  - `getter` function: it returns a value which will be computed and cached in the `link`. So, if all the state* in it don't change, the `value` will not be computed again.
  
  - `setter` function: any function for updating the state*.
  
  - `options`:
    
    * `compare`: 
       
       -- If `true`, means conditionally update the link value, and only update its dependants when the value changes.
      
       -- If `false`, always update the link value, and update its dependants (could be a component or a watch/link function).
      
       -- The `default` value is `true`.
    
    * `global`: 
    
       -- If `true`, means this `link` function is out of any components, it is often used for sharing `link` value globally between different components.


#### React Hooks Integration API

- [hooks](https://github.com/duchiporexia/rt-state#hooks)

  It should only be used when you have to the functionality of another library which depends on React Hooks APIs and there is no way for you to avoid it. So, IMPORTANT, use it as less as possible.
  
  * The callback function will be called again and again before rendering the component.
  * don't use it in `render` function. Just call `hooks` in the `setup` closure of `create` function.

### Other APIs or Interfaces

##### Context

  `debugName`: string // for debugging
  
  `active`: boolean // if the component is unmounted, active is false. which is useful for async function call to check whether the current component is unmounted or not.
  
  `props`: T; // used as the props parameter of the render function.
  
  `defaultProps`: DefaultProps<T>; // set defaultProps in the beginning of the `setup` function which can then be used as the default property values of the component.
  
  `w()`: T; // used for watching the props of the current component in the returned array of the `watch` deps function. eg. \[ctx.w().prop1\]
  
  `onDispose()`: // add cb functions which is called when the component is about to be unmounted.
  
  `forceUpdate()`: // force to update the component
  
##### Watcher

  `active` is useful after an async callback function in order to check whether the current `watch` is active or not.
  
  `debugName`: string // for debugging
  
  `unwatch`, do some cleanup tasks and turn its state to inactive.

##### WatchOptions
  
  `compare`: compare new values with old values, if they are the same, don't call the callback function, otherwise, call it.
    * The default value is true, which means always do comparison.
    * If compare is false, don't compare two values, just call the callback function directly.
  
  `global`: call `watch`/`link` function outside of the `setup` callback function of any component.
    * often used for debugging, or global `watch` function, which watches other global reactive data or global variables.
  
##### createProvider
  - Create `Provider` which can be used as the parameter of `create`, and use `provider.use()` in the `setup` function to get the data from parent.
  
##### setDebugComponentName
  - Just for debugging.


## License

MIT © xvv
