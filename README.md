# rt-state

> Another library for the state management in React and React Native. It can be used to replace React Hooks APIs. It can also be used together with React Hooks API, or calls any other libraries which depend on React Hooks API.

### Features

1. Automatically track the dependency between views and state variables, and only update the views depending on the changed state values.
2. Unify local state and global state management. So, don't need `useContext` and wrap the component with `Provider` any more.
3. Fine granularity of controlling when to update the view with `watch`/`link` functions.
4. An optimized Array state for the long Array.
5. React Hooks API integration. React Hooks API Calls can be wrapped by `useHooks` within the `setup` function. The user is also able to control whether the view should be updated or not, even when setState/* has been called.


### Motivation

In react, there are Class Based components and Function Based components. In most cases, Function components in React can be thought of very simply. However, Hooks API has mental burden, especially for new learners. Also, because there is no state within the function, we have to repeatedly initialize the state and even redefine local functions again and again before each re-rendering. 

But, I need a library, which can use function components and, meanwhile, it should be easier to understand and use.

In rt-state, it uses `create` function to create components, which takes a `setup` callback function as its parameter. The `setup` function is used to initialize states with `state`/`stateV`/`stateArray`, or call `watch`/`link` functions, or even create any local variables and user defined functions. Then, it returns a render function. The render function is used for re-rendering the component afterwards.

### Use

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
More examples can be found in `/src/demo`.

### rt-state Core APIs

   It contains state, create, watch and hooks integration APIs. All APIs are call-once functions, which means they can not be called within a `render` function.
   
   They should be used in two way:
   * Call them Globally, like creating components with `create`/`createS` functions or creating global states or watching global states.
   * Or call them within a `setup` function which is the parameter of the `create` function.

#### state APIs

`state` is used for watching any field value changes of an object, while, `stateV` is used for watching its own value change, commonly for `number` or `string` variables.

  However, both are reactive only when the reference of value changes, which is quite straightforward and simple.
  
  If the field value is an object, the field itself is reactive, but its own fields are not reactive, which means `line 2` of the following code will not update its dependants. Because the reference of `data.v` is the same as before.

   ```js
   const data = state({v: {v1: 1, v2: 2}});
   data.v.v1 = 3; // This will not trigger an update of its dependants.
   data.v = {...data.v}; // Here, it will update its dependants. Because the reference changes.
   ```
   So, in this case, if you can want to trigger an update, you need change the reference by `{...value}` for object, or `[...value]` for array. 
   
   Anyway, if you are desperate for all item values within the nested object to be reactive, you could just wrap the value with another `state`/`stateV` functions.

- [state](https://github.com/duchiporexia/rt-state#create)

A state variable is a `reactive` object. `reactive` means when its values changes, it will trigger an update of whatever that depends on it.

- [stateV](https://github.com/duchiporexia/rt-state#stateV)

  `stateV` is just a shorthand of `state({value: anything})`. 
  
  Here, anything means anything. It includes `non-object` types like `number`, `string`, or `array`. It could also be used for `object` or even another state.

  `stateV` is used for watching the reference change of `anything`'s own. There is no way in javascript to listen to such kind of change, so, I wrap it into the `value` field of an object. Then, just need to watch the `value` field change of the object. When you want to change `anything`, you have to change the `value` field of the wrapped object.
  
  ```js
  const data = stateV(100);
  data.value = 101; // This will trigger an update of its dependants.
  ```

- [stateLongArray](https://github.com/duchiporexia/rt-state#stateLongArray)
  
  An optimized version for long array. Don't use it unless you could understand why you need it! 
  
  we could use `stateV` for an array

#### create APIs

- [create](https://github.com/duchiporexia/rt-state#create)

  use `React.memo` by default, which means if the props don't change, the component created by `create` function could not be updated externally and it's very efficient. Of course, the component can be controlled and updated with the variables created by `state`/`stateV` function. For example, a value change of such kind of variable may trigger an update on its dependants. The dependants are components, or the callback of `watch`/`link` function. 

- [createS](https://github.com/duchiporexia/rt-state#createS)

  A simplified version of `create` function. There is no `setup` function, just a `render` function. So, within the `render` function, you should not call any rt-state APIs. 

#### watch APIs

- [watch](https://github.com/duchiporexia/rt-state#watch)

  Tip: If you want to call a function when the component is unmounted. Please use the `onDispose` function of [`Context`](https://github.com/duchiporexia/rt-state#Context).

- [link](https://github.com/duchiporexia/rt-state#link)



#### React Hooks Integration API

- [useHooks](https://github.com/duchiporexia/rt-state#useHooks)

  It should only be used when you need the functionality of another library which depends on React Hooks APIs and there is no way for you avoid it. So, IMPORTANT, use it as less as possible.
  
  * The callback function will be called again and again before rendering the component.
  * It could control the re-rendering of the component. If the returned value is false, the component will not be rendered.
  * don't use it in `render` function. Just call `useHooks` in the setup callback of `create` function.

### Other APIs or Interfaces

##### Context

##### Watcher

##### WatchOptions
  ```
    interface WatchOptions {
        compare?: boolean;
        global?: boolean;
    }
  ```
`compare`: compare new values with old values.

`global`: call `watch` function outside of the setup callback function of any component.

##### setDebugComponentName
  - Just for debugging.


## License

MIT © xvv
