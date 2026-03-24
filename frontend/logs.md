index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:63 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'RSNo')
    at eval (index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:63:25)
    at renderList (runtime-core.esm-bundler.js:3031:16)
    at Proxy.render (index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:56:913)
    at renderComponentRoot (runtime-core.esm-bundler.js:1018:16)
    at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js:6109:46)
    at ReactiveEffect.run (reactivity.esm-bundler.js:221:19)
    at instance.update (runtime-core.esm-bundler.js:6240:16)
    at setupRenderEffect (runtime-core.esm-bundler.js:6250:5)
    at mountComponent (runtime-core.esm-bundler.js:6018:7)
    at processComponent (runtime-core.esm-bundler.js:5972:9)
eval @ index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:63
renderList @ runtime-core.esm-bundler.js:3031
render @ index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:56
renderComponentRoot @ runtime-core.esm-bundler.js:1018
componentUpdateFn @ runtime-core.esm-bundler.js:6109
run @ reactivity.esm-bundler.js:221
instance.update @ runtime-core.esm-bundler.js:6240
setupRenderEffect @ runtime-core.esm-bundler.js:6250
mountComponent @ runtime-core.esm-bundler.js:6018
processComponent @ runtime-core.esm-bundler.js:5972
patch @ runtime-core.esm-bundler.js:5453
mountChildren @ runtime-core.esm-bundler.js:5701
processFragment @ runtime-core.esm-bundler.js:5915
patch @ runtime-core.esm-bundler.js:5427
componentUpdateFn @ runtime-core.esm-bundler.js:6116
run @ reactivity.esm-bundler.js:221
instance.update @ runtime-core.esm-bundler.js:6240
callWithErrorHandling @ runtime-core.esm-bundler.js:338
flushJobs @ runtime-core.esm-bundler.js:543
Promise.then
queueFlush @ runtime-core.esm-bundler.js:452
queueJob @ runtime-core.esm-bundler.js:446
eval @ runtime-core.esm-bundler.js:6234
resetScheduling @ reactivity.esm-bundler.js:308
trigger @ reactivity.esm-bundler.js:448
set @ reactivity.esm-bundler.js:569
set @ runtime-core.esm-bundler.js:3265
getNextRSNo @ index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/views/pages/inventory/stock-request.vue?vue&type=script&lang=js:145
await in getNextRSNo
created @ index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/views/pages/inventory/stock-request.vue?vue&type=script&lang=js:125
callWithErrorHandling @ runtime-core.esm-bundler.js:338
callWithAsyncErrorHandling @ runtime-core.esm-bundler.js:345
callHook @ runtime-core.esm-bundler.js:3751
applyOptions @ runtime-core.esm-bundler.js:3670
finishComponentSetup @ runtime-core.esm-bundler.js:7824
setupStatefulComponent @ runtime-core.esm-bundler.js:7747
setupComponent @ runtime-core.esm-bundler.js:7676
mountComponent @ runtime-core.esm-bundler.js:6006
processComponent @ runtime-core.esm-bundler.js:5972
patch @ runtime-core.esm-bundler.js:5453
componentUpdateFn @ runtime-core.esm-bundler.js:6116
run @ reactivity.esm-bundler.js:221
instance.update @ runtime-core.esm-bundler.js:6240
setupRenderEffect @ runtime-core.esm-bundler.js:6250
mountComponent @ runtime-core.esm-bundler.js:6018
processComponent @ runtime-core.esm-bundler.js:5972
patch @ runtime-core.esm-bundler.js:5453
componentUpdateFn @ runtime-core.esm-bundler.js:6196
run @ reactivity.esm-bundler.js:221
instance.update @ runtime-core.esm-bundler.js:6240
callWithErrorHandling @ runtime-core.esm-bundler.js:338
flushJobs @ runtime-core.esm-bundler.js:543
Promise.then
queueFlush @ runtime-core.esm-bundler.js:452
queuePostFlushCb @ runtime-core.esm-bundler.js:472
queueEffectWithSuspense @ runtime-core.esm-bundler.js:1893
scheduler @ runtime-core.esm-bundler.js:2104
resetScheduling @ reactivity.esm-bundler.js:308
triggerEffects @ reactivity.esm-bundler.js:352
triggerRefValue @ reactivity.esm-bundler.js:1119
set value @ reactivity.esm-bundler.js:1164
finalizeNavigation @ vue-router.mjs:3382
eval @ vue-router.mjs:3247
Promise.then
pushWithRedirect @ vue-router.mjs:3214
push @ vue-router.mjs:3139
install @ vue-router.mjs:3580
use @ runtime-core.esm-bundler.js:3982
eval @ main.js:85
./src/main.js @ app.js:206
__webpack_require__ @ app.js:2698
(anonymous) @ app.js:3897
__webpack_require__.O @ app.js:2747
(anonymous) @ app.js:3898
(anonymous) @ app.js:3900Understand this error
index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:63 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'RSNo')
    at eval (index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:63:25)
    at renderList (runtime-core.esm-bundler.js:3031:16)
    at Proxy.render (index.js??clonedRuleSet-40.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/action-modal/view-item.vue?vue&type=template&id=148647d2&scoped=true:56:913)
    at renderComponentRoot (runtime-core.esm-bundler.js:1018:16)
    at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js:6109:46)
    at ReactiveEffect.run (reactivity.esm-bundler.js:221:19)
    at instance.update (runtime-core.esm-bundler.js:6240:16)
    at setupRenderEffect (runtime-core.esm-bundler.js:6250:5)
    at mountComponent (runtime-core.esm-bundler.js:6018:7)
    at processComponent (runtime-core.esm-bundler.js:5972:9)