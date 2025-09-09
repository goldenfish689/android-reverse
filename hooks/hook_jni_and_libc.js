/**
 * HOOk 关键的libc, JNI,Java函数，梳理梳理核心逻辑
 *  脚本中的so可以任意替换。
 * 
 * */
 

const SO_NAME = 'libvpnmox.so';  

Java.perform(function() {
	
	Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
		onEnter: function(args) {
			this.path = args[0].readUtf8String();
			if (this.path && this.path.includes(SO_NAME)) {
				console.log("\n--------------------------------" +SO_NAME + " loading");
			}
		},
		onLeave: function(retval) { // 确保在so加载后执行hook
			if (this.path && this.path.includes(SO_NAME)) {
				console.log("\n--------------------------------" +SO_NAME + " loaded");
				hook_libc_functions();
				hook_jni_functions();
				hook_Java_functions();
			}
		}
	});
});

// HOOK 对libc库函数的调用	
function hook_libc_functions() {

	var targetModule = Process.getModuleByName(SO_NAME);
	var commonFunctions = [
		"malloc", 
		"free", 
		"memcpy", 
		"memmove",
		"memset",
		"strlen", 
		"strcpy",
		"strncpy", 
		"strcmp",
		"strstr",
		"printf",
		"sprintf",
		"snprintf",
		"fopen", 
		"fclose",
		"fread", 
		"fwrite" 
		// 根据业务需求，这里后面还可以添加其他libc库函数
	];
	
	
	commonFunctions.forEach(function(funcName) {
	    try {
	        var funcPtr = Module.findExportByName(null, funcName);
	        if (funcPtr) {
	            Interceptor.attach(funcPtr, {
	                onEnter: function(args) {
	                    // 检查调用是否来自目标模块
	                    var caller = this.returnAddress;
	                    if (caller.compare(targetModule.base) >= 0 && 
	                        caller.compare(targetModule.base.add(targetModule.size)) < 0) {
	                        console.log(" [LibcHook] " + funcName + "    called ,from: " + caller);
							if(funcName.indexOf("strcmp") !== -1) {
								var str1 = ptr(args[0]).readCString();
								var str2 = ptr(args[1]).readCString();
								console.log(" strcmp      called str1: " + str1 + " str2: " + str2);
							} else if(funcName.indexOf("strstr") !== -1) {
								var str1 = ptr(args[0]).readCString();
								var str2 = ptr(args[1]).readCString();
								console.log(" strstr      called str1: " + str1 + " str2: " + str2);
							} else if(funcName.indexOf("strlen") !== -1) {
								var str1 = ptr(args[0]).readCString();
								console.log(" strlen      called str: " + str1);
							}
	                    }
	                }
	            });
	        }
	    } catch (e) {
	        // 忽略无法Hook的函数
	    }
	});
 }


// HOOK JNI调用
function hook_jni_functions() {
	// //小米8se,  /apex/com.android.runtime/lib64/libart.so
	// var libart = Process.getModuleByName("libart.so");
	// // 计算JNI函数表的SO内地址偏移
	// console.log("[*] JNI Function Table @ XXXXXXXXXXXXXXXXXXXX" + functions + " offset:" + (functions - libart.base).toString(16));
	// // 偏移量定义（适用于 小米8se, Android 10）
    // 获取当前线程的 JNIEnv 指针
    var env = Java.vm.getEnv();
    console.log("[*] JNIEnv pointer: " + env);
    // 获取 JNIEnv 的函数表指针（env->_functions）
    var functions = env.handle.readPointer();
	var jniFunctionTable = {
	    "4": "GetVersion",
	    "5": "DefineClass",
	    "6": "FindClass",
	    "7": "FromReflectedMethod",
	    "8": "FromReflectedField",
	    "9": "ToReflectedMethod",
	    "10": "GetSuperclass",
	    "11": "IsAssignableFrom",
	    "12": "ToReflectedField",
	    "13": "Throw",
	    "14": "ThrowNew",
	    "15": "ExceptionOccurred",
	    "16": "ExceptionDescribe",
	    "17": "ExceptionClear",
	    "18": "FatalError",
	    "19": "PushLocalFrame",
	    "20": "PopLocalFrame",
	    "21": "NewGlobalRef",
	    "22": "DeleteGlobalRef",
	    "23": "DeleteLocalRef",
	    "24": "IsSameObject",
	    "25": "NewLocalRef",
	    "26": "EnsureLocalCapacity",
	    "27": "AllocObject",
	    "28": "NewObject",
	    "29": "NewObjectV",
	    "30": "NewObjectA",
	    "31": "GetObjectClass",
	    "32": "IsInstanceOf",
	    "33": "GetMethodID",
	    "34": "CallObjectMethod",
	    "35": "CallObjectMethodV",
	    "36": "CallObjectMethodA",
	    "37": "CallBooleanMethod",
	    "38": "CallBooleanMethodV",
	    "39": "CallBooleanMethodA",
	    "40": "CallByteMethod",
	    "41": "CallByteMethodV",
	    "42": "CallByteMethodA",
	    "43": "CallCharMethod",
	    "44": "CallCharMethodV",
	    "45": "CallCharMethodA",
	    "46": "CallShortMethod",
	    "47": "CallShortMethodV",
	    "48": "CallShortMethodA",
	    "49": "CallIntMethod",
	    "50": "CallIntMethodV",
	    "51": "CallIntMethodA",
	    "52": "CallLongMethod",
	    "53": "CallLongMethodV",
	    "54": "CallLongMethodA",
	    "55": "CallFloatMethod",
	    "56": "CallFloatMethodV",
	    "57": "CallFloatMethodA",
	    "58": "CallDoubleMethod",
	    "59": "CallDoubleMethodV",
	    "60": "CallDoubleMethodA",
	    "61": "CallVoidMethod",
	    "62": "CallVoidMethodV",
	    "63": "CallVoidMethodA",
	    "64": "CallNonvirtualObjectMethod",
	    "65": "CallNonvirtualObjectMethodV",
	    "66": "CallNonvirtualObjectMethodA",
	    "67": "CallNonvirtualBooleanMethod",
	    "68": "CallNonvirtualBooleanMethodV",
	    "69": "CallNonvirtualBooleanMethodA",
	    "70": "CallNonvirtualByteMethod",
	    "71": "CallNonvirtualByteMethodV",
	    "72": "CallNonvirtualByteMethodA",
	    "73": "CallNonvirtualCharMethod",
	    "74": "CallNonvirtualCharMethodV",
	    "75": "CallNonvirtualCharMethodA",
	    "76": "CallNonvirtualShortMethod",
	    "77": "CallNonvirtualShortMethodV",
	    "78": "CallNonvirtualShortMethodA",
	    "79": "CallNonvirtualIntMethod",
	    "80": "CallNonvirtualIntMethodV",
	    "81": "CallNonvirtualIntMethodA",
	    "82": "CallNonvirtualLongMethod",
	    "83": "CallNonvirtualLongMethodV",
	    "84": "CallNonvirtualLongMethodA",
	    "85": "CallNonvirtualFloatMethod",
	    "86": "CallNonvirtualFloatMethodV",
	    "87": "CallNonvirtualFloatMethodA",
	    "88": "CallNonvirtualDoubleMethod",
	    "89": "CallNonvirtualDoubleMethodV",
	    "90": "CallNonvirtualDoubleMethodA",
	    "91": "CallNonvirtualVoidMethod",
	    "92": "CallNonvirtualVoidMethodV",
	    "93": "CallNonvirtualVoidMethodA",
	    "94": "GetFieldID",
	    "95": "GetObjectField",
	    "96": "GetBooleanField",
	    "97": "GetByteField",
	    "98": "GetCharField",
	    "99": "GetShortField",
	    "100": "GetIntField",
	    "101": "GetLongField",
	    "102": "GetFloatField",
	    "103": "GetDoubleField",
	    "104": "SetObjectField",
	    "105": "SetBooleanField",
	    "106": "SetByteField",
	    "107": "SetCharField",
	    "108": "SetShortField",
	    "109": "SetIntField",
	    "110": "SetLongField",
	    "111": "SetFloatField",
	    "112": "SetDoubleField",
	    "113": "GetStaticMethodID",
	    "114": "CallStaticObjectMethod",
	    "115": "CallStaticObjectMethodV",
	    "116": "CallStaticObjectMethodA",
	    "117": "CallStaticBooleanMethod",
	    "118": "CallStaticBooleanMethodV",
	    "119": "CallStaticBooleanMethodA",
	    "120": "CallStaticByteMethod",
	    "121": "CallStaticByteMethodV",
	    "122": "CallStaticByteMethodA",
	    "123": "CallStaticCharMethod",
	    "124": "CallStaticCharMethodV",
	    "125": "CallStaticCharMethodA",
	    "126": "CallStaticShortMethod",
	    "127": "CallStaticShortMethodV",
	    "128": "CallStaticShortMethodA",
	    "129": "CallStaticIntMethod",
	    "130": "CallStaticIntMethodV",
	    "131": "CallStaticIntMethodA",
	    "132": "CallStaticLongMethod",
	    "133": "CallStaticLongMethodV",
	    "134": "CallStaticLongMethodA",
	    "135": "CallStaticFloatMethod",
	    "136": "CallStaticFloatMethodV",
	    "137": "CallStaticFloatMethodA",
	    "138": "CallStaticDoubleMethod",
	    "139": "CallStaticDoubleMethodV",
	    "140": "CallStaticDoubleMethodA",
	    "141": "CallStaticVoidMethod",
	    "142": "CallStaticVoidMethodV",
	    "143": "CallStaticVoidMethodA",
	    "144": "GetStaticFieldID",
	    "145": "GetStaticObjectField",
	    "146": "GetStaticBooleanField",
	    "147": "GetStaticByteField",
	    "148": "GetStaticCharField",
	    "149": "GetStaticShortField",
	    "150": "GetStaticIntField",
	    "151": "GetStaticLongField",
	    "152": "GetStaticFloatField",
	    "153": "GetStaticDoubleField",
	    "154": "SetStaticObjectField",
	    "155": "SetStaticBooleanField",
	    "156": "SetStaticByteField",
	    "157": "SetStaticCharField",
	    "158": "SetStaticShortField",
	    "159": "SetStaticIntField",
	    "160": "SetStaticLongField",
	    "161": "SetStaticFloatField",
	    "162": "SetStaticDoubleField",
	    "163": "NewString",
	    "164": "GetStringLength",
	    "165": "GetStringChars",
	    "166": "ReleaseStringChars",
	    "167": "NewStringUTF",
	    "168": "GetStringUTFLength",
	    "169": "GetStringUTFChars",
	    "170": "ReleaseStringUTFChars",
	    "171": "GetArrayLength",
	    "172": "NewObjectArray",
	    "173": "GetObjectArrayElement",
	    "174": "SetObjectArrayElement",
	    "175": "NewBooleanArray",
	    "176": "NewByteArray",
	    "177": "NewCharArray",
	    "178": "NewShortArray",
	    "179": "NewIntArray",
	    "180": "NewLongArray",
	    "181": "NewFloatArray",
	    "182": "NewDoubleArray",
	    "183": "GetBooleanArrayElements",
	    "184": "GetByteArrayElements",
	    "185": "GetCharArrayElements",
	    "186": "GetShortArrayElements",
	    "187": "GetIntArrayElements",
	    "188": "GetLongArrayElements",
	    "189": "GetFloatArrayElements",
	    "190": "GetDoubleArrayElements",
	    "191": "ReleaseBooleanArrayElements",
	    "192": "ReleaseByteArrayElements",
	    "193": "ReleaseCharArrayElements",
	    "194": "ReleaseShortArrayElements",
	    "195": "ReleaseIntArrayElements",
	    "196": "ReleaseLongArrayElements",
	    "197": "ReleaseFloatArrayElements",
	    "198": "ReleaseDoubleArrayElements",
	    "199": "GetBooleanArrayRegion",
	    "200": "GetByteArrayRegion",
	    "201": "GetCharArrayRegion",
	    "202": "GetShortArrayRegion",
	    "203": "GetIntArrayRegion",
	    "204": "GetLongArrayRegion",
	    "205": "GetFloatArrayRegion",
	    "206": "GetDoubleArrayRegion",
	    "207": "SetBooleanArrayRegion",
	    "208": "SetByteArrayRegion",
	    "209": "SetCharArrayRegion",
	    "210": "SetShortArrayRegion",
	    "211": "SetIntArrayRegion",
	    "212": "SetLongArrayRegion",
	    "213": "SetFloatArrayRegion",
	    "214": "SetDoubleArrayRegion",
	    "215": "RegisterNatives",
	    "216": "UnregisterNatives",
	    "217": "MonitorEnter",
	    "218": "MonitorExit",
	    "219": "GetJavaVM",
	    "220": "GetStringRegion",
	    "221": "GetStringUTFRegion",
	    "222": "GetPrimitiveArrayCritical",
	    "223": "ReleasePrimitiveArrayCritical",
	    "224": "GetStringCritical",
	    "225": "ReleaseStringCritical",
	    "226": "NewWeakGlobalRef",
	    "227": "DeleteWeakGlobalRef",
	    "228": "ExceptionCheck",
	    "229": "NewDirectByteBuffer"
	}

	var targetModule = Process.getModuleByName(SO_NAME);
	Object.keys(jniFunctionTable).forEach(key => {
		var funName = jniFunctionTable[key];
		var funcPtr = functions.add(key * Process.pointerSize).readPointer();
		//console.log("\n [JNIHook]" +"    jni function key: [" + key + "] funName:" + funName + " offset:" + (funcPtr-libart.base).toString(16));
		Interceptor.attach(funcPtr, {
		   onEnter: function(args) {
			   var caller = this.returnAddress;
			   if (caller.compare(targetModule.base) >= 0 && 
			       caller.compare(targetModule.base.add(targetModule.size)) < 0) {
				   console.log("\n [JNIHook]" +"    jni function : [" + funName + "] called from:" + caller);
				   if(funName.indexOf("FindClass") !== -1) {//; art::JNI::FindClass(_JNIEnv *, char const*)
					    console.log("\n [JNIHook] FindClass:" + "      Class Name: [" + args[1].readUtf8String() + "]" + " addr:" + (args[1]-targetModule.base).toString(16) );
				   } else if(funName.indexOf("GetMethodID") !== -1) { //jmethodID GetMethodID(JNIEnv* env, jclass clazz, const char* name, const char* sig);
						var clazName = Java.vm.getEnv().getClassName(args[1]);
						console.log("\n [JNIHook] GetMethodID, " +"	Method Name: [" + args[2].readUtf8String() +"]" +"     Signature: " + args[3].readUtf8String()  + "     Class: [" + clazName + "]");
				   } else if(funName.indexOf("GetStaticMethodID") !==-1) {//jmethodID GetStaticMethodID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
					   var clazName = Java.vm.getEnv().getClassName(args[1]);
					   console.log("\n [JNIHook] GetStaticMethodID, " +"	Method Name: [" + args[2].readUtf8String() +"]" +"     Signature: " + args[3].readUtf8String()  + "     Class: [" + clazName + "]");
				   } else if(funName.indexOf("GetStaticFieldID") !== -1) { //jfieldID sdkIntField = (*env)->GetStaticFieldID(env, jclasz, "SDK_INT", "I");
						console.log("\n [JNIHook] GetStaticFieldID called");
						var clazName = Java.vm.getEnv().getClassName(args[1]);
						console.log("     Class: " + clazName);
						console.log("     Field Name: " + args[2].readUtf8String());
						console.log("     Signature: " + args[3].readUtf8String());
						this.fieldName = args[2].readUtf8String();
				   } else if(funName.indexOf("GetFieldID") !== -1) {//jfieldID GetFieldID(JNIEnv *env, jclass clazz, const char *name, const char *sig);
						console.log("\n [JNIHook] GetFieldID called");
						var clazName = Java.vm.getEnv().getClassName(args[1]);
						console.log("     Class: " + clazName);
						console.log("     Field Name: " + args[2].readUtf8String());
						console.log("     Signature: " + args[3].readUtf8String());
				   } else if(funName.indexOf("GetStaticIntField") !== -1) { //
						this.className = Java.vm.getEnv().getClassName(args[1]);
						console.log("\n [JNIHook] GetStaticIntField called  ,class:" + this.className);
				   } else if(funName.indexOf("Call") !== -1) {
					   if(funName.indexOf("CallStatic") !== -1) {
						   
					   } else {
							const env = args[0];
							const objOrClass = args[1];
							const methodID = args[2];
							try {
								// Get class from jobject or jclass
								const getObjectClassAddr =  functions.add(31 * Process.pointerSize).readPointer();//Module.findExportByName(null, "GetObjectClass");
								if (getObjectClassAddr === null) {
								   console.log("Failed to find GetObjectClass export");
								   return;
								}

								const getObjectClass = new NativeFunction(getObjectClassAddr, 'pointer', ['pointer', 'pointer']);
								const classObj = getObjectClass(env, objOrClass);

								if (classObj.isNull()) {
								   console.log(" Failed to get class object");
								   return;
								}

								// Get class name
								const javaClass = Java.use("java.lang.Class");
								const classInstance = Java.cast(ptr(classObj), javaClass);
								const className = classInstance.getName();

								// Method name retrieval is not directly possible from jmethodID, Log class name and indicate method name is unavailable
								console.log(` Call XXX MethodV called - Class Name: ${className}, Method ID: ${methodID} (Method name not directly accessible)`);
							} catch (e) {
								console.log(` Error processing CallBooleanMethodV: ${e}`);
							}
						}
				   }
			   }
		   },
		   onLeave: function(retval) {
			   if(funName.indexOf("GetObjectClass") !== -1) {
				   var claszName = Java.vm.getEnv().getClassName(retval);
				   console.log(" GetObjectClass called , class name:" + claszName);
			   } else if(funName.indexOf("GetStaticIntField") !== -1) { 
					if(this.className.indexOf("android.os.Build$VERSION") !== -1) {
						 console.log("+++ GetStaticIntField ret:" +retval.toInt32());
						 // retval.replace(33);
					}
					
			   }
		   }
		});
	});
	
};
	
	
	// HOOK 对Java层API的调用
	function hook_Java_functions() {
		 // 1. Hook PackageManager.setComponentEnabledSetting
		    var PackageManager = Java.use("android.content.pm.PackageManager");
		    PackageManager.setComponentEnabledSetting.overload('android.content.ComponentName', 'int', 'int').implementation = function (componentName, newState, flags) {
		        console.log(" [JavaHook] setComponentEnabledSetting called");
		        console.log("    Component: " + componentName.toString());
		        console.log("    New State: " + newState);
		        console.log("    Flags: " + flags);
		        // 执行原始方法
		        return this.setComponentEnabledSetting(componentName, newState, flags);
		    };
		
		    // 2. Hook ComponentName 构造函数
		    var ComponentName = Java.use("android.content.ComponentName");
		    ComponentName.$init.overload('android.content.Context', 'java.lang.String').implementation = function (context, className) {
		        console.log(" [JavaHook] ComponentName constructor called");
		        console.log("    Context package name: " + context.getPackageName());
		        console.log("    Class name: " + className);
		
		        // 执行构造函数
		        this.$init(context, className);
		    };
		
		    // 3. Hook getPackageName()
		    var Context = Java.use("android.content.Context");
		    Context.getPackageName.implementation = function () {
		        var result = this.getPackageName();
		        console.log(" [JavaHook] getPackageName called -> " + result);
		        return result;
		    };
		
		    // 4. Hook DisplayManager.createVirtualDisplay
		    var DisplayManager = Java.use("android.hardware.display.DisplayManager");
		    DisplayManager.createVirtualDisplay.overload(
		        'java.lang.String',
		        'int',
		        'int',
		        'int',
		        'android.view.Surface',
		        'int'
		    ).implementation = function (name, width, height, dpi, surface, flags) {
		        console.log(" [JavaHook] createVirtualDisplay called");
		        console.log("    Name: " + name);
		        console.log("    Width: " + width);
		        console.log("    Height: " + height);
		        console.log("    DPI: " + dpi);
		        console.log("    Flags: " + flags);
		
		        // 执行原始方法
		        var virtualDisplay = this.createVirtualDisplay(name, width, height, dpi, surface, flags);
		        console.log("    Created VirtualDisplay: " + virtualDisplay);
		        return virtualDisplay;
		    };
		
		    // 5. Hook getDisplay()
		    Context.getDisplay.implementation = function () {
		        var display = this.getDisplay();
		        if (display !== null) {
		            console.log(" [JavaHook] getDisplay called -> " + display.toString());
		        } else {
		            console.log(" [JavaHook] getDisplay returned null");
		        }
		        return display;
		    };
			// 6. Hook Intent.setClassName(Context, String)
			var Intent = Java.use("android.content.Intent");
			Intent.setClassName.overload('android.content.Context', 'java.lang.String').implementation = function (packageContext, className) {
				console.log("[*] setClassName(Context, String) called");
				console.log("    Package context: " + packageContext.getPackageName());
				console.log("    Target class name: " + className);
		
				// 执行原始方法
				return this.setClassName(packageContext, className);
			};
			//
			// 7. Hook android.os.SystemProperties.get(String, String)
			var SystemProperties = Java.use("android.os.SystemProperties");
			
			SystemProperties.get.overload('java.lang.String').implementation = function (key) {
			    console.log(" [JavaHook] SystemProperties.get(String key) called");
			    console.log("    Key: " + key);
			    // 执行原始方法并获取结果
			    var value = this.get(key);
			    console.log("    Value: " + value);
			    return value;
			};
			
			SystemProperties.get.overload('java.lang.String', 'java.lang.String').implementation = function (key, defValue) {
			    console.log(" [JavaHook] SystemProperties.get(String key, String default) called");
			    console.log("    Key: " + key);
			    console.log("    Default value: " + defValue);
			
			    var value = this.get(key, defValue);
			    console.log("    Actual value: " + value);
			
			    return value;
			};
			//
			var Activity = Java.use("android.app.Application");
			Activity.startActivity.overload("android.content.Intent").implementation = function (intent) {
				console.log("[*] startActivity(Intent) called");
		
				// 获取 Intent 信息
				var component = intent.getComponent();
				var action = intent.getAction();
				var data = intent.getData();
				if (component !== null) {
					console.log("    Component: " + component.getClassName());
				} else {
					console.log("    Component: <none>");
				}
				console.log("    Action:    " + (action ? action : "<none>"));
				console.log("    Data:      " + (data ? data.toString() : "<none>"));
				// 继续执行原始方法
				this.startActivity(intent);
			};
	
		
	}