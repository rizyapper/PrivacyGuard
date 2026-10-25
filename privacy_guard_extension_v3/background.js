const P=[/^_ga/i,/^_gid$/i,/^_gat/i,/^_gcl/i,/^_fbp$/i,/^_fbc$/i,/^fr$/i,/^IDE$/i,/^NID$/i,/^ANID$/i,/^1P_JAR$/i,/^__gads$/i,/^__gpi$/i,/^_hj/i,/^_clck$/i,/^_clsk$/i,/^amplitude/i,/^ajs_/i,/^mp_/i,/^_ttp$/i,/^guest_id$/i,/^personalization_id$/i];const inc=async k=>{const x=await chrome.storage.local.get({[k]:0});await chrome.storage.local.set({[k]:x[k]+1})};chrome.runtime.onInstalled.addListener(()=>chrome.storage.local.set({blockedRequests:0,removedCookies:0,panicCount:0}));chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(()=>inc('blockedRequests'));chrome.cookies.onChanged.addListener(async({cookie,removed})=>{if(removed||!P.some(p=>p.test(cookie.name)))return;try{const d=cookie.domain.replace(/^\./,''),u=`${cookie.secure?'https':'http'}://${d}${cookie.path||'/'}`;await chrome.cookies.remove({url:u,name:cookie.name,storeId:cookie.storeId});await inc('removedCookies')}catch(e){}});chrome.runtime.onMessage.addListener((m,s,send)=>{if(m?.type==='GET_STATS'){chrome.storage.local.get({blockedRequests:0,removedCookies:0,panicCount:0},send);return true}if(m?.type==='PANIC'){(async()=>{try{await chrome.browsingData.remove({since:0},{cookies:true,cache:true,cacheStorage:true,localStorage:true,indexedDB:true,serviceWorkers:true});await inc('panicCount');send({ok:true})}catch(e){send({ok:false,error:String(e)})}})();return true}});

// Optional Tor integration: routes browser traffic through a local Tor SOCKS5 daemon.
// Tor must already be running on 127.0.0.1:9050. This does not install or run Tor itself.
async function getTorState(){
  const state=await chrome.storage.local.get({torEnabled:false,torStatus:'off'});
  return {enabled:state.torEnabled,status:state.torStatus};
}
chrome.runtime.onMessage.addListener((m,s,send)=>{
  if(m?.type==='GET_TOR_STATE'){getTorState().then(send);return true;}
  if(m?.type==='SET_TOR'){
    (async()=>{
      try{
        if(m.enabled){
          // Check whether a local SOCKS listener is available before changing proxy settings.
          // The extension API cannot reliably probe a TCP port, so we set the proxy and
          // expose clear setup instructions if Tor is not running.
          await chrome.proxy.settings.set({value:{mode:'fixed_servers',rules:{singleProxy:{scheme:'socks5',host:'127.0.0.1',port:9050},bypassList:['<local>']}},scope:'regular'});
          await chrome.storage.local.set({torEnabled:true,torStatus:'enabled'});
          send({ok:true,enabled:true,message:'Proxy enabled. Ensure Tor is running locally on port 9050.'});
        }else{
          await chrome.proxy.settings.clear({scope:'regular'});
          await chrome.storage.local.set({torEnabled:false,torStatus:'off'});
          send({ok:true,enabled:false,message:'Browser proxy settings reset to default.'});
        }
      }catch(e){send({ok:false,error:String(e)});}
    })();return true;
  }
});
