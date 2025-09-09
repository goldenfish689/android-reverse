// Frida脚本用于分析OLLVM混淆的函数
function waitForLibraryAndAnalyze() {
    var baseAddr = Module.findBaseAddress("libkrwjioq.so");
    
    if (baseAddr === null) {
        console.log("[!] libkrwjioq.so 尚未加载，等待中...");
        setTimeout(waitForLibraryAndAnalyze, 1000);
        return;
    }
    
    var targetAddr = baseAddr.add(0x22fac0);
    console.log("[+] 基址: " + baseAddr);
    console.log("[+] 目标函数地址: " + targetAddr);
    
    // 1. 基本函数hooking
    // Interceptor.attach(targetAddr, {
    //     onEnter: function(args) {
    //         console.log("[+] 进入函数 0x22fac0");
    //         console.log("参数0: " + args[0]);
    //         console.log("参数1: " + args[1]);
    //         console.log("参数2: " + args[2]);
    //         console.log("参数3: " + args[3]);
    //     },
    //     onLeave: function(retval) {
    //         console.log("[+] 离开函数 0x22fac0");
    //         console.log("返回值: " + retval);
    //     }
    // });
    
    // // 2. 使用Stalker进行指令级跟踪
    // var stalkerEnabled = false;
    
    // Interceptor.attach(targetAddr, {
    //     onEnter: function(args) {
    //         if (!stalkerEnabled) {
    //             stalkerEnabled = true;
    //             console.log("[+] 开始Stalker跟踪");
                
    //             Stalker.follow(this.threadId, {
    //                 events: {
    //                     call: true,
    //                     ret: true,
    //                     exec: false,
    //                     block: false,
    //                     compile: false
    //                 },
    //                 onReceive: function(events) {
    //                     var parser = Stalker.parse(events);
    //                     parser.forEach(function(event) {
    //                         // 只记录目标SO内的执行
    //                         if (event.address >= baseAddr && 
    //                             event.address < baseAddr.add(0x1000000)) {
                                
    //                             var offset = event.address.sub(baseAddr);
                                
    //                             switch(event.type) {
    //                                 case 'exec':
    //                                     console.log("[EXEC] " + offset + " - " + 
    //                                               Instruction.parse(event.address));
    //                                     break;
    //                                 case 'call':
    //                                     console.log("[CALL] " + offset + " -> " + 
    //                                               event.target.sub(baseAddr));
    //                                     break;
    //                                 case 'ret':
    //                                     console.log("[RET] " + offset);
    //                                     break;
    //                                 case 'block':
    //                                     console.log("[BLOCK] " + offset + 
    //                                               " (size: " + event.size + ")");
    //                                     break;
    //                             }
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     },
    //     onLeave: function(retval) {
    //         if (stalkerEnabled) {
    //             Stalker.unfollow(this.threadId);
    //             stalkerEnabled = false;
    //             console.log("[+] 停止Stalker跟踪");
    //         }
    //     }
    // });
    
    // // 3. 控制流分析 - 记录基本块执行顺序
    var basicBlocks = [];
    var currentBlock = null;
    
	 console.log("[+] 控制流分析 - 记录基本块执行顺序 addr:" +targetAddr);
    Interceptor.attach(targetAddr, {
        onEnter: function(args) {
            basicBlocks = [];
            
            Stalker.follow(this.threadId, {
                events: {
                    block: true
                },
                onReceive: function(events) {
                    var parser = Stalker.parse(events);
                    parser.forEach(function(event) {
                        if (event.type === 'block' && 
                            event.address >= baseAddr && 
                            event.address < baseAddr.add(0x1000000)) {
                            
                            var offset = event.address.sub(baseAddr);
                            basicBlocks.push({
                                offset: offset,
                                size: event.size,
                                address: event.address
                            });
                        }
                    });
                }
            });
        },
        onLeave: function(retval) {
            Stalker.unfollow(this.threadId);
            
            console.log("[+] 基本块执行序列:");
            basicBlocks.forEach(function(block, index) {
                console.log("  " + index + ": " + block.offset + 
                          " (size: " + block.size + ")");
            });
        }
    });
    
    // // 4. 内存访问跟踪
    // function traceMemoryAccess() {
    //     Interceptor.attach(targetAddr, {
    //         onEnter: function(args) {
    //             Stalker.follow(this.threadId, {
    //                 events: {
    //                     exec: true
    //                 },
    //                 onCallSummary: function(summary) {
    //                     console.log("[+] 调用摘要:");
    //                     Object.keys(summary).forEach(function(addr) {
    //                         var offset = ptr(addr).sub(baseAddr);
    //                         if (offset >= 0 && offset < 0x1000000) {
    //                             console.log("  " + offset + ": " + summary[addr] + " 次");
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }
    
    // // 5. 反混淆辅助函数
    // function dumpInstructions(addr, count) {
    //     console.log("[+] 指令转储 @ " + addr.sub(baseAddr) + ":");
    //     for (var i = 0; i < count; i++) {
    //         var inst = Instruction.parse(addr.add(i * 4));
    //         console.log("  " + addr.add(i * 4).sub(baseAddr) + ": " + inst);
    //     }
    // }
    
    // // 6. 寻找真实的控制流
    // function findRealControlFlow() {
    //     var realBranches = [];
        
    //     Interceptor.attach(targetAddr, {
    //         onEnter: function(args) {
    //             Stalker.follow(this.threadId, {
    //                 events: {
    //                     call: true,
    //                     ret: true
    //                 },
    //                 onReceive: function(events) {
    //                     var parser = Stalker.parse(events);
    //                     parser.forEach(function(event) {
    //                         if (event.type === 'call' || event.type === 'ret') {
    //                             var fromOffset = event.address.sub(baseAddr);
    //                             var toOffset = event.target ? event.target.sub(baseAddr) : 0;
                                
    //                             realBranches.push({
    //                                 type: event.type,
    //                                 from: fromOffset,
    //                                 to: toOffset
    //                             });
    //                         }
    //                     });
    //                 }
    //             });
    //         },
    //         onLeave: function() {
    //             Stalker.unfollow(this.threadId);
    //             console.log("[+] 真实控制流:");
    //             realBranches.forEach(function(branch) {
    //                 console.log("  " + branch.type + ": " + branch.from + 
    //                           " -> " + branch.to);
    //             });
    //         }
    //     });
    // }
    
    // console.log("[+] Frida脚本已加载，开始分析OLLVM混淆函数");
    // console.log("[+] 可用函数:");
    // console.log("  - traceMemoryAccess(): 跟踪内存访问");
    // console.log("  - dumpInstructions(addr, count): 转储指令");
    // console.log("  - findRealControlFlow(): 寻找真实控制流");
}

// 方法1: 等待库加载
setTimeout(function() {
    console.log("[+] 开始检查库是否加载...");
    waitForLibraryAndAnalyze();
}, 1000);

// // 方法2: 监听库加载事件
// Java.perform(function() {
//     var System = Java.use("java.lang.System");
//     var Runtime = Java.use("java.lang.Runtime");
    
//     // Hook System.loadLibrary
//     System.loadLibrary.overload('java.lang.String').implementation = function(libname) {
//         console.log("[+] 加载库: " + libname);
//         var result = this.loadLibrary(libname);
        
//         if (libname.includes("krwjioq")) {
//             console.log("[+] 目标库已加载，开始分析...");
//             setTimeout(function() {
//                 waitForLibraryAndAnalyze();
//             }, 500);
//         }
        
//         return result;
//     };
    
//     // Hook System.load
//     System.load.overload('java.lang.String').implementation = function(libpath) {
//         console.log("[+] 加载路径: " + libpath);
//         var result = this.load(libpath);
        
//         if (libpath.includes("krwjioq")) {
//             console.log("[+] 目标库已加载，开始分析...");
//             setTimeout(function() {
//                 waitForLibraryAndAnalyze();
//             }, 500);
//         }
        
//         return result;
//     };
// });

// // 方法3: 监听模块加载事件
// Process.setExceptionHandler(function(details) {
//     console.log("[!] 异常: " + details.message);
//     return false;
// });

// // 检查所有已加载的模块
// console.log("[+] 当前已加载的模块:");
// Process.enumerateModules().forEach(function(module) {
//     if (module.name.includes("krwjioq")) {
//         console.log("[+] 发现目标模块: " + module.name + " @ " + module.base);
//         waitForLibraryAndAnalyze();
//     }
//     console.log("  " + module.name + " @ " + module.base);
// });