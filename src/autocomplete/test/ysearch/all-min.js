YUI.add("ac-plugin",function(C){var B="autocomplete",K=C.Lang,D=C.Array.each,F={query:function(P){var L=this,O=L.get("dataSource"),N=P.value,M=C.bind(G,L);if(O){O.sendRequest({request:L.get("queryTemplate")(N),callback:{success:M,failure:M}});}}};function E(){E.superclass.constructor.apply(this,arguments);}C.extend((C.Plugin.ACPlugin=C.augment(E,C.EventTarget)),C.Plugin.Base,{initializer:function(){var L=this,M=L.get("host");L.handles=I(L,M);var N=F;D(["query","load","show","hide","next","previous"],function(O){L.publish("ac:"+O,{broadcast:1,bubbles:1,context:L,preventable:true,defaultFn:N[O]||null,prefix:"ac"});},L);J(M);},destructor:function(){D(this.handles,function(L){L.detach();});},open:function(){this.fire("ac:show");},next:function(L){L.preventDefault();this.fire("ac:next");},previous:function(L){L.preventDefault();this.fire("ac:previous");},close:function(){this.fire("ac:hide");}},{NAME:"ACPlugin",NS:"ac",ATTRS:{queryValue:{getter:function(){return this.get("host").get("value");},setter:function(L){this.get("host").set("value",L);return(this._cachedValue=L);}},dataSource:{validator:function(L){return L&&K.isFunction(L.sendRequest);}},minQueryLength:{value:3,validator:K.isNumber},queryTemplate:{value:encodeURIComponent,setter:function(L){return(K.isFunction(L)?L:function(M){return L.replace(/(^|[^\\])((\\{2})*)\{query\}/,"$1$2"+encodeURIComponent(M)).replace(/(^|[^\\])((\\{2})*)\\(\{query\})/,"$1$2$4");});}}}});function I(L,M){return[C.on("valueChange",H,M,L),C.on("key",L.next,M,"down:40",L),C.on("key",L.previous,M,"down:38",L),C.on("key",L.close,M,"down:27",L)];}function H(M){var L=M.value;if(!L){return this.close();}if(L===this._cachedValue||L.length<this.get("minQueryLength")){return;}this._cachedValue=L;this.fire("ac:query",{value:M.value});}function A(L){return function(){if(L){L.setAttribute(B,"on");}L=null;};}function J(L){var N=C.Node.getDOMNode(L),O=N.getAttribute(B);if((O&&O!=="off")||O===null||O===undefined){var M=A(N);C.on("beforeunload",M,window);C.on("unload",M,window);}N.setAttribute(B,"off");}function G(M){var L=(M&&M.response&&M.response.results)?M.response.results:M;if(L&&!(L&&("length" in L)&&L.length===0)){this.fire("ac:load",{results:L,query:this.get("queryValue")});}}},"@VERSION@",{requires:["node","plugin","value-change","event-key"],optional:["event-custom"]});YUI.add("ac-widget",function(A){function D(){D.superclass.constructor.apply(this,arguments);}var C="_handles",E="selectedIndex",J="_selectedIndex",G="_originalValue",B=A.Array.each,F="queryValue";A.ACWidget=A.extend(D,A.Widget,{initializer:function(){var K=this;K.after("queryChanged",K.syncUI,K);K.after("dataChanged",K.syncUI,K);K.hide();},renderUI:function(){var L=this.get("ac");if(!L){return;}var K=L.get("host");H(this.get("boundingBox"),K);return this.setSize();},setSize:function(){return this.set("width",this.get("ac").get("host").getComputedStyle("width"));},bindUI:function(L){var M=this,K=M.get("contentBox"),L=L||M.get("ac");if(M[C]){B(M[C],function(N){N.detach();});M[C]=0;}if(L){M[C]=[K.delegate("click",M.click,"li",M),A.on("click",M.hide,document),L.on("ac:load",function(N){M.set("query",N.query).set("data",N.results).syncUI().show();}),L.on("ac:query",function(N){M.set("query",N.value).syncUI();}),L.on("ac:next",M.next,M),L.on("ac:previous",M.previous,M),L.on("ac:hide",M.hide,M)];}return M;},syncUI:function(){var K=this,M=K.get("data"),L=K.get("query");if(!M){return K;}K[J]=-1;K[G]="";K.get("contentBox").set("innerHTML",K.getListMarkup(M));return K;},getListMarkup:function(N){var M=this,K=M.get("listTpl"),L=[];B(N,function(O){L.push(M.getItemMarkup(O));});return K.replace(/\{list\}/g,L.join(""));},getItemMarkup:function(K){return this.get("itemTpl").replace(/\{term\}/g,K).replace(/\{hilite\}/g,this.getHiliteMarkup(K));},getHiliteMarkup:function(M){var L=this,K=L.get("query").split(/\s+/);out=M;B(K,function(N){if(!N){return;}N=I(N);out=out.replace(new RegExp(N,"g"),L.get("hiliteTpl").replace(/\{term\}/g,N));});return out;},next:function(){var K=this;if(K.get("visible")){return K.selectNext();}if(K.get("data")){K.show();}return K;},selectNext:function(){var K=this.get(E);return this.set(E,K+1);},selectPrevious:function(){var K=this.get(E);return this.set(E,K-1);},previous:function(){if(this.get("visible")){this.selectPrevious();}return this;},item:function(K){return this.get("contentBox").one(this.get("itemSelector").replace(/\{n\}/g,I(K+1)));},click:function(M){var K=this,L=K.get("ac"),N=M.currentTarget.get("text");L.set(F,N);K[J]=-1;K._currentValue=N;L.get("host").focus();K.hide();}},{NAME:"ACWidget",ATTRS:{ac:{setter:function(K){if(!this[C]){return;}this.bindUI(K);},validator:function(K){return true;}},data:{validator:function(K){return K&&K.length>0;}},query:{value:""},listTpl:{value:"<ul>{list}</ul>"},itemTpl:{value:"<li>{hilite}</li>"},itemSelector:{value:"ul li:nth-child({n})"},hiliteTpl:{value:"<em>{term}</em>"}}});D.ATTRS[E]={value:-1,validator:function(K){var L=this.get("data");return L&&A.Lang.isNumber(K);},getter:function(){return this[J];},setter:function(M){var R=this,O=R.get(E),P=R.get("data"),K=P&&P.length,Q=R.get("ac"),L=this.getClassName("selected");if(isNaN(O)){O=-1;}if(!P||!K){return;}while(M<-1){M+=K+1;}M=(M+1)%(K+1)-1;O=(O+1)%(K+1)-1;R[J]=M;if(O===-1){R[G]=Q.get(F);}if(O===M){return;}var S=R.get("contentBox").one("."+L);if(S){S.removeClass(L);}if(M===-1){Q.set(F,this[G]);}else{var N=R.item(M);if(N){N.addClass(L);}Q.set(F,P[M]);}return M;}};function I(K){return(""+K).replace(/([\/\.\*\+\?\|\(\)\[\]\{\}\\])/g,"\\$1");}function H(L,K){var M=K.get("parentNode");M.insertBefore(L,K);M.insertBefore(K,L);}},"@VERSION@",{requires:["widget","ac-plugin"]});YUI.add("autocomplete",function(A){},"@VERSION@",{use:["ac-plugin"]});YUI.add("value-change",function(E){function H(N,L){var M=E.on("available",function(){M.handle=E.on.apply(E,L);},N);return M;}function A(N,L,M){L[0]=globalCategory+M+B(N);L.splice(2,1);N.publish(L[0],{broadcast:true,emitFacade:true});G(K,N,M);return N.on.apply(N,L);}function B(L){return E.stamp(L)+"-"+I;}function G(L,O,N){for(var M in L){J(M,L[M],O,N);}}function J(O,L,N,M){E.after(E.bind(E.detach,E,M),E.on(M+O,L,N),"detach");}function F(O,N){var M=C[B(O)];if(!M){return;}M.count--;if(force){M.count=0;}if(M.count<=0){delete C[B(O)];for(var L in M.handles){M.handles[L].detach();}}}var C={},D={on:function(R,S,N,M){var Q=E.Array(arguments,0,true),O=E.all((E.Lang.isString(N)||E.Lang.isArray(N))?N:[N]);if(O.size()===0){return H(N,Q);}Q[3]=M=M||((O.size()===1)?O.item(0):O);var T=[],L,P=[];O.each(function(U){E.after(E.bind(E.detach,E,P.push(L=E.guid()+"|")),T.push(A(U,Q,L)),"detach");});return{evt:T,sub:O,detach:E.bind(E.Array.each,E.Array,P,E.bind(E.detach,E))};}},I="valueChange",K=(function(){var N={},Q={},L={};function S(V,W){var U=B(V);R(V);Q[U]=setInterval(E.bind(T,null,V,W),50);L[U]=setTimeout(E.bind(R,null,V),10000);}function R(V){var U=B(V);clearTimeout(L[U]);clearInterval(Q[U]);}function T(V,X){var U=B(V);var W=V.get("value");if(W===N[U]){return;}V.fire(U,{type:I,value:W,oldValue:N[U],_event:X,target:V,currentTarget:V});N[U]=V.get("value");S(V,X);}function O(U){if(U.charCode===229||U.charCode===197){S(U.currentTarget,U);}}function P(U){R(U.currentTarget);}function M(U){S(U.currentTarget,U);}return{keyup:O,blur:P,keydown:M};})();E.Env.evt.plugins[I]=D;if(E.Node){E.Node.DOM_EVENTS[I]=D;}},"@VERSION@",{optional:["event-custom"],requires:["node-base","event-focus"]});