import{_ as f,u as g,r as u,a as c,b as v,d as w,e as s,h as l,w as V,f as b}from"./index-3yue8pkF.js";import{f as h,s as k}from"./taobao-DLH7sWZA.js";const y={class:"login-page-container"},x={class:"login-container"},N={__name:"login",setup(C){const i=g(),t=u(),a=u(),d=()=>{m().requestLogin()},p=()=>{window.location.href="https://gdrpsujiao.github.io"},m=()=>({requestLogin:async()=>{const{data:r}=await h({userName:t.value,password:a.value,remember:!0,from:""}),{ok:e,res:o}=r;e&&o?i.replace("/"):k({type:"danger",message:"错了错了"})}});return(r,e)=>{const o=c("van-field"),_=c("van-button");return v(),w("section",y,[s("section",x,[l(o,{modelValue:t.value,"onUpdate:modelValue":e[0]||(e[0]=n=>t.value=n),placeholder:"账号"},null,8,["modelValue"]),l(o,{type:"password",modelValue:a.value,"onUpdate:modelValue":e[1]||(e[1]=n=>a.value=n),placeholder:"密码"},null,8,["modelValue"]),l(_,{type:"primary",block:"",onClick:d},{default:V(()=>[b("登录")]),_:1})]),s("footer",null,[s("span",{onClick:p},"去计算器页面")])])}}},j=f(N,[["__scopeId","data-v-602c70bb"]]);export{j as default};