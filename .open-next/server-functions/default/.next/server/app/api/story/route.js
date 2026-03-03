(()=>{var e={};e.id=545,e.ids=[545],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},2412:e=>{"use strict";e.exports=require("assert")},9428:e=>{"use strict";e.exports=require("buffer")},9646:e=>{"use strict";e.exports=require("child_process")},5511:e=>{"use strict";e.exports=require("crypto")},4735:e=>{"use strict";e.exports=require("events")},9021:e=>{"use strict";e.exports=require("fs")},9748:e=>{"use strict";e.exports=require("fs/promises")},1630:e=>{"use strict";e.exports=require("http")},5591:e=>{"use strict";e.exports=require("https")},1645:e=>{"use strict";e.exports=require("net")},1820:e=>{"use strict";e.exports=require("os")},3873:e=>{"use strict";e.exports=require("path")},9771:e=>{"use strict";e.exports=require("process")},1723:e=>{"use strict";e.exports=require("querystring")},7910:e=>{"use strict";e.exports=require("stream")},4631:e=>{"use strict";e.exports=require("tls")},3997:e=>{"use strict";e.exports=require("tty")},9551:e=>{"use strict";e.exports=require("url")},8354:e=>{"use strict";e.exports=require("util")},3566:e=>{"use strict";e.exports=require("worker_threads")},4075:e=>{"use strict";e.exports=require("zlib")},4573:e=>{"use strict";e.exports=require("node:buffer")},3024:e=>{"use strict";e.exports=require("node:fs")},7067:e=>{"use strict";e.exports=require("node:http")},4708:e=>{"use strict";e.exports=require("node:https")},7030:e=>{"use strict";e.exports=require("node:net")},1998:e=>{"use strict";e.exports=require("node:path")},1708:e=>{"use strict";e.exports=require("node:process")},7075:e=>{"use strict";e.exports=require("node:stream")},6466:e=>{"use strict";e.exports=require("node:stream/promises")},7830:e=>{"use strict";e.exports=require("node:stream/web")},3136:e=>{"use strict";e.exports=require("node:url")},7975:e=>{"use strict";e.exports=require("node:util")},8522:e=>{"use strict";e.exports=require("node:zlib")},9727:()=>{},7990:()=>{},1896:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>m,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>h,workUnitAsyncStorage:()=>l});var s={};r.r(s),r.d(s,{POST:()=>p});var i=r(2706),o=r(8203),n=r(5994);let a=new(r(139)).M4({});async function u(e,t,r,s,i){let o=e.map(e=>`- ${e.name}: ${e.description}`).join("\n"),n=`You are a legendary literary novelist writing a psychological thriller anthology. 
SESSION CONTEXT:
Cast of Characters:
${o}

Setting: ${t}

Current Hidden Health/Sanity Score: [${r}/100]. 
Context History (Recent Events): ${s.slice(-5).join("\n")}
Recent Action Taken by user: ${i}

Task: Generate about 12-15 paragraphs (approx 800-1000 words) of immersive, literary prose narrating the outcome of the user's action and advancing the plot significantly before presenting the next decision point. Then, provide exactly 3 distinct choices for the user's next action.

CRITICAL INSTRUCTIONS:
1. The protagonist is actually a mental patient and the "Men in Trenchcoats" hunting him are doctors/orderlies.
2. NEVER reveal the mental hospital twist directly. Only hint at it through sensory clues (smell of antiseptic, white tiles, rubber-soled shoes, muted PA announcements, etc.).
3. If Health < 20 (${r<20?"YES":"NO"}), make the prose significantly more frantic, paranoid, and distorted.
4. Output must be in JSON format to be easily parsed by the frontend.

JSON Schema:
{
  "narrative": "The prose describing what happens.",
  "choices": [
    { "id": "1", "text": "Choice 1 text", "healthImpact": -10 },
    { "id": "2", "text": "Choice 2 text", "healthImpact": 5 },
    { "id": "3", "text": "Choice 3 text", "healthImpact": 0 }
  ]
}

Ensure the "healthImpact" represents how this choice affects their sanity (- negatively, + positively). Don't make it too obvious.`;try{let e=await a.models.generateContent({model:"gemini-2.5-flash",contents:"Continue the story based on the action provided.",config:{systemInstruction:n,responseMimeType:"application/json",temperature:.7}});if(!e.text)throw Error("No text returned from Gemini.");return JSON.parse(e.text)}catch(e){throw console.error("Error calling Gemini API:",e),Error("Failed to generate story segment.")}}var c=r(9187);async function p(e){try{let{cast:t,setting:r,hiddenHealth:s,storyHistory:i,actionTaken:o}=await e.json();if(!t||0===t.length)return c.NextResponse.json({error:"Missing cast context"},{status:400});let n=await u(t,r,s,i||[],o||"Continue the story");return c.NextResponse.json(n)}catch(e){return console.error("API Route Error:",e),c.NextResponse.json({error:"Failed to generate story segment."},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/story/route",pathname:"/api/story",filename:"route",bundlePath:"app/api/story/route"},resolvedPagePath:"C:\\Users\\eyeha\\.gemini\\antigravity\\scratch\\ai-choose-adventure\\src\\app\\api\\story\\route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:h,workUnitAsyncStorage:l,serverHooks:x}=d;function m(){return(0,n.patchFetch)({workAsyncStorage:h,workUnitAsyncStorage:l})}},6487:()=>{},8335:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[638,452,139],()=>r(1896));module.exports=s})();