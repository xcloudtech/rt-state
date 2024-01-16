import{b as D,a as X,w as i,j as u,d as c,u as k}from"./view-ohGoeIGb.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";const C=D(e=>{var l,n;(n=(l=e.props).callCount)==null||n.call(l);const a=X({v1:0,v2:100});let o;i(r=>{var d,_;(_=(d=e.props).watch1CallCount)==null||_.call(d);const s=r[0];s!==o&&(o=s,e.forceUpdate())},()=>[a.v1+a.v2]),i(async r=>{var s,d;(d=(s=e.props).watch2CallCount)==null||d.call(s)},()=>[a.v1,a.v2]);const t=()=>{let r=1;for(;r<1e4;)a.v1+=1,a.v2-=1,r++};return()=>{var r,s;return(s=(r=e.props).callCount)==null||s.call(r),u("div",{children:[c("button",{"data-testid":"change",onClick:t,children:"change"}),u("div",{"data-testid":"sum",children:["sum:(",o,")"]})]})}}),v=D(e=>{var a,o;return(o=(a=e.props).callCount)==null||o.call(a),i(()=>{var t,l;(l=(t=e.props).watchCallCount)==null||l.call(t)},()=>[e.w().obj.x]),t=>{var l;return(l=t.callCount)==null||l.call(t),c("div",{children:u("div",{"data-testid":"xy",children:["x:(",t.obj.x,") y:(",t.obj.y,")"]})})}}),b=D(e=>{var o,t;(t=(o=e.props).callCount)==null||t.call(o);let a;return i(()=>{a=e.props.state.num*2,a!==24&&e.forceUpdate()},()=>[e.w().state.num]),l=>{var n;return(n=l.callCount)==null||n.call(l),u("div",{"data-testid":"nonReactiveData",children:["nonReactiveData:(",a,")"]})}}),f=D(e=>{var t,l;(l=(t=e.props).callCount)==null||l.call(t);const a=X({v1:0,v2:100});i(n=>{var r,s;(s=(r=e.props).watchCallCount)==null||s.call(r)},()=>[a.v1+a.v2]);const o=()=>{for(let n=0;n<10;n++)k(()=>{a.v1+=1,a.v2+=1})};return()=>{var n,r;return(r=(n=e.props).callCount)==null||r.call(n),u("div",{children:[c("button",{"data-testid":"change",onClick:o,children:"change"}),c("div",{children:"unstable_disableDelay"})]})}});try{C.displayName="DemoWatch",C.__docgenInfo={description:"",displayName:"DemoWatch",props:{watch1CallCount:{defaultValue:null,description:"",name:"watch1CallCount",required:!1,type:{name:"() => void"}},watch2CallCount:{defaultValue:null,description:"",name:"watch2CallCount",required:!1,type:{name:"() => void"}},callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{v.displayName="DemoWatchProps",v.__docgenInfo={description:"",displayName:"DemoWatchProps",props:{obj:{defaultValue:null,description:"",name:"obj",required:!0,type:{name:"{ x?: number; y?: number; }"}},callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},watchCallCount:{defaultValue:null,description:"",name:"watchCallCount",required:!1,type:{name:"() => void"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{b.displayName="DemoWatchExternalState",b.__docgenInfo={description:"",displayName:"DemoWatchExternalState",props:{state:{defaultValue:null,description:"",name:"state",required:!0,type:{name:"{ num: number; }"}},callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{f.displayName="DemoDisableDelay",f.__docgenInfo={description:"",displayName:"DemoDisableDelay",props:{watchCallCount:{defaultValue:null,description:"",name:"watchCallCount",required:!1,type:{name:"() => void"}},callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const z={title:"demo-watch"},R=c("div",{children:"Empty! Please see the code directly."}),m={name:"DemoWatch",render:()=>c(C,{})},p={name:"DemoWatchProps",render:()=>R},y={name:"DemoWatchExternalState",render:()=>R},h={name:"DemoDisableDelay",render:()=>c(f,{})};var W,g,S;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`{
  name: 'DemoWatch',
  render: () => <DemoWatch />
}`,...(S=(g=m.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var w,N,q;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  name: 'DemoWatchProps',
  render: () => EmptyNode
}`,...(q=(N=p.parameters)==null?void 0:N.docs)==null?void 0:q.source}}};var V,E,P;y.parameters={...y.parameters,docs:{...(V=y.parameters)==null?void 0:V.docs,source:{originalSource:`{
  name: 'DemoWatchExternalState',
  render: () => EmptyNode
}`,...(P=(E=y.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var j,x,I;h.parameters={...h.parameters,docs:{...(j=h.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'DemoDisableDelay',
  render: () => <DemoDisableDelay />
}`,...(I=(x=h.parameters)==null?void 0:x.docs)==null?void 0:I.source}}};const A=["XDemoWatch","DemoWatchProps","DemoWatchExternalState","XDemoDisableDelay"];export{y as DemoWatchExternalState,p as DemoWatchProps,h as XDemoDisableDelay,m as XDemoWatch,A as __namedExportsOrder,z as default};
