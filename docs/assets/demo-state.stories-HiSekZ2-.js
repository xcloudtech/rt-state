import{c as p,b as J,j as a,v as s,a as z,d,g as A,i as D}from"./view-ohGoeIGb.js";import"./index-4g5l5LRQ.js";import"./_commonjsHelpers-4gQjN7DL.js";const _=p(e=>{var t;return(t=e.callCount)==null||t.call(e),a("div",{children:[s(()=>{var r;return(r=e.callCount)==null||r.call(e),a("div",{"data-testid":"x",children:["x:(",e.state.x,")"]})}),s(()=>{var r;return(r=e.callCount)==null||r.call(e),a("div",{"data-testid":"y",children:["y:(",e.state.y,")"]})})]})}),f=p(e=>{var t;return(t=e.callCount)==null||t.call(e),a("div",{children:[s(()=>{var n;(n=e.callCount)==null||n.call(e);const{value:r}=e.stateS;return a("div",{"data-testid":"x",children:["x:(",r.x,")"]})}),s(()=>{var n;(n=e.callCount)==null||n.call(e);const{value:r}=e.stateS;return a("div",{"data-testid":"y",children:["y:(",r.y,")"]})})]})}),y=J(e=>{const t=z({x:10,y:20});function r(){D(t,{x:t.x+1})}function n(){D(t,{x:t.x+1,z:22})}return F=>a("div",{children:[d("button",{"data-testid":"setState",onClick:r,children:"setState"}),d("button",{"data-testid":"setStateError",onClick:n,children:"setStateError"}),s(()=>a("span",{"data-testid":"xy",children:["x:(",t.x,") y:(",t.y,")"]})),s(()=>(t.x,t.y,a("span",{"data-testid":"json",children:["json:(",JSON.stringify(A(t)),")"]})))]})}),h=p(e=>{const t=z({num:10});return a("span",{children:[d("button",{"data-testid":"add",onClick:()=>t.num++,children:"add"}),a("span",{"data-testid":"state",children:["state:",t.num,"(will not change)"]}),s(()=>a("span",{"data-testid":"state2",children:["state:",t.num,"(will not change)"]}))]})});try{_.displayName="DemoState",_.__docgenInfo={description:"",displayName:"DemoState",props:{callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},state:{defaultValue:null,description:"",name:"state",required:!0,type:{name:"{ x: number; y: number; }"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{f.displayName="DemoStateS",f.__docgenInfo={description:"",displayName:"DemoStateS",props:{callCount:{defaultValue:null,description:"",name:"callCount",required:!1,type:{name:"() => void"}},stateS:{defaultValue:null,description:"",name:"stateS",required:!0,type:{name:"StateS<{ x: number; y: number; }>"}},style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{y.displayName="DemoSetState",y.__docgenInfo={description:"",displayName:"DemoSetState",props:{style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}try{h.displayName="DemoShowBadCase",h.__docgenInfo={description:"",displayName:"DemoShowBadCase",props:{style:{defaultValue:null,description:"",name:"style",required:!1,type:{name:"CSSProperties"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"string"}}}}}catch{}const o=d("div",{children:"Empty! Please see the code directly."}),L={title:"demo-state"},c={name:"DemoState",render:()=>o},l={name:"separate DemoState",render:()=>o},m={name:"DemoStateS",render:()=>o},i={name:"DemoSetState",render:()=>d(y,{})},u={name:"DemoShowBadCase",render:()=>o},S={name:"state extract",render:()=>o};var x,C,N;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  name: 'DemoState',
  render: () => EmptyNode
}`,...(N=(C=c.parameters)==null?void 0:C.docs)==null?void 0:N.source}}};var g,v,E;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: 'separate DemoState',
  render: () => EmptyNode
}`,...(E=(v=l.parameters)==null?void 0:v.docs)==null?void 0:E.source}}};var q,V,w;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  name: 'DemoStateS',
  render: () => EmptyNode
}`,...(w=(V=m.parameters)==null?void 0:V.docs)==null?void 0:w.source}}};var b,B,j;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'DemoSetState',
  render: () => <DemoSetState />
}`,...(j=(B=i.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var P,I,$;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'DemoShowBadCase',
  render: () => EmptyNode
}`,...($=(I=u.parameters)==null?void 0:I.docs)==null?void 0:$.source}}};var k,O,X;S.parameters={...S.parameters,docs:{...(k=S.parameters)==null?void 0:k.docs,source:{originalSource:`{
  name: 'state extract',
  render: () => EmptyNode
}`,...(X=(O=S.parameters)==null?void 0:O.docs)==null?void 0:X.source}}};const M=["DemoState","SeparateDemoState","DemoStateS","XDemoSetState","DemoShowBadCase","DemoStateExtract"];export{u as DemoShowBadCase,c as DemoState,S as DemoStateExtract,m as DemoStateS,l as SeparateDemoState,i as XDemoSetState,M as __namedExportsOrder,L as default};