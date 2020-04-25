# rt-state

> Another library for the state management in React and React Native. It can be used to replace React Hooks APIs. It can also be used together with React Hooks API, or calls any other libraries which depend on React Hooks API.

### Features

1. Automatically track the dependency between views and state variables, and only update the views depending on the changed state values.
2. Unify local state and global state management. So, don't need `useContext` any more.
3. Fine granularity of controlling when to update the view with `watch`/`link` functions.
4. An optimized Array state for the long Array.
5. React Hooks API integration. React Hooks API Calls can be wrapped by `useHooks` within the `setup` function. The user is also able to control whether the view should be updated or not, even when setState/* has been called.


### Motivation

In react, there are Class Based components and Function Based components. In most cases, Function components in React can be thought of very simply. However, Hooks API has mental burden, especially for new learners. Also, because there is no state within the function, we have to repeatedly initialize the state and even redefine local functions again and again before each re-rendering. 

But, I need a library, which can use function components and, meanwhile, it should be easier to understand and use.

In rt-state, it uses `create` function to create components, which takes a `setup` callback function as its parameter. The `setup` function is used to initialize states with `state`/`stateV`/`stateArray`, or call `watch`/`link` functions, or even create any local variables and user defined functions. Then, it returns a render function. The render function is used for re-rendering the component afterwards.

### Use

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

### rt-state APIs

#### state APIs

- [state](https://github.com/duchiporexia/rt-state#create)


- [stateV](https://github.com/duchiporexia/rt-state#stateV)


- [stateLongArray](https://github.com/duchiporexia/rt-state#stateLongArray)

#### create APIs

- [create](https://github.com/duchiporexia/rt-state#create)

- [createS](https://github.com/duchiporexia/rt-state#createS)

#### watch APIs

- [watch](https://github.com/duchiporexia/rt-state#watch)

- [deepWatch](https://github.com/duchiporexia/rt-state#deepWatch)

- [link](https://github.com/duchiporexia/rt-state#link)

- [deepLink](https://github.com/duchiporexia/rt-state#deepLink)

#### React Hooks Integration API

- [useHooks](https://github.com/duchiporexia/rt-state#useHooks)


## License

MIT © xvv
